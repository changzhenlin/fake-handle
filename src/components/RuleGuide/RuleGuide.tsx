import React from 'react';
import { CharResult, ColorState } from '../../types';

const colorMap: Record<ColorState, string> = {
  correct: '#27AE60',
  present: '#E67E22',
  absent: '#7F8C8D'
};

interface MiniCellProps {
  char: string;
  pinyin?: string;
  result?: CharResult;
  showDetail?: boolean;
}

const cellContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '48px',
  height: '56px',
  borderRadius: '12px',
  backgroundColor: '#f8fafc',
  border: '1px solid #dfe6ef'
};

const pinyinStyle: React.CSSProperties = {
  fontSize: '10px',
  marginBottom: '2px',
  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
};

const charStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 'bold',
  fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif'
};

function MiniCell({ char, pinyin = '', result, showDetail = false }: MiniCellProps) {
  const charColor = result ? colorMap[result.char] : '#7F8C8D';
  
  return (
    <div style={cellContainerStyle}>
      {showDetail && result ? (
        <>
          <div style={pinyinStyle}>
            <span style={{ color: colorMap[result.initial] }}>{pinyin.replace(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/g, '').charAt(0)}</span>
            <span style={{ color: colorMap[result.final] }}>{pinyin.replace(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/g, '').slice(1)}</span>
          </div>
          <div style={{ ...charStyle, color: charColor }}>{char}</div>
        </>
      ) : (
        <>
          <div style={{ ...pinyinStyle, color: result ? colorMap[result.initial] : '#7F8C8D' }}>{pinyin}</div>
          <div style={{ ...charStyle, color: charColor }}>{char}</div>
        </>
      )}
    </div>
  );
}

interface ExampleCardProps {
  chars: string[];
  pinyins: string[];
  results: CharResult[];
  description: string;
  showDetail?: boolean;
}

const cardStyle: React.CSSProperties = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e1e8f0',
  borderRadius: '16px',
  padding: '16px',
  marginBottom: '14px'
};

const cellsRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  justifyContent: 'center',
  marginBottom: '12px'
};

const descStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#3e5268',
  lineHeight: '1.6',
  textAlign: 'left',
  margin: 0,
  fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif'
};

export function ExampleCard({ chars, pinyins, results, description, showDetail = false }: ExampleCardProps) {
  return (
    <div style={cardStyle}>
      <div style={cellsRowStyle}>
        {chars.map((char, index) => (
          <MiniCell
            key={index}
            char={char}
            pinyin={pinyins[index]}
            result={results[index]}
            showDetail={showDetail}
          />
        ))}
      </div>
      <p style={descStyle}>{description}</p>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  margin: '0 0 24px',
  padding: '18px'
};

export function RuleGuide() {
  const example1Results: CharResult[] = [
    { char: 'absent', initial: 'absent', final: 'absent', tone: 'absent' },
    { char: 'correct', initial: 'correct', final: 'correct', tone: 'correct' },
    { char: 'absent', initial: 'absent', final: 'absent', tone: 'absent' },
    { char: 'absent', initial: 'absent', final: 'absent', tone: 'absent' }
  ];

  const example2Results: CharResult[] = [
    { char: 'present', initial: 'present', final: 'present', tone: 'present' },
    { char: 'absent', initial: 'absent', final: 'absent', tone: 'absent' },
    { char: 'absent', initial: 'absent', final: 'absent', tone: 'absent' },
    { char: 'absent', initial: 'absent', final: 'absent', tone: 'absent' }
  ];

  const example3Results: CharResult[] = [
    { char: 'absent', initial: 'correct', final: 'correct', tone: 'absent' },
    { char: 'absent', initial: 'absent', final: 'present', tone: 'absent' },
    { char: 'absent', initial: 'absent', final: 'absent', tone: 'absent' },
    { char: 'absent', initial: 'absent', final: 'absent', tone: 'absent' }
  ];

  const winResults: CharResult[] = [
    { char: 'correct', initial: 'correct', final: 'correct', tone: 'correct' },
    { char: 'correct', initial: 'correct', final: 'correct', tone: 'correct' },
    { char: 'correct', initial: 'correct', final: 'correct', tone: 'correct' },
    { char: 'correct', initial: 'correct', final: 'correct', tone: 'correct' }
  ];

  return (
    <section className="ui-panel" style={containerStyle}>
      <div className="ui-panel-header">
        <div>
          <h2 className="ui-panel-title">游戏规则</h2>
          <p className="ui-panel-subtitle">
            颜色反馈会分别作用在汉字、声母、韵母和声调上，下面的例子和提示区采用同一套信息面板样式，阅读路径更一致。
          </p>
        </div>
      </div>
      
      <ExampleCard
        chars={['班', '门', '弄', '斧']}
        pinyins={['bān', 'mén', 'nòng', 'fǔ']}
        results={example1Results}
        description="第二个字「门」为青色，表示其出现在答案中且在正确的位置。"
      />
      
      <ExampleCard
        chars={['水', '落', '石', '出']}
        pinyins={['shuǐ', 'luò', 'shí', 'chū']}
        results={example2Results}
        description="第一个字「水」为橙色，表示其出现在答案中，但并不是第一个字。"
      />
      
      <ExampleCard
        chars={['巧', '夺', '天', '工']}
        pinyins={['qiǎo', 'duó', 'tiān', 'gōng']}
        results={example3Results}
        showDetail={true}
        description="每个格子的汉字、声母、韵母、声调都会独立进行颜色的指示。例如，第一个「巧」汉字为灰色，而其声母与韵母均为青色，代表该位置的正确汉字答案为其同音字但非「巧」字本身。同理，第二个字中韵母uo为橙色，代表其韵母出现在四个字之中，但非位居第二。"
      />
      
      <ExampleCard
        chars={['武', '运', '昌', '隆']}
        pinyins={['wǔ', 'yùn', 'chāng', 'lóng']}
        results={winResults}
        description="当四个格子都为青色时，你便赢得了游戏！"
      />
    </section>
  );
}
