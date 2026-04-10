export const puzzles = [
  // EASY PUZZLES (10 total: 5 caesar, 3 acrostic, 2 numeric)
  {
    id: "e_c_1", type: "caesar", difficulty: "easy", pool: "main",
    cipherText: "GHIHQG WKH EDVH", hint: "Shift back by 3", answer: "DEFEND THE BASE", answerAliases: ["DEFEND BASE"], theme: "Standard intercept", tokenReward: 2
  },
  {
    id: "e_c_2", type: "caesar", difficulty: "easy", pool: "main",
    cipherText: "JGNNQ", hint: "Shift back by 2", answer: "HELLO", answerAliases: ["HI"], theme: "Basic comms check", tokenReward: 2
  },
  {
    id: "e_c_3", type: "caesar", difficulty: "easy", pool: "defense",
    cipherText: "VKLHOG", hint: "Shift back by 3", answer: "SHIELD", answerAliases: ["SHIELDS"], theme: "Quick defense protocol", tokenReward: 2
  },
  {
    id: "e_n_3", type: "numeric", difficulty: "easy", pool: "main",
    cipherText: "2-1-19-5", hint: "1=A, 2=B", answer: "BASE", answerAliases: ["THE BASE"], theme: "Location check", tokenReward: 2
  },
  {
    id: "e_a_4", type: "acrostic", difficulty: "easy", pool: "main",
    cipherText: "Always Training Towards A Common Kernel", hint: "First letters", answer: "ATTACK", answerAliases: ["ATTACK BASE"], theme: "Offensive coordination", tokenReward: 2
  },
  {
    id: "e_a_1", type: "acrostic", difficulty: "easy", pool: "main",
    cipherText: "Send Help Into Enemy Lines During Siege", hint: "First letters", answer: "SHIELDS", answerAliases: ["SHIELD"], theme: "Hidden order", tokenReward: 2
  },
  {
    id: "e_a_2", type: "acrostic", difficulty: "easy", pool: "main",
    cipherText: "Bears Always Take The Ammo", hint: "First letters", answer: "BATTA", answerAliases: ["BATA"], theme: "Weapons cache drop", tokenReward: 2
  },
  {
    id: "e_a_3", type: "acrostic", difficulty: "easy", pool: "defense",
    cipherText: "Deploy Every Force Early Now, Delta", hint: "First letters", answer: "DEFEND", answerAliases: ["DEFEND NOW"], theme: "Garrison scramble", tokenReward: 2
  },
  {
    id: "e_n_1", type: "numeric", difficulty: "easy", pool: "main",
    cipherText: "1-12-16-8-1", hint: "A=1, B=2", answer: "ALPHA", answerAliases: ["TEAM ALPHA"], theme: "Squad designation", tokenReward: 2
  },
  {
    id: "e_n_2", type: "numeric", difficulty: "easy", pool: "main",
    cipherText: "7-1-13-13-1", hint: "A=1, B=2", answer: "GAMMA", answerAliases: ["TEAM GAMMA"], theme: "Squad designation", tokenReward: 2
  },

  // MEDIUM PUZZLES (10 total: 3 caesar, 3 binary, 2 acrostic, 2 sentinel)
  {
    id: "m_c_1", type: "caesar", difficulty: "medium", pool: "main",
    cipherText: "NKRRU CUXRJ", hint: "ROT6", answer: "HELLO WORLD", answerAliases: ["HELLO"], theme: "System boot check", tokenReward: 3
  },
  {
    id: "m_c_2", type: "caesar", difficulty: "medium", pool: "defense",
    cipherText: "OVTLDVYSK", hint: "ROT7", answer: "HOMEWORLD", answerAliases: ["HOME"], theme: "Evacuation protocol", tokenReward: 3
  },
  {
    id: "m_c_3", type: "caesar", difficulty: "medium", pool: "main",
    cipherText: "WTAAD LDGAS", hint: "ROT15", answer: "HELLO WORLD", answerAliases: ["HELLO"], theme: "System boot check", tokenReward: 3
  },
  {
    id: "m_b_1", type: "binary", difficulty: "medium", pool: "main",
    cipherText: "01000110 01001001 01010010 01000101", hint: "ASCII to text", answer: "FIRE", answerAliases: ["SHOOT"], theme: "Weapon systems command", tokenReward: 3
  },
  {
    id: "m_b_2", type: "binary", difficulty: "medium", pool: "main",
    cipherText: "01001000 01001111 01001100 01000100", hint: "ASCII to text", answer: "HOLD", answerAliases: ["HOLD POSITION"], theme: "Formation order", tokenReward: 3
  },
  {
    id: "m_b_3", type: "binary", difficulty: "medium", pool: "defense",
    cipherText: "01010011 01000001 01000110 01000101", hint: "ASCII to text", answer: "SAFE", answerAliases: ["SAFE ZONE"], theme: "Emergency safe word", tokenReward: 3
  },
  {
    id: "m_a_1", type: "acrostic", difficulty: "medium", pool: "main",
    cipherText: "Fissure Is Ready End", hint: "First letters", answer: "FIRE", answerAliases: ["SHOOT"], theme: "Code sequence trigger", tokenReward: 3
  },
  {
    id: "m_a_2", type: "acrostic", difficulty: "medium", pool: "main",
    cipherText: "Bring Romeo Over Without Notice", hint: "First letters", answer: "BROWN", answerAliases: [], theme: "Target designation", tokenReward: 3
  },
  {
    id: "m_s_1", type: "sentinel", difficulty: "medium", pool: "main",
    cipherText: "KXA BQQ LZZ", hint: "Remove repeating letters", answer: "A", answerAliases: [], theme: "Denoising", tokenReward: 3
  },
  {
    id: "m_s_2", type: "sentinel", difficulty: "medium", pool: "main",
    cipherText: "W1E2A3P4O5N", hint: "Remove numbers", answer: "WEAPON", answerAliases: ["WEAPONS"], theme: "Denoising", tokenReward: 3
  },

  // HARD PUZZLES (10 total: 2 caesar, 3 binary, 2 numeric, 2 sentinel, 1 acrostic)
  {
    id: "h_c_1", type: "caesar", difficulty: "hard", pool: "gamble",
    cipherText: "QEB NRFZH YOLTK CLU GRJMP", hint: "ROT23", answer: "THE QUICK BROWN FOX JUMPS", answerAliases: ["THE QUICK BROWN FOX"], theme: "Long-range comms dump", tokenReward: 6
  },
  {
    id: "h_c_2", type: "caesar", difficulty: "hard", pool: "gamble",
    cipherText: "RFC QRMPW", hint: "ROT24", answer: "THE STORY", answerAliases: ["STORY"], theme: "Classified archive", tokenReward: 6
  },
  {
    id: "h_b_1", type: "binary", difficulty: "hard", pool: "gamble",
    cipherText: "01010000 01010010 01001111 01001101 01000101 01010100 01001000 01000101 01010101 01010011", hint: "ASCII to text", answer: "PROMETHEUS", answerAliases: ["OPERATION PROMETHEUS"], theme: "Project Title", tokenReward: 6
  },
  {
    id: "h_b_2", type: "binary", difficulty: "hard", pool: "main",
    cipherText: "01000011 01011001 01010000 01001000 01000101 01010010", hint: "ASCII to text", answer: "CYPHER", answerAliases: ["CIPHER"], theme: "Core protocol", tokenReward: 6
  },
  {
    id: "h_b_3", type: "binary", difficulty: "hard", pool: "defense",
    cipherText: "01000100 01000101 01000011 01010010 01011001 01010000 01010100", hint: "ASCII to text", answer: "DECRYPT", answerAliases: ["DECRYPTION"], theme: "Emergency override", tokenReward: 6
  },
  {
    id: "h_n_1", type: "numeric", difficulty: "hard", pool: "main",
    cipherText: "15-16-5-18-1-20-9-15-14", hint: "A=1, B=2", answer: "OPERATION", answerAliases: ["OPERATIONS"], theme: "Mission code name", tokenReward: 5
  },
  {
    id: "h_n_2", type: "numeric", difficulty: "hard", pool: "main",
    cipherText: "5-14-9-7-13-1", hint: "A=1, B=2", answer: "ENIGMA", answerAliases: ["THE ENIGMA"], theme: "Target artifact", tokenReward: 5
  },
  {
    id: "h_s_1", type: "sentinel", difficulty: "hard", pool: "gamble",
    cipherText: "P*R*O*T*O*C*O*L*", hint: "Remove asterisks", answer: "PROTOCOL", answerAliases: ["PROTOCOLS"], theme: "Override", tokenReward: 6
  },
  {
    id: "h_s_2", type: "sentinel", difficulty: "hard", pool: "defense",
    cipherText: "@S#H$I%E^L&D*", hint: "Remove non-letters", answer: "SHIELD", answerAliases: ["SHIELDS"], theme: "Last line of defense", tokenReward: 5
  },
  {
    id: "h_a_1", type: "acrostic", difficulty: "hard", pool: "main",
    cipherText: "Project Requires Our Most Elite Tactical Headquarters Engine Under Siege", hint: "First letters", answer: "PROMETHEUS", answerAliases: ["OPERATION PROMETHEUS"], theme: "Classified dossier excerpt", tokenReward: 5
  }
];

export function normalize(str) {
  if (!str) return "";
  return str.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}
