export type ColorState = 'correct' | 'present' | 'absent';

export interface PinyinPart {
  initial: string;
  final: string;
  tone: number;
  full: string;
}

export interface CharResult {
  char: ColorState;
  initial: ColorState;
  final: ColorState;
  tone: ColorState;
}

export interface Idiom {
  text: string;
  pinyin: string[];
}

export interface Guess {
  text: string;
  pinyin: PinyinPart[];
  result: CharResult[];
}

export interface GameState {
  targetIdiom: Idiom | null;
  guesses: Guess[];
  remainingChances: number;
  gameStatus: 'playing' | 'won' | 'lost';
}

export interface ExampleData {
  chars: string[];
  pinyins: string[];
  results: CharResult[];
  description: string;
}
