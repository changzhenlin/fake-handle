import React, { useState, useEffect } from 'react';
import { fetchLeaderboard, LeaderboardEntry } from '../../supabase/gameApi';

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
  onSaveResult: (playerName: string) => Promise<void>;
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
  maxWidth: '420px',
  width: '90%',
  maxHeight: '85vh',
  overflowY: 'auto',
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

const secondaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#27AE60',
  marginTop: '12px'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  fontSize: '15px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  marginBottom: '12px',
  boxSizing: 'border-box',
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

const leaderboardStyle: React.CSSProperties = {
  marginTop: '24px',
  padding: '16px',
  backgroundColor: '#FFF8E1',
  borderRadius: '8px',
  textAlign: 'left'
};

const leaderboardTitleStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 'bold',
  marginBottom: '12px',
  color: '#F57C00',
  textAlign: 'center',
  fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif'
};

const leaderboardRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '8px 0',
  fontSize: '13px',
  borderBottom: '1px solid #eee',
  fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif',
  gap: '12px'
};

const rankColStyle: React.CSSProperties = {
  width: '36px',
  textAlign: 'center',
  flexShrink: 0
};

const playerColStyle: React.CSSProperties = {
  flex: 1,
  textAlign: 'center',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
};

const timeColStyle: React.CSSProperties = {
  width: '56px',
  textAlign: 'right',
  flexShrink: 0
};

const hintsColStyle: React.CSSProperties = {
  width: '40px',
  textAlign: 'right',
  flexShrink: 0
};

export function GameModal({ isOpen, isWin, answer, onPlayAgain, gameStats, onSaveResult }: GameModalProps) {
  const [playerName, setPlayerName] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSaved(false);
      setSaving(false);
      setShowLeaderboard(false);
      setLeaderboard([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    const name = playerName.trim() || '匿名玩家';
    setSaving(true);
    try {
      await onSaveResult(name);
      setSaved(true);
    } catch (e) {
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleShowLeaderboard = async () => {
    if (leaderboard.length === 0) {
      try {
        const data = await fetchLeaderboard(10);
        setLeaderboard(data);
      } catch {
        // ignore
      }
    }
    setShowLeaderboard(!showLeaderboard);
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    return `${seconds}秒`;
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ ...titleStyle, color: isWin ? '#27AE60' : '#E74C3C' }}>
          {isWin ? '恭喜你猜对了！' : '很遗憾，机会用完了'}
        </div>

        <div style={answerStyle}>
          {answer}
        </div>

        <div style={statsContainerStyle}>
          <div style={statItemStyle}>⏱️ 用时：{gameStats.time}</div>
          <div style={statItemStyle}>💡 提示次数：{gameStats.hintsUsed}次</div>
          <div style={statItemStyle}>🔄 尝试次数：{gameStats.attempts}次</div>
        </div>

        {isWin && !saved && (
          <div style={{ marginBottom: '16px' }}>
            <input
              style={inputStyle}
              type="text"
              placeholder="输入你的名字（留空则为匿名玩家）"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              maxLength={20}
            />
            <button
              style={secondaryButtonStyle}
              onClick={handleSave}
              disabled={saving}
              onMouseEnter={e => {
                if (!saving) (e.target as HTMLButtonElement).style.backgroundColor = '#1E8449';
              }}
              onMouseLeave={e => {
                (e.target as HTMLButtonElement).style.backgroundColor = '#27AE60';
              }}
            >
              {saving ? '保存中...' : '保存到排行榜'}
            </button>
          </div>
        )}

        {saved && (
          <div style={{ color: '#27AE60', fontSize: '14px', marginBottom: '12px', fontWeight: 'bold' }}>
            ✅ 已保存到排行榜
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
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

          <button
            style={{ ...buttonStyle, backgroundColor: '#9B59B6' }}
            onClick={handleShowLeaderboard}
            onMouseEnter={e => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#8E44AD';
            }}
            onMouseLeave={e => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#9B59B6';
            }}
          >
            {showLeaderboard ? '隐藏排行榜' : '查看排行榜'}
          </button>
        </div>

        {showLeaderboard && (
          <div style={leaderboardStyle}>
            <div style={leaderboardTitleStyle}>🏆 排行榜 TOP 10</div>
            {leaderboard.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#999', fontSize: '13px' }}>暂无数据</div>
            ) : (
              <>
                <div style={{ ...leaderboardRowStyle, fontWeight: 'bold', color: '#666' }}>
                  <span style={rankColStyle}>排名</span>
                  <span style={playerColStyle}>玩家</span>
                  <span style={timeColStyle}>用时</span>
                  <span style={hintsColStyle}>提示</span>
                </div>
                {leaderboard.map((entry, idx) => (
                  <div key={idx} style={leaderboardRowStyle}>
                    <span style={rankColStyle}>{idx + 1}</span>
                    <span style={playerColStyle} title={entry.player_name}>
                      {entry.player_name}
                    </span>
                    <span style={timeColStyle}>{formatDuration(entry.duration_ms)}</span>
                    <span style={hintsColStyle}>{entry.hints_used}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
