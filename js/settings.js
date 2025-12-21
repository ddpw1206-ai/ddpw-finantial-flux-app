
// ========================================
// 항목관리 모달 로직 (Settings Logic)
// ========================================

window.initSettingsModal = function () {
  console.log('initSettingsModal 호출됨');

  // 데이터 초기화 확인
  if (window.DataManager) {
    window.DataManager.loadConfig();
  }

  // 모달 열릴 때 렌더링하도록 이벤트 리스너 등록 (Bootstrap 5)
  // index.html에서 data-bs-toggle="modal"로 열므로, show.bs.modal 이벤트 사용
  const settingsModalEl = document.getElementById('settingsModal');
  if (settingsModalEl) {
    settingsModalEl.addEventListener('show.bs.modal', function () {
      console.log('항목관리 모달 열림 - 렌더링 시작');
      renderPaymentMethods();
      renderAccounts();
      renderCategories();
    });
  } else {
    // 이미 모달이 DOM에 없을 수도 있으므로 (동적 로드 등), 
    // 그냥 호출 시점에도 한 번 렌더링 시도
    // (주의: 모달 HTML이 로드된 후에 호출되어야 함)
    renderPaymentMethods();
    renderAccounts();
    renderCategories();
  }
};

// =====================
// 1. 결제수단 렌더링
// =====================
function renderPaymentMethods() {
  const config = window.DataManager.loadConfig();
  if (!config) return;

  const renderList = (elementId, list, type) => {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.innerHTML = '';
    list.forEach(item => {
      const div = document.createElement('div');
      div.className = 'list-group-item d-flex justify-content-between align-items-center p-2';
      div.innerHTML = `
                <span>${item}</span>
                <button class="btn btn-sm btn-outline-danger py-0 px-2" onclick="window.removePaymentMethodItem('${type}', '${item}')">×</button>
            `;
      el.appendChild(div);
    });
  };

  if (config.paymentMethods.creditCards) renderList('credit-card-list', config.paymentMethods.creditCards, 'creditCards');
  if (config.paymentMethods.checkCards) renderList('check-card-list', config.paymentMethods.checkCards, 'checkCards');
  if (config.paymentMethods.accounts) renderList('account-payment-list', config.paymentMethods.accounts, 'accounts');
  if (config.paymentMethods.etc) renderList('etc-payment-list', config.paymentMethods.etc, 'etc');
}

window.addPaymentMethod = function (type) {
  let inputId = '';
  if (type === 'creditCards') inputId = 'new-credit-card';
  else if (type === 'checkCards') inputId = 'new-check-card';
  else if (type === 'accounts') inputId = 'new-account-payment';
  else if (type === 'etc') inputId = 'new-etc-payment';

  const input = document.getElementById(inputId);
  if (!input || !input.value.trim()) {
    alert('값을 입력하세요.');
    return;
  }

  if (window.DataManager.addPaymentMethod(type, input.value.trim())) {
    renderPaymentMethods();
    input.value = '';
  }
};

window.removePaymentMethodItem = function (type, value) {
  if (confirm(`'${value}'을(를) 삭제하시겠습니까?`)) {
    if (window.DataManager.removePaymentMethod(type, value)) {
      renderPaymentMethods();
    }
  }
};

// =====================
// 2. 계좌정보 렌더링
// =====================
function renderAccounts() {
  const config = window.DataManager.loadConfig();
  if (!config || !config.accountDetails) return;

  const tbody = document.getElementById('account-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  config.accountDetails.forEach(acc => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
            <td>${acc.no || '-'}</td>
            <td>${acc.accountNo || '-'}</td>
            <td>${acc.name || '-'}</td>
            <td>${acc.bank || '-'}</td>
            <td>${acc.note || '-'}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="window.editAccountInfo(${acc.no})">수정</button>
                <button class="btn btn-sm btn-outline-danger" onclick="window.deleteAccountInfo(${acc.no})">삭제</button>
            </td>
        `;
    tbody.appendChild(tr);
  });
}

window.openAddAccountForm = function () {
  // 임시: 간단한 prompt로 구현 (추후 모달 내 폼으로 고도화 가능)
  const name = prompt('계좌명 입력:');
  if (!name) return;
  const bank = prompt('은행명 입력:');
  const accountNo = prompt('계좌번호 입력:');
  const note = prompt('비고:');

  window.DataManager.addAccount({
    name, bank, accountNo, note
  });
  renderAccounts();
};

window.editAccountInfo = function (no) {
  // 임시: prompt 수정 (실제로는 상세 폼 필요)
  alert('계좌 수정 기능은 상세 모달 구현 시 제공됩니다.\n현재는 삭제 후 다시 추가해주세요.');
};

window.deleteAccountInfo = function (no) {
  if (confirm('정말 이 계좌 정보를 삭제하시겠습니까?')) {
    window.DataManager.removeAccount(no);
    renderAccounts();
  }
};

// =====================
// 3. 카테고리 렌더링
// =====================
function renderCategories() {
  const config = window.DataManager.loadConfig();
  if (!config) return;

  // 수입 렌더링
  const incomeSelect = document.getElementById('income-main-category');
  const incomeListEl = document.getElementById('income-category-list');

  if (incomeSelect && incomeListEl) {
    // 대분류 옵션 (기존 선택 값 유지 필요 시 로직 추가)
    const currentVal = incomeSelect.value;
    incomeSelect.innerHTML = '<option value="">대분류 선택</option>';
    Object.keys(config.incomeCategories).forEach(key => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = key;
      incomeSelect.appendChild(option);
    });
    if (currentVal) incomeSelect.value = currentVal;

    // 리스트 표시
    incomeListEl.innerHTML = '';
    Object.entries(config.incomeCategories).forEach(([main, subs]) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'mb-3';

      // 대분류 제목
      const title = document.createElement('h6');
      title.className = 'fw-bold text-dark border-bottom pb-1';
      title.textContent = main;
      wrapper.appendChild(title);

      // 소분류 배지들
      const badgeContainer = document.createElement('div');
      badgeContainer.className = 'd-flex flex-wrap gap-2';

      subs.forEach(sub => {
        const badge = document.createElement('span');
        badge.className = 'badge bg-secondary d-flex align-items-center gap-1';
        badge.innerHTML = `
                    ${sub}
                    <i class="ms-1" style="cursor:pointer;" onclick="window.removeIncomeSubCategory('${main}', '${sub}')">&times;</i>
                `;
        badgeContainer.appendChild(badge);
      });
      wrapper.appendChild(badgeContainer);
      incomeListEl.appendChild(wrapper);
    });
  }

  // 지출 렌더링
  const expenseSelect = document.getElementById('expense-main-category');
  const expenseListEl = document.getElementById('expense-category-list');

  if (expenseSelect && expenseListEl) {
    const currentVal = expenseSelect.value;
    expenseSelect.innerHTML = '<option value="">대분류 선택</option>';
    Object.keys(config.expenseCategories).forEach(key => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = key;
      expenseSelect.appendChild(option);
    });
    if (currentVal) expenseSelect.value = currentVal;

    expenseListEl.innerHTML = '';
    Object.entries(config.expenseCategories).forEach(([main, subs]) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'mb-3';

      const title = document.createElement('h6');
      title.className = 'fw-bold text-dark border-bottom pb-1';
      title.textContent = main;
      wrapper.appendChild(title);

      const badgeContainer = document.createElement('div');
      badgeContainer.className = 'd-flex flex-wrap gap-2';

      subs.forEach(sub => {
        const badge = document.createElement('span');
        badge.className = 'badge bg-danger bg-opacity-75 d-flex align-items-center gap-1';
        badge.innerHTML = `
                    ${sub}
                    <i class="ms-1 text-white" style="cursor:pointer;" onclick="window.removeExpenseSubCategory('${main}', '${sub}')">&times;</i>
                `;
        badgeContainer.appendChild(badge);
      });
      wrapper.appendChild(badgeContainer);
      expenseListEl.appendChild(wrapper);
    });
  }
}

window.addIncomeSubCategory = function () {
  const mainSelect = document.getElementById('income-main-category');
  const input = document.getElementById('new-income-sub');

  if (!mainSelect.value) { alert('대분류를 선택하세요.'); return; }
  if (!input.value.trim()) { alert('소분류를 입력하세요.'); return; }

  if (window.DataManager.addCategory('income', mainSelect.value, input.value.trim())) {
    renderCategories();
    input.value = '';
  }
};

window.removeIncomeSubCategory = function (main, sub) {
  if (confirm(`'${main} > ${sub}' 카테고리를 삭제하시겠습니까?`)) {
    if (window.DataManager.removeCategory('income', main, sub)) {
      renderCategories();
    }
  }
};

window.addExpenseSubCategory = function () {
  const mainSelect = document.getElementById('expense-main-category');
  const input = document.getElementById('new-expense-sub');

  if (!mainSelect.value) { alert('대분류를 선택하세요.'); return; }
  if (!input.value.trim()) { alert('소분류를 입력하세요.'); return; }

  if (window.DataManager.addCategory('expense', mainSelect.value, input.value.trim())) {
    renderCategories();
    input.value = '';
  }
};

window.removeExpenseSubCategory = function (main, sub) {
  if (confirm(`'${main} > ${sub}' 카테고리를 삭제하시겠습니까?`)) {
    if (window.DataManager.removeCategory('expense', main, sub)) {
      renderCategories();
    }
  }
};

console.log('settings.js 로드 완료');
