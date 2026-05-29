import React, { useEffect, useMemo, useState } from "react";
import "./styles.css";
import {
  BASKET_ITEMS,
  CATEGORY_META,
  CITIES,
  CURRENCIES
} from "./data/basket";
import foodDataset from "./data/2026_06_food.json";
import nonFoodDataset from "./data/2026_06_non_food.json";
import {
  FALLBACK_RATES,
  convertCurrency,
  fetchLiveRates,
  formatMoney
} from "./lib/currency";

const DEFAULT_SELECTED_CATEGORIES = Object.keys(CATEGORY_META);

const DATA_SOURCES = {
  sl_official: {
    label: "SL官方",
    labelJa: "SL公式",
    desc: "使用SL官方测定的数据，其最新更新日期为2026-06，仅统计公开信息，不考虑常驻优惠，实际体验等情况。",
    descJa: "SL公式データを使用しています。最終更新日は2026-06です。公開情報のみを集計し、常設割引や実体験価格などは考慮していません。"
  },
  sl_comprehensive: {
    label: "SL综合（待接入）",
    labelJa: "SL総合（準備中）",
    desc: "SL综合将读取长期优惠/实际支付价文件；当前测试版只开放 SL官方。",
    descJa: "SL総合は長期割引や実際の支払い価格ファイルを読み込む予定です。現在のテスト版ではSL公式のみ利用できます。"
  },
  numbeo: {
    label: "NUMBEO（待接入）",
    labelJa: "NUMBEO（準備中）",
    desc: "Numbeo 将读取独立映射文件；当前测试版不实时抓取网页。",
    descJa: "Numbeo は独立したマッピングファイルから読み込む予定です。現在のテスト版ではリアルタイム取得を行いません。"
  }
};



const I18N = {
  "zh-CN": {
    language: "Language",
    heroTitle: "同一种生活方式，换一座城市要花多少钱？",
    heroSubtitle: "SameLife 使用可追踪来源的商品篮子，比较同一套生活频率在不同城市的月度生活成本。",
    projectIntro: "项目介绍",
    introTitle: "很多人习惯用收入衡量城市生活水平，但真实生活并不只由收入决定，支出同样重要。",
    introLead: "SameLife 关注的是：在不同城市中，维持相似生活方式需要付出多少成本。项目以精简、真实、可解释的数据为基础，构建衣、食、住、行、娱乐等生活场景的价格样本，帮助用户理解东京与北京之间的生活成本差异，而不是只依赖模糊的平均数。",
    principlesIntro: "SameLife 遵循三个原则：",
    principleTargetedTitle: "针对性原则",
    principleTargetedBody: "选取两座城市中可对比、相似或功能等价的消费场景，并从代表性商家、平台或公开价格来源中采集样本。",
    principleLowCostTitle: "低成本原则",
    principleLowCostBody: "不以高消费、奢侈消费或极端价格作为基准，而是以普通人的日常需求为核心，关注常见、稳定、可复现的生活成本。",
    principleTransparentTitle: "透明性原则",
    principleTransparentBody: "每个价格样本都应尽量提供来源链接、采样日期、价格口径和可信度标签，让计算结果可以被检查、理解和更新。",
    settingsTitle: "地区与货币设置",
    currentCity: "当前居住城市",
    currentCurrency: "当前计算货币",
    targetCity: "目标城市",
    targetCurrency: "目标计算货币",
    pleaseSelect: "请选择",
    exchangeStatus: "汇率状态：",
    liveRate: "已获取在线汇率",
    loadingRate: "正在获取在线汇率……",
    fallbackRate: "在线汇率失败，当前使用内置备用汇率",
    fxPreview: "汇率预览",
    selectCurrenciesFirst: "请先选择当前货币与目标货币",
    sameCurrency: "当前货币与目标货币相同，无需汇率换算",
    setupWarning: "请完整选择当前城市、当前货币、目标城市和目标货币后再进入下一步。",
    nextFrequency: "确认并填写每月频率",
    monthlyFrequency: "每月频率",
    frequencyTitle: "选择要计算的生活类别，并填写每月频率。",
    selectAll: "全选类别",
    collapseAll: "全部折叠",
    resetFrequency: "恢复默认频率",
    source: "数据源",
    sourceTitle: "选择本次计算使用的数据口径",
    sourceVersion: "数据源版本",
    sourcePending: "该数据源尚未接入。当前测试版只开放 SL官方口径。",
    sourceReadyPrefix: "数据已接入：2026_06_food.json + 2026_06_non_food.json，当前口径已匹配",
    sourceReadySuffix: "个小项。",
    emptyCategory: "你还没有勾选任何类别。请至少选择一个类别。",
    totalItems: "个小项",
    monthlyFrequencyLabel: "每月频率",
    includeCost: "计入成本",
    back: "返回上一步",
    confirmResult: "确认并查看结果",
    sourcePendingButton: "该数据源待接入",
    resultEyebrow: "计算结果",
    resultTitle: "你的 SameLife 月度生活成本结果",
    resultHint: "当前结果基于你选择的类别、输入频率、当前汇率和数据源计算。数据读取 2026_06_food.json 与 2026_06_non_food.json。",
    currentCost: "当前地区成本",
    targetCost: "目标地区成本",
    costRatio: "成本倍数",
    ratioNote: "统一折算为人民币后比较",
    categoryResult: "分类结果",
    categoryHint: "点击类别可以展开小项。点击小项单价可查看商品篮子样本、价格、来源链接、计算口径和 5 星可信度。",
    current: "当前",
    target: "目标",
    item: "小项",
    unit: "单位",
    counted: "计入",
    notCounted: "不计入",
    perMonth: "/ 月",
    currentUnitPrice: "单价",
    sourceReliability: "来源可信度",
    chartPlaceholder: "统计对比图",
    chartPlaceholderBody: "预留：未来可加入总成本柱状图、分类成本对比、差异最大的前 5 个项目。",
    advicePlaceholder: "生活建议",
    advicePlaceholderBody: "预留：未来可根据成本差异生成节省建议、迁居提醒、消费结构提示。",
    downloadPdf: "下载 PDF（预留）",
    downloadData: "下载数据（预留）",
    basketDetail: "商品篮子详情",
    adoptedPrice: "当前采用单价",
    sourceType: "来源类型",
    sourceName: "来源名称",
    dataDate: "数据日期",
    dataNote: "数据说明：",
    summarySamples: "summary 样本数：",
    summaryMethod: "summary 计算方法：",
    sampleStats: "样本统计：",
    median: "中位数",
    average: "平均数",
    min: "最低",
    max: "最高",
    samples: "样本",
    sampleRows: "条样本",
    originalSamples: "原始样本明细",
    noSample: "暂无样本明细",
    sample: "样本",
    price: "价格",
    sourceColumn: "来源",
    reliability: "可信度",
    dateArea: "日期/地区",
    feesDiscounts: "费用/优惠",
    note: "备注",
    deliveryFee: "配送费",
    serviceFee: "服务费",
    discount: "优惠",
    type: "类型",
    noSampleBody: "当前项目还没有导入原始样本明细。请检查对应数据文件的 items 是否包含该城市与口径。",
    yes: "是",
    no: "否"
  },
  ja: {
    language: "言語",
    heroTitle: "同じ暮らし方なら、都市が変わるといくらかかる？",
    heroSubtitle: "SameLife は出典を追跡できる商品バスケットを使い、同じ生活頻度で東京と北京の月間生活費を比較します。",
    projectIntro: "プロジェクト紹介",
    introTitle: "都市の暮らしやすさは収入だけでは決まりません。実際の生活では、支出も同じくらい重要です。",
    introLead: "SameLife が注目するのは、異なる都市で似た生活スタイルを維持するために必要なコストです。精選された実データと説明可能な価格サンプルをもとに、衣食住・交通・娯楽などの生活シーンを構成し、東京と北京の生活費の違いを分かりやすく示します。",
    principlesIntro: "SameLife は次の三つの原則に基づいています：",
    principleTargetedTitle: "対象性の原則",
    principleTargetedBody: "二つの都市で比較可能、類似、または機能的に同等な消費シーンを選び、代表的な店舗・プラットフォーム・公開価格からサンプルを収集します。",
    principleLowCostTitle: "低コストの原則",
    principleLowCostBody: "高級消費や極端な価格を基準にせず、普通の人の日常需要を中心に、一般的で安定し再現しやすい生活費に注目します。",
    principleTransparentTitle: "透明性の原則",
    principleTransparentBody: "各価格サンプルには、可能な限り出典リンク、採取日、価格の口径、信頼度ラベルを付け、計算結果を確認・理解・更新できるようにします。",
    settingsTitle: "都市と通貨の設定",
    currentCity: "現在住んでいる都市",
    currentCurrency: "現在側の表示通貨",
    targetCity: "比較先の都市",
    targetCurrency: "比較先の表示通貨",
    pleaseSelect: "選択してください",
    exchangeStatus: "為替レート：",
    liveRate: "オンライン為替を取得済み",
    loadingRate: "オンライン為替を取得中……",
    fallbackRate: "オンライン為替の取得に失敗したため、内蔵レートを使用しています",
    fxPreview: "為替プレビュー",
    selectCurrenciesFirst: "現在側と比較先の通貨を選択してください",
    sameCurrency: "同じ通貨のため換算は不要です",
    setupWarning: "現在都市・現在通貨・比較先都市・比較先通貨をすべて選択してください。",
    nextFrequency: "確認して月間頻度を入力",
    monthlyFrequency: "月間頻度",
    frequencyTitle: "計算する生活カテゴリを選び、月間頻度を入力してください。",
    selectAll: "すべて選択",
    collapseAll: "すべて折りたたむ",
    resetFrequency: "既定頻度に戻す",
    source: "データソース",
    sourceTitle: "今回の計算に使うデータ口径を選択",
    sourceVersion: "データバージョン",
    sourcePending: "このデータソースはまだ接続されていません。現在のテスト版ではSL公式のみ利用できます。",
    sourceReadyPrefix: "データ読み込み済み：2026_06_food.json + 2026_06_non_food.json。現在の口径で",
    sourceReadySuffix: "項目が一致しました。",
    emptyCategory: "カテゴリが選択されていません。少なくとも一つ選んでください。",
    totalItems: "項目",
    monthlyFrequencyLabel: "月間頻度",
    includeCost: "費用に含める",
    back: "前のステップへ",
    confirmResult: "確認して結果を見る",
    sourcePendingButton: "このデータソースは準備中",
    resultEyebrow: "計算結果",
    resultTitle: "SameLife 月間生活費の結果",
    resultHint: "結果は選択カテゴリ、入力頻度、為替レート、データソースに基づきます。データは 2026_06_food.json と 2026_06_non_food.json から読み込みます。",
    currentCost: "現在都市のコスト",
    targetCost: "比較先都市のコスト",
    costRatio: "コスト倍率",
    ratioNote: "人民元換算で比較",
    categoryResult: "カテゴリ別結果",
    categoryHint: "カテゴリをクリックすると詳細を開けます。単価をクリックすると、サンプル・価格・出典リンク・計算口径・5段階信頼度を確認できます。",
    current: "現在",
    target: "比較先",
    item: "項目",
    unit: "単位",
    counted: "含める",
    notCounted: "含めない",
    perMonth: "/ 月",
    currentUnitPrice: "単価",
    sourceReliability: "出典信頼度",
    chartPlaceholder: "統計比較グラフ",
    chartPlaceholderBody: "将来：総コストの棒グラフ、カテゴリ別比較、差が大きい上位5項目などを追加予定。",
    advicePlaceholder: "生活アドバイス",
    advicePlaceholderBody: "将来：コスト差に基づく節約提案、移住時の注意、消費構造のヒントなどを追加予定。",
    downloadPdf: "PDFダウンロード（準備中）",
    downloadData: "データダウンロード（準備中）",
    basketDetail: "商品バスケット詳細",
    adoptedPrice: "採用単価",
    sourceType: "出典タイプ",
    sourceName: "出典名",
    dataDate: "データ日付",
    dataNote: "データ説明：",
    summarySamples: "summary サンプル数：",
    summaryMethod: "summary 計算方法：",
    sampleStats: "サンプル統計：",
    median: "中央値",
    average: "平均",
    min: "最小",
    max: "最大",
    samples: "サンプル",
    sampleRows: "件",
    originalSamples: "元サンプル明細",
    noSample: "サンプル明細なし",
    sample: "サンプル",
    price: "価格",
    sourceColumn: "出典",
    reliability: "信頼度",
    dateArea: "日付/地域",
    feesDiscounts: "費用/割引",
    note: "備考",
    deliveryFee: "配送料",
    serviceFee: "サービス料",
    discount: "割引",
    type: "種類",
    noSampleBody: "この項目には元サンプル明細がまだありません。該当データファイルの items に都市と口径が含まれているか確認してください。",
    yes: "はい",
    no: "いいえ"
  }
};

const JA_CATEGORY_META = {
  food: { label: "食費", desc: "自炊、惣菜・即食、デリバリー、ファストフード、会食、カフェ・茶飲料、スイーツ" },
  transport: { label: "交通", desc: "地下鉄・電車、バス、タクシー、通勤定期、シェア自転車" },
  housing: { label: "住居", desc: "家賃、光熱費、インターネット、携帯、管理費" },
  entertainment: { label: "娯楽", desc: "映画、ジム、配信サービス、展示、イベント、デジタルコンテンツ" },
  daily: { label: "日用品", desc: "洗面用品、紙製品、清掃用品、スキンケア、散髪、常備薬" }
};

const JA_ITEM_TEXT = {
  home_cooking: { name: "自炊", unit: "1食", note: "1〜2人分の食事。2人以上の場合は、この項目を1.5倍にする想定です。" },
  ready_to_eat_food: { name: "即食・惣菜", unit: "1品", note: "コンビニやスーパーのすぐ食べられる食品。" },
  delivery_food: { name: "デリバリー食", unit: "1注文", note: "通常の食事としてのデリバリー注文。配送料やサービス料の有無を区別できます。" },
  fast_food: { name: "ファストフード外食", unit: "1回", note: "マクドナルド、KFC、松屋、吉野家などのファストフードや簡単な外食。" },
  social_dining: { name: "会食・外食", unit: "1回", note: "火鍋、居酒屋、焼肉など、社交目的の外食。" },
  coffee_milk_tea: { name: "カフェ・ミルクティー", unit: "1杯", note: "デリバリー注文を含みます。SL総合では長期クーポンや会員価格を考慮できます。" },
  snack_dessert: { name: "菓子・スイーツ", unit: "1回", note: "コンビニスイーツ、ケーキ、アイス、小さなデザートなど。" },
  metro_train: { name: "地下鉄・電車", unit: "1回" },
  bus: { name: "バス", unit: "1回" },
  taxi_ride_short: { name: "短距離タクシー/配車", unit: "1回" },
  commuter_pass: { name: "通勤定期/定期券", unit: "月額" },
  bike_share: { name: "シェア自転車", unit: "1回" },
  rent_single_apartment: { name: "単身向け賃貸", unit: "月額" },
  rent_shared_room: { name: "シェア/個室", unit: "月額" },
  utilities: { name: "水道・電気・ガス", unit: "月額" },
  home_internet: { name: "家庭用インターネット", unit: "月額" },
  mobile_plan: { name: "携帯プラン", unit: "月額" },
  management_fee: { name: "管理費", unit: "月額" },
  movie_ticket: { name: "映画", unit: "1回" },
  gym: { name: "ジム", unit: "月額" },
  streaming: { name: "動画配信", unit: "月額" },
  museum_exhibition: { name: "博物館・展示", unit: "1回" },
  ktv_live_event: { name: "KTV/ライブ/イベント", unit: "1回" },
  game_digital_content: { name: "ゲーム/デジタルコンテンツ", unit: "1回" },
  shampoo_bodywash: { name: "シャンプー/ボディソープ", unit: "1セット" },
  tissue_toilet_paper: { name: "ティッシュ/トイレットペーパー", unit: "1セット" },
  laundry_cleaning: { name: "洗濯・清掃用品", unit: "1回/1セット" },
  skincare_cosmetics: { name: "スキンケア/化粧品", unit: "1セット" },
  haircut: { name: "散髪", unit: "1回" },
  medicine_drugstore: { name: "常備薬/ドラッグストア", unit: "1セット" }
};

const JA_CITY_LABELS = { tokyo: "東京", beijing: "北京" };
const JA_CURRENCY_LABELS = { CNY: "人民元", JPY: "日本円", USD: "米ドル" };

function t(language, key) {
  return (I18N[language] || I18N["zh-CN"])[key] || I18N["zh-CN"][key] || key;
}

function categoryText(category, language) {
  return language === "ja" ? (JA_CATEGORY_META[category] || CATEGORY_META[category]) : CATEGORY_META[category];
}

function itemText(item, language) {
  const localized = language === "ja" ? JA_ITEM_TEXT[item.id] : null;
  return {
    name: localized?.name || item.name,
    unit: localized?.unit || item.unit,
    note: localized?.note || item.note
  };
}

function cityText(city, language) {
  if (!city) return "";
  return language === "ja" ? (JA_CITY_LABELS[city] || CITIES[city].label) : CITIES[city].label;
}

function currencyText(currency, language) {
  if (!currency) return "";
  return language === "ja" ? (JA_CURRENCY_LABELS[currency] || CURRENCIES[currency].label) : CURRENCIES[currency].label;
}

function dataSourceText(key, language) {
  const meta = DATA_SOURCES[key];
  return {
    label: language === "ja" ? (meta.labelJa || meta.label) : meta.label,
    desc: language === "ja" ? (meta.descJa || meta.desc) : meta.desc
  };
}

function buildDefaultFrequencies() {
  return Object.fromEntries(
    BASKET_ITEMS.map((item) => [item.id, item.defaultMonthlyFrequency])
  );
}

function confidenceLabel(confidence) {
  const map = {
    official: "官方",
    semi_official: "半官方",
    market_sample: "市场样本",
    manual_estimate: "手动估算",
    sl_dataset: "SL数据集",
    missing_data: "暂无数据",
    numbeo: "Numbeo"
  };

  return map[confidence] || confidence;
}

function groupByCategory(items) {
  return items.reduce((grouped, item) => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
    return grouped;
  }, {});
}


function normalizeDataset(dataset, datasetType) {
  return {
    ...dataset,
    datasetType,
    displayName: dataset.displayName || dataset.datasetId
  };
}

const DATASETS = [
  normalizeDataset(foodDataset, "food"),
  normalizeDataset(nonFoodDataset, "non_food")
];

function buildDatasetIndex(datasets) {
  const sampleIndex = new Map();
  const summaryIndex = new Map();

  datasets.forEach((dataset) => {
    (dataset.items || []).forEach((sample) => {
      const key = `${sample.itemId}|${sample.city}|${sample.sourceMode}`;
      if (!sampleIndex.has(key)) sampleIndex.set(key, []);
      sampleIndex.get(key).push({
        ...sample,
        datasetId: dataset.datasetId,
        datasetType: dataset.datasetType,
        datasetDisplayName: dataset.displayName
      });
    });

    (dataset.summary || []).forEach((summary) => {
      const key = `${summary.itemId}|${summary.city}|${summary.sourceMode}`;
      summaryIndex.set(key, {
        ...summary,
        datasetId: dataset.datasetId,
        datasetType: dataset.datasetType,
        datasetDisplayName: dataset.displayName,
        samples: sampleIndex.get(key) || []
      });
    });
  });

  return summaryIndex;
}

const DATASET_INDEX = buildDatasetIndex(DATASETS);

function resolveDatasetPrice(item, city, sourceMode) {
  const key = `${item.id}|${city}|${sourceMode}`;
  const summary = DATASET_INDEX.get(key);

  if (!summary || !Number.isFinite(Number(summary.medianPrice))) {
    return null;
  }

  const firstSample = summary.samples?.find((sample) => sample.sourceUrl) || summary.samples?.[0];
  const score = summary.averageReliabilityScore || summary.reliabilityScore;

  return {
    price: Number(summary.medianPrice),
    currency: summary.currency,
    sourceName: `${summary.datasetDisplayName || summary.datasetId} · ${summary.sampleCount || summary.validSampleCount || 0} 个样本中位数`,
    sourceUrl: firstSample?.sourceUrl || "",
    sourceDate: summary.updatedAt || summary.sourceDate || "2026-06",
    confidence: "sl_dataset",
    note: summary.note,
    sampleCount: summary.sampleCount || summary.validSampleCount || 0,
    method: summary.method,
    sourceMode,
    reliabilityScore: score,
    samples: summary.samples || [],
    summary,
    datasetType: summary.datasetType
  };
}

function applySelectedDataset(items, sourceMode) {
  return items.map((item) => {
    const tokyoPrice = resolveDatasetPrice(item, "tokyo", sourceMode);
    const beijingPrice = resolveDatasetPrice(item, "beijing", sourceMode);

    return {
      ...item,
      tokyo: tokyoPrice || item.tokyo,
      beijing: beijingPrice || item.beijing,
      hasDatasetPrice: Boolean(tokyoPrice && beijingPrice)
    };
  });
}

function countResolvedItems(items) {
  return items.filter((item) => item.hasDatasetPrice).length;
}

function sanitizeDisplayText(value) {
  if (!value) return "";
  return String(value)
    .replaceAll("用户补充", "手动计入")
    .replaceAll("用户填写", "手动计入")
    .replaceAll("用户手动输入", "手动计入")
    .replaceAll("手动输入", "手动计入")
    .replaceAll("手动估算", "手动计入")
    .replaceAll("user_filled", "manual_entry");
}

function sourceKindLabel(kind) {
  const map = {
    official_menu: "官方菜单",
    official_product_page: "官方商品页",
    official_delivery_menu: "官方外送菜单",
    official_course_page: "官方套餐页",
    official_verified: "官方核验",
    platform_product_page: "平台商品页",
    platform_store_page: "平台店铺页",
    platform_course_page: "平台套餐页",
    app_price: "App价格",
    app_checkout: "App结算价",
    manual_entry_range: "手动计入",
    manual_entry_app_price: "手动计入",
    manual_entry_checkout_range: "手动计入",
    manual_entry_range: "手动计入",
    manual_entry_app_price: "手动计入",
    manual_entry_checkout_range: "手动计入",
    manual_entry_app_or_store_price: "手动计入"
  };
  return map[kind] || sanitizeDisplayText(kind || "样本信息");
}

function calculateSampleStats(samples) {
  const prices = samples
    .map((sample) => Number(sample.price))
    .filter((price) => Number.isFinite(price))
    .sort((a, b) => a - b);

  if (prices.length === 0) {
    return null;
  }

  const sum = prices.reduce((total, price) => total + price, 0);
  const middle = Math.floor(prices.length / 2);
  const median = prices.length % 2 === 0
    ? (prices[middle - 1] + prices[middle]) / 2
    : prices[middle];

  return {
    count: prices.length,
    min: prices[0],
    max: prices[prices.length - 1],
    average: sum / prices.length,
    median
  };
}

function yesNo(value, language = "zh-CN") {
  return value ? t(language, "yes") : t(language, "no");
}


function reliabilityScoreToStars(score) {
  if (!Number.isFinite(Number(score))) return "暂无评分";
  const rounded = Math.max(1, Math.min(5, Math.round(Number(score))));
  return "★".repeat(rounded) + "☆".repeat(5 - rounded);
}

function reliabilityScoreLabel(score) {
  if (!Number.isFinite(Number(score))) return "暂无评分";
  return `${reliabilityScoreToStars(score)} ${Number(score).toFixed(1)}/5`;
}

function sampleReliabilityScore(sample) {
  if (Number.isFinite(Number(sample.reliabilityScore))) {
    return Number(sample.reliabilityScore);
  }

  const sourceKind = String(sample.sourceKind || "").toLowerCase();
  const sourceReliability = sample.sourceReliability;

  if (sourceReliability === "A" || sourceKind.startsWith("official_")) return 5;
  if ((sourceKind.startsWith("manual_entry") || sourceKind.startsWith("user_filled")) && !sample.needsConfirmation) return 4;
  if (sourceKind.startsWith("manual_entry") || sourceKind.startsWith("user_filled") || sample.needsConfirmation) return 3;
  if (sourceReliability === "D" || sourceKind.includes("news") || sourceKind.includes("report")) return 2;
  if (sourceReliability === "C" || sourceKind.includes("platform")) return 3;
  return 1;
}

function cityPriceReliabilityScore(cityPrice) {
  if (Number.isFinite(Number(cityPrice.reliabilityScore))) {
    return Number(cityPrice.reliabilityScore);
  }

  const samples = cityPrice.samples || [];
  const scores = samples
    .map((sample) => sampleReliabilityScore(sample))
    .filter((score) => Number.isFinite(score));

  if (scores.length > 0) {
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }

  const fallback = {
    official: 5,
    semi_official: 4,
    sl_dataset: 4,
    market_sample: 3,
    manual_estimate: 3,
    numbeo: 3,
    missing_data: 1
  };

  return fallback[cityPrice.confidence] || 1;
}


function calculateCityNativeTotal(city, items, frequencies) {
  if (!city) return 0;

  return items.reduce((sum, item) => {
    const monthlyFrequency = Number(frequencies[item.id]) || 0;
    return sum + item[city].price * monthlyFrequency;
  }, 0);
}

function DetailModal({ item, city, language, onClose }) {
  if (!item || !city) return null;

  const cityPrice = item[city];
  const text = itemText(item, language);
  const samples = cityPrice.samples || [];
  const sampleStats = calculateSampleStats(samples);
  const hasSamples = samples.length > 0;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="modal wide-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <div>
            <span className="eyebrow">{t(language, "basketDetail")}</span>
            <h3>{text.name} · {cityText(city, language)}</h3>
          </div>
          <button type="button" className="icon-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-grid">
          <div>
            <strong>{t(language, "adoptedPrice")}</strong>
            <p>{formatMoney(cityPrice.price, cityPrice.currency)} / {text.unit}</p>
            {text.note && <p className="modal-extra-note">{text.note}</p>}
          </div>
          <div>
            <strong>{t(language, "sourceType")}</strong>
            <p>{cityPrice.sourceMode ? `${cityPrice.sourceMode} · ` : ""}{reliabilityScoreLabel(cityPriceReliabilityScore(cityPrice))}</p>
          </div>
          <div>
            <strong>{t(language, "sourceName")}</strong>
            <p>{sanitizeDisplayText(cityPrice.sourceName)}</p>
          </div>
          <div>
            <strong>{t(language, "dataDate")}</strong>
            <p>{cityPrice.sourceDate}</p>
          </div>
        </div>

        <div className="modal-note">
          {cityPrice.note && (
            <p><strong>{t(language, "dataNote")}</strong>{sanitizeDisplayText(cityPrice.note)}</p>
          )}
          {cityPrice.sampleCount && (
            <p><strong>{t(language, "summarySamples")}</strong>{cityPrice.sampleCount}；<strong>{t(language, "summaryMethod")}</strong>{cityPrice.method || "median"}</p>
          )}
          {sampleStats && (
            <p>
              <strong>{t(language, "sampleStats")}</strong>
              {t(language, "median")} {formatMoney(sampleStats.median, cityPrice.currency)}；
              {t(language, "average")} {formatMoney(sampleStats.average, cityPrice.currency)}；
              {t(language, "min")} {formatMoney(sampleStats.min, cityPrice.currency)}；
              {t(language, "max")} {formatMoney(sampleStats.max, cityPrice.currency)}；
              {t(language, "samples")} {sampleStats.count} {t(language, "sampleRows")}
            </p>
          )}
        </div>

        <div className="sample-section">
          <div className="sample-section-head">
            <h4>{t(language, "originalSamples")}</h4>
            <span>{hasSamples ? `${samples.length} ${t(language, "sampleRows")}` : t(language, "noSample")}</span>
          </div>

          {hasSamples ? (
            <div className="sample-table-wrap">
              <table className="sample-table">
                <thead>
                  <tr>
                    <th>{t(language, "sample")}</th>
                    <th>{t(language, "price")}</th>
                    <th>{t(language, "sourceColumn")}</th>
                    <th>{t(language, "reliability")}</th>
                    <th>{t(language, "dateArea")}</th>
                    <th>{t(language, "feesDiscounts")}</th>
                    <th>{t(language, "note")}</th>
                  </tr>
                </thead>
                <tbody>
                  {samples.map((sample, index) => (
                    <tr key={`${sample.itemId}-${sample.city}-${sample.sourceMode}-${index}`}>
                      <td>
                        <strong>{sanitizeDisplayText(sample.sampleName)}</strong>
                        <br />
                        <span className="muted">{sample.sourceMode}</span>
                      </td>
                      <td>{formatMoney(sample.price, sample.currency)}</td>
                      <td>
                        {sample.sourceUrl ? (
                          <a href={sample.sourceUrl} target="_blank" rel="noreferrer">{sanitizeDisplayText(sample.sourceName)}</a>
                        ) : (
                          sanitizeDisplayText(sample.sourceName)
                        )}
                      </td>
                      <td>
                        <span className="score-badge">{reliabilityScoreLabel(sampleReliabilityScore(sample))}</span>
                        {sample.reliabilityReason && (
                          <>
                            <br />
                            <span className="muted">{sanitizeDisplayText(sample.reliabilityReason)}</span>
                          </>
                        )}
                      </td>
                      <td>
                        {sample.sourceDate}
                        <br />
                        <span className="muted">{sample.districtOrArea || "-"}</span>
                      </td>
                      <td>
                        {t(language, "deliveryFee")}：{yesNo(sample.includeDeliveryFee, language)}
                        <br />
                        {t(language, "serviceFee")}：{yesNo(sample.includeServiceFee, language)}
                        <br />
                        {t(language, "discount")}：{yesNo(sample.includeCoupon, language)}
                        <br />
                        <span className="muted">{t(language, "type")}：{sample.couponType || "none"}</span>
                      </td>
                      <td>
                        <span>{sanitizeDisplayText(sample.note) || "-"}</span>
                        {(sample.sourceKind || sample.dataQuality) && (
                          <>
                            <br />
                            <span className="tag data-quality-tag">{sourceKindLabel(sample.sourceKind || sample.dataQuality)}</span>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty">
              {t(language, "noSampleBody")}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState("zh-CN");
  const [dataSource, setDataSource] = useState("sl_official");

  const [currentCity, setCurrentCity] = useState("");
  const [targetCity, setTargetCity] = useState("");

  const [currentCurrency, setCurrentCurrency] = useState("");
  const [targetCurrency, setTargetCurrency] = useState("");

  const [selectedCategories, setSelectedCategories] = useState(
    new Set(DEFAULT_SELECTED_CATEGORIES)
  );

  const [openCategories, setOpenCategories] = useState(
    new Set(DEFAULT_SELECTED_CATEGORIES)
  );

  const [frequencies, setFrequencies] = useState(buildDefaultFrequencies);
  const [rates, setRates] = useState(FALLBACK_RATES);
  const [rateStatus, setRateStatus] = useState("loading");
  const [rateDate, setRateDate] = useState("");
  const [modalTarget, setModalTarget] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadRates() {
      try {
        const liveRates = await fetchLiveRates();
        if (isMounted) {
          setRates(liveRates);
          setRateStatus("live");
          setRateDate(new Date().toLocaleString("zh-CN"));
        }
      } catch (error) {
        if (isMounted) {
          setRates(FALLBACK_RATES);
          setRateStatus("fallback");
          setRateDate("");
        }
      }
    }

    loadRates();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (currentCity && targetCity && currentCity === targetCity) {
      setTargetCity("");
    }
  }, [currentCity, targetCity]);

  const setupComplete = Boolean(
    currentCity && targetCity && currentCurrency && targetCurrency && currentCity !== targetCity
  );

  const resolvedItems = useMemo(() => {
    return applySelectedDataset(BASKET_ITEMS, dataSource);
  }, [dataSource]);

  const resolvedDataCount = useMemo(() => {
    return countResolvedItems(resolvedItems);
  }, [resolvedItems]);

  const selectedItems = useMemo(() => {
    return resolvedItems.filter((item) => selectedCategories.has(item.category));
  }, [resolvedItems, selectedCategories]);

  const groupedItems = useMemo(() => groupByCategory(selectedItems), [selectedItems]);

  const categoryOrder = useMemo(() => {
    return Object.keys(CATEGORY_META).filter((category) => groupedItems[category]?.length > 0);
  }, [groupedItems]);

  const frequencyColumns = useMemo(() => {
    return [
      categoryOrder.filter((_, index) => index % 2 === 0),
      categoryOrder.filter((_, index) => index % 2 === 1)
    ];
  }, [categoryOrder]);

  const currentNativeTotal = useMemo(() => {
    return calculateCityNativeTotal(currentCity, selectedItems, frequencies);
  }, [currentCity, selectedItems, frequencies]);

  const targetNativeTotal = useMemo(() => {
    return calculateCityNativeTotal(targetCity, selectedItems, frequencies);
  }, [targetCity, selectedItems, frequencies]);

  const currentDisplayTotal = convertCurrency(
    currentNativeTotal,
    currentCity ? CITIES[currentCity].nativeCurrency : currentCurrency,
    currentCurrency,
    rates
  );

  const targetDisplayTotal = convertCurrency(
    targetNativeTotal,
    targetCity ? CITIES[targetCity].nativeCurrency : targetCurrency,
    targetCurrency,
    rates
  );

  const currentCounterpartTotal = convertCurrency(
    currentNativeTotal,
    currentCity ? CITIES[currentCity].nativeCurrency : currentCurrency,
    targetCurrency,
    rates
  );

  const targetCounterpartTotal = convertCurrency(
    targetNativeTotal,
    targetCity ? CITIES[targetCity].nativeCurrency : targetCurrency,
    currentCurrency,
    rates
  );

  const currentInCny = convertCurrency(
    currentNativeTotal,
    currentCity ? CITIES[currentCity].nativeCurrency : "CNY",
    "CNY",
    rates
  );

  const targetInCny = convertCurrency(
    targetNativeTotal,
    targetCity ? CITIES[targetCity].nativeCurrency : "CNY",
    "CNY",
    rates
  );

  const ratio = targetInCny > 0 ? currentInCny / targetInCny : 0;

  const fxPreview = currentCurrency && targetCurrency && currentCurrency !== targetCurrency
    ? convertCurrency(1, currentCurrency, targetCurrency, rates)
    : null;

  function toggleCategorySelected(category) {
    const next = new Set(selectedCategories);
    if (next.has(category)) {
      next.delete(category);
    } else {
      next.add(category);
      setOpenCategories((prev) => new Set([...prev, category]));
    }
    setSelectedCategories(next);
  }

  function toggleCategoryOpen(category) {
    const next = new Set(openCategories);
    if (next.has(category)) next.delete(category);
    else next.add(category);
    setOpenCategories(next);
  }

  function updateFrequency(itemId, value) {
    const parsed = Number(value);
    setFrequencies((prev) => ({
      ...prev,
      [itemId]: Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
    }));
  }

  function resetFrequencies() {
    setFrequencies(buildDefaultFrequencies());
  }

  function selectAllCategories() {
    const allCategories = Object.keys(CATEGORY_META);
    setSelectedCategories(new Set(allCategories));
    setOpenCategories(new Set(allCategories));
  }

  function collapseAllCategories() {
    setOpenCategories(new Set());
  }

  function goToStep(nextStep) {
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="page">
      <header className="topbar">
        <div className="brand-mark" aria-label="SameLife V0.7-Final">
          <span className="brand-name">SameLife</span>
          <span className="version-pill">V0.7-Final</span>
        </div>
        <label className="language-switcher">
          <span>{t(language, "language")}</span>
          <select value={language} onChange={(event) => setLanguage(event.target.value)}>
            <option value="zh-CN">简体中文</option>
            <option value="en" disabled>English（Coming soon）</option>
            <option value="ja">日本語</option>
          </select>
        </label>
      </header>

      <section className="hero compact-hero">
<h1>{t(language, "heroTitle")}</h1>
        <p>
          {t(language, "heroSubtitle")}
        </p>
      </section>

      {step === 1 && (
        <section className="panel step-panel">
          <div className="intro-grid">
            <div>
              <span className="eyebrow">{t(language, "projectIntro")}</span>
              <h2>{t(language, "introTitle")}</h2>
              <p className="lead">{t(language, "introLead")}</p>
              <p className="lead intro-principles">{t(language, "principlesIntro")}</p>

              <div className="info-list">
                <div>
                  <strong>{t(language, "principleTargetedTitle")}</strong>
                  <p>{t(language, "principleTargetedBody")}</p>
                </div>
                <div>
                  <strong>{t(language, "principleLowCostTitle")}</strong>
                  <p>{t(language, "principleLowCostBody")}</p>
                </div>
                <div>
                  <strong>{t(language, "principleTransparentTitle")}</strong>
                  <p>{t(language, "principleTransparentBody")}</p>
                </div>
              </div>
            </div>

            <div className="settings-card">
              <h2>{t(language, "settingsTitle")}</h2>

              <div className="field">
                <label htmlFor="currentCity">{t(language, "currentCity")}</label>
                <select id="currentCity" value={currentCity} onChange={(event) => setCurrentCity(event.target.value)}>
                  <option value="">{t(language, "pleaseSelect")}</option>
                  {Object.entries(CITIES).map(([city, meta]) => (
                    <option key={city} value={city}>{cityText(city, language)}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="currentCurrency">{t(language, "currentCurrency")}</label>
                <select id="currentCurrency" value={currentCurrency} onChange={(event) => setCurrentCurrency(event.target.value)}>
                  <option value="">{t(language, "pleaseSelect")}</option>
                  {Object.entries(CURRENCIES).map(([currency, meta]) => (
                    <option key={currency} value={currency}>{currencyText(currency, language)} {currency}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="targetCity">{t(language, "targetCity")}</label>
                <select id="targetCity" value={targetCity} onChange={(event) => setTargetCity(event.target.value)}>
                  <option value="">{t(language, "pleaseSelect")}</option>
                  {Object.entries(CITIES).map(([city, meta]) => (
                    <option key={city} value={city} disabled={city === currentCity}>{cityText(city, language)}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="targetCurrency">{t(language, "targetCurrency")}</label>
                <select id="targetCurrency" value={targetCurrency} onChange={(event) => setTargetCurrency(event.target.value)}>
                  <option value="">{t(language, "pleaseSelect")}</option>
                  {Object.entries(CURRENCIES).map(([currency, meta]) => (
                    <option key={currency} value={currency}>{currencyText(currency, language)} {currency}</option>
                  ))}
                </select>
              </div>

              <div className={`rate-box ${rateStatus}`}>
                <strong>{t(language, "exchangeStatus")}</strong>
                {rateStatus === "live" && <span>{t(language, "liveRate")} · {rateDate}</span>}
                {rateStatus === "loading" && <span>{t(language, "loadingRate")}</span>}
                {rateStatus === "fallback" && <span>{t(language, "fallbackRate")}</span>}
              </div>

              <div className="fx-preview">
                <span>{t(language, "fxPreview")}</span>
                {!currentCurrency || !targetCurrency ? (
                  <strong>{t(language, "selectCurrenciesFirst")}</strong>
                ) : currentCurrency === targetCurrency ? (
                  <strong>{t(language, "sameCurrency")}</strong>
                ) : (
                  <strong>1 {currentCurrency} ≈ {fxPreview.toFixed(4)} {targetCurrency}</strong>
                )}
              </div>

              {!setupComplete && (
                <p className="form-warning">{t(language, "setupWarning")}</p>
              )}

              <div className="button-row end">
                <button type="button" onClick={() => goToStep(2)} disabled={!setupComplete}>
                  {t(language, "nextFrequency")}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="panel step-panel">
          <div className="section-head">
            <div>
              <span className="eyebrow">{t(language, "monthlyFrequency")}</span>
              <h2>{t(language, "frequencyTitle")}</h2>
              
            </div>
            <div className="button-row no-top-margin">
              <button type="button" className="secondary" onClick={selectAllCategories}>{t(language, "selectAll")}</button>
              <button type="button" className="secondary" onClick={collapseAllCategories}>{t(language, "collapseAll")}</button>
              <button type="button" className="secondary" onClick={resetFrequencies}>{t(language, "resetFrequency")}</button>
            </div>
          </div>

          <div className="source-selector-card">
            <div>
              <span className="eyebrow">{t(language, "source")}</span>
              <h3>{t(language, "sourceTitle")}</h3>
              <p>{dataSourceText(dataSource, language).desc}</p>
            </div>
            <label className="source-select">
              <span>{t(language, "sourceVersion")}</span>
              <select value={dataSource} onChange={(event) => setDataSource(event.target.value)}>
                {Object.entries(DATA_SOURCES).map(([key, meta]) => (
                  <option key={key} value={key}>{dataSourceText(key, language).label}</option>
                ))}
              </select>
            </label>
          </div>

          <div className={`source-note ${dataSource !== "sl_official" ? "warning" : ""}`}>
            {dataSource !== "sl_official"
              ? t(language, "sourcePending")
              : `${t(language, "sourceReadyPrefix")} ${resolvedDataCount} ${t(language, "sourceReadySuffix")}`}
          </div>
<div className="category-picker horizontal">
            {Object.entries(CATEGORY_META).map(([category, meta]) => (
              <label className="category-check" key={category}>
                <span>
                  <strong>{categoryText(category, language).label}</strong>
                  <small>{categoryText(category, language).desc}</small>
                </span>
                <input type="checkbox" checked={selectedCategories.has(category)} onChange={() => toggleCategorySelected(category)} />
              </label>
            ))}
          </div>

          {Object.keys(groupedItems).length === 0 && <div className="empty">{t(language, "emptyCategory")}</div>}

          <div className="frequency-category-grid">
            {frequencyColumns.map((columnCategories, columnIndex) => (
              <div className="frequency-column" key={columnIndex}>
                {columnCategories.map((category) => {
                  const items = groupedItems[category] || [];
                  const isOpen = openCategories.has(category);
                  return (
                    <section className="accordion" key={category}>
                      <button type="button" className="accordion-head" onClick={() => toggleCategoryOpen(category)}>
                        <span>
                          <strong>{categoryText(category, language).label}</strong>
                          <small>{categoryText(category, language).desc}</small>
                        </span>
                        <span className="category-sum">{items.length} {t(language, "totalItems")} <b>{isOpen ? "−" : "+"}</b></span>
                      </button>

                      {isOpen && (
                        <div className="accordion-body">
                          {items.map((item) => (
                            <div className="item-row frequency-only" key={item.id}>
                              <div className="item-name">
                                <strong>{itemText(item, language).name}</strong>
                                <small>{t(language, "unit")}：{itemText(item, language).unit}</small>{itemText(item, language).note && <small className="item-note">{itemText(item, language).note}</small>}
                              </div>
                              {item.noFrequency ? (
                                <label className="include-check">
                                  <span>{t(language, "includeCost")}</span>
                                  <input
                                    type="checkbox"
                                    checked={(Number(frequencies[item.id]) || 0) > 0}
                                    onChange={(event) => updateFrequency(item.id, event.target.checked ? 1 : 0)}
                                  />
                                </label>
                              ) : (
                                <div className="field compact">
                                  <label htmlFor={`freq-${item.id}`}>{t(language, "monthlyFrequencyLabel")}</label>
                                  <input
                                    id={`freq-${item.id}`}
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={frequencies[item.id]}
                                    onChange={(event) => updateFrequency(item.id, event.target.value)}
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="bottom-actions">
            <button type="button" className="secondary" onClick={() => goToStep(1)}>{t(language, "back")}</button>
            <button type="button" onClick={() => goToStep(3)} disabled={selectedItems.length === 0 || dataSource !== "sl_official"}>
              {dataSource === "sl_official" ? t(language, "confirmResult") : t(language, "sourcePendingButton")}
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="result-layout">
          <section className="panel">
            <div>
              <span className="eyebrow">{t(language, "resultEyebrow")}</span>
              <h2>{t(language, "resultTitle")}</h2>
              <p className="hint">{t(language, "resultHint")}</p>
            </div>

            <div className="result-grid">
              <div className="result-card primary">
                <span>{t(language, "currentCost")}</span>
                <strong>
                  {formatMoney(currentDisplayTotal, currentCurrency)}
                  {currentCurrency !== targetCurrency && <span className="counterpart-money">（{formatMoney(currentCounterpartTotal, targetCurrency)}）</span>}
                </strong>
              </div>

              <div className="result-card">
                <span>{t(language, "targetCost")}</span>
                <strong>
                  {formatMoney(targetDisplayTotal, targetCurrency)}
                  {currentCurrency !== targetCurrency && <span className="counterpart-money">（{formatMoney(targetCounterpartTotal, currentCurrency)}）</span>}
                </strong>
              </div>

              <div className="result-card">
                <span>{t(language, "costRatio")}</span>
                <strong>{ratio ? `${ratio.toFixed(2)}x` : "-"}</strong>
                <small>{cityText(currentCity, language)} / {cityText(targetCity, language)}，{t(language, "ratioNote")}</small>
              </div>
            </div>
          </section>

          <section className="panel">
            <h2>{t(language, "categoryResult")}</h2>
            <p className="hint">{t(language, "categoryHint")}</p>

            {Object.entries(groupedItems).map(([category, items]) => {
              const isOpen = openCategories.has(category);
              const currentCategoryNative = calculateCityNativeTotal(currentCity, items, frequencies);
              const targetCategoryNative = calculateCityNativeTotal(targetCity, items, frequencies);
              const currentCategoryDisplay = convertCurrency(currentCategoryNative, CITIES[currentCity].nativeCurrency, currentCurrency, rates);
              const targetCategoryDisplay = convertCurrency(targetCategoryNative, CITIES[targetCity].nativeCurrency, targetCurrency, rates);

              return (
                <section className="accordion" key={category}>
                  <button type="button" className="accordion-head" onClick={() => toggleCategoryOpen(category)}>
                    <span>
                      <strong>{categoryText(category, language).label}</strong>
                      <small>{t(language, "current")}：{formatMoney(currentCategoryDisplay, currentCurrency)} · {t(language, "target")}：{formatMoney(targetCategoryDisplay, targetCurrency)}</small>
                    </span>
                    <span className="category-sum">{items.length} {t(language, "totalItems")} <b>{isOpen ? "−" : "+"}</b></span>
                  </button>

                  {isOpen && (
                    <div className="detail-table-wrap">
                      <table className="result-detail-table">
                        <colgroup>
                          <col className="col-item" />
                          <col className="col-frequency" />
                          <col className="col-price" />
                          <col className="col-price" />
                          <col className="col-confidence" />
                        </colgroup>
                        <thead>
                          <tr>
                            <th>{t(language, "item")}</th>
                            <th>{t(language, "monthlyFrequencyLabel")}</th>
                            <th>{cityText(currentCity, language)}{t(language, "currentUnitPrice")}</th>
                            <th>{cityText(targetCity, language)}{t(language, "currentUnitPrice")}</th>
                            <th>{t(language, "sourceReliability")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item) => (
                            <tr key={item.id}>
                              <td><strong>{itemText(item, language).name}</strong><br /><span className="muted">{t(language, "unit")}：{itemText(item, language).unit}</span></td>
                              <td>{item.noFrequency ? ((Number(frequencies[item.id]) || 0) > 0 ? t(language, "counted") : t(language, "notCounted")) : `${frequencies[item.id]} ${t(language, "perMonth")}`}</td>
                              <td><button type="button" className="link-button" onClick={() => setModalTarget({ item, city: currentCity })}>{formatMoney(item[currentCity].price, item[currentCity].currency)}</button></td>
                              <td><button type="button" className="link-button" onClick={() => setModalTarget({ item, city: targetCity })}>{formatMoney(item[targetCity].price, item[targetCity].currency)}</button></td>
                              <td className="confidence-cell">
                                <span className="confidence-inline">
                                  <span className="tag score-tag">{cityText(currentCity, language)}：{reliabilityScoreLabel(cityPriceReliabilityScore(item[currentCity]))}</span>
                                  <span className="tag score-tag">{cityText(targetCity, language)}：{reliabilityScoreLabel(cityPriceReliabilityScore(item[targetCity]))}</span>
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              );
            })}
          </section>

          <section className="panel placeholder-grid">
            <div className="placeholder-card">
              <h2>{t(language, "chartPlaceholder")}</h2>
              <p>{t(language, "chartPlaceholderBody")}</p>
            </div>
            <div className="placeholder-card">
              <h2>{t(language, "advicePlaceholder")}</h2>
              <p>{t(language, "advicePlaceholderBody")}</p>
            </div>
          </section>

          <section className="panel result-footer-actions">
            <button type="button" className="secondary" onClick={() => goToStep(2)}>{t(language, "back")}</button>
            <div className="button-row no-top-margin right-buttons">
              <button type="button" disabled>{t(language, "downloadPdf")}</button>
              <button type="button" disabled>{t(language, "downloadData")}</button>
            </div>
          </section>
        </section>
      )}

      {modalTarget && <DetailModal item={modalTarget.item} city={modalTarget.city} language={language} onClose={() => setModalTarget(null)} />}
    </main>
  );
}
