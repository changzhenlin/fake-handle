import { useState, useCallback } from 'react';
import { GameState, Guess } from '../types';
import { getRandomIdiom } from '../data/idioms';
import { evaluateGuess, isWin, isValidIdiom } from '../utils/gameLogic';
import { getPinyinParts } from '../utils/pinyin';

const MAX_CHANCES = 10;
const MAX_HINTS = 3;

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => initGame());

  function initGame(): GameState {
    const targetIdiom = getRandomIdiom();
    return {
      targetIdiom,
      guesses: [],
      remainingChances: MAX_CHANCES,
      gameStatus: 'playing',
      hintsUsed: 0,
      hintsRemaining: MAX_HINTS,
      startTime: Date.now(),
      endTime: null,
      hints: []
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
    const gameOver = won || lost;

    setGameState(prev => ({
      ...prev,
      guesses: newGuesses,
      remainingChances,
      gameStatus: won ? 'won' : lost ? 'lost' : 'playing',
      endTime: gameOver ? Date.now() : null
    }));

    return { success: true, message: '' };
  }, [gameState]);

  const getHint = useCallback((): { success: boolean; message: string; hint?: any } => {
    if (gameState.gameStatus !== 'playing') {
      return { success: false, message: '游戏已结束' };
    }

    if (gameState.hintsRemaining <= 0) {
      return { success: false, message: '提示次数已用完' };
    }

    if (!gameState.targetIdiom) {
      return { success: false, message: '游戏未正确初始化' };
    }

    const hintsUsed = gameState.hintsUsed;
    let hintType: 'pinyin' | 'position' | 'character' = 'pinyin';
    let hintContent = '';
    let hintPosition = 0;

    // 随机选择一个未被提示过的位置
    const usedPositions = gameState.hints.map(h => h.position);
    const availablePositions = [0, 1, 2, 3].filter(pos => !usedPositions.includes(pos));
    if (availablePositions.length === 0) {
      // 如果所有位置都被提示过，随机选择一个
      hintPosition = Math.floor(Math.random() * 4);
    } else {
      hintPosition = availablePositions[Math.floor(Math.random() * availablePositions.length)];
    }

    if (hintsUsed === 0) {
      // 第一次提示：拼音
      hintType = 'pinyin';
      hintContent = gameState.targetIdiom.pinyin[hintPosition];
    } else if (hintsUsed === 1) {
      // 第二次提示：拼音所在的位置
      hintType = 'position';
      hintContent = `第${hintPosition + 1}个位置的拼音是：${gameState.targetIdiom.pinyin[hintPosition]}`;
    } else {
      // 第三次提示：一个汉字
      hintType = 'character';
      hintContent = gameState.targetIdiom.text[hintPosition];
    }

    const newHint = {
      type: hintType,
      content: hintContent,
      position: hintPosition
    };

    setGameState(prev => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1,
      hintsRemaining: prev.hintsRemaining - 1,
      hints: [...prev.hints, newHint]
    }));

    return { success: true, message: '获得提示', hint: newHint };
  }, [gameState]);

  const resetGame = useCallback(() => {
    setGameState(initGame());
  }, []);

  return {
    gameState,
    submitGuess,
    getHint,
    resetGame,
    isValidIdiom
  };
}
