import React, { useState, useEffect } from 'react';
import { Header } from './components/Header/Header';
import { RuleGuide } from './components/RuleGuide/RuleGuide';
import { GuessGrid } from './components/GuessGrid/GuessGrid';
import { InputArea } from './components/InputArea/InputArea';
import { GameModal } from './components/Modal/GameModal';
import { useGameState } from './hooks/useGameState';

function Fireworks() {
  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 9999
  };

  const fireworkStyle: React.CSSProperties = {
    position: 'absolute',
    width: '10px',
    height: '10px',
    borderRadius: '50%'
  };

  const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3', '#FF69B4'];

  const fireworks = [];
  for (let i = 0; i < 50; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const delay = Math.random() * 2;
    const size = 8 + Math.random() * 12;

    fireworks.push(
      <div
        key={i}
        style={{
          ...fireworkStyle,
          left: `${x}%`,
          top: `${y}%`,
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color,
          animation: `firework 2s ${delay}s ease-out forwards`
        }}
      />
    );
  }

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes firework {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.8;
          }
          100% {
            transform: scale(0);
            opacity: 0;
          }
        }
      `}</style>
      {fireworks}
    </div>
  );
}

const appStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#FFFFFF',
  fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif'
};

const mainStyle: React.CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '0 20px 40px'
};

const dividerStyle: React.CSSProperties = {
  height: '1px',
  backgroundColor: '#E8E8E8',
  margin: '20px 0'
};

const ruleButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  fontSize: '14px',
  color: '#3498DB',
  backgroundColor: 'transparent',
  border: '1px solid #3498DB',
  borderRadius: '6px',
  cursor: 'pointer',
  marginBottom: '20px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif',
  transition: 'all 0.2s'
};

function App() {
  const { gameState, submitGuess, resetGame } = useGameState();
  const [showRules, setShowRules] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  const handlePlayAgain = () => {
    resetGame();
    setShowRules(false);
    setShowFireworks(false);
  };

  const toggleRules = () => {
    setShowRules(!showRules);
  };

  const showModal = gameState.gameStatus === 'won' || gameState.gameStatus === 'lost';
  
  useEffect(() => {
    if (gameState.gameStatus === 'won') {
      setShowFireworks(true);
      const timer = setTimeout(() => setShowFireworks(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [gameState.gameStatus]);

  return (
    <div style={appStyle}>
      {showFireworks && (
        <Fireworks />
      )}
      <Header />
      
      <main style={mainStyle}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button
            style={ruleButtonStyle}
            onClick={toggleRules}
            onMouseEnter={e => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#EBF5FB';
            }}
            onMouseLeave={e => {
              (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
            }}
          >
            {showRules ? '隐藏规则' : '显示规则'}
          </button>
        </div>
        
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
      />
    </div>
  );
}

export default App;
