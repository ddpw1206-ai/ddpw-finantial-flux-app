// ========================================
// 모달 관련 함수 (rollback.html에서 복원)
// ========================================

// 모달 DOM 요소 참조
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close-btn');
const modalCancel = document.getElementById('modal-cancel-btn');
const form = document.getElementById('entry-form');
const modalTitle = document.querySelector('.modal-title');
const methodSelect = document.getElementById('entry-method');
const paymentCredit = document.getElementById('payment-credit');
const paymentDebit = document.getElementById('payment-debit');
const paymentTransfer = document.getElementById('payment-transfer');
const paymentCash = document.getElementById('payment-cash');

// ========================================
// 모달 열기/닫기 함수 (전역으로 노출)
// ========================================
window.closeModal = function() {
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

window.openModal = function(isEdit = false) {
  if (modalOverlay) {
    modalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
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
      if (methodSelect && typeof window.updatePaymentFields === 'function') {
        window.updatePaymentFields();
      }
      if (modalTitle) {
        modalTitle.textContent = '📝 내역 입력';
      }
    }
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
  modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) {
      if (typeof window.closeModal === 'function') {
        window.closeModal();
      }
    }
  });
}

window.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && modalOverlay && modalOverlay.style.display === 'flex') {
    if (typeof window.closeModal === 'function') {
      window.closeModal();
    }
  }
});

// ========================================
// 카테고리 업데이트 함수 (전역으로 노출)
// ========================================
window.updateCategoryOptions = function() {
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
window.updateItemOptions = function() {
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
      radio.addEventListener('change', function() {
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
  categorySelect.addEventListener('change', function() {
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
window.updatePaymentOptions = function() {
  // 신용카드 옵션 업데이트 (기존 방식 유지)
  const creditSelect = document.getElementById('credit-card-select') || document.querySelector('select[name="credit-card"]');
  if (creditSelect) {
    creditSelect.innerHTML = '<option value="">--선택--</option>';
    if (typeof cardData !== 'undefined' && Array.isArray(cardData)) {
      cardData.filter(c => c.type === 'credit').forEach(card => {
        const option = document.createElement('option');
        option.value = card.name;
        option.textContent = card.name;
        creditSelect.appendChild(option);
      });
    } else if (typeof accountData !== 'undefined' && Array.isArray(accountData)) {
      accountData.filter(acc => acc.type === 'card' && acc.creditLimit).forEach(account => {
        const option = document.createElement('option');
        option.value = account.name;
        option.textContent = account.name;
        creditSelect.appendChild(option);
      });
    }
  }
  
  // 체크카드 옵션 업데이트 (기존 방식 유지)
  const debitSelect = document.getElementById('debit-card-select') || document.querySelector('select[name="debit-card"]');
  if (debitSelect) {
    debitSelect.innerHTML = '<option value="">--선택--</option>';
    if (typeof accountData !== 'undefined' && Array.isArray(accountData)) {
      accountData.filter(acc => acc.type === 'card' && !acc.creditLimit).forEach(account => {
        const option = document.createElement('option');
        option.value = account.name;
        option.textContent = account.name;
        debitSelect.appendChild(option);
      });
    }
  }
  
  // 계좌이체 옵션 업데이트
  const transferSelect = document.getElementById('transfer-account-select') || document.querySelector('select[name="transfer-account"]');
  if (transferSelect) {
    transferSelect.innerHTML = '<option value="">--선택--</option>';
    if (typeof accountData !== 'undefined' && Array.isArray(accountData)) {
      accountData.filter(acc => acc.type === 'bank').forEach(account => {
        const option = document.createElement('option');
        option.value = account.name;
        option.textContent = account.name;
        transferSelect.appendChild(option);
      });
    }
  }
  
  // 현금 출금계좌 옵션 업데이트
  const cashSelect = document.getElementById('cash-account-select') || document.querySelector('select[name="cash-account"]');
  if (cashSelect) {
    cashSelect.innerHTML = '<option value="">--선택--</option>';
    if (typeof accountData !== 'undefined' && Array.isArray(accountData)) {
      accountData.filter(acc => acc.type === 'bank').forEach(account => {
        const option = document.createElement('option');
        option.value = account.name;
        option.textContent = account.name;
        cashSelect.appendChild(option);
      });
    }
  }
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

window.updatePaymentFields = function() {
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
      companySelect.addEventListener('change', function() {
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
      bankSelect.addEventListener('change', function() {
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
  methodSelect.addEventListener('change', function() {
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
  amountInput.addEventListener('input', function(e) {
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
  amountInput.addEventListener('blur', function(e) {
    const value = e.target.value;
    if (value) {
      e.target.value = formatNumberWithCommas(removeCommas(value));
    }
  });
}

// ========================================
// 폼 제출 (데이터 저장/수정)
// ========================================
if (form) {
  form.addEventListener('submit', function(e) {
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
      if (typeof renderTable === 'function') {
        renderTable();
      }
      if (typeof renderCardTable === 'function') {
        renderCardTable('all');
      }
      if (typeof renderBankTable === 'function') {
        renderBankTable();
      }
      if (typeof updateDashboard === 'function') {
        updateDashboard();
      }
      alert('저장되었습니다!');
      if (typeof window.closeModal === 'function') {
        window.closeModal();
      }
    }
  });
}

// ========================================
// 수정 기능
// ========================================
window.editTransaction = function(id) {
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
window.deleteTransaction = function(id) {
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
window.updateMerchantHistorySelect = function() {
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
window.renderMerchantList = function() {
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
window.removeMerchantFromHistory = function(index) {
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
window.openMerchantManageModal = function() {
  const modal = document.getElementById('merchant-modal-overlay');
  if (modal) {
    if (typeof window.renderMerchantList === 'function') {
      window.renderMerchantList();
    }
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

window.closeMerchantManageModal = function() {
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
const merchantManageBtn = document.getElementById('merchant-manage-btn');
const merchantModalClose = document.getElementById('merchant-modal-close-btn');
const merchantModalCancel = document.getElementById('merchant-modal-cancel-btn');
const merchantModalOverlay = document.getElementById('merchant-modal-overlay');
const merchantAddBtn = document.getElementById('merchant-add-btn');
const merchantAddInput = document.getElementById('merchant-add-input');

if (merchantManageBtn) {
    merchantManageBtn.addEventListener('click', function() {
      if (typeof window.openMerchantManageModal === 'function') {
        window.openMerchantManageModal();
      }
    });
}

if (merchantModalClose) {
  merchantModalClose.addEventListener('click', function() {
    if (typeof window.closeMerchantManageModal === 'function') {
      window.closeMerchantManageModal();
    }
  });
}

if (merchantModalCancel) {
  merchantModalCancel.addEventListener('click', function() {
    if (typeof window.closeMerchantManageModal === 'function') {
      window.closeMerchantManageModal();
    }
  });
}

if (merchantModalOverlay) {
  merchantModalOverlay.addEventListener('click', function(e) {
      if (e.target === merchantModalOverlay) {
        if (typeof window.closeMerchantManageModal === 'function') {
          window.closeMerchantManageModal();
        }
      }
  });
}

// 새 항목 추가
if (merchantAddBtn && merchantAddInput) {
  merchantAddBtn.addEventListener('click', function() {
    const value = merchantAddInput.value.trim();
    if (value) {
      addToMerchantHistory(value);
      merchantAddInput.value = '';
      if (typeof window.renderMerchantList === 'function') {
        window.renderMerchantList();
      }
    }
  });
  
  merchantAddInput.addEventListener('keypress', function(e) {
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
document.addEventListener('change', function(e) {
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
const accountModalOverlay = document.getElementById('account-modal-overlay');
const accountModalClose = document.getElementById('account-modal-close-btn');
const accountModalCancel = document.getElementById('account-modal-cancel-btn');
const accountForm = document.getElementById('account-form');
const accountModalTitle = document.getElementById('account-modal-title');

window.closeAccountModal = function() {
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

window.openAccountModal = function(isEdit = false) {
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

window.updateAccountTypeFields = function() {
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

window.updateLinkedAccountOptions = function() {
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
    radio.addEventListener('change', function() {
      if (typeof window.updateAccountTypeFields === 'function') {
        window.updateAccountTypeFields();
      }
    });
  });
}

// 계좌 모달 닫기 이벤트
  if (accountModalClose) {
    accountModalClose.addEventListener('click', function() {
      if (typeof window.closeAccountModal === 'function') {
        window.closeAccountModal();
      }
    });
  }
  if (accountModalCancel) {
    accountModalCancel.addEventListener('click', function() {
      if (typeof window.closeAccountModal === 'function') {
        window.closeAccountModal();
      }
    });
  }
  if (accountModalOverlay) {
    accountModalOverlay.addEventListener('click', function(e) {
      if (e.target === accountModalOverlay) {
        if (typeof window.closeAccountModal === 'function') {
          window.closeAccountModal();
        }
      }
    });
  }

// 계좌 폼 제출
if (accountForm) {
  accountForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('account-name')?.value;
    const typeRadios = accountForm.querySelectorAll('input[name="account-type"]');
    const type = Array.from(typeRadios).find(radio => radio.checked)?.value;
    const initialBalanceRaw = document.getElementById('account-initial-balance')?.value || '0';
    const initialBalance = Number(removeCommas(initialBalanceRaw)) || 0;
    
    if (!name) {
      alert('계좌명을 입력해주세요.');
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
  });
}

// 계좌 수정 함수
window.editAccount = function(id) {
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
  const typeRadios = accountForm ? accountForm.querySelectorAll('input[name="account-type"]') : [];
  const initialBalanceInput = document.getElementById('account-initial-balance');
  const creditLimitInput = document.getElementById('account-credit-limit');
  const paymentDayInput = document.getElementById('account-payment-day');
  const linkedAccountSelect = document.getElementById('account-linked-account');
  
  if (nameInput) nameInput.value = account.name;
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
window.deleteAccount = function(id) {
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
const accountTransactionModalOverlay = document.getElementById('account-transaction-modal-overlay');
const accountTransactionModalClose = document.getElementById('account-transaction-modal-close');
const accountTransactionModalCancel = document.getElementById('account-transaction-modal-cancel');
const accountTransactionCardModalCancel = document.getElementById('account-transaction-card-modal-cancel');
const accountTransactionForm = document.getElementById('account-transaction-form');
const accountTransactionCardForm = document.getElementById('account-transaction-card-form');

// 계좌 입출금 내역 등록 모달 열기 (전역으로 노출)
window.openAccountTransactionModal = function() {
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
      
      newAmountInput.addEventListener('input', function(e) {
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
window.closeAccountTransactionModal = function() {
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
  accountTransactionModalOverlay.addEventListener('click', function(e) {
    if (e.target === accountTransactionModalOverlay) {
      closeAccountTransactionModal();
    }
  });
}

// 탭 전환 이벤트
if (accountTransactionModalOverlay) {
  accountTransactionModalOverlay.addEventListener('click', function(e) {
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
if (accountTransactionModalOverlay) {
  accountTransactionModalOverlay.addEventListener('change', function(e) {
    // 카드 선택 시 정보 업데이트
    if (e.target.id === 'account-transaction-card-select') {
      updateCardPaymentInfo(e.target.value);
    }
    if (e.target.id === 'account-transaction-card-date') {
      const cardSelect = document.getElementById('account-transaction-card-select');
      if (cardSelect && cardSelect.value) {
        updateCardPaymentInfo(cardSelect.value);
      }
    }
    
    // 구분(수입/지출) 라디오 버튼 변경 시 카테고리 옵션 업데이트
    if (e.target.name === 'account-transaction-type' && e.target.type === 'radio') {
      console.log('구분 변경:', e.target.value);
      if (typeof window.updateAccountTransactionCategoryOptions === 'function') {
        window.updateAccountTransactionCategoryOptions();
      }
    }
    
    // 카테고리 선택 시 항목 옵션 업데이트
    if (e.target.id === 'account-transaction-category-kind') {
      console.log('카테고리 변경:', e.target.value);
      if (typeof window.updateAccountTransactionItemOptions === 'function') {
        window.updateAccountTransactionItemOptions();
      }
    }
  });
}

// 계좌 입출금 내역 등록 - 카테고리 옵션 업데이트 함수
window.updateAccountTransactionCategoryOptions = function() {
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
window.updateAccountTransactionItemOptions = function() {
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
if (accountTransactionForm) {
  accountTransactionForm.addEventListener('submit', function(e) {
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
    
    transactionData.push(newEntry);
    
    if (typeof saveData === 'function') {
      saveData();
    }
    
    // 계좌 잔액 자동 재계산 (입출금 내역 반영)
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
  });
}

// 카드 대금 등록 폼 제출
if (accountTransactionCardForm) {
  accountTransactionCardForm.addEventListener('submit', function(e) {
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
    const newEntry = {
      id: now,
      date: date,
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

console.log('modal.js 로드 완료');
