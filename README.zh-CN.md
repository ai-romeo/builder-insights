# Builder Insights — 关注信号，忽略噪音

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![OpenClaw Skill](https://img.shields.io/badge/OpenClaw-Skill-blue)](https://openclaw.ai)

🤖 **追踪 AI 领域真正 builder 的动态** — 自动汇总 33+ AI 研究者、创始人、工程师在 X/Twitter 和 YouTube 上的高价值内容。

**Slogan:** Follow the signal, ignore the noise.  
**口号：** 关注信号，忽略噪音。

---

## ✨ 特性

### v2 改进

| 功能 | v1 | v2 |
|------|-----|-----|
| **Builder 数量** | 25 (仅英文) | 33 (全球 + 中文) |
| **内容获取** | 网络搜索 | GitHub Feed + Rettiwt |
| **价值评分** | ❌ | ✅ (0-10 分) |
| **自动分类** | ❌ | ✅ (产品/技术/行业/融资) |
| **语言** | 英文 | 中英文双语 |

### 内容包括

- **📱 X/Twitter 精选** — 33+ AI builder 的最新推文
  - 全球：Andrej Karpathy, Sam Altman, Replit CEO, Box CEO 等
  - 中文：李开复，吴恩达，王小川，杨植麟 (Kimi) 等

- **🎙️ Podcast 精选** — YouTube 技术播客完整转录稿
  - Latent Space, Training Data, No Priors, Data Driven NYC 等

- **🏆 价值评分** — 每条推文 0-10 分
  - 信息密度 (40%)
  - 原创性 (35%)
  - 互动质量 (25%)

- **📊 自动分类**
  - 🏗️ 产品发布
  - 🔬 技术突破
  - 📊 行业洞察
  - 💰 投融资

---

## 🚀 快速开始

### 前置条件

- [OpenClaw](https://openclaw.ai) 已安装
- Node.js 18+
- (可选) Supadata API key 用于 YouTube 转录稿

### 安装

```bash
# 通过 skillhub（推荐国内用户）
skillhub install builder-insights

# 或通过 clawhub
clawhub install builder-insights

# 或手动克隆
git clone https://github.com/ai-romeo/builder-insights.git
cd builder-insights
npm install
```

### 配置

创建 `~/.builder-insights/config.json`：

```json
{
  "language": "bilingual",
  "timezone": "Asia/Shanghai",
  "frequency": "daily",
  "deliveryTime": "22:34",
  "contentPreferences": {
    "includePodcasts": false,
    "includeX": true,
    "xBuilderCount": 20,
    "minTweetScore": 5,
    "regionFilter": "all"
  }
}
```

### 使用

```bash
# 手动触发
cd builder-insights/scripts
node prepare-digest.js

# 或设置 OpenClaw 定时任务（自动每日推送）
openclaw cron add --name "Builder Insights" \
  --cron "34 22 * * *" \
  --tz "Asia/Shanghai" \
  --message "获取最新 AI builders 摘要"
```

---

## 📁 项目结构

```
builder-insights/
├── scripts/
│   ├── prepare-digest.js    # 主入口（v2 带评分）
│   ├── fetch-content.js     # 内容抓取（v2 带 Rettiwt）
│   └── deliver.js           # 推送（Telegram/Email/Stdout）
├── config/
│   └── default-sources.json # Builder 列表（33 位）
├── prompts/
│   ├── summarize-tweets.md  # 推文摘要提示（v2）
│   ├── summarize-podcast.md # 播客摘要提示
│   └── digest-intro.md      # 摘要组装提示（v2）
├── feed-x.json              # X/Twitter feed（自动生成）
├── feed-podcasts.json       # Podcast feed（自动生成）
└── README.md                # 本文件
```

---

## 🔧 API 使用

### X/Twitter 内容

**方式 1：GitHub Feed（推荐）**
```javascript
const feedX = await fetchJSON(
  'https://raw.githubusercontent.com/ai-romeo/builder-insights/main/feed-x.json'
);
```

**方式 2：Rettiwt API（无需认证）**
```javascript
const res = await fetch(
  `https://api.rettiwt.tech/api/v1/search?query=from:${handle}&count=10`
);
```

### YouTube 内容

**Supadata API（付费，约 $0.01/视频）**
```javascript
const res = await fetch(
  `https://api.supadata.ai/v1/youtube/transcript?url=${videoUrl}`,
  { headers: { 'x-api-key': apiKey } }
);
```

---

## 📊 Builder 名单

### 全球 Builder（17 位）

| 姓名 | Handle | 角色 |
|------|--------|------|
| Andrej Karpathy | @karpathy | 前 Tesla AI 总监，OpenAI 创始成员 |
| Sam Altman | @sama | OpenAI CEO |
| Amjad Masad | @amasad | Replit CEO |
| Aaron Levie | @levie | Box CEO |
| Garry Tan | @garrytan | YC CEO |
| ... | ... | ... |

### 中文 Builder（8 位）

| 姓名 | Handle | 角色 |
|------|--------|------|
| 李开复 | @kaifulee | 创新工场创始人 |
| 吴恩达 | @AndrewYNg | DeepLearning.AI 创始人 |
| 王小川 | @xiaochuan_wang | 百川智能创始人 |
| 杨植麟 | @zhilin_yang | 月之暗面创始人 (Kimi) |
| ... | ... | ... |

---

## 🎯 价值评分

### 评分算法

```javascript
score = (
  信息密度 * 0.4 +    // 内容长度、实质性
  原创性 * 0.35 +   // 原创 vs 转发
  互动质量 * 0.25      // 点赞/评论比例
) * 10
```

### 分数含义

| 分数 | 含义 | 操作 |
|------|------|------|
| 8-10 | 高价值 | 必读 |
| 6-7 | 中等价值 | 值得浏览 |
| < 6 | 低价值 | 跳过 |

---

## 🤝 贡献

### 添加新 Builder

编辑 `config/default-sources.json`：

```json
{
  "x_accounts": [
    { "name": "你的 Builder", "handle": "handle", "region": "china", "focus": ["AI"] }
  ]
}
```

### 改进 Prompt

编辑 `prompts/*.md` 并提交 PR。

### 报告问题

在 GitHub 提 Issue，包含：
- 什么问题
- 预期行为
- 你的配置（先删除 API key）

---

## 📝 许可证

MIT License — 见 [LICENSE](LICENSE) 文件。

---

## 🙏 致谢

- 原项目：[zarazhangrui/follow-builders](https://github.com/zarazhangrui/follow-builders)
- Rettiwt: [RettiwtTeam/Rettiwt](https://github.com/RettiwtTeam/Rettiwt)
- Supadata: [supadata.ai](https://supadata.ai)

---

## 📬 联系

- **GitHub Issues:** Bug 和功能请求
- **Twitter:** [@ai-romeo](https://twitter.com/ai-romeo)
- **Email:** ai-romeo@users.noreply.github.com

---

**由 AI builder 打造，为 AI builder 服务。❤️**

**Follow the signal, ignore the noise. 📡**
