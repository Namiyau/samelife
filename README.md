# SameLife V0.7-Final

SameLife 是一个东京与北京生活成本比较器。用户选择当前城市、目标城市和货币后，输入每月生活频率，系统读取公开数据商品篮子计算月度生活成本。

## V0.7-Final 更新

- 删除每月频率页的旧提示文案
- 项目介绍改为收入/支出视角与三项数据原则
- 数据源文案改为 SL 官方测定数据说明
- 日语切换可用，核心页面 UI 已支持日本語
- 商品篮子详情表格压缩宽度，减少横向溢出
- 数据文件固定读取：
  - `src/data/2026_06_food.json`
  - `src/data/2026_06_non_food.json`
- 页面显示中不再出现“用户补充/用户填写”等字样，统一为“手动计入”

## 本地运行

```bash
npm install
npm start
```

浏览器打开：

```txt
http://localhost:5173
```

## 构建测试

```bash
npm run build
npm run preview
```

## 数据更新

只需要替换：

```txt
src/data/2026_06_food.json
src/data/2026_06_non_food.json
```

如果要改成新的月份，建议后续版本同时修改 import 文件名，例如 `2026_09_food.json` 与 `2026_09_non_food.json`。
