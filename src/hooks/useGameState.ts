import { useState, useCallback } from 'react';
import { GameState, Guess, Idiom } from '../types';
import { getRandomIdiom } from '../data/idioms';
import { evaluateGuess, isWin, isValidIdiom } from '../utils/gameLogic';
import { getPinyinParts } from '../utils/pinyin';

const MAX_CHANCES = 10;

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => initGame());

  function initGame(): GameState {
    const targetIdiom = getRandomIdiom();
    return {
      targetIdiom,
      guesses: [],
      remainingChances: MAX_CHANCES,
      gameStatus: 'playing'
    };
  }

  const submitGuess = useCallback((input: string): { success: boolean; message: string } => {
    if (gameState.gameStatus !== 'playing') {
      return { success: false, message: '游戏已结束' };
    }

    if (!isValidIdiom(input)) {
      return { success: false, message: '请输入四个有效的汉字' };
    }

    if (!gameState.targetIdiom) {
      return { success: false, message: '游戏未正确初始化' };
    }

    const result = evaluateGuess(input, gameState.targetIdiom);
    const pinyinParts = getPinyinParts(input);

    const newGuess: Guess = {
      text: input,
      pinyin: pinyinParts,
      result
    };

    const newGuesses = [...gameState.guesses, newGuess];
    const won = isWin(result);
    const remainingChances = gameState.remainingChances - 1;
    const lost = remainingChances === 0 && !won;

    setGameState(prev => ({
      ...prev,
      guesses: newGuesses,
      remainingChances,
      gameStatus: won ? 'won' : lost ? 'lost' : 'playing'
    }));

    return { success: true, message: '' };
  }, [gameState]);

  const resetGame = useCallback(() => {
    setGameState(initGame());
  }, []);

  return {
    gameState,
    submitGuess,
    resetGame,
    isValidIdiom
  };
}
