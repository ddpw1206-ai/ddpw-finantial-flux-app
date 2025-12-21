  // ========================================
  // 二쇱쓽: ???몃씪???ㅽ겕由쏀듃???덇굅??肄붾뱶?낅땲??
  // ?遺遺꾩쓽 濡쒖쭅? ?몃? JS ?뚯씪濡??대룞?섏뿀?듬땲??
  // config.js, data-manager.js, app.js ?깆쓣 李몄“?섏꽭??
  // ========================================

  // ========================================
  // DOMContentLoaded - ?섏씠吏 濡쒕뱶 ???ㅽ뻾
  // ========================================
  // 二쇱쓽: app.js?먮룄 DOMContentLoaded媛 ?덉뒿?덈떎.
  // 以묐났 ?ㅽ뻾??諛⑹??섍린 ?꾪빐 ??遺遺꾩? 理쒖냼?붾릺?덉뒿?덈떎.
  document.addEventListener('DOMContentLoaded', function() {
  // 踰꾩쟾 ?쒖떆??app.js?먯꽌 泥섎━?⑸땲??
  // config.js??APP_VERSION???ъ슜?⑸땲??

  // ========================================
  // ?곗씠?????諛곗뿴 (?덇굅??- config.js ?ъ슜 沅뚯옣)
  // ========================================
  // 二쇱쓽: ??蹂?섎뱾? config.js?먮룄 ?뺤쓽?섏뼱 ?덉뒿?덈떎.
  // ?몃? JS ?뚯씪??濡쒕뱶?섎㈃ config.js??媛믪씠 ?ъ슜?⑸땲??
  if (typeof transactionData === 'undefined') {
  var transactionData = [];
  }
  if (typeof accountData === 'undefined') {
  var accountData = [];
  }
  if (typeof merchantHistory === 'undefined') {
  var merchantHistory = []; // ?먯＜ ?곕뒗 ?ъ슜泥?紐⑸줉
  }
  if (typeof cardData === 'undefined') {
  var cardData = []; // 移대뱶 紐⑸줉 (寃곗젣?섎떒怨??숈씪?섍쾶 ?ъ슜)
  }

  const savedData = localStorage.getItem('budgetData');
  if (savedData) {
  transactionData = JSON.parse(savedData);
  }

  const savedAccountData = localStorage.getItem('accountData');
  if (savedAccountData) {
  accountData = JSON.parse(savedAccountData);
  }

  const savedMerchantHistory = localStorage.getItem('merchantHistory');
  if (savedMerchantHistory) {
  merchantHistory = JSON.parse(savedMerchantHistory);
  }

  const savedCardData = localStorage.getItem('cardData');
  if (savedCardData) {
  cardData = JSON.parse(savedCardData);
  } else {
  // 湲곕낯 移대뱶 ?곗씠??(珥덇린媛?
  cardData = [
  { id: Date.now(), name: 'KB ?꾪깂?濡??ъ눥??, type: 'credit', cardCompany: 'KB移대뱶' },
  { id: Date.now() + 1, name: '?쇱꽦 ?ㅼ씠踰?taptap', type: 'credit', cardCompany: '?쇱꽦移대뱶' },
  { id: Date.now() + 2, name: '?쇱꽦 踰좊꽕??, type: 'credit', cardCompany: '?쇱꽦移대뱶' },
  { id: Date.now() + 3, name: '移댁뭅?ㅻ콉??泥댄겕', type: 'debit', cardCompany: '移댁뭅?ㅻ콉?? }
  ];
  localStorage.setItem('cardData', JSON.stringify(cardData));
  }

  // 移대뱶 ?곗씠??????⑥닔 (?덇굅??- data-manager.js ?ъ슜 沅뚯옣)
  if (typeof saveCardData === 'undefined') {
  window.saveCardData = function() {
  localStorage.setItem('cardData', JSON.stringify(cardData));
  };
  }

  // ?먯＜ ?곕뒗 ?ъ슜泥?????⑥닔 (?덇굅??
  if (typeof saveMerchantHistory === 'undefined') {
  window.saveMerchantHistory = function() {
  localStorage.setItem('merchantHistory', JSON.stringify(merchantHistory));
  };
  }

  // ?먯＜ ?곕뒗 ?ъ슜泥?異붽? ?⑥닔
  function legacy_addToMerchantHistory(merchant) {
  if (!merchant || merchant.trim() === '') return;

  const trimmedMerchant = merchant.trim();
  // ?대? 議댁옱?섎뒗吏 ?뺤씤
  const index = merchantHistory.indexOf(trimmedMerchant);
  if (index > -1) {
  // ?대? ?덉쑝硫?留??욎쑝濡??대룞
  merchantHistory.splice(index, 1);
  }
  // 留??욎뿉 異붽? (理쒕? 20媛쒓퉴吏留????
  merchantHistory.unshift(trimmedMerchant);
  if (merchantHistory.length > 20) {
  merchantHistory = merchantHistory.slice(0, 20);
  }
  saveMerchantHistory();
  updateMerchantHistorySelect();
  }

  // ?먯＜ ?곕뒗 ?ъ슜泥??쒕∼?ㅼ슫 ?낅뜲?댄듃
  function legacy_updateMerchantHistorySelect() {
  const select = document.getElementById('merchant-history');
  if (!select) return;

  // 湲곗〈 ?듭뀡 ?쒓굅 (泥?踰덉㎏ ?듭뀡 ?쒖쇅)
  while (select.children.length > 1) {
  select.removeChild(select.lastChild);
  }

  // ?먯＜ ?곕뒗 ?ъ슜泥?異붽?
  merchantHistory.forEach(merchant => {
  const option = document.createElement('option');
  option.value = merchant;
  option.textContent = merchant;
  select.appendChild(option);
  });
  }

  // ?먯＜ ?곕뒗 ?ъ슜泥?紐⑸줉 ?뚮뜑留?(愿由?紐⑤떖??
  function legacy_renderMerchantList() {
  const merchantList = document.getElementById('merchant-list');
  if (!merchantList) return;

  merchantList.innerHTML = '';

  if (merchantHistory.length === 0) {
  merchantList.innerHTML = '<div style="text-align: center; padding: 20px; color: #6B7280;">?깅줉???ъ슜泥섍? ?놁뒿?덈떎.</div>';
  return;
  }

  merchantHistory.forEach((merchant, index) => {
  const item = document.createElement('div');
  item.style.cssText = 'display: flex; align-items: center; justify-content: space-between; padding: 12px; background:
  #F9FAFB; border-radius: 8px; border: 1px solid #E5E7EB;';
  item.innerHTML = `
  <span style="flex: 1; font-size: 0.95rem; color: #111827;">${merchant}</span>
  <button type="button" onclick="removeMerchantFromHistory(${index})"
    style="padding: 6px 12px; border: 1px solid #DC2626; border-radius: 6px; font-size: 0.85rem; background: #FFFFFF; color: #DC2626; cursor: pointer; transition: all 0.2s;"
    onmouseover="this.style.background='#DC2626'; this.style.color='#fff'"
    onmouseout="this.style.background='#FFFFFF'; this.style.color='#DC2626'">??젣</button>
  `;
  merchantList.appendChild(item);
  });
  }

  // ?먯＜ ?곕뒗 ?ъ슜泥???젣 ?⑥닔
  window.legacy_removeMerchantFromHistory = function(index) {
  if (confirm('???ъ슜泥섎? ??젣?섏떆寃좎뒿?덇퉴?')) {
  merchantHistory.splice(index, 1);
  saveMerchantHistory();
  updateMerchantHistorySelect();
  renderMerchantList();
  }
  };

  // ?먯＜ ?곕뒗 ?ъ슜泥?愿由?紐⑤떖 ?닿린/?リ린
  function legacy_openMerchantManageModal() {
  const modal = document.getElementById('merchant-modal-overlay');
  if (modal) {
  renderMerchantList();
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  }
  }

  function legacy_closeMerchantManageModal() {
  const modal = document.getElementById('merchant-modal-overlay');
  if (modal) {
  modal.style.display = 'none';
  document.body.style.overflow = '';
  // ?낅젰 ?꾨뱶 珥덇린??
  const addInput = document.getElementById('merchant-add-input');
  if (addInput) addInput.value = '';
  }
  }

  // ?먯＜ ?곕뒗 ?ъ슜泥?愿由?紐⑤떖 ?대깽??(湲곗〈 DOMContentLoaded ?대???異붽?)

  // ?곗씠??????⑥닔
  function saveData() {
  localStorage.setItem('budgetData', JSON.stringify(transactionData));
  }

  // 怨꾩쥖 ?곗씠??????⑥닔
  function saveAccountData() {
  localStorage.setItem('accountData', JSON.stringify(accountData));
  }

  // ========================================
  // 1. ???꾪솚 湲곕뒫 (?곷떒 硫붿씤 ??
  // ========================================
  // 二쇱쓽: ???꾪솚 湲곕뒫? app.js濡??대룞?섏뿀?듬땲??
  // ??肄붾뱶??以묐났 ?쒓굅瑜??꾪빐 二쇱꽍 泥섎━?섏뿀?듬땲??

  // ========================================
  // 2. ???좏깮 湲곕뒫
  // ========================================
  const monthText = document.getElementById('month-text');
  const prevMonthBtn = document.getElementById('prev-month');
  const nextMonthBtn = document.getElementById('next-month');

  // ?꾩옱 ?좎쭨 湲곗??쇰줈 珥덇린??
  const today = new Date();
  let curYear = today.getFullYear();
  let curMonth = today.getMonth() + 1;

  function updateMonthText() {
  monthText.textContent = `${curYear}??${curMonth}??;
  // ??蹂寃????뚯씠釉붽낵 ??쒕낫??媛깆떊
  renderTable();
  renderCardTable('all');
  renderBankTable();
  updateDashboard();
  }

  prevMonthBtn.addEventListener('click', function() {
  curMonth--;
  if (curMonth < 1) { curMonth=12; curYear--; } updateMonthText(); }); nextMonthBtn.addEventListener('click', function()
    { curMonth++; if (curMonth> 12) {
    curMonth = 1;
    curYear++;
    }
    updateMonthText();
    });

    // ?꾩옱 ?좏깮???붿쓽 ?곗씠???꾪꽣留??⑥닔
    function getCurrentMonthData() {
    return transactionData.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate.getFullYear() === curYear && entryDate.getMonth() + 1 === curMonth;
    });
    }

    // ========================================
    // 3. ?섏쐞 ???꾪솚 湲곕뒫
    // ========================================
    function initSubTabs() {
    const subTabBtns = document.querySelectorAll('.sub-tab-btn');
    const totalContent = document.getElementById('total-content');
    const cardContent = document.getElementById('card-content');
    const bankContent = document.getElementById('bank-content');

    subTabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
    subTabBtns.forEach(b => b.classList.remove('active'));
    this.classList.add('active');

    const target = this.getAttribute('data-subtab');

    if (totalContent) totalContent.style.display = 'none';
    if (cardContent) cardContent.style.display = 'none';
    if (bankContent) bankContent.style.display = 'none';

    if (target === 'total' && totalContent) {
    totalContent.style.display = 'block';
    renderTable();
    } else if (target === 'card' && cardContent) {
    cardContent.style.display = 'block';
    // 移대뱶 ?꾪꽣 ?쒕∼?ㅼ슫 珥덇린??
    const cardFilterSelect = document.getElementById('card-filter-select');
    if (cardFilterSelect) {
    cardFilterSelect.value = 'all';
    }
    renderCardTable('all');
    } else if (target === 'bank' && bankContent) {
    bankContent.style.display = 'block';
    renderBankTable();
    }
    // ?섏쐞 ??蹂寃??쒖뿉????쒕낫?쒕뒗 ?낅뜲?댄듃?섏? ?딆쓬 (?붾퀎 ?꾪꽣留곸? ?좎?)
    });
    });
    }

    initSubTabs();

    // ========================================
    // 4. 紐⑤떖 ?닿린/?リ린
    // ========================================
    const fabBtn = document.getElementById('fab-btn');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close-btn');
    const modalCancel = document.getElementById('modal-cancel-btn');

    // ?섏젙 紐⑤뱶 異붿쟻 蹂??
    let editingId = null;
    const modalTitle = document.querySelector('.modal-title');

    if (fabBtn && modalOverlay) {
    function legacy_closeModal() {
    modalOverlay.style.display = 'none';
    document.body.style.overflow = '';
    editingId = null;
    // 紐⑤떖 ?쒕ぉ 珥덇린??
    if (modalTitle) {
    modalTitle.textContent = '?뱷 ?댁뿭 ?낅젰';
    }
    // ??珥덇린??
    if (form) {
    form.reset();
    // ?꾩옱 ?좎쭨濡??ㅼ젙
    const today = new Date();
    const dateInput = document.getElementById('entry-date');
    if (dateInput) {
    dateInput.value = today.toISOString().split('T')[0];
    }
    // ??ぉ ?쒕∼?ㅼ슫 珥덇린??
    updateItemOptions();
    // 寃곗젣?섎떒 ?꾨뱶 珥덇린??
    if (methodSelect) {
    updatePaymentFields();
    }
    }
    }

    function legacy_openModal(isEdit = false) {
    modalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    if (!isEdit && form) {
    // ?좉퇋 ?낅젰 紐⑤뱶: ??珥덇린??
    form.reset();
    const today = new Date();
    const dateInput = document.getElementById('entry-date');
    if (dateInput) {
    dateInput.value = today.toISOString().split('T')[0];
    }
    // ??ぉ ?쒕∼?ㅼ슫 珥덇린??
    updateItemOptions();
    if (methodSelect) {
    updatePaymentFields();
    }
    if (modalTitle) {
    modalTitle.textContent = '?뱷 ?댁뿭 ?낅젰';
    }
    }
    }

    // FAB 踰꾪듉 ?댄똻 ?낅뜲?댄듃 ?⑥닔
    function updateFabTooltip() {
    if (!fabBtn) return;

    if (currentActiveTab === 'accounts') {
    fabBtn.title = '怨꾩쥖 ?낆텧湲??댁뿭 異붽?';
    } else {
    fabBtn.title = '嫄곕옒 ?댁뿭 ?낅젰';
    }
    }

    fabBtn.addEventListener('click', function() {
    if (currentActiveTab === 'accounts') {
    // 怨꾩쥖 愿由??? 怨꾩쥖 ?낆텧湲??댁뿭 異붽? 紐⑤떖 ?닿린
    if (modalTitle) {
    modalTitle.textContent = '?뮥 怨꾩쥖 ?낆텧湲??댁뿭 異붽?';
    }
    openModal(false);
    // 寃곗젣?섎떒??怨꾩쥖?댁껜濡??ㅼ젙
    if (methodSelect) {
    methodSelect.value = 'transfer';
    updatePaymentFields();
    }
    } else if (currentActiveTab === 'dashboard') {
    // ?붾퀎?꾪솴: ?댁뿭 ?낅젰 紐⑤떖 ?닿린
    openModal(false);
    } else if (currentActiveTab === 'saving') {
    // ?異뺢?由? ?異?紐⑺몴 異붽? (異뷀썑 援ы쁽)
    alert('?異?紐⑺몴 異붽? 湲곕뒫? 異뷀썑 援ы쁽 ?덉젙?낅땲??');
    } else {
    // 湲고? ?? 湲곕낯 ?댁뿭 ?낅젰 紐⑤떖 ?닿린
    openModal(false);
    }
    });

    // 珥덇린 FAB ?댄똻 ?ㅼ젙
    updateFabTooltip();

    if (modalClose) {
    modalClose.addEventListener('click', closeModal);
    }

    if (modalCancel) {
    modalCancel.addEventListener('click', closeModal);
    }

    modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) {
    closeModal();
    }
    });

    window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modalOverlay.style.display === 'flex') {
    closeModal();
    }
    });
    }

    // ========================================
    // 5. 移댄뀒怨좊━蹂???ぉ 留ㅽ븨 (吏異쒖슜) - ?덇굅??
    // 二쇱쓽: config.js?먮룄 ?숈씪???뺤쓽媛 ?덉뒿?덈떎.
    // ========================================
    if (typeof expenseCategoryItems === 'undefined') {
    window.expenseCategoryItems = {
    '二쇨굅': ['愿由щ퉬', '?섎룄??, '?꾩떆媛??, '?섎━/泥?냼', '湲고?', '?듭떊鍮?],
    '?앸퉬': ['?앹옱猷?, '遺??媛꾩떇', '?몄떇', '移댄럹', '諛곕떖/?ъ옣', '二쇰쪟'],
    '?⑥뀡쨌酉고떚': ['?섎쪟', '?≫솕', '?좊컻', '?붿옣??, '誘몄슜/?쒖닠', '?명긽'],
    '援먰넻쨌李⑤웾': ['二쇱쑀鍮?, '?뚮え???섎━', '二쇱감/?듯뻾猷?, '?以묎탳??, '?앹떆', '蹂댄뿕/?멸툑', '?고렪/?앸같'],
    '臾명솕쨌怨꾨컻': ['援먯쑁/?섍컯', '?쒗뿕/?먭꺽', '?곹솕', '寃뚯엫', '?꾩꽌/臾멸뎄', '?ы뻾'],
    '嫄닿컯': ['蹂묒썝', '?쎄뎅', '嫄닿컯蹂댁“', '?대룞', '?뺢린寃吏?],
    '蹂댄뿕쨌?異?: ['?좊몺蹂댄뿕', '?뚯슦蹂댄뿕', '?곴툑1', '?곴툑2', '?댁옄?곷┰', '二쇱떇', '?ы뻾?異?, '湲고??異?],
    '?異쑣룹씠??: ['?異쒖씠???꾩감)', '?異쒖씠???뚯슦)', '湲고??댁옄'],
    '湲고?吏異?: ['?쇰컲?댁껜', '?⑸룉(?좊몺)', '?⑸룉(?뚯슦)', '寃쎌“???좊몺)', '寃쎌“???뚯슦)', '?좉?利앷텒', '?좊Ъ', '?고쉶鍮??뺢린援щ룆'],
    '?앺솢': ['媛??媛援?, '?앺솢?⑺뭹', '二쇰갑?⑺뭹', '泥?냼?⑺뭹', '湲고??뚰뭹']
    };

    // ========================================
    // 6. 移댄뀒怨좊━蹂???ぉ 留ㅽ븨 (?섏엯??
    // ========================================
    if (typeof incomeCategoryItems === 'undefined') {
    window.incomeCategoryItems = {
    '湲됱뿬': ['二쇨툒???뚯슦)', '二쇨툒???좊몺)', '?곸뿬(?뚯슦)', '?곸뿬(?좊몺)', '蹂듭?(?뚯슦)', '蹂듭?(?좊몺)'],
    '遺?섏엯': ['?ъ옄?섏씡', '?꾧툑?섏엯', '?꾨Ц媛鍮?, '以묎퀬?먮ℓ'],
    '湲고??섏씡': ['援?꽭?섍툒', '?쇰컲?댁껜', '?꾩썡?댁썡', '湲고??꾧툑', '泥?뎄?좎씤', '?댁옄?뚮뱷']
    };
    }

    // 援щ텇 ?좏깮???곕씪 移댄뀒怨좊━ ?낅뜲?댄듃
    function updateCategoryOptions() {
    const form = document.getElementById('entry-form');
    const typeRadios = form ? form.querySelectorAll('input[name="type"]') :
    document.querySelectorAll('input[name="type"]');
    const categorySelect = document.getElementById('entry-category-kind');
    const itemSelect = document.getElementById('entry-category-item');

    if (!typeRadios || !categorySelect || !itemSelect) return;

    const selectedType = Array.from(typeRadios).find(radio => radio.checked)?.value;

    // 移댄뀒怨좊━ ?쒕∼?ㅼ슫 珥덇린??
    categorySelect.innerHTML = '<option value="">--?좏깮--</option>';
    // ??ぉ ?쒕∼?ㅼ슫??珥덇린??
    itemSelect.innerHTML = '<option value="">移댄뀒怨좊━瑜?癒쇱? ?좏깮?섏꽭??/option>';

    if (selectedType === 'expense') {
    // 吏異쒖슜 移댄뀒怨좊━ 異붽?
    Object.keys(expenseCategoryItems).forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
    });
    } else if (selectedType === 'income') {
    // ?섏엯??移댄뀒怨좊━ 異붽?
    Object.keys(incomeCategoryItems).forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
    });
    }
    }

    // 移댄뀒怨좊━ ?좏깮 ????ぉ ?쒕∼?ㅼ슫 ?낅뜲?댄듃
    function updateItemOptions() {
    const form = document.getElementById('entry-form');
    const typeRadios = form ? form.querySelectorAll('input[name="type"]') :
    document.querySelectorAll('input[name="type"]');
    const categorySelect = document.getElementById('entry-category-kind');
    const itemSelect = document.getElementById('entry-category-item');

    if (!typeRadios || !categorySelect || !itemSelect) return;

    const selectedType = Array.from(typeRadios).find(radio => radio.checked)?.value;
    const selectedCategory = categorySelect.value;

    // ??ぉ ?쒕∼?ㅼ슫 珥덇린??
    itemSelect.innerHTML = '<option value="">--?좏깮--</option>';

    let categoryItems = {};
    if (selectedType === 'expense') {
    categoryItems = expenseCategoryItems;
    } else if (selectedType === 'income') {
    categoryItems = incomeCategoryItems;
    }

    if (selectedCategory && categoryItems[selectedCategory]) {
    // ?좏깮??移댄뀒怨좊━???대떦?섎뒗 ??ぉ??異붽?
    categoryItems[selectedCategory].forEach(item => {
    const option = document.createElement('option');
    option.value = item;
    option.textContent = item;
    itemSelect.appendChild(option);
    });
    } else {
    itemSelect.innerHTML = '<option value="">移댄뀒怨좊━瑜?癒쇱? ?좏깮?섏꽭??/option>';
    }
    }

    // 援щ텇 ?쇰뵒??踰꾪듉 ?대깽??由ъ뒪??
    const formForType = document.getElementById('entry-form');
    const typeRadios = formForType ? formForType.querySelectorAll('input[name="type"]') :
    document.querySelectorAll('input[name="type"]');
    if (typeRadios && typeRadios.length > 0) {
    typeRadios.forEach(radio => {
    radio.addEventListener('change', function() {
    updateCategoryOptions();
    });
    });
    }

    // 珥덇린 移댄뀒怨좊━ ?듭뀡 ?ㅼ젙 (湲곕낯媛? 吏異?
    // DOM???꾩쟾??濡쒕뱶?????ㅽ뻾?섎룄濡??쎄컙??吏??異붽?
    setTimeout(() => {
    updateCategoryOptions();
    }, 100);

    // 移댄뀒怨좊━ ?좏깮 ?대깽??由ъ뒪??(?대? ?꾩뿉???ㅼ젙??

    // ========================================
    // 7. 湲덉븸 ?낅젰 ?꾨뱶 泥??⑥쐞 肄ㅻ쭏 ?щ㎎??
    // ========================================
    function formatNumberWithCommas(value) {
    // ?レ옄媛 ?꾨땶 臾몄옄 ?쒓굅 (肄ㅻ쭏 ?쒖쇅)
    const numbers = value.replace(/[^\d]/g, '');
    // 泥??⑥쐞 肄ㅻ쭏 異붽?
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function removeCommas(value) {
    return value.replace(/,/g, '');
    }

    const amountInput = document.getElementById('entry-amount');
    if (amountInput) {
    // ?낅젰 ??泥??⑥쐞 肄ㅻ쭏 ?먮룞 異붽?
    amountInput.addEventListener('input', function(e) {
    const cursorPosition = e.target.selectionStart;
    const value = e.target.value;
    const numbers = removeCommas(value);
    const formatted = formatNumberWithCommas(numbers);

    e.target.value = formatted;

    // 而ㅼ꽌 ?꾩튂 議곗젙 (肄ㅻ쭏 異붽?濡??명븳 ?꾩튂 蹂??蹂댁젙)
    const addedCommas = (formatted.match(/,/g) || []).length - (value.match(/,/g) || []).length;
    const newCursorPosition = cursorPosition + addedCommas;
    e.target.setSelectionRange(newCursorPosition, newCursorPosition);
    });

    // ?ъ빱???꾩썐 ?쒖뿉???щ㎎???뺤씤
    amountInput.addEventListener('blur', function(e) {
    const value = e.target.value;
    if (value) {
    e.target.value = formatNumberWithCommas(removeCommas(value));
    }
    });
    }


    // 移댄뀒怨좊━ ?좏깮 ?대깽??由ъ뒪??
    const categorySelect = document.getElementById('entry-category-kind');
    if (categorySelect) {
    categorySelect.addEventListener('change', updateItemOptions);
    }

    // ========================================
    // 6. 寃곗젣?섎떒蹂??섏쐞 ?듭뀡 ?쒖떆
    // ========================================
    const methodSelect = document.getElementById('entry-method');
    const paymentCredit = document.getElementById('payment-credit');
    const paymentDebit = document.getElementById('payment-debit');
    const paymentTransfer = document.getElementById('payment-transfer');
    const paymentCash = document.getElementById('payment-cash');

    if (methodSelect) {
    function updatePaymentFields() {
    if (paymentCredit) paymentCredit.style.display = 'none';
    if (paymentDebit) paymentDebit.style.display = 'none';
    if (paymentTransfer) paymentTransfer.style.display = 'none';
    if (paymentCash) paymentCash.style.display = 'none';

    const val = methodSelect.value;
    if (val === 'credit' && paymentCredit) {
    paymentCredit.style.display = 'block';
    } else if (val === 'debit' && paymentDebit) {
    paymentDebit.style.display = 'block';
    } else if (val === 'transfer' && paymentTransfer) {
    paymentTransfer.style.display = 'block';
    } else if (val === 'cash' && paymentCash) {
    paymentCash.style.display = 'block';
    }
    }

    methodSelect.addEventListener('change', updatePaymentFields);
    updatePaymentFields();
    }

    // ========================================
    // 6. ???쒖텧 (?곗씠??????섏젙)
    // ========================================
    const form = document.getElementById('entry-form');
    if (form) {
    form.addEventListener('submit', function(e) {
    e.preventDefault();

    // ?꾩닔 ?낅젰 泥댄겕
    const date = document.getElementById('entry-date')?.value;
    const user = document.getElementById('entry-owner')?.value;
    const typeRadio = form.querySelector('input[name="type"]:checked');
    const type = typeRadio ? typeRadio.value : 'expense';
    const item = document.getElementById('entry-category-item')?.value;
    const category = document.getElementById('entry-category-kind')?.value;
    const amountRaw = document.getElementById('entry-amount')?.value;
    // 肄ㅻ쭏 ?쒓굅 ???レ옄濡?蹂??
    const amount = Number(removeCommas(amountRaw || '')) || 0;
    const paymentMethod = document.getElementById('entry-method')?.value;
    const merchant = document.getElementById('entry-merchant')?.value || '';
    const detail = document.getElementById('entry-detail')?.value || '';
    const saveMerchant = document.getElementById('entry-save-merchant')?.checked || false;
    const recurring = document.getElementById('entry-regular')?.checked || false;

    // 泥댄겕諛뺤뒪媛 泥댄겕?섏뼱 ?덉쑝硫??먯＜ ?곕뒗 ??ぉ??異붽?
    if (saveMerchant && merchant) {
    addToMerchantHistory(merchant);
    }

    // ?먮윭 泥섎━: ?꾩닔 ?낅젰 泥댄겕
    if (!date) {
    alert('?좎쭨瑜??낅젰?댁＜?몄슂.');
    return;
    }
    if (!user) {
    alert('?대떦?먮? ?좏깮?댁＜?몄슂.');
    return;
    }
    if (!item) {
    alert('??ぉ???좏깮?댁＜?몄슂.');
    return;
    }
    if (!category) {
    alert('移댄뀒怨좊━瑜??좏깮?댁＜?몄슂.');
    return;
    }
    if (!amountRaw || amount <= 0) { alert('湲덉븸???щ컮瑜닿쾶 ?낅젰?댁＜?몄슂. (0蹂대떎 ??媛?'); return; } if (!paymentMethod) { alert('寃곗젣?섎떒??
      ?좏깮?댁＜?몄슂.'); return; } let paymentDetail='' ; if (paymentMethod==='credit' ) { const
      select=form.querySelector('select[name="credit-card" ]'); paymentDetail=select ? select.value : '' ; } else if
      (paymentMethod==='debit' ) { const select=form.querySelector('select[name="debit-card" ]'); paymentDetail=select ?
      select.value : '' ; } else if (paymentMethod==='transfer' ) { const
      select=form.querySelector('select[name="transfer-account" ]'); paymentDetail=select ? select.value : '' ; } else
      if (paymentMethod==='cash' ) { const select=form.querySelector('select[name="cash-account" ]');
      paymentDetail=select ? select.value : '' ; } if (editingId) { // ?섏젙 紐⑤뱶: 湲곗〈 ?곗씠???낅뜲?댄듃 const
      index=transactionData.findIndex(item=> item.id === editingId);
      if (index > -1) {
      transactionData[index] = {
      ...transactionData[index],
      date: date,
      user: user,
      type: type,
      item: item,
      category: category,
      amount: amount,
      paymentMethod: paymentMethod,
      paymentDetail: paymentDetail,
      merchant: merchant,
      detail: detail,
      recurring: recurring
      };
      saveData();
      // 怨꾩쥖 ?붿븸 ?먮룞 ?낅뜲?댄듃
      calculateAccountBalances();
      renderTable();
      renderCardTable('all');
      renderBankTable();
      updateDashboard();
      alert('?섏젙?섏뿀?듬땲??');
      closeModal();
      }
      } else {
      // ?좉퇋 ?낅젰 紐⑤뱶: ???곗씠??異붽?
      const now = Date.now();
      const entry = {
      id: now,
      date: date,
      user: user,
      type: type,
      item: item,
      category: category,
      amount: amount,
      paymentMethod: paymentMethod,
      paymentDetail: paymentDetail,
      merchant: merchant,
      detail: detail,
      recurring: recurring,
      status: '?노?湲?,
      timestamp: now
      };

      transactionData.push(entry);
      saveData();
      // 怨꾩쥖 ?붿븸 ?먮룞 ?낅뜲?댄듃
      calculateAccountBalances();
      renderTable();
      renderCardTable('all');
      renderBankTable();
      updateDashboard();
      alert('??λ릺?덉뒿?덈떎!');
      closeModal();
      }
      });
      }

      // ========================================
      // 7. 寃곗젣?섎떒 ?쒓? 蹂???⑥닔
      // ========================================
      function getPaymentMethodText(entry) {
      // paymentDetail???덉쑝硫?洹멸쾬???ъ슜
      if (entry.paymentDetail) {
      return entry.paymentDetail;
      }

      // paymentMethod瑜??쒓?濡?蹂??
      const methodMap = {
      'credit': '?좎슜移대뱶',
      'debit': '泥댄겕移대뱶',
      'transfer': '怨꾩쥖?댁껜',
      'cash': '?꾧툑'
      };

      return methodMap[entry.paymentMethod] || entry.paymentMethod;
      }

      // ========================================
      // 怨꾩쥖 ?붿븸 ?먮룞 怨꾩궛 ?⑥닔
      // ========================================
      function calculateAccountBalances() {
      // 紐⑤뱺 怨꾩쥖???붿븸??珥덇린??
      accountData.forEach(account => {
      if (account.type === 'bank') {
      // ?듭옣: 珥덇린 ?붿븸?쇰줈 珥덇린??
      account.currentBalance = account.initialBalance || 0;
      } else if (account.type === 'card') {
      // 移대뱶: ?ъ슜?≪쓣 0?쇰줈 珥덇린??(?쒕룄???좎?)
      account.currentBalance = 0;
      }
      });

      // 紐⑤뱺 嫄곕옒 ?댁뿭???좎쭨?쒖쑝濡??뺣젹?섏뿬 泥섎━
      const sortedTransactions = [...transactionData].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateA.getTime() === dateB.getTime()) {
      return (a.timestamp || 0) - (b.timestamp || 0);
      }
      return dateA.getTime() - dateB.getTime();
      });

      // 媛?嫄곕옒瑜?泥섎━?섏뿬 怨꾩쥖 ?붿븸 ?낅뜲?댄듃
      sortedTransactions.forEach(transaction => {
      const accountName = transaction.paymentDetail || '';

      // ?대떦 怨꾩쥖 李얘린
      const account = accountData.find(acc => acc.name === accountName);
      if (!account) return;

      if (account.type === 'bank') {
      // ?듭옣: ?섏엯? +, 吏異쒖? -
      if (transaction.type === 'income') {
      account.currentBalance += transaction.amount;
      } else if (transaction.type === 'expense') {
      account.currentBalance -= transaction.amount;
      }
      } else if (account.type === 'card') {
      // 移대뱶: 吏異쒕쭔 ?ъ슜?≪뿉 異붽? (?섏엯? ?놁쓬)
      if (transaction.type === 'expense') {
      account.currentBalance += transaction.amount;
      }
      }
      });

      // 怨꾩궛???붿븸 ???
      saveAccountData();
      }

      // ========================================
      // 怨꾩쥖 愿由????뚮뜑留?
      // ========================================
      function renderAccountsTab(container) {
      // ?붿븸 ?ш퀎??
      calculateAccountBalances();

      container.innerHTML = `
      <style>
        .accounts-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .accounts-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
        }

        .add-account-btn {
          background: #EF4444;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .add-account-btn:hover {
          background: #DC2626;
        }

        .accounts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 24px;
        }

        .account-card {
          background: #FFFFFF;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          border: 1px solid #E5E7EB;
          transition: all 0.2s ease;
        }

        .account-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
          transform: translateY(-2px);
        }

        .account-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .account-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 4px;
        }

        .account-type {
          font-size: 0.85rem;
          color: #6B7280;
          padding: 4px 8px;
          background: #F3F4F6;
          border-radius: 4px;
          display: inline-block;
        }

        .account-actions {
          display: flex;
          gap: 8px;
        }

        .account-action-btn {
          background: none;
          border: 1px solid #D1D5DB;
          color: #374151;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .account-action-btn:hover {
          background: #EF4444;
          color: #fff;
          border-color: #EF4444;
        }

        .account-balance {
          font-size: 1.5rem;
          font-weight: 700;
          color: #DC2626;
          margin-bottom: 12px;
        }

        .account-info {
          font-size: 0.9rem;
          color: #6B7280;
          margin-bottom: 8px;
        }

        .card-usage {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #E5E7EB;
        }

        .card-usage-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }

        .card-usage-label {
          color: #6B7280;
        }

        .card-usage-value {
          font-weight: 600;
          color: #111827;
        }

        .card-usage-bar {
          background: #E5E7EB;
          border-radius: 8px;
          height: 8px;
          overflow: hidden;
          margin-top: 8px;
        }

        .card-usage-fill {
          background: #EF4444;
          height: 100%;
          border-radius: 8px;
          transition: width 0.4s;
        }

        .card-usage-fill.warning {
          background: #F59E0B;
        }

        .card-usage-fill.danger {
          background: #EF4444;
        }

        @media (max-width: 600px) {
          .accounts-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
      <div class="accounts-header">
        <h2 class="accounts-title">怨꾩쥖 愿由?/h2>
        <button class="add-account-btn" id="add-account-btn">+ 怨꾩쥖 異붽?</button>
      </div>
      <div class="accounts-grid" id="accounts-grid">
        ${accountData.length === 0 ? '<div
          style="grid-column: 1/-1; text-align: center; padding: 40px; color: #6B7280;">?깅줉??怨꾩쥖媛 ?놁뒿?덈떎. 怨꾩쥖瑜?異붽??댁＜?몄슂.</div>'
        : ''}
      </div>

      <!-- 怨꾩쥖蹂??낆텧湲??댁뿭 ?뱀뀡 -->
      <div style="margin-top: 48px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <h3 style="font-size: 1.25rem; font-weight: 600; color: #111827; margin: 0;">?뱥 怨꾩쥖蹂??낆텧湲??댁뿭</h3>
          <button id="register-card-payment-btn"
            style="padding: 10px 20px; border: none; border-radius: 8px; font-size: 0.95rem; font-weight: 500; cursor: pointer; background: #EF4444; color: #fff; transition: background 0.2s;"
            onmouseover="this.style.background='#DC2626'" onmouseout="this.style.background='#EF4444'">?뮥 ?낆텧湲??댁뿭
            ?깅줉</button>
        </div>
        <div style="margin-bottom: 24px;">
          <label for="account-filter-select"
            style="font-size: 0.95rem; font-weight: 500; color: #374151; margin-right: 12px;">怨꾩쥖 ?좏깮:</label>
          <select id="account-filter-select"
            style="padding: 10px 14px; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 0.95rem; outline: none; cursor: pointer; background: #FFFFFF; color: #111827; transition: all 0.2s ease; min-width: 200px;">
            <option value="all">?꾩껜 怨꾩쥖</option>
          </select>
        </div>
        <div id="account-transaction-table"></div>
      </div>
      `;

      // 怨꾩쥖 移대뱶 ?뚮뜑留?
      const accountsGrid = container.querySelector('#accounts-grid');
      if (accountsGrid && accountData.length > 0) {
      accountsGrid.innerHTML = '';
      accountData.forEach(account => {
      const card = document.createElement('div');
      card.className = 'account-card';

      if (account.type === 'bank') {
      // ?듭옣 怨꾩쥖
      card.innerHTML = `
      <div class="account-header">
        <div>
          <div class="account-name">${account.name}</div>
          <span class="account-type">?듭옣</span>
        </div>
        <div class="account-actions">
          <button class="account-action-btn" onclick="editAccount(${account.id})">?섏젙</button>
          <button class="account-action-btn" onclick="deleteAccount(${account.id})">??젣</button>
        </div>
      </div>
      <div class="account-balance">${(account.currentBalance || 0).toLocaleString()}??/div>
      <div class="account-info">珥덇린 ?붿븸: ${(account.initialBalance || 0).toLocaleString()}??/div>
      `;
      } else if (account.type === 'card') {
      // 移대뱶 怨꾩쥖
      const creditLimit = account.creditLimit || 0;
      const usedAmount = account.currentBalance || 0; // ?ъ슜??
      const availableAmount = creditLimit - usedAmount; // 媛???붿븸
      const usageRate = creditLimit > 0 ? (usedAmount / creditLimit) * 100 : 0;

      let usageBarClass = '';
      if (usageRate >= 80) usageBarClass = 'danger';
      else if (usageRate >= 60) usageBarClass = 'warning';

      card.innerHTML = `
      <div class="account-header">
        <div>
          <div class="account-name">${account.name}</div>
          <span class="account-type">移대뱶</span>
        </div>
        <div class="account-actions">
          <button class="account-action-btn" onclick="editAccount(${account.id})">?섏젙</button>
          <button class="account-action-btn" onclick="deleteAccount(${account.id})">??젣</button>
        </div>
      </div>
      <div class="card-usage">
        <div class="card-usage-item">
          <span class="card-usage-label">?ъ슜??/span>
          <span class="card-usage-value">${usedAmount.toLocaleString()}??/span>
        </div>
        <div class="card-usage-item">
          <span class="card-usage-label">?쒕룄</span>
          <span class="card-usage-value">${creditLimit.toLocaleString()}??/span>
        </div>
        <div class="card-usage-item">
          <span class="card-usage-label">?ъ슜瑜?/span>
          <span class="card-usage-value">${Math.round(usageRate)}%</span>
        </div>
        <div class="card-usage-bar">
          <div class="card-usage-fill ${usageBarClass}" style="width: ${Math.min(usageRate, 100)}%"></div>
        </div>
        ${account.paymentDay ? `<div class="account-info" style="margin-top: 12px;">寃곗젣?? 留ㅼ썡 ${account.paymentDay}??/div>
        ` : ''}
        ${account.linkedAccount ? `<div class="account-info">?곌껐怨꾩쥖: ${account.linkedAccount}</div>` : ''}
      </div>
      `;
      }

      accountsGrid.appendChild(card);
      });
      }

      // 怨꾩쥖 異붽? 踰꾪듉 ?대깽??
      const addAccountBtn = container.querySelector('#add-account-btn');
      if (addAccountBtn) {
      addAccountBtn.addEventListener('click', () => {
      openAccountModal();
      });
      }

      // 移대뱶 ?湲??깅줉 踰꾪듉 ?대깽??
      const registerCardPaymentBtn = container.querySelector('#register-card-payment-btn');
      if (registerCardPaymentBtn) {
      registerCardPaymentBtn.addEventListener('click', () => {
      openCardPaymentModal();
      });
      }

      // 怨꾩쥖 ?꾪꽣 ?듭뀡 ?낅뜲?댄듃 諛?怨꾩쥖蹂??낆텧湲??댁뿭 ?뚮뜑留?
      updateAccountFilterOptions();
      renderAccountTransactionTable('all');

      // 怨꾩쥖 ?꾪꽣 ?쒕∼?ㅼ슫 ?대깽??由ъ뒪??
      const accountFilterSelect = container.querySelector('#account-filter-select');
      if (accountFilterSelect) {
      accountFilterSelect.addEventListener('change', function() {
      renderAccountTransactionTable(this.value);
      });
      }
      }

      // ========================================
      // 怨꾩쥖 ?꾪꽣 ?듭뀡 ?낅뜲?댄듃 ?⑥닔
      // ========================================
      function updateAccountFilterOptions() {
      const select = document.getElementById('account-filter-select');
      if (!select) return;

      // 湲곗〈 ?듭뀡 ?쒓굅 (泥?踰덉㎏ ?듭뀡 ?쒖쇅)
      while (select.children.length > 1) {
      select.removeChild(select.lastChild);
      }

      // 怨꾩쥖 ?꾩씠肄?留ㅽ븨
      const accountIcons = {
      'bank': '?룱',
      'card': '?뮩'
      };

      // accountData瑜??쒗쉶?섎ŉ ?듭뀡 ?숈쟻 ?앹꽦
      accountData.forEach(account => {
      const option = document.createElement('option');
      option.value = account.name;
      const icon = accountIcons[account.type] || '?뱤';
      option.textContent = `${icon} ${account.name}`;
      select.appendChild(option);
      });

      console.log('怨꾩쥖 ?꾪꽣 ?듭뀡 ?낅뜲?댄듃:', accountData.length, '媛?怨꾩쥖');
      }

      // ========================================
      // 怨꾩쥖蹂??낆텧湲??댁뿭 ?뚯씠釉??뚮뜑留??⑥닔
      // ========================================
      function renderAccountTransactionTable(selectedAccount = 'all') {
      const tableContainer = document.getElementById('account-transaction-table');
      if (!tableContainer) return;

      // ?꾩옱 ?좏깮???붿쓽 ?곗씠??媛?몄삤湲?
      let monthData = getCurrentMonthData();

      // 移대뱶 ?ъ슜 ?댁뿭 ?쒖쇅 (移대뱶 ?湲?泥?뎄???ы븿)
      // paymentMethod媛 'credit' ?먮뒗 'debit'????ぉ? ?쒖쇅
      // ?? isCardPayment媛 true????ぉ(移대뱶 ?湲?泥?뎄)? ?ы븿
      monthData = monthData.filter(entry => {
      // 移대뱶 ?湲?泥?뎄 ??ぉ? ?ы븿
      if (entry.isCardPayment === true) {
      return true;
      }
      // 移대뱶 ?ъ슜 ?댁뿭(credit/debit)? ?쒖쇅
      if (entry.paymentMethod === 'credit' || entry.paymentMethod === 'debit') {
      return false;
      }
      // 怨꾩쥖?댁껜? ?꾧툑留??ы븿
      return entry.paymentMethod === 'transfer' || entry.paymentMethod === 'cash';
      });

      // ?좏깮??怨꾩쥖濡??꾪꽣留?
      if (selectedAccount !== 'all') {
      monthData = monthData.filter(entry => {
      // paymentDetail???좏깮??怨꾩쥖紐낆씠 ?ы븿?섏뼱 ?덈뒗吏 ?뺤씤
      return entry.paymentDetail && entry.paymentDetail.includes(selectedAccount);
      });
      }

      console.log('怨꾩쥖 ?낆텧湲??뚮뜑留?(移대뱶 ?쒖쇅):', monthData.length, '媛???ぉ');

      // ?좎쭨?쒖쑝濡??뺣젹 (?ㅻ옒??寃껊???
      const sortedData = [...monthData].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateA.getTime() === dateB.getTime()) {
      return (a.timestamp || 0) - (b.timestamp || 0);
      }
      return dateA.getTime() - dateB.getTime();
      });

      // ?좏깮??怨꾩쥖 ?뺣낫 媛?몄삤湲?
      let selectedAccountData = null;
      if (selectedAccount !== 'all') {
      selectedAccountData = accountData.find(acc => acc.name === selectedAccount);
      }

      // 珥덇린 ?붿븸 ?ㅼ젙
      let runningBalance = 0;
      if (selectedAccountData) {
      if (selectedAccountData.type === 'bank') {
      runningBalance = selectedAccountData.initialBalance || 0;
      } else if (selectedAccountData.type === 'card') {
      runningBalance = selectedAccountData.creditLimit || 0;
      }
      }

      // ?뚯씠釉?HTML ?앹꽦
      let tableHTML = `
      <div class="expense-table-container">
        <table class="expense-table" aria-label="怨꾩쥖蹂??낆텧湲??댁뿭">
          <thead>
            <tr>
              <th style="width: 40px;"><input type="checkbox" id="select-all-account-checkbox"
                  style="width: 18px; height: 18px; cursor: pointer;"></th>
              <th>?좎쭨</th>
              <th>?대떦??/th>
              <th>??ぉ</th>
              <th>移댄뀒怨좊━</th>
              <th>湲덉븸</th>
              <th>怨꾩쥖/移대뱶</th>
              <th>?붿븸</th>
              <th>?묒뾽</th>
            </tr>
          </thead>
          <tbody>
            `;

            if (sortedData.length === 0) {
            tableHTML += `
            <tr>
              <td colspan="8" style="text-align:center; padding:40px;">?낆텧湲??댁뿭???놁뒿?덈떎</td>
            </tr>
            `;
            } else {
            sortedData.forEach(entry => {
            const dateObj = new Date(entry.date);
            const dateStr = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;

            // ?붿븸 怨꾩궛
            if (selectedAccountData) {
            if (selectedAccountData.type === 'bank') {
            // ?듭옣: ?섏엯? +, 吏異쒖? -
            if (entry.type === 'income') {
            runningBalance += entry.amount;
            } else if (entry.type === 'expense') {
            runningBalance -= entry.amount;
            }
            } else if (selectedAccountData.type === 'card') {
            // 移대뱶: 吏異쒕쭔 ?ъ슜?≪뿉 異붽?
            if (entry.type === 'expense') {
            runningBalance -= entry.amount;
            }
            }
            }

            // 湲덉븸 ?쒖떆
            let amountStr = '';
            let amountClass = '';
            if (entry.type === 'income') {
            amountStr = `+${entry.amount.toLocaleString()}??;
            amountClass = 'expense-income';
            } else {
            amountStr = `-${entry.amount.toLocaleString()}??;
            amountClass = 'expense-out';
            }

            // ?붿븸 ?됱긽 ?ㅼ젙
            const balanceColor = runningBalance >= 0 ? '#DC2626' : '#DC2626';
            const balanceStr = `${runningBalance.toLocaleString()}??;

            const paymentMethodText = getPaymentMethodText(entry);

            tableHTML += `
            <tr>
              <td><input type="checkbox" class="row-checkbox-account" data-id="${entry.id}"
                  style="width: 18px; height: 18px; cursor: pointer;"></td>
              <td>${dateStr}</td>
              <td>${entry.user}</td>
              <td>${entry.item}</td>
              <td>${entry.category}</td>
              <td class="${amountClass}">${amountStr}</td>
              <td>${paymentMethodText}</td>
              <td style="color: ${balanceColor}; font-weight: 600;">${balanceStr}</td>
              <td>
                <button class="btn-action" onclick="editTransaction(${entry.id})">?섏젙</button>
                <button class="btn-action" onclick="deleteTransaction(${entry.id})">??젣</button>
              </td>
            </tr>
            `;
            });
            }

            tableHTML += `
          </tbody>
        </table>
      </div>
      `;

      tableContainer.innerHTML = tableHTML;
      console.log('怨꾩쥖蹂??낆텧湲??댁뿭 ?뚮뜑留?', sortedData.length, '媛???ぉ', selectedAccount !== 'all' ? `(?꾪꽣: ${selectedAccount})` :
      '(?꾩껜)');
      }

      // ========================================
      // 移대뱶 愿由?愿???⑥닔
      // ========================================

      let editingCardId = null;

      // 移대뱶 紐⑸줉 ?뚮뜑留?
      function renderCardList() {
      const cardList = document.getElementById('card-list');
      if (!cardList) return;

      cardList.innerHTML = '';

      if (cardData.length === 0) {
      cardList.innerHTML = '<div style="text-align: center; padding: 20px; color: #6B7280;">?깅줉??移대뱶媛 ?놁뒿?덈떎.</div>';
      return;
      }

      cardData.forEach(card => {
      const item = document.createElement('div');
      item.style.cssText = 'display: flex; align-items: center; justify-content: space-between; padding: 12px;
      background: #F9FAFB; border-radius: 8px; border: 1px solid #E5E7EB;';
      item.innerHTML = `
      <div style="flex: 1;">
        <div style="font-weight: 600; color: #111827; margin-bottom: 4px;">${card.name}</div>
        <div style="font-size: 0.85rem; color: #6B7280;">
          ${card.type === 'credit' ? '?좎슜移대뱶' : '泥댄겕移대뱶'} 쨌 ${card.cardCompany || '誘몄???}
        </div>
      </div>
      <div style="display: flex; gap: 8px;">
        <button type="button" onclick="editCard(${card.id})"
          style="padding: 6px 12px; border: 1px solid #EF4444; border-radius: 6px; font-size: 0.85rem; background: #FFFFFF; color: #EF4444; cursor: pointer; transition: all 0.2s;"
          onmouseover="this.style.background='#EF4444'; this.style.color='#fff'"
          onmouseout="this.style.background='#FFFFFF'; this.style.color='#EF4444'">?섏젙</button>
        <button type="button" onclick="deleteCard(${card.id})"
          style="padding: 6px 12px; border: 1px solid #DC2626; border-radius: 6px; font-size: 0.85rem; background: #FFFFFF; color: #DC2626; cursor: pointer; transition: all 0.2s;"
          onmouseover="this.style.background='#DC2626'; this.style.color='#fff'"
          onmouseout="this.style.background='#FFFFFF'; this.style.color='#DC2626'">??젣</button>
      </div>
      `;
      cardList.appendChild(item);
      });
      }

      // 移대뱶 愿由?紐⑤떖 ?닿린
      function legacy_openCardManageModal(isEdit = false, cardId = null, isCompanyMode = false, preSelectedCompany =
      null) {
      const modal = document.getElementById('card-manage-modal-overlay');
      if (!modal) return;

      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';

      const form = document.getElementById('card-manage-form');
      const title = document.getElementById('card-manage-modal-title');

      if (title) {
      title.textContent = isCompanyMode ? '?뮩 移대뱶??異붽?' : (isEdit ? '?뮩 移대뱶 ?섏젙' : '?뮩 移대뱶 異붽?');
      }

      if (form) {
      form.reset();

      // 移대뱶??紐⑤뱶??寃쎌슦 移대뱶???좏깮 ?꾨뱶??誘몃━ ?좏깮
      if (isCompanyMode && preSelectedCompany) {
      const companySelect = document.getElementById('card-manage-company');
      if (companySelect) {
      companySelect.value = preSelectedCompany;
      }
      } else if (preSelectedCompany) {
      const companySelect = document.getElementById('card-manage-company');
      if (companySelect) {
      companySelect.value = preSelectedCompany;
      }
      }
      }

      editingCardId = cardId || null;
      renderCardList();
      }

      // 移대뱶 愿由?紐⑤떖 ?リ린
      function legacy_closeCardManageModal() {
      const modal = document.getElementById('card-manage-modal-overlay');
      if (!modal) return;

      modal.style.display = 'none';
      document.body.style.overflow = '';

      const form = document.getElementById('card-manage-form');
      if (form) {
      form.reset();
      }

      editingCardId = null;
      }

      // 移대뱶 ?섏젙
      window.legacy_editCard = function(id) {
      const card = cardData.find(c => c.id === id);
      if (!card) return;

      const form = document.getElementById('card-manage-form');
      if (!form) return;

      document.getElementById('card-manage-name').value = card.name;
      const typeRadios = form.querySelectorAll('input[name="card-type"]');
      typeRadios.forEach(radio => {
      radio.checked = radio.value === card.type;
      });
      document.getElementById('card-manage-company').value = card.cardCompany || '';

      editingCardId = id;
      openCardManageModal(true);
      };

      // 移대뱶 ??젣
      window.legacy_deleteCard = function(id) {
      if (confirm('?뺣쭚 ??젣?섏떆寃좎뒿?덇퉴?')) {
      const index = cardData.findIndex(c => c.id === id);
      if (index > -1) {
      cardData.splice(index, 1);
      saveCardData();
      renderCardList();
      updateCardSelects(); // 紐⑤뱺 移대뱶 ?좏깮 ?쒕∼?ㅼ슫 ?낅뜲?댄듃
      alert('??젣?섏뿀?듬땲??');
      }
      }
      };

      // 移대뱶 ?좏깮 ?쒕∼?ㅼ슫 ?낅뜲?댄듃 (寃곗젣?섎떒??
      function legacy_updatePaymentCardSelects() {
      // ?좎슜移대뱶 ?좏깮
      const creditSelect = document.querySelector('select[name="credit-card"]');
      if (creditSelect) {
      creditSelect.innerHTML = '<option value="">--?좏깮--</option>';
      cardData.filter(c => c.type === 'credit').forEach(card => {
      const option = document.createElement('option');
      option.value = card.name;
      option.textContent = card.name;
      creditSelect.appendChild(option);
      });
      }

      // 泥댄겕移대뱶 ?좏깮
      const debitSelect = document.querySelector('select[name="debit-card"]');
      if (debitSelect) {
      debitSelect.innerHTML = '<option value="">--?좏깮--</option>';
      cardData.filter(c => c.type === 'debit').forEach(card => {
      const option = document.createElement('option');
      option.value = card.name;
      option.textContent = card.name;
      debitSelect.appendChild(option);
      });
      }
      }

      // 移대뱶 ?湲??깅줉 紐⑤떖??移대뱶 ?좏깮 ?낅뜲?댄듃
      function legacy_updateCardPaymentCardSelect(selectedCompany) {
      const cardSelect = document.getElementById('card-payment-card-select');
      if (!cardSelect) return;

      cardSelect.innerHTML = '<option value="">--?좏깮--</option>';

      if (selectedCompany) {
      cardData.filter(c => c.cardCompany === selectedCompany).forEach(card => {
      const option = document.createElement('option');
      option.value = card.name;
      option.textContent = card.name;
      cardSelect.appendChild(option);
      });
      }
      }

      // ?먮룞 ?낅젰 ??쓽 移대뱶 ?좏깮 ?낅뜲?댄듃
      function legacy_updateEntryAutoCardSelect(selectedCompany) {
      const cardSelect = document.getElementById('entry-auto-card-select');
      if (!cardSelect) return;

      cardSelect.innerHTML = '<option value="">--移대뱶?щ? 癒쇱? ?좏깮?섏꽭??-</option>';

      if (selectedCompany) {
      cardData.filter(c => c.cardCompany === selectedCompany).forEach(card => {
      const option = document.createElement('option');
      option.value = card.name;
      option.textContent = card.name;
      cardSelect.appendChild(option);
      });
      }
      }

      // 紐⑤뱺 移대뱶 ?좏깮 ?쒕∼?ㅼ슫 ?낅뜲?댄듃
      function legacy_updateCardSelects() {
      updatePaymentCardSelects();
      // 移대뱶 ?湲??깅줉 紐⑤떖???대젮?덉쑝硫?移대뱶???좏깮???곕씪 ?낅뜲?댄듃
      const cardCompanySelect = document.getElementById('card-payment-card-company-select');
      if (cardCompanySelect && cardCompanySelect.value) {
      updateCardPaymentCardSelect(cardCompanySelect.value);
      }
      // ?먮룞 ?낅젰 ??쓽 移대뱶 ?좏깮 ?낅뜲?댄듃
      const entryCardCompanySelect = document.getElementById('entry-auto-card-company');
      if (entryCardCompanySelect && entryCardCompanySelect.value) {
      updateEntryAutoCardSelect(entryCardCompanySelect.value);
      }
      }

      // ========================================
      // 移대뱶 ?湲??깅줉 紐⑤떖 愿???⑥닔
      // ========================================

      // 移대뱶 ?湲??깅줉 紐⑤떖 ?닿린
      function legacy_openCardPaymentModal() {
      const modal = document.getElementById('card-payment-modal-overlay');
      if (!modal) return;

      // 紐⑤떖 ?쒖떆
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';

      // 移대뱶???좏깮 ?쒕∼?ㅼ슫 梨꾩슦湲?
      const cardCompanySelect = document.getElementById('card-payment-card-company-select');
      if (cardCompanySelect) {
      // 湲곗〈 ?듭뀡 ?쒓굅 (泥?踰덉㎏ ?듭뀡 ?쒖쇅)
      while (cardCompanySelect.children.length > 1) {
      cardCompanySelect.removeChild(cardCompanySelect.lastChild);
      }

      // ?깅줉??移대뱶?먯꽌 移대뱶??紐⑸줉 異붿텧
      const companies = [...new Set(cardData.map(c => c.cardCompany).filter(c => c))];
      companies.forEach(company => {
      const option = document.createElement('option');
      option.value = company;
      option.textContent = company;
      cardCompanySelect.appendChild(option);
      });

      cardCompanySelect.value = '';
      }

      // 移대뱶 ?좏깮 珥덇린??
      const cardSelect = document.getElementById('card-payment-card-select');
      if (cardSelect) {
      cardSelect.innerHTML = '<option value="">--移대뱶?щ? 癒쇱? ?좏깮?섏꽭??-</option>';
      }

      // 怨꾩쥖 select ?듭뀡 梨꾩슦湲?(accountData?먯꽌 bank留?
      const accountSelect = document.getElementById('card-payment-account-select');
      if (accountSelect) {
      // 湲곗〈 ?듭뀡 ?쒓굅 (泥?踰덉㎏ ?듭뀡 ?쒖쇅)
      while (accountSelect.children.length > 1) {
      accountSelect.removeChild(accountSelect.lastChild);
      }

      // ?듭옣 怨꾩쥖留?異붽?
      accountData.filter(acc => acc.type === 'bank').forEach(account => {
      const option = document.createElement('option');
      option.value = account.name;
      option.textContent = account.name;
      accountSelect.appendChild(option);
      });
      }

      // ?ㅻ뒛 ?좎쭨濡?泥?뎄???ㅼ젙
      const today = new Date();
      const paymentDateInput = document.getElementById('card-payment-date');
      if (paymentDateInput) {
      paymentDateInput.value = today.toISOString().split('T')[0];
      }

      // ?곕룄 ?좏깮 ?쒕∼?ㅼ슫 珥덇린??
      const yearSelect = document.getElementById('card-payment-year-select');
      if (yearSelect) {
      yearSelect.innerHTML = '<option value="">?곕룄</option>';
      // 2024?꾨???2060?꾧퉴吏
      for (let year = 2024; year <= 2060; year++) { const option=document.createElement('option'); option.value=year;
        option.textContent=`${year}??; // ?꾩옱 ?곕룄 ?먮룞 ?좏깮 if (year===today.getFullYear()) { option.selected=true; }
        yearSelect.appendChild(option); } } // ???좏깮 ?쒕∼?ㅼ슫 珥덇린??const
        monthSelect=document.getElementById('card-payment-month-select'); if (monthSelect) {
        monthSelect.innerHTML='<option value="">??/option>' ; // 1?붾???12?붽퉴吏 for (let month=1; month <=12; month++) {
        const option=document.createElement('option'); option.value=month; option.textContent=`${month}??; // ?꾩옱 ???먮룞 ?좏깮
        if (month===today.getMonth() + 1) { option.selected=true; } monthSelect.appendChild(option); } } // 珥덇린 ?좎쭨 ?ㅼ젙 (?꾩옱
        ?곕룄/??湲곗?) const periodStartInput=document.getElementById('card-payment-period-start'); const
        periodEndInput=document.getElementById('card-payment-period-end'); if (periodStartInput && periodEndInput &&
        yearSelect && monthSelect) { const selectedYear=yearSelect.value || today.getFullYear(); const
        selectedMonth=monthSelect.value || (today.getMonth() + 1); if (selectedYear && selectedMonth) { const
        startDate=new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1, 1); const endDate=new
        Date(parseInt(selectedYear), parseInt(selectedMonth), 0);
        periodStartInput.value=startDate.toISOString().split('T')[0];
        periodEndInput.value=endDate.toISOString().split('T')[0]; } } // ?좏슚??泥댄겕 珥덇린??validateCardPayment();
        console.log('移대뱶 ?湲??깅줉 紐⑤떖 ?닿린'); } // 移대뱶 ?湲??깅줉 紐⑤떖 ?リ린 function legacy_closeCardPaymentModal() { const
        modal=document.getElementById('card-payment-modal-overlay'); if (!modal) return; modal.style.display='none' ;
        document.body.style.overflow='' ; // ??珥덇린??const form=document.getElementById('card-payment-form'); if (form) {
        form.reset(); } // ?좏슚??泥댄겕 珥덇린??document.getElementById('card-usage-sum').textContent='0?? ;
        document.getElementById('card-billing-amount').textContent='0?? ;
        document.getElementById('card-difference').textContent='0?? ;
        document.getElementById('validation-message').style.display='none' ;
        document.getElementById('card-payment-adjustment').style.display='none' ;
        document.getElementById('file-info').textContent='' ;
        document.getElementById('parse-result').style.display='none' ; console.log('移대뱶 ?湲??깅줉 紐⑤떖 ?リ린'); } // 湲덉븸 ?뚯떛 ?⑥닔 (肄ㅻ쭏
        ?쒓굅) function parseAmount(value) { if (!value) return 0; return Number(value.replace(/,/g, '' )) || 0; } // ?좏슚??
        泥댄겕 ?⑥닔 function validateCardPayment() { const
        cardCompany=document.getElementById('card-payment-card-company-select')?.value; const
        cardName=document.getElementById('card-payment-card-select')?.value; const
        periodStart=document.getElementById('card-payment-period-start')?.value; const
        periodEnd=document.getElementById('card-payment-period-end')?.value; const
        billingAmountRaw=document.getElementById('card-payment-amount')?.value || '' ; const
        billingAmount=parseAmount(billingAmountRaw); if (!cardCompany || !cardName || !periodStart || !periodEnd) { //
        ?꾩닔 ??ぉ???놁쑝硫?珥덇린??document.getElementById('card-usage-sum').textContent='0?? ;
        document.getElementById('card-billing-amount').textContent='0?? ;
        document.getElementById('card-difference').textContent='0?? ;
        document.getElementById('validation-message').style.display='none' ; return; } // 湲곌컙 ??移대뱶 ?ъ슜 ?댁뿭 ?꾪꽣留?const
        cardUsage=transactionData.filter(entry=> {
        // 移대뱶 ?ъ슜 ?댁뿭留?(移대뱶 ?湲?泥?뎄 ?쒖쇅)
        if (entry.isCardPayment === true) return false;
        if (entry.paymentMethod !== 'credit' && entry.paymentMethod !== 'debit') return false;
        if (entry.paymentDetail !== cardName) return false;

        const entryDate = new Date(entry.date);
        const start = new Date(periodStart);
        const end = new Date(periodEnd);

        // ?좎쭨 踰붿쐞 泥댄겕 (?쒓컙 ?쒖쇅)
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        entryDate.setHours(12, 0, 0, 0);

        return entryDate >= start && entryDate <= end; }); // ?⑷퀎 怨꾩궛 const usageSum=cardUsage.reduce((sum, entry)=> sum +
          entry.amount, 0);

          // UI ?낅뜲?댄듃
          document.getElementById('card-usage-sum').textContent = usageSum.toLocaleString() + '??;
          document.getElementById('card-billing-amount').textContent = billingAmount.toLocaleString() + '??;

          const difference = usageSum - billingAmount;
          const diffElement = document.getElementById('card-difference');
          const msgElement = document.getElementById('validation-message');

          diffElement.textContent = Math.abs(difference).toLocaleString() + '??;

          if (difference === 0) {
          // ?쇱튂
          diffElement.style.color = '#059669';
          msgElement.style.display = 'block';
          msgElement.style.background = '#D1FAE5';
          msgElement.style.color = '#065F46';
          msgElement.textContent = '???ъ슜 ?댁뿭怨?泥?뎄 湲덉븸???쇱튂?⑸땲??';
          } else if (difference > 0) {
          // ?ъ슜?≪씠 ??留롮쓬
          diffElement.style.color = '#DC2626';
          msgElement.style.display = 'block';
          msgElement.style.background = '#FEE2E2';
          msgElement.style.color = '#991B1B';
          msgElement.textContent = '???ъ슜 ?댁뿭??泥?뎄 湲덉븸蹂대떎 ' + Math.abs(difference).toLocaleString() + '??留롮뒿?덈떎. ?꾨씫???좎씤???덈뒗吏
          ?뺤씤?섏꽭??';
          } else {
          // 泥?뎄?≪씠 ??留롮쓬
          diffElement.style.color = '#DC2626';
          msgElement.style.display = 'block';
          msgElement.style.background = '#FEE2E2';
          msgElement.style.color = '#991B1B';
          msgElement.textContent = '??泥?뎄 湲덉븸???ъ슜 ?댁뿭蹂대떎 ' + Math.abs(difference).toLocaleString() + '??留롮뒿?덈떎. ?섏닔猷뚮굹 ?댁옄媛 ?덈뒗吏
          ?뺤씤?섏꽭??';
          }

          console.log('?좏슚??泥댄겕:', { usageSum, billingAmount, difference, cardUsageCount: cardUsage.length });
          }

          // ========================================
          // ?묒? ?뚯씪 ?뚯떛 愿???⑥닔
          // ========================================

          // ?좎쭨 ?뚯떛 ?ы띁 ?⑥닔
          function legacy_parseDate(value) {
          if (!value) return null;

          const str = String(value);

          // Excel ?좎쭨 ?レ옄 ?뺤떇 (?? 45678)
          if (typeof value === 'number' && value > 25569) {
          // Excel ?좎쭨??1900-01-01遺?곗쓽 ?쇱닔
          const excelEpoch = new Date(1900, 0, 1);
          const date = new Date(excelEpoch.getTime() + (value - 1) * 24 * 60 * 60 * 1000);
          return date.toISOString().split('T')[0];
          }

          // 2025-11-23 ?뺤떇
          if (/\d{4}[-./]\d{2}[-./]\d{2}/.test(str)) {
          return str.replace(/[./]/g, '-').substring(0, 10);
          }

          // 20251123 ?뺤떇
          if (/^\d{8}$/.test(str)) {
          return str.substring(0, 4) + '-' + str.substring(4, 6) + '-' + str.substring(6, 8);
          }

          // 11/23 ?뺤떇 (?ы빐濡?媛??
          if (/^\d{1,2}[/-]\d{1,2}$/.test(str)) {
          const parts = str.split(/[/-]/);
          const year = new Date().getFullYear();
          const month = parts[0].padStart(2, '0');
          const day = parts[1].padStart(2, '0');
          return `${year}-${month}-${day}`;
          }

          return null;
          }

          // 湲덉븸 ?뚯떛 ?ы띁 ?⑥닔
          function legacy_parseAmountFromCell(value) {
          if (!value) return 0;

          const str = String(value).replace(/[^0-9.-]/g, '');
          const num = parseFloat(str);

          return isNaN(num) ? 0 : Math.abs(num);
          }

          // 移대뱶??媛먯? ?⑥닔
          function legacy_detectCardCompany(filename, data) {
          const name = filename.toLowerCase();

          // ?뚯씪紐낆뿉??移대뱶??媛먯? (???ㅼ뼇???⑦꽩 吏??
          if (name.includes('kb') || name.includes('援??') || name.includes('kookmin')) {
          return 'KB移대뱶';
          } else if (name.includes('samsung') || name.includes('?쇱꽦') || name.includes('samsungcard')) {
          return '?쇱꽦移대뱶';
          } else if (name.includes('shinhan') || name.includes('?좏븳')) {
          return '?좏븳移대뱶';
          } else if (name.includes('hyundai') || name.includes('?꾨?')) {
          return '?꾨?移대뱶';
          } else if (name.includes('lotte') || name.includes('濡?뜲')) {
          return '濡?뜲移대뱶';
          } else if (name.includes('hana') || name.includes('?섎굹')) {
          return '?섎굹移대뱶';
          } else if (name.includes('woori') || name.includes('?곕━')) {
          return '?곕━移대뱶';
          } else if (name.includes('nh') || name.includes('?랁삊')) {
          return 'NH移대뱶';
          }

          // ?뚯씪 ?댁슜?먯꽌 移대뱶??李얘린 (???볦? 踰붿쐞 寃??
          const firstRows = data.slice(0, 15).flat().join(' ');
          const firstRowsLower = firstRows.toLowerCase();

          if (firstRowsLower.includes('kb') || firstRowsLower.includes('援??') || firstRowsLower.includes('kookmin')) {
          return 'KB移대뱶';
          } else if (firstRowsLower.includes('?쇱꽦') || firstRowsLower.includes('samsung')) {
          return '?쇱꽦移대뱶';
          } else if (firstRowsLower.includes('?좏븳') || firstRowsLower.includes('shinhan')) {
          return '?좏븳移대뱶';
          } else if (firstRowsLower.includes('?꾨?') || firstRowsLower.includes('hyundai')) {
          return '?꾨?移대뱶';
          } else if (firstRowsLower.includes('濡?뜲') || firstRowsLower.includes('lotte')) {
          return '濡?뜲移대뱶';
          } else if (firstRowsLower.includes('?섎굹') || firstRowsLower.includes('hana')) {
          return '?섎굹移대뱶';
          } else if (firstRowsLower.includes('?곕━') || firstRowsLower.includes('woori')) {
          return '?곕━移대뱶';
          } else if (firstRowsLower.includes('nh') || firstRowsLower.includes('?랁삊')) {
          return 'NH移대뱶';
          }

          return '?????놁쓬';
          }

          // KB移대뱶 ?뚯떛 ?⑥닔
          function legacy_parseKBCard(data) {
          console.log('KB移대뱶 ?뚯떛 ?쒖옉, ?곗씠??????', data.length);

          // ?ㅻ뜑 李얘린 (???좎뿰?섍쾶)
          let headerRow = -1;
          for (let i = 0; i < Math.min(20, data.length); i++) { const row=data[i]; if (!row || row.length===0) continue;
            // ?됱쓽 紐⑤뱺 ???臾몄옄?대줈 蹂?섑븯??寃??const rowText=row.map(cell=> String(cell || '')).join(' ').toLowerCase();

            // 嫄곕옒?? ?뱀씤?쇱떆, ?댁슜??以??섎굹?쇰룄 ?덉쑝硫??ㅻ뜑濡??몄떇
            if (rowText.includes('嫄곕옒??) || rowText.includes('?뱀씤?쇱떆') || rowText.includes('?댁슜??) ||
            rowText.includes('嫄곕옒?쇱옄') || rowText.includes('?뱀씤?쇱옄')) {
            headerRow = i;
            console.log('?ㅻ뜑 ??諛쒓껄:', i, '?댁슜:', row);
            break;
            }
            }

            // ?ㅻ뜑瑜?紐?李얠? 寃쎌슦, ?좎쭨 ?⑦꽩???덈뒗 泥?踰덉㎏ ?됱쓣 ?ㅻ뜑濡??쒕룄
            if (headerRow === -1) {
            for (let i = 0; i < Math.min(10, data.length); i++) { const row=data[i]; if (!row) continue; // ?좎쭨 ?⑦꽩???덇퀬,
              ?レ옄(湲덉븸)???덈뒗 ?됱쓣 ?ㅻ뜑 ?ㅼ쓬 ?됱쑝濡?媛꾩＜ let hasDate=false; let hasAmount=false; for (let cell of row) { const
              cellStr=String(cell || '' ); if (/\d{4}[-./]\d{1,2}[-./]\d{1,2}/.test(cellStr) || (typeof cell==='number'
              && cell> 25569)) {
              hasDate = true;
              }
              const amount = parseAmountFromCell(cell);
              if (amount > 1000) {
              hasAmount = true;
              }
              }

              if (hasDate && hasAmount) {
              // ???됱씠 ?곗씠???됱씠誘濡? ?댁쟾 ?됱씠 ?ㅻ뜑??媛?μ꽦
              if (i > 0) {
              headerRow = i - 1;
              console.log('異붿젙 ?ㅻ뜑 ??', headerRow);
              break;
              }
              }
              }
              }

              if (headerRow === -1) {
              throw new Error('?ㅻ뜑瑜?李얠쓣 ???놁뒿?덈떎. ?뚯씪 ?뺤떇???뺤씤?댁＜?몄슂.');
              }

              const headers = data[headerRow];
              console.log('?ㅻ뜑:', headers);

              // 而щ읆 李얘린 (KB移대뱶 ?뚯씪 援ъ“??留욊쾶)
              // KB移대뱶 ?뚯씪? 蹂댄넻 "嫄곕옒??, "媛留뱀젏紐?, "?댁슜湲덉븸" ?쒖꽌濡??섏뼱 ?덉쓬
              let dateCol = -1, merchantCol = -1, amountCol = -1, installmentCol = -1;

              // ?뺥솗??而щ읆紐?留ㅼ묶 ?쒕룄
              for (let i = 0; i < headers.length; i++) { const h=headers[i]; if (!h) continue; const
                hStr=String(h).trim().toLowerCase(); // 嫄곕옒??而щ읆 if (dateCol===-1 && (hStr==='嫄곕옒?? || hStr==='嫄곕옒?쇱옄' ||
                hStr==='?뱀씤?쇱떆' || hStr==='?댁슜?? || hStr==='?뱀씤?쇱옄' || hStr.includes('?쇱옄'))) { dateCol=i; } // 媛留뱀젏紐?而щ읆 else
                if (merchantCol===-1 && (hStr==='媛留뱀젏紐? || hStr==='媛留뱀젏' || hStr==='?ъ슜泥? || hStr==='?ъ슜泥섎챸' || hStr==='?곹샇'
                || hStr==='?곹샇紐? || hStr.includes('媛留뱀젏') || hStr.includes('?ъ슜泥?))) { merchantCol=i; } // ?댁슜湲덉븸 而щ읆 else if
                (amountCol===-1 && (hStr==='?댁슜湲덉븸' || hStr==='?뱀씤湲덉븸' || hStr==='嫄곕옒湲덉븸' || hStr==='湲덉븸' ||
                hStr.includes('湲덉븸'))) { amountCol=i; } // ?좊? 而щ읆 else if (installmentCol===-1 && (hStr==='?좊?' ||
                hStr==='?좊?媛쒖썡' || hStr.includes('?좊?') || hStr.includes('媛쒖썡'))) { installmentCol=i; } } // 而щ읆??紐?李얠? 寃쎌슦,
                findIndex濡??ъ떆??if (dateCol===-1) { dateCol=headers.findIndex(h=> {
                if (!h) return false;
                const hStr = String(h).toLowerCase();
                return hStr.includes('嫄곕옒??) || hStr.includes('?뱀씤?쇱떆') || hStr.includes('?댁슜??) ||
                hStr.includes('嫄곕옒?쇱옄') || hStr.includes('?뱀씤?쇱옄') || hStr.includes('?쇱옄');
                });
                }

                if (merchantCol === -1) {
                merchantCol = headers.findIndex(h => {
                if (!h) return false;
                const hStr = String(h).toLowerCase();
                return hStr.includes('媛留뱀젏') || hStr.includes('?ъ슜泥?) || hStr.includes('?곹샇') ||
                hStr.includes('媛留뱀젏紐?) || hStr.includes('?ъ슜泥섎챸') || hStr.includes('?곹샇紐?);
                });
                }

                if (amountCol === -1) {
                amountCol = headers.findIndex(h => {
                if (!h) return false;
                const hStr = String(h).toLowerCase();
                return hStr.includes('?댁슜湲덉븸') || hStr.includes('?뱀씤湲덉븸') || hStr.includes('嫄곕옒湲덉븸') ||
                hStr.includes('湲덉븸') || hStr.includes('?뱀씤');
                });
                }

                if (installmentCol === -1) {
                installmentCol = headers.findIndex(h => {
                if (!h) return false;
                const hStr = String(h).toLowerCase();
                return hStr.includes('?좊?') || hStr.includes('媛쒖썡') || hStr.includes('?좊?媛쒖썡');
                });
                }

                console.log('而щ읆 留ㅽ븨:', { dateCol, merchantCol, amountCol, installmentCol });
                console.log('?ㅻ뜑 ?꾩껜:', headers);

                // 嫄곕옒 ?댁뿭 異붿텧
                const transactions = [];
                let dataEndRow = data.length;

                // ?곗씠??????李얘린 (?붿빟 ?뺣낫媛 ?쒖옉?섎뒗 ??李얘린)
                for (let i = headerRow + 1; i < data.length; i++) { const row=data[i]; if (!row || row.length===0)
                  continue; const rowText=row.map(cell=> String(cell || '')).join(' ').toLowerCase();
                  // ?붿빟 ?뺣낫媛 ?쒖옉?섎뒗 ?ㅼ썙??諛쒓껄 ???곗씠???앹쑝濡?媛꾩＜
                  if (rowText.includes('?⑷퀎') || rowText.includes('珥?) || rowText.includes('泥?뎄湲덉븸') ||
                  rowText.includes('寃곗젣 ?덉젙湲덉븸') || rowText.includes('?뱀썡 ?댁슜湲덉븸') ||
                  rowText.includes('泥?뎄湲곌컙') || rowText.includes('?댁슜湲곌컙')) {
                  // ?댁쟾 ?됯퉴吏媛 ?곗씠??
                  dataEndRow = i;
                  break;
                  }
                  }

                  for (let i = headerRow + 1; i < dataEndRow; i++) { const row=data[i]; if (!row || row.length===0)
                    continue; // 鍮????ㅽ궢 (紐⑤뱺 ???鍮꾩뼱?덇굅??怨듬갚??寃쎌슦) const isEmpty=row.every(cell=> !cell || String(cell).trim()
                    === '');
                    if (isEmpty) continue;

                    // ?좎쭨媛 ?놁쑝硫??ㅽ궢
                    if (dateCol >= 0 && (!row[dateCol] || String(row[dateCol]).trim() === '')) continue;

                    const date = dateCol >= 0 ? parseDate(row[dateCol]) : null;
                    const merchant = merchantCol >= 0 ? (row[merchantCol] || '').toString().trim() : '';
                    const amount = amountCol >= 0 ? parseAmountFromCell(row[amountCol]) : 0;

                    // ?좏슚??嫄곕옒留?異붽? (?좎쭨? 湲덉븸??紐⑤몢 ?덉뼱????
                    if (date && amount > 0 && merchant) {
                    transactions.push({
                    date: date,
                    merchant: merchant,
                    amount: amount,
                    installment: installmentCol >= 0 ? (row[installmentCol] || '').toString().trim() : ''
                    });
                    }
                    }

                    console.log('異붿텧??嫄곕옒 ?댁뿭:', transactions.length, '嫄?);

                    // ?붿빟 ?뺣낫 異붿텧 (?뚯씪 ?섎떒?먯꽌 李얘린)
                    let summary = {
                    totalAmount: 0,
                    discount: 0,
                    finalAmount: 0,
                    billingPeriod: { start: null, end: null },
                    paymentDate: null
                    };

                    // ?붿빟 ?뺣낫 李얘린 (?꾩껜 ?곗씠?곗뿉??寃??
                    for (let i = 0; i < data.length; i++) { const row=data[i]; if (!row || row.length===0) continue;
                      const rowText=row.map(cell=> String(cell || '')).join(' ').toLowerCase();

                      // 珥??댁슜湲덉븸 李얘린
                      if ((rowText.includes('珥??댁슜湲덉븸') || rowText.includes('?뱀썡 ?댁슜湲덉븸') ||
                      rowText.includes('?⑷퀎') || rowText.includes('珥앷퀎')) && !summary.totalAmount) {
                      // 留덉?留?而щ읆 ?먮뒗 ?レ옄媛 ?덈뒗 而щ읆?먯꽌 湲덉븸 李얘린
                      for (let j = row.length - 1; j >= 0; j--) {
                      const amount = parseAmountFromCell(row[j]);
                      if (amount > 0) {
                      summary.totalAmount = amount;
                      break;
                      }
                      }
                      }

                      // ?좎씤/?곷┰ 李얘린
                      if ((rowText.includes('?좎씤') || rowText.includes('?곷┰') || rowText.includes('由ъ썙??)) &&
                      !summary.discount) {
                      for (let j = row.length - 1; j >= 0; j--) {
                      const amount = parseAmountFromCell(row[j]);
                      if (amount > 0) {
                      summary.discount = amount;
                      break;
                      }
                      }
                      }

                      // 泥?뎄湲덉븸 李얘린
                      if ((rowText.includes('泥?뎄湲덉븸') || rowText.includes('寃곗젣 ?덉젙湲덉븸') ||
                      rowText.includes('理쒖쥌 泥?뎄湲덉븸') || rowText.includes('?ㅼ젣 寃곗젣湲덉븸')) && !summary.finalAmount) {
                      for (let j = row.length - 1; j >= 0; j--) {
                      const amount = parseAmountFromCell(row[j]);
                      if (amount > 0) {
                      summary.finalAmount = amount;
                      break;
                      }
                      }
                      }

                      // 泥?뎄湲곌컙 李얘린
                      if (rowText.includes('泥?뎄湲곌컙') || rowText.includes('?댁슜湲곌컙') || rowText.includes('嫄곕옒湲곌컙')) {
                      // 湲곌컙 異붿텧 ?쒕룄 (YYYY-MM-DD ?뺤떇)
                      const periodMatch = rowText.match(/(\d{4}[-./]\d{1,2}[-./]\d{1,2})/g);
                      if (periodMatch && periodMatch.length >= 2) {
                      summary.billingPeriod.start = parseDate(periodMatch[0]);
                      summary.billingPeriod.end = parseDate(periodMatch[1]);
                      } else {
                      // ?됱쓽 ??먯꽌 ?좎쭨 李얘린
                      for (let cell of row) {
                      if (cell && /\d{4}[-./]\d{1,2}[-./]\d{1,2}/.test(String(cell))) {
                      if (!summary.billingPeriod.start) {
                      summary.billingPeriod.start = parseDate(cell);
                      } else if (!summary.billingPeriod.end) {
                      summary.billingPeriod.end = parseDate(cell);
                      break;
                      }
                      }
                      }
                      }
                      }

                      // 寃곗젣??李얘린
                      if (rowText.includes('寃곗젣??) || rowText.includes('?⑸???) || rowText.includes('異쒓툑??)) {
                      const dateMatch = rowText.match(/(\d{4}[-./]\d{1,2}[-./]\d{1,2})/);
                      if (dateMatch) {
                      summary.paymentDate = parseDate(dateMatch[0]);
                      } else {
                      // ?됱쓽 ??먯꽌 ?좎쭨 李얘린
                      for (let cell of row) {
                      if (cell && /\d{4}[-./]\d{1,2}[-./]\d{1,2}/.test(String(cell))) {
                      summary.paymentDate = parseDate(cell);
                      break;
                      }
                      }
                      }
                      }
                      }

                      // 嫄곕옒 ?댁뿭?먯꽌 湲곌컙 異붿텧 (?붿빟?먯꽌 紐?李얠? 寃쎌슦)
                      if (!summary.billingPeriod.start && transactions.length > 0) {
                      const dates = transactions.map(t => new Date(t.date)).filter(d => !isNaN(d.getTime()));
                      if (dates.length > 0) {
                      dates.sort((a, b) => a - b);
                      summary.billingPeriod.start = dates[0].toISOString().split('T')[0];
                      summary.billingPeriod.end = dates[dates.length - 1].toISOString().split('T')[0];
                      }
                      }

                      // 珥??댁슜湲덉븸???놁쑝硫?嫄곕옒 ?⑷퀎濡?怨꾩궛
                      if (!summary.totalAmount && transactions.length > 0) {
                      summary.totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
                      }

                      // 理쒖쥌 湲덉븸???놁쑝硫?怨꾩궛
                      if (!summary.finalAmount) {
                      if (summary.totalAmount) {
                      summary.finalAmount = summary.totalAmount - (summary.discount || 0);
                      } else if (transactions.length > 0) {
                      summary.finalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
                      }
                      }

                      console.log('?붿빟 ?뺣낫:', summary);

                      return {
                      cardCompany: 'KB移대뱶',
                      transactions: transactions,
                      summary: summary,
                      totalCount: transactions.length,
                      columnMapping: {
                      date: dateCol >= 0 ? headers[dateCol] : '',
                      merchant: merchantCol >= 0 ? headers[merchantCol] : '',
                      amount: amountCol >= 0 ? headers[amountCol] : '',
                      installment: installmentCol >= 0 ? headers[installmentCol] : ''
                      },
                      headerRow: headerRow,
                      dataStartRow: headerRow + 1
                      };
                      }

                      // ?쇱꽦移대뱶 ?뚯떛 ?⑥닔
                      function legacy_parseSamsungCard(data) {
                      // KB移대뱶? ?좎궗??援ъ“濡??뚯떛 ?쒕룄
                      return parseKBCard(data);
                      }

                      // 踰붿슜 ?뚯떛 ?⑥닔 (?먮룞 媛먯?)
                      function legacy_parseGenericCard(data) {
                      // ?좎쭨 ?⑦꽩???덈뒗 ??李얘린
                      let dataStartRow = -1;
                      for (let i = 0; i < Math.min(20, data.length); i++) { const row=data[i]; if (!row) continue; for
                        (let col of row) { if (col && (/\d{4}[-./]\d{2}[-./]\d{2}/.test(String(col)) || (typeof
                        col==='number' && col> 25569))) {
                        dataStartRow = i;
                        break;
                        }
                        }
                        if (dataStartRow !== -1) break;
                        }

                        if (dataStartRow === -1) {
                        throw new Error('嫄곕옒 ?곗씠?곕? 李얠쓣 ???놁뒿?덈떎');
                        }

                        // 而щ읆 ?먮룞 媛먯?
                        const sampleRow = data[dataStartRow];
                        let dateCol = -1, merchantCol = -1, amountCol = -1;

                        for (let i = 0; i < sampleRow.length; i++) { const cell=sampleRow[i]; if (!cell) continue; const
                          cellStr=String(cell); // ?좎쭨 而щ읆 if ((/\d{4}[-./]\d{2}[-./]\d{2}/.test(cellStr) || (typeof
                          cell==='number' && cell> 25569)) && dateCol === -1) {
                          dateCol = i;
                          }
                          // 湲덉븸 而щ읆 (?レ옄媛 ??而щ읆)
                          else if (!isNaN(parseAmountFromCell(cell)) && parseAmountFromCell(cell) > 100) {
                          amountCol = i;
                          }
                          // ?ъ슜泥?而щ읆 (?쒓???留롮? 而щ읆)
                          else if (/[媛-??/.test(cellStr) && merchantCol === -1 && cellStr.length > 2) {
                          merchantCol = i;
                          }
                          }

                          // 嫄곕옒 ?댁뿭 異붿텧
                          const transactions = [];
                          for (let i = dataStartRow; i < data.length; i++) { const row=data[i]; if (!row || (dateCol>= 0
                            && !row[dateCol])) continue;

                            const date = dateCol >= 0 ? parseDate(row[dateCol]) : null;
                            const merchant = merchantCol >= 0 ? (row[merchantCol] || '').toString().trim() : '';
                            const amount = amountCol >= 0 ? parseAmountFromCell(row[amountCol]) : 0;

                            if (date && amount > 0) {
                            transactions.push({
                            date: date,
                            merchant: merchant,
                            amount: amount
                            });
                            }
                            }

                            // 嫄곕옒 ?댁뿭?먯꽌 湲곌컙 異붿텧
                            let billingPeriod = { start: null, end: null };
                            if (transactions.length > 0) {
                            const dates = transactions.map(t => new Date(t.date)).filter(d => !isNaN(d.getTime()));
                            if (dates.length > 0) {
                            dates.sort((a, b) => a - b);
                            billingPeriod.start = dates[0].toISOString().split('T')[0];
                            billingPeriod.end = dates[dates.length - 1].toISOString().split('T')[0];
                            }
                            }

                            return {
                            cardCompany: '?????놁쓬',
                            transactions: transactions,
                            summary: {
                            totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
                            discount: 0,
                            finalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
                            billingPeriod: billingPeriod,
                            paymentDate: null
                            },
                            totalCount: transactions.length
                            };
                            }

                            // ?묒? ?뚯씪 ?쎄린 諛??뚯떛 硫붿씤 ?⑥닔
                            function legacy_parseCardStatement(file, forceCardCompany = null) {
                            return new Promise((resolve, reject) => {
                            const reader = new FileReader();

                            reader.onload = function(e) {
                            try {
                            const data = new Uint8Array(e.target.result);
                            const workbook = XLSX.read(data, { type: 'array' });

                            // 泥?踰덉㎏ ?쒗듃 ?좏깮
                            const sheetName = workbook.SheetNames[0];
                            const worksheet = workbook.Sheets[sheetName];

                            // JSON?쇰줈 蹂??
                            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

                            // 移대뱶??媛먯? ?먮뒗 媛뺤젣 吏??
                            let selectedCardCompany = forceCardCompany;

                            if (!selectedCardCompany) {
                            // ?ъ슜?먭? ?좏깮??移대뱶??媛?몄삤湲?(移대뱶 ?湲??깅줉 紐⑤떖?먯꽌)
                            const cardCompanySelect = document.getElementById('card-payment-card-company-select');
                            selectedCardCompany = cardCompanySelect ? cardCompanySelect.value : '';
                            }

                            // 移대뱶?ш? ?놁쑝硫??먮룞 媛먯?
                            if (!selectedCardCompany) {
                            selectedCardCompany = detectCardCompany(file.name, jsonData);
                            console.log('?먮룞 媛먯???移대뱶??', selectedCardCompany);
                            }

                            // 移대뱶?щ퀎 ?뚯떛 濡쒖쭅 ?좏깮
                            let parsedData;
                            if (selectedCardCompany === 'KB移대뱶') {
                            parsedData = parseKBCard(jsonData);
                            } else if (selectedCardCompany === '?쇱꽦移대뱶') {
                            parsedData = parseSamsungCard(jsonData);
                            } else {
                            // 湲곕낯 ?뚯떛 (?먮룞 媛먯?)
                            parsedData = parseGenericCard(jsonData);
                            }

                            // 媛먯???移대뱶?щ줈 ?ㅼ젙
                            parsedData.cardCompany = selectedCardCompany;

                            resolve(parsedData);
                            } catch (error) {
                            reject(error);
                            }
                            };

                            reader.onerror = function(error) {
                            reject(error);
                            };

                            reader.readAsArrayBuffer(file);
                            });
                            }

                            // ========================================
                            // 8. ??쒕낫??移대뱶 ?ㅼ떆媛?怨꾩궛
                            // ========================================
                            function updateDashboard() {
                            console.log('??쒕낫???낅뜲?댄듃 ?쒖옉');

                            // ?꾩옱 ?좏깮???붿쓽 ?곗씠?곕쭔 ?꾪꽣留?
                            const monthData = getCurrentMonthData();

                            // 珥??섏엯 怨꾩궛 (type === 'income')
                            const totalIncome = monthData
                            .filter(entry => entry.type === 'income')
                            .reduce((sum, entry) => sum + entry.amount, 0);

                            // 珥?吏異?怨꾩궛 (type === 'expense')
                            const totalExpense = monthData
                            .filter(entry => entry.type === 'expense')
                            .reduce((sum, entry) => sum + entry.amount, 0);

                            // ???먯궛 怨꾩궛 (珥??섏엯 - 珥?吏異?
                            const netAsset = totalIncome - totalExpense;

                            // 珥??먯궛 怨꾩궛 (紐⑤뱺 怨꾩쥖 ?붿븸 ?⑷퀎)
                            calculateAccountBalances();
                            const totalAssets = accountData.reduce((sum, account) => {
                            if (account.type === 'bank') {
                            // ?듭옣: ?꾩옱 ?붿븸
                            return sum + (account.currentBalance || 0);
                            } else if (account.type === 'card') {
                            // 移대뱶???먯궛???ы븿?섏? ?딆쓬 (遺梨꾩씠誘濡?
                            return sum;
                            }
                            return sum;
                            }, 0);

                            // ?덉궛 ?ъ꽦瑜?怨꾩궛 (?덉궛: 3,000,000??
                            const budget = 3000000;
                            const budgetRate = budget > 0 ? Math.min((totalExpense / budget) * 100, 100) : 0;

                            // ??쒕낫??移대뱶 ?낅뜲?댄듃
                            const dashCards = document.querySelectorAll('.dash-card');
                            if (dashCards.length >= 4) {
                            // 珥??섏엯
                            const incomeValue = dashCards[0].querySelector('.dash-value');
                            if (incomeValue) {
                            incomeValue.textContent = `${totalIncome.toLocaleString()}??;
                            }

                            // 珥?吏異?
                            const expenseValue = dashCards[1].querySelector('.dash-value');
                            if (expenseValue) {
                            expenseValue.textContent = `${totalExpense.toLocaleString()}??;
                            }

                            // ???먯궛 (珥??먯궛 ?쒖떆)
                            const assetValue = dashCards[2].querySelector('.dash-value');
                            if (assetValue) {
                            assetValue.textContent = `${totalAssets.toLocaleString()}??;
                            }

                            // ?덉궛 ?ъ꽦瑜?
                            const budgetValue = dashCards[3].querySelector('.dash-value');
                            const progressBar = dashCards[3].querySelector('.progress-bar-fill');
                            if (budgetValue) {
                            budgetValue.textContent = `${Math.round(budgetRate)}%`;
                            }
                            if (progressBar) {
                            progressBar.style.width = `${Math.min(budgetRate, 100)}%`;
                            }
                            }

                            console.log('??쒕낫???낅뜲?댄듃 ?꾨즺:', {
                            totalIncome,
                            totalExpense,
                            netAsset,
                            budgetRate: Math.round(budgetRate)
                            });
                            }

                            // ========================================
                            // 9. ?뚯씠釉??뚮뜑留?(?꾩껜 ?뚮퉬)
                            // ========================================
                            function renderTable() {
                            const tbody = document.querySelector('#total-content tbody');
                            if (!tbody) return;

                            tbody.innerHTML = '';

                            // ?꾩옱 ?좏깮???붿쓽 ?곗씠?곕쭔 ?꾪꽣留?
                            let monthData = getCurrentMonthData();

                            // 寃???꾪꽣留??곸슜
                            if (typeof currentSearchKeyword !== 'undefined' && currentSearchKeyword) {
                            monthData = monthData.filter(entry =>
                            entry.item.toLowerCase().includes(currentSearchKeyword.toLowerCase()) ||
                            entry.category.toLowerCase().includes(currentSearchKeyword.toLowerCase()) ||
                            entry.user.toLowerCase().includes(currentSearchKeyword.toLowerCase()) ||
                            (entry.memo && entry.memo.toLowerCase().includes(currentSearchKeyword.toLowerCase()))
                            );
                            }

                            if (monthData.length === 0) {
                            const tr = document.createElement('tr');
                            tr.innerHTML = '<td colspan="8" style="text-align:center; padding:40px;">?깅줉???댁뿭???놁뒿?덈떎</td>';
                            tbody.appendChild(tr);
                            return;
                            }

                            // ?뺣젹 ?곸슜
                            let sorted = monthData;
                            if (typeof currentSortType !== 'undefined' && currentSortType) {
                            sorted = sortTransactions(monthData, currentSortType);
                            } else {
                            // 湲곕낯 ?뺣젹: 理쒖떊 ?곗씠??癒쇱? (timestamp ?대┝李⑥닚)
                            sorted = [...monthData].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                            }

                            sorted.forEach(entry => {
                            const tr = document.createElement('tr');
                            const dateObj = new Date(entry.date);
                            const dateStr = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;

                            // 湲덉븸: ?섏엯? +, 吏異쒖? -
                            let amountStr = '';
                            let amountClass = '';
                            if (entry.type === 'income') {
                            amountStr = `+${entry.amount.toLocaleString()}??;
                            amountClass = 'expense-income';
                            } else {
                            amountStr = `-${entry.amount.toLocaleString()}??;
                            amountClass = 'expense-out';
                            }

                            // 寃곗젣?섎떒 ?쒓? ?쒖떆
                            const paymentMethodText = getPaymentMethodText(entry);

                            tr.innerHTML = `
                            <td><input type="checkbox" class="row-checkbox" data-id="${entry.id}"
                                style="width: 18px; height: 18px; cursor: pointer;"></td>
                            <td>${dateStr}</td>
                            <td>${entry.user}</td>
                            <td>${entry.item}</td>
                            <td>${entry.category}</td>
                            <td class="${amountClass}">${amountStr}</td>
                            <td>${paymentMethodText}</td>
                            <td>${entry.status || '?노?湲?}</td>
                            <td>
                              <button class="btn-action" onclick="editTransaction(${entry.id})">?섏젙</button>
                              <button class="btn-action" onclick="deleteTransaction(${entry.id})">??젣</button>
                            </td>
                            `;
                            tbody.appendChild(tr);
                            });

                            console.log('?꾩껜 ?뚮퉬 ?뚯씠釉??뚮뜑留??꾨즺:', sorted.length, '媛???ぉ');
                            }

                            // ========================================
                            // 10. 移대뱶蹂??댁뿭 ?뚯씠釉??뚮뜑留?
                            // ========================================
                            function renderCardTable(selectedCard = 'all') {
                            const cardTableContainer = document.getElementById('card-table-container');
                            if (!cardTableContainer) return;

                            // 移대뱶蹂??댁뿭: paymentMethod媛 'credit' ?먮뒗 'debit'????ぉ留?
                            let monthData = getCurrentMonthData();

                            // 寃???꾪꽣留??곸슜
                            if (typeof currentSearchKeyword !== 'undefined' && currentSearchKeyword) {
                            monthData = monthData.filter(entry =>
                            entry.item.toLowerCase().includes(currentSearchKeyword.toLowerCase()) ||
                            entry.category.toLowerCase().includes(currentSearchKeyword.toLowerCase()) ||
                            entry.user.toLowerCase().includes(currentSearchKeyword.toLowerCase()) ||
                            (entry.merchant &&
                            entry.merchant.toLowerCase().includes(currentSearchKeyword.toLowerCase())) ||
                            (entry.detail && entry.detail.toLowerCase().includes(currentSearchKeyword.toLowerCase()))
                            );
                            }

                            let cardData = monthData.filter(entry =>
                            entry.paymentMethod === 'credit' || entry.paymentMethod === 'debit'
                            );

                            // ?좏깮??移대뱶濡??꾪꽣留?
                            if (selectedCard !== 'all') {
                            cardData = cardData.filter(entry => entry.paymentDetail === selectedCard);
                            }

                            // ?뺣젹 ?곸슜
                            if (typeof currentSortType !== 'undefined' && currentSortType) {
                            cardData = sortTransactions(cardData, currentSortType);
                            } else {
                            cardData = [...cardData].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                            }

                            // ?뚯씠釉?HTML ?앹꽦
                            let tableHTML = `
                            <div class="expense-table-container">
                              <table class="expense-table" aria-label="移대뱶蹂??댁뿭">
                                <thead>
                                  <tr>
                                    <th>?좎쭨</th>
                                    <th>?대떦??/th>
                                    <th>??ぉ</th>
                                    <th>移댄뀒怨좊━</th>
                                    <th>湲덉븸</th>
                                    <th>寃곗젣?섎떒</th>
                                    <th>?곹깭</th>
                                    <th>?묒뾽</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  `;

                                  if (cardData.length === 0) {
                                  tableHTML += `
                                  <tr>
                                    <td colspan="8" style="text-align:center; padding:40px;">移대뱶 ?댁뿭???놁뒿?덈떎</td>
                                  </tr>
                                  `;
                                  } else {
                                  // 理쒖떊 ?곗씠??癒쇱? (timestamp ?대┝李⑥닚)
                                  const sorted = [...cardData].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

                                  sorted.forEach(entry => {
                                  const dateObj = new Date(entry.date);
                                  const dateStr = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;

                                  let amountStr = '';
                                  let amountClass = '';
                                  if (entry.type === 'income') {
                                  amountStr = `+${entry.amount.toLocaleString()}??;
                                  amountClass = 'expense-income';
                                  } else {
                                  amountStr = `-${entry.amount.toLocaleString()}??;
                                  amountClass = 'expense-out';
                                  }

                                  const paymentMethodText = getPaymentMethodText(entry);

                                  tableHTML += `
                                  <tr>
                                    <td>${dateStr}</td>
                                    <td>${entry.user}</td>
                                    <td>${entry.item}</td>
                                    <td>${entry.category}</td>
                                    <td class="${amountClass}">${amountStr}</td>
                                    <td>${paymentMethodText}</td>
                                    <td>${entry.status || '?노?湲?}</td>
                                    <td>
                                      <button class="btn-action" onclick="editTransaction(${entry.id})">?섏젙</button>
                                      <button class="btn-action" onclick="deleteTransaction(${entry.id})">??젣</button>
                                    </td>
                                  </tr>
                                  `;
                                  });
                                  }

                                  tableHTML += `
                                </tbody>
                              </table>
                            </div>
                            `;

                            cardTableContainer.innerHTML = tableHTML;
                            console.log('移대뱶蹂??댁뿭 ?뚮뜑留?', cardData.length, '媛???ぉ', selectedCard !== 'all' ? `(?꾪꽣:
                            ${selectedCard})` : '(?꾩껜)');
                            }

                            // ========================================
                            // 11. ?듭옣 ?낆텧湲??뚯씠釉??뚮뜑留?
                            // ========================================
                            function renderBankTable() {
                            const bankContent = document.getElementById('bank-content');
                            if (!bankContent) return;

                            // ?듭옣 ?낆텧湲? paymentMethod媛 'transfer' ?먮뒗 'cash'????ぉ留?
                            let monthData = getCurrentMonthData();

                            // 寃???꾪꽣留??곸슜
                            if (typeof currentSearchKeyword !== 'undefined' && currentSearchKeyword) {
                            monthData = monthData.filter(entry =>
                            entry.item.toLowerCase().includes(currentSearchKeyword.toLowerCase()) ||
                            entry.category.toLowerCase().includes(currentSearchKeyword.toLowerCase()) ||
                            entry.user.toLowerCase().includes(currentSearchKeyword.toLowerCase()) ||
                            (entry.memo && entry.memo.toLowerCase().includes(currentSearchKeyword.toLowerCase()))
                            );
                            }

                            let bankData = monthData.filter(entry =>
                            entry.paymentMethod === 'transfer' || entry.paymentMethod === 'cash'
                            );

                            // ?뺣젹 ?곸슜
                            if (typeof currentSortType !== 'undefined' && currentSortType) {
                            bankData = sortTransactions(bankData, currentSortType);
                            } else {
                            bankData = [...bankData].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                            }

                            // ?뚯씠釉?HTML ?앹꽦
                            let tableHTML = `
                            <div class="expense-table-container">
                              <table class="expense-table" aria-label="?듭옣 ?낆텧湲??댁뿭">
                                <thead>
                                  <tr>
                                    <th>?좎쭨</th>
                                    <th>?대떦??/th>
                                    <th>??ぉ</th>
                                    <th>移댄뀒怨좊━</th>
                                    <th>湲덉븸</th>
                                    <th>寃곗젣?섎떒</th>
                                    <th>?곹깭</th>
                                    <th>?묒뾽</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  `;

                                  if (bankData.length === 0) {
                                  tableHTML += `
                                  <tr>
                                    <td colspan="8" style="text-align:center; padding:40px;">?듭옣 ?낆텧湲??댁뿭???놁뒿?덈떎</td>
                                  </tr>
                                  `;
                                  } else {
                                  // 理쒖떊 ?곗씠??癒쇱? (timestamp ?대┝李⑥닚)
                                  const sorted = [...bankData].sort((a, b) => b.timestamp - a.timestamp);

                                  sorted.forEach(entry => {
                                  const dateObj = new Date(entry.date);
                                  const dateStr = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;

                                  let amountStr = '';
                                  let amountClass = '';
                                  if (entry.type === 'income') {
                                  amountStr = `+${entry.amount.toLocaleString()}??;
                                  amountClass = 'expense-income';
                                  } else {
                                  amountStr = `-${entry.amount.toLocaleString()}??;
                                  amountClass = 'expense-out';
                                  }

                                  const paymentMethodText = getPaymentMethodText(entry);

                                  tableHTML += `
                                  <tr>
                                    <td>${dateStr}</td>
                                    <td>${entry.user}</td>
                                    <td>${entry.item}</td>
                                    <td>${entry.category}</td>
                                    <td class="${amountClass}">${amountStr}</td>
                                    <td>${paymentMethodText}</td>
                                    <td>${entry.status || '?노?湲?}</td>
                                    <td>
                                      <button class="btn-action" onclick="editTransaction(${entry.id})">?섏젙</button>
                                      <button class="btn-action" onclick="deleteTransaction(${entry.id})">??젣</button>
                                    </td>
                                  </tr>
                                  `;
                                  });
                                  }

                                  tableHTML += `
                                </tbody>
                              </table>
                            </div>
                            `;

                            bankContent.innerHTML = tableHTML;
                            console.log('?듭옣 ?낆텧湲??뚯씠釉??뚮뜑留??꾨즺:', bankData.length, '媛???ぉ');
                            }

                            // ========================================
                            // 12. ?섏젙 湲곕뒫
                            // ========================================
                            window.editTransaction = function(id) {
                            console.log('?섏젙 紐⑤뱶 ?쒖옉 - ID:', id);

                            // transactionData?먯꽌 ?대떦 id ?곗씠??李얘린
                            const entry = transactionData.find(item => item.id === id);
                            if (!entry) {
                            alert('?대떦 ?댁뿭??李얠쓣 ???놁뒿?덈떎.');
                            return;
                            }

                            // 紐⑤떖 ?쒕ぉ 蹂寃?
                            if (modalTitle) {
                            modalTitle.textContent = '?뱷 ?댁뿭 ?섏젙';
                            }

                            // editingId ?ㅼ젙
                            editingId = id;

                            // ?쇱뿉 湲곗〈 ?곗씠??梨꾩슦湲?
                            const dateInput = document.getElementById('entry-date');
                            const ownerSelect = document.getElementById('entry-owner');
                            const typeRadios = form.querySelectorAll('input[name="type"]');
                            const itemSelect = document.getElementById('entry-category-item');
                            const categorySelect = document.getElementById('entry-category-kind');
                            const amountInput = document.getElementById('entry-amount');
                            const methodSelect = document.getElementById('entry-method');
                            const merchantInput = document.getElementById('entry-merchant');
                            const detailTextarea = document.getElementById('entry-detail');
                            const regularCheckbox = document.getElementById('entry-regular');

                            if (dateInput) dateInput.value = entry.date;
                            if (ownerSelect) ownerSelect.value = entry.user;
                            if (typeRadios) {
                            typeRadios.forEach(radio => {
                            radio.checked = (radio.value === entry.type);
                            });
                            // 援щ텇 ?좏깮 ??移댄뀒怨좊━ ?듭뀡 ?낅뜲?댄듃
                            updateCategoryOptions();
                            }
                            // 移댄뀒怨좊━瑜?癒쇱? ?ㅼ젙?섍퀬 ??ぉ ?쒕∼?ㅼ슫 ?낅뜲?댄듃
                            if (categorySelect) {
                            categorySelect.value = entry.category;
                            // 移댄뀒怨좊━ ?ㅼ젙 ????ぉ ?듭뀡 ?낅뜲?댄듃
                            updateItemOptions();
                            // ??ぉ ?ㅼ젙 (?쎄컙??吏?곗쓣 ?먯뼱 DOM ?낅뜲?댄듃 ?湲?
                            setTimeout(() => {
                            if (itemSelect) itemSelect.value = entry.item;
                            }, 10);
                            }
                            if (amountInput) {
                            // ?섏젙 紐⑤뱶?먯꽌 湲덉븸 ?쒖떆 ??泥??⑥쐞 肄ㅻ쭏 異붽?
                            amountInput.value = formatNumberWithCommas(String(entry.amount));
                            }
                            if (methodSelect) {
                            methodSelect.value = entry.paymentMethod;
                            updatePaymentFields();

                            // 寃곗젣?섎떒蹂??곸꽭 ?뺣낫 ?ㅼ젙
                            if (entry.paymentMethod === 'credit' && entry.paymentDetail) {
                            const creditSelect = form.querySelector('select[name="credit-card"]');
                            if (creditSelect) creditSelect.value = entry.paymentDetail;
                            } else if (entry.paymentMethod === 'debit' && entry.paymentDetail) {
                            const debitSelect = form.querySelector('select[name="debit-card"]');
                            if (debitSelect) debitSelect.value = entry.paymentDetail;
                            } else if (entry.paymentMethod === 'transfer' && entry.paymentDetail) {
                            const transferSelect = form.querySelector('select[name="transfer-account"]');
                            if (transferSelect) transferSelect.value = entry.paymentDetail;
                            } else if (entry.paymentMethod === 'cash' && entry.paymentDetail) {
                            const cashSelect = form.querySelector('select[name="cash-account"]');
                            if (cashSelect) cashSelect.value = entry.paymentDetail;
                            }
                            }
                            if (merchantInput) merchantInput.value = entry.merchant || '';
                            if (detailTextarea) detailTextarea.value = entry.detail || '';
                            if (regularCheckbox) regularCheckbox.checked = entry.recurring || false;

                            // 紐⑤떖 ?닿린
                            openModal(true);
                            console.log('?섏젙 紐⑤뱶 - ???곗씠??梨꾩? ?꾨즺');
                            };

                            // ========================================
                            // 9. ??젣 湲곕뒫
                            // ========================================
                            window.deleteTransaction = function(id) {
                            console.log('??젣 ?붿껌 - ID:', id);

                            if (confirm('?뺣쭚 ??젣?섏떆寃좎뒿?덇퉴?')) {
                            const index = transactionData.findIndex(item => item.id === id);
                            if (index > -1) {
                            transactionData.splice(index, 1);
                            saveData();
                            // 怨꾩쥖 ?붿븸 ?먮룞 ?낅뜲?댄듃
                            calculateAccountBalances();
                            renderTable();
                            renderCardTable('all');
                            renderBankTable();
                            updateDashboard();
                            alert('??젣?섏뿀?듬땲??');
                            console.log('??젣 ?꾨즺 - ID:', id);
                            } else {
                            alert('?대떦 ?댁뿭??李얠쓣 ???놁뒿?덈떎.');
                            }
                            }
                            };



                            // ========================================
                            // 寃??湲곕뒫
                            // ========================================
                            let currentSearchKeyword = '';
                            let currentSortType = 'date-desc';

                            function searchTransactions(keyword) {
                            currentSearchKeyword = keyword.trim();
                            applyFiltersAndRender();
                            }

                            // 寃??諛??뺣젹 ?곸슜 ???뚮뜑留?
                            function applyFiltersAndRender() {
                            // 湲곗〈 renderTable, renderCardTable, renderBankTable ?⑥닔媛
                            // currentSearchKeyword? currentSortType??李몄“?섎룄濡??섏젙??
                            renderTable();
                            // ?꾩옱 ?좏깮??移대뱶 ?꾪꽣 ?좎?
                            const cardFilterSelect = document.getElementById('card-filter-select');
                            const selectedCard = cardFilterSelect ? cardFilterSelect.value : 'all';
                            renderCardTable(selectedCard);
                            renderBankTable();
                            }

                            // 寃???대깽??由ъ뒪??
                            document.addEventListener('click', function(e) {
                            if (e.target.id === 'search-btn') {
                            const keyword = document.getElementById('search-input')?.value || '';
                            searchTransactions(keyword);
                            } else if (e.target.id === 'search-clear') {
                            document.getElementById('search-input').value = '';
                            currentSearchKeyword = '';
                            applyFiltersAndRender();
                            }
                            });

                            // ?뷀꽣?ㅻ줈 寃??
                            document.addEventListener('keypress', function(e) {
                            if (e.target.id === 'search-input' && e.key === 'Enter') {
                            const keyword = e.target.value || '';
                            searchTransactions(keyword);
                            }
                            });

                            // ========================================
                            // ?곗씠???뺣젹 湲곕뒫
                            // ========================================
                            function sortTransactions(data, sortType) {
                            const sorted = [...data];

                            switch(sortType) {
                            case 'date-desc':
                            return sorted.sort((a, b) => {
                            const dateA = new Date(a.date);
                            const dateB = new Date(b.date);
                            if (dateB.getTime() === dateA.getTime()) {
                            return (b.timestamp || 0) - (a.timestamp || 0);
                            }
                            return dateB.getTime() - dateA.getTime();
                            });
                            case 'date-asc':
                            return sorted.sort((a, b) => {
                            const dateA = new Date(a.date);
                            const dateB = new Date(b.date);
                            if (dateA.getTime() === dateB.getTime()) {
                            return (a.timestamp || 0) - (b.timestamp || 0);
                            }
                            return dateA.getTime() - dateB.getTime();
                            });
                            case 'amount-desc':
                            return sorted.sort((a, b) => {
                            if (b.amount === a.amount) {
                            return (b.timestamp || 0) - (a.timestamp || 0);
                            }
                            return b.amount - a.amount;
                            });
                            case 'amount-asc':
                            return sorted.sort((a, b) => {
                            if (a.amount === b.amount) {
                            return (a.timestamp || 0) - (b.timestamp || 0);
                            }
                            return a.amount - b.amount;
                            });
                            default:
                            return sorted;
                            }
                            }

                            // ?뺣젹 ?대깽??由ъ뒪??
                            document.addEventListener('change', function(e) {
                            if (e.target.id === 'sort-select') {
                            currentSortType = e.target.value;
                            applyFiltersAndRender();
                            }
                            });



                            // ========================================
                            // ?곗씠??諛깆뾽/蹂듭썝 湲곕뒫
                            // ========================================
                            // ?곗씠??諛깆뾽 (JSON ?ㅼ슫濡쒕뱶)
                            function backupData() {
                            const dataStr = JSON.stringify(transactionData, null, 2);
                            const blob = new Blob([dataStr], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            const today = new Date().toISOString().split('T')[0];
                            link.download = `媛怨꾨?_諛깆뾽_${today}.json`;
                            link.click();
                            URL.revokeObjectURL(url);
                            alert('諛깆뾽 ?꾨즺!');
                            console.log('?곗씠??諛깆뾽 ?꾨즺:', transactionData.length, '媛???ぉ');
                            }

                            // ?곗씠??蹂듭썝
                            function restoreData(file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                            try {
                            const data = JSON.parse(e.target.result);
                            if (Array.isArray(data)) {
                            transactionData = data;
                            saveData();
                            renderTable();
                            renderCardTable('all');
                            renderBankTable();
                            updateDashboard();
                            alert('蹂듭썝 ?꾨즺!');
                            console.log('?곗씠??蹂듭썝 ?꾨즺:', transactionData.length, '媛???ぉ');
                            } else {
                            alert('?좏슚?섏? ?딆? 諛깆뾽 ?뚯씪?낅땲??');
                            }
                            } catch (error) {
                            alert('?뚯씪 ?쎄린 ?ㅻ쪟: ' + error.message);
                            console.error('蹂듭썝 ?ㅻ쪟:', error);
                            }
                            };
                            reader.readAsText(file);
                            }

                            // 諛깆뾽/蹂듭썝 ?대깽??由ъ뒪??
                            document.addEventListener('click', function(e) {
                            if (e.target.id === 'backup-btn') {
                            backupData();
                            } else if (e.target.id === 'restore-btn') {
                            const fileInput = document.getElementById('restore-file');
                            if (fileInput) {
                            fileInput.click();
                            }
                            }
                            });

                            document.addEventListener('change', function(e) {
                            if (e.target.id === 'restore-file' && e.target.files.length > 0) {
                            const file = e.target.files[0];
                            if (confirm('?꾩옱 ?곗씠?곕? 諛깆뾽 ?뚯씪濡???뼱?곗떆寃좎뒿?덇퉴?')) {
                            restoreData(file);
                            }
                            // ?뚯씪 ?낅젰 珥덇린??
                            e.target.value = '';
                            }
                            });


                            // ========================================
                            // 怨꾩쥖 愿由?紐⑤떖 ?⑥닔??
                            // ========================================
                            let editingAccountId = null;
                            const accountModalOverlay = document.getElementById('account-modal-overlay');
                            const accountModalClose = document.getElementById('account-modal-close-btn');
                            const accountModalCancel = document.getElementById('account-modal-cancel-btn');
                            const accountForm = document.getElementById('account-form');
                            const accountModalTitle = document.getElementById('account-modal-title');

                            function closeAccountModal() {
                            if (accountModalOverlay) {
                            accountModalOverlay.style.display = 'none';
                            document.body.style.overflow = '';
                            editingAccountId = null;
                            if (accountModalTitle) {
                            accountModalTitle.textContent = '?뱷 怨꾩쥖 異붽?';
                            }
                            if (accountForm) {
                            accountForm.reset();
                            // 怨꾩쥖 ?좏삎 湲곕낯媛??ㅼ젙
                            const typeRadios = accountForm.querySelectorAll('input[name="account-type"]');
                            if (typeRadios && typeRadios.length > 0) {
                            typeRadios[0].checked = true;
                            updateAccountTypeFields();
                            }
                            }
                            }
                            }

                            function openAccountModal(isEdit = false) {
                            if (accountModalOverlay) {
                            accountModalOverlay.style.display = 'flex';
                            document.body.style.overflow = 'hidden';
                            if (!isEdit && accountForm) {
                            accountForm.reset();
                            const typeRadios = accountForm.querySelectorAll('input[name="account-type"]');
                            if (typeRadios && typeRadios.length > 0) {
                            typeRadios[0].checked = true;
                            updateAccountTypeFields();
                            }
                            updateLinkedAccountOptions();
                            if (accountModalTitle) {
                            accountModalTitle.textContent = '?뱷 怨꾩쥖 異붽?';
                            }
                            }
                            }
                            }

                            function updateAccountTypeFields() {
                            const typeRadios = accountForm ? accountForm.querySelectorAll('input[name="account-type"]')
                            : [];
                            const bankFields = document.getElementById('bank-fields');
                            const cardFields = document.getElementById('card-fields');

                            if (typeRadios.length === 0) return;

                            const selectedType = Array.from(typeRadios).find(radio => radio.checked)?.value;

                            if (selectedType === 'bank') {
                            if (bankFields) bankFields.style.display = 'block';
                            if (cardFields) cardFields.style.display = 'none';
                            } else if (selectedType === 'card') {
                            if (bankFields) bankFields.style.display = 'none';
                            if (cardFields) cardFields.style.display = 'block';
                            }
                            }

                            function updateLinkedAccountOptions() {
                            const linkedAccountSelect = document.getElementById('account-linked-account');
                            if (!linkedAccountSelect) return;

                            // 湲곗〈 ?듭뀡 ?쒓굅 (?좏깮 ?덊븿 ?쒖쇅)
                            while (linkedAccountSelect.children.length > 1) {
                            linkedAccountSelect.removeChild(linkedAccountSelect.lastChild);
                            }

                            // ?듭옣 怨꾩쥖留??곌껐怨꾩쥖濡??좏깮 媛??
                            accountData.filter(acc => acc.type === 'bank').forEach(account => {
                            const option = document.createElement('option');
                            option.value = account.name;
                            option.textContent = account.name;
                            linkedAccountSelect.appendChild(option);
                            });
                            }

                            // 怨꾩쥖 ?좏삎 蹂寃??대깽??
                            if (accountForm) {
                            const typeRadios = accountForm.querySelectorAll('input[name="account-type"]');
                            typeRadios.forEach(radio => {
                            radio.addEventListener('change', updateAccountTypeFields);
                            });
                            }

                            // 怨꾩쥖 紐⑤떖 ?リ린 ?대깽??
                            if (accountModalClose) {
                            accountModalClose.addEventListener('click', closeAccountModal);
                            }
                            if (accountModalCancel) {
                            accountModalCancel.addEventListener('click', closeAccountModal);
                            }
                            if (accountModalOverlay) {
                            accountModalOverlay.addEventListener('click', function(e) {
                            if (e.target === accountModalOverlay) {
                            closeAccountModal();
                            }
                            });
                            }

                            // 怨꾩쥖 ???쒖텧
                            if (accountForm) {
                            accountForm.addEventListener('submit', function(e) {
                            e.preventDefault();

                            const name = document.getElementById('account-name')?.value;
                            const typeRadios = accountForm.querySelectorAll('input[name="account-type"]');
                            const type = Array.from(typeRadios).find(radio => radio.checked)?.value;
                            const initialBalanceRaw = document.getElementById('account-initial-balance')?.value || '0';
                            const initialBalance = Number(removeCommas(initialBalanceRaw)) || 0;

                            if (!name) {
                            alert('怨꾩쥖紐낆쓣 ?낅젰?댁＜?몄슂.');
                            return;
                            }
                            if (!type) {
                            alert('怨꾩쥖 ?좏삎???좏깮?댁＜?몄슂.');
                            return;
                            }

                            if (editingAccountId) {
                            // ?섏젙 紐⑤뱶
                            const index = accountData.findIndex(acc => acc.id === editingAccountId);
                            if (index > -1) {
                            const account = accountData[index];
                            account.name = name;
                            account.type = type;

                            if (type === 'bank') {
                            account.initialBalance = initialBalance;
                            account.currentBalance = initialBalance; // 珥덇린??
                            delete account.creditLimit;
                            delete account.paymentDay;
                            delete account.linkedAccount;
                            } else if (type === 'card') {
                            const creditLimitRaw = document.getElementById('account-credit-limit')?.value || '0';
                            const creditLimit = Number(removeCommas(creditLimitRaw)) || 0;
                            const paymentDay = document.getElementById('account-payment-day')?.value;
                            const linkedAccount = document.getElementById('account-linked-account')?.value || '';

                            account.creditLimit = creditLimit;
                            account.currentBalance = 0; // 移대뱶???ъ슜?≪쓣 0?쇰줈 珥덇린??
                            if (paymentDay) account.paymentDay = Number(paymentDay);
                            if (linkedAccount) account.linkedAccount = linkedAccount;
                            delete account.initialBalance;
                            }

                            saveAccountData();
                            calculateAccountBalances();

                            // 怨꾩쥖 愿由???씠 ?대젮?덉쑝硫??ㅼ떆 ?뚮뜑留?
                            const otherContent = document.getElementById('other-tab-content');
                            if (otherContent && otherContent.style.display !== 'none') {
                            renderAccountsTab(otherContent);
                            }

                            updateDashboard();
                            alert('?섏젙?섏뿀?듬땲??');
                            closeAccountModal();
                            }
                            } else {
                            // ?좉퇋 異붽? 紐⑤뱶
                            const now = Date.now();
                            const account = {
                            id: now,
                            name: name,
                            type: type,
                            initialBalance: type === 'bank' ? initialBalance : undefined,
                            currentBalance: type === 'bank' ? initialBalance : undefined
                            };

                            if (type === 'card') {
                            const creditLimitRaw = document.getElementById('account-credit-limit')?.value || '0';
                            const creditLimit = Number(removeCommas(creditLimitRaw)) || 0;
                            const paymentDay = document.getElementById('account-payment-day')?.value;
                            const linkedAccount = document.getElementById('account-linked-account')?.value || '';

                            account.creditLimit = creditLimit;
                            account.currentBalance = 0; // 移대뱶???ъ슜?≪쓣 0?쇰줈 珥덇린??
                            if (paymentDay) account.paymentDay = Number(paymentDay);
                            if (linkedAccount) account.linkedAccount = linkedAccount;
                            }

                            accountData.push(account);
                            saveAccountData();
                            calculateAccountBalances();

                            // 怨꾩쥖 愿由???씠 ?대젮?덉쑝硫??ㅼ떆 ?뚮뜑留?
                            const otherContent = document.getElementById('other-tab-content');
                            if (otherContent && otherContent.style.display !== 'none') {
                            renderAccountsTab(otherContent);
                            }

                            updateDashboard();
                            alert('??λ릺?덉뒿?덈떎!');
                            closeAccountModal();
                            }
                            });
                            }

                            // 怨꾩쥖 ?섏젙 ?⑥닔
                            window.legacy_editAccount = function(id) {
                            const account = accountData.find(acc => acc.id === id);
                            if (!account) {
                            alert('?대떦 怨꾩쥖瑜?李얠쓣 ???놁뒿?덈떎.');
                            return;
                            }

                            editingAccountId = id;
                            if (accountModalTitle) {
                            accountModalTitle.textContent = '?뱷 怨꾩쥖 ?섏젙';
                            }

                            // ?쇱뿉 湲곗〈 ?곗씠??梨꾩슦湲?
                            const nameInput = document.getElementById('account-name');
                            const typeRadios = accountForm.querySelectorAll('input[name="account-type"]');
                            const initialBalanceInput = document.getElementById('account-initial-balance');
                            const creditLimitInput = document.getElementById('account-credit-limit');
                            const paymentDayInput = document.getElementById('account-payment-day');
                            const linkedAccountSelect = document.getElementById('account-linked-account');

                            if (nameInput) nameInput.value = account.name;
                            if (typeRadios) {
                            typeRadios.forEach(radio => {
                            radio.checked = (radio.value === account.type);
                            });
                            updateAccountTypeFields();
                            }

                            if (account.type === 'bank') {
                            if (initialBalanceInput) {
                            initialBalanceInput.value = formatNumberWithCommas(String(account.initialBalance || 0));
                            }
                            } else if (account.type === 'card') {
                            if (creditLimitInput) {
                            creditLimitInput.value = formatNumberWithCommas(String(account.creditLimit || 0));
                            }
                            if (paymentDayInput) paymentDayInput.value = account.paymentDay || '';
                            if (linkedAccountSelect) {
                            updateLinkedAccountOptions();
                            linkedAccountSelect.value = account.linkedAccount || '';
                            }
                            }

                            openAccountModal(true);
                            };

                            // 怨꾩쥖 ??젣 ?⑥닔
                            window.legacy_deleteAccount = function(id) {
                            if (confirm('?뺣쭚 ??젣?섏떆寃좎뒿?덇퉴?')) {
                            const index = accountData.findIndex(acc => acc.id === id);
                            if (index > -1) {
                            accountData.splice(index, 1);
                            saveAccountData();
                            calculateAccountBalances();

                            // 怨꾩쥖 愿由???씠 ?대젮?덉쑝硫??ㅼ떆 ?뚮뜑留?
                            const otherContent = document.getElementById('other-tab-content');
                            if (otherContent && otherContent.style.display !== 'none') {
                            renderAccountsTab(otherContent);
                            }

                            updateDashboard();
                            alert('??젣?섏뿀?듬땲??');
                            } else {
                            alert('?대떦 怨꾩쥖瑜?李얠쓣 ???놁뒿?덈떎.');
                            }
                            }
                            };

                            // 怨꾩쥖 湲덉븸 ?낅젰 ?꾨뱶 ?щ㎎??
                            const accountInitialBalanceInput = document.getElementById('account-initial-balance');
                            const accountCreditLimitInput = document.getElementById('account-credit-limit');

                            if (accountInitialBalanceInput) {
                            accountInitialBalanceInput.addEventListener('input', function(e) {
                            const cursorPosition = e.target.selectionStart;
                            const value = e.target.value;
                            const numbers = removeCommas(value);
                            const formatted = formatNumberWithCommas(numbers);
                            e.target.value = formatted;
                            const addedCommas = (formatted.match(/,/g) || []).length - (value.match(/,/g) || []).length;
                            const newCursorPosition = cursorPosition + addedCommas;
                            e.target.setSelectionRange(newCursorPosition, newCursorPosition);
                            });
                            }

                            if (accountCreditLimitInput) {
                            accountCreditLimitInput.addEventListener('input', function(e) {
                            const cursorPosition = e.target.selectionStart;
                            const value = e.target.value;
                            const numbers = removeCommas(value);
                            const formatted = formatNumberWithCommas(numbers);
                            e.target.value = formatted;
                            const addedCommas = (formatted.match(/,/g) || []).length - (value.match(/,/g) || []).length;
                            const newCursorPosition = cursorPosition + addedCommas;
                            e.target.setSelectionRange(newCursorPosition, newCursorPosition);
                            });
                            }

                            // ?먯＜ ?곕뒗 ?ъ슜泥??좏깮 ?대깽??(?쒕∼?ㅼ슫?먯꽌 ?좏깮 ???띿뒪???꾨뱶???낅젰)
                            document.addEventListener('change', function(e) {
                            if (e.target.id === 'merchant-history') {
                            const merchantInput = document.getElementById('entry-merchant');
                            if (merchantInput && e.target.value) {
                            merchantInput.value = e.target.value;
                            // ?좏깮 ???쒕∼?ㅼ슫 珥덇린??
                            setTimeout(() => {
                            e.target.value = '';
                            }, 100);
                            }
                            }
                            });

                            // ?좉퇋 ?깅줉 踰꾪듉 ?대깽??
                            document.addEventListener('click', function(e) {
                            if (e.target.id === 'new-entry-btn') {
                            openModal(false);
                            }
                            });

                            // ?먯＜ ?곕뒗 ?ъ슜泥?愿由?紐⑤떖 ?대깽??
                            const merchantManageBtn = document.getElementById('merchant-manage-btn');
                            const merchantModalClose = document.getElementById('merchant-modal-close-btn');
                            const merchantModalCancel = document.getElementById('merchant-modal-cancel-btn');
                            const merchantModalOverlay = document.getElementById('merchant-modal-overlay');
                            const merchantAddBtn = document.getElementById('merchant-add-btn');
                            const merchantAddInput = document.getElementById('merchant-add-input');

                            if (merchantManageBtn) {
                            merchantManageBtn.addEventListener('click', openMerchantManageModal);
                            }

                            if (merchantModalClose) {
                            merchantModalClose.addEventListener('click', closeMerchantManageModal);
                            }

                            if (merchantModalCancel) {
                            merchantModalCancel.addEventListener('click', closeMerchantManageModal);
                            }

                            if (merchantModalOverlay) {
                            merchantModalOverlay.addEventListener('click', function(e) {
                            if (e.target === merchantModalOverlay) {
                            closeMerchantManageModal();
                            }
                            });
                            }

                            // ????ぉ 異붽?
                            if (merchantAddBtn && merchantAddInput) {
                            merchantAddBtn.addEventListener('click', function() {
                            const value = merchantAddInput.value.trim();
                            if (value) {
                            addToMerchantHistory(value);
                            merchantAddInput.value = '';
                            renderMerchantList();
                            }
                            });

                            merchantAddInput.addEventListener('keypress', function(e) {
                            if (e.key === 'Enter') {
                            const value = merchantAddInput.value.trim();
                            if (value) {
                            addToMerchantHistory(value);
                            merchantAddInput.value = '';
                            renderMerchantList();
                            }
                            }
                            });
                            }

                            // 移대뱶 ?꾪꽣 ?쒕∼?ㅼ슫 ?대깽??由ъ뒪??
                            document.addEventListener('change', function(e) {
                            if (e.target.id === 'card-filter-select') {
                            const selectedCard = e.target.value;
                            renderCardTable(selectedCard);
                            }
                            });

                            // 移대뱶 ?湲??깅줉 紐⑤떖 ?대깽??由ъ뒪??
                            const registerCardPaymentBtn = document.getElementById('register-card-payment-btn');
                            const cardPaymentModalClose = document.getElementById('card-payment-modal-close');
                            const cardPaymentModalCancel = document.getElementById('card-payment-modal-cancel');
                            const cardPaymentModalOverlay = document.getElementById('card-payment-modal-overlay');
                            const cardPaymentForm = document.getElementById('card-payment-form');

                            // 移대뱶 ?湲??깅줉 踰꾪듉 ?대┃ (?숈쟻 ?대깽???꾩엫 ?ъ슜)
                            document.addEventListener('click', function(e) {
                            if (e.target.id === 'register-card-payment-btn') {
                            openCardPaymentModal();
                            }
                            });

                            // 紐⑤떖 ?リ린 踰꾪듉
                            if (cardPaymentModalClose) {
                            cardPaymentModalClose.addEventListener('click', closeCardPaymentModal);
                            }

                            if (cardPaymentModalCancel) {
                            cardPaymentModalCancel.addEventListener('click', closeCardPaymentModal);
                            }

                            if (cardPaymentModalOverlay) {
                            cardPaymentModalOverlay.addEventListener('click', function(e) {
                            if (e.target === cardPaymentModalOverlay) {
                            closeCardPaymentModal();
                            }
                            });
                            }

                            // ?곕룄/???좏깮 ?쒕∼?ㅼ슫 ?대깽??由ъ뒪??
                            document.addEventListener('change', function(e) {
                            if (e.target.id === 'card-payment-year-select' || e.target.id ===
                            'card-payment-month-select') {
                            const yearSelect = document.getElementById('card-payment-year-select');
                            const monthSelect = document.getElementById('card-payment-month-select');
                            const periodStartInput = document.getElementById('card-payment-period-start');
                            const periodEndInput = document.getElementById('card-payment-period-end');

                            if (yearSelect && monthSelect && periodStartInput && periodEndInput) {
                            const selectedYear = yearSelect.value;
                            const selectedMonth = monthSelect.value;

                            // ?곕룄? ?붿씠 紐⑤몢 ?좏깮??寃쎌슦?먮쭔 ?좎쭨 ?ㅼ젙
                            if (selectedYear && selectedMonth) {
                            const yearNum = parseInt(selectedYear);
                            const monthNum = parseInt(selectedMonth);

                            // ?대떦 ?붿쓽 泥???(1??
                            const startDate = new Date(yearNum, monthNum - 1, 1);
                            // ?대떦 ?붿쓽 留덉?留???
                            const endDate = new Date(yearNum, monthNum, 0);

                            // YYYY-MM-DD ?뺤떇?쇰줈 蹂??
                            const startYear = startDate.getFullYear();
                            const startMonth = String(startDate.getMonth() + 1).padStart(2, '0');
                            const startDay = String(startDate.getDate()).padStart(2, '0');
                            periodStartInput.value = `${startYear}-${startMonth}-${startDay}`;

                            const endYear = endDate.getFullYear();
                            const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
                            const endDay = String(endDate.getDate()).padStart(2, '0');
                            periodEndInput.value = `${endYear}-${endMonth}-${endDay}`;

                            validateCardPayment();
                            }
                            }
                            }
                            });

                            // ?좏슚??泥댄겕 ?대깽??由ъ뒪??
                            document.addEventListener('change', function(e) {
                            if (e.target.id === 'card-payment-card-select' ||
                            e.target.id === 'card-payment-period-start' ||
                            e.target.id === 'card-payment-period-end') {
                            validateCardPayment();
                            }
                            });

                            document.addEventListener('input', function(e) {
                            if (e.target.id === 'card-payment-amount') {
                            // 泥??⑥쐞 肄ㅻ쭏 ?먮룞 異붽?
                            const cursorPosition = e.target.selectionStart;
                            const value = e.target.value;
                            const numbers = removeCommas(value);
                            const formatted = formatNumberWithCommas(numbers);
                            e.target.value = formatted;
                            const addedCommas = (formatted.match(/,/g) || []).length - (value.match(/,/g) || []).length;
                            const newCursorPosition = cursorPosition + addedCommas;
                            e.target.setSelectionRange(newCursorPosition, newCursorPosition);
                            validateCardPayment();
                            }
                            });

                            // ?섎룞 議곗젙 泥댄겕諛뺤뒪
                            document.addEventListener('change', function(e) {
                            if (e.target.id === 'card-payment-manual-adjust') {
                            const cardPaymentAdjustment = document.getElementById('card-payment-adjustment');
                            if (cardPaymentAdjustment) {
                            cardPaymentAdjustment.style.display = e.target.checked ? 'block' : 'none';
                            }
                            }
                            });

                            // 移대뱶 ?湲??깅줉 ???쒖텧
                            if (cardPaymentForm) {
                            cardPaymentForm.addEventListener('submit', function(e) {
                            e.preventDefault();

                            // ?곗씠???섏쭛
                            const cardCompany = document.getElementById('card-payment-card-company-select')?.value;
                            const cardName = document.getElementById('card-payment-card-select')?.value;
                            const paymentDate = document.getElementById('card-payment-date')?.value;
                            const periodStart = document.getElementById('card-payment-period-start')?.value;
                            const periodEnd = document.getElementById('card-payment-period-end')?.value;
                            const amountRaw = document.getElementById('card-payment-amount')?.value;
                            const amount = parseAmount(amountRaw);
                            const account = document.getElementById('card-payment-account-select')?.value;
                            const adjustmentRaw = document.getElementById('card-payment-adjustment')?.value || '0';
                            const adjustment = parseAmount(adjustmentRaw);

                            // ?좏슚??泥댄겕
                            if (!cardCompany || !cardName || !paymentDate || !periodStart || !periodEnd || !amount ||
                            !account) {
                            alert('紐⑤뱺 ?꾩닔 ??ぉ???낅젰?댁＜?몄슂.');
                            return;
                            }

                            // 理쒖쥌 湲덉븸 怨꾩궛 (議곗젙 湲덉븸 諛섏쁺)
                            const finalAmount = amount + adjustment;

                            // transactionData??異붽?
                            const now = Date.now();
                            const periodEndDate = new Date(periodEnd);
                            const month = periodEndDate.getMonth() + 1;

                            const newEntry = {
                            id: now,
                            date: paymentDate,
                            user: '?먮룞',
                            type: 'expense',
                            item: `${cardName} ${month}???湲?,
                            category: '移대뱶?湲?,
                            amount: finalAmount,
                            paymentMethod: 'transfer',
                            paymentDetail: account,
                            isCardPayment: true,
                            cardName: cardName,
                            billingPeriod: `${periodStart}~${periodEnd}`,
                            status: '?꾨즺',
                            timestamp: now
                            };

                            transactionData.push(newEntry);
                            saveData();

                            // 怨꾩쥖 ?붿븸 ?ш퀎??
                            calculateAccountBalances();

                            // ?뚯씠釉?媛깆떊
                            const accountFilterSelect = document.getElementById('account-filter-select');
                            const selectedAccount = accountFilterSelect ? accountFilterSelect.value : 'all';
                            renderAccountTransactionTable(selectedAccount);

                            // 怨꾩쥖 愿由???씠 ?대젮?덉쑝硫??ㅼ떆 ?뚮뜑留?
                            const otherContent = document.getElementById('other-tab-content');
                            if (otherContent && otherContent.style.display !== 'none') {
                            renderAccountsTab(otherContent);
                            }

                            // 紐⑤떖 ?リ린
                            closeCardPaymentModal();

                            // ??쒕낫???낅뜲?댄듃
                            updateDashboard();

                            alert('移대뱶 ?湲덉씠 ?깅줉?섏뿀?듬땲??');
                            console.log('移대뱶 ?湲??깅줉 ?꾨즺:', newEntry);
                            });
                            }

                            // 移대뱶 愿由?紐⑤떖 ?대깽??由ъ뒪??
                            const cardManageModalClose = document.getElementById('card-manage-modal-close');
                            const cardManageModalCancel = document.getElementById('card-manage-modal-cancel');
                            const cardManageModalOverlay = document.getElementById('card-manage-modal-overlay');
                            const cardManageForm = document.getElementById('card-manage-form');
                            const manageCardsBtn = document.getElementById('manage-cards-btn');

                            if (cardManageModalClose) {
                            cardManageModalClose.addEventListener('click', closeCardManageModal);
                            }

                            if (cardManageModalCancel) {
                            cardManageModalCancel.addEventListener('click', closeCardManageModal);
                            }

                            if (cardManageModalOverlay) {
                            cardManageModalOverlay.addEventListener('click', function(e) {
                            if (e.target === cardManageModalOverlay) {
                            closeCardManageModal();
                            }
                            });
                            }

                            if (manageCardsBtn) {
                            manageCardsBtn.addEventListener('click', function() {
                            openCardManageModal(false);
                            });
                            }

                            // 移대뱶 愿由????쒖텧
                            if (cardManageForm) {
                            cardManageForm.addEventListener('submit', function(e) {
                            e.preventDefault();

                            const name = document.getElementById('card-manage-name')?.value;
                            const typeRadios = cardManageForm.querySelectorAll('input[name="card-type"]');
                            const type = Array.from(typeRadios).find(radio => radio.checked)?.value;
                            const cardCompany = document.getElementById('card-manage-company')?.value;

                            if (!name) {
                            alert('移대뱶紐낆쓣 ?낅젰?댁＜?몄슂.');
                            return;
                            }
                            if (!type) {
                            alert('移대뱶 ?좏삎???좏깮?댁＜?몄슂.');
                            return;
                            }
                            if (!cardCompany) {
                            alert('移대뱶?щ? ?좏깮?댁＜?몄슂.');
                            return;
                            }

                            if (editingCardId) {
                            // ?섏젙 紐⑤뱶
                            const index = cardData.findIndex(c => c.id === editingCardId);
                            if (index > -1) {
                            cardData[index] = {
                            ...cardData[index],
                            name: name,
                            type: type,
                            cardCompany: cardCompany
                            };
                            saveCardData();
                            renderCardList();
                            updateCardSelects();
                            alert('?섏젙?섏뿀?듬땲??');
                            closeCardManageModal();
                            }
                            } else {
                            // ?좉퇋 異붽? 紐⑤뱶
                            const now = Date.now();
                            const newCard = {
                            id: now,
                            name: name,
                            type: type,
                            cardCompany: cardCompany
                            };
                            cardData.push(newCard);
                            saveCardData();
                            renderCardList();
                            updateCardSelects();
                            alert('移대뱶媛 異붽??섏뿀?듬땲??');
                            closeCardManageModal();
                            }
                            });
                            }

                            // 移대뱶???좏깮 ??移대뱶 紐⑸줉 ?꾪꽣留?
                            document.addEventListener('change', function(e) {
                            if (e.target.id === 'card-payment-card-company-select') {
                            const selectedCompany = e.target.value;
                            updateCardPaymentCardSelect(selectedCompany);

                            // 移대뱶 ?좏깮 珥덇린??
                            const cardSelect = document.getElementById('card-payment-card-select');
                            if (cardSelect) {
                            cardSelect.value = '';
                            }
                            }

                            // 移대뱶 ?좏깮 ??移대뱶???먮룞 ?좏깮
                            if (e.target.id === 'card-payment-card-select' && e.target.value) {
                            const selectedCardName = e.target.value;
                            const selectedCard = cardData.find(c => c.name === selectedCardName);
                            if (selectedCard && selectedCard.cardCompany) {
                            const cardCompanySelect = document.getElementById('card-payment-card-company-select');
                            if (cardCompanySelect && !cardCompanySelect.value) {
                            cardCompanySelect.value = selectedCard.cardCompany;
                            }
                            }
                            }
                            });

                            // 珥덇린 移대뱶 ?좏깮 ?쒕∼?ㅼ슫 ?낅뜲?댄듃
                            updateCardSelects();

                            // 泥?뎄???뚯씪 ?낅줈??(湲곕낯 援ъ“留?
                            document.addEventListener('click', function(e) {
                            if (e.target.id === 'upload-statement-btn') {
                            const cardStatementFile = document.getElementById('card-statement-file');
                            if (cardStatementFile) {
                            cardStatementFile.click();
                            }
                            }
                            });

                            document.addEventListener('change', async function(e) {
                            if (e.target.id === 'card-statement-file') {
                            const file = e.target.files[0];
                            if (!file) return;

                            const fileInfo = document.getElementById('file-info');
                            const parseResult = document.getElementById('parse-result');
                            const parsedData = document.getElementById('parsed-data');

                            if (fileInfo) {
                            fileInfo.textContent = '?뚯떛 以?.. ??;
                            }

                            if (parseResult) {
                            parseResult.style.display = 'none';
                            }

                            // ?뚯씪 ?뺤떇 ?뺤씤
                            if (file.type === 'application/pdf') {
                            if (fileInfo) {
                            fileInfo.textContent = '??PDF ?뚯씪? ?꾩쭅 吏?먰븯吏 ?딆뒿?덈떎. ?묒? ?뚯씪???ъ슜?댁＜?몄슂.';
                            }
                            alert('PDF ?뚯떛 湲곕뒫? 異뷀썑 援ы쁽 ?덉젙?낅땲?? ?묒? ?뚯씪???ъ슜?댁＜?몄슂.');
                            return;
                            } else if (file.type.startsWith('image/')) {
                            if (fileInfo) {
                            fileInfo.textContent = '???대?吏 ?뚯씪? ?꾩쭅 吏?먰븯吏 ?딆뒿?덈떎. ?묒? ?뚯씪???ъ슜?댁＜?몄슂.';
                            }
                            alert('?대?吏 OCR 湲곕뒫? 異뷀썑 援ы쁽 ?덉젙?낅땲?? ?묒? ?뚯씪???ъ슜?댁＜?몄슂.');
                            return;
                            }

                            // ?묒? ?뚯씪 ?뚯떛
                            try {
                            const result = await parseCardStatement(file);

                            console.log('?뚯떛 寃곌낵:', result);

                            // UI??寃곌낵 ?쒖떆
                            if (fileInfo) {
                            fileInfo.textContent = `???뚯씪: ${file.name} (${result.totalCount}媛?嫄곕옒)`;
                            }

                            if (parseResult && parsedData) {
                            parseResult.style.display = 'block';
                            parsedData.innerHTML = `
                            <div style="margin-bottom: 8px;"><strong>移대뱶??</strong> ${result.cardCompany}</div>
                            <div style="margin-bottom: 8px;"><strong>嫄곕옒 嫄댁닔:</strong> ${result.totalCount}嫄?/div>
                            <div style="margin-bottom: 8px;"><strong>珥?湲덉븸:</strong>
                              ${result.summary.totalAmount.toLocaleString()}??/div>
                            ${result.summary.discount ? `<div style="margin-bottom: 8px;"><strong>?좎씤:</strong>
                              ${result.summary.discount.toLocaleString()}??/div>` : ''}
                            ${result.summary.finalAmount ? `<div style="margin-bottom: 8px;"><strong>泥?뎄 湲덉븸:</strong>
                              ${result.summary.finalAmount.toLocaleString()}??/div>` : ''}
                            ${result.summary.billingPeriod.start ? `<div style="margin-bottom: 8px;"><strong>泥?뎄
                                湲곌컙:</strong> ${result.summary.billingPeriod.start} ~ ${result.summary.billingPeriod.end}
                            </div>` : ''}
                            ${result.summary.paymentDate ? `<div style="margin-bottom: 8px;"><strong>寃곗젣??</strong>
                              ${result.summary.paymentDate}</div>` : ''}
                            <div style="margin-top: 12px;">
                              <button type="button" id="add-transactions-btn"
                                style="padding: 8px 16px; border: none; border-radius: 6px; font-size: 0.9rem; font-weight: 500; cursor: pointer; background: #EF4444; color: #fff; transition: background 0.2s;"
                                onmouseover="this.style.background='#DC2626'"
                                onmouseout="this.style.background='#EF4444'">?붾퀎 ?꾪솴 嫄곕옒?댁뿭???쇨큵 異붽?</button>
                            </div>
                            `;

                            // 嫄곕옒 ?댁뿭 ?쇨큵 異붽? 踰꾪듉 ?대깽??
                            const addTransactionsBtn = document.getElementById('add-transactions-btn');
                            if (addTransactionsBtn) {
                            addTransactionsBtn.addEventListener('click', function() {
                            const cardName = document.getElementById('card-payment-card-select')?.value;
                            if (!cardName) {
                            alert('移대뱶瑜?癒쇱? ?좏깮?댁＜?몄슂.');
                            return;
                            }

                            if (confirm(`?뚯떛??${result.totalCount}嫄댁쓽 嫄곕옒瑜??붾퀎 ?꾪솴??嫄곕옒?댁뿭??異붽??섏떆寃좎뒿?덇퉴?\n\n以묐났??嫄곕옒???먮룞?쇰줈 ?쒖쇅?⑸땲??`))
                            {
                            let addedCount = 0;
                            let duplicateCount = 0;

                            result.transactions.forEach(t => {
                            // 以묐났 泥댄겕: ?좎쭨, ?ъ슜泥? 湲덉븸??紐⑤몢 ?쇱튂?섎뒗 嫄곕옒媛 ?덈뒗吏 ?뺤씤
                            const isDuplicate = transactionData.some(existing => {
                            return existing.date === t.date &&
                            existing.item === t.merchant &&
                            Math.abs(existing.amount - t.amount) < 1 && // 湲덉븸 李⑥씠 1??誘몃쭔 existing.paymentMethod==='credit'
                              && existing.paymentDetail===cardName; }); if (!isDuplicate) { const newEntry={ id:
                              Date.now() + Math.random(), date: t.date, user: '?좊몺' , // 湲곕낯媛?(?섎룞 蹂寃?媛?? type: 'expense' ,
                              item: t.merchant, category: '誘몃텇瑜? , // ?먮룞 遺꾨쪟 ?먮뒗 ?섎룞 ?낅젰 amount: t.amount,
                              paymentMethod: 'credit' , paymentDetail: cardName, status: '?꾨즺' , timestamp: Date.now() };
                              transactionData.push(newEntry); addedCount++; } else { duplicateCount++; } }); // ?곗씠?????
                              if (typeof saveData==='function' ) { saveData(); } // ?꾩옱 ?쒖꽦 ???뺤씤 ???대떦 ??쓽 ?뚮뜑 ?⑥닔 ?몄텧 const
                              currentTab=window.currentActiveTab || 'dashboard' ; // 紐⑤뱺 ?뚯씠釉?媛깆떊 (?꾩옱 ??씠 dashboard??寃쎌슦) if
                              (currentTab==='dashboard' ) { if (typeof renderTable==='function' ) { renderTable(); } if
                              (typeof renderCardTable==='function' ) { renderCardTable('all'); } if (typeof
                              renderBankTable==='function' ) { renderBankTable(); } if (typeof
                              updateDashboard==='function' ) { updateDashboard(); } } else if (currentTab==='accounts' )
                              { // 怨꾩쥖 愿由???씤 寃쎌슦 怨꾩쥖 ?뚯씠釉?媛깆떊 if (typeof renderAccountTransactionTable==='function' ) { const
                              accountSelect=document.getElementById('account-filter-select'); const
                              selectedAccount=accountSelect ? accountSelect.value : 'all' ;
                              renderAccountTransactionTable(selectedAccount); } // 怨꾩쥖 紐⑸줉??媛깆떊 const
                              accountsContainer=document.getElementById('accounts-container'); if (accountsContainer &&
                              typeof window.renderAccountsTab==='function' ) {
                              window.renderAccountsTab(accountsContainer); } } else if (currentTab==='cards' ) { // 寃곗젣?섎떒
                              愿由???씤 寃쎌슦 移대뱶 紐⑸줉 媛깆떊 const
                              paymentMethodsContainer=document.getElementById('payment-methods-container'); if
                              (paymentMethodsContainer && typeof window.renderPaymentMethodsTab==='function' ) {
                              window.renderPaymentMethodsTab(paymentMethodsContainer); } } // ??쒕낫?쒕뒗 ??긽 ?낅뜲?댄듃 (?ㅻⅨ ??뿉?쒕룄 ?붿빟
                              ?뺣낫媛 ?꾩슂?????덉쓬) if (typeof updateDashboard==='function' ) { updateDashboard(); } // ?꾩옱 ?쒖꽦?붾맂
                              ?섏쐞 ???뺤씤 諛??쒖떆 const activeSubTab=document.querySelector('.sub-tab-btn.active'); if
                              (activeSubTab) { const subtabKey=activeSubTab.getAttribute('data-subtab'); const
                              totalContent=document.getElementById('total-content'); const
                              cardContent=document.getElementById('card-content'); const
                              bankContent=document.getElementById('bank-content'); // 紐⑤뱺 ?섏쐞 ???④? if (totalContent)
                              totalContent.style.display='none' ; if (cardContent) cardContent.style.display='none' ; if
                              (bankContent) bankContent.style.display='none' ; // ?쒖꽦?붾맂 ??쭔 ?쒖떆 if (subtabKey==='total' &&
                              totalContent) { totalContent.style.display='block' ; } else if (subtabKey==='card' &&
                              cardContent) { cardContent.style.display='block' ; } else if (subtabKey==='bank' &&
                              bankContent) { bankContent.style.display='block' ; } } // console.log濡??곗씠???뺤씤
                              console.log('transactionData 湲몄씠:', transactionData.length); let message=`嫄곕옒 ?댁뿭??
                              異붽??섏뿀?듬땲??\n\n`; message +=`- ?좉퇋 異붽?: ${addedCount}嫄?n`; if (duplicateCount> 0) {
                              message += `- 以묐났 ?쒖쇅: ${duplicateCount}嫄?;
                              }
                              alert(message);
                              }
                              });
                              }
                              }

                              // ?쇱뿉 ?먮룞 ?낅젰 (移대뱶 ?좏깮遺??泥?뎄 湲덉븸源뚯?)

                              // 1. 移대뱶 ?좏깮 (?뚯떛??移대뱶?ъ? ?쇱튂?섎뒗 移대뱶 ?먮룞 ?좏깮)
                              const cardCompanySelect = document.getElementById('card-payment-card-company-select');
                              if (cardCompanySelect && result.cardCompany) {
                              cardCompanySelect.value = result.cardCompany;
                              // 移대뱶???좏깮 ?대깽???몃━嫄고븯??移대뱶 紐⑸줉 ?낅뜲?댄듃
                              cardCompanySelect.dispatchEvent(new Event('change'));
                              }

                              // 2. 移대뱶 ?좏깮 (嫄곕옒 ?댁뿭?먯꽌 媛??留롮씠 ?ъ슜??移대뱶 ?먮뒗 泥?踰덉㎏ 移대뱶)
                              setTimeout(() => {
                              const cardSelect = document.getElementById('card-payment-card-select');
                              if (cardSelect && cardSelect.options.length > 1) {
                              // 泥?踰덉㎏ 移대뱶 ?먮룞 ?좏깮 (?먮뒗 ?ъ슜?먭? ?섎룞?쇰줈 ?좏깮 媛??
                              cardSelect.selectedIndex = 1;
                              cardSelect.dispatchEvent(new Event('change'));
                              }
                              }, 100);

                              // 3. 泥?뎄 湲곌컙
                              if (result.summary.billingPeriod.start) {
                              const periodStartInput = document.getElementById('card-payment-period-start');
                              if (periodStartInput) {
                              periodStartInput.value = result.summary.billingPeriod.start;
                              }

                              // ?뚯떛??泥?뎄 湲곌컙?쇰줈 ?곕룄/???쒕∼?ㅼ슫 ?먮룞 ?ㅼ젙
                              const yearSelect = document.getElementById('card-payment-year-select');
                              const monthSelect = document.getElementById('card-payment-month-select');

                              if (yearSelect && monthSelect && result.summary.billingPeriod.start) {
                              // ?뚯떛??泥?뎄 湲곌컙?먯꽌 ?곕룄 異붿텧
                              const parsedYear = parseInt(result.summary.billingPeriod.start.split('-')[0]);
                              const parsedMonth = parseInt(result.summary.billingPeriod.start.split('-')[1]);

                              // ?곕룄 ?쒕∼?ㅼ슫 ?낅뜲?댄듃
                              if (parsedYear && !isNaN(parsedYear)) {
                              yearSelect.value = parsedYear;
                              }

                              // ???쒕∼?ㅼ슫 ?낅뜲?댄듃
                              if (parsedMonth && !isNaN(parsedMonth)) {
                              monthSelect.value = parsedMonth;
                              }

                              // ?곕룄/???좏깮 ?대깽???몃━嫄고븯???좎쭨 ?낅젰 ?꾨뱶 ?낅뜲?댄듃
                              if (yearSelect.value && monthSelect.value) {
                              yearSelect.dispatchEvent(new Event('change'));
                              }
                              }
                              }

                              if (result.summary.billingPeriod.end) {
                              const periodEndInput = document.getElementById('card-payment-period-end');
                              if (periodEndInput) {
                              periodEndInput.value = result.summary.billingPeriod.end;
                              }
                              }

                              // 4. 寃곗젣??
                              if (result.summary.paymentDate) {
                              const paymentDateInput = document.getElementById('card-payment-date');
                              if (paymentDateInput) {
                              paymentDateInput.value = result.summary.paymentDate;
                              }
                              }

                              // 5. 泥?뎄 湲덉븸
                              if (result.summary.finalAmount) {
                              const amountInput = document.getElementById('card-payment-amount');
                              if (amountInput) {
                              amountInput.value = result.summary.finalAmount.toLocaleString();
                              // ?대깽???몃━嫄고븯??肄ㅻ쭏 ?щ㎎??
                              amountInput.dispatchEvent(new Event('input'));
                              }
                              }

                              // ?좏슚??泥댄겕 ?몃━嫄?
                              setTimeout(() => {
                              validateCardPayment();
                              }, 200);

                              } catch (error) {
                              console.error('?뚯떛 ?ㅻ쪟:', error);
                              if (fileInfo) {
                              fileInfo.textContent = '???뚯씪 ?뚯떛 ?ㅽ뙣: ' + error.message;
                              }
                              alert('?뚯씪???쎌쓣 ???놁뒿?덈떎. ?묒? ?뚯씪 ?뺤떇???뺤씤?댁＜?몄슂.\n\n?ㅻ쪟: ' + error.message);
                              }
                              }
                              });

                              // ?붾퀎 ?꾪솴 ?댁뿭 ?낅젰 紐⑤떖??泥?뎄???뚯씪 ?낅줈??
                              document.addEventListener('click', function(e) {
                              if (e.target.id === 'upload-entry-statement-btn') {
                              const entryStatementFile = document.getElementById('entry-statement-file');
                              if (entryStatementFile) {
                              entryStatementFile.click();
                              }
                              }
                              });

                              document.addEventListener('change', async function(e) {
                              if (e.target.id === 'entry-statement-file') {
                              const file = e.target.files[0];
                              if (!file) return;

                              const fileInfo = document.getElementById('entry-file-info');
                              const parseResult = document.getElementById('entry-parse-result');
                              const parsedData = document.getElementById('entry-parsed-data');

                              if (fileInfo) {
                              fileInfo.textContent = '?뚯떛 以?.. ??;
                              }

                              if (parseResult) {
                              parseResult.style.display = 'none';
                              }

                              // ?뚯씪 ?뺤떇 ?뺤씤
                              if (file.type === 'application/pdf') {
                              if (fileInfo) {
                              fileInfo.textContent = '??PDF ?뚯씪? ?꾩쭅 吏?먰븯吏 ?딆뒿?덈떎. ?묒? ?뚯씪???ъ슜?댁＜?몄슂.';
                              }
                              return;
                              } else if (file.type.startsWith('image/')) {
                              if (fileInfo) {
                              fileInfo.textContent = '???대?吏 ?뚯씪? ?꾩쭅 吏?먰븯吏 ?딆뒿?덈떎. ?묒? ?뚯씪???ъ슜?댁＜?몄슂.';
                              }
                              return;
                              }

                              // ?뚯씪 ?낅줈?????먮룞?쇰줈 移대뱶??媛먯? (移대뱶 ?좏깮 遺덊븘??

                              // ?묒? ?뚯씪 ?뚯떛
                              try {
                              const result = await parseCardStatement(file);

                              console.log('?뚯떛 寃곌낵:', result);

                              // UI??寃곌낵 ?쒖떆
                              if (fileInfo) {
                              fileInfo.textContent = `???뚯씪: ${file.name} (${result.totalCount}媛?嫄곕옒)`;
                              }

                              // 移대뱶??諛?移대뱶 ?좏깮 ?곸뿭 ?쒖떆
                              const cardSelection = document.getElementById('entry-card-selection');
                              if (cardSelection) {
                              cardSelection.style.display = 'block';

                              // 移대뱶???쒕∼?ㅼ슫 梨꾩슦湲?
                              const cardCompanySelect = document.getElementById('entry-auto-card-company');
                              if (cardCompanySelect) {
                              cardCompanySelect.innerHTML = '<option value="">--?좏깮--</option>';
                              const companies = [...new Set(cardData.map(c => c.cardCompany).filter(c => c))];
                              companies.forEach(company => {
                              const option = document.createElement('option');
                              option.value = company;
                              option.textContent = company;
                              // ?뚯떛??移대뱶?ъ? ?쇱튂?섎㈃ ?먮룞 ?좏깮
                              if (company === result.cardCompany) {
                              option.selected = true;
                              }
                              cardCompanySelect.appendChild(option);
                              });

                              // ?뚯떛??移대뱶?ш? "?????놁쓬"?닿굅???깅줉?섏? ?딆? 寃쎌슦 泥?踰덉㎏ ?듭뀡 ?좏깮
                              if (result.cardCompany === '?????놁쓬' || !companies.includes(result.cardCompany)) {
                              cardCompanySelect.value = '';
                              }

                              // 移대뱶???좏깮 ??移대뱶 紐⑸줉 ?낅뜲?댄듃 (?뚯떛 寃곌낵 ?낅뜲?댄듃???⑥닔 ?뺤쓽 ??
                              cardCompanySelect.addEventListener('change', function() {
                              updateEntryAutoCardSelect(this.value);
                              });

                              // 移대뱶 ?좏깮 ?대깽?몃뒗 updateEntryParsedData ?⑥닔 ?뺤쓽 ?꾩뿉 異붽???

                              // 珥덇린 移대뱶 紐⑸줉 ?낅뜲?댄듃
                              if (cardCompanySelect.value) {
                              updateEntryAutoCardSelect(cardCompanySelect.value);
                              }
                              }

                              // 泥?뎄?곗썡 ?좏깮 ?쒕∼?ㅼ슫 珥덇린??(??긽 ?쒖떆, ?섎룞 ?ㅼ젙 媛??
                              const billingPeriodSelection = document.getElementById('entry-billing-period-selection');
                              const yearSelect = document.getElementById('entry-auto-year-select');
                              const monthSelect = document.getElementById('entry-auto-month-select');
                              const billingPeriodDisplay = document.getElementById('entry-billing-period-display');

                              // ?곕룄 ?쒕∼?ㅼ슫 珥덇린??
                              if (yearSelect) {
                              yearSelect.innerHTML = '<option value="">?곕룄</option>';
                              const today = new Date();
                              for (let year = 2024; year <= 2060; year++) { const
                                option=document.createElement('option'); option.value=year;
                                option.textContent=`${year}??; // ?뚯떛??泥?뎄湲곌컙???덉쑝硫??대떦 ?곕룄 ?좏깮, ?놁쑝硫??ы빐 ?좏깮 if
                                (result.summary.billingPeriod.start) { const
                                parsedYear=parseInt(result.summary.billingPeriod.start.split('-')[0]); if
                                (year===parsedYear) { option.selected=true; } } else if (year===today.getFullYear()) {
                                option.selected=true; } yearSelect.appendChild(option); } } // ???쒕∼?ㅼ슫 珥덇린??if
                                (monthSelect) { monthSelect.innerHTML='<option value="">??/option>' ; const today=new
                                Date(); for (let month=1; month <=12; month++) { const
                                option=document.createElement('option'); option.value=month;
                                option.textContent=`${month}??; // ?뚯떛??泥?뎄湲곌컙???덉쑝硫??대떦 ???좏깮, ?놁쑝硫??대쾲 ???좏깮 if
                                (result.summary.billingPeriod.start) { const
                                parsedMonth=parseInt(result.summary.billingPeriod.start.split('-')[1]); if
                                (month===parsedMonth) { option.selected=true; } } else if (month===today.getMonth() + 1)
                                { option.selected=true; } monthSelect.appendChild(option); } } // 泥?뎄湲곌컙 ?낅뜲?댄듃 ?⑥닔 (?ㅼ젣 DOM
                                ?붿냼瑜?吏곸젒 李몄“) const updateBillingPeriod=()=> {
                                // DOM?먯꽌 吏곸젒 媛?몄삤湲?(??긽 理쒖떊 ?붿냼 李몄“)
                                const currentYearSelect = document.getElementById('entry-auto-year-select');
                                const currentMonthSelect = document.getElementById('entry-auto-month-select');
                                const currentBillingPeriodDisplay =
                                document.getElementById('entry-billing-period-display');

                                const selectedYear = currentYearSelect?.value;
                                const selectedMonth = currentMonthSelect?.value;

                                console.log('泥?뎄湲곌컙 ?낅뜲?댄듃:', selectedYear, selectedMonth);

                                if (selectedYear && selectedMonth) {
                                const yearNum = parseInt(selectedYear);
                                const monthNum = parseInt(selectedMonth);

                                // ?좏슚??寃??
                                if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum> 12) {
                                  if (currentBillingPeriodDisplay) {
                                  currentBillingPeriodDisplay.textContent = '泥?뎄湲곌컙: ?щ컮瑜??곗썡???좏깮?댁＜?몄슂';
                                  }
                                  return;
                                  }

                                  // ?대떦 ?붿쓽 泥??좉낵 留덉?留???怨꾩궛
                                  const startDate = new Date(yearNum, monthNum - 1, 1);
                                  const endDate = new Date(yearNum, monthNum, 0); // ?ㅼ쓬 ??0??= ?대쾲 ??留덉?留???

                                  // ?좎쭨 ?뺤떇: YYYY-MM-DD
                                  const startStr = `${yearNum}-${String(monthNum).padStart(2, '0')}-01`;
                                  const endStr = `${yearNum}-${String(monthNum).padStart(2,
                                  '0')}-${String(endDate.getDate()).padStart(2, '0')}`;

                                  console.log('怨꾩궛??泥?뎄湲곌컙:', startStr, '~', endStr);

                                  // ?뚯떛 寃곌낵??泥?뎄湲곌컙 ?낅뜲?댄듃
                                  if (result && result.summary) {
                                  result.summary.billingPeriod.start = startStr;
                                  result.summary.billingPeriod.end = endStr;
                                  }

                                  // 泥?뎄湲곌컙 ?쒖떆 ?낅뜲?댄듃
                                  if (currentBillingPeriodDisplay) {
                                  currentBillingPeriodDisplay.textContent = `泥?뎄湲곌컙: ${startStr} ~ ${endStr}`;
                                  currentBillingPeriodDisplay.style.color = '#111827';
                                  }

                                  // ?뚯떛 寃곌낵 ?붾㈃ ?낅뜲?댄듃
                                  if (typeof updateEntryParsedData === 'function') {
                                  updateEntryParsedData();
                                  }
                                  } else {
                                  if (currentBillingPeriodDisplay) {
                                  currentBillingPeriodDisplay.textContent = '泥?뎄湲곌컙: ?좏깮?댁＜?몄슂';
                                  currentBillingPeriodDisplay.style.color = '#6B7280';
                                  }
                                  }
                                  };

                                  // ?곕룄/???좏깮 ??泥?뎄湲곌컙 ?낅뜲?댄듃
                                  if (yearSelect && monthSelect) {
                                  // 湲곗〈 ?대깽??由ъ뒪???쒓굅 ???ъ텛媛 (以묐났 諛⑹?)
                                  const newYearSelect = yearSelect.cloneNode(true);
                                  const newMonthSelect = monthSelect.cloneNode(true);
                                  yearSelect.parentNode.replaceChild(newYearSelect, yearSelect);
                                  monthSelect.parentNode.replaceChild(newMonthSelect, monthSelect);

                                  // ?대깽??由ъ뒪???깅줉
                                  newYearSelect.addEventListener('change', function() {
                                  console.log('?곕룄 蹂寃?', this.value);
                                  updateBillingPeriod();
                                  });
                                  newMonthSelect.addEventListener('change', function() {
                                  console.log('??蹂寃?', this.value);
                                  updateBillingPeriod();
                                  });

                                  // 珥덇린媛믪씠 ?덉쑝硫?利됱떆 ?낅뜲?댄듃
                                  if (newYearSelect.value && newMonthSelect.value) {
                                  console.log('珥덇린媛믪쑝濡?泥?뎄湲곌컙 ?낅뜲?댄듃:', newYearSelect.value, newMonthSelect.value);
                                  // ?쎄컙??吏?곗쓣 ?먯뼱 DOM???꾩쟾???낅뜲?댄듃?????ㅽ뻾
                                  setTimeout(() => {
                                  updateBillingPeriod();
                                  }, 100);
                                  } else if (result && result.summary && result.summary.billingPeriod &&
                                  result.summary.billingPeriod.start && result.summary.billingPeriod.end) {
                                  // ?뚯떛??泥?뎄湲곌컙???덉쑝硫??쒖떆留??낅뜲?댄듃
                                  if (billingPeriodDisplay) {
                                  billingPeriodDisplay.textContent = `泥?뎄湲곌컙: ${result.summary.billingPeriod.start} ~
                                  ${result.summary.billingPeriod.end}`;
                                  billingPeriodDisplay.style.color = '#111827';
                                  }
                                  }
                                  }
                                  }

                                  // ?뚯떛 寃곌낵 ?낅뜲?댄듃 ?⑥닔
                                  function updateEntryParsedData() {
                                  const parsedData = document.getElementById('entry-parsed-data');
                                  if (!parsedData) return;

                                  const selectedCardCompany = document.getElementById('entry-auto-card-company')?.value
                                  || result.cardCompany;
                                  const selectedCardName = document.getElementById('entry-auto-card-select')?.value ||
                                  '';

                                  const cardCompanyText = selectedCardCompany && selectedCardCompany !== '?????놁쓬'
                                  ? selectedCardCompany
                                  : `<span style="color: #EF4444;">?????놁쓬</span> (移대뱶?щ? ?좏깮?댁＜?몄슂)`;

                                  const cardText = selectedCardName ? selectedCardName : '(移대뱶瑜??좏깮?댁＜?몄슂)';

                                  parsedData.innerHTML = `
                                  <div style="margin-bottom: 8px;"><strong>移대뱶??</strong> ${cardCompanyText}</div>
                                  <div style="margin-bottom: 8px;"><strong>移대뱶:</strong> ${cardText}</div>
                                  <div style="margin-bottom: 8px;"><strong>嫄곕옒 嫄댁닔:</strong> ${result.totalCount}嫄?/div>
                                  <div style="margin-bottom: 8px;"><strong>珥?湲덉븸:</strong>
                                    ${result.summary.totalAmount.toLocaleString()}??/div>
                                  ${result.summary.finalAmount ? `<div style="margin-bottom: 8px;"><strong>泥?뎄
                                      湲덉븸:</strong> ${result.summary.finalAmount.toLocaleString()}??/div>` : ''}
                                  ${result.summary.billingPeriod.start ? `<div style="margin-bottom: 8px;"><strong>泥?뎄
                                      湲곌컙:</strong> ${result.summary.billingPeriod.start} ~
                                    ${result.summary.billingPeriod.end || ''}</div>` : ''}
                                  <div style="margin-top: 12px;">
                                    <button type="button" id="entry-add-transactions-btn"
                                      style="padding: 8px 16px; border: none; border-radius: 6px; font-size: 0.9rem; font-weight: 500; cursor: pointer; background: #EF4444; color: #fff; transition: background 0.2s;"
                                      onmouseover="this.style.background='#DC2626'"
                                      onmouseout="this.style.background='#EF4444'">?붾퀎 ?꾪솴 嫄곕옒?댁뿭???쇨큵 異붽?</button>
                                  </div>
                                  `;

                                  // 嫄곕옒 ?댁뿭 ?쇨큵 異붽? 踰꾪듉 ?대깽??
                                  const addTransactionsBtn = document.getElementById('entry-add-transactions-btn');
                                  if (addTransactionsBtn) {
                                  // 湲곗〈 ?대깽??由ъ뒪???쒓굅 (以묐났 諛⑹?)
                                  const newBtn = addTransactionsBtn.cloneNode(true);
                                  addTransactionsBtn.parentNode.replaceChild(newBtn, addTransactionsBtn);

                                  newBtn.addEventListener('click', function() {
                                  // ?좏깮??移대뱶?ъ? 移대뱶 媛?몄삤湲?
                                  const selectedCardCompany = document.getElementById('entry-auto-card-company')?.value
                                  || result.cardCompany;
                                  const selectedCardName = document.getElementById('entry-auto-card-select')?.value ||
                                  '';

                                  if (!selectedCardCompany || selectedCardCompany === '?????놁쓬') {
                                  alert('移대뱶?щ? ?좏깮?댁＜?몄슂.');
                                  return;
                                  }

                                  if (!selectedCardName) {
                                  alert('移대뱶瑜??좏깮?댁＜?몄슂.');
                                  return;
                                  }

                                  // ?좏깮??移대뱶 ?뺣낫 媛?몄삤湲?
                                  const selectedCard = cardData.find(c => c.name === selectedCardName && c.cardCompany
                                  === selectedCardCompany);
                                  if (!selectedCard) {
                                  alert('?좏깮??移대뱶瑜?李얠쓣 ???놁뒿?덈떎.');
                                  return;
                                  }

                                  const paymentMethod = selectedCard.type === 'debit' ? 'debit' : 'credit';

                                  if (confirm(`?뚯떛??${result.totalCount}嫄댁쓽 嫄곕옒瑜??붾퀎 ?꾪솴??嫄곕옒?댁뿭??異붽??섏떆寃좎뒿?덇퉴?\n\n以묐났??嫄곕옒???먮룞?쇰줈
                                  ?쒖쇅?⑸땲??`)) {
                                  let addedCount = 0;
                                  let duplicateCount = 0;

                                  result.transactions.forEach(t => {
                                  // 以묐났 泥댄겕: ?좎쭨, ?ъ슜泥? 湲덉븸??紐⑤몢 ?쇱튂?섎뒗 嫄곕옒媛 ?덈뒗吏 ?뺤씤
                                  const isDuplicate = transactionData.some(existing => {
                                  return existing.date === t.date &&
                                  existing.item === t.merchant &&
                                  Math.abs(existing.amount - t.amount) < 1 && // 湲덉븸 李⑥씠 1??誘몃쭔
                                    existing.paymentMethod===paymentMethod && existing.paymentDetail===selectedCardName;
                                    }); if (!isDuplicate) { const newEntry={ id: Date.now() + Math.random(), date:
                                    t.date, user: '?좊몺' , // 湲곕낯媛?(?섎룞 蹂寃?媛?? type: 'expense' , item: t.merchant,
                                    category: '誘몃텇瑜? , // ?먮룞 遺꾨쪟 ?먮뒗 ?섎룞 ?낅젰 amount: t.amount, paymentMethod: paymentMethod,
                                    paymentDetail: selectedCardName, status: '?꾨즺' , timestamp: Date.now() };
                                    transactionData.push(newEntry); addedCount++; } else { duplicateCount++; } }); //
                                    ?곗씠?????if (typeof saveData==='function' ) { saveData(); } // ?꾩옱 ?쒖꽦 ???뺤씤 ???대떦 ??쓽 ?뚮뜑
                                    ?⑥닔 ?몄텧 const currentTab=window.currentActiveTab || 'dashboard' ; // 紐⑤뱺 ?뚯씠釉?媛깆떊 (?꾩옱 ??씠
                                    dashboard??寃쎌슦) if (currentTab==='dashboard' ) { if (typeof renderTable==='function'
                                    ) { renderTable(); } if (typeof renderCardTable==='function' ) {
                                    renderCardTable('all'); } if (typeof renderBankTable==='function' ) {
                                    renderBankTable(); } if (typeof updateDashboard==='function' ) { updateDashboard();
                                    } // ?꾩옱 ?쒖꽦?붾맂 ?섏쐞 ???뺤씤 諛??쒖떆 const
                                    activeSubTab=document.querySelector('.sub-tab-btn.active'); if (activeSubTab) {
                                    const subtabKey=activeSubTab.getAttribute('data-subtab'); const
                                    totalContent=document.getElementById('total-content'); const
                                    cardContent=document.getElementById('card-content'); const
                                    bankContent=document.getElementById('bank-content'); // 紐⑤뱺 ?섏쐞 ???④? if (totalContent)
                                    totalContent.style.display='none' ; if (cardContent)
                                    cardContent.style.display='none' ; if (bankContent) bankContent.style.display='none'
                                    ; // ?쒖꽦?붾맂 ??쭔 ?쒖떆 if (subtabKey==='total' && totalContent) {
                                    totalContent.style.display='block' ; } else if (subtabKey==='card' && cardContent) {
                                    cardContent.style.display='block' ; } else if (subtabKey==='bank' && bankContent) {
                                    bankContent.style.display='block' ; } } } else if (currentTab==='accounts' ) { // 怨꾩쥖
                                    愿由???씤 寃쎌슦 怨꾩쥖 ?뚯씠釉?媛깆떊 if (typeof renderAccountTransactionTable==='function' ) { const
                                    accountSelect=document.getElementById('account-filter-select'); const
                                    selectedAccount=accountSelect ? accountSelect.value : 'all' ;
                                    renderAccountTransactionTable(selectedAccount); } // 怨꾩쥖 紐⑸줉??媛깆떊 const
                                    accountsContainer=document.getElementById('accounts-container'); if
                                    (accountsContainer && typeof window.renderAccountsTab==='function' ) {
                                    window.renderAccountsTab(accountsContainer); } } else if (currentTab==='cards' ) {
                                    // 寃곗젣?섎떒 愿由???씤 寃쎌슦 移대뱶 紐⑸줉 媛깆떊 const
                                    paymentMethodsContainer=document.getElementById('payment-methods-container'); if
                                    (paymentMethodsContainer && typeof window.renderPaymentMethodsTab==='function' ) {
                                    window.renderPaymentMethodsTab(paymentMethodsContainer); } } // ??쒕낫?쒕뒗 ??긽 ?낅뜲?댄듃 (?ㅻⅨ
                                    ??뿉?쒕룄 ?붿빟 ?뺣낫媛 ?꾩슂?????덉쓬) if (typeof updateDashboard==='function' ) { updateDashboard();
                                    } // console.log濡??곗씠???뺤씤 console.log('transactionData 湲몄씠:', transactionData.length);
                                    console.log('異붽???嫄곕옒:', addedCount, '嫄? ); // 紐⑤떖 ?リ린 const
                                    modalOverlay=document.getElementById('modal-overlay'); if (modalOverlay) {
                                    modalOverlay.style.display='none' ; document.body.style.overflow='' ; } // ?뚯씪 ?뺣낫 珥덇린??
                                    if (fileInfo) { fileInfo.textContent='' ; } if (parseResult) {
                                    parseResult.style.display='none' ; } const
                                    fileInput=document.getElementById('entry-statement-file'); if (fileInput) {
                                    fileInput.value='' ; } // ?앹뾽 硫붿떆吏 ?쒖떆 let message=`嫄곕옒 ?댁뿭??異붽??섏뿀?듬땲??\n\n`; message +=`-
                                    ?좉퇋 異붽?: ${addedCount}嫄?n`; if (duplicateCount> 0) {
                                    message += `- 以묐났 ?쒖쇅: ${duplicateCount}嫄?;
                                    }
                                    alert(message);
                                    }
                                    });
                                    }
                                    }

                                    // 移대뱶??移대뱶 ?좏깮 ???뚯떛 寃곌낵 ?낅뜲?댄듃 ?대깽??由ъ뒪??異붽?
                                    const cardCompanySelectForUpdate =
                                    document.getElementById('entry-auto-card-company');
                                    const cardSelectForUpdate = document.getElementById('entry-auto-card-select');

                                    if (cardCompanySelectForUpdate) {
                                    // 湲곗〈 ?대깽??由ъ뒪???쒓굅 ???ъ텛媛
                                    const currentValue = cardCompanySelectForUpdate.value;
                                    const newCompanySelect = cardCompanySelectForUpdate.cloneNode(true);
                                    cardCompanySelectForUpdate.parentNode.replaceChild(newCompanySelect,
                                    cardCompanySelectForUpdate);
                                    newCompanySelect.value = currentValue;
                                    newCompanySelect.addEventListener('change', function() {
                                    updateEntryAutoCardSelect(this.value);
                                    updateEntryParsedData();
                                    });
                                    }

                                    if (cardSelectForUpdate) {
                                    const currentValue = cardSelectForUpdate.value;
                                    const newCardSelect = cardSelectForUpdate.cloneNode(true);
                                    cardSelectForUpdate.parentNode.replaceChild(newCardSelect, cardSelectForUpdate);
                                    newCardSelect.value = currentValue;
                                    newCardSelect.addEventListener('change', function() {
                                    updateEntryParsedData();
                                    });
                                    }

                                    // 珥덇린 ?뚯떛 寃곌낵 ?쒖떆
                                    if (parseResult && parsedData) {
                                    parseResult.style.display = 'block';
                                    updateEntryParsedData();
                                    }

                                    } catch (error) {
                                    console.error('?뚯떛 ?ㅻ쪟:', error);
                                    if (fileInfo) {
                                    fileInfo.textContent = '???뚯씪 ?뚯떛 ?ㅽ뙣: ' + error.message;
                                    }
                                    alert('?뚯씪???쎌쓣 ???놁뒿?덈떎. ?묒? ?뚯씪 ?뺤떇???뺤씤?댁＜?몄슂.\n\n?ㅻ쪟: ' + error.message);
                                    }
                                    }
                                    });

                                    // 怨꾩쥖 ?낆텧湲??댁뿭 ?깅줉 紐⑤떖??移대뱶 紐낆꽭???뚯씪 ?낅줈??
                                    // 紐⑤떖 ?대??먯꽌 吏곸젒 ?대깽??由ъ뒪???깅줉
                                    const accountTransactionModalOverlay =
                                    document.getElementById('account-transaction-modal-overlay');
                                    if (accountTransactionModalOverlay) {
                                    // ?대깽???꾩엫???ъ슜?섏뿬 紐⑤떖 ?대???踰꾪듉 ?대┃ 媛먯?
                                    accountTransactionModalOverlay.addEventListener('click', function(e) {
                                    // 踰꾪듉 ?먯껜 ?먮뒗 踰꾪듉 ?대? ?붿냼 ?대┃ ??泥섎━
                                    const uploadBtn = e.target.id === 'upload-account-transaction-statement-btn'
                                    ? e.target
                                    : e.target.closest('#upload-account-transaction-statement-btn');

                                    if (uploadBtn) {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    const accountTransactionStatementFile =
                                    document.getElementById('account-transaction-statement-file');
                                    if (accountTransactionStatementFile) {
                                    console.log('?뚯씪 ?좏깮 踰꾪듉 ?대┃??);
                                    accountTransactionStatementFile.click();
                                    } else {
                                    console.error('?뚯씪 input ?붿냼瑜?李얠쓣 ???놁뒿?덈떎:', 'account-transaction-statement-file');
                                    }
                                    }
                                    });
                                    }

                                    // ?꾩뿭 ?대깽??由ъ뒪?덈룄 ?좎? (紐⑤떖???섏쨷???앹꽦?????덉쑝誘濡?
                                    document.addEventListener('click', function(e) {
                                    // 踰꾪듉 ?먯껜 ?먮뒗 踰꾪듉 ?대? ?붿냼 ?대┃ ??泥섎━
                                    const uploadBtn = e.target.id === 'upload-account-transaction-statement-btn'
                                    ? e.target
                                    : e.target.closest('#upload-account-transaction-statement-btn');

                                    if (uploadBtn) {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    const accountTransactionStatementFile =
                                    document.getElementById('account-transaction-statement-file');
                                    if (accountTransactionStatementFile) {
                                    console.log('?뚯씪 ?좏깮 踰꾪듉 ?대┃??(?꾩뿭)');
                                    accountTransactionStatementFile.click();
                                    } else {
                                    console.error('?뚯씪 input ?붿냼瑜?李얠쓣 ???놁뒿?덈떎:', 'account-transaction-statement-file');
                                    }
                                    }
                                    });

                                    document.addEventListener('change', async function(e) {
                                    if (e.target.id === 'account-transaction-statement-file') {
                                    const file = e.target.files[0];
                                    if (!file) return;

                                    const fileInfo = document.getElementById('account-transaction-file-info');
                                    const parseResult = document.getElementById('account-transaction-parse-result');
                                    const parsedData = document.getElementById('account-transaction-parsed-data');

                                    if (fileInfo) {
                                    fileInfo.textContent = '?뚯떛 以?.. ??;
                                    }

                                    if (parseResult) {
                                    parseResult.style.display = 'none';
                                    }

                                    // ?뚯씪 ?뺤떇 ?뺤씤
                                    if (file.type === 'application/pdf') {
                                    if (fileInfo) {
                                    fileInfo.textContent = '??PDF ?뚯씪? ?꾩쭅 吏?먰븯吏 ?딆뒿?덈떎. ?묒? ?뚯씪???ъ슜?댁＜?몄슂.';
                                    }
                                    return;
                                    } else if (file.type.startsWith('image/')) {
                                    if (fileInfo) {
                                    fileInfo.textContent = '???대?吏 ?뚯씪? ?꾩쭅 吏?먰븯吏 ?딆뒿?덈떎. ?묒? ?뚯씪???ъ슜?댁＜?몄슂.';
                                    }
                                    return;
                                    }

                                    // ?묒? ?뚯씪 ?뚯떛
                                    try {
                                    console.log('?뚯씪 ?뚯떛 ?쒖옉:', file.name);
                                    const result = await parseCardStatement(file);

                                    console.log('?뚯떛 寃곌낵:', result);

                                    // UI??寃곌낵 ?쒖떆
                                    if (fileInfo) {
                                    fileInfo.textContent = `???뚯씪: ${file.name} (${result.totalCount}媛?嫄곕옒)`;
                                    }

                                    // ?뚯떛 寃곌낵 ?쒖떆 ?곸뿭 李얘린 諛??쒖떆
                                    // 紐⑤떖???대젮?덉쓣 ??DOM ?붿냼瑜??ㅼ떆 李얘린
                                    const modalOverlay = document.getElementById('account-transaction-modal-overlay');
                                    const currentParseResult = modalOverlay
                                    ? modalOverlay.querySelector('#account-transaction-parse-result')
                                    : document.getElementById('account-transaction-parse-result');
                                    const currentParsedData = modalOverlay
                                    ? modalOverlay.querySelector('#account-transaction-parsed-data')
                                    : document.getElementById('account-transaction-parsed-data');

                                    console.log('?뚯떛 寃곌낵 ?쒖떆 ?곸뿭 李얘린:', {
                                    modalOverlay: !!modalOverlay,
                                    parseResult: !!currentParseResult,
                                    parsedData: !!currentParsedData
                                    });

                                    if (currentParseResult && currentParsedData) {
                                    console.log('?뚯떛 寃곌낵 ?쒖떆 ?곸뿭 李얠쓬, 寃곌낵 ?쒖떆 以?..');
                                    currentParseResult.style.display = 'block';
                                    currentParseResult.style.marginBottom = '20px';

                                    const totalAmount = result.summary?.totalAmount || 0;
                                    const finalAmount = result.summary?.finalAmount || totalAmount;
                                    const discount = result.summary?.discount || 0;
                                    const billingStart = result.summary?.billingPeriod?.start || '';
                                    const billingEnd = result.summary?.billingPeriod?.end || '';
                                    const paymentDate = result.summary?.paymentDate || '';

                                    currentParsedData.innerHTML = `
                                    <div
                                      style="font-weight: 600; font-size: 1rem; margin-bottom: 12px; color: #0C4A6E;">?뱤
                                      ?뚯떛 寃곌낵</div>
                                    <div style="margin-bottom: 8px;"><strong>移대뱶??</strong> ${result.cardCompany || '????
                                      ?놁쓬'}</div>
                                    <div style="margin-bottom: 8px;"><strong>嫄곕옒 嫄댁닔:</strong> ${result.totalCount || 0}嫄?
                                    </div>
                                    <div style="margin-bottom: 8px;"><strong>珥??댁슜湲덉븸:</strong>
                                      ${totalAmount.toLocaleString()}??/div>
                                    ${discount > 0 ? `<div style="margin-bottom: 8px;"><strong>?좎씤/?곷┰:</strong>
                                      ${discount.toLocaleString()}??/div>` : ''}
                                    <div style="margin-bottom: 8px; font-weight: 600; color: #DC2626;"><strong>泥?뎄
                                        湲덉븸:</strong> ${finalAmount.toLocaleString()}??/div>
                                    ${billingStart ? `<div style="margin-bottom: 8px;"><strong>泥?뎄 湲곌컙:</strong>
                                      ${billingStart} ~ ${billingEnd || ''}</div>` : ''}
                                    ${paymentDate ? `<div style="margin-bottom: 8px;"><strong>寃곗젣??</strong>
                                      ${paymentDate}</div>` : ''}
                                    `;
                                    console.log('?뚯떛 寃곌낵 ?쒖떆 ?꾨즺');
                                    } else {
                                    console.error('?뚯떛 寃곌낵 ?쒖떆 ?곸뿭??李얠쓣 ???놁뒿?덈떎:', {
                                    modalOverlay: !!modalOverlay,
                                    parseResult: !!currentParseResult,
                                    parsedData: !!currentParsedData
                                    });
                                    // ?泥?諛⑸쾿: alert濡?寃곌낵 ?쒖떆
                                    alert(`?뚯떛 ?꾨즺!\n\n移대뱶?? ${result.cardCompany}\n嫄곕옒 嫄댁닔: ${result.totalCount}嫄?n泥?뎄 湲덉븸:
                                    ${finalAmount.toLocaleString()}??);
                                    }

                                    // ?쇱뿉 ?먮룞 ?낅젰
                                    // 1. 移대뱶 ?좏깮 - accountData?먯꽌 紐⑤뱺 移대뱶 媛?몄삤湲?
                                    const cardSelect = document.getElementById('account-transaction-card-select');
                                    if (cardSelect) {
                                    console.log('移대뱶 ?좏깮 ?쒕∼?ㅼ슫 李얠쓬, accountData ?뺤씤:', typeof accountData !== 'undefined' ?
                                    accountData.length : 'undefined');

                                    // 癒쇱? 紐⑤뱺 移대뱶瑜??쒕∼?ㅼ슫??梨꾩슦湲?
                                    cardSelect.innerHTML = '<option value="">--?좏깮--</option>';

                                    // accountData?먯꽌 紐⑤뱺 移대뱶 ???怨꾩쥖 媛?몄삤湲?
                                    const allCards = typeof accountData !== 'undefined' && Array.isArray(accountData)
                                    ? accountData.filter(acc => acc.type === 'card')
                                    : [];

                                    console.log('accountData?먯꽌 李얠? 移대뱶 媛쒖닔:', allCards.length);

                                    // 紐⑤뱺 移대뱶 異붽?
                                    allCards.forEach(card => {
                                    const option = document.createElement('option');
                                    option.value = card.name;
                                    option.textContent = card.name;
                                    cardSelect.appendChild(option);
                                    });

                                    // cardData?먯꽌??異붽? (accountData???녿뒗 寃쎌슦)
                                    if (typeof cardData !== 'undefined' && Array.isArray(cardData)) {
                                    cardData.forEach(card => {
                                    // 以묐났 泥댄겕
                                    const existingOption = Array.from(cardSelect.options).find(opt => opt.value ===
                                    card.name);
                                    if (!existingOption) {
                                    const option = document.createElement('option');
                                    option.value = card.name;
                                    option.textContent = card.name;
                                    cardSelect.appendChild(option);
                                    }
                                    });
                                    }

                                    console.log('珥?移대뱶 ?듭뀡 媛쒖닔:', cardSelect.options.length - 1);

                                    // ?뚯떛??移대뱶?ъ? ?쇱튂?섎뒗 移대뱶 ?먮룞 ?좏깮
                                    if (result.cardCompany && allCards.length > 0) {
                                    const matchingCard = allCards.find(card => card.cardCompany === result.cardCompany);
                                    if (matchingCard) {
                                    cardSelect.value = matchingCard.name;
                                    console.log('移대뱶 ?먮룞 ?좏깮:', matchingCard.name);
                                    // 移대뱶 ?좏깮 ?대깽???몃━嫄고븯??寃곗젣 怨꾩쥖 ?먮룞 ?ㅼ젙
                                    cardSelect.dispatchEvent(new Event('change'));
                                    } else {
                                    // 移대뱶?щ뒗 ?쇱튂?섏? ?딆?留?泥?踰덉㎏ 移대뱶 ?좏깮
                                    if (allCards.length > 0) {
                                    cardSelect.value = allCards[0].name;
                                    cardSelect.dispatchEvent(new Event('change'));
                                    }
                                    }
                                    } else if (allCards.length > 0) {
                                    // 移대뱶???뺣낫媛 ?놁쑝硫?泥?踰덉㎏ 移대뱶 ?좏깮
                                    cardSelect.value = allCards[0].name;
                                    cardSelect.dispatchEvent(new Event('change'));
                                    }
                                    } else {
                                    console.error('移대뱶 ?좏깮 ?쒕∼?ㅼ슫??李얠쓣 ???놁뒿?덈떎');
                                    }

                                    // 2. ?좎쭨 ?ㅼ젙 (寃곗젣???먮뒗 泥?뎄 湲곌컙 醫낅즺??
                                    const dateInput = document.getElementById('account-transaction-card-date');
                                    if (dateInput) {
                                    if (result.summary.paymentDate) {
                                    dateInput.value = result.summary.paymentDate;
                                    } else if (result.summary.billingPeriod.end) {
                                    dateInput.value = result.summary.billingPeriod.end;
                                    }
                                    }

                                    // 3. 湲덉븸 ?ㅼ젙
                                    const amountInput = document.getElementById('account-transaction-card-amount');
                                    if (amountInput && result.summary.finalAmount) {
                                    amountInput.value = result.summary.finalAmount.toLocaleString();
                                    }

                                    } catch (error) {
                                    console.error('?뚯떛 ?ㅻ쪟:', error);
                                    console.error('?먮윭 ?ㅽ깮:', error.stack);

                                    if (fileInfo) {
                                    fileInfo.textContent = '???뚯씪 ?뚯떛 ?ㅽ뙣: ' + error.message;
                                    }

                                    // ?먮윭 諛쒖깮 ?쒖뿉???뚯떛 寃곌낵 ?곸뿭???먮윭 硫붿떆吏 ?쒖떆
                                    const currentParseResult =
                                    document.getElementById('account-transaction-parse-result');
                                    const currentParsedData =
                                    document.getElementById('account-transaction-parsed-data');

                                    if (currentParseResult && currentParsedData) {
                                    currentParseResult.style.display = 'block';
                                    currentParsedData.innerHTML = `
                                    <div style="color: #DC2626; font-weight: 600; margin-bottom: 8px;">???뚯떛 ?ㅻ쪟</div>
                                    <div style="margin-bottom: 8px;">?뚯씪???쎌쓣 ???놁뒿?덈떎.</div>
                                    <div style="font-size: 0.85rem; color: #6B7280;">?ㅻ쪟: ${error.message}</div>
                                    `;
                                    }

                                    alert('?뚯씪???쎌쓣 ???놁뒿?덈떎. ?묒? ?뚯씪 ?뺤떇???뺤씤?댁＜?몄슂.\n\n?ㅻ쪟: ' + error.message);
                                    }
                                    }
                                    });

                                    // ???꾪솚 湲곕뒫 (紐⑤떖 ?대? ???꾪솚) - 媛쒖꽑??踰꾩쟾
                                    document.addEventListener('click', function(e) {
                                    // 紐⑤떖 ?대???entry-tab-btn ?대┃ 泥섎━
                                    if (e.target.classList.contains('entry-tab-btn') ||
                                    e.target.closest('.entry-tab-btn')) {
                                    const tabBtn = e.target.classList.contains('entry-tab-btn') ? e.target :
                                    e.target.closest('.entry-tab-btn');
                                    if (!tabBtn) {
                                    console.warn('??踰꾪듉??李얠쓣 ???놁뒿?덈떎.');
                                    return;
                                    }

                                    const tabName = tabBtn.getAttribute('data-tab');
                                    if (!tabName) {
                                    console.warn('???대쫫(data-tab)??李얠쓣 ???놁뒿?덈떎.');
                                    return;
                                    }

                                    console.log('??踰꾪듉 ?대┃:', tabName);

                                    // ?대떦 紐⑤떖 ?ㅻ쾭?덉씠 李얘린
                                    const modalOverlay = tabBtn.closest('#modal-overlay') ||
                                    tabBtn.closest('#account-transaction-modal-overlay');
                                    if (!modalOverlay) {
                                    console.warn('紐⑤떖 ?ㅻ쾭?덉씠瑜?李얠쓣 ???놁뒿?덈떎.');
                                    return;
                                    }

                                    // ?대떦 紐⑤떖 ?댁쓽 ??踰꾪듉怨?肄섑뀗痢좊쭔 泥섎━
                                    const tabButtons = modalOverlay.querySelectorAll('.entry-tab-btn');
                                    const tabContents = modalOverlay.querySelectorAll('.entry-tab-content');

                                    console.log('??踰꾪듉 媛쒖닔:', tabButtons.length, '??肄섑뀗痢?媛쒖닔:', tabContents.length);

                                    // 紐⑤뱺 ??踰꾪듉怨?肄섑뀗痢좎뿉??active ?대옒???쒓굅 諛??ㅽ???珥덇린??
                                    tabButtons.forEach(btn => {
                                    btn.classList.remove('active');
                                    btn.style.color = '#6B7280';
                                    btn.style.fontWeight = '500';
                                    btn.style.borderBottomColor = 'transparent';
                                    btn.style.borderBottom = '2px solid transparent';
                                    });
                                    tabContents.forEach(content => {
                                    content.classList.remove('active');
                                    content.style.display = 'none';
                                    });

                                    // ?좏깮?????쒖꽦??
                                    tabBtn.classList.add('active');
                                    tabBtn.style.color = '#EF4444';
                                    tabBtn.style.fontWeight = '600';
                                    tabBtn.style.borderBottomColor = '#EF4444';
                                    tabBtn.style.borderBottom = '2px solid #EF4444';

                                    // ??肄섑뀗痢?李얘린 (?щ윭 媛?ν븳 ID ?⑦꽩 ?쒕룄)
                                    let targetContent = modalOverlay.querySelector(`#entry-tab-${tabName}`);
                                    if (!targetContent) {
                                    targetContent = modalOverlay.querySelector(`#account-transaction-tab-${tabName}`);
                                    }

                                    if (targetContent) {
                                    targetContent.classList.add('active');
                                    targetContent.style.display = 'block';
                                    console.log('???꾪솚 ?깃났:', tabName, '肄섑뀗痢??쒖떆??);
                                    } else {
                                    console.error('??肄섑뀗痢좊? 李얠쓣 ???놁뒿?덈떎:', `entry-tab-${tabName} ?먮뒗
                                    account-transaction-tab-${tabName}`);
                                    // ?붾쾭源? 紐⑤뱺 entry-tab-content ?붿냼 異쒕젰
                                    const allTabContents = modalOverlay.querySelectorAll('.entry-tab-content');
                                    console.log('紐⑤떖 ??紐⑤뱺 ??肄섑뀗痢?', Array.from(allTabContents).map(c => c.id));
                                    }
                                    }

                                    // ?먮룞 ?낅젰 ??쓽 痍⑥냼 踰꾪듉
                                    if (e.target.id === 'modal-cancel-btn-auto') {
                                    const modalOverlay = document.getElementById('modal-overlay');
                                    if (modalOverlay) {
                                    modalOverlay.style.display = 'none';
                                    document.body.style.overflow = '';
                                    }
                                    }
                                    });

                                    // 泥댄겕諛뺤뒪 ?쇨큵 ?좏깮/??젣 湲곕뒫
                                    document.addEventListener('change', function(e) {
                                    // ?꾩껜 ?좏깮 泥댄겕諛뺤뒪
                                    if (e.target.id === 'select-all-checkbox') {
                                    const checkboxes = document.querySelectorAll('.row-checkbox');
                                    checkboxes.forEach(cb => cb.checked = e.target.checked);
                                    updateDeleteButton();
                                    } else if (e.target.id === 'select-all-card-checkbox') {
                                    const checkboxes = document.querySelectorAll('.row-checkbox-card');
                                    checkboxes.forEach(cb => cb.checked = e.target.checked);
                                    updateDeleteButton('card');
                                    } else if (e.target.id === 'select-all-account-checkbox') {
                                    const checkboxes = document.querySelectorAll('.row-checkbox-account');
                                    checkboxes.forEach(cb => cb.checked = e.target.checked);
                                    updateDeleteButton('account');
                                    } else if (e.target.classList.contains('row-checkbox') ||
                                    e.target.classList.contains('row-checkbox-card') ||
                                    e.target.classList.contains('row-checkbox-account')) {
                                    updateDeleteButton();
                                    }
                                    });

                                    // ?꾩껜 ?좏깮 踰꾪듉
                                    document.addEventListener('click', function(e) {
                                    if (e.target.id === 'select-all-btn') {
                                    const checkboxes = document.querySelectorAll('.row-checkbox, .row-checkbox-card,
                                    .row-checkbox-account');
                                    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
                                    checkboxes.forEach(cb => cb.checked = !allChecked);
                                    document.querySelectorAll('#select-all-checkbox, #select-all-card-checkbox,
                                    #select-all-account-checkbox').forEach(cb => {
                                    if (cb) cb.checked = !allChecked;
                                    });
                                    updateDeleteButton();
                                    } else if (e.target.id === 'delete-selected-btn') {
                                    deleteSelectedTransactions();
                                    }
                                    });

                                    function updateDeleteButton(type = 'all') {
                                    let checkboxes;
                                    if (type === 'card') {
                                    checkboxes = document.querySelectorAll('.row-checkbox-card:checked');
                                    } else if (type === 'account') {
                                    checkboxes = document.querySelectorAll('.row-checkbox-account:checked');
                                    } else {
                                    checkboxes = document.querySelectorAll('.row-checkbox:checked,
                                    .row-checkbox-card:checked, .row-checkbox-account:checked');
                                    }

                                    const deleteBtn = document.getElementById('delete-selected-btn');
                                    if (deleteBtn) {
                                    if (checkboxes.length > 0) {
                                    deleteBtn.style.display = 'inline-block';
                                    deleteBtn.textContent = `?좏깮 ??젣 (${checkboxes.length})`;
                                    } else {
                                    deleteBtn.style.display = 'none';
                                    }
                                    }
                                    }

                                    function deleteSelectedTransactions() {
                                    const checkboxes = document.querySelectorAll('.row-checkbox:checked,
                                    .row-checkbox-card:checked, .row-checkbox-account:checked');
                                    if (checkboxes.length === 0) {
                                    alert('??젣????ぉ???좏깮?댁＜?몄슂.');
                                    return;
                                    }

                                    if (!confirm(`?좏깮??${checkboxes.length}媛쒖쓽 ??ぉ????젣?섏떆寃좎뒿?덇퉴?`)) {
                                    return;
                                    }

                                    const idsToDelete = Array.from(checkboxes).map(cb =>
                                    parseFloat(cb.getAttribute('data-id')));
                                    idsToDelete.forEach(id => {
                                    const index = transactionData.findIndex(t => t.id === id);
                                    if (index !== -1) {
                                    transactionData.splice(index, 1);
                                    }
                                    });


                                    saveData();
                                    renderTable();
                                    renderCardTable('all');
                                    renderBankTable();
                                    updateDashboard();

                                    // 泥댄겕諛뺤뒪 珥덇린??
                                    document.querySelectorAll('.row-checkbox, .row-checkbox-card,
                                    .row-checkbox-account').forEach(cb => cb.checked = false);
                                    document.querySelectorAll('#select-all-checkbox, #select-all-card-checkbox,
                                    #select-all-account-checkbox').forEach(cb => {
                                    if (cb) cb.checked = false;
                                    });
                                    updateDeleteButton();

                                    alert(`${idsToDelete.length}媛쒖쓽 ??ぉ????젣?섏뿀?듬땲??`);
                                    }

                                    // 珥덇린 ?뚮뜑留?
                                    updateMerchantHistorySelect();
                                    renderTable();
                                    renderCardTable('all');
                                    renderBankTable();
                                    updateDashboard();

                                    }); // DOMContentLoaded ?대깽??由ъ뒪???リ린

