export class RoundManager {
  static get PHASES() {
    return ['lobby', 'early', 'mid', 'final', 'sudden_death', 'ended'];
  }

  static get ROUND_CONFIG() {
    return {
      1: { difficulty: "easy",   attacksAllowed: true, tokenReward: 2 },
      2: { difficulty: "easy",   attacksAllowed: true, tokenReward: 2 },
      3: { difficulty: "medium", attacksAllowed: true,  tokenReward: 3 },
      4: { difficulty: "medium", attacksAllowed: true,  tokenReward: 3 },
      5: { difficulty: "hard",   attacksAllowed: true,  tokenReward: 4 },
      6: { difficulty: "hard",   attacksAllowed: true,  tokenReward: 4 },
      7: { difficulty: "hard",   attacksAllowed: true,  tokenReward: 5 }
    };
  }

  static getNextPhase(currentPhase) {
    const idx = this.PHASES.indexOf(currentPhase);
    if (idx !== -1 && idx < this.PHASES.length - 1) {
      return this.PHASES[idx + 1];
    }
    return currentPhase;
  }

  static determinePhaseFromRound(round) {
    if (round <= 2) return "early";
    if (round <= 4) return "mid";
    if (round <= 7) return "final";
    return "ended";
  }

  static getConfigForRound(round) {
    return this.ROUND_CONFIG[round] || this.ROUND_CONFIG[7];
  }
}
