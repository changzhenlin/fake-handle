import React from 'react';
import { Guess } from '../../types';
import { GuessCell } from './GuessCell';

interface GuessRowProps {
  guess?: Guess;
  isNew?: boolean;
  isWrong?: boolean;
}

const rowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  justifyContent: 'center',
  marginBottom: '8px'
};

function GuessRow({ guess, isNew, isWrong }: GuessRowProps) {
  if (!guess) {
    return (
      <div style={rowStyle}>
        {[0, 1, 2, 3].map(i => (
          <GuessCell key={i} isEmpty />
        ))}
      </div>
    );
  }

  const chars = guess.text.split('');

  return (
    <div style={rowStyle}>
      {chars.map((char, index) => (
        <GuessCell
          key={index}
          char={char}
          pinyin={guess.pinyin[index]}
          result={guess.result[index]}
          isNew={isNew}
          isWrong={isWrong}
        />
      ))}
    </div>
  );
}

interface GuessGridProps {
  guesses: Guess[];
}

const gridStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px 0'
};

export function GuessGrid({ guesses }: GuessGridProps) {
  const rows = [];
  
  for (let i = 0; i < guesses.length; i++) {
    const isNew = i === guesses.length - 1;
    const isCorrect = guesses[i].result.every(r => r.char === 'correct');
    const isWrong = isNew && !isCorrect;
    rows.push(
      <GuessRow key={i} guess={guesses[i]} isNew={isNew} isWrong={isWrong} />
    );
  }

  return <div style={gridStyle}>{rows}</div>;
}
