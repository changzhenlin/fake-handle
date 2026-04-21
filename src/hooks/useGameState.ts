import { useState, useCallback, useEffect } from 'react';
import { GameState, Guess } from '../types';
import { getRandomIdiom } from '../data/idioms';
import { evaluateGuess, isWin, isValidIdiom } from '../utils/gameLogic';
import { getPinyinParts } from '../utils/pinyin';
import { fetchRandomIdiom, submitGameResult } from '../supabase/gameApi';

const MAX_CHANCES = 10;
const MAX_HINTS = 3;

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => initFallbackGame());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadRemoteIdiom() {
      try {
        const remoteIdiom = await fetchRandomIdiom();
        if (!cancelled && remoteIdiom) {
          setGameState(prev => ({
            ...prev,
            targetIdiom: remoteIdiom,
          }));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    loadRemoteIdiom();
    return () => { cancelled = true; };
  }, []);

  function initFallbackGame(): GameState {
    return {
      targetIdiom: getRandomIdiom(),
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

    const usedPositions = gameState.hints.map(h => h.position);
    const availablePositions = [0, 1, 2, 3].filter(pos => !usedPositions.includes(pos));
    if (availablePositions.length === 0) {
      hintPosition = Math.floor(Math.random() * 4);
    } else {
      hintPosition = availablePositions[Math.floor(Math.random() * availablePositions.length)];
    }

    if (hintsUsed === 0) {
      hintType = 'pinyin';
      hintContent = gameState.targetIdiom.pinyin[hintPosition];
    } else if (hintsUsed === 1) {
      hintType = 'position';
      hintContent = `第${hintPosition + 1}个位置的拼音是：${gameState.targetIdiom.pinyin[hintPosition]}`;
    } else {
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
    setIsLoading(true);
    let cancelled = false;

    async function load() {
      try {
        const remoteIdiom = await fetchRandomIdiom();
        if (!cancelled) {
          setGameState({
            targetIdiom: remoteIdiom || getRandomIdiom(),
            guesses: [],
            remainingChances: MAX_CHANCES,
            gameStatus: 'playing',
            hintsUsed: 0,
            hintsRemaining: MAX_HINTS,
            startTime: Date.now(),
            endTime: null,
            hints: []
          });
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const saveResult = useCallback(async (playerName: string): Promise<void> => {
    if (gameState.gameStatus === 'playing' || !gameState.targetIdiom) return;

    const durationMs = gameState.endTime && gameState.startTime
      ? gameState.endTime - gameState.startTime
      : null;

    await submitGameResult({
      playerName,
      targetIdiom: gameState.targetIdiom.text,
      guesses: gameState.guesses.map(g => ({
        text: g.text,
        result: g.result,
      })),
      result: gameState.gameStatus,
      hintsUsed: gameState.hintsUsed,
      durationMs,
    });
  }, [gameState]);

  return {
    gameState,
    isLoading,
    submitGuess,
    getHint,
    resetGame,
    saveResult,
    isValidIdiom
  };
}
