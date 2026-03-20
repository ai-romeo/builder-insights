# Builder Insights — Follow the Signal, Ignore the Noise

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![OpenClaw Skill](https://img.shields.io/badge/OpenClaw-Skill-blue)](https://openclaw.ai)

🤖 **Track what AI builders are actually building** — automated digest of high-signal insights from 33+ AI researchers, founders, and engineers on X/Twitter and YouTube.

**Slogan:** Follow the signal, ignore the noise.  
**中文名：** 关注信号，忽略噪音。

---

## ✨ Features

### v2 Improvements

| Feature | v1 | v2 |
|---------|-----|-----|
| **Builders** | 25 (English only) | 33 (Global + Chinese) |
| **Content Fetch** | Web search | GitHub Feed + Rettiwt |
| **Value Scoring** | ❌ | ✅ (0-10 score) |
| **Auto Categories** | ❌ | ✅ (Product/Tech/Industry/Funding) |
| **Language** | English | Bilingual (EN+ZH) |

### What's Included

- **📱 X/Twitter精选** — 33+ AI builders' latest tweets
  - Global: Andrej Karpathy, Sam Altman, Amjad Masad (Replit), Aaron Levie (Box), etc.
  - Chinese: 李开复，吴恩达，王小川，杨植麟 (Kimi), etc.

- **🎙️ Podcast 精选** — YouTube tech podcasts with full transcripts
  - Latent Space, Training Data, No Priors, Data Driven NYC, etc.

- **🏆 Value Scoring** — Each tweet scored 0-10
  - Information density (40%)
  - Originality (35%)
  - Engagement quality (25%)

- **📊 Auto Categories**
  - 🏗️ Product Launch
  - 🔬 Technical Breakthrough
  - 📊 Industry Insight
  - 💰 Funding & M&A

---

## 🚀 Quick Start

### Prerequisites

- [OpenClaw](https://openclaw.ai) installed
- Node.js 18+
- (Optional) Supadata API key for YouTube transcripts

### Installation

```bash
# Via skillhub (recommended for CN users)
skillhub install builder-insights

# Or via clawhub
clawhub install builder-insights

# Or manual clone
git clone https://github.com/ai-romeo/builder-insights.git
cd builder-insights
npm install
```

### Configuration

Create `~/.builder-insights/config.json`:

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

### Usage

```bash
# Manual trigger
cd builder-insights/scripts
node prepare-digest.js

# Or with OpenClaw cron (auto daily delivery)
openclaw cron add --name "Builder Insights" \
  --cron "34 22 * * *" \
  --tz "Asia/Shanghai" \
  --message "Get latest AI builders digest"
```

---

## 📁 Project Structure

```
builder-insights/
├── scripts/
│   ├── prepare-digest.js    # Main entry (v2 with scoring)
│   ├── fetch-content.js     # Content fetcher (v2 with Rettiwt)
│   └── deliver.js           # Delivery (Telegram/Email/Stdout)
├── config/
│   └── default-sources.json # Builder list (33 builders)
├── prompts/
│   ├── summarize-tweets.md  # Tweet summary prompt (v2)
│   ├── summarize-podcast.md # Podcast summary prompt
│   └── digest-intro.md      # Digest assembly prompt (v2)
├── feed-x.json              # X/Twitter feed (auto-generated)
├── feed-podcasts.json       # Podcast feed (auto-generated)
└── README.md                # This file
```

---

## 🔧 API Usage

### X/Twitter Content

**Method 1: GitHub Feed (Recommended)**
```javascript
const feedX = await fetchJSON(
  'https://raw.githubusercontent.com/ai-romeo/builder-insights/main/feed-x.json'
);
```

**Method 2: Rettiwt API (No Auth)**
```javascript
const res = await fetch(
  `https://api.rettiwt.tech/api/v1/search?query=from:${handle}&count=10`
);
```

### YouTube Content

**Supadata API (Paid, ~$0.01/video)**
```javascript
const res = await fetch(
  `https://api.supadata.ai/v1/youtube/transcript?url=${videoUrl}`,
  { headers: { 'x-api-key': apiKey } }
);
```

---

## 📊 Builder List

### Global Builders (17)

| Name | Handle | Role |
|------|--------|------|
| Andrej Karpathy | @karpathy | Ex-Tesla AI, OpenAI founding |
| Sam Altman | @sama | OpenAI CEO |
| Amjad Masad | @amasad | Replit CEO |
| Aaron Levie | @levie | Box CEO |
| Garry Tan | @garrytan | YC CEO |
| ... | ... | ... |

### Chinese Builders (8)

| Name | Handle | Role |
|------|--------|------|
| 李开复 | @kaifulee | 创新工场创始人 |
| 吴恩达 | @AndrewYNg | DeepLearning.AI |
| 王小川 | @xiaochuan_wang | 百川智能创始人 |
| 杨植麟 | @zhilin_yang | 月之暗面创始人 (Kimi) |
| ... | ... | ... |

---

## 🎯 Value Scoring

### Scoring Algorithm

```javascript
score = (
  infoDensity * 0.4 +    // Content length, substance
  originality * 0.35 +   // Original vs retweet
  engagement * 0.25      // Likes/replies ratio
) * 10
```

### Score Interpretation

| Score | Meaning | Action |
|-------|---------|--------|
| 8-10 | High value | Must read |
| 6-7 | Medium value | Worth browsing |
| < 6 | Low value | Skip |

---

## 🤝 Contributing

### Add New Builders

Edit `config/default-sources.json`:

```json
{
  "x_accounts": [
    { "name": "Your Builder", "handle": "handle", "region": "china", "focus": ["AI"] }
  ]
}
```

### Improve Prompts

Edit `prompts/*.md` and submit a PR.

### Report Issues

Open an issue on GitHub with:
- What's broken
- Expected behavior
- Your config (remove API keys first)

---

## 📝 License

MIT License — see [LICENSE](LICENSE) file.

---

## 🙏 Acknowledgments

- Original project: [zarazhangrui/follow-builders](https://github.com/zarazhangrui/follow-builders)
- Rettiwt: [RettiwtTeam/Rettiwt](https://github.com/RettiwtTeam/Rettiwt)
- Supadata: [supadata.ai](https://supadata.ai)

---

## 📬 Contact

- **GitHub Issues:** For bugs and feature requests
- **Twitter:** [@ai-romeo](https://twitter.com/ai-romeo)
- **Email:** ai-romeo@users.noreply.github.com

---

**Made with ❤️ by AI builders, for AI builders.**

**Follow the signal, ignore the noise.** 📡
