// ========================================
// 모달 관련 함수 (Refactored for Dynamic Loading)
// ========================================

// 모달 DOM 요소 참조 (let으로 변경하여 동적 할당 지원)
let modalOverlay, modalClose, modalCancel, form, modalTitle;
let methodSelect, paymentCredit, paymentDebit, paymentTransfer, paymentCash;

// ========================================
// 0. 초기화 함수 (모달 로더에서 호출)
// ========================================
window.initMonthlyEntryModal = function () {
  console.log('initMonthlyEntryModal 호출됨');

  // DOM 요소 할당
  modalOverlay = document.getElementById('modal-overlay');
  modalClose = document.getElementById('modal-close-btn');
  modalCancel = document.getElementById('modal-cancel-btn');
  form = document.getElementById('entry-form');
  modalTitle = document.querySelector('.modal-title');
  methodSelect = document.getElementById('entry-method');
  paymentCredit = document.getElementById('payment-credit');
  paymentDebit = document.getElementById('payment-debit');
  paymentTransfer = document.getElementById('payment-transfer');
  paymentCash = document.getElementById('payment-cash');

  // 이벤트 리스너 등록
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalCancel) modalCancel.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // ESC 키 이벤트 (전역) - 중복 방지 필요하지만 간단하게 유지
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.style.display === 'flex') {
      closeModal();
    }
  });

  // 폼 제출 이벤트
  if (form) {
    form.addEventListener('submit', handleEntryFormSubmit);

    // 구분 라디오 버튼 이벤트
    const typeRadios = form.querySelectorAll('input[name="type"]');
    typeRadios.forEach(radio => {
      radio.addEventListener('change', updateCategoryOptions);
    });

    // 카테고리 선택 이벤트
    const categorySelect = document.getElementById('entry-category-kind');
    if (categorySelect) {
      categorySelect.addEventListener('change', updateItemOptions);
    }

    // 결제수단 변경 이벤트
    if (methodSelect) {
      methodSelect.addEventListener('change', updatePaymentFields);
    }

    // 금액 입력 포맷팅
    const amountInput = document.getElementById('entry-amount');
    if (amountInput) {
      amountInput.addEventListener('input', function (e) {
        const value = e.target.value;
        const numbers = removeCommas(value);
        const formatted = formatNumberWithCommas(numbers);
        e.target.value = formatted;
      });
      amountInput.addEventListener('blur', function (e) {
        const value = e.target.value;
        if (value) e.target.value = formatNumberWithCommas(removeCommas(value));
      });
    }
  }

  console.log('MonthlyEntryModal 초기화 완료');
};

// ========================================
// 모달 열기/닫기 함수 (전역으로 노출)
// ========================================
window.closeModal = function () {
  if (modalOverlay) {
    modalOverlay.style.display = 'none';
    document.body.style.overflow = '';
    editingId = null;
    // 모달 제목 초기화
    if (modalTitle) {
      modalTitle.textContent = '📝 내역 입력';
    }
    // 폼 초기화
    if (form) {
      form.reset();
      // 현재 날짜로 설정
      const today = new Date();
      const dateInput = document.getElementById('entry-date');
      if (dateInput) {
        dateInput.value = today.toISOString().split('T')[0];
      }
      // 항목 드롭다운 초기화
      if (typeof window.updateItemOptions === 'function') {
        window.updateItemOptions();
      }
      // 결제수단 필드 초기화
      if (methodSelect && typeof window.updatePaymentFields === 'function') {
        window.updatePaymentFields();
      }
    }
  }
}

window.openModal = function (isEdit = false) {
  if (modalOverlay) {
    modalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // 탭 초기화 (수동 입력 탭 활성화)
    const tabButtons = modalOverlay.querySelectorAll('.entry-tab-btn');
    const tabContents = modalOverlay.querySelectorAll('.entry-tab-content');

    // 모든 탭 버튼과 콘텐츠 초기화
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

    // 수동 입력 탭 활성화
    const manualTabBtn = modalOverlay.querySelector('.entry-tab-btn[data-tab="manual"]');
    const manualTabContent = document.getElementById('entry-tab-manual');
    const autoTabContent = document.getElementById('entry-tab-auto');

    if (manualTabBtn) {
      manualTabBtn.classList.add('active');
      manualTabBtn.style.color = '#EF4444';
      manualTabBtn.style.fontWeight = '600';
      manualTabBtn.style.borderBottomColor = '#EF4444';
      manualTabBtn.style.borderBottom = '2px solid #EF4444';
    }
    if (manualTabContent) {
      manualTabContent.classList.add('active');
      manualTabContent.style.display = 'block';
    }
    if (autoTabContent) {
      autoTabContent.classList.remove('active');
      autoTabContent.style.display = 'none';
    }

    if (!isEdit && form) {
      // 신규 입력 모드: 폼 초기화
      form.reset();
      const today = new Date();
      const dateInput = document.getElementById('entry-date');
      if (dateInput) {
        dateInput.value = today.toISOString().split('T')[0];
      }
      // 항목 드롭다운 초기화
      if (typeof window.updateItemOptions === 'function') {
        window.updateItemOptions();
      }
      // 결제수단 옵션 업데이트 (최신 cardData 반영)
      if (typeof window.updatePaymentOptions === 'function') {
        window.updatePaymentOptions();
      }
      if (methodSelect && typeof window.updatePaymentFields === 'function') {
        window.updatePaymentFields();
      }
      if (modalTitle) {
        modalTitle.textContent = '📝 내역 입력';
      }
    }

    console.log('모달 열림 - 탭 초기화 완료');
  }
}

// 모달 닫기 이벤트
if (modalClose) {
  modalClose.addEventListener('click', closeModal);
}

if (modalCancel) {
  modalCancel.addEventListener('click', closeModal);
}

if (modalOverlay) {
  modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) {
      if (typeof window.closeModal === 'function') {
        window.closeModal();
      }
    }
  });
}

window.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && modalOverlay && modalOverlay.style.display === 'flex') {
    if (typeof window.closeModal === 'function') {
      window.closeModal();
    }
  }
});

// ========================================
// 카테고리 업데이트 함수 (전역으로 노출)
// ========================================
window.updateCategoryOptions = function () {
  const form = document.getElementById('entry-form');
  const typeRadios = form ? form.querySelectorAll('input[name="type"]') : document.querySelectorAll('input[name="type"]');
  const categorySelect = document.getElementById('entry-category-kind');
  const itemSelect = document.getElementById('entry-category-item');

  if (!typeRadios || !categorySelect || !itemSelect) {
    console.warn('updateCategoryOptions: 필수 요소를 찾을 수 없습니다.');
    return;
  }

  const selectedType = Array.from(typeRadios).find(radio => radio.checked)?.value;

  if (!selectedType) {
    console.warn('updateCategoryOptions: 선택된 구분이 없습니다.');
    return;
  }

  // 카테고리 드롭다운 초기화
  categorySelect.innerHTML = '<option value="">--선택--</option>';
  // 항목 드롭다운도 초기화
  itemSelect.innerHTML = '<option value="">카테고리를 먼저 선택하세요</option>';

  // 카테고리 데이터 접근 (전역 또는 window 객체에서)
  const expenseItems = window.expenseCategoryItems || expenseCategoryItems || (typeof expenseCategoryItems !== 'undefined' ? expenseCategoryItems : null);
  const incomeItems = window.incomeCategoryItems || incomeCategoryItems || (typeof incomeCategoryItems !== 'undefined' ? incomeCategoryItems : null);

  if (selectedType === 'expense') {
    // 지출용 카테고리 추가
    if (expenseItems && typeof expenseItems === 'object') {
      Object.keys(expenseItems).forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
      });
    } else {
      console.error('expenseCategoryItems를 찾을 수 없습니다.');
    }
  } else if (selectedType === 'income') {
    // 수입용 카테고리 추가
    if (incomeItems && typeof incomeItems === 'object') {
      Object.keys(incomeItems).forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
      });
    } else {
      console.error('incomeCategoryItems를 찾을 수 없습니다.');
    }
  }
}

// 카테고리 선택 시 항목 드롭다운 업데이트 (전역으로 노출)
window.updateItemOptions = function () {
  const form = document.getElementById('entry-form');
  const typeRadios = form ? form.querySelectorAll('input[name="type"]') : document.querySelectorAll('input[name="type"]');
  const categorySelect = document.getElementById('entry-category-kind');
  const itemSelect = document.getElementById('entry-category-item');

  if (!typeRadios || !categorySelect || !itemSelect) {
    console.warn('updateItemOptions: 필수 요소를 찾을 수 없습니다.');
    return;
  }

  const selectedType = Array.from(typeRadios).find(radio => radio.checked)?.value;
  const selectedCategory = categorySelect.value;

  if (!selectedType) {
    console.warn('updateItemOptions: 선택된 구분이 없습니다.');
    return;
  }

  // 항목 드롭다운 초기화
  itemSelect.innerHTML = '<option value="">--선택--</option>';

  // 카테고리 데이터 접근 (전역 또는 window 객체에서)
  const expenseItems = window.expenseCategoryItems || expenseCategoryItems || (typeof expenseCategoryItems !== 'undefined' ? expenseCategoryItems : null);
  const incomeItems = window.incomeCategoryItems || incomeCategoryItems || (typeof incomeCategoryItems !== 'undefined' ? incomeCategoryItems : null);

  let categoryItems = {};
  if (selectedType === 'expense') {
    categoryItems = expenseItems || {};
  } else if (selectedType === 'income') {
    categoryItems = incomeItems || {};
  }

  if (selectedCategory && categoryItems && categoryItems[selectedCategory] && Array.isArray(categoryItems[selectedCategory])) {
    // 선택된 카테고리에 해당하는 항목들 추가
    categoryItems[selectedCategory].forEach(item => {
      const option = document.createElement('option');
      option.value = item;
      option.textContent = item;
      itemSelect.appendChild(option);
    });
  } else {
    itemSelect.innerHTML = '<option value="">카테고리를 먼저 선택하세요</option>';
  }
}

// 구분 라디오 버튼 이벤트 리스너
if (form) {
  const typeRadios = form.querySelectorAll('input[name="type"]');
  if (typeRadios && typeRadios.length > 0) {
    typeRadios.forEach(radio => {
      radio.addEventListener('change', function () {
        if (typeof window.updateCategoryOptions === 'function') {
          window.updateCategoryOptions();
        }
      });
    });
  }
}

// 카테고리 선택 이벤트 리스너
const categorySelect = document.getElementById('entry-category-kind');
if (categorySelect) {
  categorySelect.addEventListener('change', function () {
    if (typeof window.updateItemOptions === 'function') {
      window.updateItemOptions();
    }
  });
}

// ========================================
// 카드 드롭다운 매핑 데이터 (전역 변수)
// ========================================
// cardData에서 동적으로 생성하되, 기본 매핑 구조 유지
let CREDIT_CARD_MAP = {};
let DEBIT_CARD_MAP = {};

// cardData 기반으로 매핑 데이터 초기화
function initCardMaps() {
  CREDIT_CARD_MAP = {};
  DEBIT_CARD_MAP = {};

  // cardData에서 신용카드 추출
  if (typeof cardData !== 'undefined' && Array.isArray(cardData)) {
    cardData.filter(c => c.type === 'credit').forEach(card => {
      const company = card.cardCompany || '기타';
      if (!CREDIT_CARD_MAP[company]) {
        CREDIT_CARD_MAP[company] = [];
      }
      CREDIT_CARD_MAP[company].push(card.name);
    });
  }

  // accountData에서 체크카드 추출 (type이 'card'이고 creditLimit이 없는 경우)
  if (typeof accountData !== 'undefined' && Array.isArray(accountData)) {
    accountData.filter(acc => acc.type === 'card' && !acc.creditLimit).forEach(account => {
      // 은행명 추출 (account.name에서 추출하거나 별도 필드 사용)
      const bankName = account.bankName || account.name.split(' ')[0] || '기타';
      if (!DEBIT_CARD_MAP[bankName]) {
        DEBIT_CARD_MAP[bankName] = [];
      }
      DEBIT_CARD_MAP[bankName].push(account.name);
    });
  }
}

// ========================================
// 결제수단별 하위 옵션 표시 및 업데이트 (전역으로 노출)
// ========================================
window.updatePaymentOptions = function () {
  console.log('결제수단 옵션 업데이트 시작');

  // cardData와 accountData 최신 상태 확인
  const currentCardData = typeof cardData !== 'undefined' && Array.isArray(cardData) ? cardData : [];
  const currentAccountData = typeof accountData !== 'undefined' && Array.isArray(accountData) ? accountData : [];

  console.log('현재 cardData 개수:', currentCardData.length);
  console.log('현재 accountData 개수:', currentAccountData.length);

  // 신용카드 옵션 업데이트
  const creditSelect = document.getElementById('credit-card-select') || document.querySelector('select[name="credit-card"]');
  if (creditSelect) {
    creditSelect.innerHTML = '<option value="">--선택--</option>';

    // cardData에서 신용카드 필터링
    const creditCards = currentCardData.filter(c => c.type === 'credit');
    creditCards.forEach(card => {
      const option = document.createElement('option');
      option.value = card.name;
      option.textContent = card.name;
      creditSelect.appendChild(option);
    });

    // accountData에서도 신용카드 찾기 (creditLimit이 있는 카드)
    if (creditCards.length === 0) {
      currentAccountData.filter(acc => acc.type === 'card' && acc.creditLimit).forEach(account => {
        const option = document.createElement('option');
        option.value = account.name;
        option.textContent = account.name;
        creditSelect.appendChild(option);
      });
    }

    console.log('신용카드 옵션 업데이트 완료:', creditSelect.options.length - 1, '개');
  }

  // 체크카드 옵션 업데이트
  const debitSelect = document.getElementById('debit-card-select') || document.querySelector('select[name="debit-card"]');
  if (debitSelect) {
    debitSelect.innerHTML = '<option value="">--선택--</option>';

    // cardData에서 체크카드 필터링
    const debitCards = currentCardData.filter(c => c.type === 'debit');
    debitCards.forEach(card => {
      const option = document.createElement('option');
      option.value = card.name;
      option.textContent = card.name;
      debitSelect.appendChild(option);
    });

    // accountData에서도 체크카드 찾기 (creditLimit이 없는 카드)
    if (debitCards.length === 0) {
      currentAccountData.filter(acc => acc.type === 'card' && !acc.creditLimit).forEach(account => {
        const option = document.createElement('option');
        option.value = account.name;
        option.textContent = account.name;
        debitSelect.appendChild(option);
      });
    }

    console.log('체크카드 옵션 업데이트 완료:', debitSelect.options.length - 1, '개');
  }

  // 계좌이체 옵션 업데이트
  const transferSelect = document.getElementById('transfer-account-select') || document.querySelector('select[name="transfer-account"]');
  if (transferSelect) {
    transferSelect.innerHTML = '<option value="">--선택--</option>';
    currentAccountData.filter(acc => acc.type === 'bank').forEach(account => {
      const option = document.createElement('option');
      option.value = account.name;
      option.textContent = account.name;
      transferSelect.appendChild(option);
    });
    console.log('계좌이체 옵션 업데이트 완료:', transferSelect.options.length - 1, '개');
  }

  // 현금 계좌 옵션 업데이트
  const cashSelect = document.getElementById('cash-account-select') || document.querySelector('select[name="cash-account"]');
  if (cashSelect) {
    cashSelect.innerHTML = '<option value="">--선택--</option>';
    currentAccountData.filter(acc => acc.type === 'bank').forEach(account => {
      const option = document.createElement('option');
      option.value = account.name;
      option.textContent = account.name;
      cashSelect.appendChild(option);
    });
    console.log('현금 계좌 옵션 업데이트 완료:', cashSelect.options.length - 1, '개');
  }

  console.log('결제수단 옵션 업데이트 완료');
}

// 신용카드 카드사 선택 시 카드 목록 업데이트
function updateCreditCardList(selectedCompany) {
  const creditCardSelect = document.querySelector('select[name="credit-card"]');
  if (!creditCardSelect) return;

  creditCardSelect.innerHTML = '<option value="">--카드 선택--</option>';

  if (!selectedCompany) return;

  // cardData에서 해당 카드사의 카드만 필터링
  if (typeof cardData !== 'undefined' && Array.isArray(cardData)) {
    cardData.filter(c => c.type === 'credit' && c.cardCompany === selectedCompany).forEach(card => {
      const option = document.createElement('option');
      option.value = card.name;
      option.textContent = card.name;
      creditCardSelect.appendChild(option);
    });
  } else if (typeof accountData !== 'undefined' && Array.isArray(accountData)) {
    // accountData에서 카드사 정보 추출 (이름에서 추출)
    accountData.filter(acc => {
      if (acc.type !== 'card' || !acc.creditLimit) return false;
      // 이름에서 카드사 추출 (예: "KB 탄탄대로 올쇼핑" -> "KB")
      const nameMatch = acc.name.match(/^(KB|삼성|현대|신한|롯데|하나|우리|NH|카카오|토스)/);
      if (!nameMatch) return false;
      return nameMatch[0] === selectedCompany || acc.name.includes(selectedCompany);
    }).forEach(account => {
      const option = document.createElement('option');
      option.value = account.name;
      option.textContent = account.name;
      creditCardSelect.appendChild(option);
    });
  }
}

// 체크카드 은행 선택 시 카드 목록 업데이트
function updateDebitCardList(selectedBank) {
  const debitCardSelect = document.querySelector('select[name="debit-card"]');
  if (!debitCardSelect) return;

  debitCardSelect.innerHTML = '<option value="">--카드 선택--</option>';

  if (!selectedBank) return;

  // accountData에서 해당 은행의 체크카드만 필터링
  if (typeof accountData !== 'undefined' && Array.isArray(accountData)) {
    accountData.filter(acc => {
      if (acc.type !== 'card' || acc.creditLimit) return false;
      // 이름에서 은행명 추출
      return acc.name.includes(selectedBank) || acc.bankName === selectedBank;
    }).forEach(account => {
      const option = document.createElement('option');
      option.value = account.name;
      option.textContent = account.name;
      debitCardSelect.appendChild(option);
    });
  }
}

window.updatePaymentFields = function () {
  if (paymentCredit) paymentCredit.style.display = 'none';
  if (paymentDebit) paymentDebit.style.display = 'none';
  if (paymentTransfer) paymentTransfer.style.display = 'none';
  if (paymentCash) paymentCash.style.display = 'none';

  if (!methodSelect) return;
  const val = methodSelect.value;

  if (val === 'credit' && paymentCredit) {
    paymentCredit.style.display = 'block';

    // 카드사 select가 없으면 생성
    let companySelect = paymentCredit.querySelector('select[name="credit-company"]');
    if (!companySelect) {
      // 기존 카드 select 앞에 카드사 select 추가
      const existingCardSelect = paymentCredit.querySelector('select[name="credit-card"]');
      const label = paymentCredit.querySelector('label');

      // 카드사 select 생성
      companySelect = document.createElement('select');
      companySelect.name = 'credit-company';
      companySelect.style.cssText = 'margin-right: 10px; padding: 8px 12px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 0.9rem;';
      companySelect.innerHTML = '<option value="">--카드사 선택--</option>';

      // cardData에서 카드사 목록 추출
      if (typeof cardData !== 'undefined' && Array.isArray(cardData)) {
        const companies = [...new Set(cardData.filter(c => c.type === 'credit').map(c => c.cardCompany).filter(c => c))];
        companies.forEach(company => {
          const option = document.createElement('option');
          option.value = company;
          option.textContent = company;
          companySelect.appendChild(option);
        });
      } else if (typeof accountData !== 'undefined' && Array.isArray(accountData)) {
        // accountData에서 카드사 추출
        const companies = [...new Set(accountData.filter(acc => acc.type === 'card' && acc.creditLimit).map(acc => {
          const nameMatch = acc.name.match(/^(KB|삼성|현대|신한|롯데|하나|우리|NH|카카오|토스)/);
          return nameMatch ? nameMatch[0] : null;
        }).filter(c => c))];
        companies.forEach(company => {
          const option = document.createElement('option');
          option.value = company;
          option.textContent = company;
          companySelect.appendChild(option);
        });
      }

      // 카드사 select change 이벤트
      companySelect.addEventListener('change', function () {
        updateCreditCardList(this.value);
      });

      // label 다음에 카드사 select 삽입
      if (label && existingCardSelect) {
        label.insertAdjacentElement('afterend', companySelect);
      } else if (paymentCredit.firstChild) {
        paymentCredit.insertBefore(companySelect, paymentCredit.firstChild);
      }
    }

    // 카드 목록 초기화 (카드사 선택 전에는 빈 상태)
    const creditCardSelect = paymentCredit.querySelector('select[name="credit-card"]');
    if (creditCardSelect) {
      creditCardSelect.innerHTML = '<option value="">--카드사를 먼저 선택하세요--</option>';
    }

  } else if (val === 'debit' && paymentDebit) {
    paymentDebit.style.display = 'block';

    // 은행 select가 없으면 생성
    let bankSelect = paymentDebit.querySelector('select[name="debit-bank"]');
    if (!bankSelect) {
      const existingCardSelect = paymentDebit.querySelector('select[name="debit-card"]');
      const label = paymentDebit.querySelector('label');

      // 은행 select 생성
      bankSelect = document.createElement('select');
      bankSelect.name = 'debit-bank';
      bankSelect.style.cssText = 'margin-right: 10px; padding: 8px 12px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 0.9rem;';
      bankSelect.innerHTML = '<option value="">--은행 선택--</option>';

      // accountData에서 은행 목록 추출 (체크카드가 있는 은행)
      if (typeof accountData !== 'undefined' && Array.isArray(accountData)) {
        const banks = [...new Set(accountData.filter(acc => acc.type === 'card' && !acc.creditLimit).map(acc => {
          const nameMatch = acc.name.match(/^(KB|삼성|현대|신한|롯데|하나|우리|NH|카카오|토스)/);
          return nameMatch ? nameMatch[0] : (acc.bankName || '기타');
        }).filter(b => b))];
        banks.forEach(bank => {
          const option = document.createElement('option');
          option.value = bank;
          option.textContent = bank;
          bankSelect.appendChild(option);
        });
      }

      // 은행 select change 이벤트
      bankSelect.addEventListener('change', function () {
        updateDebitCardList(this.value);
      });

      // label 다음에 은행 select 삽입
      if (label && existingCardSelect) {
        label.insertAdjacentElement('afterend', bankSelect);
      } else if (paymentDebit.firstChild) {
        paymentDebit.insertBefore(bankSelect, paymentDebit.firstChild);
      }
    }

    // 카드 목록 초기화
    const debitCardSelect = paymentDebit.querySelector('select[name="debit-card"]');
    if (debitCardSelect) {
      debitCardSelect.innerHTML = '<option value="">--은행을 먼저 선택하세요--</option>';
    }

  } else if (val === 'transfer' && paymentTransfer) {
    paymentTransfer.style.display = 'block';
    if (typeof window.updatePaymentOptions === 'function') {
      window.updatePaymentOptions();
    }
  } else if (val === 'cash' && paymentCash) {
    paymentCash.style.display = 'block';
    if (typeof window.updatePaymentOptions === 'function') {
      window.updatePaymentOptions();
    }
  }
}

if (methodSelect) {
  methodSelect.addEventListener('change', function () {
    if (typeof window.updatePaymentFields === 'function') {
      window.updatePaymentFields();
    }
  });
}

// ========================================
// 금액 입력 필드 천 단위 콤마 포맷팅
// ========================================
const amountInput = document.getElementById('entry-amount');
if (amountInput) {
  // 입력 시 천 단위 콤마 자동 추가
  amountInput.addEventListener('input', function (e) {
    const cursorPosition = e.target.selectionStart;
    const value = e.target.value;
    const numbers = removeCommas(value);
    const formatted = formatNumberWithCommas(numbers);

    e.target.value = formatted;

    // 커서 위치 조정 (콤마 추가로 인한 위치 변화 보정)
    const addedCommas = (formatted.match(/,/g) || []).length - (value.match(/,/g) || []).length;
    const newCursorPosition = cursorPosition + addedCommas;
    e.target.setSelectionRange(newCursorPosition, newCursorPosition);
  });

  // 포커스 아웃 시에도 포맷팅 확인
  amountInput.addEventListener('blur', function (e) {
    const value = e.target.value;
    if (value) {
      e.target.value = formatNumberWithCommas(removeCommas(value));
    }
  });
}

// ========================================
// 폼 제출 (데이터 저장/수정)
// ========================================
window.handleEntryFormSubmit = function (e) {
  e.preventDefault();

  // 필수 입력 체크
  const date = document.getElementById('entry-date')?.value;
  const user = document.getElementById('entry-owner')?.value;
  const typeRadio = form.querySelector('input[name="type"]:checked');
  const type = typeRadio ? typeRadio.value : 'expense';
  const item = document.getElementById('entry-category-item')?.value;
  const category = document.getElementById('entry-category-kind')?.value;
  const amountRaw = document.getElementById('entry-amount')?.value;
  // 콤마 제거 후 숫자로 변환
  const amount = Number(removeCommas(amountRaw || '')) || 0;
  const paymentMethod = document.getElementById('entry-method')?.value;
  const merchant = document.getElementById('entry-merchant')?.value || '';
  const detail = document.getElementById('entry-detail')?.value || '';
  const saveMerchant = document.getElementById('entry-save-merchant')?.checked || false;
  const recurring = document.getElementById('entry-regular')?.checked || false;

  // 체크박스가 체크되어 있으면 자주 쓰는 항목에 추가
  if (saveMerchant && merchant) {
    addToMerchantHistory(merchant);
  }

  // 에러 처리: 필수 입력 체크
  if (!date) {
    alert('날짜를 입력해주세요.');
    return;
  }
  // 담당자 검증: 빈 문자열, null, undefined 모두 체크
  if (!user || user.trim() === '' || user === 'null' || user === 'undefined') {
    alert('담당자를 선택해주세요.');
    return;
  }
  if (!item) {
    alert('항목을 선택해주세요.');
    return;
  }
  if (!category) {
    alert('카테고리를 선택해주세요.');
    return;
  }
  if (!amountRaw || amount <= 0) {
    alert('금액을 올바르게 입력해주세요. (0보다 큰 값)');
    return;
  }
  if (!paymentMethod) {
    alert('결제수단을 선택해주세요.');
    return;
  }

  let paymentDetail = '';
  if (paymentMethod === 'credit') {
    const select = form.querySelector('select[name="credit-card"]');
    paymentDetail = select ? select.value : '';
    // 카드사 선택이 있으면 검증
    const companySelect = form.querySelector('select[name="credit-company"]');
    if (companySelect && !companySelect.value) {
      alert('카드사를 선택해주세요.');
      return;
    }
    if (!paymentDetail) {
      alert('카드를 선택해주세요.');
      return;
    }
  } else if (paymentMethod === 'debit') {
    const select = form.querySelector('select[name="debit-card"]');
    paymentDetail = select ? select.value : '';
    // 은행 선택이 있으면 검증
    const bankSelect = form.querySelector('select[name="debit-bank"]');
    if (bankSelect && !bankSelect.value) {
      alert('은행을 선택해주세요.');
      return;
    }
    if (!paymentDetail) {
      alert('카드를 선택해주세요.');
      return;
    }
  } else if (paymentMethod === 'transfer') {
    const select = form.querySelector('select[name="transfer-account"]');
    paymentDetail = select ? select.value : '';
  } else if (paymentMethod === 'cash') {
    const select = form.querySelector('select[name="cash-account"]');
    paymentDetail = select ? select.value : '';
  }

  if (editingId) {
    // 수정 모드: 기존 데이터 업데이트
    const index = transactionData.findIndex(item => item.id === editingId);
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
      if (typeof saveData === 'function') {
        saveData();
      }
      // 계좌 잔액 자동 업데이트
      if (typeof calculateAccountBalances === 'function') {
        calculateAccountBalances();
      }

      // 현재 활성 탭 확인 후 해당 탭의 렌더 함수 호출
      const currentTab = window.currentActiveTab || 'dashboard';

      if (currentTab === 'dashboard') {
        if (typeof renderTable === 'function') {
          renderTable();
        }
        if (typeof renderCardTable === 'function') {
          renderCardTable('all');
        }
        if (typeof renderBankTable === 'function') {
          renderBankTable();
        }
      } else if (currentTab === 'accounts') {
        // 계좌 관리 탭인 경우 계좌 테이블 갱신
        if (typeof renderAccountTransactionTable === 'function') {
          const accountSelect = document.getElementById('account-filter-select');
          const selectedAccount = accountSelect ? accountSelect.value : 'all';
          renderAccountTransactionTable(selectedAccount);
        }
        // 계좌 목록도 갱신
        const accountsContainer = document.getElementById('accounts-container');
        if (accountsContainer && typeof window.renderAccountsTab === 'function') {
          window.renderAccountsTab(accountsContainer);
        } else {
          // accounts-container가 없으면 main-content에서 찾기
          const mainContent = document.getElementById('main-content');
          if (mainContent && typeof window.renderAccountsTab === 'function') {
            window.renderAccountsTab(mainContent);
          }
        }
      } else if (currentTab === 'cards') {
        // 결제수단 관리 탭인 경우 카드 목록 갱신
        const paymentMethodsContainer = document.getElementById('payment-methods-container');
        if (paymentMethodsContainer && typeof window.renderPaymentMethodsTab === 'function') {
          window.renderPaymentMethodsTab(paymentMethodsContainer);
        }
      }

      // 대시보드는 항상 업데이트
      if (typeof updateDashboard === 'function') {
        updateDashboard();
      }

      alert('수정되었습니다!');
      if (typeof window.closeModal === 'function') {
        window.closeModal();
      }
    }
  } else {
    // 신규 입력 모드: 새 데이터 추가
    // 담당자 검증 강화
    if (!user || user.trim() === '' || user === 'null' || user === 'undefined') {
      alert('담당자를 선택해주세요.');
      return;
    }

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
      status: '⏳대기',
      timestamp: now
    };

    transactionData.push(entry);
    if (typeof saveData === 'function') {
      saveData();
    }
    // 계좌 잔액 자동 업데이트
    if (typeof calculateAccountBalances === 'function') {
      calculateAccountBalances();
    }

    // 현재 활성 탭 확인 후 해당 탭의 렌더 함수 호출
    const currentTab = window.currentActiveTab || 'dashboard';

    if (currentTab === 'dashboard') {
      if (typeof renderTable === 'function') {
        renderTable();
      }
      if (typeof renderCardTable === 'function') {
        renderCardTable('all');
      }
      if (typeof renderBankTable === 'function') {
        renderBankTable();
      }
    } else if (currentTab === 'accounts') {
      // 계좌 관리 탭인 경우 계좌 테이블 갱신 (수입/지출 모두 반영)
      if (typeof renderAccountTransactionTable === 'function') {
        const accountSelect = document.getElementById('account-filter-select');
        const selectedAccount = accountSelect ? accountSelect.value : 'all';
        renderAccountTransactionTable(selectedAccount);
      }
      // 계좌 목록도 갱신
      const accountsContainer = document.getElementById('accounts-container');
      if (accountsContainer && typeof window.renderAccountsTab === 'function') {
        window.renderAccountsTab(accountsContainer);
      } else {
        // accounts-container가 없으면 main-content에서 찾기
        const mainContent = document.getElementById('main-content');
        if (mainContent && typeof window.renderAccountsTab === 'function') {
          window.renderAccountsTab(mainContent);
        }
      }
    } else if (currentTab === 'cards') {
      // 결제수단 관리 탭인 경우 카드 목록 갱신
      const paymentMethodsContainer = document.getElementById('payment-methods-container');
      if (paymentMethodsContainer && typeof window.renderPaymentMethodsTab === 'function') {
        window.renderPaymentMethodsTab(paymentMethodsContainer);
      }
    }

    // 대시보드는 항상 업데이트
    if (typeof updateDashboard === 'function') {
      updateDashboard();
    }
    alert('저장되었습니다!');
    if (typeof window.closeModal === 'function') {
      window.closeModal();
    }
  }
};

// ========================================
// 수정 기능
// ========================================
window.editTransaction = function (id) {
  console.log('수정 모드 시작 - ID:', id, '타입:', typeof id);

  // id 타입 변환 (문자열로 전달될 수 있음)
  const searchId = typeof id === 'string' ? parseFloat(id) : id;

  // transactionData 접근 확인
  if (typeof transactionData === 'undefined' || !Array.isArray(transactionData)) {
    console.error('transactionData가 정의되지 않았거나 배열이 아닙니다.');
    alert('데이터를 불러올 수 없습니다. 페이지를 새로고침해주세요.');
    return;
  }

  console.log('transactionData 길이:', transactionData.length);
  console.log('검색할 ID:', searchId);

  // transactionData에서 해당 id 데이터 찾기 (숫자 비교)
  const entry = transactionData.find(item => {
    const itemId = typeof item.id === 'string' ? parseFloat(item.id) : item.id;
    return itemId === searchId || item.id === searchId;
  });

  if (!entry) {
    console.error('내역을 찾을 수 없음. 전체 ID 목록:', transactionData.map(t => ({ id: t.id, type: typeof t.id })));
    alert('해당 내역을 찾을 수 없습니다.');
    return;
  }

  console.log('찾은 내역:', entry);

  // 모달 제목 변경
  if (modalTitle) {
    modalTitle.textContent = '📝 내역 수정';
  }

  // editingId 설정
  editingId = id;

  // 폼에 기존 데이터 채우기
  const dateInput = document.getElementById('entry-date');
  const ownerSelect = document.getElementById('entry-owner');
  const typeRadios = form ? form.querySelectorAll('input[name="type"]') : [];
  const itemSelect = document.getElementById('entry-category-item');
  const categorySelect = document.getElementById('entry-category-kind');
  const amountInput = document.getElementById('entry-amount');
  const methodSelect = document.getElementById('entry-method');
  const merchantInput = document.getElementById('entry-merchant');
  const detailTextarea = document.getElementById('entry-detail');
  const regularCheckbox = document.getElementById('entry-regular');

  if (dateInput) dateInput.value = entry.date;
  if (ownerSelect) ownerSelect.value = entry.user;
  if (typeRadios && typeRadios.length > 0) {
    typeRadios.forEach(radio => {
      radio.checked = (radio.value === entry.type);
    });
    // 구분 선택 후 카테고리 옵션 업데이트
    if (typeof window.updateCategoryOptions === 'function') {
      window.updateCategoryOptions();
    }
  }
  // 카테고리를 먼저 설정하고 항목 드롭다운 업데이트
  if (categorySelect) {
    categorySelect.value = entry.category;
    // 카테고리 설정 후 항목 옵션 업데이트
    if (typeof window.updateItemOptions === 'function') {
      window.updateItemOptions();
    }
    // 항목 설정 (약간의 지연을 두어 DOM 업데이트 대기)
    setTimeout(() => {
      if (itemSelect) itemSelect.value = entry.item;
    }, 10);
  }
  if (amountInput) {
    // 수정 모드에서 금액 표시 시 천 단위 콤마 추가
    amountInput.value = formatNumberWithCommas(String(entry.amount));
  }
  if (methodSelect) {
    methodSelect.value = entry.paymentMethod;
    if (typeof window.updatePaymentFields === 'function') {
      window.updatePaymentFields();
    }

    // 결제수단별 상세 정보 설정
    setTimeout(() => {
      if (entry.paymentMethod === 'credit' && entry.paymentDetail) {
        const creditSelect = form ? form.querySelector('select[name="credit-card"]') : null;
        if (creditSelect) creditSelect.value = entry.paymentDetail;
      } else if (entry.paymentMethod === 'debit' && entry.paymentDetail) {
        const debitSelect = form ? form.querySelector('select[name="debit-card"]') : null;
        if (debitSelect) debitSelect.value = entry.paymentDetail;
      } else if (entry.paymentMethod === 'transfer' && entry.paymentDetail) {
        const transferSelect = form ? form.querySelector('select[name="transfer-account"]') : null;
        if (transferSelect) transferSelect.value = entry.paymentDetail;
      } else if (entry.paymentMethod === 'cash' && entry.paymentDetail) {
        const cashSelect = form ? form.querySelector('select[name="cash-account"]') : null;
        if (cashSelect) cashSelect.value = entry.paymentDetail;
      }
    }, 50);
  }
  if (merchantInput) merchantInput.value = entry.merchant || '';
  if (detailTextarea) detailTextarea.value = entry.detail || '';
  if (regularCheckbox) regularCheckbox.checked = entry.recurring || false;

  // 모달 열기
  if (typeof window.openModal === 'function') {
    window.openModal(true);
  }
  console.log('수정 모드 - 폼 데이터 채움 완료');
};

// ========================================
// 삭제 기능
// ========================================
window.deleteTransaction = function (id) {
  console.log('삭제 요청 - ID:', id);

  if (confirm('정말 삭제하시겠습니까?')) {
    const index = transactionData.findIndex(item => item.id === id);
    if (index > -1) {
      transactionData.splice(index, 1);
      if (typeof saveData === 'function') {
        saveData();
      }
      // 계좌 잔액 자동 업데이트 (삭제된 내역 반영)
      if (typeof calculateAccountBalances === 'function') {
        calculateAccountBalances();
      }

      // 현재 활성 탭 확인 후 해당 탭의 렌더 함수 호출
      const currentTab = window.currentActiveTab || 'dashboard';

      if (currentTab === 'dashboard') {
        if (typeof renderTable === 'function') {
          renderTable();
        }
        if (typeof renderCardTable === 'function') {
          renderCardTable('all');
        }
        if (typeof renderBankTable === 'function') {
          renderBankTable();
        }
      } else if (currentTab === 'accounts') {
        // 계좌 관리 탭인 경우 계좌 테이블 갱신
        if (typeof renderAccountTransactionTable === 'function') {
          const accountSelect = document.getElementById('account-filter-select');
          const selectedAccount = accountSelect ? accountSelect.value : 'all';
          renderAccountTransactionTable(selectedAccount);
        }
        // 계좌 목록도 갱신 (잔액 반영을 위해)
        const accountsContainer = document.getElementById('accounts-container');
        if (accountsContainer && typeof window.renderAccountsTab === 'function') {
          window.renderAccountsTab(accountsContainer);
        }
      } else if (currentTab === 'cards') {
        // 결제수단 관리 탭인 경우 카드 목록 갱신
        const paymentMethodsContainer = document.getElementById('payment-methods-container');
        if (paymentMethodsContainer && typeof window.renderPaymentMethodsTab === 'function') {
          window.renderPaymentMethodsTab(paymentMethodsContainer);
        }
      }

      // 대시보드는 항상 업데이트
      if (typeof updateDashboard === 'function') {
        updateDashboard();
      }

      alert('삭제되었습니다!');
      console.log('삭제 완료 - ID:', id);
    } else {
      alert('해당 내역을 찾을 수 없습니다.');
    }
  }
};

// ========================================
// 자주 쓰는 사용처 관리 함수
// ========================================
function addToMerchantHistory(merchant) {
  if (!merchant || merchant.trim() === '') return;

  const trimmedMerchant = merchant.trim();
  // 이미 존재하는지 확인
  const index = merchantHistory.indexOf(trimmedMerchant);
  if (index > -1) {
    // 이미 있으면 맨 앞으로 이동
    merchantHistory.splice(index, 1);
  }
  // 맨 앞에 추가 (최대 20개까지만 저장)
  merchantHistory.unshift(trimmedMerchant);
  if (merchantHistory.length > 20) {
    merchantHistory = merchantHistory.slice(0, 20);
  }
  // data-manager.js의 saveMerchantHistory 함수 사용
  if (typeof saveMerchantHistory === 'function') {
    saveMerchantHistory();
  }
  updateMerchantHistorySelect();
}

// 자주 쓰는 사용처 드롭다운 업데이트 (전역으로 노출)
window.updateMerchantHistorySelect = function () {
  const select = document.getElementById('merchant-history');
  if (!select) return;

  // 기존 옵션 제거 (첫 번째 옵션 제외)
  while (select.children.length > 1) {
    select.removeChild(select.lastChild);
  }

  // 자주 쓰는 사용처 추가
  merchantHistory.forEach(merchant => {
    const option = document.createElement('option');
    option.value = merchant;
    option.textContent = merchant;
    select.appendChild(option);
  });
}

// 자주 쓰는 사용처 목록 렌더링 (관리 모달용) (전역으로 노출)
window.renderMerchantList = function () {
  const merchantList = document.getElementById('merchant-list');
  if (!merchantList) return;

  merchantList.innerHTML = '';

  if (merchantHistory.length === 0) {
    merchantList.innerHTML = '<div style="text-align: center; padding: 20px; color: #6B7280;">등록된 사용처가 없습니다.</div>';
    return;
  }

  merchantHistory.forEach((merchant, index) => {
    const item = document.createElement('div');
    item.style.cssText = 'display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #F9FAFB; border-radius: 8px; border: 1px solid #E5E7EB;';
    item.innerHTML = `
      <span style="flex: 1; font-size: 0.95rem; color: #111827;">${merchant}</span>
      <button type="button" onclick="removeMerchantFromHistory(${index})" style="padding: 6px 12px; border: 1px solid #DC2626; border-radius: 6px; font-size: 0.85rem; background: #FFFFFF; color: #DC2626; cursor: pointer; transition: all 0.2s;">삭제</button>
    `;
    merchantList.appendChild(item);
  });
}

// 자주 쓰는 사용처 삭제 함수
window.removeMerchantFromHistory = function (index) {
  if (confirm('이 사용처를 삭제하시겠습니까?')) {
    merchantHistory.splice(index, 1);
    // data-manager.js의 saveMerchantHistory 함수 사용
    if (typeof saveMerchantHistory === 'function') {
      saveMerchantHistory();
    }
    if (typeof window.updateMerchantHistorySelect === 'function') {
      window.updateMerchantHistorySelect();
    }
    if (typeof window.renderMerchantList === 'function') {
      window.renderMerchantList();
    }
  }
};

// 자주 쓰는 사용처 관리 모달 열기/닫기 (전역으로 노출)
window.openMerchantManageModal = function () {
  const modal = document.getElementById('merchant-modal-overlay');
  if (modal) {
    if (typeof window.renderMerchantList === 'function') {
      window.renderMerchantList();
    }
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

window.closeMerchantManageModal = function () {
  const modal = document.getElementById('merchant-modal-overlay');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    // 입력 필드 초기화
    const addInput = document.getElementById('merchant-add-input');
    if (addInput) addInput.value = '';
  }
}

// 자주 쓰는 사용처 관리 모달 이벤트
let merchantManageBtn, merchantModalClose, merchantModalCancel, merchantModalOverlay, merchantAddBtn, merchantAddInput;

window.initMerchantManageModal = function () {
  console.log('initMerchantManageModal 호출됨');
  merchantManageBtn = document.getElementById('merchant-manage-btn');
  merchantModalClose = document.getElementById('merchant-modal-close-btn');
  merchantModalCancel = document.getElementById('merchant-modal-cancel-btn');
  merchantModalOverlay = document.getElementById('merchant-modal-overlay');
  merchantAddBtn = document.getElementById('merchant-add-btn');
  merchantAddInput = document.getElementById('merchant-add-input');

  if (merchantManageBtn) {
    // 기존 리스너 제거가 어려우므로, init이 중복 호출되지 않도록 주의하거나
    // cloneNode로 리스너 초기화 (여기서는 생략하고 그냥 추가, 중복 방지는 외부에서 제어 가정)
    merchantManageBtn.onclick = function () { // onCLick으로 덮어쓰기하여 중복 방지
      if (typeof window.openMerchantManageModal === 'function') window.openMerchantManageModal();
    };
  }

  if (merchantModalClose) {
    merchantModalClose.onclick = function () {
      if (typeof window.closeMerchantManageModal === 'function') window.closeMerchantManageModal();
    };
  }

  if (merchantModalCancel) {
    merchantModalCancel.onclick = function () {
      if (typeof window.closeMerchantManageModal === 'function') window.closeMerchantManageModal();
    };
  }

  if (merchantModalOverlay) {
    merchantModalOverlay.onclick = function (e) {
      if (e.target === merchantModalOverlay) {
        if (typeof window.closeMerchantManageModal === 'function') window.closeMerchantManageModal();
      }
    };
  }

  // 새 항목 추가
  if (merchantAddBtn && merchantAddInput) {
    merchantAddBtn.onclick = function () {
      const value = merchantAddInput.value.trim();
      if (value) {
        addToMerchantHistory(value);
        merchantAddInput.value = '';
        if (typeof window.renderMerchantList === 'function') window.renderMerchantList();
      }
    };

    merchantAddInput.onkeypress = function (e) {
      if (e.key === 'Enter') {
        const value = merchantAddInput.value.trim();
        if (value) {
          addToMerchantHistory(value);
          merchantAddInput.value = '';
          if (typeof window.renderMerchantList === 'function') window.renderMerchantList();
        }
        e.preventDefault(); // 폼 제출 방지
      }
    };
  }

  // 자주 쓰는 사용처 선택 이벤트 (이벤트 위임 사용)
  document.addEventListener('change', function (e) {
    if (e.target.id === 'merchant-history') {
      const merchantInput = document.getElementById('entry-merchant');
      if (merchantInput && e.target.value) {
        merchantInput.value = e.target.value;
        setTimeout(() => { e.target.value = ''; }, 100);
      }
    }
  });

  console.log('MerchantManageModal 초기화 완료');
};

if (merchantModalCancel) {
  merchantModalCancel.addEventListener('click', function () {
    if (typeof window.closeMerchantManageModal === 'function') {
      window.closeMerchantManageModal();
    }
  });
}

if (merchantModalOverlay) {
  merchantModalOverlay.addEventListener('click', function (e) {
    if (e.target === merchantModalOverlay) {
      if (typeof window.closeMerchantManageModal === 'function') {
        window.closeMerchantManageModal();
      }
    }
  });
}

// 새 항목 추가
if (merchantAddBtn && merchantAddInput) {
  merchantAddBtn.addEventListener('click', function () {
    const value = merchantAddInput.value.trim();
    if (value) {
      addToMerchantHistory(value);
      merchantAddInput.value = '';
      if (typeof window.renderMerchantList === 'function') {
        window.renderMerchantList();
      }
    }
  });

  merchantAddInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      const value = merchantAddInput.value.trim();
      if (value) {
        addToMerchantHistory(value);
        merchantAddInput.value = '';
        if (typeof window.renderMerchantList === 'function') {
          window.renderMerchantList();
        }
      }
    }
  });
}

// 자주 쓰는 사용처 선택 이벤트 (드롭다운에서 선택 시 텍스트 필드에 입력)
document.addEventListener('change', function (e) {
  if (e.target.id === 'merchant-history') {
    const merchantInput = document.getElementById('entry-merchant');
    if (merchantInput && e.target.value) {
      merchantInput.value = e.target.value;
      // 선택 후 드롭다운 초기화
      setTimeout(() => {
        e.target.value = '';
      }, 100);
    }
  }
});

// ========================================
// 계좌 관리 모달 함수들
// ========================================
let accountModalOverlay, accountModalClose, accountModalCancel, accountForm, accountModalTitle, editingAccountId;

window.closeAccountModal = function () {
  if (accountModalOverlay) {
    accountModalOverlay.style.display = 'none';
    document.body.style.overflow = '';
    editingAccountId = null;
    if (accountModalTitle) {
      accountModalTitle.textContent = '📝 계좌 추가';
    }
    if (accountForm) {
      accountForm.reset();
      // 계좌 유형 기본값 설정
      const typeRadios = accountForm.querySelectorAll('input[name="account-type"]');
      if (typeRadios && typeRadios.length > 0) {
        typeRadios[0].checked = true;
        if (typeof window.updateAccountTypeFields === 'function') {
          window.updateAccountTypeFields();
        }
      }
    }
  }
}

window.openAccountModal = function (isEdit = false) {
  if (accountModalOverlay) {
    accountModalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    if (!isEdit && accountForm) {
      accountForm.reset();
      const typeRadios = accountForm.querySelectorAll('input[name="account-type"]');
      if (typeRadios && typeRadios.length > 0) {
        typeRadios[0].checked = true;
        if (typeof window.updateAccountTypeFields === 'function') {
          window.updateAccountTypeFields();
        }
      }
      if (typeof window.updateLinkedAccountOptions === 'function') {
        window.updateLinkedAccountOptions();
      }
      if (accountModalTitle) {
        accountModalTitle.textContent = '📝 계좌 추가';
      }
    }
  }
}

window.updateAccountTypeFields = function () {
  const typeRadios = accountForm ? accountForm.querySelectorAll('input[name="account-type"]') : [];
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

window.updateLinkedAccountOptions = function () {
  const linkedAccountSelect = document.getElementById('account-linked-account');
  if (!linkedAccountSelect) return;

  // 기존 옵션 제거 (선택 안함 제외)
  while (linkedAccountSelect.children.length > 1) {
    linkedAccountSelect.removeChild(linkedAccountSelect.lastChild);
  }

  // 통장 계좌만 연결계좌로 선택 가능
  accountData.filter(acc => acc.type === 'bank').forEach(account => {
    const option = document.createElement('option');
    option.value = account.name;
    option.textContent = account.name;
    linkedAccountSelect.appendChild(option);
  });
}

// 계좌 유형 변경 이벤트
if (accountForm) {
  const typeRadios = accountForm.querySelectorAll('input[name="account-type"]');
  typeRadios.forEach(radio => {
    radio.addEventListener('change', function () {
      if (typeof window.updateAccountTypeFields === 'function') {
        window.updateAccountTypeFields();
      }
    });
  });
}

// 계좌 모달 닫기 이벤트
if (accountModalClose) {
  accountModalClose.addEventListener('click', function () {
    if (typeof window.closeAccountModal === 'function') {
      window.closeAccountModal();
    }
  });
}
if (accountModalCancel) {
  accountModalCancel.addEventListener('click', function () {
    if (typeof window.closeAccountModal === 'function') {
      window.closeAccountModal();
    }
  });
}
if (accountModalOverlay) {
  accountModalOverlay.addEventListener('click', function (e) {
    if (e.target === accountModalOverlay) {
      if (typeof window.closeAccountModal === 'function') {
        window.closeAccountModal();
      }
    }
  });
}

// 계좌 폼 제출
window.handleAccountFormSubmit = function (e) {
  e.preventDefault();

  const name = document.getElementById('account-name')?.value;
  const ownerRadios = accountForm.querySelectorAll('input[name="account-owner"]');
  const owner = Array.from(ownerRadios).find(radio => radio.checked)?.value;
  const typeRadios = accountForm.querySelectorAll('input[name="account-type"]');
  const type = Array.from(typeRadios).find(radio => radio.checked)?.value;
  const initialBalanceRaw = document.getElementById('account-initial-balance')?.value || '0';
  const initialBalance = Number(removeCommas(initialBalanceRaw)) || 0;

  if (!name) {
    alert('계좌명을 입력해주세요.');
    return;
  }
  if (!owner) {
    alert('소유자를 선택해주세요.');
    return;
  }
  if (!type) {
    alert('계좌 유형을 선택해주세요.');
    return;
  }

  if (editingAccountId) {
    // 수정 모드
    const index = accountData.findIndex(acc => acc.id === editingAccountId);
    if (index > -1) {
      const account = accountData[index];
      account.name = name;
      account.owner = owner;
      account.type = type;

      if (type === 'bank') {
        account.initialBalance = initialBalance;
        account.currentBalance = initialBalance; // 초기화
        delete account.creditLimit;
        delete account.paymentDay;
        delete account.linkedAccount;
      } else if (type === 'card') {
        const creditLimitRaw = document.getElementById('account-credit-limit')?.value || '0';
        const creditLimit = Number(removeCommas(creditLimitRaw)) || 0;
        const paymentDay = document.getElementById('account-payment-day')?.value;
        const linkedAccount = document.getElementById('account-linked-account')?.value || '';

        account.creditLimit = creditLimit;
        account.currentBalance = 0; // 카드는 사용액을 0으로 초기화
        if (paymentDay) account.paymentDay = Number(paymentDay);
        if (linkedAccount) account.linkedAccount = linkedAccount;
        delete account.initialBalance;
      }

      if (typeof saveAccountData === 'function') {
        saveAccountData();
      }
      if (typeof calculateAccountBalances === 'function') {
        calculateAccountBalances();
      }

      // 계좌 관리 탭이 열려있으면 다시 렌더링
      if (typeof currentActiveTab !== 'undefined' && currentActiveTab === 'accounts') {
        const accountsContainer = document.getElementById('accounts-container');
        if (accountsContainer && typeof renderAccountsTab === 'function') {
          renderAccountsTab(accountsContainer);
        }
      }

      // 결제수단 관리 탭이 열려있으면 다시 렌더링
      if (typeof currentActiveTab !== 'undefined' && currentActiveTab === 'cards') {
        const paymentMethodsContainer = document.getElementById('payment-methods-container');
        if (paymentMethodsContainer && typeof renderPaymentMethodsTab === 'function') {
          renderPaymentMethodsTab(paymentMethodsContainer);
        }
      }

      if (typeof updateDashboard === 'function') {
        updateDashboard();
      }
      alert('수정되었습니다!');
      if (typeof window.closeAccountModal === 'function') {
        window.closeAccountModal();
      }
    }
  } else {
    // 신규 추가 모드
    const now = Date.now();
    const account = {
      id: now,
      name: name,
      owner: owner,
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
      account.currentBalance = 0; // 카드는 사용액을 0으로 초기화
      if (paymentDay) account.paymentDay = Number(paymentDay);
      if (linkedAccount) account.linkedAccount = linkedAccount;
    }

    accountData.push(account);
    if (typeof saveAccountData === 'function') {
      saveAccountData();
    }
    if (typeof calculateAccountBalances === 'function') {
      calculateAccountBalances();
    }

    // 계좌 관리 탭이 열려있으면 다시 렌더링
    if (typeof currentActiveTab !== 'undefined' && currentActiveTab === 'accounts') {
      const accountsContainer = document.getElementById('accounts-container');
      if (accountsContainer && typeof renderAccountsTab === 'function') {
        renderAccountsTab(accountsContainer);
      }
    }

    // 결제수단 관리 탭이 열려있으면 다시 렌더링
    if (typeof currentActiveTab !== 'undefined' && currentActiveTab === 'cards') {
      const paymentMethodsContainer = document.getElementById('payment-methods-container');
      if (paymentMethodsContainer && typeof renderPaymentMethodsTab === 'function') {
        renderPaymentMethodsTab(paymentMethodsContainer);
      }
    }

    if (typeof updateDashboard === 'function') {
      updateDashboard();
    }
    alert('저장되었습니다!');
    if (typeof window.closeAccountModal === 'function') {
      window.closeAccountModal();
    }
  }
};

window.initAccountModal = function () {
  console.log('initAccountModal 호출됨');
  accountModalOverlay = document.getElementById('account-modal-overlay');
  accountModalClose = document.getElementById('account-modal-close-btn');
  accountModalCancel = document.getElementById('account-modal-cancel-btn');
  accountForm = document.getElementById('account-form');
  accountModalTitle = document.getElementById('account-modal-title');

  if (accountModalClose) {
    accountModalClose.addEventListener('click', function () {
      if (typeof window.closeAccountModal === 'function') window.closeAccountModal();
    });
  }
  if (accountModalCancel) {
    accountModalCancel.addEventListener('click', function () {
      if (typeof window.closeAccountModal === 'function') window.closeAccountModal();
    });
  }
  if (accountModalOverlay) {
    accountModalOverlay.addEventListener('click', function (e) {
      if (e.target === accountModalOverlay) {
        if (typeof window.closeAccountModal === 'function') window.closeAccountModal();
      }
    });
  }

  if (accountForm) {
    accountForm.addEventListener('submit', handleAccountFormSubmit);

    // 계좌 유형 변경 이벤트
    const typeRadios = accountForm.querySelectorAll('input[name="account-type"]');
    typeRadios.forEach(radio => {
      radio.addEventListener('change', function () {
        if (typeof window.updateAccountTypeFields === 'function') {
          window.updateAccountTypeFields();
        }
      });
    });
  }

  console.log('AccountModal 초기화 및 이벤트 리스너 등록 완료');
};

// 계좌 수정 함수
window.editAccount = function (id) {
  const account = accountData.find(acc => acc.id === id);
  if (!account) {
    alert('해당 계좌를 찾을 수 없습니다.');
    return;
  }

  editingAccountId = id;
  if (accountModalTitle) {
    accountModalTitle.textContent = '📝 계좌 수정';
  }

  // 폼에 기존 데이터 채우기
  const nameInput = document.getElementById('account-name');
  const ownerRadios = accountForm ? accountForm.querySelectorAll('input[name="account-owner"]') : [];
  const typeRadios = accountForm ? accountForm.querySelectorAll('input[name="account-type"]') : [];
  const initialBalanceInput = document.getElementById('account-initial-balance');
  const creditLimitInput = document.getElementById('account-credit-limit');
  const paymentDayInput = document.getElementById('account-payment-day');
  const linkedAccountSelect = document.getElementById('account-linked-account');

  if (nameInput) nameInput.value = account.name;

  // 소유자 라디오 버튼 설정
  if (ownerRadios && ownerRadios.length > 0) {
    ownerRadios.forEach(radio => {
      radio.checked = (radio.value === (account.owner || '둠둠'));
    });
  }

  if (typeRadios && typeRadios.length > 0) {
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
      if (typeof window.updateLinkedAccountOptions === 'function') {
        window.updateLinkedAccountOptions();
      }
      linkedAccountSelect.value = account.linkedAccount || '';
    }
  }

  if (typeof window.openAccountModal === 'function') {
    window.openAccountModal(true);
  }
};

// 계좌 삭제 함수
window.deleteAccount = function (id) {
  if (confirm('정말 삭제하시겠습니까?')) {
    const index = accountData.findIndex(acc => acc.id === id);
    if (index > -1) {
      accountData.splice(index, 1);
      if (typeof saveAccountData === 'function') {
        saveAccountData();
      }
      if (typeof calculateAccountBalances === 'function') {
        calculateAccountBalances();
      }

      // 계좌 관리 탭이 열려있으면 다시 렌더링
      if (typeof currentActiveTab !== 'undefined' && currentActiveTab === 'accounts') {
        const accountsContainer = document.getElementById('accounts-container');
        if (accountsContainer && typeof renderAccountsTab === 'function') {
          renderAccountsTab(accountsContainer);
        }
      }

      // 결제수단 관리 탭이 열려있으면 다시 렌더링
      if (typeof currentActiveTab !== 'undefined' && currentActiveTab === 'cards') {
        const paymentMethodsContainer = document.getElementById('payment-methods-container');
        if (paymentMethodsContainer && typeof renderPaymentMethodsTab === 'function') {
          renderPaymentMethodsTab(paymentMethodsContainer);
        }
      }

      if (typeof updateDashboard === 'function') {
        updateDashboard();
      }
      alert('삭제되었습니다!');
    } else {
      alert('해당 계좌를 찾을 수 없습니다.');
    }
  }
};

// 계좌 금액 입력 필드 포맷팅
const accountInitialBalanceInput = document.getElementById('account-initial-balance');
const accountCreditLimitInput = document.getElementById('account-credit-limit');

if (accountInitialBalanceInput) {
  accountInitialBalanceInput.addEventListener('input', function (e) {
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
  accountCreditLimitInput.addEventListener('input', function (e) {
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

// 초기화: 카테고리 옵션 설정 (기본값: 지출)
// DOMContentLoaded 후에 실행되도록 app.js에서 호출
// setTimeout(() => {
//   updateCategoryOptions();
//   updateMerchantHistorySelect();
//   updatePaymentOptions();
// }, 100);

// 카드 매핑 초기화 (데이터 로드 후 호출)
if (typeof window.initCardMaps === 'undefined') {
  window.initCardMaps = initCardMaps;
}

// ========================================
// 계좌 입출금 내역 등록 모달 함수들
// ========================================
let accountTransactionModalOverlay, accountTransactionModalClose, accountTransactionModalCancel, accountTransactionCardModalCancel, accountTransactionForm, accountTransactionCardForm;

// 계좌 입출금 내역 등록 모달 열기 (전역으로 노출)
window.openAccountTransactionModal = function () {
  if (accountTransactionModalOverlay) {
    accountTransactionModalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // 폼 완전 초기화
    if (accountTransactionForm) {
      accountTransactionForm.reset();
    }
    if (accountTransactionCardForm) {
      accountTransactionCardForm.reset();
    }

    // 오늘 날짜로 설정
    const today = new Date();
    const dateInput = document.getElementById('account-transaction-date');
    if (dateInput) {
      dateInput.value = today.toISOString().split('T')[0];
    }

    // 계좌 선택 드롭다운 업데이트
    updateAccountTransactionAccountOptions();

    // 일반 입출금 등록 탭 활성화
    const generalTab = document.getElementById('account-transaction-tab-general');
    const cardStatementTab = document.getElementById('account-transaction-tab-card-statement');
    const tabBtns = accountTransactionModalOverlay.querySelectorAll('.entry-tab-btn');

    if (generalTab) generalTab.style.display = 'block';
    if (cardStatementTab) cardStatementTab.style.display = 'none';

    tabBtns.forEach(btn => {
      btn.classList.remove('active');
      btn.style.color = '#6B7280';
      btn.style.fontWeight = '500';
      btn.style.borderBottomColor = 'transparent';
    });

    const generalTabBtn = accountTransactionModalOverlay.querySelector('.entry-tab-btn[data-tab="general"]');
    if (generalTabBtn) {
      generalTabBtn.classList.add('active');
      generalTabBtn.style.color = '#EF4444';
      generalTabBtn.style.fontWeight = '600';
      generalTabBtn.style.borderBottomColor = '#EF4444';
    }

    // 구분 라디오 버튼 기본값 설정 (지출)
    const typeRadios = accountTransactionForm ? accountTransactionForm.querySelectorAll('input[name="account-transaction-type"]') : [];
    if (typeRadios && typeRadios.length > 0) {
      typeRadios.forEach(radio => {
        if (radio.value === 'expense') {
          radio.checked = true;
        }
      });
    }

    // 카테고리 옵션 초기화 (약간의 지연을 두어 DOM 업데이트 대기)
    setTimeout(() => {
      if (typeof window.updateAccountTransactionCategoryOptions === 'function') {
        window.updateAccountTransactionCategoryOptions();
      }
    }, 50);

    // 금액 입력 필드에 천 단위 콤마 자동 포맷팅
    const amountInput = document.getElementById('account-transaction-amount');
    if (amountInput) {
      // 기존 이벤트 리스너 제거 후 재추가
      const newAmountInput = amountInput.cloneNode(true);
      amountInput.parentNode.replaceChild(newAmountInput, amountInput);

      newAmountInput.addEventListener('input', function (e) {
        const value = e.target.value.replace(/,/g, '');
        const cursorPosition = e.target.selectionStart;
        const numbers = removeCommas(value);
        const formatted = formatNumberWithCommas(numbers);
        e.target.value = formatted;
        const addedCommas = (formatted.match(/,/g) || []).length - (value.match(/,/g) || []).length;
        const newCursorPosition = cursorPosition + addedCommas;
        e.target.setSelectionRange(newCursorPosition, newCursorPosition);
      });
    }

    console.log('계좌 입출금 내역 등록 모달 열림');
  } else {
    console.error('account-transaction-modal-overlay를 찾을 수 없습니다.');
  }
};

// 계좌 입출금 내역 등록 모달 닫기
window.closeAccountTransactionModal = function () {
  if (accountTransactionModalOverlay) {
    accountTransactionModalOverlay.style.display = 'none';
    document.body.style.overflow = '';

    if (accountTransactionForm) {
      accountTransactionForm.reset();
    }
    if (accountTransactionCardForm) {
      accountTransactionCardForm.reset();
    }
  }
};

// 계좌 선택 드롭다운 업데이트
function updateAccountTransactionAccountOptions() {
  const accountSelect = document.getElementById('account-transaction-account');
  if (!accountSelect) return;

  accountSelect.innerHTML = '<option value="">--선택--</option>';

  if (typeof accountData !== 'undefined' && Array.isArray(accountData)) {
    accountData.filter(acc => acc.type === 'bank').forEach(account => {
      const option = document.createElement('option');
      option.value = account.name;
      option.textContent = account.name;
      accountSelect.appendChild(option);
    });
  }
}

// 카드 선택 드롭다운 업데이트
function updateAccountTransactionCardOptions() {
  const cardSelect = document.getElementById('account-transaction-card-select');
  if (!cardSelect) return;

  cardSelect.innerHTML = '<option value="">--선택--</option>';

  if (typeof accountData !== 'undefined' && Array.isArray(accountData)) {
    accountData.filter(acc => acc.type === 'card' && acc.creditLimit).forEach(card => {
      const option = document.createElement('option');
      option.value = card.name;
      option.textContent = card.name;
      cardSelect.appendChild(option);
    });
  }
}

// 카드 선택 시 결제 계좌 및 금액 자동 계산
function updateCardPaymentInfo(selectedCardName) {
  const paymentAccountInput = document.getElementById('account-transaction-payment-account');
  const amountInput = document.getElementById('account-transaction-card-amount');
  const dateInput = document.getElementById('account-transaction-card-date');

  if (!selectedCardName || !paymentAccountInput || !amountInput) return;

  // 선택된 카드 정보 찾기
  const selectedCard = accountData.find(acc => acc.name === selectedCardName && acc.type === 'card');
  if (!selectedCard) {
    paymentAccountInput.value = '';
    amountInput.value = '0';
    return;
  }

  // 결제 계좌 표시
  paymentAccountInput.value = selectedCard.linkedAccount || '';

  // 해당 월 카드 사용 총액 계산
  if (dateInput && dateInput.value) {
    const selectedDate = new Date(dateInput.value);
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;

    if (typeof transactionData !== 'undefined' && Array.isArray(transactionData)) {
      const cardTransactions = transactionData.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getFullYear() === year &&
          tDate.getMonth() + 1 === month &&
          t.paymentMethod === 'credit' &&
          t.paymentDetail === selectedCardName;
      });

      const totalAmount = cardTransactions.reduce((sum, t) => sum + t.amount, 0);
      amountInput.value = formatNumberWithCommas(String(totalAmount));
    } else {
      amountInput.value = '0';
    }
  } else {
    amountInput.value = '0';
  }
}

// 계좌 입출금 내역 등록 모달 이벤트 리스너
if (accountTransactionModalClose) {
  accountTransactionModalClose.addEventListener('click', closeAccountTransactionModal);
}

if (accountTransactionModalCancel) {
  accountTransactionModalCancel.addEventListener('click', closeAccountTransactionModal);
}

if (accountTransactionCardModalCancel) {
  accountTransactionCardModalCancel.addEventListener('click', closeAccountTransactionModal);
}

if (accountTransactionModalOverlay) {
  accountTransactionModalOverlay.addEventListener('click', function (e) {
    if (e.target === accountTransactionModalOverlay) {
      closeAccountTransactionModal();
    }
  });
}

// 탭 전환 이벤트
if (accountTransactionModalOverlay) {
  accountTransactionModalOverlay.addEventListener('click', function (e) {
    if (e.target.classList.contains('entry-tab-btn')) {
      const tabName = e.target.getAttribute('data-tab');
      const tabButtons = accountTransactionModalOverlay.querySelectorAll('.entry-tab-btn');
      const tabContents = accountTransactionModalOverlay.querySelectorAll('.entry-tab-content');

      // 모든 탭 버튼 비활성화
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.style.color = '#6B7280';
        btn.style.fontWeight = '500';
        btn.style.borderBottomColor = 'transparent';
      });

      // 클릭한 탭 버튼 활성화
      e.target.classList.add('active');
      e.target.style.color = '#EF4444';
      e.target.style.fontWeight = '600';
      e.target.style.borderBottomColor = '#EF4444';

      // 모든 탭 콘텐츠 숨김
      tabContents.forEach(content => {
        content.style.display = 'none';
      });

      // 선택한 탭 콘텐츠 표시
      if (tabName === 'general') {
        const generalTab = document.getElementById('account-transaction-tab-general');
        if (generalTab) {
          generalTab.style.display = 'block';
          // 카테고리 옵션 초기화
          if (typeof window.updateAccountTransactionCategoryOptions === 'function') {
            window.updateAccountTransactionCategoryOptions();
          }
        }
      } else if (tabName === 'card-statement') {
        const cardStatementTab = document.getElementById('account-transaction-tab-card-statement');
        if (cardStatementTab) {
          cardStatementTab.style.display = 'block';
          // 카드 선택 드롭다운 업데이트
          updateAccountTransactionCardOptions();
          // 오늘 날짜로 설정
          const today = new Date();
          const dateInput = document.getElementById('account-transaction-card-date');
          if (dateInput) {
            dateInput.value = today.toISOString().split('T')[0];
          }
        }
      }
    }
  });
}

// 카드 선택 시 정보 업데이트 및 구분 라디오 버튼 변경 이벤트
// (Moved to initAccountTransactionModal)

// 계좌 입출금 내역 등록 - 카테고리 옵션 업데이트 함수
window.updateAccountTransactionCategoryOptions = function () {
  const form = document.getElementById('account-transaction-form');
  if (!form) {
    console.warn('updateAccountTransactionCategoryOptions: account-transaction-form을 찾을 수 없습니다.');
    return;
  }

  const typeRadios = form.querySelectorAll('input[name="account-transaction-type"]');
  const categorySelect = document.getElementById('account-transaction-category-kind');
  const itemSelect = document.getElementById('account-transaction-category-item');

  if (!typeRadios || typeRadios.length === 0) {
    console.warn('updateAccountTransactionCategoryOptions: 구분 라디오 버튼을 찾을 수 없습니다.');
    return;
  }
  if (!categorySelect || !itemSelect) {
    console.warn('updateAccountTransactionCategoryOptions: 카테고리 또는 항목 select를 찾을 수 없습니다.');
    return;
  }

  const selectedType = Array.from(typeRadios).find(radio => radio.checked)?.value;

  if (!selectedType) {
    console.warn('updateAccountTransactionCategoryOptions: 선택된 구분이 없습니다.');
    return;
  }

  console.log('카테고리 옵션 업데이트 - 선택된 구분:', selectedType);

  // 카테고리 드롭다운 완전 초기화 (기존 옵션 모두 제거)
  categorySelect.innerHTML = '<option value="">--선택--</option>';
  // 항목 드롭다운도 완전 초기화
  itemSelect.innerHTML = '<option value="">카테고리를 먼저 선택하세요</option>';

  // 카테고리 데이터 접근 (전역 또는 window 객체에서)
  const expenseItems = window.expenseCategoryItems || expenseCategoryItems || (typeof expenseCategoryItems !== 'undefined' ? expenseCategoryItems : null);
  const incomeItems = window.incomeCategoryItems || incomeCategoryItems || (typeof incomeCategoryItems !== 'undefined' ? incomeCategoryItems : null);

  console.log('데이터 확인 - expenseItems:', expenseItems ? Object.keys(expenseItems).length + '개' : '없음', 'incomeItems:', incomeItems ? Object.keys(incomeItems).length + '개' : '없음');

  if (selectedType === 'expense') {
    // 지출용 카테고리만 추가
    if (expenseItems && typeof expenseItems === 'object') {
      Object.keys(expenseItems).forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
      });
      console.log('지출용 카테고리 추가 완료:', Object.keys(expenseItems).length, '개');
    } else {
      console.error('expenseCategoryItems를 찾을 수 없습니다.');
    }
  } else if (selectedType === 'income') {
    // 수입용 카테고리만 추가
    if (incomeItems && typeof incomeItems === 'object') {
      Object.keys(incomeItems).forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
      });
      console.log('수입용 카테고리 추가 완료:', Object.keys(incomeItems).length, '개');
    } else {
      console.error('incomeCategoryItems를 찾을 수 없습니다.');
    }
  }
};

// 계좌 입출금 내역 등록 - 항목 옵션 업데이트 함수
window.updateAccountTransactionItemOptions = function () {
  const form = document.getElementById('account-transaction-form');
  if (!form) {
    console.warn('updateAccountTransactionItemOptions: account-transaction-form을 찾을 수 없습니다.');
    return;
  }

  const typeRadios = form.querySelectorAll('input[name="account-transaction-type"]');
  const categorySelect = document.getElementById('account-transaction-category-kind');
  const itemSelect = document.getElementById('account-transaction-category-item');

  if (!typeRadios || typeRadios.length === 0) {
    console.warn('updateAccountTransactionItemOptions: 구분 라디오 버튼을 찾을 수 없습니다.');
    return;
  }
  if (!categorySelect || !itemSelect) {
    console.warn('updateAccountTransactionItemOptions: 카테고리 또는 항목 select를 찾을 수 없습니다.');
    return;
  }

  const selectedType = Array.from(typeRadios).find(radio => radio.checked)?.value;
  const selectedCategory = categorySelect.value;

  if (!selectedType) {
    console.warn('updateAccountTransactionItemOptions: 선택된 구분이 없습니다.');
    return;
  }

  console.log('항목 옵션 업데이트 - 선택된 구분:', selectedType, '선택된 카테고리:', selectedCategory);

  // 항목 드롭다운 완전 초기화
  itemSelect.innerHTML = '<option value="">--선택--</option>';

  // 카테고리 데이터 접근 (전역 또는 window 객체에서)
  const expenseItems = window.expenseCategoryItems || expenseCategoryItems || (typeof expenseCategoryItems !== 'undefined' ? expenseCategoryItems : null);
  const incomeItems = window.incomeCategoryItems || incomeCategoryItems || (typeof incomeCategoryItems !== 'undefined' ? incomeCategoryItems : null);

  let categoryItems = {};
  if (selectedType === 'expense') {
    categoryItems = expenseItems || {};
  } else if (selectedType === 'income') {
    categoryItems = incomeItems || {};
  }

  if (selectedCategory && categoryItems && categoryItems[selectedCategory] && Array.isArray(categoryItems[selectedCategory])) {
    // 선택된 카테고리에 해당하는 항목들만 추가
    categoryItems[selectedCategory].forEach(item => {
      const option = document.createElement('option');
      option.value = item;
      option.textContent = item;
      itemSelect.appendChild(option);
    });
    console.log('항목 추가 완료:', categoryItems[selectedCategory].length, '개');
  } else {
    itemSelect.innerHTML = '<option value="">카테고리를 먼저 선택하세요</option>';
    if (selectedCategory) {
      console.warn('선택된 카테고리에 해당하는 항목을 찾을 수 없습니다:', selectedCategory);
    }
  }
};

// 일반 입출금 등록 폼 제출
// 일반 입출금 등록 폼 제출 핸들러
window.handleAccountTransactionFormSubmit = function (e) {
  e.preventDefault();

  const date = document.getElementById('account-transaction-date')?.value;
  const user = document.getElementById('account-transaction-user')?.value;
  const typeRadios = accountTransactionForm.querySelectorAll('input[name="account-transaction-type"]');
  const type = Array.from(typeRadios).find(radio => radio.checked)?.value;
  const category = document.getElementById('account-transaction-category-kind')?.value;
  const item = document.getElementById('account-transaction-category-item')?.value;
  const paymentMethodRadios = accountTransactionForm.querySelectorAll('input[name="account-transaction-payment-method"]');
  const paymentMethod = Array.from(paymentMethodRadios).find(radio => radio.checked)?.value || 'transfer';
  const account = paymentMethod === 'transfer' ? (document.getElementById('account-transaction-account')?.value || '') : '';
  const amountRaw = document.getElementById('account-transaction-amount')?.value || '';
  const amount = Number(removeCommas(amountRaw)) || 0;
  const memo = document.getElementById('account-transaction-memo')?.value || '';

  if (!date || !user || !type || !category || !item || !paymentMethod || !amountRaw || amount <= 0) {
    alert('모든 필수 항목을 입력해주세요.');
    return;
  }

  if (paymentMethod === 'transfer' && !account) {
    alert('계좌를 선택해주세요.');
    return;
  }

  // 중복 체크: 월별 현황 데이터와 교차 검증
  const isDuplicate = transactionData.some(existing => {
    return existing.date === date &&
      existing.item === item &&
      Math.abs(existing.amount - amount) < 1 && // 금액 차이 1원 미만
      existing.paymentMethod === paymentMethod &&
      existing.paymentDetail === (paymentMethod === 'cash' ? '현금' : account) &&
      existing.type === type;
  });

  if (isDuplicate) {
    alert('이미 등록된 거래 내역입니다. 중복 등록을 방지했습니다.');
    return;
  }

  const now = Date.now();
  const newEntry = {
    id: now,
    date: date,
    user: user,
    type: type,
    item: item,
    category: category,
    amount: amount,
    paymentMethod: paymentMethod,
    paymentDetail: paymentMethod === 'cash' ? '현금' : account,
    detail: memo,
    status: '완료',
    timestamp: now
  };

  // 3. 데이터 저장 분리 (Phase 3: Account Payment Separation)
  // 원래는 transactionData.push(newEntry)였으나, 이제는 accountCardPayments에 저장
  if (typeof accountCardPayments === 'undefined') {
    window.accountCardPayments = [];
  }
  accountCardPayments.push(newEntry);

  if (typeof saveAccountCardPayments === 'function') {
    saveAccountCardPayments();
  } else {
    console.warn('saveAccountCardPayments 함수가 없습니다. 임시로 localStorage에 저장합니다.');
    localStorage.setItem('accountCardPayments', JSON.stringify(accountCardPayments));
  }

  // 계좌 잔액 자동 재계산 (카드 대금 반영)
  if (typeof calculateAccountBalances === 'function') {
    calculateAccountBalances();
  }

  // 현재 활성 탭 확인 후 해당 탭의 렌더 함수 호출
  const currentTab = window.currentActiveTab || 'dashboard';

  // 계좌 입출금 관리 탭 갱신
  if (currentTab === 'accounts') {
    if (typeof renderAccountTransactionTable === 'function') {
      const accountSelect = document.getElementById('account-filter-select');
      const selectedAccount = accountSelect ? accountSelect.value : 'all';
      renderAccountTransactionTable(selectedAccount);
    }
    // 계좌 목록도 갱신 (잔액 반영을 위해)
    const accountsContainer = document.getElementById('accounts-container');
    const mainContent = document.getElementById('main-content');
    if (accountsContainer && typeof window.renderAccountsTab === 'function') {
      window.renderAccountsTab(accountsContainer);
    } else if (mainContent && typeof window.renderAccountsTab === 'function') {
      window.renderAccountsTab(mainContent);
    }
  }

  // 월별 현황 탭도 갱신 (열려있을 경우)
  if (currentTab === 'dashboard') {
    if (typeof renderTable === 'function') {
      renderTable();
    }
    if (typeof renderCardTable === 'function') {
      renderCardTable('all');
    }
    if (typeof renderBankTable === 'function') {
      renderBankTable();
    }
  }

  // 대시보드는 항상 업데이트
  if (typeof updateDashboard === 'function') {
    updateDashboard();
  }

  alert('입출금 내역이 등록되었습니다!');
  closeAccountTransactionModal();
};

// ========================================
// 카드 관리 모달 관련 함수
// ========================================
let cardManageModalClose, cardManageModalCancel, cardManageModalOverlay, cardManageForm, manageCardsBtn;
let editingCardId = null;

// 카드 목록 렌더링
window.renderCardList = function () {
  const cardList = document.getElementById('card-list');
  if (!cardList) return;

  cardList.innerHTML = '';

  if (!cardData || cardData.length === 0) {
    cardList.innerHTML = '<div style="text-align: center; padding: 20px; color: #6B7280;">등록된 카드가 없습니다.</div>';
    return;
  }

  cardData.forEach(card => {
    const item = document.createElement('div');
    item.style.cssText = 'display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #F9FAFB; border-radius: 8px; border: 1px solid #E5E7EB;';
    item.innerHTML = `
      <div style="flex: 1;">
        <div style="font-weight: 600; color: #111827; margin-bottom: 4px;">${card.name}</div>
        <div style="font-size: 0.85rem; color: #6B7280;">
          ${card.type === 'credit' ? '신용카드' : '체크카드'} · ${card.cardCompany || '미지정'}
        </div>
      </div>
      <div style="display: flex; gap: 8px;">
        <button type="button" onclick="editCard(${card.id})" style="padding: 6px 12px; border: 1px solid #EF4444; border-radius: 6px; font-size: 0.85rem; background: #FFFFFF; color: #EF4444; cursor: pointer; transition: all 0.2s;">수정</button>
        <button type="button" onclick="deleteCard(${card.id})" style="padding: 6px 12px; border: 1px solid #DC2626; border-radius: 6px; font-size: 0.85rem; background: #FFFFFF; color: #DC2626; cursor: pointer; transition: all 0.2s;">삭제</button>
      </div>
    `;
    cardList.appendChild(item);
  });
};

// 카드 관리 모달 열기
window.openCardManageModal = function (isEdit = false, cardId = null, isCompanyMode = false, preSelectedCompany = null) {
  const modal = document.getElementById('card-manage-modal-overlay');
  if (!modal) return;

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  const form = document.getElementById('card-manage-form');
  const title = document.getElementById('card-manage-modal-title');

  if (title) {
    title.textContent = isCompanyMode ? '💳 카드사 추가' : (isEdit ? '💳 카드 수정' : '💳 카드 추가');
  }

  if (form) {
    form.reset();
    if (isCompanyMode && preSelectedCompany) {
      const companySelect = document.getElementById('card-manage-company');
      if (companySelect) companySelect.value = preSelectedCompany;
    } else if (preSelectedCompany) {
      const companySelect = document.getElementById('card-manage-company');
      if (companySelect) companySelect.value = preSelectedCompany;
    }
  }

  editingCardId = cardId || null;
  renderCardList();
};

window.closeCardManageModal = function () {
  const modal = document.getElementById('card-manage-modal-overlay');
  if (!modal) return;

  modal.style.display = 'none';
  document.body.style.overflow = '';

  const form = document.getElementById('card-manage-form');
  if (form) form.reset();

  editingCardId = null;
};

window.editCard = function (id) {
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
  openCardManageModal(true, id);
};

window.deleteCard = function (id) {
  if (confirm('정말 삭제하시겠습니까?')) {
    const index = cardData.findIndex(c => c.id === id);
    if (index > -1) {
      cardData.splice(index, 1);
      if (typeof saveCardData === 'function') saveCardData();
      renderCardList();
      if (typeof updateCardSelects === 'function') updateCardSelects();
      alert('삭제되었습니다!');
    }
  }
};

window.initCardManageModal = function () {
  console.log('initCardManageModal 호출됨');
  cardManageModalClose = document.getElementById('card-manage-modal-close');
  cardManageModalCancel = document.getElementById('card-manage-modal-cancel');
  cardManageModalOverlay = document.getElementById('card-manage-modal-overlay');
  cardManageForm = document.getElementById('card-manage-form');
  manageCardsBtn = document.getElementById('manage-cards-btn');

  if (cardManageModalClose) cardManageModalClose.onclick = closeCardManageModal;
  if (cardManageModalCancel) cardManageModalCancel.onclick = closeCardManageModal;
  if (cardManageModalOverlay) {
    cardManageModalOverlay.onclick = function (e) {
      if (e.target === cardManageModalOverlay) closeCardManageModal();
    };
  }

  if (manageCardsBtn) {
    manageCardsBtn.onclick = function () { openCardManageModal(false); };
  }

  if (cardManageForm) {
    cardManageForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('card-manage-name')?.value;
      const typeRadios = cardManageForm.querySelectorAll('input[name="card-type"]');
      const type = Array.from(typeRadios).find(radio => radio.checked)?.value;
      const cardCompany = document.getElementById('card-manage-company')?.value;

      if (!name) { alert('카드명을 입력해주세요.'); return; }
      if (!type) { alert('카드 유형을 선택해주세요.'); return; }
      if (!cardCompany) { alert('카드사를 선택해주세요.'); return; }

      if (editingCardId) {
        const index = cardData.findIndex(c => c.id === editingCardId);
        if (index > -1) {
          cardData[index] = { ...cardData[index], name, type, cardCompany };
          if (typeof saveCardData === 'function') saveCardData();
          renderCardList();
          if (typeof updateCardSelects === 'function') updateCardSelects();
          alert('수정되었습니다!');
          closeCardManageModal();
        }
      } else {
        const now = Date.now();
        const newCard = { id: now, name, type, cardCompany };
        cardData.push(newCard);
        if (typeof saveCardData === 'function') saveCardData();
        renderCardList();
        if (typeof updateCardSelects === 'function') updateCardSelects();
        alert('카드가 추가되었습니다!');
        closeCardManageModal();
      }
    });
  }
  console.log('CardManageModal 초기화 완료');
};

// ========================================
// 카드 대금 등록 모달 관련 함수
// ========================================
let registerCardPaymentBtn, cardPaymentModalClose, cardPaymentModalCancel, cardPaymentModalOverlay, cardPaymentForm;

window.openCardPaymentModal = function () {
  const modal = document.getElementById('card-payment-modal-overlay');
  if (!modal) return;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // 카드사/카드/계좌 select 초기화 로직 (여기서는 생략, 필요시 index.html 로직 참조하여 추가)
  // 간단히 reset만
  const form = document.getElementById('card-payment-form');
  if (form) form.reset();

  // 기본값 설정
  const today = new Date();
  const dateInput = document.getElementById('card-payment-date');
  if (dateInput) dateInput.value = today.toISOString().split('T')[0];

  validateCardPayment();
};

window.closeCardPaymentModal = function () {
  const modal = document.getElementById('card-payment-modal-overlay');
  if (!modal) return;
  modal.style.display = 'none';
  document.body.style.overflow = '';
};

window.validateCardPayment = function () {
  // 유효성 체크 및 금액 계산 로직
  const cardCompany = document.getElementById('card-payment-card-company-select')?.value;
  const cardName = document.getElementById('card-payment-card-select')?.value;
  const periodStart = document.getElementById('card-payment-period-start')?.value;
  const periodEnd = document.getElementById('card-payment-period-end')?.value;
  const billingAmountRaw = document.getElementById('card-payment-amount')?.value || '';
  const billingAmount = Number(removeCommas(billingAmountRaw)) || 0;

  if (!cardCompany || !cardName || !periodStart || !periodEnd) {
    // UI 초기화
    if (document.getElementById('card-usage-sum')) document.getElementById('card-usage-sum').textContent = '0원';
    return;
  }

  // 기간 내 사용액 계산
  const cardUsage = transactionData.filter(entry => {
    if (entry.isCardPayment === true) return false;
    if (entry.paymentMethod !== 'credit' && entry.paymentMethod !== 'debit') return false;
    if (entry.paymentDetail !== cardName) return false;
    const d = new Date(entry.date);
    const s = new Date(periodStart);
    const e = new Date(periodEnd);
    s.setHours(0, 0, 0, 0); e.setHours(23, 59, 59, 999); d.setHours(12, 0, 0, 0);
    return d >= s && d <= e;
  });

  const usageSum = cardUsage.reduce((sum, en) => sum + en.amount, 0);
  if (document.getElementById('card-usage-sum')) document.getElementById('card-usage-sum').textContent = usageSum.toLocaleString() + '원';

  const diff = usageSum - billingAmount;
  if (document.getElementById('card-difference')) document.getElementById('card-difference').textContent = Math.abs(diff).toLocaleString() + '원';

  const msg = document.getElementById('validation-message');
  if (msg) {
    if (diff === 0) {
      msg.style.display = 'block'; msg.textContent = '✓ 일치'; msg.style.background = '#D1FAE5'; msg.style.color = '#065F46';
    } else {
      msg.style.display = 'block'; msg.textContent = '⚠ 불일치'; msg.style.background = '#FEE2E2'; msg.style.color = '#991B1B';
    }
  }
};

window.initCardPaymentModal = function () {
  console.log('initCardPaymentModal 호출됨');
  registerCardPaymentBtn = document.getElementById('register-card-payment-btn');
  cardPaymentModalClose = document.getElementById('card-payment-modal-close');
  cardPaymentModalCancel = document.getElementById('card-payment-modal-cancel');
  cardPaymentModalOverlay = document.getElementById('card-payment-modal-overlay');
  cardPaymentForm = document.getElementById('card-payment-form');

  if (registerCardPaymentBtn) registerCardPaymentBtn.onclick = openCardPaymentModal;
  if (cardPaymentModalClose) cardPaymentModalClose.onclick = closeCardPaymentModal;
  if (cardPaymentModalCancel) cardPaymentModalCancel.onclick = closeCardPaymentModal;
  if (cardPaymentModalOverlay) {
    cardPaymentModalOverlay.onclick = function (e) {
      if (e.target === cardPaymentModalOverlay) closeCardPaymentModal();
    };
  }

  // Change Listeners for Validation
  document.addEventListener('change', function (e) {
    if (['card-payment-card-select', 'card-payment-period-start', 'card-payment-period-end'].includes(e.target.id)) {
      validateCardPayment();
    }
  });
  document.addEventListener('input', function (e) {
    if (e.target.id === 'card-payment-amount') {
      const val = e.target.value;
      const num = removeCommas(val);
      e.target.value = formatNumberWithCommas(num);
      validateCardPayment();
    }
  });

  if (cardPaymentForm) {
    cardPaymentForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const cardName = document.getElementById('card-payment-card-select')?.value;
      const paymentDate = document.getElementById('card-payment-date')?.value;
      const amountRaw = document.getElementById('card-payment-amount')?.value;
      const amount = Number(removeCommas(amountRaw)) || 0;
      const account = document.getElementById('card-payment-account-select')?.value;
      const periodStart = document.getElementById('card-payment-period-start')?.value;
      const periodEnd = document.getElementById('card-payment-period-end')?.value;

      if (!cardName || !paymentDate || !amount || !account) { alert('필수 항목 누락'); return; }

      const newEntry = {
        id: Date.now(),
        date: paymentDate,
        user: '자동', type: 'expense', item: `${cardName} 대금`, category: '카드대금',
        amount: amount, paymentMethod: 'transfer', paymentDetail: account,
        isCardPayment: true, cardName: cardName, billingPeriod: `${periodStart}~${periodEnd}`,
        status: '완료', timestamp: Date.now()
      };

      transactionData.push(newEntry);
      // 레거시 호환성을 위해 transactionData에도 넣지만, 올바른 처리는 accountCardPayments에 넣는 것임.
      // 하지만 initCardPaymentModal은 구형 모달일 수 있으므로 일단 둠.
      // (기획서상: 계좌 관리 탭의 카드 명세서 등록이 주 타겟임)
      if (typeof saveData === 'function') saveData();
      if (typeof calculateAccountBalances === 'function') calculateAccountBalances();
      if (typeof updateDashboard === 'function') updateDashboard();

      alert('카드 대금 등록 완료');
      closeCardPaymentModal();
    });
  }
  console.log('CardPaymentModal 초기화 완료');
};

// ========================================
// Entry Auto Tab (Excel Parsing) Logic
// ========================================
window.initEntryAutoTab = function () {
  console.log('initEntryAutoTab 호출됨');

  // 파일 업로드 버튼
  document.addEventListener('click', function (e) {
    if (e.target.id === 'upload-entry-statement-btn') {
      const fileInput = document.getElementById('entry-statement-file');
      if (fileInput) fileInput.click();
    }
  });

  // 파일 변경 핸들러
  document.addEventListener('change', async function (e) {
    if (e.target.id === 'entry-statement-file') {
      const file = e.target.files[0];
      if (!file) return;

      const fileInfo = document.getElementById('entry-file-info');
      if (fileInfo) fileInfo.textContent = '파싱 중...';

      try {
        if (typeof window.parseCardStatement === 'function') {
          const result = await window.parseCardStatement(file);
          console.log('파싱 결과:', result);
          if (fileInfo) fileInfo.textContent = `✓ ${file.name} (${result.totalCount}건)`;

          // UI 업데이트 로직 (간소화)
          const parsedDataContainer = document.getElementById('entry-parsed-data');
          if (parsedDataContainer) {
            parsedDataContainer.innerHTML = `
                            <div>카드사: ${result.cardCompany}</div>
                            <div>거래건수: ${result.totalCount}</div>
                            <div>총금액: ${result.summary.totalAmount.toLocaleString()}원</div>
                        `;
          }

          // Add Transactions Listener
          // Note: This logic assumes Elements are freshly rendered if they were dynamic, 
          // but here we are just hooking textContent.
          // If there is an 'add-transactions-btn' logic, it should be attached here or delegated.
        } else {
          alert('parseCardStatement 함수를 찾을 수 없습니다. excel-parser.js 로드가 필요합니다.');
        }
      } catch (err) {
        console.error(err);
        if (fileInfo) fileInfo.textContent = '오류: ' + err.message;
        alert('파싱 실패');
      }
    }
  });
  console.log('EntryAutoTab 초기화 완료');
};

// 카드 대금 등록 폼 제출 핸들러
window.handleAccountTransactionCardFormSubmit = function (e) {
  e.preventDefault();

  const date = document.getElementById('account-transaction-card-date')?.value;
  const cardName = document.getElementById('account-transaction-card-select')?.value;
  const paymentAccount = document.getElementById('account-transaction-payment-account')?.value;
  const amountRaw = document.getElementById('account-transaction-card-amount')?.value || '';
  const amount = Number(removeCommas(amountRaw)) || 0;

  if (!date || !cardName || !paymentAccount || amount <= 0) {
    alert('모든 필수 항목을 입력해주세요.');
    return;
  }

  // 선택된 카드 정보 찾기
  const selectedCard = accountData.find(acc => acc.name === cardName && acc.type === 'card');
  if (!selectedCard) {
    alert('선택한 카드를 찾을 수 없습니다.');
    return;
  }

  const now = Date.now();
  // 1. 카드 대금 출금 내역 (통장에서 나감)
  const withdrawalEntry = {
    id: now,
    date: date,
    user: '공통', // 카드 대금은 보통 공통 지출
    type: 'expense',
    item: '카드대금',
    category: '금융/보험', // 또는 기타
    amount: amount,
    paymentMethod: 'transfer',
    paymentDetail: paymentAccount,
    merchant: cardName, // 거래처를 카드사로
    detail: `${cardName} 대금 결제`,
    status: '완료',
    timestamp: now
  };

  // 2. 카드 잔액 초기화 (혹은 차감) 로직?
  // 단순히 기록만 남기는 것이라면 여기서 끝.
  // 하지만 "카드 대금 결제"는 
  // a) 통장 잔액 감소 (위의 withdrawalEntry로 해결)
  // b) 카드 당월 사용금액 초기화 (accountData의 currentBalance 조정 필요?)
  //    -> 보통 카드 대금 결제 시 해당 달의 사용액이 0이 되는 게 아니라, "결제된 금액만큼" 한도가 복구되거나 미결제금액이 줄어드는 것.
  //    -> 현재 로직상 카드 currentBalance는 "이번 달 사용액"을 의미하는 경우가 많음.
  //    -> 여기서는 단순 기록만 하는 것으로 보임.

  transactionData.push(withdrawalEntry);

  if (typeof saveData === 'function') {
    saveData();
  }
  if (typeof calculateAccountBalances === 'function') {
    calculateAccountBalances();
  }

  const currentTab = window.currentActiveTab || 'dashboard';

  if (currentTab === 'accounts') {
    if (typeof renderAccountTransactionTable === 'function') {
      const accountSelect = document.getElementById('account-filter-select');
      const selectedAccount = accountSelect ? accountSelect.value : 'all';
      renderAccountTransactionTable(selectedAccount);
    }
    const accountsContainer = document.getElementById('accounts-container');
    const mainContent = document.getElementById('main-content');
    if (accountsContainer && typeof window.renderAccountsTab === 'function') {
      window.renderAccountsTab(accountsContainer);
    } else if (mainContent && typeof window.renderAccountsTab === 'function') {
      window.renderAccountsTab(mainContent);
    }
  }

  if (currentTab === 'dashboard') {
    if (typeof renderTable === 'function') renderTable();
    if (typeof renderCardTable === 'function') renderCardTable('all');
    if (typeof renderBankTable === 'function') renderBankTable();
  }

  if (typeof updateDashboard === 'function') {
    updateDashboard();
  }

  alert('카드 대금 결제가 등록되었습니다!');
  closeAccountTransactionModal();
};

window.initAccountTransactionModal = function () {
  console.log('initAccountTransactionModal 호출됨');
  accountTransactionModalOverlay = document.getElementById('account-transaction-modal-overlay');
  accountTransactionModalClose = document.getElementById('account-transaction-modal-close');
  accountTransactionModalCancel = document.getElementById('account-transaction-modal-cancel');
  accountTransactionCardModalCancel = document.getElementById('account-transaction-card-modal-cancel');
  accountTransactionForm = document.getElementById('account-transaction-form');
  accountTransactionCardForm = document.getElementById('account-transaction-card-form');

  // 탭 전환 로직
  if (accountTransactionModalOverlay) {
    const tabBtns = accountTransactionModalOverlay.querySelectorAll('.entry-tab-btn');
    const generalTab = document.getElementById('account-transaction-tab-general');
    const cardStatementTab = document.getElementById('account-transaction-tab-card-statement');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;

        // 탭 스타일 초기화
        tabBtns.forEach(b => {
          b.classList.remove('active');
          b.style.color = '#6B7280';
          b.style.fontWeight = '500';
          b.style.borderBottomColor = 'transparent';
        });
        // 선택된 탭 스타일 적용
        btn.classList.add('active');
        btn.style.color = '#EF4444';
        btn.style.fontWeight = '600';
        btn.style.borderBottomColor = '#EF4444';

        // 콘텐츠 표시 전환
        if (tabName === 'general') {
          if (generalTab) generalTab.style.display = 'block';
          if (cardStatementTab) cardStatementTab.style.display = 'none';
          if (typeof window.updateAccountTransactionCategoryOptions === 'function') {
            window.updateAccountTransactionCategoryOptions();
          }
        } else {
          if (generalTab) generalTab.style.display = 'none';
          if (cardStatementTab) cardStatementTab.style.display = 'block';
          updateAccountTransactionCardOptions();
          const dateInput = document.getElementById('account-transaction-card-date');
          if (dateInput && !dateInput.value) {
            dateInput.value = new Date().toISOString().split('T')[0];
          }
        }
      });
    });

    // Change 이벤트 델리게이션 (이전 코드 복원)
    accountTransactionModalOverlay.addEventListener('change', function (e) {
      if (e.target.id === 'account-transaction-card-select') {
        updateCardPaymentInfo(e.target.value);
      }
      if (e.target.id === 'account-transaction-card-date') {
        const cardSelect = document.getElementById('account-transaction-card-select');
        if (cardSelect && cardSelect.value) {
          updateCardPaymentInfo(cardSelect.value);
        }
      }
      if (e.target.name === 'account-transaction-type' && e.target.type === 'radio') {
        if (typeof window.updateAccountTransactionCategoryOptions === 'function') {
          window.updateAccountTransactionCategoryOptions();
        }
      }
      if (e.target.id === 'account-transaction-category-kind') {
        if (typeof window.updateAccountTransactionItemOptions === 'function') {
          window.updateAccountTransactionItemOptions();
        }
      }
    });

    // 닫기 버튼 리스너
    if (accountTransactionModalClose) {
      accountTransactionModalClose.addEventListener('click', closeAccountTransactionModal);
    }
    if (accountTransactionModalCancel) {
      accountTransactionModalCancel.addEventListener('click', closeAccountTransactionModal);
    }
    if (accountTransactionCardModalCancel) {
      accountTransactionCardModalCancel.addEventListener('click', closeAccountTransactionModal);
    }
    // 오버레이 클릭 닫기
    accountTransactionModalOverlay.addEventListener('click', (e) => {
      if (e.target === accountTransactionModalOverlay) closeAccountTransactionModal();
    });
  }

  if (accountTransactionForm) {
    accountTransactionForm.addEventListener('submit', handleAccountTransactionFormSubmit);
  }
  if (accountTransactionCardForm) {
    accountTransactionCardForm.addEventListener('submit', handleAccountTransactionCardFormSubmit);
  }

  console.log('AccountTransactionModal 초기화 완료');
}; date: date,
  user: '-',
    type: 'expense',
      item: `${selectedCard.name} 결제`,
        category: '카드대금',
          amount: amount,
            paymentMethod: 'transfer',
              paymentDetail: paymentAccount,
                status: '✅완료',
                  timestamp: now,
                    isAutoGenerated: false // 수동 등록이므로 false
    };

transactionData.push(newEntry);

if (typeof saveData === 'function') {
  saveData();
}

// 계좌 잔액 자동 재계산 (카드 대금 반영)
if (typeof calculateAccountBalances === 'function') {
  calculateAccountBalances();
}

// 현재 활성 탭 확인 후 해당 탭의 렌더 함수 호출
const currentTab = window.currentActiveTab || 'dashboard';

// 계좌 입출금 관리 탭 갱신
if (currentTab === 'accounts') {
  if (typeof renderAccountTransactionTable === 'function') {
    const accountSelect = document.getElementById('account-filter-select');
    const selectedAccount = accountSelect ? accountSelect.value : 'all';
    renderAccountTransactionTable(selectedAccount);
  }
  // 계좌 목록도 갱신 (잔액 반영을 위해)
  // accounts-container가 없으면 main-content를 직접 사용
  const accountsContainer = document.getElementById('accounts-container');
  const mainContent = document.getElementById('main-content');
  if (accountsContainer && typeof window.renderAccountsTab === 'function') {
    window.renderAccountsTab(accountsContainer);
  } else if (mainContent && typeof window.renderAccountsTab === 'function') {
    window.renderAccountsTab(mainContent);
  }
}

// 월별 현황 탭도 갱신
if (currentTab === 'dashboard') {
  if (typeof renderTable === 'function') {
    renderTable();
  }
  if (typeof renderCardTable === 'function') {
    renderCardTable('all');
  }
  if (typeof renderBankTable === 'function') {
    renderBankTable();
  }
}

// 대시보드는 항상 업데이트
if (typeof updateDashboard === 'function') {
  updateDashboard();
}

alert('카드 대금이 등록되었습니다!');
closeAccountTransactionModal();
  });
}

// ========================================
// Account Management Functions (Added for Compatibility)
// ========================================
// Note: editingAccountId is declared at module scope around line 1371

window.editAccount = function (id) {
  const account = accountData.find(acc => acc.id === id);
  if (!account) {
    alert('해당 계좌를 찾을 수 없습니다.');
    return;
  }

  editingAccountId = id;
  if (accountModalTitle) {
    accountModalTitle.textContent = '📝 계좌 수정';
  }

  // Populate Form
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
    if (typeof window.updateAccountTypeFields === 'function') {
      window.updateAccountTypeFields();
    }
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
      if (typeof window.updateLinkedAccountOptions === 'function') {
        window.updateLinkedAccountOptions();
      }
      linkedAccountSelect.value = account.linkedAccount || '';
    }
  }

  if (typeof window.openAccountModal === 'function') {
    window.openAccountModal(true);
  }
};

window.deleteAccount = function (id) {
  if (confirm('정말 삭제하시겠습니까?')) {
    const index = accountData.findIndex(acc => acc.id === id);
    if (index > -1) {
      accountData.splice(index, 1);
      if (typeof saveAccountData === 'function') saveAccountData();
      if (typeof calculateAccountBalances === 'function') calculateAccountBalances();

      // Refresh Tables
      const otherContent = document.getElementById('other-tab-content');
      if (otherContent && otherContent.style.display !== 'none') {
        if (typeof renderAccountsTab === 'function') renderAccountsTab(otherContent);
        else if (window.renderAccountsTab) window.renderAccountsTab(otherContent);
      }

      if (typeof updateDashboard === 'function') updateDashboard();
      alert('삭제되었습니다!');
    } else {
      alert('해당 계좌를 찾을 수 없습니다.');
    }
  }
};

// ========================================
// Card Select Helper Functions (Added for Compatibility)
// ========================================

// 카드 선택 드롭다운 업데이트 (결제수단용)
window.updatePaymentCardSelects = function () {
  // 신용카드 선택
  const creditSelect = document.querySelector('select[name="credit-card"]');
  if (creditSelect) {
    creditSelect.innerHTML = '<option value="">--선택--</option>';
    if (cardData) {
      cardData.filter(c => c.type === 'credit').forEach(card => {
        const option = document.createElement('option');
        option.value = card.name;
        option.textContent = card.name;
        creditSelect.appendChild(option);
      });
    }
  }

  // 체크카드 선택
  const debitSelect = document.querySelector('select[name="debit-card"]');
  if (debitSelect) {
    debitSelect.innerHTML = '<option value="">--선택--</option>';
    if (cardData) {
      cardData.filter(c => c.type === 'debit').forEach(card => {
        const option = document.createElement('option');
        option.value = card.name;
        option.textContent = card.name;
        debitSelect.appendChild(option);
      });
    }
  }
};

// 카드 대금 등록 모달의 카드 선택 업데이트
window.updateCardPaymentCardSelect = function (selectedCompany) {
  const cardSelect = document.getElementById('card-payment-card-select');
  if (!cardSelect) return;

  cardSelect.innerHTML = '<option value="">--선택--</option>';

  if (selectedCompany && cardData) {
    cardData.filter(c => c.cardCompany === selectedCompany).forEach(card => {
      const option = document.createElement('option');
      option.value = card.name;
      option.textContent = card.name;
      cardSelect.appendChild(option);
    });
  }
};

// 자동 입력 탭의 카드 선택 업데이트
window.updateEntryAutoCardSelect = function (selectedCompany) {
  const cardSelect = document.getElementById('entry-auto-card-select');
  if (!cardSelect) return;

  cardSelect.innerHTML = '<option value="">--카드사를 먼저 선택하세요--</option>';

  if (selectedCompany && cardData) {
    cardData.filter(c => c.cardCompany === selectedCompany).forEach(card => {
      const option = document.createElement('option');
      option.value = card.name;
      option.textContent = card.name;
      cardSelect.appendChild(option);
    });
  }
};

// 모든 카드 선택 드롭다운 업데이트
window.updateCardSelects = function () {
  if (typeof window.updatePaymentCardSelects === 'function') window.updatePaymentCardSelects();

  // 카드 대금 등록 모달이 열려있으면 카드사 선택에 따라 업데이트
  const cardCompanySelect = document.getElementById('card-payment-card-company-select');
  if (cardCompanySelect && cardCompanySelect.value) {
    if (typeof window.updateCardPaymentCardSelect === 'function') window.updateCardPaymentCardSelect(cardCompanySelect.value);
  }

  // 자동 입력 탭의 카드 선택 업데이트
  const entryCardCompanySelect = document.getElementById('entry-auto-card-company');
  if (entryCardCompanySelect && entryCardCompanySelect.value) {
    if (typeof window.updateEntryAutoCardSelect === 'function') window.updateEntryAutoCardSelect(entryCardCompanySelect.value);
  }
};

console.log('modal.js 로드 완료');
