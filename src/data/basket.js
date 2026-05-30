export const CITIES = {
  tokyo: {
    label: "东京",
    nativeCurrency: "JPY"
  },
  beijing: {
    label: "北京",
    nativeCurrency: "CNY"
  }
};

export const CURRENCIES = {
  CNY: {
    label: "人民币",
    symbol: "¥"
  },
  JPY: {
    label: "日元",
    symbol: "¥"
  },
  USD: {
    label: "美元",
    symbol: "$"
  }
};

export const CATEGORY_META = {
  food: {
    label: "食品",
    desc: "做饭、即食、外卖、快餐、聚餐、咖啡奶茶、零食甜品"
  },
  transport: {
    label: "交通",
    desc: "地铁、电车、公交、出租车、通勤月票、共享单车"
  },
  housing: {
    label: "住房",
    desc: "租金、水电燃气、网络、手机、物业管理"
  },
  entertainment: {
    label: "娱乐",
    desc: "电影、健身、流媒体、展览、KTV、Live演出、数字内容"
  },
  daily: {
    label: "日用品",
    desc: "洗护、纸品、清洁、护肤、理发、常备药妆"
  }
};

function cityPrice(price, currency, sourceName, sourceUrl, confidence = "market_sample") {
  return {
    price,
    currency,
    sourceName,
    sourceUrl,
    sourceDate: "2026-05",
    confidence
  };
}

const SOURCE_PLACEHOLDER = {
  tokyo: {
    food: "https://www.numbeo.com/cost-of-living/in/Tokyo",
    transport: "https://www.tokyometro.jp/en/ticket/regular/index.html",
    housing: "https://suumo.jp/",
    entertainment: "https://www.tohotheater.jp/",
    daily: "https://www.matsukiyococokara-online.com/"
  },
  beijing: {
    food: "https://www.numbeo.com/cost-of-living/in/Beijing",
    transport: "https://www.bjsubway.com/",
    housing: "https://bj.58.com/chuzu/",
    entertainment: "https://www.maoyan.com/",
    daily: "https://www.jd.com/"
  }
};

export const BASKET_ITEMS = [
  // 食品：手动计入生活场景频率，后台用具体商品篮子计算单价。
  {
    id: "home_cooking",
    category: "food",
    name: "自己做饭",
    unit: "1餐",
    note: "1~2人的饭菜；若2人以上，此项建议乘以 1.5。",
    defaultMonthlyFrequency: 30,
    tokyo: cityPrice(550, "JPY", "占位：超市食材篮子计算", SOURCE_PLACEHOLDER.tokyo.food),
    beijing: cityPrice(18, "CNY", "占位：超市/买菜平台食材篮子计算", SOURCE_PLACEHOLDER.beijing.food)
  },
  {
    id: "ready_to_eat_food",
    category: "food",
    name: "即食食品",
    unit: "1份",
    note: "便利店或超市的开袋即食食品。",
    defaultMonthlyFrequency: 8,
    tokyo: cityPrice(650, "JPY", "占位：便利店/超市即食样本", SOURCE_PLACEHOLDER.tokyo.food),
    beijing: cityPrice(25, "CNY", "占位：便利店/超市即食样本", SOURCE_PLACEHOLDER.beijing.food)
  },
  {
    id: "delivery_food",
    category: "food",
    name: "外卖食品",
    unit: "1单",
    note: "以正餐为基础的外卖下单，可区分是否含配送费、服务费和常驻优惠。",
    defaultMonthlyFrequency: 8,
    tokyo: cityPrice(1400, "JPY", "占位：外卖平台样本，含配送费口径待定", SOURCE_PLACEHOLDER.tokyo.food),
    beijing: cityPrice(32, "CNY", "占位：外卖平台样本，含配送费口径待定", SOURCE_PLACEHOLDER.beijing.food)
  },
  {
    id: "fast_food",
    category: "food",
    name: "快餐外食",
    unit: "1次",
    note: "如麦当劳、肯德基、松屋、吉野家等快餐或简餐。",
    defaultMonthlyFrequency: 10,
    tokyo: cityPrice(900, "JPY", "占位：快餐公开菜单/样本", SOURCE_PLACEHOLDER.tokyo.food),
    beijing: cityPrice(35, "CNY", "占位：快餐公开菜单/样本", SOURCE_PLACEHOLDER.beijing.food)
  },
  {
    id: "social_dining",
    category: "food",
    name: "聚餐外食",
    unit: "1次",
    note: "火锅、居酒屋、烤肉等以社交聚餐为目的的店铺。",
    defaultMonthlyFrequency: 3,
    tokyo: cityPrice(3500, "JPY", "占位：聚餐店铺样本", SOURCE_PLACEHOLDER.tokyo.food),
    beijing: cityPrice(160, "CNY", "占位：聚餐店铺样本", SOURCE_PLACEHOLDER.beijing.food)
  },
  {
    id: "coffee_milk_tea",
    category: "food",
    name: "咖啡奶茶",
    unit: "1杯",
    note: "包含外卖下单；SL综合可考虑长期优惠券和会员价。",
    defaultMonthlyFrequency: 10,
    tokyo: cityPrice(450, "JPY", "占位：连锁咖啡/饮品公开样本", "https://www.starbucks.co.jp/"),
    beijing: cityPrice(25, "CNY", "占位：连锁咖啡/饮品公开样本", "https://www.starbucks.com.cn/")
  },
  {
    id: "snack_dessert",
    category: "food",
    name: "零食甜品",
    unit: "1次",
    note: "包含外卖下单；例如便利店甜品、蛋糕、冰淇淋、小吃甜点等。",
    defaultMonthlyFrequency: 8,
    tokyo: cityPrice(450, "JPY", "占位：便利店/甜品店样本", SOURCE_PLACEHOLDER.tokyo.food),
    beijing: cityPrice(20, "CNY", "占位：便利店/甜品店样本", SOURCE_PLACEHOLDER.beijing.food)
  },

  // 交通
  {
    id: "metro_train",
    category: "transport",
    name: "地铁/电车",
    unit: "1次",
    defaultMonthlyFrequency: 44,
    tokyo: cityPrice(210, "JPY", "东京 Metro 票价信息", SOURCE_PLACEHOLDER.tokyo.transport, "official"),
    beijing: cityPrice(4, "CNY", "北京地铁票制票价", SOURCE_PLACEHOLDER.beijing.transport, "official")
  },
  {
    id: "bus",
    category: "transport",
    name: "公交",
    unit: "1次",
    defaultMonthlyFrequency: 8,
    tokyo: cityPrice(210, "JPY", "占位：公交公开票价", "https://www.kotsu.metro.tokyo.jp/", "official"),
    beijing: cityPrice(2, "CNY", "占位：北京公交公开票价", "https://jtw.beijing.gov.cn/", "official")
  },
  {
    id: "taxi_ride_short",
    category: "transport",
    name: "出租车/网约车短途",
    unit: "1次",
    defaultMonthlyFrequency: 4,
    tokyo: cityPrice(1800, "JPY", "占位：出租车短途样本", "https://www.taxi-tokyo.or.jp/", "semi_official"),
    beijing: cityPrice(35, "CNY", "占位：出租车/网约车短途样本", "https://jtw.beijing.gov.cn/", "semi_official")
  },
  {
    id: "commuter_pass",
    category: "transport",
    name: "通勤月票/定期券",
    unit: "每月",
    defaultMonthlyFrequency: 0,
    tokyo: cityPrice(8500, "JPY", "占位：通勤定期券样本", SOURCE_PLACEHOLDER.tokyo.transport, "official"),
    beijing: cityPrice(0, "CNY", "占位：北京暂无通用地铁月票口径，默认 0", SOURCE_PLACEHOLDER.beijing.transport, "manual_estimate")
  },
  {
    id: "bike_share",
    category: "transport",
    name: "共享单车/自行车",
    unit: "1次",
    defaultMonthlyFrequency: 8,
    tokyo: cityPrice(165, "JPY", "占位：共享单车/自行车样本", "https://docomo-cycle.jp/"),
    beijing: cityPrice(1.5, "CNY", "占位：共享单车样本", "https://www.meituan.com/")
  },

  // 住房：住房类在界面上用“是否计入”勾选，不再输入频率。
  {
    id: "rent_single_apartment",
    category: "housing",
    name: "单人租房",
    unit: "每月",
    noFrequency: true,
    defaultMonthlyFrequency: 1,
    tokyo: cityPrice(95000, "JPY", "占位：房租平台样本", SOURCE_PLACEHOLDER.tokyo.housing),
    beijing: cityPrice(4500, "CNY", "占位：房租平台样本", SOURCE_PLACEHOLDER.beijing.housing)
  },
  {
    id: "rent_shared_room",
    category: "housing",
    name: "合租/房间",
    unit: "每月",
    noFrequency: true,
    defaultMonthlyFrequency: 0,
    tokyo: cityPrice(65000, "JPY", "占位：合租/单间样本", SOURCE_PLACEHOLDER.tokyo.housing),
    beijing: cityPrice(2600, "CNY", "占位：合租/单间样本", SOURCE_PLACEHOLDER.beijing.housing)
  },
  {
    id: "utilities",
    category: "housing",
    name: "水电燃气",
    unit: "每月",
    noFrequency: true,
    defaultMonthlyFrequency: 1,
    tokyo: cityPrice(15000, "JPY", "占位：公共事业费用样本", "https://www.tepco.co.jp/", "manual_estimate"),
    beijing: cityPrice(350, "CNY", "占位：公共事业费用样本", "https://www.bjwatergroup.com.cn/", "manual_estimate")
  },
  {
    id: "home_internet",
    category: "housing",
    name: "家庭网络",
    unit: "每月",
    noFrequency: true,
    defaultMonthlyFrequency: 1,
    tokyo: cityPrice(5200, "JPY", "占位：运营商公开套餐", "https://www.docomo.ne.jp/"),
    beijing: cityPrice(120, "CNY", "占位：运营商公开套餐", "https://www.10086.cn/")
  },
  {
    id: "mobile_plan",
    category: "housing",
    name: "手机套餐",
    unit: "每月",
    noFrequency: true,
    defaultMonthlyFrequency: 1,
    tokyo: cityPrice(3500, "JPY", "占位：手机套餐公开价格", "https://www.docomo.ne.jp/"),
    beijing: cityPrice(80, "CNY", "占位：手机套餐公开价格", "https://www.10086.cn/")
  },
  {
    id: "management_fee",
    category: "housing",
    name: "物业/管理费",
    unit: "每月",
    noFrequency: true,
    defaultMonthlyFrequency: 0,
    tokyo: cityPrice(5000, "JPY", "占位：管理费样本", SOURCE_PLACEHOLDER.tokyo.housing, "manual_estimate"),
    beijing: cityPrice(180, "CNY", "占位：物业费样本", SOURCE_PLACEHOLDER.beijing.housing, "manual_estimate")
  },

  // 娱乐
  {
    id: "movie_ticket",
    category: "entertainment",
    name: "电影",
    unit: "1次",
    defaultMonthlyFrequency: 2,
    tokyo: cityPrice(2000, "JPY", "TOHO Cinemas 票价", SOURCE_PLACEHOLDER.tokyo.entertainment, "official"),
    beijing: cityPrice(45, "CNY", "占位：影院票价公开样本", SOURCE_PLACEHOLDER.beijing.entertainment)
  },
  {
    id: "gym",
    category: "entertainment",
    name: "健身房",
    unit: "每月",
    defaultMonthlyFrequency: 1,
    tokyo: cityPrice(9000, "JPY", "占位：健身房公开套餐", "https://www.anytimefitness.co.jp/"),
    beijing: cityPrice(300, "CNY", "占位：健身房公开套餐", "https://www.anytimefitness.com.cn/")
  },
  {
    id: "streaming",
    category: "entertainment",
    name: "流媒体会员",
    unit: "每月",
    defaultMonthlyFrequency: 1,
    tokyo: cityPrice(990, "JPY", "占位：流媒体公开价格", "https://www.netflix.com/"),
    beijing: cityPrice(25, "CNY", "占位：视频平台公开会员价", "https://www.iqiyi.com/")
  },
  {
    id: "museum_exhibition",
    category: "entertainment",
    name: "展览/博物馆",
    unit: "1次",
    defaultMonthlyFrequency: 1,
    tokyo: cityPrice(1200, "JPY", "占位：展览/博物馆门票样本", "https://www.tnm.jp/"),
    beijing: cityPrice(60, "CNY", "占位：展览/博物馆门票样本", "https://www.dpm.org.cn/")
  },

  {
    id: "ktv",
    category: "entertainment",
    name: "KTV",
    unit: "人均/2小时",
    note: "量贩式KTV，小包或6人内包房；北京按包房总价折算人均，东京按个人计费折算。",
    defaultMonthlyFrequency: 1,
    tokyo: cityPrice(1400, "JPY", "占位：KTV样本", SOURCE_PLACEHOLDER.tokyo.entertainment),
    beijing: cityPrice(30, "CNY", "占位：KTV样本", SOURCE_PLACEHOLDER.beijing.entertainment)
  },
  {
    id: "live_event",
    category: "entertainment",
    name: "Live/演出活动",
    unit: "人均/次",
    note: "普通Livehouse或普通演出票，不含VIP、黄牛价、大型顶流演唱会。",
    defaultMonthlyFrequency: 1,
    tokyo: cityPrice(3000, "JPY", "占位：Live/演出票样本", SOURCE_PLACEHOLDER.tokyo.entertainment),
    beijing: cityPrice(180, "CNY", "占位：Live/演出票样本", SOURCE_PLACEHOLDER.beijing.entertainment)
  },
  {
    id: "game_digital_content",
    category: "entertainment",
    name: "游戏/数字内容",
    unit: "每月",
    defaultMonthlyFrequency: 1,
    tokyo: cityPrice(1500, "JPY", "占位：数字内容/月度消费样本", "https://store.steampowered.com/"),
    beijing: cityPrice(60, "CNY", "占位：数字内容/月度消费样本", "https://store.steampowered.com/")
  },

  // 日用品
  {
    id: "shampoo_bodywash",
    category: "daily",
    name: "洗发水/沐浴露",
    unit: "1次",
    defaultMonthlyFrequency: 1,
    tokyo: cityPrice(800, "JPY", "占位：药妆/超市公开价格", SOURCE_PLACEHOLDER.tokyo.daily),
    beijing: cityPrice(45, "CNY", "占位：电商/超市公开价格", SOURCE_PLACEHOLDER.beijing.daily)
  },
  {
    id: "tissue_toilet_paper",
    category: "daily",
    name: "纸巾/卫生纸",
    unit: "1次",
    defaultMonthlyFrequency: 2,
    tokyo: cityPrice(500, "JPY", "占位：药妆/超市公开价格", SOURCE_PLACEHOLDER.tokyo.daily),
    beijing: cityPrice(25, "CNY", "占位：电商/超市公开价格", SOURCE_PLACEHOLDER.beijing.daily)
  },
  {
    id: "laundry_cleaning",
    category: "daily",
    name: "洗衣液/清洁用品",
    unit: "1次",
    defaultMonthlyFrequency: 1,
    tokyo: cityPrice(700, "JPY", "占位：药妆/超市公开价格", SOURCE_PLACEHOLDER.tokyo.daily),
    beijing: cityPrice(35, "CNY", "占位：电商/超市公开价格", SOURCE_PLACEHOLDER.beijing.daily)
  },
  {
    id: "skincare_cosmetics",
    category: "daily",
    name: "护肤/化妆品",
    unit: "1次",
    defaultMonthlyFrequency: 1,
    tokyo: cityPrice(1800, "JPY", "占位：药妆/美妆公开价格", SOURCE_PLACEHOLDER.tokyo.daily),
    beijing: cityPrice(120, "CNY", "占位：电商/美妆公开价格", SOURCE_PLACEHOLDER.beijing.daily)
  },
  {
    id: "haircut",
    category: "daily",
    name: "理发",
    unit: "1次",
    defaultMonthlyFrequency: 1,
    tokyo: cityPrice(3000, "JPY", "占位：理发价格样本", "https://www.qbhouse.co.jp/"),
    beijing: cityPrice(60, "CNY", "占位：理发价格样本", "https://www.dianping.com/")
  },
  {
    id: "medicine_drugstore",
    category: "daily",
    name: "常备药/药妆",
    unit: "1次",
    defaultMonthlyFrequency: 1,
    tokyo: cityPrice(1200, "JPY", "占位：药妆店常备药样本", SOURCE_PLACEHOLDER.tokyo.daily),
    beijing: cityPrice(50, "CNY", "占位：药店/电商常备药样本", SOURCE_PLACEHOLDER.beijing.daily)
  }
];
