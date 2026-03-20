# 🚀 快速开始 — 和原项目一样的抓取模式

## ✅ 你的仓库已经具备

你的 `builder-insights` 仓库已经完全复制了原项目的架构：

- ✅ `.github/workflows/generate-feed.yml` — GitHub Actions 定时抓取
- ✅ `scripts/generate-feed.js` — 抓取脚本（X API + Supadata）
- ✅ `scripts/prepare-digest.js` — 准备摘要（用户端）
- ✅ `config/default-sources.json` — 25 位 builder 名单
- ✅ `state-feed.json` — 去重状态管理

**只需要配置 API Token 就可以运行！**

---

## 🔑 配置步骤（5 分钟搞定）

### 步骤 1：获取 X Bearer Token（2 分钟）

1. 访问：https://developer.x.com
2. 登录 X (Twitter) 账号
3. 点击 "Apply for a developer account"
4. 选择 "Hobbyist"（个人爱好）
5. 填写用途（英文）：
   ```
   Building an AI insights digest tool for personal use.
   Tracking AI builders' thoughts on X/Twitter.
   ```
6. 创建 Project：
   - Project name: `builder-insights`
   - App permissions: **Read-only**（只读）
7. 获取 Bearer Token：
   - Keys and Tokens → Bearer Token → Generate
   - 复制 Token（类似：`AAAAAAAAAAAAAAAAAAAAAaZLwEAAAAAAA...`）

---

### 步骤 2：配置到 GitHub Secrets（1 分钟）

1. 访问：https://github.com/ai-romeo/builder-insights/settings/secrets/actions
2. 点击 **"New repository secret"**
3. 添加：
   - **Name:** `X_BEARER_TOKEN`
   - **Value:** `你刚才复制的 Token`
4. 点击 **"Add secret"**

---

### 步骤 3：测试运行（2 分钟）

#### 方式 A：手动触发（推荐首次测试）

1. 访问：https://github.com/ai-romeo/builder-insights/actions/workflows/generate-feed.yml
2. 点击 **"Run workflow"**
3. 选择分支：`main`
4. 点击 **"Run workflow"**
5. 等待 1-2 分钟
6. 查看日志确认成功

#### 方式 B：等待自动运行

GitHub Actions 会自动运行：
- **Tweets:** 每 6 小时（UTC 时间：00:00, 06:00, 12:00, 18:00）
- **北京时间：** 08:00, 14:00, 20:00, 02:00

---

### 步骤 4：验证结果

访问以下链接查看生成的 feed：

- **X/Twitter feed:**
  https://raw.githubusercontent.com/ai-romeo/builder-insights/main/feed-x.json

- **Podcast feed（如果配置了 Supadata）:**
  https://raw.githubusercontent.com/ai-romeo/builder-insights/main/feed-podcasts.json

看到 JSON 数据说明成功！✅

---

## 💰 成本说明

### X API（免费）

| 项目 | 免费额度 | 我们使用 |
|------|---------|---------|
| Tweet 读取 | 10,000/月 | ~3,750/月 ✅ |
| User 查找 | 300/月 | ~25/月 ✅ |

**结论：** 免费额度完全够用！

### Supadata（可选）

| 项目 | 价格 | 建议 |
|------|------|------|
| YouTube 转录稿 | ~$0.01/分钟 | 可选配置 |

**不配置 Supadata 也可以运行** — 只抓取 X/Twitter 内容

---

## 🎯 和原项目完全一样的模式

### 原项目流程

```
GitHub Actions (每 6 小时)
    ↓
调用 X API 获取推文
    ↓
生成 feed-x.json
    ↓
Git Commit + Push
    ↓
用户从 raw.githubusercontent.com 获取
```

### 你的流程

```
GitHub Actions (每 6 小时)
    ↓
调用 X API 获取推文
    ↓
生成 feed-x.json
    ↓
Git Commit + Push
    ↓
用户从 raw.githubusercontent.com 获取
```

**完全一样！** ✅

---

## 📊 对比：原项目 vs 你的改进版

| 功能 | 原项目 | 你的版本 |
|------|--------|---------|
| **抓取方式** | GitHub Actions | ✅ 相同 |
| **X API** | 官方 API v2 | ✅ 相同 |
| **去重机制** | state-feed.json | ✅ 相同 |
| **自动提交** | Git push | ✅ 相同 |
| **用户零配置** | ✅ | ✅ 相同 |
| **价值评分** | ❌ | ✅ 新增 |
| **自动分类** | ❌ | ✅ 新增 |
| **中文 builder** | 少 | ✅ 6 位 |
| **双语支持** | ❌ | ✅ 新增 |

---

## 🚨 常见问题

### Q: 申请 X API 被拒绝？

**A:** 
- 确保选择 "Hobbyist" 而非 "Business"
- 用途写清楚是个人非商业用途
- 重新申请一次

### Q: 中国用户能申请吗？

**A:**
- 可以，可能需要科学上网
- 用英文填写资料
- 用途写 "Personal research" 或 "Hobby project"

### Q: 不配置 Supadata 可以吗？

**A:**
- 可以！只抓取 X/Twitter 内容
- Podcast 部分会显示 "暂无内容"
- 不影响整体功能

### Q: GitHub Actions 不运行？

**A:**
1. 检查 Secrets 是否正确配置
2. 查看 Actions 页面的日志
3. 确保 workflow 文件语法正确

---

## 🎉 配置完成后

1. **GitHub Actions 自动运行** — 每 6 小时抓取最新内容
2. **feed-x.json 自动更新** — 包含 25 位 builder 的最新推文
3. **你的每日推送** — 自动获取最新 feed，生成摘要

**和原项目完全一样的体验！** 🚀

---

## 📬 需要帮助？

- 查看 SETUP.md 完整配置指南
- 查看 X_API_SETUP.md X API 详细配置
- GitHub Issues: https://github.com/ai-romeo/builder-insights/issues

**Follow the signal, ignore the noise.** 📡
