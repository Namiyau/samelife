# SameLife 数据源策略 V0.3

SameLife 不建议长期依赖单一网站。生活成本数据应允许“来源切换”和“来源对比”。

## 数据源分层

### Level 1：官方 / 准官方数据

优先级最高，适合作为基准。

例子：

- 日本 e-Stat / 小売物価統計調査
- 东京都统计、交通机构公开票价
- 北京市统计局、国家统计局北京调查总队
- 北京地铁、交通委等官方或准官方票价
- OECD PPP / World Bank ICP 这类国际统计项目

优点：口径严肃、可引用、长期稳定。  
缺点：不一定有“咖啡一杯”“健身房月卡”“具体一居室租金”这种用户可感价格。

### Level 2：企业公开价格

适合具体商品或服务。

例子：

- 电影院官网票价
- 交通机构官网
- 运营商套餐页
- 连锁咖啡菜单
- 健身房公开价格
- 超市/电商公开商品页

优点：用户可核查，和真实消费接近。  
缺点：地区、门店、活动价、会员价会造成波动。

### Level 3：市场样本 / 平台样本

适合房租、餐饮、日用品等高波动项目。

例子：

- SUUMO、HOME'S、58、贝壳等房租样本
- 线上超市、电商平台
- 餐饮平台或菜单样本

优点：贴近实际选择。  
缺点：需要明确采样区域、筛选条件和日期。

### Level 4：众包生活成本网站

只建议作为参考或备用来源，不建议作为唯一主来源。

例子：

- Numbeo
- Expatistan

优点：覆盖城市多、类目完整、启动快。  
缺点：数据由用户贡献，样本结构、时间、城市内差异、异常值控制都不完全透明。

## V0.4 建议的数据结构

后续可以把每个商品改成多来源：

```js
{
  id: "coffee",
  category: "food",
  name: "咖啡",
  unit: "1杯",
  defaultMonthlyFrequency: 12,
  prices: {
    tokyo: {
      activeSourceId: "starbucks_tokyo_2026_05",
      sources: [
        {
          id: "starbucks_tokyo_2026_05",
          price: 450,
          currency: "JPY",
          sourceType: "company_public_price",
          sourceName: "Starbucks Japan",
          sourceUrl: "...",
          sourceDate: "2026-05",
          confidence: "market_sample",
          note: "普通门店中杯咖啡样本"
        },
        {
          id: "numbeo_tokyo_2026_05",
          price: 500,
          currency: "JPY",
          sourceType: "crowdsourced",
          sourceName: "Numbeo",
          sourceUrl: "...",
          sourceDate: "2026-05",
          confidence: "reference_only",
          note: "众包参考，不作为主来源"
        }
      ]
    }
  }
}
```

## 推荐原则

1. 每个商品至少保留一个主来源。
2. 有争议项目保留两个以上来源。
3. 众包网站只作为 sanity check。
4. 页面上允许用户切换来源。
5. 每条价格必须显示来源、日期、口径说明和可信度。
