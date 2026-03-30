# 猜成语Web游戏实现计划

## 项目概述
基于React + Vite开发一个猜四字成语的Web游戏，类似Wordle的玩法，但针对中文成语进行了创新设计，支持汉字和拼音（声母、韵母、声调）四个维度的独立颜色标记。

---

## 技术栈
- **框架**: React 18 + Vite
- **语言**: TypeScript
- **样式**: CSS Modules 或 内联样式
- **拼音处理**: pinyin-pro 库（用于获取汉字拼音、声母、韵母、声调）

---

## 实现步骤

### 第一阶段：项目初始化

#### 1.1 创建Vite + React + TypeScript项目
```bash
npm create vite@latest . -- --template react-ts
npm install
```

#### 1.2 安装依赖
```bash
npm install pinyin-pro
```

---

### 第二阶段：核心数据结构

#### 2.1 成语数据文件 `src/data/idioms.ts`
- 准备约100-200个常见四字成语
- 每个成语包含：成语文本、拼音数组
- 示例格式：
```typescript
interface Idiom {
  text: string;        // "班门弄斧"
  pinyin: string[];    // ["bān", "mén", "nòng", "fǔ"]
}
```

#### 2.2 拼音解析工具 `src/utils/pinyin.ts`
- 解析拼音为声母、韵母、声调
- 声母列表：b, p, m, f, d, t, n, l, g, k, h, j, q, x, zh, ch, sh, r, z, c, s, y, w
- 韵母列表：a, o, e, i, u, ü, ai, ei, ao, ou, an, en, ang, eng, ong, ia, ie, iao, iou(iu), ian, in, iang, ing, iong, ua, uo, uai, uei(ui), uan, un, uang, üe, üan, ün 等
- 声调：1-4声 + 轻声

---

### 第三阶段：游戏核心逻辑

#### 3.1 游戏状态管理 `src/hooks/useGameState.ts`
```typescript
interface GameState {
  targetIdiom: Idiom;           // 目标成语
  guesses: Guess[];             // 猜测历史
  remainingChances: number;     // 剩余机会
  gameStatus: 'playing' | 'won' | 'lost';
}

interface Guess {
  text: string;                 // 猜测的成语
  pinyin: PinyinPart[];         // 拼音分解
  result: CharResult[];         // 颜色结果
}

interface PinyinPart {
  initial: string;    // 声母
  final: string;      // 韵母
  tone: number;       // 声调
}

interface CharResult {
  char: ColorState;      // 汉字颜色状态
  initial: ColorState;   // 声母颜色状态
  final: ColorState;     // 韵母颜色状态
  tone: ColorState;      // 声调颜色状态
}

type ColorState = 'correct' | 'present' | 'absent';
```

#### 3.2 颜色判断逻辑 `src/utils/gameLogic.ts`
- `evaluateGuess(guess: string, target: Idiom): CharResult[]`
- 对每个位置的汉字、声母、韵母、声调独立判断：
  - **青色(correct)**: 字符在正确答案中且位置正确
  - **橙色(present)**: 字符在正确答案中但位置不正确
  - **灰色(absent)**: 字符不在正确答案中

---

### 第四阶段：UI组件开发

#### 4.1 组件结构
```
src/
├── components/
│   ├── Header/              # 顶部标题区
│   │   └── Header.tsx
│   ├── RuleGuide/           # 规则说明区
│   │   ├── RuleGuide.tsx
│   │   └── ExampleCard.tsx  # 示例卡片
│   ├── GuessGrid/           # 猜测历史区
│   │   ├── GuessGrid.tsx
│   │   └── GuessCell.tsx    # 单个成语格子
│   ├── InputArea/           # 输入交互区
│   │   └── InputArea.tsx
│   └── Modal/               # 状态弹窗
│       └── GameModal.tsx
├── hooks/
│   └── useGameState.ts      # 游戏状态Hook
├── utils/
│   ├── pinyin.ts            # 拼音解析
│   └── gameLogic.ts         # 游戏逻辑
├── data/
│   └── idioms.ts            # 成语数据
├── types/
│   └── index.ts             # 类型定义
├── App.tsx
└── main.tsx
```

#### 4.2 各组件详细设计

##### Header组件
- 主标题：「猜四字成语」
- 副标题：游戏说明文字
- 居中布局，大号字体

##### RuleGuide组件
- 4个示例卡片（示例1-3 + 胜利示例）
- 每个卡片包含4格展示 + 文字说明
- 卡片式布局，留白充足

##### GuessCell组件（核心）
- 正方形格子（80×80px）
- 上方：完整拼音（声母/韵母/声调可独立变色）
- 下方：汉字
- 支持三种颜色状态渲染

##### GuessGrid组件
- 10行垂直排列
- 每行4个GuessCell
- 未猜测显示空白占位

##### InputArea组件
- 4个连续输入框
- 提交按钮（含hover/点击/禁用状态）
- 剩余机会提示
- 输入验证（非汉字/不足4字提示）

##### GameModal组件
- 胜利/失败弹窗
- 显示正确答案
- 「再玩一次」按钮

---

### 第五阶段：样式实现

#### 5.1 颜色规范
```css
:root {
  --color-correct: #27AE60;    /* 青色 - 位置正确 */
  --color-present: #E67E22;    /* 橙色 - 存在但位置错误 */
  --color-absent: #7F8C8D;     /* 灰色 - 不存在 */
  --color-primary: #3498DB;    /* 主按钮 */
  --color-primary-hover: #2980B9;
  --bg-main: #FFFFFF;
  --bg-card: #F8F9FA;
  --text-primary: #2C3E50;
  --text-secondary: #7F8C8D;
}
```

#### 5.2 字体规范
- 中文：系统默认无衬线字体（苹方、思源黑体）
- 拼音：无衬线西文字体
- 格子汉字：24px bold
- 格子拼音：12px

---

### 第六阶段：交互逻辑

#### 6.1 游戏流程
1. 初始化：随机选择成语，重置状态
2. 输入：4个输入框，自动聚焦
3. 提交验证：检查是否为4个有效汉字
4. 结果计算：调用颜色判断逻辑
5. 状态更新：添加猜测历史，减少机会
6. 胜负判断：检查是否全部正确或机会用完
7. 弹窗显示：胜利/失败弹窗
8. 重新开始：重置游戏

#### 6.2 键盘交互
- Enter键提交
- 自动聚焦下一个输入框
- Backspace删除

---

## 文件清单

| 文件路径 | 说明 |
|---------|------|
| `package.json` | 项目配置 |
| `vite.config.ts` | Vite配置 |
| `index.html` | HTML入口 |
| `src/main.tsx` | React入口 |
| `src/App.tsx` | 主应用组件 |
| `src/types/index.ts` | TypeScript类型定义 |
| `src/data/idioms.ts` | 成语数据 |
| `src/utils/pinyin.ts` | 拼音解析工具 |
| `src/utils/gameLogic.ts` | 游戏逻辑 |
| `src/hooks/useGameState.ts` | 游戏状态Hook |
| `src/components/Header/Header.tsx` | 顶部标题 |
| `src/components/RuleGuide/RuleGuide.tsx` | 规则说明 |
| `src/components/RuleGuide/ExampleCard.tsx` | 示例卡片 |
| `src/components/GuessGrid/GuessGrid.tsx` | 猜测历史区 |
| `src/components/GuessGrid/GuessCell.tsx` | 成语格子 |
| `src/components/InputArea/InputArea.tsx` | 输入交互区 |
| `src/components/Modal/GameModal.tsx` | 游戏弹窗 |
| `src/styles/index.css` | 全局样式 |

---

## 实现优先级

1. **P0 - 核心功能**
   - 项目初始化
   - 成语数据准备
   - 拼音解析
   - 游戏逻辑
   - 基础UI组件

2. **P1 - 完整体验**
   - 规则说明区
   - 输入验证
   - 弹窗交互
   - 样式美化

3. **P2 - 优化增强**
   - 动画效果
   - 响应式布局
   - 性能优化

---

## 预估工作量
- 项目初始化：5分钟
- 核心逻辑开发：30分钟
- UI组件开发：40分钟
- 样式调整：20分钟
- 测试调试：15分钟
- **总计：约1.5-2小时**
