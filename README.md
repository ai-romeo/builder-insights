English | [中文](README.zh-CN.md)

# Builder Insights

An AI-powered digest that tracks the top AI builders — researchers, founders, PMs, and engineers — and delivers their latest insights in easy-to-digest summaries.

**Slogan:** Follow the signal, ignore the noise.

---

## 📬 What You Get

Daily or weekly digest to your preferred channel (Telegram, Discord, etc.):

- 🎙️ **Top AI Podcasts** — Key insights from new episodes
- 📱 **25 Curated AI Builders** — Critical thoughts from X/Twitter
- 🔗 **Links to all original content**
- 🌐 **English, Chinese, or Bilingual**
- ⭐ **Value Scoring** — Each tweet scored 0-10, high-signal first
- 📊 **Auto Categories** — Product, Tech, Industry, Funding

---

## 🚀 Quick Start

### Option 1: Via AI Agent (Recommended)

In your AI agent (OpenClaw or Claude Code):

```
Type "set up builder-insights" or run /builder-insights
```

Agent will guide you through setup — no manual config editing needed.

**Agent will ask:**
- Frequency (daily/weekly) and time
- Language preference (EN/CN/Bilingual)
- Delivery method (Telegram/Email/In-chat)

**No API keys required** — all content fetched by centralized service.

Your first digest arrives immediately after setup.

### Option 2: Manual Install

```bash
# Clone repo
git clone https://github.com/ai-romeo/builder-insights.git ~/skills/builder-insights
cd ~/skills/builder-insights/scripts && npm install

# Config
cp config.example.json ~/.builder-insights/config.json
# Edit ~/.builder-insights/config.json with your preferences

# Manual trigger
node prepare-digest.js
```

---

## ⚙️ Customization

Change preferences via chat. Just tell your agent:

- "Switch to weekly Monday morning"
- "Change language to Chinese"
- "Make summaries more concise"
- "Only show 8+ score content"
- "Show my current settings"

### Advanced Customization

**Source list** is centrally managed — you automatically get updates.

**Prompt customization** (Skill uses plain text prompt files):

Via chat (recommended):
- Tell your agent — "make summaries punchier", "focus on actionable insights", "use casual tone"
- Agent updates prompts for you

Direct edit (advanced):
Edit files in `prompts/` folder:
- `summarize-podcast.md` — How to summarize podcast episodes
- `summarize-tweets.md` — How to summarize X/Twitter posts
- `digest-intro.md` — Overall digest format and tone
- `translate.md` — How to translate English to Chinese

These are plain text instructions, not code. Changes take effect next digest.

---

## 📊 Current Sources

### Podcasts (5)

- [Latent Space](https://www.youtube.com/@LatentSpacePod)
- [Training Data](https://www.youtube.com/playlist?list=PLOhHNjZItNnMm5tdW61JpnyxeYH5NDDx8)
- [No Priors](https://www.youtube.com/@NoPriorsPodcast)
- [Unsupervised Learning](https://www.youtube.com/@RedpointAI)
- [Data Driven NYC](https://www.youtube.com/@DataDrivenNYC)

### X/Twitter Builders (25)

**Global (19):**
[Garry Tan](https://x.com/garrytan), [Steven Bartlett](https://x.com/StevenBartlett), [Ish Verduzco](https://x.com/ishverduzco), [Oogie](https://x.com/oggii_0), [Paul Graham](https://x.com/paulg), [Josh Woodward](https://x.com/joshwoodward), [TechieSA](https://x.com/TechieBySA), [Amira Zairi](https://x.com/azed_ai), [Adam Grant](https://x.com/AdamMGrant), [Chris Williamson](https://x.com/ChrisWillx), [Alex Hormozi](https://x.com/AlexHormozi), [Andrew Huberman](https://x.com/hubermanlab), [Lulu Cheng Meservey](https://x.com/lulumeservey), [DAN KOE](https://x.com/thedankoe), [Naval](https://x.com/naval), [Andrej Karpathy](https://x.com/karpathy), [Ray Dalio](https://x.com/RayDalio), [John Rush](https://x.com/johnrushx)

**Chinese (6):**
[向阳乔木](https://x.com/vista8), [李举刚](https://x.com/justinleei), [凡人小北](https://x.com/frxiaobei), [Orange AI](https://x.com/oran_ge), [李继刚](https://x.com/lijigang), [宝玉](https://x.com/dotey)

---

## 📦 Installation

### From ClawHub (Coming Soon)

```bash
clawhub install builder-insights
```

### Manual Install

```bash
# OpenClaw
git clone https://github.com/ai-romeo/builder-insights.git ~/.openclaw/workspace/skills/builder-insights
cd ~/.openclaw/workspace/skills/builder-insights/scripts && npm install

# Claude Code
git clone https://github.com/ai-romeo/builder-insights.git ~/.claude/skills/builder-insights
cd ~/.claude/skills/builder-insights/scripts && npm install
```

---

## 🔧 Requirements

- An AI agent (OpenClaw, Claude Code, or similar)
- Internet connection (to fetch centralized feed)

**That's it. No API keys needed.** All content (YouTube transcripts + X/Twitter posts) is fetched daily by centralized service.

---

## 🎯 How It Works

1. **Centralized feed updates daily**, fetching latest content from all sources (YouTube via Supadata, X/Twitter via official API or Rettiwt)
2. **Your agent fetches the feed** — one HTTP request, no API keys
3. **Your agent remixes raw content** into digestible summaries based on your preferences (with value scoring and categories)
4. **Digest delivered to your channel** (or shown directly in chat)

See [examples/sample-digest.md](examples/sample-digest.md) for sample output.

---

## 🔒 Privacy & Security

- **No API keys sent** — all content fetched by centralized service
- **If using Telegram/Email**, keys stored locally in `~/.builder-insights/.env`
- **Skill only reads public content** (public YouTube videos and X posts)
- **Your config, preferences, and read history** stay on your device
- **Value scoring and dedup state** stored locally, never uploaded

---

## 📝 License

MIT

---

## 🙏 Acknowledgments

Improved from original [follow-builders](https://github.com/zarazhangrui/follow-builders):
- Value scoring system (0-10)
- Auto-categorization (Product/Tech/Industry/Funding)
- Chinese builder support
- Bilingual output

**Follow the signal, ignore the noise.** 📡
