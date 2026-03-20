# 🔧 GitHub Actions 配置指南

## 📋 前置条件

要让 GitHub Actions 自动抓取内容，需要配置以下 API 密钥：

---

## 1️⃣ X/Twitter API 配置

### 获取 X Bearer Token

1. 访问 https://developer.x.com
2. 登录并创建项目
3. 创建 App（选择"Read only"权限）
4. 在"Keys and tokens"页面生成 Bearer Token

### 添加到 GitHub Secrets

1. 访问你的仓库：https://github.com/ai-romeo/builder-insights/settings/secrets/actions
2. 点击"New repository secret"
3. 添加：
   - **Name:** `X_BEARER_TOKEN`
   - **Value:** `你的 Bearer Token`
4. 点击"Add secret"

**免费额度：** 1000 tweets/月（足够用）

---

## 2️⃣ YouTube Supadata API 配置

### 获取 Supadata API Key

1. 访问 https://supadata.ai
2. 注册账号
3. 在 Dashboard 获取 API Key

### 添加到 GitHub Secrets

1. 同样在 GitHub Secrets 页面
2. 添加：
   - **Name:** `SUPADATA_API_KEY`
   - **Value:** `你的 API Key`
3. 点击"Add secret"

**成本：** 约 $0.01/分钟转录稿  
**建议：** 每天只抓取 1-2 个播客，约 $0.3/天

---

## 3️⃣ 测试工作流

### 手动触发

1. 访问：https://github.com/ai-romeo/builder-insights/actions/workflows/generate-feed.yml
2. 点击"Run workflow"
3. 选择分支（main）
4. 点击"Run workflow"

### 查看日志

- 等待 1-2 分钟
- 点击最新的运行记录
- 查看输出日志

### 验证结果

检查是否生成了文件：
- ✅ `feed-x.json` — X/Twitter 内容
- ✅ `feed-podcasts.json` — YouTube 播客内容
- ✅ `state-feed.json` — 去重状态

---

## 4️⃣ 自动调度

工作流会自动运行：

| 内容 | 频率 | UTC 时间 | 北京时间 |
|------|------|---------|---------|
| X/Twitter | 每 6 小时 | 00:00, 06:00, 12:00, 18:00 | 08:00, 14:00, 20:00, 02:00 |
| Podcasts | 每天 | 00:00 | 08:00 |

---

## 5️⃣ 仅用免费方案（无 API）

如果不想配置 API，可以用以下方式：

### 方案 A：使用原项目的 Feed

修改 `prepare-digest.js`，直接从原项目获取：

```javascript
const FEED_X_URL = 'https://raw.githubusercontent.com/zarazhangrui/follow-builders/main/feed-x.json';
const FEED_PODCASTS_URL = 'https://raw.githubusercontent.com/zarazhangrui/follow-builders/main/feed-podcasts.json';
```

**优点：**
- ✅ 零成本
- ✅ 零配置
- ✅ 稳定

**缺点：**
- ⚠️ 依赖原项目维护
- ⚠️ 无法自定义 builder 列表

### 方案 B：仅用 Rettiwt（无 X API）

修改 `generate-feed.js`，使用 Rettiwt 而非官方 API：

```javascript
// 使用 Rettiwt（无需认证）
const res = await fetch(
  `https://api.rettiwt.tech/api/v1/search?query=from:${handle}&count=10`
);
```

**优点：**
- ✅ 无需 API 密钥
- ✅ 免费

**缺点：**
- ⚠️ Rettiwt 可能不稳定

---

## 6️⃣ 本地测试

### 安装依赖

```bash
cd scripts
npm install
```

### 设置环境变量

创建 `.env` 文件：

```bash
X_BEARER_TOKEN=your_x_bearer_token
SUPADATA_API_KEY=your_supadata_key
```

### 运行测试

```bash
# 仅生成 X/Twitter feed
node generate-feed.js --tweets-only

# 仅生成 Podcast feed
node generate-feed.js --podcasts-only

# 生成全部
node generate-feed.js
```

### 检查结果

```bash
cat feed-x.json
cat feed-podcasts.json
```

---

## ❓ 常见问题

### Q: X API 报错 429（Rate Limited）

**A:** 免费额度用完了，等待下个月或升级套餐。

### Q: Supadata 太贵怎么办？

**A:** 
1. 减少播客数量（只抓取最重要的 2-3 个）
2. 降低更新频率（每周而非每天）
3. 使用 YouTube 字幕替代转录稿

### Q: GitHub Actions 不运行？

**A:** 
1. 检查 Secrets 是否正确配置
2. 查看 Actions 日志
3. 确保 workflow 文件语法正确

### Q: 如何添加新的 builder？

**A:** 
1. 编辑 `config/default-sources.json`
2. 在 `x_accounts` 数组添加：
   ```json
   { "name": "新 Builder", "handle": "handle", "region": "china", "focus": ["AI"] }
   ```
3. 提交并推送，GitHub Actions 会自动抓取

---

## 📬 需要帮助？

- 提 Issue: https://github.com/ai-romeo/builder-insights/issues
- 查看示例：`examples/sample-digest.md`
- 参考原文档：原项目 [follow-builders](https://github.com/zarazhangrui/follow-builders)

---

**Follow the signal, ignore the noise.** 📡
