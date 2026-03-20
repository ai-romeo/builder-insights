# 发布到 GitHub 指南

## 📋 发布前检查清单

### 1. 更新配置文件

编辑 `package.json`，替换占位符：

```json
{
  "author": "你的名字",
  "repository": {
    "url": "https://github.com/YOUR_USERNAME/follow-builders.git"
  },
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/follow-builders/issues"
  },
  "homepage": "https://github.com/YOUR_USERNAME/follow-builders#readme"
}
```

### 2. 更新 README

编辑 `README.md` 和 `README.zh-CN.md`，替换：
- `YOUR_USERNAME` → 你的 GitHub 用户名
- `@YOUR_HANDLE` → 你的 Twitter handle
- `your@email.com` → 你的邮箱

### 3. 测试代码

```bash
cd /root/.openclaw/workspace/skills/follow-builders

# 安装依赖
npm install

# 测试准备摘要
node scripts/prepare-digest.js | head -50

# 检查语法
node -c scripts/fetch-content.js
node -c scripts/prepare-digest.js
node -c scripts/deliver.js
```

---

## 🚀 发布步骤

### 步骤 1：创建 GitHub 仓库

1. 访问 https://github.com/new
2. 仓库名：`follow-builders`
3. 描述：`AI Builders Digest — Track what AI builders are actually building`
4. 选择 **Public**
5. **不要** 勾选 "Initialize this repository with a README"
6. 点击 "Create repository"

### 步骤 2：初始化 Git 并提交

```bash
cd /root/.openclaw/workspace/skills/follow-builders

# 初始化 Git
git init

# 添加所有文件
git add -A

# 提交
git commit -m "Initial release: v2.0 with scoring, categories, and Chinese builders

Features:
- Value scoring (0-10) for each tweet
- Auto-categorization (Product/Tech/Industry/Funding)
- 8 Chinese builders added
- Bilingual support (EN+ZH)
- Improved content fetch with Rettiwt API

Based on original work by zarazhangrui/follow-builders"
```

### 步骤 3：推送到 GitHub

```bash
# 替换 YOUR_USERNAME 为你的 GitHub 用户名
git remote add origin https://github.com/YOUR_USERNAME/follow-builders.git

# 重命名分支为 main
git branch -M main

# 推送
git push -u origin main
```

### 步骤 4：验证发布

访问你的仓库：
```
https://github.com/YOUR_USERNAME/follow-builders
```

检查：
- ✅ README 正确显示
- ✅ 文件结构完整
- ✅ LICENSE 文件存在
- ✅ package.json 配置正确

---

## 📢 宣传推广

### 1. 发布 Twitter

```
🚀 Just released follow-builders v2!

Track 33+ AI builders' insights with:
✅ Value scoring (0-10)
✅ Auto-categories
✅ Bilingual (EN+ZH)
✅ 8 Chinese builders added

Based on @zarazhangrui's original work.

Try it: https://github.com/YOUR_USERNAME/follow-builders

#AI #OpenSource #OpenClaw
```

### 2. 发布到 OpenClaw 社区

- Discord: https://discord.com/invite/clawd
- 分享你的改进和使用经验

### 3. 联系原作者

给原项目作者发消息：
```
Hi @zarazhangrui,

I've improved your follow-builders project with:
- Value scoring for tweets
- Auto-categorization
- Chinese builders support
- Bilingual output

Repo: https://github.com/YOUR_USERNAME/follow-builders

Would love your feedback! Credits to your original work 🙏
```

---

## 🔄 后续维护

### 接收 Issue

- 及时回复用户问题
- 标记 bug 和 feature request

### 接受 PR

- 审查代码质量
- 测试后再合并

### 版本更新

```bash
# 更新 package.json version
npm version patch  # 1.0.0 → 1.0.1 (bug fix)
npm version minor  # 1.0.0 → 1.1.0 (feature)
npm version major  # 1.0.0 → 2.0.0 (breaking change)

git push --follow-tags
```

---

## 📊 发布到 Skillhub（可选）

如果想让技能更容易安装：

### 1. 准备 Skill 配置

创建 `skill.json`：

```json
{
  "name": "follow-builders",
  "version": "2.0.0",
  "description": "AI Builders Digest with value scoring and bilingual support",
  "author": "YOUR_NAME",
  "license": "MIT",
  "entry": "scripts/prepare-digest.js",
  "skills": ["fetch", "prepare", "deliver"]
}
```

### 2. 提交到 Skillhub

参考：https://clawhub.com/publish

---

## ✅ 发布完成检查

- [ ] GitHub 仓库创建成功
- [ ] 所有文件已推送
- [ ] README 正确显示
- [ ] 代码可以正常运行
- [ ] Twitter 已发布
- [ ] 原项目作者已通知
- [ ] OpenClaw 社区已分享

---

**🎉 恭喜！你的改进版已发布！**
