import React, { useState, useRef, useEffect } from 'react';

interface InputAreaProps {
  onSubmit: (input: string) => { success: boolean; message: string };
  remainingChances: number;
  disabled: boolean;
}

const CELL_SIZE = 72;
const CELL_GAP = 8;
const INPUT_WIDTH = CELL_SIZE * 4 + CELL_GAP * 3;

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  backgroundColor: '#ffffff',
  borderRadius: '20px',
  border: '1px solid #dfe6ef',
  boxShadow: '0 10px 30px rgba(31, 42, 55, 0.06)',
  maxWidth: '500px',
  margin: '0 auto'
};

const infoStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#7F8C8D',
  marginBottom: '12px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif'
};

const errorStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#E74C3C',
  marginBottom: '12px',
  minHeight: '18px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif'
};

const gridShellStyle: React.CSSProperties = {
  position: 'relative',
  width: `${INPUT_WIDTH}px`,
  height: '80px',
  marginBottom: '16px'
};

const cellsRowStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  gap: `${CELL_GAP}px`,
  pointerEvents: 'none'
};

const charsRowStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  gap: `${CELL_GAP}px`,
  pointerEvents: 'none',
  zIndex: 2
};

const cellStyle: React.CSSProperties = {
  flex: `0 0 ${CELL_SIZE}px`,
  height: '80px',
  borderRadius: '8px',
  backgroundColor: '#f8fafc',
  border: '2px dashed #d7dee7',
  boxSizing: 'border-box',
  transition: 'all 0.2s ease'
};

const inputStyle: React.CSSProperties = {
  position: 'relative',
  zIndex: 1,
  width: '100%',
  height: '100%',
  border: 'none',
  background: 'transparent',
  outline: 'none',
  padding: '0 16px',
  fontSize: '28px',
  lineHeight: '80px',
  letterSpacing: '0',
  color: 'transparent',
  textAlign: 'left',
  fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif',
  caretColor: '#3498db',
  boxSizing: 'border-box'
};

const charDisplayStyle: React.CSSProperties = {
  flex: `0 0 ${CELL_SIZE}px`,
  height: '80px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#2c3e50',
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

const disabledButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#BDC3C7',
  cursor: 'not-allowed'
};

function normalizeInput(value: string) {
  return Array.from(value.replace(/\s/g, ''))
    .filter(char => /[\u4e00-\u9fff]/.test(char))
    .slice(0, 4)
    .join('');
}

export function InputArea({ onSubmit, remainingChances, disabled }: InputAreaProps) {
  const [rawValue, setRawValue] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setRawValue(e.target.value);
  };

  const handleSubmit = () => {
    const result = onSubmit(normalizeInput(rawValue).trim());

    if (!result.success) {
      setError(result.message);
      return;
    }

    setRawValue('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isNativeComposing = (e.nativeEvent as KeyboardEvent).isComposing;
    if (e.key === 'Enter' && !isNativeComposing) {
      handleSubmit();
    }
  };

  const visibleValue = normalizeInput(rawValue);
  const isComplete = visibleValue.length === 4;
  const isDisabled = disabled || remainingChances === 0;
  const chars = visibleValue.split('');

  return (
    <div style={containerStyle}>
      <div style={infoStyle}>剩余机会：{remainingChances}/10</div>
      <div style={errorStyle}>{error}</div>

      <div style={gridShellStyle}>
        <div style={cellsRowStyle}>
          {[0, 1, 2, 3].map(index => {
            const hasValue = Boolean(chars[index]);
            const isActive = !isDisabled && index === chars.length;

            return (
              <div
                key={index}
                style={{
                  ...cellStyle,
                  borderStyle: hasValue ? 'solid' : 'dashed',
                  borderColor: hasValue ? '#aac1dd' : isActive ? '#3498db' : '#d7dee7',
                  backgroundColor: hasValue ? '#f7fbff' : '#f8fafc',
                  boxShadow: isActive ? '0 0 0 3px rgba(52, 152, 219, 0.14)' : 'none'
                }}
              />
            );
          })}
        </div>

        <div style={charsRowStyle}>
          {[0, 1, 2, 3].map(index => (
            <div key={index} style={charDisplayStyle}>
              {chars[index] || ''}
            </div>
          ))}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={rawValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          style={inputStyle}
          disabled={isDisabled}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      <button
        style={isDisabled || !isComplete ? disabledButtonStyle : buttonStyle}
        onClick={handleSubmit}
        disabled={isDisabled || !isComplete}
        onMouseEnter={e => {
          if (!isDisabled && isComplete) {
            (e.target as HTMLButtonElement).style.backgroundColor = '#2980B9';
          }
        }}
        onMouseLeave={e => {
          if (!isDisabled && isComplete) {
            (e.target as HTMLButtonElement).style.backgroundColor = '#3498DB';
          }
        }}
      >
        提交猜测
      </button>
    </div>
  );
}
