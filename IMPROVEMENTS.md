# Follow Builders v2 — 改进说明

## 🎯 本次改进

### 1. ✅ 集成 Rettiwt-API 获取 X 内容

**改进前：**
- 依赖 LLM 的 web_search 工具搜索推文
- 内容获取不稳定，可能遗漏

**改进后：**
- 使用 Rettiwt-API 直接获取公开推文
- 无需 X API 密钥，无需登录
- 更稳定、更全面的内容获取

**技术实现：**
```javascript
// 使用 Rettiwt 搜索 API（无需认证）
const searchUrl = `${RETTIWT_BASE}/search?query=from:${handle}&count=10`;
const res = await fetch(searchUrl);
```

---

### 2. ✅ 添加中文 Builder 源

**新增中文 Builder（8 位）：**
| 姓名 | Handle | 公司/角色 | 领域 |
|------|--------|----------|------|
| 李开复 | kaifulee | 创新工场创始人 | AI Investment |
| 吴恩达 | AndrewYNg | DeepLearning.AI | AI Education |
| 王小川 | xiaochuan_wang | 百川智能创始人 | LLM |
| 李宏毅 | hungyilee | 台湾大学教授 | AI Education |
| 贾佳 | JiaJiaAI | MiniMax 联合创始人 | AGI |
| 周鸿祎 | zhouhongyi | 360 创始人 | AI Security |
| 杨植麟 | zhilin_yang | 月之暗面创始人 | Kimi |
| 张鹏 | zhangpeng | 极客公园创始人 | AI News |
| 王慧文 | wanghuiwen | 光年之外创始人 | AI Products |

**配置方式：**
```json
{
  "x_accounts": [
    { "name": "李开复", "handle": "kaifulee", "region": "china", "focus": ["创新工场", "AI Investment"] }
  ]
}
```

---

### 3. ✅ 实现价值评分系统

**评分维度（0-10 分）：**

| 维度 | 权重 | 评分标准 |
|------|------|---------|
| **信息密度** | 40% | 内容长度、实质性、是否低质量内容 |
| **原创性** | 35% | 原创 vs 转发、是否有深度思考 |
| **互动质量** | 25% | 点赞/评论比例、讨论热度 |

**评分示例：**
```javascript
{
  "score": {
    "total": 8.5,        // 总分
    "infoDensity": 9,    // 信息密度高
    "originality": 8,    // 原创内容
    "engagement": 8.5    // 互动质量好
  }
}
```

**分数含义：**
- **8-10 分**：高价值内容，必读
- **6-7 分**：中等价值，值得浏览
- **< 6 分**：低价值，可能跳过

---

### 4. ✅ 多级分类机制

**自动分类（基于关键词匹配）：**

| 分类 | 关键词示例 | Emoji |
|------|-----------|-------|
| **🏗️ 产品发布** | launch, release, ship, build, 发布，上线 | 🏗️ |
| **🔬 技术突破** | model, training, LLM, transformer, 算法，模型 | 🔬 |
| **📊 行业洞察** | market, trend, analysis, prediction, 市场，趋势 | 📊 |
| **💰 投融资** | fund, raise, series, valuation, 融资，投资 | 💰 |

**分类置信度：**
```javascript
{
  "categories": [
    { "name": "product", "confidence": 0.67 },  // 2 个关键词匹配
    { "name": "tech", "confidence": 1.0 }       // 3+ 个关键词匹配
  ]
}
```

---

## 📊 推送效果对比

| 指标 | v1 | v2 | 提升 |
|------|-----|-----|------|
| Builder 数量 | 25 (仅英文) | 33 (全球 + 中文) | +32% |
| 内容获取稳定性 | 依赖 web_search | 直接 API | 更稳定 |
| 内容筛选 | 无评分 | 5 分 + 才推送 | 质量提升 |
| 内容组织 | 按时间排序 | 按分类 + 评分 | 更易读 |
| 中文内容 | 0% | ~25% | 新增 |

---

## ⚙️ 配置选项

### 用户可配置项 (`~/.follow-builders/config.json`)

```json
{
  "contentPreferences": {
    "includePodcasts": false,      // 是否包含播客
    "includeX": true,              // 是否包含 X/Twitter
    "xBuilderCount": 20,           // 最多推送多少位 builder
    "minTweetScore": 5,            // 最低推文分数（0-10）
    "regionFilter": "all",         // 地区过滤：all / global / china
    "sortByScore": true            // 按评分排序
  }
}
```

### 配置示例

**只看高价值内容（8 分+）：**
```json
{
  "contentPreferences": {
    "minTweetScore": 8,
    "xBuilderCount": 10
  }
}
```

**只看中文 Builder：**
```json
{
  "contentPreferences": {
    "regionFilter": "china"
  }
}
```

**只看全球 Builder：**
```json
{
  "contentPreferences": {
    "regionFilter": "global"
  }
}
```

---

## 🚀 使用方式

### 手动触发
```bash
# 获取最新内容
node prepare-digest.js

# 获取并推送
node prepare-digest.js | node deliver.js
```

### OpenClaw 定时推送
已配置每天 22:34 自动推送：
```
AI Builders Digest — cron 34 22 * * * @ Asia/Shanghai
```

---

## 📈 后续可改进方向

1. **更多中文源** — 添加更多中国 AI 从业者
2. **智能去重** — 检测相似内容，避免重复推送
3. **趋势分析** — 每周/每月汇总，识别热门话题
4. **个性化推荐** — 根据用户阅读习惯调整推送
5. **多语言支持** — 日语、韩语、西班牙语等

---

## 🙏 致谢

- 原项目：https://github.com/zarazhangrui/follow-builders
- Rettiwt-API: https://github.com/RettiwtTeam/Rettiwt
- Supadata: https://supadata.ai (YouTube 转录稿)
