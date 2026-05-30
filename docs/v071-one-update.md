# SameLife V0.71-One

## 更新内容

- 数据文件改为自动识别 `年_月_日_food.json` 与 `年_月_日_non_food.json`。
- 当前内置最新版：
  - `src/data/2026_06_30_food.json`
  - `src/data/2026_06_30_non_food.json`
- 接入 V0.71 Supplemented 非食品数据，兼容 `measurementSpecs` 口径规则。
- 娱乐类拆分为 `ktv` 与 `live_event`。
- 商品篮子详情新增“采样口径”说明。
- 删除北京地铁/电车与北京通勤模型的无效外链，来源名称统一显示为“亿通行”。
- 结果页加入统计对比图：总成本、分类成本、差异最大项目。
- `docs/` 内已包含构建好的 GitHub Pages 静态文件，可直接用 `/docs` 发布。

## 推荐 GitHub Pages 设置

Settings → Pages：

```txt
Source: Deploy from a branch
Branch: main
Folder: /docs
```

保存后等待 1–3 分钟访问：

```txt
https://namiyau.github.io/samelife/
```

## 以后更新数据

把新数据文件放到：

```txt
src/data/
```

命名必须是：

```txt
YYYY_MM_DD_food.json
YYYY_MM_DD_non_food.json
```

例如：

```txt
2026_09_01_food.json
2026_09_01_non_food.json
```

系统会在同类文件中自动选择文件名日期最新的一组数据。建议保留旧文件作为历史版本，但数据文件过多会增加页面体积。
