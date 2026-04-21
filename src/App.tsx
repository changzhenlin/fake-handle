import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header/Header';
import { RuleGuide } from './components/RuleGuide/RuleGuide';
import { GuessGrid } from './components/GuessGrid/GuessGrid';
import { InputArea } from './components/InputArea/InputArea';
import { GameModal } from './components/Modal/GameModal';
import { useGameState } from './hooks/useGameState';

function launchConfetti() {
  const end = Date.now() + 3000;
  const colors = ['#ff6b6b', '#ffd166', '#06d6a0', '#4dabf7', '#c77dff', '#ff85a1'];

  function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }

  frame();
}

const appStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #f8fbff 0%, #f4f6fb 100%)',
  fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif'
};

const mainStyle: React.CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '0 20px 40px'
};

const dividerStyle: React.CSSProperties = {
  height: '1px',
  backgroundColor: '#dfe6ef',
  margin: '24px 0'
};

function App() {
  const { gameState, isLoading, submitGuess, getHint, resetGame, saveResult } = useGameState();
  const [showRules, setShowRules] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState<string>('');

  const handlePlayAgain = () => {
    resetGame();
    setShowRules(false);
    setShowHint(false);
    setCurrentHint('');
  };

  const toggleRules = () => {
    setShowRules(!showRules);
  };

  const handleGetHint = () => {
    const result = getHint();
    if (result.success) {
      setCurrentHint(result.hint.content);
      setShowHint(true);
      // 3秒后自动隐藏提示
      setTimeout(() => setShowHint(false), 3000);
    }
  };

  const showModal = gameState.gameStatus === 'won' || gameState.gameStatus === 'lost';
  
  useEffect(() => {
    if (gameState.gameStatus === 'won') {
      launchConfetti();
    }
  }, [gameState.gameStatus]);

  // 计算游戏时间
  const getGameTime = () => {
    if (!gameState.endTime) return '0秒';
    const seconds = Math.floor((gameState.endTime - gameState.startTime) / 1000);
    return `${seconds}秒`;
  };

  return (
    <div style={appStyle}>
      <Header />

      <main style={mainStyle}>
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#888', fontSize: '14px' }}>
            正在加载成语数据...
          </div>
        )}

        {!isLoading && (
          <>
            <div className="ui-toolbar">
              <button
                className="ui-button ui-button-primary"
                onClick={handleGetHint}
                disabled={gameState.hintsRemaining <= 0 || gameState.gameStatus !== 'playing'}
              >
                提示 ({gameState.hintsRemaining}/3)
              </button>
              <button
                className="ui-button ui-button-secondary"
                onClick={toggleRules}
              >
                {showRules ? '隐藏规则' : '显示规则'}
              </button>
            </div>

            {showHint && (
              <div className="ui-notice">
                <span className="ui-notice-label">提示</span>
                <p className="ui-notice-text">{currentHint}</p>
              </div>
            )}

            {showRules && <RuleGuide />}

            <div style={dividerStyle} />

            <GuessGrid guesses={gameState.guesses} />

            <InputArea
              onSubmit={submitGuess}
              remainingChances={gameState.remainingChances}
              disabled={gameState.gameStatus !== 'playing'}
            />
          </>
        )}
      </main>

      <GameModal
        isOpen={showModal}
        isWin={gameState.gameStatus === 'won'}
        answer={gameState.targetIdiom?.text || ''}
        onPlayAgain={handlePlayAgain}
        onSaveResult={saveResult}
        gameStats={{
          time: getGameTime(),
          hintsUsed: gameState.hintsUsed,
          attempts: gameState.guesses.length
        }}
      />
    </div>
  );
}

export default App;
