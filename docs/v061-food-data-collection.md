# SameLife V0.61 食品数据收集说明

## 用户界面小项

- 自己做饭
- 即食食品
- 外卖食品
- 快餐外食
- 聚餐外食
- 咖啡奶茶
- 零食甜品

## 收集原则

每个城市、每个小项建议先收集 5-10 个样本。每条样本必须记录：

- itemId
- city
- sourceMode: sl_official 或 sl_composite 或 numbeo
- sampleName
- price
- currency
- sourceName
- sourceUrl
- sourceDate
- districtOrArea
- includeDeliveryFee
- includeServiceFee
- includeCoupon
- couponType
- note

## SL官方与SL综合

SL官方：
- 使用公开标价、菜单价、平台标价
- 不使用临时优惠券
- 可以做中位数/平均数等二次处理，但必须写清样本数和方法

SL综合：
- 在 SL官方基础上考虑常驻优惠、会员常见优惠、配送费、服务费
- 不纳入一次性新人券或难以复现的个体优惠

## 建议输出格式

建议 AI 输出 JSON 或 CSV。优先 JSON，因为后续可以直接被项目读取。
