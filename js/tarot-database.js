/**
 * 塔羅牌資料庫頁面主程式
 * 負責處理塔羅牌資料庫的展示、搜索和過濾功能
 */

import tarotData from "./tarotData.js";

document.addEventListener("DOMContentLoaded", function () {
  console.log("塔羅牌資料庫頁面加載中...");

  // 初始化全局變量
  let filteredCards = []; // 過濾後的牌組
  let currentCategory = "all"; // 當前顯示的類別
  let currentSort = "number"; // 當前排序方式
  let searchTerm = ""; // 搜索關鍵字

  // 獲取DOM元素
  const searchInput = document.querySelector('input[type="text"]');
  const categorySelect = document.querySelector("select:first-of-type");
  const sortSelect = document.querySelector("select:last-of-type");
  const majorArcanaSectionContainer = document.querySelector("#major-arcana-container");
  const wandsSectionContainer = document.querySelector("#wands-container");
  const cupsSectionContainer = document.querySelector("#cups-container");
  const swordsSectionContainer = document.querySelector("#swords-container");
  const pentaclesSectionContainer = document.querySelector("#pentacles-container");
  const cardDetailsModal = document.querySelector("#card-details-modal");

  // 初始化頁面
  initialize();

  /**
   * 初始化頁面
   */
  function initialize() {
    console.log("初始化塔羅牌資料庫頁面...");

    // 檢查tarotData是否成功載入
    if (!tarotData || !tarotData.majorArcana) {
      console.error("塔羅牌資料載入失敗");
      showErrorMessage("無法載入塔羅牌資料，請重新整理頁面。");
      return;
    }

    // 初始化事件監聽器
    setupEventListeners();

    // 初始顯示所有牌
    filterAndRenderCards();
  }

  /**
   * 設置事件監聽器
   */
  function setupEventListeners() {
    // 搜索框輸入事件
    if (searchInput) {
      searchInput.addEventListener("input", function (e) {
        searchTerm = e.target.value.trim().toLowerCase();
        filterAndRenderCards();
      });
    }

    // 類別選擇事件
    if (categorySelect) {
      categorySelect.addEventListener("change", function (e) {
        currentCategory = e.target.value;
        filterAndRenderCards();
      });
    }

    // 排序選擇事件
    if (sortSelect) {
      sortSelect.addEventListener("change", function (e) {
        currentSort = e.target.value;
        filterAndRenderCards();
      });
    }

    // 為詳情按鈕添加事件委託
    document.addEventListener("click", function (e) {
      if (e.target.closest(".tarot-card-details-btn")) {
        const cardId = e.target.closest(".tarot-card-details-btn").dataset.cardId;
        const cardSuit = e.target.closest(".tarot-card-details-btn").dataset.cardSuit;
        showCardDetails(cardId, cardSuit);
      }
    });

    // 關閉詳情模態框按鈕
    const closeButtons = document.querySelectorAll(".modal-close-btn");
    closeButtons.forEach(btn => {
      btn.addEventListener("click", function () {
        document.querySelector("#card-details-modal").classList.add("hidden");
      });
    });
  }

  /**
   * 過濾並渲染牌組
   */
  function filterAndRenderCards() {
    console.log("過濾和渲染牌組...", { searchTerm, currentCategory, currentSort });

    // 清空過濾後的牌組
    filteredCards = [];

    // 根據類別過濾牌組
    if (currentCategory === "all" || currentCategory === "major") {
      // 添加大阿爾卡納牌
      const majorArcanaFiltered = tarotData.majorArcana.filter(
        card =>
          card.name.toLowerCase().includes(searchTerm) ||
          card.nameEn.toLowerCase().includes(searchTerm) ||
          card.keywords.upright.some(keyword => keyword.toLowerCase().includes(searchTerm)) ||
          card.keywords.reversed.some(keyword => keyword.toLowerCase().includes(searchTerm))
      );

      filteredCards.push({
        suit: "major",
        cards: majorArcanaFiltered,
      });
    }

    if (currentCategory === "all" || currentCategory === "wands") {
      // 添加權杖牌組
      const wandsFiltered = tarotData.minorArcana.wands.filter(
        card =>
          card.name.toLowerCase().includes(searchTerm) ||
          card.nameEn.toLowerCase().includes(searchTerm) ||
          card.keywords.upright.some(keyword => keyword.toLowerCase().includes(searchTerm)) ||
          card.keywords.reversed.some(keyword => keyword.toLowerCase().includes(searchTerm))
      );

      filteredCards.push({
        suit: "wands",
        cards: wandsFiltered,
      });
    }

    if (currentCategory === "all" || currentCategory === "cups") {
      // 添加聖杯牌組
      const cupsFiltered = tarotData.minorArcana.cups.filter(
        card =>
          card.name.toLowerCase().includes(searchTerm) ||
          card.nameEn.toLowerCase().includes(searchTerm) ||
          card.keywords.upright.some(keyword => keyword.toLowerCase().includes(searchTerm)) ||
          card.keywords.reversed.some(keyword => keyword.toLowerCase().includes(searchTerm))
      );

      filteredCards.push({
        suit: "cups",
        cards: cupsFiltered,
      });
    }

    if (currentCategory === "all" || currentCategory === "swords") {
      // 添加寶劍牌組
      const swordsFiltered = tarotData.minorArcana.swords.filter(
        card =>
          card.name.toLowerCase().includes(searchTerm) ||
          card.nameEn.toLowerCase().includes(searchTerm) ||
          card.keywords.upright.some(keyword => keyword.toLowerCase().includes(searchTerm)) ||
          card.keywords.reversed.some(keyword => keyword.toLowerCase().includes(searchTerm))
      );

      filteredCards.push({
        suit: "swords",
        cards: swordsFiltered,
      });
    }

    if (currentCategory === "all" || currentCategory === "pentacles") {
      // 添加錢幣牌組
      const pentaclesFiltered = tarotData.minorArcana.pentacles.filter(
        card =>
          card.name.toLowerCase().includes(searchTerm) ||
          card.nameEn.toLowerCase().includes(searchTerm) ||
          card.keywords.upright.some(keyword => keyword.toLowerCase().includes(searchTerm)) ||
          card.keywords.reversed.some(keyword => keyword.toLowerCase().includes(searchTerm))
      );

      filteredCards.push({
        suit: "pentacles",
        cards: pentaclesFiltered,
      });
    }

    // 根據排序方式排序
    filteredCards.forEach(suitGroup => {
      if (currentSort === "name") {
        suitGroup.cards.sort((a, b) => a.name.localeCompare(b.name, "zh-Hant"));
      } else {
        // 按編號排序 (預設)
        suitGroup.cards.sort((a, b) => a.id - b.id);
      }
    });

    // 渲染牌組
    renderCards();
  }

  /**
   * 渲染牌組到頁面
   */
  function renderCards() {
    // 清空所有容器
    if (majorArcanaSectionContainer) majorArcanaSectionContainer.innerHTML = "";
    if (wandsSectionContainer) wandsSectionContainer.innerHTML = "";
    if (cupsSectionContainer) cupsSectionContainer.innerHTML = "";
    if (swordsSectionContainer) swordsSectionContainer.innerHTML = "";
    if (pentaclesSectionContainer) pentaclesSectionContainer.innerHTML = "";

    // 控制各部分的顯示和隱藏
    document.querySelectorAll(".tarot-section").forEach(section => {
      section.classList.add("hidden");
    });

    // 渲染過濾後的牌組
    filteredCards.forEach(suitGroup => {
      if (suitGroup.cards.length === 0) return;

      const cards = suitGroup.cards;
      let container;

      // 確定要渲染到哪個容器
      switch (suitGroup.suit) {
        case "major":
          container = majorArcanaSectionContainer;
          document.querySelector("#major-arcana-section").classList.remove("hidden");
          break;
        case "wands":
          container = wandsSectionContainer;
          document.querySelector("#wands-section").classList.remove("hidden");
          break;
        case "cups":
          container = cupsSectionContainer;
          document.querySelector("#cups-section").classList.remove("hidden");
          break;
        case "swords":
          container = swordsSectionContainer;
          document.querySelector("#swords-section").classList.remove("hidden");
          break;
        case "pentacles":
          container = pentaclesSectionContainer;
          document.querySelector("#pentacles-section").classList.remove("hidden");
          break;
      }

      if (!container) return;

      // 為每張牌創建HTML
      cards.forEach(card => {
        const cardElement = createCardElement(card, suitGroup.suit);
        container.appendChild(cardElement);
      });
    });

    // 顯示無結果消息（如果需要）
    if (filteredCards.every(group => group.cards.length === 0)) {
      document.querySelector("#no-results").classList.remove("hidden");
    } else {
      document.querySelector("#no-results").classList.add("hidden");
    }
  }

  /**
   * 創建塔羅牌卡片元素
   * @param {Object} card - 塔羅牌數據
   * @param {string} suit - 牌組類型
   * @returns {HTMLElement} 卡片元素
   */
  function createCardElement(card, suit) {
    // 創建卡片元素
    const cardElement = document.createElement("div");
    cardElement.className = "card-hover transition-all duration-300 bg-gradient-to-br from-midnight-800/90 to-mystic-900/90 rounded-lg overflow-hidden border border-gold-400/20";

    // 卡片編號/符號顯示
    let cardNumber = "";
    if (suit === "major") {
      // 大阿爾卡納使用羅馬數字或特殊符號
      cardNumber = card.id === 0 ? "0" : romanize(card.id);
    } else {
      // 小阿爾卡納使用數字或字母（A、J、Q、K）
      if (card.id === 1) cardNumber = "A";
      else if (card.id === 11) cardNumber = "J";
      else if (card.id === 12) cardNumber = "Q";
      else if (card.id === 13) cardNumber = "K";
      else cardNumber = card.id.toString();
    }

    // 獲取關鍵詞（最多3個）
    const keywords = card.keywords.upright.slice(0, 3).join("、");

    // 設置卡片HTML
    cardElement.innerHTML = `
      <div class="relative aspect-[2/3] overflow-hidden">
        <img src="${card.imgUrl || `https://via.placeholder.com/300x450/5b21b6/ffffff?text=${card.name}`}"
             alt="${card.name}" class="w-full h-full object-cover"
             onerror="this.src='https://via.placeholder.com/300x450/5b21b6/ffffff?text=${card.name}'">
        <div class="absolute inset-0 bg-gradient-to-t from-midnight-900/90 to-transparent flex items-end">
          <div class="p-3 w-full">
            <div class="flex justify-between items-center">
              <span class="text-gold-300 font-bold">${cardNumber}</span>
              <span class="text-gold-300">${card.nameEn}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="p-4">
        <h3 class="text-xl font-bold mb-1">${card.name}</h3>
        <p class="text-gray-300 text-sm mb-2">${keywords}</p>
        <button class="tarot-card-details-btn w-full py-1.5 px-3 text-sm border border-gold-400/60 text-gold-300 rounded hover:bg-gold-400/20 transition-colors"
                data-card-id="${card.id}" data-card-suit="${suit}">
          查看詳情
        </button>
      </div>
    `;

    return cardElement;
  }

  /**
   * 顯示塔羅牌詳情
   * @param {string} cardId - 牌的ID
   * @param {string} cardSuit - 牌的類型
   */
  function showCardDetails(cardId, cardSuit) {
    // 根據ID和類型找到對應的牌
    let card;
    if (cardSuit === "major") {
      card = tarotData.majorArcana.find(c => c.id === parseInt(cardId));
    } else {
      switch (cardSuit) {
        case "wands":
          card = tarotData.minorArcana.wands.find(c => c.id === parseInt(cardId));
          break;
        case "cups":
          card = tarotData.minorArcana.cups.find(c => c.id === parseInt(cardId));
          break;
        case "swords":
          card = tarotData.minorArcana.swords.find(c => c.id === parseInt(cardId));
          break;
        case "pentacles":
          card = tarotData.minorArcana.pentacles.find(c => c.id === parseInt(cardId));
          break;
      }
    }

    if (!card) {
      console.error(`找不到牌：${cardSuit} ${cardId}`);
      return;
    }

    // 更新模態框內容
    const modalContent = document.querySelector("#card-details-content");
    if (!modalContent) return;

    // 獲取牌的符號/編號
    let cardNumber = "";
    if (cardSuit === "major") {
      cardNumber = card.id === 0 ? "0" : romanize(card.id);
    } else {
      if (card.id === 1) cardNumber = "A";
      else if (card.id === 11) cardNumber = "J";
      else if (card.id === 12) cardNumber = "Q";
      else if (card.id === 13) cardNumber = "K";
      else cardNumber = card.id.toString();
    }

    // 設置模態框HTML
    modalContent.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="relative md:col-span-1">
          <img src="${card.imgUrl || `https://via.placeholder.com/300x450/5b21b6/ffffff?text=${card.name}`}"
               alt="${card.name}"
               class="w-full rounded-lg object-cover shadow-lg border border-gold-400/30"
               onerror="this.src='https://via.placeholder.com/300x450/5b21b6/ffffff?text=${card.name}'">
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-midnight-900/90 to-transparent p-3">
            <div class="flex justify-between items-center">
              <span class="text-gold-300 font-bold text-lg">${cardNumber}</span>
              <span class="text-gold-300">${card.nameEn}</span>
            </div>
          </div>
        </div>

        <div class="md:col-span-2">
          <h3 class="tarot-title text-3xl font-bold text-gold-300 mb-4">${card.name}</h3>

          <div class="mb-6">
            <h4 class="text-xl font-bold text-white mb-2">牌義象徵</h4>
            <p class="text-gray-200">${card.symbolism}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h4 class="text-xl font-bold text-gold-300 mb-2">正位關鍵詞</h4>
              <ul class="list-disc list-inside text-gray-200">
                ${card.keywords.upright.map(kw => `<li>${kw}</li>`).join("")}
              </ul>
            </div>
            <div>
              <h4 class="text-xl font-bold text-gold-300 mb-2">逆位關鍵詞</h4>
              <ul class="list-disc list-inside text-gray-200">
                ${card.keywords.reversed.map(kw => `<li>${kw}</li>`).join("")}
              </ul>
            </div>
          </div>

          <div class="mb-6">
            <h4 class="text-xl font-bold text-white mb-2">正位牌義</h4>
            <div class="space-y-2 text-gray-200">
              <p><strong>一般含義：</strong> ${card.meanings.upright.general}</p>
              <p><strong>愛情方面：</strong> ${card.meanings.upright.love}</p>
              <p><strong>事業方面：</strong> ${card.meanings.upright.career}</p>
              <p><strong>財富方面：</strong> ${card.meanings.upright.wealth}</p>
              <p><strong>健康方面：</strong> ${card.meanings.upright.health}</p>
            </div>
          </div>

          <div class="mb-6">
            <h4 class="text-xl font-bold text-white mb-2">逆位牌義</h4>
            <div class="space-y-2 text-gray-200">
              <p><strong>一般含義：</strong> ${card.meanings.reversed.general}</p>
              <p><strong>愛情方面：</strong> ${card.meanings.reversed.love}</p>
              <p><strong>事業方面：</strong> ${card.meanings.reversed.career}</p>
              <p><strong>財富方面：</strong> ${card.meanings.reversed.wealth}</p>
              <p><strong>健康方面：</strong> ${card.meanings.reversed.health}</p>
            </div>
          </div>
        </div>
      </div>
    `;

    // 顯示模態框
    document.querySelector("#card-details-modal").classList.remove("hidden");
  }

  /**
   * 將數字轉換為羅馬數字
   * @param {number} num - 要轉換的數字
   * @returns {string} 羅馬數字
   */
  function romanize(num) {
    if (!+num) return "";

    const roman = {
      M: 1000,
      CM: 900,
      D: 500,
      CD: 400,
      C: 100,
      XC: 90,
      L: 50,
      XL: 40,
      X: 10,
      IX: 9,
      V: 5,
      IV: 4,
      I: 1,
    };

    let result = "";
    for (let key in roman) {
      const repeats = Math.floor(num / roman[key]);
      if (repeats) {
        result += key.repeat(repeats);
        num -= repeats * roman[key];
      }
    }

    return result;
  }

  /**
   * 顯示錯誤消息
   * @param {string} message - 錯誤消息
   */
  function showErrorMessage(message) {
    const errorModal = document.getElementById("error-modal");
    const errorMessage = document.getElementById("error-message");

    if (errorModal && errorMessage) {
      errorMessage.textContent = message;
      errorModal.classList.remove("hidden");

      const errorClose = document.getElementById("error-close");
      if (errorClose) {
        errorClose.onclick = function () {
          errorModal.classList.add("hidden");
        };
      }
    } else {
      alert(message);
    }
  }
});
