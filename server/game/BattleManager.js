import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.join(__dirname, '..', 'game-config.json');
const gameConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

export class BattleManager {
  static get CONFIG() {
    return gameConfig;
  }

  static get COSTS() {
    return gameConfig.costs;
  }

  static createAttack(fromTeamId, targetTeamId, puzzleId) {
    const defenseMs = (gameConfig.timers.DEFENSE_SECONDS || 60) * 1000;
    return {
      id: uuidv4(),
      fromTeam: fromTeamId,
      toTeam: targetTeamId,
      defPuzzleId: puzzleId,
      deadline: Date.now() + defenseMs
    };
  }

  static isDefending(pendingAttacks, teamId) {
    return pendingAttacks.some(a => a.toTeam === teamId);
  }

  static validateAttack(team, targetTeam, pendingAttacks, attacksAllowed, safeZoneActive) {
    if (!attacksAllowed) return { valid: false, error: "Attacks not allowed in this round" };
    if (safeZoneActive) return { valid: false, error: "Safe zone is active" };
    if (team.tokens < this.COSTS.ATTACK) return { valid: false, error: "Not enough tokens" };
    if (!targetTeam || targetTeam.status === 'eliminated') return { valid: false, error: "Target eliminated or invalid" };
    if (this.isDefending(pendingAttacks, team.id)) return { valid: false, error: "Cannot attack while defending" };
    if (this.isDefending(pendingAttacks, targetTeam.id)) return { valid: false, error: "Target is already defending an attack" };
    
    return { valid: true };
  }
}
