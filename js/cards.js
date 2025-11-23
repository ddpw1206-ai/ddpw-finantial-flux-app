// ========================================
// 결제수단 관리 탭 (독립화 및 카드 매핑 데이터 관리)
// ========================================

let editingCardId = null;

function initCards() {
  console.log('결제수단 관리 초기화');
  
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;
  
  // mainContent 완전히 비우기 (중복 방지)
  mainContent.innerHTML = '';
  
  // 결제수단 관리 컨테이너 생성
  const paymentMethodsContainer = document.createElement('div');
  paymentMethodsContainer.id = 'payment-methods-container';
  mainContent.appendChild(paymentMethodsContainer);
  
  renderPaymentMethodsTab(paymentMethodsContainer);
  
  console.log('결제수단 관리 탭 렌더링 완료');
}

// ========================================
// 결제수단 관리 탭 렌더링
// ========================================
function renderPaymentMethodsTab(container) {
  container.innerHTML = `
    <style>
      .cards-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 32px;
      }
      .cards-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: #111827;
      }
      .add-card-btn {
        background: #3B82F6;
        color: #fff;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 0.95rem;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s;
      }
      .add-card-btn:hover {
        background: #2563eb;
      }
      .payment-methods-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 24px;
      }
      .payment-section {
        background: #FFFFFF;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        border: 1px solid #E5E7EB;
      }
      .card-company-group {
        background: #FFFFFF;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        border: 1px solid #E5E7EB;
      }
      .company-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 2px solid #E5E7EB;
      }
      .company-name {
        font-size: 1.25rem;
        font-weight: 700;
        color: #111827;
      }
      .add-card-to-company-btn {
        background: #F3F4F6;
        color: #374151;
        border: 1px solid #D1D5DB;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.2s;
      }
      .add-card-to-company-btn:hover {
        background: #E5E7EB;
      }
      .card-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .card-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        background: #F9FAFB;
        border-radius: 8px;
        border: 1px solid #E5E7EB;
        transition: all 0.2s;
      }
      .card-item:hover {
        background: #F3F4F6;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      }
      .card-info {
        flex: 1;
      }
      .card-name {
        font-weight: 600;
        color: #111827;
        margin-bottom: 4px;
        font-size: 1rem;
      }
      .card-meta {
        font-size: 0.85rem;
        color: #6B7280;
      }
      .card-actions {
        display: flex;
        gap: 8px;
      }
      .card-action-btn {
        padding: 6px 12px;
        border: 1px solid;
        border-radius: 6px;
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.2s;
        background: #FFFFFF;
      }
      .card-edit-btn {
        border-color: #3B82F6;
        color: #3B82F6;
      }
      .card-edit-btn:hover {
        background: #3B82F6;
        color: #fff;
      }
      .card-delete-btn {
        border-color: #DC2626;
        color: #DC2626;
      }
      .card-delete-btn:hover {
        background: #DC2626;
        color: #fff;
      }
      .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: #6B7280;
      }
      .empty-state-icon {
        font-size: 3rem;
        margin-bottom: 16px;
      }
      .empty-state-text {
        font-size: 1rem;
        margin-bottom: 8px;
      }
      .empty-state-hint {
        font-size: 0.9rem;
        color: #9CA3AF;
      }
    </style>
    
    <div class="cards-header">
      <h2 class="cards-title">💳 결제수단 관리</h2>
      <button class="add-card-btn" id="add-payment-method-btn">+ 결제수단 추가</button>
    </div>
    
    <div class="payment-methods-grid" id="payment-methods-grid">
      <!-- 카드사별 결제수단 목록이 여기에 동적으로 추가됨 -->
    </div>
  `;
  
  // 결제수단 목록 렌더링 (cardData 기반)
  renderPaymentMethodsList();
  
  // 결제수단 추가 버튼 이벤트
  const addPaymentMethodBtn = container.querySelector('#add-payment-method-btn');
  if (addPaymentMethodBtn) {
    addPaymentMethodBtn.addEventListener('click', () => {
      if (typeof window.openCardManageModal === 'function') {
        window.openCardManageModal(false);
      }
    });
  }
}

// ========================================
// 결제수단 목록 렌더링 (카드사별 그룹화, cardData 기반)
// ========================================
function renderPaymentMethodsList() {
  const paymentMethodsGrid = document.getElementById('payment-methods-grid');
  if (!paymentMethodsGrid) return;
  
  paymentMethodsGrid.innerHTML = '';
  
  // cardData가 없거나 비어있으면
  if (!cardData || cardData.length === 0) {
    paymentMethodsGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">💳</div>
        <div class="empty-state-text">등록된 결제수단이 없습니다</div>
        <div class="empty-state-hint">결제수단 추가 버튼을 클릭하여 결제수단을 등록해주세요.</div>
      </div>
    `;
    return;
  }
  
  // 카드사별로 그룹화
  const groupedByCompany = {};
  cardData.forEach(card => {
    const company = card.cardCompany || '미지정';
    if (!groupedByCompany[company]) {
      groupedByCompany[company] = [];
    }
    groupedByCompany[company].push(card);
  });
  
  // 카드사별로 그룹 렌더링
  Object.keys(groupedByCompany).sort().forEach(company => {
    const companyGroup = document.createElement('div');
    companyGroup.className = 'payment-section';
    
    const cards = groupedByCompany[company];
    
    companyGroup.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid #E5E7EB;">
        <h3 style="font-size: 1.1rem; font-weight: 600; color: #111827; margin: 0;">${company}</h3>
        <button class="add-card-to-company-btn" data-company="${company}" style="background: #F3F4F6; color: #374151; border: 1px solid #D1D5DB; padding: 6px 12px; border-radius: 6px; font-size: 0.85rem; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#E5E7EB'" onmouseout="this.style.background='#F3F4F6'">+ 카드 추가</button>
      </div>
      <div class="card-list">
        ${cards.map(card => `
          <div class="card-item">
            <div class="card-info">
              <div class="card-name">${card.name}</div>
              <div class="card-meta">
                ${card.type === 'credit' ? '신용카드' : '체크카드'}
              </div>
            </div>
            <div class="card-actions">
              <button class="card-action-btn card-edit-btn" onclick="editCard(${card.id})">수정</button>
              <button class="card-action-btn card-delete-btn" onclick="deleteCard(${card.id})">삭제</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    
    paymentMethodsGrid.appendChild(companyGroup);
  });
  
  // 카드사별 카드 추가 버튼 이벤트
  const addCardToCompanyBtns = paymentMethodsGrid.querySelectorAll('.add-card-to-company-btn');
  addCardToCompanyBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const company = this.getAttribute('data-company');
      if (typeof window.openCardManageModal === 'function') {
        window.openCardManageModal(false, null, false, company);
      }
    });
  });
  
  console.log('결제수단 목록 렌더링 완료:', cardData.length, '개 카드');
}


// ========================================
// 결제수단 추가 모달 열기 (전역으로 노출)
// ========================================
window.openPaymentMethodModal = function() {
  // 계좌 추가 모달 열기 (기존 계좌 추가 모달 재사용)
  if (typeof window.openAccountModal === 'function') {
    window.openAccountModal(false);
  }
};

// ========================================
// 카드 목록 렌더링 (카드사별 그룹화) - 모달용
// ========================================
function renderCardList() {
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
        <button type="button" onclick="editCard(${card.id})" style="padding: 6px 12px; border: 1px solid #3B82F6; border-radius: 6px; font-size: 0.85rem; background: #FFFFFF; color: #3B82F6; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#3B82F6'; this.style.color='#fff'" onmouseout="this.style.background='#FFFFFF'; this.style.color='#3B82F6'">수정</button>
        <button type="button" onclick="deleteCard(${card.id})" style="padding: 6px 12px; border: 1px solid #DC2626; border-radius: 6px; font-size: 0.85rem; background: #FFFFFF; color: #DC2626; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#DC2626'; this.style.color='#fff'" onmouseout="this.style.background='#FFFFFF'; this.style.color='#DC2626'">삭제</button>
      </div>
    `;
    cardList.appendChild(item);
  });
}

// ========================================
// 카드 관리 모달 열기
// ========================================
window.openCardManageModal = function(isEdit = false, cardId = null, isCompanyMode = false, preSelectedCompany = null) {
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
    
    // 카드사 모드인 경우 카드사 선택 필드에 미리 선택
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
  
  // 모달 내부의 카드 목록 렌더링 (모달이 열려있을 때만)
  const cardListInModal = document.getElementById('card-list');
  if (cardListInModal) {
    renderCardListInModal();
  }
};

// ========================================
// 카드 관리 모달 닫기
// ========================================
window.closeCardManageModal = function() {
  const modal = document.getElementById('card-manage-modal-overlay');
  if (!modal) return;
  
  modal.style.display = 'none';
  document.body.style.overflow = '';
  
  const form = document.getElementById('card-manage-form');
  if (form) {
    form.reset();
  }
  
  editingCardId = null;
};

// ========================================
// 모달 내부 카드 목록 렌더링 (모달용)
// ========================================
function renderCardListInModal() {
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
        <button type="button" onclick="editCard(${card.id})" style="padding: 6px 12px; border: 1px solid #3B82F6; border-radius: 6px; font-size: 0.85rem; background: #FFFFFF; color: #3B82F6; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#3B82F6'; this.style.color='#fff'" onmouseout="this.style.background='#FFFFFF'; this.style.color='#3B82F6'">수정</button>
        <button type="button" onclick="deleteCard(${card.id})" style="padding: 6px 12px; border: 1px solid #DC2626; border-radius: 6px; font-size: 0.85rem; background: #FFFFFF; color: #DC2626; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#DC2626'; this.style.color='#fff'" onmouseout="this.style.background='#FFFFFF'; this.style.color='#DC2626'">삭제</button>
      </div>
    `;
    cardList.appendChild(item);
  });
}

// ========================================
// 카드 수정
// ========================================
window.editCard = function(id) {
  const card = cardData.find(c => c.id === id);
  if (!card) {
    alert('해당 카드를 찾을 수 없습니다.');
    return;
  }
  
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

// ========================================
// 카드 삭제
// ========================================
window.deleteCard = function(id) {
  if (confirm('정말 삭제하시겠습니까?')) {
    const index = cardData.findIndex(c => c.id === id);
    if (index > -1) {
      cardData.splice(index, 1);
      if (typeof saveCardData === 'function') {
        saveCardData();
      }
      renderCardList();
      // 결제수단 관리 탭이 열려있으면 다시 렌더링
      if (typeof currentActiveTab !== 'undefined' && currentActiveTab === 'cards') {
        const paymentMethodsContainer = document.getElementById('payment-methods-container');
        if (paymentMethodsContainer && typeof renderPaymentMethodsTab === 'function') {
          renderPaymentMethodsTab(paymentMethodsContainer);
        }
      }
      if (typeof updateCardSelects === 'function') {
        updateCardSelects(); // 모든 카드 선택 드롭다운 업데이트
      }
      alert('삭제되었습니다!');
    }
  }
};

// ========================================
// 카드 관리 폼 제출 이벤트 리스너 등록
// ========================================
function initCardManageForm() {
  const cardManageForm = document.getElementById('card-manage-form');
  if (!cardManageForm) return;
  
  // 기존 이벤트 리스너 제거 후 재등록 (중복 방지)
  const newForm = cardManageForm.cloneNode(true);
  cardManageForm.parentNode.replaceChild(newForm, cardManageForm);
  
  newForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('card-manage-name')?.value;
    const typeRadios = newForm.querySelectorAll('input[name="card-type"]');
    const type = Array.from(typeRadios).find(radio => radio.checked)?.value;
    const cardCompany = document.getElementById('card-manage-company')?.value;
    
    if (!name) {
      alert('카드명을 입력해주세요.');
      return;
    }
    if (!type) {
      alert('카드 유형을 선택해주세요.');
      return;
    }
    if (!cardCompany) {
      alert('카드사를 선택해주세요.');
      return;
    }
    
    if (editingCardId) {
      // 수정 모드
      const index = cardData.findIndex(c => c.id === editingCardId);
      if (index > -1) {
        cardData[index] = {
          ...cardData[index],
          name: name,
          type: type,
          cardCompany: cardCompany
        };
        if (typeof saveCardData === 'function') {
          saveCardData();
        }
      renderCardList();
      renderCardListInModal();
      // 결제수단 관리 탭이 열려있으면 다시 렌더링
      if (typeof currentActiveTab !== 'undefined' && currentActiveTab === 'cards') {
        const paymentMethodsContainer = document.getElementById('payment-methods-container');
        if (paymentMethodsContainer && typeof renderPaymentMethodsTab === 'function') {
          renderPaymentMethodsTab(paymentMethodsContainer);
        }
      }
      if (typeof updateCardSelects === 'function') {
        updateCardSelects();
      }
      alert('수정되었습니다!');
      closeCardManageModal();
    }
  } else {
    // 신규 추가 모드
    const now = Date.now();
    const newCard = {
      id: now,
      name: name,
      type: type,
      cardCompany: cardCompany
    };
    cardData.push(newCard);
    if (typeof saveCardData === 'function') {
      saveCardData();
    }
    renderCardList();
    renderCardListInModal();
    // 결제수단 관리 탭이 열려있으면 다시 렌더링
    if (typeof currentActiveTab !== 'undefined' && currentActiveTab === 'cards') {
      const paymentMethodsContainer = document.getElementById('payment-methods-container');
      if (paymentMethodsContainer && typeof renderPaymentMethodsTab === 'function') {
        renderPaymentMethodsTab(paymentMethodsContainer);
      }
    }
    if (typeof updateCardSelects === 'function') {
      updateCardSelects();
    }
    alert('카드가 추가되었습니다!');
    closeCardManageModal();
  }
  });
}

// ========================================
// 카드 관리 모달 이벤트 리스너 등록
// ========================================
function initCardManageModal() {
  const cardManageModalClose = document.getElementById('card-manage-modal-close');
  const cardManageModalCancel = document.getElementById('card-manage-modal-cancel');
  const cardManageModalOverlay = document.getElementById('card-manage-modal-overlay');
  
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
}

// DOMContentLoaded 시 이벤트 리스너 등록
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    initCardManageForm();
    initCardManageModal();
  });
} else {
  initCardManageForm();
  initCardManageModal();
}

console.log('cards.js 로드 완료');

