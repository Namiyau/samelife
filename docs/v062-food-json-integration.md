# SameLife V0.62 食品 JSON 接入说明

## 已接入

V0.62 已将 `src/data/samelife_food_tokyo_beijing_2026_06.json` 接入页面计算。

当用户选择：

- SL官方：读取 `summary` 中 `sourceMode = sl_official` 的 medianPrice
- SL综合：读取 `summary` 中 `sourceMode = sl_comprehensive` 的 medianPrice

匹配规则：

```txt
itemId + city + sourceMode -> medianPrice
```

例如：

```txt
fast_food + beijing + sl_comprehensive -> 20.5 CNY
home_cooking + tokyo + sl_official -> 208.4 JPY
```

## 未接入

Numbeo 暂未自动接入。原因：

1. Numbeo 官方 API 需要按其 API/授权方式使用。
2. 静态 GitHub Pages 不适合在用户浏览器中保存 API Key。
3. 直接抓取网页容易遇到 CORS、反爬、授权和稳定性问题。

后续推荐做法：

- 使用 Numbeo API 或授权数据，在本地/脚本中生成 JSON
- 将 JSON 放入项目
- 前端读取 `numbeo` sourceMode 的 summary
