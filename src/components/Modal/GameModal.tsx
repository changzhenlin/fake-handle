import React from 'react';

interface GameStats {
  time: string;
  hintsUsed: number;
  attempts: number;
}

interface GameModalProps {
  isOpen: boolean;
  isWin: boolean;
  answer: string;
  onPlayAgain: () => void;
  gameStats: GameStats;
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};

const modalStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  padding: '32px',
  textAlign: 'center',
  maxWidth: '360px',
  width: '90%',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
};

const titleStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '16px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif'
};

const answerStyle: React.CSSProperties = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#27AE60',
  marginBottom: '24px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif'
};

const buttonStyle: React.CSSProperties = {
  padding: '12px 32px',
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#FFFFFF',
  backgroundColor: '#3498DB',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif'
};

const statsContainerStyle: React.CSSProperties = {
  marginBottom: '24px',
  padding: '16px',
  backgroundColor: '#F8F9FA',
  borderRadius: '8px',
  textAlign: 'left'
};

const statItemStyle: React.CSSProperties = {
  marginBottom: '8px',
  fontSize: '14px',
  color: '#555555',
  fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif'
};

export function GameModal({ isOpen, isWin, answer, onPlayAgain, gameStats }: GameModalProps) {
  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ ...titleStyle, color: isWin ? '#27AE60' : '#E74C3C' }}>
          {isWin ? '🎉 恭喜你猜对了！' : '😥 很遗憾，机会用完了'}
        </div>
        
        <div style={answerStyle}>
          {answer}
        </div>
        
        <div style={statsContainerStyle}>
          <div style={statItemStyle}>⏱️ 用时：{gameStats.time}</div>
          <div style={statItemStyle}>💡 提示次数：{gameStats.hintsUsed}次</div>
          <div style={statItemStyle}>🔄 尝试次数：{gameStats.attempts}次</div>
        </div>
        
        <button
          style={buttonStyle}
          onClick={onPlayAgain}
          onMouseEnter={e => {
            (e.target as HTMLButtonElement).style.backgroundColor = '#2980B9';
          }}
          onMouseLeave={e => {
            (e.target as HTMLButtonElement).style.backgroundColor = '#3498DB';
          }}
        >
          再玩一次
        </button>
      </div>
    </div>
  );
}
