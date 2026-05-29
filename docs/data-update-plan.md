# SameLife 数据更新方案 V0.4

## 是否可行

可行。推荐做成“AI 辅助收集 + 人工审核 + JSON/CSV 文件导入”的流程。

不要让网站在用户访问时实时抓取外卖 App 或网页价格。这样会遇到反爬、登录、价格波动、授权和稳定性问题。

## 推荐更新频率

### MVP 阶段

每 1 个月更新一次核心数据。

理由：项目早期数据口径还在调整，月更有利于快速修正。

### 稳定阶段

每 3 个月更新一次完整数据。

理由：生活成本不需要每天更新。房租、套餐、交通、常见商品价格按季度维护比较合理。

### 特殊情况临时更新

遇到以下情况可以临时更新：

- 汇率大幅变化
- 交通票价调整
- 水电燃气价格调整
- 明显通胀或价格冲击
- 平台套餐大改版

## 项目如何识别数据文件

建议未来把数据从 `src/data/basket.js` 迁移为 JSON 文件，例如：

```txt
data/
  basket.2026-05.json
  basket.2026-08.json
  basket.latest.json
```

其中 `basket.latest.json` 始终作为当前使用的数据版本。

网站启动时读取：

```js
fetch("/data/basket.latest.json")
```

读取成功后：

1. 检查 `schemaVersion`
2. 检查 `updatedAt`
3. 检查每个 item 是否有 id、category、name、unit
4. 检查每个城市是否有 price、currency、sourceUrl、sourceDate
5. 通过校验后替换页面数据

## 推荐数据文件格式

见项目根目录：

```txt
data/basket.example.json
```

## 数据更新流程

1. AI 帮你收集候选数据
2. 输出为 `basket.2026-MM.json`
3. 你人工检查来源链接和明显异常价格
4. 放入项目 `data/` 文件夹
5. 把 `basket.latest.json` 替换为新版
6. 本地 `npm start` 检查页面
7. 没问题后提交 GitHub

## 更稳的后续方案

V0.5 可以先继续使用 `src/data/basket.js`。

V0.6 再改为读取 JSON 文件。

V0.7 加入“数据版本选择器”，让用户选择 2026-05、2026-08 等历史版本。
