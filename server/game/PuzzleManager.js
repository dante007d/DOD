import { puzzles, normalize } from '../data/puzzles.js';

export class PuzzleManager {
  constructor() {
    this.puzzles = puzzles;
  }

  // Gets a puzzle by ID
  getPuzzleById(id) {
    return this.puzzles.find(p => p.id === id);
  }

  // Gets a random puzzle matching criteria
  getRandomPuzzle(difficulty, pool, excludeIds = []) {
    const candidates = this.puzzles.filter(p => 
      p.difficulty === difficulty && 
      p.pool === pool && 
      !excludeIds.includes(p.id)
    );
    
    if (candidates.length === 0) {
      // Fallback if we run out (just grab any from that pool)
      const fallback = this.puzzles.filter(p => p.pool === pool);
      if (fallback.length === 0) return this.puzzles[0];
      return fallback[Math.floor(Math.random() * fallback.length)];
    }
    
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  // Validates an answer
  validateAnswer(puzzleId, submittedAnswer) {
    const puzzle = this.getPuzzleById(puzzleId);
    if (!puzzle) return { correct: false, tokenReward: 0 };

    const normSubmitted = normalize(submittedAnswer);
    const normCorrect = normalize(puzzle.answer);
    
    let isCorrect = (normSubmitted === normCorrect);

    if (!isCorrect && puzzle.answerAliases) {
      for (const alias of puzzle.answerAliases) {
        if (normalize(alias) === normSubmitted) {
          isCorrect = true;
          break;
        }
      }
    }

    return { correct: isCorrect, tokenReward: isCorrect ? puzzle.tokenReward : 0 };
  }
}
