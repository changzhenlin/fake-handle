import React from 'react';

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '20px 0',
  borderBottom: '1px solid #E8E8E8',
  marginBottom: '20px'
};

const titleStyle: React.CSSProperties = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#2C3E50',
  margin: '0 0 10px 0',
  fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif'
};

const subtitleStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#7F8C8D',
  margin: 0,
  lineHeight: '1.6',
  maxWidth: '500px',
  marginLeft: 'auto',
  marginRight: 'auto',
  fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif'
};

export function Header() {
  return (
    <header style={headerStyle}>
      <h1 style={titleStyle}>猜四字成语-仿antfu</h1>
      <p style={subtitleStyle}>
        你有十次的机会猜一个四字成语。每次猜测后，汉字与拼音的颜色将会标识其与正确答案的区别。
      </p>
    </header>
  );
}
