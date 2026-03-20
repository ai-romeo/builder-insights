# Digest Intro Prompt v2 (with Categories & Scoring)

You are assembling the final digest from individual source summaries.

## Format

Start with this header (replace [Date] with today's date in the user's timezone):

**AI Builders Digest — [Date]**

Optional subtitle if there are high-value insights:
*今日精选：X 条高价值内容 | 平均评分 X.X/10*

## Content Organization

Organize content in this order:

### 1. 🏆 今日高价值 (Top Picks) — Optional
If there are tweets with score >= 8, create a "Top Picks" section:
- List 2-3 most valuable insights
- One sentence each + link
- This helps busy readers scan the best content first

### 2. 📱 X / Twitter 精选

**For bilingual mode:** Every section must have both English and Chinese.

**EN:** Write the English version first, then add the Chinese translation below it.
**CN:** 先写英文版本，然后在下面添加中文翻译。

**Example format for quick-scan section:**
```
**Builder Name (X 分)** — English summary
[Link](...)

**Builder Name（X 分）** — 中文摘要
[链接](...)
```

**DO NOT include any stats section at the end.** No tables, no counts, no averages.
Just end with the configuration line in both languages.
Organize by category when possible:

**🏗️ 产品发布**
- Builder 1 summary + link
- Builder 2 summary + link

**🔬 技术突破**
- Builder 3 summary + link

**📊 行业洞察**
- Builder 4 summary + link

**💰 投融资**
- Builder 5 summary + link

**📝 其他**
- Remaining builders without clear category

### 3. 🎙️ 播客精选 — Optional
Only if user has includePodcasts: true

---

## Rules

### Mandatory Links
- Every single piece of content MUST have an original source link
- Tweets: the direct tweet URL (e.g. https://x.com/levie/status/xxx)
- Podcasts: the YouTube video URL (e.g. https://youtube.com/watch?v=xxx)
- If you don't have a link for something, do NOT include it

### Author Formatting
- Use full name + role/company, not just last name
  - ✅ "Box CEO Aaron Levie"
  - ❌ "Levie"
  - ❌ "@levie"
- For Chinese builders: "公司/角色 + 中文名"
  - ✅ "创新工场创始人李开复"
  - ✅ "月之暗面 (Moonshot AI) 创始人杨植麟"

### Score Display
- For tweets with score >= 8, add "💡 Why it matters" note
- For tweets with score 6-7, no special marking
- Skip tweets with score < 6 unless they're the only content from that builder

### No Fabrication
- Only include content from the feed JSON
- NEVER make up quotes, opinions, or speculate about silence
- If you have nothing real for a builder, skip them entirely

### Language
- If config.language is 'zh': Write entirely in Chinese
- If config.language is 'en': Write entirely in English
- If config.language is 'bilingual': English paragraph, then Chinese translation

### Length Control
- Total digest should be 800-1500 Chinese characters (or 500-1000 English words)
- If content exceeds this, prioritize by:
  1. Tweet score (highest first)
  2. Category relevance (Product/Tech > Industry > Funding > Other)
  3. Recency (newer first)

---

## Example Output (Chinese)

# AI Builders Digest — 2026 年 3 月 20 日

*今日精选：5 条高价值内容 | 平均评分 7.2/10*

---

## 🏆 今日高价值

1. **Box CEO Aaron Levie** 预测知识工作者的 compute 预算会持续增长，CFO 可能成为"AI 负责人" [推文链接](...)
2. **Anthropic Thariq** 发布 Claude Code Channels，可从手机直接控制 [推文链接](...)

---

## 📱 X / Twitter 精选

### 🏗️ 产品发布

**Replit CEO Amjad Masad**
展示 Replit 新魔法：设计探索后点击"Build"一键生成生产级应用。
[推文链接](...)

### 🔬 技术突破

**前 Tesla AI 总监 Andrej Karpathy**
分享《Project Hail Mary》观后感，称赞电影在科学细节上的深度。
💡 这条推文展示了 Karpathy 对硬科幻的偏好——注重科学准确性而非戏剧效果。
[推文链接](...)

### 📊 行业洞察

**Box CEO Aaron Levie**
预测知识工作者的 compute 预算会持续增长...
[推文链接](...)

---

**📌 配置：** 每天 22:34 推送 | 仅 X/Twitter | 中文 | 20 位 builder

---

Reply to adjust your delivery settings or summary style.
