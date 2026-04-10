import { PuzzleManager } from './PuzzleManager.js';
import { RoundManager } from './RoundManager.js';
import { BattleManager } from './BattleManager.js';
import { broadcastState, emitToSocket } from '../utils/broadcast.js';
import { v4 as uuidv4 } from 'uuid';

function createInitialState(roomCode) {
  return {
    roomCode,
    phase: "lobby",
    round: 1,
    safeZoneActive: false,
    teams: {},
    pendingAttacks: [],
    eventLog: [],
    roundConfig: RoundManager.ROUND_CONFIG
  };
}

export class GameRoom {
  constructor(roomCode) {
    this.state = createInitialState(roomCode);
    this.io = null;
    this.puzzleManager = new PuzzleManager();
    this.defenseTimers = new Map();
  }

  setIO(io) {
    this.io = io;
  }

  addTeam(teamId, displayName, socketId) {
    if (!this.state.teams[teamId]) {
      this.state.teams[teamId] = {
        id: teamId,
        displayName,
        socketId,
        lives: 3,
        tokens: 0,
        status: "active",
        currentPuzzleIndex: 0,
        solvedPuzzleIds: [],
        tokenHistory: []
      };
      
      this._assignNextPuzzle(teamId);
      this._addToLog("neutral", `${displayName} joined the room`, [teamId]);
      this.broadcastState();
      return true;
    } else {
      // Re-join
      this.state.teams[teamId].socketId = socketId;
      this.broadcastState();
      return true;
    }
  }

  submitAnswer(teamId, puzzleId, answer) {
    const team = this.state.teams[teamId];
    if (!team || team.status !== "active") return { correct: false, tokensEarned: 0 };
    if (this.state.phase === 'ended') {
       return { correct: false, tokensEarned: 0 };
    }

    const { correct, tokenReward } = this.puzzleManager.validateAnswer(puzzleId, answer);
    
    if (correct) {
      if (this.state.phase === 'sudden_death') {
        this._addToLog("solve", `${team.displayName} SOLVED FINAL PUZZLE AND WON THE GAME!`, [teamId]);
        this.advancePhase('ended');
        return { correct: true, tokensEarned: 0, nextPuzzle: null };
      }

      this.grantTokens(teamId, tokenReward, "solved puzzle");
      team.solvedPuzzleIds.push(puzzleId);
      team.currentPuzzleIndex++;
      this._addToLog("solve", `${team.displayName} solved cipher (+${tokenReward} tokens)`, [teamId]);
      
      const nextPuzzle = this._assignNextPuzzle(teamId);
      this.broadcastState();
      return { correct: true, tokensEarned: tokenReward, nextPuzzle };
    }

    return { correct: false, tokensEarned: 0 };
  }

  launchAttack(fromTeamId, targetTeamId) {
    const team = this.state.teams[fromTeamId];
    const targetTeam = this.state.teams[targetTeamId];
    
    const config = RoundManager.getConfigForRound(this.state.round);
    const attacksAllowed = config.attacksAllowed;
    
    const validation = BattleManager.validateAttack(team, targetTeam, this.state.pendingAttacks, attacksAllowed, this.state.safeZoneActive);
    
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    team.tokens -= BattleManager.COSTS.ATTACK;
    team.tokenHistory.push({ timestamp: Date.now(), amount: -BattleManager.COSTS.ATTACK, reason: "launched attack" });
    
    targetTeam.status = "defending";

    const defPuzzle = this.puzzleManager.getRandomPuzzle(config.difficulty, "defense");
    const attack = BattleManager.createAttack(fromTeamId, targetTeamId, defPuzzle.id);
    this.state.pendingAttacks.push(attack);

    this._addToLog("attack", `${team.displayName} attacked ${targetTeam.displayName}`, [fromTeamId, targetTeamId]);
    this.broadcastState();

    if (targetTeam.socketId) {
      emitToSocket(this.io, targetTeam.socketId, "attack_incoming", {
        attackId: attack.id,
        fromTeam: team.displayName,
        puzzle: defPuzzle,
        deadline: attack.deadline
      });
    }

    const timer = setTimeout(() => {
      this.resolveDefenseTimeout(attack.id);
    }, 60000);
    this.defenseTimers.set(attack.id, timer);

    return { success: true, attackId: attack.id };
  }

  submitDefense(teamId, attackId, answer) {
    const attackIdx = this.state.pendingAttacks.findIndex(a => a.id === attackId);
    if (attackIdx === -1) return { correct: false };

    const attack = this.state.pendingAttacks[attackIdx];
    if (attack.toTeam !== teamId) return { correct: false };

    const team = this.state.teams[teamId];
    const { correct } = this.puzzleManager.validateAnswer(attack.defPuzzleId, answer);

    if (correct) {
      clearTimeout(this.defenseTimers.get(attackId));
      this.defenseTimers.delete(attackId);
      this.state.pendingAttacks.splice(attackIdx, 1);
      
      team.status = "active";
      
      const attacker = this.state.teams[attack.fromTeam];
      if (attacker && attacker.tokens >= 2) {
        attacker.tokens -= 2; // penalty
        attacker.tokenHistory.push({ timestamp: Date.now(), amount: -2, reason: "failed attack penalty" });
      }

      this._addToLog("success", `${team.displayName} repelled attack from ${attacker?.displayName || 'Unknown'}`, [teamId, attack.fromTeam]);
      this.broadcastState();
      
      if (team.socketId) {
        emitToSocket(this.io, team.socketId, "attack_resolved", { success: true, teamId, livesRemaining: team.lives });
      }

      return { correct: true };
    }

    return { correct: false };
  }

  resolveDefenseTimeout(attackId) {
    const attackIdx = this.state.pendingAttacks.findIndex(a => a.id === attackId);
    if (attackIdx === -1) return;

    const attack = this.state.pendingAttacks[attackIdx];
    this.state.pendingAttacks.splice(attackIdx, 1);
    this.defenseTimers.delete(attackId);

    const team = this.state.teams[attack.toTeam];
    if (team && team.status === "defending") {
      team.status = "active";
      team.lives -= 1;
      
      const attacker = this.state.teams[attack.fromTeam];
      this._addToLog("attack", `${team.displayName} lost a life to ${attacker?.displayName || 'Unknown'}'s attack`, [team.id, attack.fromTeam]);

      if (team.socketId) {
        emitToSocket(this.io, team.socketId, "attack_resolved", { success: false, teamId: team.id, livesRemaining: team.lives });
      }

      this._checkElimination(team.id);
      this.broadcastState();
    }
  }

  useTokenGamble(teamId) {
    const team = this.state.teams[teamId];
    if (!team || team.tokens < BattleManager.COSTS.GAMBLE || team.status !== "active") {
      return { success: false, error: "Cannot gamble" };
    }

    team.tokens -= BattleManager.COSTS.GAMBLE;
    team.tokenHistory.push({ timestamp: Date.now(), amount: -BattleManager.COSTS.GAMBLE, reason: "gamble init" });

    // In a real app we might await an answer, but for now we might just issue a hard puzzle, 
    // or as MVP just return a specific puzzle for the client to submit as gamble.
    // The prompt just says "submit_answer" doesn't inherently handle gamble differently unless flagged.
    // MVP: The client handles gambling via normal puzzle if needed, but let's just make `use_token_gamble` assign a gamble puzzle.
    
    // Actually, to make it simple based on constraints:
    const gamblePuzzle = this.puzzleManager.getRandomPuzzle("hard", "gamble", team.solvedPuzzleIds);
    this._addToLog("neutral", `${team.displayName} initiated a gamble`, [teamId]);
    this.broadcastState();
    return { success: true, puzzle: gamblePuzzle };
  }

  advanceRound() {
    this.state.round += 1;
    this.state.phase = RoundManager.determinePhaseFromRound(this.state.round);
    
    // Assign new puzzle to everyone
    Object.values(this.state.teams).forEach(team => {
      if (team.status !== 'eliminated') {
        this._assignNextPuzzle(team.id);
      }
    });

    this._addToLog("neutral", `Round advanced to ${this.state.round}`, []);
    this.broadcastState();
  }

  advancePhase(phaseOverride) {
    if (phaseOverride) {
      this.state.phase = phaseOverride;
    } else {
      this.state.phase = RoundManager.getNextPhase(this.state.phase);
    }
    
    this._addToLog("neutral", `Phase advanced to ${this.state.phase.toUpperCase()}`, []);

    if (this.state.phase === 'sudden_death') {
      this._handleSuddenDeath();
    }

    this.broadcastState();
  }

  _handleSuddenDeath() {
    const leaderboard = this.getLeaderboard().filter(t => t.status !== 'eliminated');
    // Eliminate all but top 2
    if (leaderboard.length > 2) {
      for (let i = 2; i < leaderboard.length; i++) {
        this.eliminateTeam(leaderboard[i].id);
      }
    }
    
    // Force both to the same puzzle
    const finalPuzzle = this.puzzleManager.getRandomPuzzle("hard", "main");
    const remaining = this.getLeaderboard().filter(t => t.status !== 'eliminated');
    remaining.forEach(t => {
      t.currentPuzzle = finalPuzzle;
    });
    this.state.pendingAttacks = []; // clear attacks
  }

  toggleSafeZone() {
    this.state.safeZoneActive = !this.state.safeZoneActive;
    this._addToLog("neutral", `Safe Zone ${this.state.safeZoneActive ? 'ACTIVATED' : 'DEACTIVATED'}`, []);
    this.broadcastState();
  }

  eliminateTeam(teamId) {
    const team = this.state.teams[teamId];
    if (team && team.status !== "eliminated") {
      team.status = "eliminated";
      team.lives = 0;
      this._addToLog("attack", `${team.displayName} HAS BEEN ELIMINATED`, [teamId]);
      this.broadcastState();
    }
  }

  grantTokens(teamId, amount, reason = "admin grant") {
    const team = this.state.teams[teamId];
    if (team) {
      team.tokens += amount;
      team.tokenHistory.push({ timestamp: Date.now(), amount, reason });
    }
  }

  getLeaderboard() {
    return Object.values(this.state.teams).sort((a, b) => b.tokens - a.tokens);
  }

  broadcastState() {
    broadcastState(this.io, this.state.roomCode, this.state);
  }

  _addToLog(type, message, teams) {
    const now = new Date();
    const ts = `[${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}]`;
    this.state.eventLog.unshift({
      id: uuidv4(),
      timestamp: Date.now(),
      type,
      message: `${ts} ${message}`,
      teams
    });
    
    if (this.state.eventLog.length > 50) this.state.eventLog.pop();
  }

  _checkElimination(teamId) {
    const team = this.state.teams[teamId];
    if (team && team.lives <= 0 && team.status !== 'eliminated') {
      this.eliminateTeam(teamId);
    }
  }

  _assignNextPuzzle(teamId) {
    const team = this.state.teams[teamId];
    const config = RoundManager.getConfigForRound(this.state.round);
    const puzzle = this.puzzleManager.getRandomPuzzle(config.difficulty, "main", team.solvedPuzzleIds);
    // Attach to team object (simplifying instead of a database)
    team.currentPuzzle = puzzle;
    return puzzle;
  }
}
