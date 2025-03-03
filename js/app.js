/**
 * 塔羅占卜應用主程式
 * 負責處理UI互動與連接塔羅解讀功能
 */

import TarotReading from "./tarotReading.js";

document.addEventListener("DOMContentLoaded", function () {
  // 實例化塔羅解讀服務
  const tarotService = new TarotReading();

  // 初始化全局變量
  let cardsRequired = 0; // 需要抽取的卡牌數量
  let cardsDrawn = 0; // 已抽取的卡牌數量

  // 解析URL參數，獲取占卜類型和牌陣類型
  const urlParams = new URLSearchParams(window.location.search);
  const divinationType = urlParams.get("type") || "general";
  const spreadType = urlParams.get("spread") || "single";
  const userQuestion = urlParams.get("question") || "我需要關注的重要訊息是什麼？";

  // 更新頁面顯示
  updateDivinationInfo(divinationType, spreadType, userQuestion);

  // 設置牌陣顯示
  setupSpreadDisplay(spreadType);

  // 初始化塔羅服務，模擬洗牌過程
  tarotService
    .initialize(divinationType, spreadType, userQuestion)
    .then(() => {
      // 洗牌完成後顯示牌庫
      document.getElementById("shuffle-indicator").classList.add("hidden");
      document.getElementById("tarot-deck-container").classList.remove("hidden");
      document.getElementById("draw-instruction").classList.remove("hidden");

      // 如非單張牌陣，顯示剩餘牌數
      if (spreadType !== "single") {
        document.getElementById("cards-remaining").classList.remove("hidden");

        // 更新剩餘卡牌數量顯示
        const remainingEl = document.getElementById("cards-remaining");
        if (remainingEl) {
          remainingEl.innerHTML = `剩餘需要抽 <span class="text-gold-300 font-bold">${cardsRequired}</span> 張牌`;
        }
      }

      // 設置抽牌事件
      setupDrawingEvents(spreadType, tarotService);
    })
    .catch(error => {
      console.error("初始化失敗：", error);
      alert("初始化失敗，請重新載入頁面");
    });

  /**
   * 更新占卜信息顯示
   * @param {string} type - 占卜類型
   * @param {string} spread - 牌陣類型
   * @param {string} question - 用戶問題
   */
  function updateDivinationInfo(type, spread, question) {
    // 更新占卜類型顯示
    const divinationTypeEl = document.getElementById("divination-type");
    if (divinationTypeEl) {
      switch (type) {
        case "love":
          divinationTypeEl.textContent = "愛情塔羅";
          break;
        case "career":
          divinationTypeEl.textContent = "事業塔羅";
          break;
        case "wealth":
          divinationTypeEl.textContent = "財運塔羅";
          break;
        case "health":
          divinationTypeEl.textContent = "健康塔羅";
          break;
        default:
          divinationTypeEl.textContent = "一般塔羅";
      }
    }

    // 更新牌陣類型顯示
    const spreadTypeEl = document.getElementById("spread-type");
    if (spreadTypeEl) {
      switch (spread) {
        case "single":
          spreadTypeEl.textContent = "單張牌陣";
          break;
        case "three":
          spreadTypeEl.textContent = "三張牌陣";
          break;
        case "celtic":
          spreadTypeEl.textContent = "凱爾特十字牌陣";
          break;
        default:
          spreadTypeEl.textContent = "單張牌陣";
      }
    }

    // 更新用戶問題顯示
    const userQuestionEl = document.getElementById("user-question");
    if (userQuestionEl && question) {
      userQuestionEl.textContent = `"${question}"`;
    }
  }

  /**
   * 根據牌陣類型設置顯示樣式
   * @param {string} spreadType - 牌陣類型
   */
  function setupSpreadDisplay(spreadType) {
    // 隱藏所有牌陣
    document.querySelectorAll(".spread-area").forEach(el => el.classList.add("hidden"));

    // 設置需要抽取的卡牌數量
    switch (spreadType) {
      case "single":
        document.getElementById("single-spread").classList.remove("hidden");
        cardsRequired = 1;
        break;
      case "three":
        document.getElementById("three-spread").classList.remove("hidden");
        cardsRequired = 3;
        break;
      case "celtic":
        document.getElementById("celtic-spread").classList.remove("hidden");
        cardsRequired = 10;
        break;
      default:
        document.getElementById("single-spread").classList.remove("hidden");
        cardsRequired = 1;
    }

    console.log(`設置牌陣類型: ${spreadType}, 需要抽取 ${cardsRequired} 張牌`);
  }

  /**
   * 設置抽牌事件處理
   * @param {string} spreadType - 牌陣類型
   * @param {Object} tarotService - 塔羅解讀服務實例
   */
  function setupDrawingEvents(spreadType, tarotService) {
    const tarotDeck = document.querySelector("#tarot-deck-container .tarot-card");

    if (!tarotDeck) {
      console.error("找不到塔羅牌庫元素！");
      return;
    }

    console.log("設置抽牌事件，卡牌要求數量:", cardsRequired);

    tarotDeck.addEventListener("click", function () {
      // 防止重複點擊已翻轉的卡牌
      if (this.classList.contains("card-flipped")) {
        return;
      }

      // 翻轉卡牌
      this.classList.add("card-flipped");

      // 抽取一張塔羅牌
      const card = tarotService.drawCard();

      // 顯示牌面
      displayCardFace(this, card);

      cardsDrawn++;
      console.log(`已抽取 ${cardsDrawn}/${cardsRequired} 張牌`);

      // 更新剩餘牌數顯示
      if (spreadType !== "single") {
        const remaining = cardsRequired - cardsDrawn;
        const remainingEl = document.getElementById("cards-remaining");
        if (remainingEl) {
          remainingEl.innerHTML = `剩餘需要抽 <span class="text-gold-300 font-bold">${remaining}</span> 張牌`;
        }

        // 如果還需要抽牌，延遲後重置牌庫狀態
        if (remaining > 0) {
          setTimeout(() => {
            tarotDeck.classList.remove("card-flipped");
            // 重置牌面為背面
            const cardFront = tarotDeck.querySelector(".tarot-card-front");
            if (cardFront) {
              cardFront.innerHTML = "";
            }
          }, 1000);
        }
      }

      // 當抽完所有所需的牌後
      if (cardsDrawn >= cardsRequired) {
        setTimeout(() => {
          // 隱藏抽牌區域，顯示牌陣和解讀區域
          document.getElementById("drawing-phase").classList.add("hidden");
          document.getElementById("spread-display").classList.remove("hidden");
          document.getElementById("interpretation-area").classList.remove("hidden");

          // 在牌陣中顯示抽到的卡牌
          displayCardsInSpread(tarotService.selectedCards, spreadType);

          // 生成並顯示解讀結果
          generateAndDisplayReading(tarotService);

          // 顯示功能按鈕
          document.getElementById("save-btn").classList.remove("hidden");
          document.getElementById("share-btn").classList.remove("hidden");
        }, 1500);
      }
    });
  }

  /**
   * 在牌陣中顯示抽到的卡牌
   * @param {Array} cards - 抽到的卡牌數組
   * @param {string} spreadType - 牌陣類型
   */
  function displayCardsInSpread(cards, spreadType) {
    let cardPlaceholders;

    switch (spreadType) {
      case "single":
        cardPlaceholders = document.querySelectorAll("#single-spread .card-placeholder");
        break;
      case "three":
        cardPlaceholders = document.querySelectorAll("#three-spread .card-placeholder");
        break;
      case "celtic":
        cardPlaceholders = document.querySelectorAll("#celtic-spread .card-placeholder");
        break;
      default:
        cardPlaceholders = document.querySelectorAll("#single-spread .card-placeholder");
    }

    // 將卡牌顯示在牌陣中
    cards.forEach((card, index) => {
      if (index < cardPlaceholders.length) {
        const placeholder = cardPlaceholders[index];

        // 創建卡牌圖像元素
        const cardImage = document.createElement("img");
        cardImage.src = card.imgUrl;
        cardImage.alt = `${card.name} ${card.isReversed ? "逆位" : "正位"}`;
        cardImage.classList.add("w-full", "h-full", "object-cover", "rounded-lg");

        // 如果是逆位，旋轉圖像
        if (card.isReversed) {
          cardImage.style.transform = "rotate(180deg)";
        }

        // 清空並添加新的卡牌圖像
        placeholder.innerHTML = "";
        placeholder.appendChild(cardImage);
      }
    });
  }

  /**
   * 生成並顯示塔羅解讀結果
   * @param {Object} tarotService - 塔羅解讀服務實例
   */
  function generateAndDisplayReading(tarotService) {
    // 顯示AI思考中狀態
    document.getElementById("ai-thinking").classList.remove("hidden");
    document.getElementById("ai-interpretation").classList.add("hidden");

    // 延遲以模擬AI思考過程
    setTimeout(() => {
      try {
        // 生成塔羅解讀
        const reading = tarotService.generateReading();

        // 創建解讀內容HTML
        const interpretationHTML = createReadingHTML(reading);

        // 顯示解讀結果
        const aiInterpretationEl = document.getElementById("ai-interpretation");
        aiInterpretationEl.innerHTML = interpretationHTML;
        aiInterpretationEl.classList.remove("hidden");

        // 隱藏思考中狀態
        document.getElementById("ai-thinking").classList.add("hidden");

        // 顯示操作按鈕
        document.getElementById("save-btn").classList.remove("hidden");
        document.getElementById("share-btn").classList.remove("hidden");

        // 設置詳細解讀的顯示/隱藏功能
        setupDetailToggles();
      } catch (error) {
        console.error("解讀生成失敗：", error);
        document.getElementById("ai-thinking").textContent = "解讀生成失敗，請重新嘗試";
      }
    }, 3000);
  }

  /**
   * 創建塔羅解讀HTML內容
   * @param {Object} reading - 塔羅解讀結果
   * @returns {string} 格式化的HTML內容
   */
  function createReadingHTML(reading) {
    // 創建卡牌解讀HTML
    const cardReadingsHTML = reading.cardReadings
      .map((card, index) => {
        return `
        <div class="mb-8">
          <h3 class="font-bold text-xl mb-2">${card.name} ${card.orientation}</h3>
          <div class="flex flex-col md:flex-row gap-4">
            <img src="${card.imgUrl}" alt="${card.name} ${card.orientation}" class="rounded-lg w-32 md:w-48 ${card.isReversed ? "transform rotate-180" : ""}" />
            <div>
              <div class="mb-2">
                <span class="text-gold-300 font-medium">位置：</span>
                <span class="text-gray-300">${card.position}</span>
              </div>
              <div class="mb-2">
                <span class="text-gold-300 font-medium">關鍵詞：</span>
                <span class="text-gray-300">${card.keywords.join("、")}</span>
              </div>
              <p class="text-gray-300 mb-4">${card.meaning}</p>
            </div>
          </div>

          <div class="mt-4">
            <button class="flex items-center text-gold-300 hover:text-gold-400 transition-colors" onclick="toggleSection('detail-${index}')">
              <span class="mr-2">象徵意義</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>
            <div id="detail-${index}" class="interpretation mt-4 text-gray-300">
              <p class="mb-2 font-medium text-gold-300/80">象徵解析：</p>
              <p>${card.symbolism}</p>
            </div>
          </div>
        </div>
      `;
      })
      .join("");

    // 創建總體解讀HTML
    const overallReadingHTML = `
      <div class="mt-8">
        <h3 class="font-bold text-xl mb-4">總體解讀</h3>
        <p class="text-gray-300">${reading.overallReading}</p>
      </div>
    `;

    // 創建行動建議HTML
    const actionAdviceHTML = `
      <div class="mt-8">
        <h3 class="font-bold text-xl mb-4">行動建議</h3>
        <ul class="list-disc pl-5 space-y-2 text-gray-300">
          ${reading.actionAdvice.map(advice => `<li>${advice}</li>`).join("")}
        </ul>
      </div>
    `;

    // 組合完整解讀HTML
    return `
      ${cardReadingsHTML}
      ${overallReadingHTML}
      ${actionAdviceHTML}
      <div class="mt-8 text-sm text-gray-400 italic">
        <p>注：塔羅牌解讀提供的是參考建議，最終決定權在於您自己。這些解讀基於當前時刻的能量，未來可能隨著您的選擇和行動而改變。</p>
      </div>
    `;
  }

  /**
   * 設置詳細解讀區塊的顯示/隱藏功能
   */
  function setupDetailToggles() {
    // 添加全局切換函數
    window.toggleSection = function (id) {
      const section = document.getElementById(id);
      if (section) {
        section.classList.toggle("active");
      }
    };
  }

  /**
   * 顯示塔羅牌面
   * @param {Element} cardElement - 卡牌元素
   * @param {Object} cardData - 卡牌數據
   */
  function displayCardFace(cardElement, cardData) {
    const cardFrontElement = cardElement.querySelector(".tarot-card-front");

    // 清除之前的內容
    cardFrontElement.innerHTML = "";

    // 創建卡牌圖像元素
    const cardImage = document.createElement("img");
    cardImage.src = cardData.imgUrl;
    cardImage.alt = `${cardData.name} ${cardData.isReversed ? "逆位" : "正位"}`;
    cardImage.className = `${cardData.isReversed ? "transform rotate-180" : ""} w-full h-full object-cover rounded-lg`;

    // 添加卡牌圖像到前面板
    cardFrontElement.appendChild(cardImage);

    // 添加卡牌名稱標籤
    const nameElement = document.createElement("div");
    nameElement.className = "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-center text-xs text-white";
    nameElement.textContent = `${cardData.name} ${cardData.isReversed ? "逆位" : "正位"}`;
    cardFrontElement.appendChild(nameElement);
  }

  /**
   * 渲染抽取的卡牌及其解釋
   * @param {Object} readingResult - 塔羅牌解讀結果
   */
  function renderReadingResults(readingResult) {
    // 隱藏抽牌階段
    document.getElementById("drawing-phase").classList.add("hidden");

    // 顯示牌陣
    const spreadDisplay = document.getElementById("spread-display");
    spreadDisplay.classList.remove("hidden");

    // 根據牌陣類型選擇不同的顯示區域
    let spreadElement;
    switch (readingResult.spreadType) {
      case "single":
        spreadElement = document.getElementById("single-spread");
        break;
      case "three":
        spreadElement = document.getElementById("three-spread");
        break;
      case "celtic":
        spreadElement = document.getElementById("celtic-spread");
        break;
      default:
        spreadElement = document.getElementById("single-spread");
    }

    // 顯示選擇的牌陣，隱藏其他牌陣
    document.querySelectorAll(".spread-area").forEach(el => el.classList.add("hidden"));
    spreadElement.classList.remove("hidden");

    // 清除之前的內容
    const cardPositions = spreadElement.querySelectorAll(".tarot-deck");

    // 填充卡牌
    readingResult.cardReadings.forEach((card, index) => {
      if (index < cardPositions.length) {
        const cardPlaceholder = cardPositions[index].querySelector(".card-placeholder");

        // 創建塔羅牌元素
        const tarotCardElement = document.createElement("div");
        tarotCardElement.className = "tarot-card card-flipped";

        // 前面板和後面板
        tarotCardElement.innerHTML = `
          <div class="tarot-card-front">
            <img src="${card.imgUrl}" alt="${card.name}" class="${card.isReversed ? "transform rotate-180" : ""} w-full h-full object-cover rounded-lg" />
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-center text-xs text-white">
              ${card.name} ${card.orientation}
            </div>
          </div>
          <div class="tarot-card-back">
            <div class="tarot-card-pattern"></div>
            <div class="tarot-card-back-logo">✨</div>
          </div>
        `;

        // 替換佔位符
        cardPlaceholder.parentNode.replaceChild(tarotCardElement, cardPlaceholder);

        // 更新位置標籤
        const positionLabel = cardPositions[index].querySelector(".card-position-label");
        if (positionLabel) {
          positionLabel.textContent = card.position;
        }
      }
    });

    // 渲染解讀結果
    renderInterpretation(readingResult);

    // 顯示結果區域
    document.getElementById("reading-results").classList.remove("hidden");

    // 滾動到結果區域
    setTimeout(() => {
      document.getElementById("reading-results").scrollIntoView({ behavior: "smooth", block: "start" });
    }, 500);
  }
});

// 在全局作用域添加切換函數，以支持內聯事件處理
window.toggleSection = function (id) {
  const section = document.getElementById(id);
  if (section) {
    section.classList.toggle("active");
  }
};
