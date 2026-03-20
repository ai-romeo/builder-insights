[English](README.md) | 中文

# Builder Insights

一个 AI 驱动的信息聚合工具，追踪 AI 领域最顶尖的建造者——研究员、创始人、产品经理和工程师——并将他们的最新动态整理成易于消化的摘要推送给你。

**理念：** Follow the signal, ignore the noise.（关注信号，忽略噪音。）

---

## 📬 推送内容

每日或每周推送到你常用的通讯工具（Telegram、Discord、飞书等），包含：

- 🎙️ **顶级 AI 播客** 新节目的精华摘要
- 📱 **25 位精选 AI 建造者** 在 X/Twitter 上的关键观点和洞察
- 🔗 **所有原始内容的链接**
- 🌐 **支持英文、中文或双语版本**
- ⭐ **价值评分** — 每条内容 0-10 分，优先推送高价值内容
- 📊 **自动分类** — 产品发布、技术突破、行业洞察、投融资

---

## 🚀 快速开始

### 方式 1：通过 AI Agent 设置（推荐）

在你的 AI agent 中（OpenClaw 或 Claude Code）：

```
输入 "set up builder-insights" 或执行 /builder-insights
```

Agent 会以对话方式引导你完成设置——不需要手动编辑任何配置文件。

**Agent 会询问你：**
- 推送频率（每日或每周）和时间
- 语言偏好（英文/中文/双语）
- 推送方式（Telegram、邮件或直接在聊天中显示）

**不需要任何 API key** — 所有内容由中心化服务统一抓取。

设置完成后，你的第一期摘要会立即推送。

### 方式 2：手动安装

```bash
# 克隆仓库
git clone https://github.com/ai-romeo/builder-insights.git ~/skills/builder-insights
cd ~/skills/builder-insights/scripts && npm install

# 配置
cp config.example.json ~/.builder-insights/config.json
# 编辑 ~/.builder-insights/config.json 设置你的偏好

# 手动触发
node prepare-digest.js
```

---

## ⚙️ 自定义设置

通过对话即可修改推送偏好。直接告诉你的 agent：

- "改成每周一早上推送"
- "语言换成中文"
- "把摘要写得更简短一些"
- "只显示 8 分以上的内容"
- "显示我当前的设置"

### 高级自定义

**信息源列表** 由中心化统一管理和更新——你无需做任何操作即可获得最新的信息源。

**Prompt 定制**（Skill 使用纯文本 prompt 文件来控制内容的摘要方式）：

通过对话（推荐）：
- 直接告诉你的 agent — "摘要写得更简练一些"、"多关注可操作的洞察"、"用更轻松的语气"
- Agent 会自动帮你更新 prompt

直接编辑（高级用户）：
编辑 `prompts/` 文件夹中的文件：
- `summarize-podcast.md` — 播客节目的摘要方式
- `summarize-tweets.md` — X/Twitter 帖子的摘要方式
- `digest-intro.md` — 整体摘要的格式和语气
- `translate.md` — 英文内容翻译为中文的方式

这些都是纯文本指令，不是代码。修改后下次推送即生效。

---

## 📊 当前信息源

### 播客（5 个）

- [Latent Space](https://www.youtube.com/@LatentSpacePod)
- [Training Data](https://www.youtube.com/playlist?list=PLOhHNjZItNnMm5tdW61JpnyxeYH5NDDx8)
- [No Priors](https://www.youtube.com/@NoPriorsPodcast)
- [Unsupervised Learning](https://www.youtube.com/@RedpointAI)
- [Data Driven NYC](https://www.youtube.com/@DataDrivenNYC)

### X/Twitter 建造者（25 位）

**全球（19 位）：**
[Garry Tan](https://x.com/garrytan), [Steven Bartlett](https://x.com/StevenBartlett), [Ish Verduzco](https://x.com/ishverduzco), [Oogie](https://x.com/oggii_0), [Paul Graham](https://x.com/paulg), [Josh Woodward](https://x.com/joshwoodward), [TechieSA](https://x.com/TechieBySA), [Amira Zairi](https://x.com/azed_ai), [Adam Grant](https://x.com/AdamMGrant), [Chris Williamson](https://x.com/ChrisWillx), [Alex Hormozi](https://x.com/AlexHormozi), [Andrew Huberman](https://x.com/hubermanlab), [Lulu Cheng Meservey](https://x.com/lulumeservey), [DAN KOE](https://x.com/thedankoe), [Naval](https://x.com/naval), [Andrej Karpathy](https://x.com/karpathy), [Ray Dalio](https://x.com/RayDalio), [John Rush](https://x.com/johnrushx)

**中文（6 位）：**
[向阳乔木](https://x.com/vista8), [李举刚](https://x.com/justinleei), [凡人小北](https://x.com/frxiaobei), [Orange AI](https://x.com/oran_ge), [李继刚](https://x.com/lijigang), [宝玉](https://x.com/dotey)

---

## 📦 安装

### 从 ClawHub 安装（即将上线）

```bash
clawhub install builder-insights
```

### 手动安装

```bash
# OpenClaw
git clone https://github.com/ai-romeo/builder-insights.git ~/.openclaw/workspace/skills/builder-insights
cd ~/.openclaw/workspace/skills/builder-insights/scripts && npm install

# Claude Code
git clone https://github.com/ai-romeo/builder-insights.git ~/.claude/skills/builder-insights
cd ~/.claude/skills/builder-insights/scripts && npm install
```

---

## 🔧 需求

- 一个 AI agent（OpenClaw、Claude Code 或类似工具）
- 网络连接（用于获取中心化 feed）

**仅此而已。不需要任何 API key。** 所有内容（YouTube 字幕 + X/Twitter 帖子）由中心化服务每日抓取更新。

---

## 🎯 工作原理

1. **中心化 feed 每日更新**，抓取所有信息源的最新内容（YouTube 字幕通过 Supadata，X/Twitter 通过官方 API 或 Rettiwt）
2. **你的 agent 获取 feed** — 一次 HTTP 请求，不需要 API key
3. **你的 agent 根据你的偏好** 将原始内容重新混编为易消化的摘要（带价值评分和分类）
4. **摘要推送到你的通讯工具**（或直接在聊天中显示）

查看 [examples/sample-digest.md](examples/sample-digest.md) 了解输出示例。

---

## 🔒 隐私与安全

- **不发送任何 API key** — 所有内容由中心化服务获取
- **如果你使用 Telegram/邮件推送**，相关 key 仅存储在本地 `~/.builder-insights/.env`
- **Skill 只读取公开内容**（公开的 YouTube 视频和 X 帖子）
- **你的配置、偏好和阅读记录** 都保留在你自己的设备上
- **价值评分和去重状态** 存储在本地，不会上传

---

## 📝 许可证

MIT

---

## 🙏 致谢

基于原项目 [follow-builders](https://github.com/zarazhangrui/follow-builders) 改进：
- 添加价值评分系统（0-10 分）
- 自动分类（产品/技术/行业/融资）
- 中文 builder 支持
- 中英文双语输出

**Follow the signal, ignore the noise.** 📡
