import React, { useState, useRef, useEffect } from 'react';

interface InputAreaProps {
  onSubmit: (input: string) => { success: boolean; message: string };
  remainingChances: number;
  disabled: boolean;
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  backgroundColor: '#F8F9FA',
  borderRadius: '12px',
  maxWidth: '500px',
  margin: '0 auto'
};

const inputStyle: React.CSSProperties = {
  width: '240px',
  height: '56px',
  fontSize: '28px',
  textAlign: 'center',
  border: '2px solid #E0E0E0',
  borderRadius: '8px',
  outline: 'none',
  fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif',
  transition: 'border-color 0.2s',
  marginBottom: '16px'
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

export function InputArea({ onSubmit, remainingChances, disabled }: InputAreaProps) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const result = onSubmit(inputValue.trim());
    
    if (!result.success) {
      setError(result.message);
    } else {
      setInputValue('');
      inputRef.current?.focus();
    }
  };

  const isComplete = inputValue.trim().length === 4;
  const isDisabled = disabled || remainingChances === 0;

  return (
    <div style={containerStyle}>
      <div style={infoStyle}>剩余机会：{remainingChances}/10</div>
      
      <div style={errorStyle}>{error}</div>
      
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        style={{
          ...inputStyle,
          borderColor: inputValue ? '#3498DB' : '#E0E0E0'
        }}
        disabled={isDisabled}
        maxLength={4}
      />
      
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
