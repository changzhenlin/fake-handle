import React, { useState, useEffect } from 'react';
import { CharResult, ColorState, PinyinPart } from '../../types';

const colorMap: Record<ColorState, string> = {
  correct: '#27AE60',
  present: '#E67E22',
  absent: '#7F8C8D'
};

interface GuessCellProps {
  char?: string;
  pinyin?: PinyinPart;
  result?: CharResult;
  isEmpty?: boolean;
  isNew?: boolean;
  isWrong?: boolean;
}

const cellStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '72px',
  height: '80px',
  borderRadius: '8px',
  backgroundColor: '#F8F9FA',
  border: '2px solid #E8E8E8',
  transition: 'all 0.3s ease'
};

const emptyCellStyle: React.CSSProperties = {
  ...cellStyle,
  backgroundColor: '#FFFFFF',
  border: '2px dashed #E0E0E0'
};

const pinyinContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '4px'
};

const toneStyle: React.CSSProperties = {
  fontSize: '48px',
  height: '24px',
  lineHeight: '24px',
  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  fontWeight: 'bold',
  marginBottom: '-12px'
};

const pinyinRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '11px',
  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  letterSpacing: '0.5px'
};

const charStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 'bold',
  fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif'
};

const toneMap: Record<number, string> = {
  1: '¯',
  2: 'ˊ',
  3: 'ˇ',
  4: 'ˋ'
};

function extractInitial(pinyin: string): string {
  const initials = ['zh', 'ch', 'sh', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'r', 'z', 'c', 's', 'y', 'w'];
  const lower = pinyin.toLowerCase();
  for (const init of initials) {
    if (lower.startsWith(init)) {
      return init;
    }
  }
  return '';
}

function extractFinal(pinyin: string, initial: string): string {
  const lower = pinyin.toLowerCase();
  if (initial && lower.startsWith(initial)) {
    return lower.substring(initial.length);
  }
  return lower;
}

export function GuessCell({ char, pinyin, result, isEmpty, isNew, isWrong }: GuessCellProps) {
  const [shouldShake, setShouldShake] = useState(false);
  const [shouldFadeIn, setShouldFadeIn] = useState(false);

  useEffect(() => {
    if (isNew) {
      setShouldFadeIn(true);
      const timer = setTimeout(() => setShouldFadeIn(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  useEffect(() => {
    if (isWrong) {
      setShouldShake(true);
      const timer = setTimeout(() => setShouldShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isWrong]);

  const animationStyle: React.CSSProperties = {};
  if (shouldShake) {
    animationStyle.animation = 'shake 0.5s';
  }
  if (shouldFadeIn) {
    animationStyle.animation = 'fadeIn 0.5s ease-in';
  }

  if (isEmpty) {
    return <div style={emptyCellStyle} />;
  }

  const charColor = result ? colorMap[result.char] : '#2C3E50';
  const initialColor = result ? colorMap[result.initial] : '#7F8C8D';
  const finalColor = result ? colorMap[result.final] : '#7F8C8D';
  const toneColor = result ? colorMap[result.tone] : '#7F8C8D';

  const fullPinyin = pinyin?.full || '';
  const initial = pinyin?.initial || extractInitial(fullPinyin);
  const finalPart = pinyin?.final || extractFinal(fullPinyin, initial);
  const tone = pinyin?.tone || 0;
  const toneSymbol = toneMap[tone] || '';

  return (
    <div style={{ ...cellStyle, ...animationStyle }}>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={pinyinContainerStyle}>
        <div style={{ ...toneStyle, color: toneColor }}>
          {toneSymbol}
        </div>
        <div style={pinyinRowStyle}>
          <span style={{ color: initialColor }}>{initial}</span>
          <span style={{ color: finalColor }}>{finalPart}</span>
        </div>
      </div>
      <div style={{ ...charStyle, color: charColor }}>{char}</div>
    </div>
  );
}
