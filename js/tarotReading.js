/**
 * 塔羅牌 AI 解讀服務
 * 負責處理塔羅牌的抽取、解讀生成等核心功能
 */

// 添加內置備用數據
const FALLBACK_TAROT_DATA = {
  majorArcana: [
    {
      id: 0,
      name: "愚者",
      nameEn: "The Fool",
      keywords: {
        upright: ["新開始", "冒險", "純真", "自發性"],
        reversed: ["魯莽", "輕率", "風險", "貿然行事"],
      },
      meanings: {
        upright: {
          general: "愚者代表著新的開始、冒險和未知的可能性。它象徵著無限的潛力和開放的心態。",
          love: "在感情方面，愚者暗示著新的浪漫可能性或關係中的新階段。",
          career: "職業上，愚者代表著新的機會、創意思維和冒險精神。",
          wealth: "財務上，愚者提醒我們保持靈活性和開放態度。",
          health: "健康方面，愚者象徵活力和精神煥發。",
        },
        reversed: {
          general: "逆位的愚者警告我們不要過於衝動或輕率。",
          love: "感情中，逆位愚者可能表示衝動的決定或對關係的恐懼。",
          career: "職業上，逆位愚者提醒我們在尋求新機會時不要太過魯莽。",
          wealth: "財務方面，逆位愚者警告不要盲目投資或做出不理性的財務決策。",
          health: "健康上，逆位愚者可能暗示忽視健康警訊或過於冒險的行為。",
        },
      },
      symbolism: "愚者通常描繪為站在懸崖邊的年輕人，象徵著未知的冒險。",
      imgUrl: "./assets/images/tarot/major/fool.jpg",
    },
    {
      id: 1,
      name: "魔術師",
      nameEn: "The Magician",
      keywords: {
        upright: ["創造力", "意志力", "技能", "專注"],
        reversed: ["操縱", "欺騙", "未實現的潛能", "猶豫不決"],
      },
      meanings: {
        upright: {
          general: "魔術師象徵著將想法轉化為現實的能力，代表著創造力、意志力和技能。",
          love: "在感情上，魔術師表示你有能力創造理想的關係，吸引你想要的伴侶。",
          career: "職業方面，魔術師代表專業技能的發揮和創新的能力。",
          wealth: "財務上，魔術師象徵著正確運用資源和知識來實現財富增長。",
          health: "健康方面，魔術師表示你有能力通過自律和專注改善健康。",
        },
        reversed: {
          general: "逆位的魔術師可能暗示操縱、欺騙或未實現的潛能。",
          love: "感情中，逆位魔術師可能表示操縱行為或不誠實。",
          career: "職業上，逆位魔術師可能代表技能未被充分利用或缺乏專注。",
          wealth: "財務方面，逆位魔術師警告可能存在欺騙或資源誤用的情況。",
          health: "健康上，逆位魔術師可能暗示缺乏自律或對健康問題的忽視。",
        },
      },
      symbolism: "魔術師通常站在一張裝有各種工具的桌前，象徵著他掌握了實現目標所需的所有資源。",
      imgUrl: "./assets/images/tarot/major/magician.jpg",
    },
  ],
};

// 初始化tarotData為內置備用數據
let tarotData = FALLBACK_TAROT_DATA;

// 嘗試動態導入正式數據
try {
  console.log("正在導入 tarotData.js...");
  // 使用動態import
  import("./tarotData.js")
    .then(module => {
      console.log("tarotData 動態導入成功");
      // 只有在成功導入時才替換
      if (module && module.default) {
        tarotData = module.default;
        console.log("tarotData 設置完成: 使用正式資料");
      } else {
        console.warn("tarotData 模塊導入成功但格式不正確，使用備用數據");
      }
    })
    .catch(error => {
      console.error("tarotData.js 動態導入失敗:", error);
      console.log("繼續使用內置備用數據");
    });
} catch (error) {
  console.error("tarotData.js 導入嘗試失敗:", error);
  console.log("使用內置備用數據");
}

class TarotReading {
  constructor() {
    console.log("TarotReading 類被實例化");
    this.divinationType = ""; // 占卜類型（愛情、事業、財運等）
    this.spreadType = ""; // 牌陣類型（單張、三張、凱爾特十字等）
    this.userQuestion = ""; // 用戶問題
    this.selectedCards = []; // 已選擇的卡牌
    this.deckReady = false; // 牌庫是否準備好（洗牌完成）

    // 確保在實例化時有數據可用
    if (!tarotData) {
      console.warn("tarotData未就緒，使用備用數據");
      tarotData = FALLBACK_TAROT_DATA;
    }
  }

  /**
   * 初始化塔羅占卜服務
   * @param {string} divinationType - 占卜類型
   * @param {string} spreadType - 牌陣類型
   * @param {string} userQuestion - 用戶問題
   */
  initialize(divinationType, spreadType, userQuestion) {
    console.log("TarotReading.initialize() 被調用", { divinationType, spreadType, userQuestion });
    this.divinationType = divinationType;
    this.spreadType = spreadType;
    this.userQuestion = userQuestion;
    this.selectedCards = [];

    // 返回一個延遲解決的Promise，模擬洗牌時間
    return new Promise(resolve => {
      console.log("洗牌過程開始 (Promise)...");
      setTimeout(() => {
        console.log("洗牌過程完成 (Promise)");
        this.deckReady = true;
        resolve(true);
      }, 3000); // 洗牌時間設為3秒
    });
  }

  /**
   * 抽取一張塔羅牌
   * @param {boolean} isReversed - 是否為逆位（可選，有20%概率為逆位）
   * @returns {Object} 抽出的牌的信息
   */
  drawCard(isReversed = Math.random() < 0.2) {
    console.log("TarotReading.drawCard() 被調用", { isReversed, deckReady: this.deckReady });

    if (!this.deckReady) {
      console.error("抽牌時牌庫未準備好");
      throw new Error("牌庫尚未準備好，請先完成洗牌");
    }

    try {
      // 確保有數據可用
      if (!tarotData || !tarotData.majorArcana || !tarotData.majorArcana.length) {
        console.warn("抽牌時數據不可用，使用備用數據");
        tarotData = FALLBACK_TAROT_DATA;
      }

      // 抽取主要阿爾卡納牌
      const majorArcanaLength = tarotData.majorArcana.length;
      console.log(`可用大阿爾卡納牌: ${majorArcanaLength} 張`);

      const randomIndex = Math.floor(Math.random() * majorArcanaLength);
      console.log(`隨機抽取索引: ${randomIndex}`);

      const card = { ...tarotData.majorArcana[randomIndex] };
      console.log(`抽到的牌: ${card.name}`);

      // 設置牌的正逆位
      card.isReversed = isReversed;
      console.log(`牌的正逆位: ${isReversed ? "逆位" : "正位"}`);

      // 將牌添加到已選擇的牌組中
      this.selectedCards.push(card);
      console.log(`當前已選擇 ${this.selectedCards.length} 張牌`);

      return card;
    } catch (error) {
      console.error("抽牌過程中發生錯誤:", error);

      // 創建一個緊急備用卡牌
      const fallbackCard = {
        id: 999,
        name: "緊急備用卡",
        nameEn: "Emergency Card",
        keywords: { upright: ["恢復", "應急"], reversed: ["錯誤", "失敗"] },
        meanings: {
          upright: { general: "這是一個系統生成的備用卡片，表示原本的卡片生成過程出現問題。" },
          reversed: { general: "這是一個系統生成的備用卡片，表示原本的卡片生成過程出現問題。" },
        },
        symbolism: "緊急恢復",
        imgUrl: "https://via.placeholder.com/150/FF0000/FFFFFF?text=Error",
        isReversed: false,
      };

      this.selectedCards.push(fallbackCard);
      return fallbackCard;
    }
  }

  /**
   * 獲取已選擇卡牌的位置含義
   * @returns {Array} 包含卡牌位置信息的數組
   */
  getPositionMeanings() {
    switch (this.spreadType) {
      case "single":
        return ["核心訊息"];
      case "three":
        return ["過去", "現在", "未來"];
      case "celtic":
        return ["當前狀況", "挑戰", "過去基礎", "即將離去", "可能發展", "近期未來", "自我認知", "外在影響", "希望或恐懼", "最終結果"];
      default:
        return [];
    }
  }

  /**
   * 生成完整的塔羅牌解讀
   * @returns {Object} 包含總體解讀和每張牌解讀的對象
   */
  generateReading() {
    if (this.selectedCards.length === 0) {
      throw new Error("尚未抽取任何塔羅牌");
    }

    const positions = this.getPositionMeanings();
    const cardReadings = [];
    const allKeywords = [];

    // 為每張牌生成解讀
    this.selectedCards.forEach((card, index) => {
      const position = positions[index] || `位置${index + 1}`;
      const keywords = card.isReversed ? card.keywords.reversed : card.keywords.upright;
      allKeywords.push(...keywords.slice(0, 3));

      // 獲取對應領域的解讀
      const area = this.getMeaningArea();
      const meaning = card.isReversed ? card.meanings.reversed[area] : card.meanings.upright[area];

      // 為空時使用general
      const specificMeaning = meaning || (card.isReversed ? card.meanings.reversed.general : card.meanings.upright.general);

      cardReadings.push({
        position,
        name: card.name,
        nameEn: card.nameEn,
        isReversed: card.isReversed,
        orientation: card.isReversed ? "逆位" : "正位",
        keywords: keywords,
        meaning: specificMeaning,
        symbolism: card.symbolism,
        imgUrl: card.imgUrl,
      });
    });

    // 生成總體解讀
    const overallReading = this.generateOverallReading(cardReadings, allKeywords);

    // 生成行動建議
    const actionAdvice = this.generateActionAdvice(cardReadings, allKeywords);

    return {
      divinationType: this.divinationType,
      spreadType: this.spreadType,
      userQuestion: this.userQuestion,
      cardReadings,
      overallReading,
      actionAdvice,
    };
  }

  /**
   * 根據占卜類型獲取解讀領域
   * @returns {string} 解讀領域（love, career, wealth, health, general）
   */
  getMeaningArea() {
    switch (this.divinationType) {
      case "love":
        return "love";
      case "career":
        return "career";
      case "wealth":
        return "wealth";
      case "health":
        return "health";
      default:
        return "general";
    }
  }

  /**
   * 生成總體解讀
   * @param {Array} cardReadings - 卡牌解讀數組
   * @param {Array} keywords - 關鍵詞數組
   * @returns {string} 總體解讀文本
   */
  generateOverallReading(cardReadings, keywords) {
    // 根據占卜類型選擇開頭語
    const introByType = {
      love: "在你的感情關係中，",
      career: "關於你的職業發展，",
      wealth: "就財務狀況而言，",
      health: "針對你的健康情況，",
      general: "根據你的問題，",
    };

    const intro = introByType[this.divinationType] || introByType.general;

    // 根據牌陣類型生成不同的解讀結構
    if (this.spreadType === "single") {
      return `${intro}這張塔羅牌${cardReadings[0].name}${cardReadings[0].isReversed ? "逆位" : "正位"}傳達了重要訊息。${
        cardReadings[0].meaning
      }這表明你現在面臨的情況需要特別關注${keywords.slice(0, 3).join("、")}等方面。`;
    }

    if (this.spreadType === "three") {
      return `${intro}塔羅牌陣顯示你的過去受到${cardReadings[0].name}${cardReadings[0].isReversed ? "逆位" : "正位"}的影響，意味著${cardReadings[0].keywords
        .slice(0, 2)
        .join("和")}在你的過去扮演重要角色。目前，${cardReadings[1].name}${cardReadings[1].isReversed ? "逆位" : "正位"}表明你正經歷著${cardReadings[1].keywords
        .slice(0, 2)
        .join("和")}的能量。未來的發展則由${cardReadings[2].name}${cardReadings[2].isReversed ? "逆位" : "正位"}指引，提示你將面臨${cardReadings[2].keywords
        .slice(0, 2)
        .join("和")}的可能性。這三張牌共同揭示了一個從${keywords[0]}到${keywords[2]}，最終走向${keywords[4]}的旅程。`;
    }

    // 更複雜牌陣的通用解讀
    return `${intro}這個塔羅牌陣揭示了多層面的信息。從整體來看，${keywords.slice(0, 4).join("、")}等關鍵能量在你的情境中起著重要作用。牌陣中的${cardReadings[0].name}${
      cardReadings[0].isReversed ? "逆位" : "正位"
    }作為核心影響，與${cardReadings[cardReadings.length - 1].name}${
      cardReadings[cardReadings.length - 1].isReversed ? "逆位" : "正位"
    }形成能量呼應，共同指引著整個情境的發展方向。這表明你目前的處境和潛在結果之間存在重要的連結，需要你特別關注這一動態關係。`;
  }

  /**
   * 生成行動建議
   * @param {Array} cardReadings - 卡牌解讀數組
   * @param {Array} keywords - 關鍵詞數組
   * @returns {Array} 行動建議列表
   */
  generateActionAdvice(cardReadings, keywords) {
    // 根據占卜類型提供不同的行動建議
    const adviceByType = {
      love: ["嘗試以新的方式表達你的感受和需求", "反思自己對關係的期望是否合理", "為增進關係質量投入更多優質時間", "學習傾聽和理解對方的需求", "找到平衡個人空間和親密關係的方法"],
      career: ["尋找能發揮你核心優勢的機會", "設定明確的職業目標和達成時間表", "培養能增加職場競爭力的新技能", "建立和維護專業人脈關係", "保持工作與生活平衡，避免職業倦怠"],
      wealth: ["建立明確的財務目標和儲蓄計劃", "評估並調整你的投資組合", "審視並減少非必要開支", "探索增加收入的潛在途徑", "諮詢專業財務顧問獲取更具體的建議"],
      health: ["建立規律的健康習慣和運動計劃", "注意身心平衡，適當減壓", "尋求專業醫療意見對症處理健康問題", "調整飲食結構以增進整體健康", "培養正念冥想等有助於心理健康的習慣"],
      general: ["關注你的直覺感受，它可能含有重要線索", "嘗試從不同角度看待當前情況", "設立明確的短期目標來取得進展", "尋求支持系統的幫助和建議", "保持開放心態，接納變化的可能性"],
    };

    // 獲取基本建議
    const baseAdvice = adviceByType[this.divinationType] || adviceByType.general;

    // 根據抽出的牌添加特定建議
    const specificAdvice = cardReadings.map(card => {
      if (card.isReversed) {
        return `注意${card.name}逆位暗示的${card.keywords[0]}問題，可以嘗試通過${card.keywords[1]}來改善當前情況`;
      }
      return `善用${card.name}正位帶來的${card.keywords[0]}能量，特別在${card.position}方面發揮其優勢`;
    });

    // 結合基本建議和特定建議，選擇3-5條
    const allAdvice = [...baseAdvice, ...specificAdvice];
    const selectedAdvice = [];

    // 確保不重複選擇，最多選5條
    const maxAdvice = Math.min(5, allAdvice.length);
    while (selectedAdvice.length < maxAdvice) {
      const randomIndex = Math.floor(Math.random() * allAdvice.length);
      const advice = allAdvice[randomIndex];

      if (!selectedAdvice.includes(advice)) {
        selectedAdvice.push(advice);
      }
    }

    return selectedAdvice;
  }
}

// 導出塔羅解讀類
export default TarotReading;
