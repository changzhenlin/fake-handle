import { Idiom, CharResult, ColorState, PinyinPart } from '../types';
import { parsePinyin } from './pinyin';

function evaluateChar(
  guessChar: string,
  targetChars: string[],
  position: number,
  usedPositions: Set<number>
): ColorState {
  if (guessChar === targetChars[position]) {
    usedPositions.add(position);
    return 'correct';
  }
  
  for (let i = 0; i < targetChars.length; i++) {
    if (!usedPositions.has(i) && guessChar === targetChars[i]) {
      usedPositions.add(i);
      return 'present';
    }
  }
  
  return 'absent';
}

function evaluatePart(
  guessPart: string,
  targetParts: string[],
  position: number,
  usedPositions: Set<number>
): ColorState {
  if (!guessPart) return 'absent';
  
  if (guessPart === targetParts[position]) {
    usedPositions.add(position);
    return 'correct';
  }
  
  for (let i = 0; i < targetParts.length; i++) {
    if (!usedPositions.has(i) && guessPart === targetParts[i]) {
      usedPositions.add(i);
      return 'present';
    }
  }
  
  return 'absent';
}

export function evaluateGuess(guess: string, target: Idiom): CharResult[] {
  const results: CharResult[] = [];
  const guessChars = guess.split('');
  const targetChars = target.text.split('');
  
  const guessPinyins: PinyinPart[] = guessChars.map(c => parsePinyin(c));
  const targetPinyins: PinyinPart[] = targetChars.map(c => parsePinyin(c));
  
  const charUsedPositions = new Set<number>();
  const initialUsedPositions = new Set<number>();
  const finalUsedPositions = new Set<number>();
  const toneUsedPositions = new Set<number>();
  
  const charResults: ColorState[] = [];
  for (let i = 0; i < 4; i++) {
    charResults.push(evaluateChar(guessChars[i], targetChars, i, charUsedPositions));
  }
  
  const targetInitials = targetPinyins.map(p => p.initial);
  const targetFinals = targetPinyins.map(p => p.final);
  const targetTones = targetPinyins.map(p => p.tone);
  
  const guessInitials = guessPinyins.map(p => p.initial);
  const guessFinals = guessPinyins.map(p => p.final);
  const guessTones = guessPinyins.map(p => p.tone);
  
  for (let i = 0; i < 4; i++) {
    const result: CharResult = {
      char: charResults[i],
      initial: evaluatePart(guessInitials[i], targetInitials, i, initialUsedPositions),
      final: evaluatePart(guessFinals[i], targetFinals, i, finalUsedPositions),
      tone: evaluatePart(guessTones[i].toString(), targetTones.map(t => t.toString()), i, toneUsedPositions)
    };
    results.push(result);
  }
  
  return results;
}

export function isWin(results: CharResult[]): boolean {
  return results.every(r => r.char === 'correct');
}

export function isValidChineseChar(char: string): boolean {
  return /[\u4e00-\u9fa5]/.test(char);
}

export function isValidIdiom(input: string): boolean {
  if (input.length !== 4) return false;
  for (const char of input) {
    if (!isValidChineseChar(char)) return false;
  }
  return true;
}
