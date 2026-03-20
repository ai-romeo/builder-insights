# 🎮 GitHub Actions 手动触发指南

## 📱 图文操作步骤

### 步骤 1：访问 Actions 页面

打开链接：
```
https://github.com/ai-romeo/builder-insights/actions
```

你会看到这样的界面：
```
┌─────────────────────────────────────────────────────────┐
│  Actions                                                │
│                                                         │
│  Workflows all workflows                                │
│                                                         │
│  ✅ Generate Feed         main  Last run 2 hours ago   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### 步骤 2：点击 workflow 名称

**点击 "Generate Feed"**（蓝色链接）

进入后看到：
```
┌─────────────────────────────────────────────────────────┐
│  Generate Feed                                          │
│                                                         │
│  This workflow has a workflow_dispatch event trigger    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Run workflow                                    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### 步骤 3：点击 "Run workflow" 按钮

**点击绿色的 "Run workflow" 按钮**

弹出对话框：
```
┌─────────────────────────────────────────────────────────┐
│  Run workflow                                            │
│                                                         │
│  Branch: [main ▼]                                       │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │           🟢 Run workflow                        │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### 步骤 4：选择分支（如果有多个分支）

**点击下拉菜单 [main ▼]**

如果有多个分支，选择 `main`

---

### 步骤 5：点击 "Run workflow"

**点击绿色的 "Run workflow" 按钮**

按钮会变成：
```
┌─────────────────────────────────────────────────────────┐
│  ✓ Workflow run queued                                  │
│                                                         │
│  View workflow run                                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### 步骤 6：查看运行状态

**点击 "View workflow run"** 或直接刷新页面

看到运行列表：
```
┌─────────────────────────────────────────────────────────┐
│  Generate Feed #123                                     │
│                                                         │
│  Run #123                                               │
│  ⏳ in progress     main  Generate Feed  #123  10s     │
│                                                         │
│  Run #122                                               │
│  ✅ success         main  Generate Feed  #122  2m ago  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**状态说明：**
- ⏳ **in progress** — 正在运行
- ✅ **success** — 运行成功
- ❌ **failed** — 运行失败
- ⚠️ **cancelled** — 已取消

---

### 步骤 7：查看运行日志

**点击正在运行的记录（#123）**

进入详情页面：
```
┌─────────────────────────────────────────────────────────┐
│  Run #123 - Generate Feed                               │
│                                                         │
│  Jobs                                                   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  generate                                    2m │   │
│  │  ├─ Set up job                              10s │   │
│  │  ├─ Checkout                                5s  │   │
│  │  ├─ Setup Node.js                          15s  │   │
│  │  ├─ Install dependencies                    30s │   │
│  │  ├─ Generate X/Twitter feed                1m   │   │
│  │  ├─ Generate Podcast feed                  45s  │   │
│  │  └─ Commit and push if changed            20s  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**点击任意步骤查看日志**

例如点击 "Generate X/Twitter feed"：
```
┌─────────────────────────────────────────────────────────┐
│  Generate X/Twitter feed                                │
│                                                         │
│  Fetch: https://api.x.com/2/users/by?...               │
│  Found 18 builders with new tweets                     │
│  feed-x.json: 18 builders, 45 tweets                   │
│                                                         │
│  ✅ Completed in 1m                                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ 验证成功

### 方法 1：检查 feed 文件

运行成功后，访问：

**X/Twitter feed:**
```
https://raw.githubusercontent.com/ai-romeo/builder-insights/main/feed-x.json
```

**Podcast feed（如果配置了 Supadata）:**
```
https://raw.githubusercontent.com/ai-romeo/builder-insights/main/feed-podcasts.json
```

看到 JSON 数据说明成功！

---

### 方法 2：查看 Git 提交

访问：
```
https://github.com/ai-romeo/builder-insights/commits/main
```

看到类似提交：
```
chore: auto-update feed 2026-03-21 00:00 UTC
```

说明自动提交成功！✅

---

## ❌ 常见问题

### Q1: 看不到 "Run workflow" 按钮？

**原因：**
- 没有配置 GitHub Secrets
- 或 workflow 文件有语法错误

**解决：**
1. 检查是否配置了 `X_BEARER_TOKEN`
2. 查看 workflow 文件语法

---

### Q2: 运行失败（红色）？

**查看错误日志：**

点击失败的步骤，查看错误信息：

**常见错误：**
```
❌ Error: X_BEARER_TOKEN is not set
→ 解决方案：配置 GitHub Secrets

❌ Error: Rate limited
→ 解决方案：等待 15 分钟后重试

❌ Error: Invalid token
→ 解决方案：重新生成 Bearer Token
```

---

### Q3: 运行成功但没有生成 feed？

**可能原因：**
- 过去 6 小时内没有新推文
- 所有推文都已处理过（去重）

**检查日志：**
```
Found 0 builders with new tweets
No changes to commit
```

这是正常的，说明最近没有新内容。

---

## 🕐 自动运行时间

**配置的时间（UTC）：**
- Tweets: 每 6 小时（00:00, 06:00, 12:00, 18:00）
- Podcasts: 每天（00:00）

**北京时间：**
- Tweets: 08:00, 14:00, 20:00, 02:00
- Podcasts: 08:00

**不需要手动触发** — 配置好后会自动运行！

手动触发仅用于：
- 首次测试
- 调试问题
- 立即获取最新内容

---

## 📱 手机访问 GitHub

如果用手机访问：

1. 打开 https://github.com/ai-romeo/builder-insights/actions
2. 点击 "Generate Feed"
3. 点击右上角 **"Run workflow"** 按钮
4. 选择分支 `main`
5. 点击 **"Run workflow"**

界面可能不同，但流程一样！

---

## 🎯 完整流程示意

```
访问 Actions 页面
    ↓
点击 "Generate Feed"
    ↓
点击 "Run workflow" 按钮
    ↓
选择分支 main
    ↓
点击 "Run workflow"
    ↓
等待 1-2 分钟
    ↓
查看日志确认成功
    ↓
验证 feed 文件已更新
    ↓
✅ 完成！
```

---

**需要帮助？**

截图发给我，我帮你看看哪里出了问题！🚀
