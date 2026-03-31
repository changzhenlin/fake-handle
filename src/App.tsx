import React, { useState, useEffect } from 'react';
import { Header } from './components/Header/Header';
import { RuleGuide } from './components/RuleGuide/RuleGuide';
import { GuessGrid } from './components/GuessGrid/GuessGrid';
import { InputArea } from './components/InputArea/InputArea';
import { GameModal } from './components/Modal/GameModal';
import { useGameState } from './hooks/useGameState';

function Fireworks() {
  const bursts = Array.from({ length: 6 }, (_, burstIndex) => {
    const x = 14 + Math.random() * 72;
    const y = 16 + Math.random() * 34;
    const delay = burstIndex * 0.45 + Math.random() * 0.2;
    const colors = [
      '#ff6b6b',
      '#ffd166',
      '#06d6a0',
      '#4dabf7',
      '#c77dff',
      '#ff85a1'
    ];

    const particles = Array.from({ length: 18 }, (_, particleIndex) => {
      const angle = (Math.PI * 2 * particleIndex) / 18 + Math.random() * 0.18;
      const distance = 48 + Math.random() * 42;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;
      const size = 4 + Math.random() * 4;
      const duration = 1.2 + Math.random() * 0.45;
      const color = colors[(particleIndex + burstIndex) % colors.length];

      return {
        dx,
        dy,
        size,
        duration,
        color,
        delay: delay + 0.28 + Math.random() * 0.12
      };
    });

    return { x, y, delay, particles };
  });

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 9999
  };

  const burstStyle: React.CSSProperties = {
    position: 'absolute',
    width: 0,
    height: 0
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes firework-launch {
          0% {
            transform: translate(-50%, 120px) scaleY(0.2);
            opacity: 0;
          }
          20% {
            opacity: 0.95;
          }
          100% {
            transform: translate(-50%, 0) scaleY(1);
            opacity: 0;
          }
        }

        @keyframes firework-core {
          0% {
            transform: translate(-50%, -50%) scale(0.15);
            opacity: 0;
          }
          22% {
            opacity: 1;
          }
          55% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(0.2);
            opacity: 0;
          }
        }

        @keyframes firework-ring {
          0% {
            transform: translate(-50%, -50%) scale(0.2);
            opacity: 0;
          }
          30% {
            opacity: 0.65;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.8);
            opacity: 0;
          }
        }

        @keyframes firework-particle {
          0% {
            transform: translate(0, 0) scale(0.2);
            opacity: 0;
          }
          18% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--dx), var(--dy)) scale(0.1);
            opacity: 0;
          }
        }
      `}</style>
      {bursts.map((burst, burstIndex) => (
        <div
          key={burstIndex}
          style={{
            ...burstStyle,
            left: `${burst.x}%`,
            top: `${burst.y}%`
          }}
        >
          <span
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 0,
              width: '4px',
              height: '120px',
              borderRadius: '999px',
              background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,214,102,0.95) 55%, rgba(255,107,107,0.55) 100%)',
              transformOrigin: 'center bottom',
              animation: `firework-launch 0.55s ${burst.delay}s ease-out forwards`
            }}
          />

          <span
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.98) 0%, rgba(255,240,190,0.9) 42%, rgba(255,255,255,0) 72%)',
              animation: `firework-core 1s ${burst.delay + 0.22}s ease-out forwards`
            }}
          />

          <span
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              border: '2px solid rgba(255, 241, 199, 0.75)',
              animation: `firework-ring 0.9s ${burst.delay + 0.22}s ease-out forwards`
            }}
          />

          {burst.particles.map((particle, particleIndex) => (
            <span
              key={particleIndex}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: `${particle.size}px`,
                height: `${particle.size * 1.8}px`,
                borderRadius: '999px',
                background: `linear-gradient(180deg, #ffffff 0%, ${particle.color} 55%, rgba(255,255,255,0) 100%)`,
                boxShadow: `0 0 12px ${particle.color}`,
                transformOrigin: 'center center',
                '--dx': `${particle.dx}px`,
                '--dy': `${particle.dy}px`,
                animation: `firework-particle ${particle.duration}s ${particle.delay}s cubic-bezier(0.12, 0.8, 0.24, 1) forwards`
              } as React.CSSProperties & Record<'--dx' | '--dy', string>}
            />
          ))}
        </div>
      ))}
    </div>
  );
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
  const { gameState, submitGuess, getHint, resetGame } = useGameState();
  const [showRules, setShowRules] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState<string>('');

  const handlePlayAgain = () => {
    resetGame();
    setShowRules(false);
    setShowFireworks(false);
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
      setShowFireworks(true);
      const timer = setTimeout(() => setShowFireworks(false), 5000);
      return () => clearTimeout(timer);
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
      {showFireworks && (
        <Fireworks />
      )}
      <Header />
      
      <main style={mainStyle}>
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
      </main>

      <GameModal
        isOpen={showModal}
        isWin={gameState.gameStatus === 'won'}
        answer={gameState.targetIdiom?.text || ''}
        onPlayAgain={handlePlayAgain}
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
