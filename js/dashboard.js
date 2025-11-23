// ========================================
// 대시보드 탭 초기화 및 렌더링 (rollback.html에서 복원)
// ========================================

// 검색/정렬 전역 변수
let currentSearchKeyword = '';
let currentSortType = 'date-desc';

// ========================================
// 대시보드 렌더링 함수 (mainContent를 파라미터로 받음)
// ========================================
window.renderDashboard = function(mainContent) {
  console.log('대시보드 렌더링');
  
  if (!mainContent) {
    mainContent = document.getElementById('main-content');
  }
  if (!mainContent) return;
  
  // mainContent 완전히 비우기 (중복 방지)
  mainContent.innerHTML = '';
  
  // 대시보드 HTML 생성 (rollback.html에서 복원)
  const dashboardContent = document.createElement('div');
  dashboardContent.id = 'dashboard-content';
  mainContent.appendChild(dashboardContent);
  
  dashboardContent.innerHTML = `
    <style>
      /* 하위 탭 스타일 */
      .sub-tabs {
        display: flex;
        gap: 8px;
        margin-bottom: 32px;
        padding-bottom: 0;
        border-bottom: 1px solid #E5E7EB;
      }
      .sub-tab-btn {
        background: none;
        border: none;
        outline: none;
        color: #6B7280;
        font-size: 0.95rem;
        font-weight: 500;
        padding: 12px 20px;
        border-bottom: 2px solid transparent;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
        margin-bottom: -1px;
      }
      .sub-tab-btn:hover {
        color: #111827;
      }
      .sub-tab-btn.active {
        color: #111827;
        border-bottom: 2px solid #EF4444;
        font-weight: 600;
      }

      /* 대시보드 카드 스타일 */
      .dashboard-cards {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 24px;
        margin-bottom: 48px;
      }
      .dash-card {
        background: #FFFFFF;
        border-radius: 12px;
        padding: 28px 24px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        border: 1px solid #E5E7EB;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 12px;
        transition: all 0.2s ease;
      }
      .dash-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        transform: translateY(-2px);
      }
      .dash-title {
        font-size: 0.95rem;
        color: #6B7280;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 4px;
        letter-spacing: -0.2px;
      }
      .dash-value {
        font-size: 1.75rem;
        font-weight: 700;
        line-height: 1.3;
        letter-spacing: -0.5px;
      }
      .income { color: #14BD5A; }
      .expense { color: #FA4747; }
      .asset { color: #DC2626; }
      .budget { color: #DC2626; }

      .progress-bar-bg {
        background: #E5E7EB;
        border-radius: 8px;
        width: 100%;
        height: 14px;
        overflow: hidden;
      }
      .progress-bar-fill {
        background: #EF4444;
        height: 100%;
        width: 73%;
        border-radius: 8px 0 0 8px;
        transition: width 0.4s;
      }

      /* 반응형 처리 */
      @media (max-width: 900px) {
        .dashboard-cards {
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
      }
      @media (max-width: 600px) {
        .dashboard-cards {
          grid-template-columns: 1fr;
          gap: 10px;
        }
        .dash-card { padding: 13px 9px 12px 12px;}
        .sub-tabs { gap: 7px; }
      }

      .sub-tab-content {
        margin-top: 20px;
      }

      /* 검색바 스타일 */
      .search-bar {
        display: flex;
        gap: 12px;
        margin-bottom: 24px;
        padding: 0;
        background: transparent;
        border-radius: 0;
        align-items: center;
      }
      #search-input {
        flex: 1;
        padding: 12px 16px;
        border: 1px solid #D1D5DB;
        border-radius: 8px;
        font-size: 0.95rem;
        outline: none;
        transition: all 0.2s ease;
        background: #FFFFFF;
        color: #111827;
      }
      #search-input:focus {
        border-color: #EF4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
      }
      .search-btn, .search-clear-btn {
        padding: 12px 20px;
        border: none;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
      }
      .search-btn {
        background: #EF4444;
        color: #fff;
      }
      .search-btn:hover {
        background: #2563eb;
        box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
      }
      .search-clear-btn {
        background: #F3F4F6;
        color: #374151;
        border: 1px solid #E5E7EB;
      }
      .search-clear-btn:hover {
        background: #E5E7EB;
      }

      /* 정렬 컨트롤 스타일 */
      .sort-controls {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 24px;
        padding: 0;
        background: transparent;
        border-radius: 0;
      }
      .sort-controls label {
        font-size: 0.9rem;
        font-weight: 500;
        color: #374151;
        white-space: nowrap;
      }
      #sort-select {
        padding: 10px 14px;
        border: 1px solid #D1D5DB;
        border-radius: 8px;
        font-size: 0.9rem;
        outline: none;
        cursor: pointer;
        background: #FFFFFF;
        color: #111827;
        transition: all 0.2s ease;
      }
      #sort-select:focus {
        border-color: #EF4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
      }
    </style>
    
    <!-- 검색바 -->
    <div class="search-bar">
      <input type="text" id="search-input" placeholder="항목명 또는 카테고리 검색...">
      <button id="search-btn" class="search-btn">🔍 검색</button>
      <button id="search-clear" class="search-clear-btn">✕ 초기화</button>
    </div>

    <!-- 신규 등록 버튼 -->
    <div style="margin-bottom: 24px;">
      <button id="new-entry-btn" class="search-btn" style="width: auto; min-width: 120px;">📝 신규 등록</button>
    </div>

    <!-- 정렬 컨트롤 -->
    <div class="sort-controls">
      <label>정렬:</label>
      <select id="sort-select">
        <option value="date-desc">날짜 최신순</option>
        <option value="date-asc">날짜 오래된순</option>
        <option value="amount-desc">금액 높은순</option>
        <option value="amount-asc">금액 낮은순</option>
      </select>
    </div>

    <!-- 하위 탭: 전체 소비 / 카드별 내역 / 통장 입출금 -->
    <nav class="sub-tabs" id="sub-tabs">
      <button class="sub-tab-btn active" data-subtab="total">전체 소비</button>
      <button class="sub-tab-btn" data-subtab="card">카드별 내역</button>
      <button class="sub-tab-btn" data-subtab="bank">통장 입출금</button>
    </nav>

    <!-- 대시보드 카드 4개 -->
    <section class="dashboard-cards">
      <div class="dash-card">
        <div class="dash-title">💰 총 수입</div>
        <div class="dash-value income">0원</div>
      </div>
      <div class="dash-card">
        <div class="dash-title">💸 총 지출</div>
        <div class="dash-value expense">0원</div>
      </div>
      <div class="dash-card">
        <div class="dash-title">💵 순 자산</div>
        <div class="dash-value asset">0원</div>
      </div>
      <div class="dash-card">
        <div class="dash-title">📊 예산 달성</div>
        <div class="dash-value budget">0%</div>
        <div class="progress-bar-bg" aria-label="예산 달성 진행바">
          <div class="progress-bar-fill"></div>
        </div>
      </div>
    </section>

    <!-- 하위 탭별 내용 영역 -->
    <section class="sub-tab-content">
      <div id="total-content" style="display: block; overflow-x: auto;">
        <div class="expense-table-container">
          <table class="expense-table" aria-label="전체 소비 내역">
            <thead>
              <tr>
                <th>날짜</th>
                <th>담당자</th>
                <th>항목</th>
                <th>카테고리</th>
                <th>금액</th>
                <th>결제수단</th>
                <th>상태</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              <!-- 데이터가 여기에 동적으로 추가됨 -->
            </tbody>
          </table>
        </div>
      </div>
      <div id="card-content" style="display: none;">
        <!-- 카드 필터 드롭다운 -->
        <div style="margin-bottom: 24px;">
          <label for="card-filter-select" style="font-size: 0.95rem; font-weight: 500; color: #374151; margin-right: 12px;">카드 선택:</label>
          <select id="card-filter-select" style="padding: 10px 14px; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 0.9rem; outline: none; cursor: pointer; background: #FFFFFF; color: #111827; transition: all 0.2s ease; min-width: 200px;">
            <option value="all">전체 카드</option>
          </select>
        </div>
        <!-- 테이블 컨테이너 -->
        <div id="card-table-container"></div>
      </div>
      <div id="bank-content" style="display: none;">
        <!-- 통장 입출금 내역 테이블이 여기 표시됩니다 -->
      </div>
    </section>
  `;
  
  // 카드 필터 옵션 업데이트
  updateCardFilterOptions();
  
  // 서브탭 이벤트 리스너
  initSubTabs();
  
  // 검색/정렬 이벤트 리스너
  initSearchAndSort();
  
  // 신규 등록 버튼 이벤트
  const newEntryBtn = dashboardContent.querySelector('#new-entry-btn');
  if (newEntryBtn) {
    newEntryBtn.addEventListener('click', function() {
      if (typeof openModal === 'function') {
        openModal(false);
      }
    });
  }
  
  // 초기 렌더링
  renderTable();
  renderCardTable('all');
  renderBankTable();
  updateDashboard();
}

// ========================================
// 대시보드 초기화 함수 (호환성 유지)
// ========================================
function initDashboard() {
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    window.renderDashboard(mainContent);
  }
}

// 카드 필터 옵션 업데이트
function updateCardFilterOptions() {
  const select = document.getElementById('card-filter-select');
  if (!select) return;
  
  // 기존 옵션 제거 (첫 번째 옵션 제외)
  while (select.children.length > 1) {
    select.removeChild(select.lastChild);
  }
  
  // accountData에서 카드 계좌만 필터링
  accountData.filter(acc => acc.type === 'card').forEach(account => {
    const option = document.createElement('option');
    option.value = account.name;
    option.textContent = account.name;
    select.appendChild(option);
  });
}

// 서브탭 초기화
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
        // 카드 필터 드롭다운 초기화
        const cardFilterSelect = document.getElementById('card-filter-select');
        if (cardFilterSelect) {
          cardFilterSelect.value = 'all';
        }
        renderCardTable('all');
      } else if (target === 'bank' && bankContent) {
        bankContent.style.display = 'block';
        renderBankTable();
      }
    });
  });
}

// 검색/정렬 이벤트 초기화
function initSearchAndSort() {
  // 검색 버튼
  const searchBtn = document.getElementById('search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', function() {
      const keyword = document.getElementById('search-input')?.value || '';
      searchTransactions(keyword);
    });
  }
  
  // 검색 초기화 버튼
  const searchClear = document.getElementById('search-clear');
  if (searchClear) {
    searchClear.addEventListener('click', function() {
      const input = document.getElementById('search-input');
      if (input) input.value = '';
      currentSearchKeyword = '';
      applyFiltersAndRender();
    });
  }
  
  // 엔터키로 검색
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        const keyword = e.target.value || '';
        searchTransactions(keyword);
      }
    });
  }
  
  // 정렬 선택
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      currentSortType = this.value;
      applyFiltersAndRender();
    });
  }
}

// 검색 함수
function searchTransactions(keyword) {
  currentSearchKeyword = keyword.trim();
  applyFiltersAndRender();
}

// 검색 및 정렬 적용 후 렌더링
function applyFiltersAndRender() {
  renderTable();
  // 현재 선택된 카드 필터 유지
  const cardFilterSelect = document.getElementById('card-filter-select');
  const selectedCard = cardFilterSelect ? cardFilterSelect.value : 'all';
  renderCardTable(selectedCard);
  renderBankTable();
}

// 정렬 함수
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

// ========================================
// 테이블 렌더링 함수 (탭별 독립 필터링)
// ========================================
// A. '전체 소비' 하위 탭: type이 'income' 또는 'expense'인 모든 데이터 표시 (paymentMethod 구분 없이)
function renderTable() {
  const totalContent = document.getElementById('total-content');
  if (!totalContent) return;
  
  // 테이블 컨테이너 완전히 새로 생성 (중복 방지)
  totalContent.innerHTML = `
    <div class="expense-table-container">
      <table class="expense-table" aria-label="전체 소비 내역">
        <thead>
          <tr>
            <th>날짜</th>
            <th>담당자</th>
            <th>항목</th>
            <th>카테고리</th>
            <th>금액</th>
            <th>결제수단</th>
            <th>상태</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    </div>
  `;
  
  const tbody = totalContent.querySelector('tbody');
  if (!tbody) return;
  
  // 현재 선택된 월의 데이터만 필터링
  let monthData = getCurrentMonthData();
  
  // 전체 소비: type이 'income' 또는 'expense'인 모든 데이터 (paymentMethod 구분 없이)
  monthData = monthData.filter(entry => 
    entry.type === 'income' || entry.type === 'expense'
  );
  
  // 검색 필터링 적용
  if (currentSearchKeyword) {
    monthData = monthData.filter(entry => 
      (entry.item && entry.item.toLowerCase().includes(currentSearchKeyword.toLowerCase())) ||
      (entry.category && entry.category.toLowerCase().includes(currentSearchKeyword.toLowerCase())) ||
      (entry.user && entry.user.toLowerCase().includes(currentSearchKeyword.toLowerCase())) ||
      (entry.merchant && entry.merchant.toLowerCase().includes(currentSearchKeyword.toLowerCase())) ||
      (entry.detail && entry.detail.toLowerCase().includes(currentSearchKeyword.toLowerCase()))
    );
  }
  
  if (monthData.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="8" style="text-align:center; padding:40px;">등록된 내역이 없습니다</td>';
    tbody.appendChild(tr);
    return;
  }
  
  // 정렬 적용
  let sorted = monthData;
  if (currentSortType) {
    sorted = sortTransactions(monthData, currentSortType);
  } else {
    // 기본 정렬: 최신 데이터 먼저 (timestamp 내림차순)
    sorted = [...monthData].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }
  
  sorted.forEach(entry => {
    const tr = document.createElement('tr');
    const dateObj = new Date(entry.date);
    const dateStr = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
    
    // 금액: 수입은 +, 지출은 -
    let amountStr = '';
    let amountClass = '';
    if (entry.type === 'income') {
      amountStr = `+${entry.amount.toLocaleString()}원`;
      amountClass = 'expense-income';
    } else {
      amountStr = `-${entry.amount.toLocaleString()}원`;
      amountClass = 'expense-out';
    }
    
    // 결제수단 한글 표시
    const paymentMethodText = getPaymentMethodText(entry);
    
    tr.innerHTML = `
      <td>${dateStr}</td>
      <td>${entry.user || '-'}</td>
      <td>${entry.item || '-'}</td>
      <td>${entry.category || '-'}</td>
      <td class="${amountClass}">${amountStr}</td>
      <td>${paymentMethodText}</td>
      <td>${entry.status || '⏳대기'}</td>
      <td>
        <button class="btn-action" onclick="editTransaction(${entry.id})">수정</button>
        <button class="btn-action" onclick="deleteTransaction(${entry.id})">삭제</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  
  console.log('전체 소비 테이블 렌더링 완료:', sorted.length, '개 항목');
}

// B. '카드별 내역' 하위 탭: paymentMethod가 'credit' 또는 'debit'인 항목만 필터링
function renderCardTable(selectedCard = 'all') {
  const cardContent = document.getElementById('card-content');
  if (!cardContent) return;
  
  // 카드 필터 드롭다운은 유지하고, 테이블 컨테이너만 완전히 새로 생성
  const existingFilter = cardContent.querySelector('#card-filter-select');
  const filterHTML = existingFilter ? existingFilter.outerHTML : '';
  
  cardContent.innerHTML = `
    <!-- 카드 필터 드롭다운 -->
    <div style="margin-bottom: 24px;">
      <label for="card-filter-select" style="font-size: 0.95rem; font-weight: 500; color: #374151; margin-right: 12px;">카드 선택:</label>
      <select id="card-filter-select" style="padding: 10px 14px; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 0.9rem; outline: none; cursor: pointer; background: #FFFFFF; color: #111827; transition: all 0.2s ease; min-width: 200px;">
        <option value="all">전체 카드</option>
      </select>
    </div>
    <!-- 테이블 컨테이너 -->
    <div id="card-table-container"></div>
  `;
  
  // 카드 필터 옵션 업데이트
  updateCardFilterOptions();
  
  // 선택된 카드 값 복원
  const cardFilterSelect = cardContent.querySelector('#card-filter-select');
  if (cardFilterSelect && selectedCard !== 'all') {
    cardFilterSelect.value = selectedCard;
  }
  
  const cardTableContainer = cardContent.querySelector('#card-table-container');
  if (!cardTableContainer) return;
  
  // 카드별 내역: paymentMethod가 'credit' 또는 'debit'인 항목만
  let monthData = getCurrentMonthData();
  
  // 검색 필터링 적용
  if (currentSearchKeyword) {
    monthData = monthData.filter(entry => 
      (entry.item && entry.item.toLowerCase().includes(currentSearchKeyword.toLowerCase())) ||
      (entry.category && entry.category.toLowerCase().includes(currentSearchKeyword.toLowerCase())) ||
      (entry.user && entry.user.toLowerCase().includes(currentSearchKeyword.toLowerCase())) ||
      (entry.merchant && entry.merchant.toLowerCase().includes(currentSearchKeyword.toLowerCase())) ||
      (entry.detail && entry.detail.toLowerCase().includes(currentSearchKeyword.toLowerCase()))
    );
  }
  
  // 카드 거래만 필터링
  let cardData = monthData.filter(entry => 
    entry.paymentMethod === 'credit' || entry.paymentMethod === 'debit'
  );
  
  // 선택된 카드로 필터링
  if (selectedCard !== 'all') {
    cardData = cardData.filter(entry => entry.paymentDetail === selectedCard);
  }
  
  // 정렬 적용
  if (currentSortType) {
    cardData = sortTransactions(cardData, currentSortType);
  } else {
    cardData = [...cardData].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }
  
  // 테이블 HTML 생성
  let tableHTML = `
    <div class="expense-table-container">
      <table class="expense-table" aria-label="카드별 내역">
        <thead>
          <tr>
            <th>날짜</th>
            <th>담당자</th>
            <th>항목</th>
            <th>카테고리</th>
            <th>금액</th>
            <th>결제수단</th>
            <th>상태</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  if (cardData.length === 0) {
    tableHTML += `
      <tr>
        <td colspan="8" style="text-align:center; padding:40px;">카드 내역이 없습니다</td>
      </tr>
    `;
  } else {
    cardData.forEach(entry => {
      const dateObj = new Date(entry.date);
      const dateStr = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
      
      let amountStr = '';
      let amountClass = '';
      if (entry.type === 'income') {
        amountStr = `+${entry.amount.toLocaleString()}원`;
        amountClass = 'expense-income';
      } else {
        amountStr = `-${entry.amount.toLocaleString()}원`;
        amountClass = 'expense-out';
      }
      
      const paymentMethodText = getPaymentMethodText(entry);
      
      tableHTML += `
        <tr>
          <td>${dateStr}</td>
          <td>${entry.user || '-'}</td>
          <td>${entry.item || '-'}</td>
          <td>${entry.category || '-'}</td>
          <td class="${amountClass}">${amountStr}</td>
          <td>${paymentMethodText}</td>
          <td>${entry.status || '⏳대기'}</td>
          <td>
            <button class="btn-action" onclick="editTransaction(${entry.id})">수정</button>
            <button class="btn-action" onclick="deleteTransaction(${entry.id})">삭제</button>
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
  
  // 카드 필터 change 이벤트 리스너 재등록
  if (cardFilterSelect) {
    cardFilterSelect.addEventListener('change', function() {
      renderCardTable(this.value);
    });
  }
  
  console.log('카드별 내역 렌더링:', cardData.length, '개 항목', selectedCard !== 'all' ? `(필터: ${selectedCard})` : '(전체)');
}

// C. '통장 입출금' 하위 탭: paymentMethod가 'transfer' 또는 'cash'인 직접 거래만 표시
// 카드 결제 대금 자동이체 내역은 별도 표시 (item이 '카드대금'인 경우)
function renderBankTable() {
  const bankContent = document.getElementById('bank-content');
  if (!bankContent) return;
  
  // 테이블 컨테이너 완전히 새로 생성 (중복 방지)
  bankContent.innerHTML = '';
  
  // 통장 입출금: paymentMethod가 'transfer' 또는 'cash'인 직접 거래만
  let monthData = getCurrentMonthData();
  
  // 검색 필터링 적용
  if (currentSearchKeyword) {
    monthData = monthData.filter(entry => 
      (entry.item && entry.item.toLowerCase().includes(currentSearchKeyword.toLowerCase())) ||
      (entry.category && entry.category.toLowerCase().includes(currentSearchKeyword.toLowerCase())) ||
      (entry.user && entry.user.toLowerCase().includes(currentSearchKeyword.toLowerCase())) ||
      (entry.merchant && entry.merchant.toLowerCase().includes(currentSearchKeyword.toLowerCase())) ||
      (entry.detail && entry.detail.toLowerCase().includes(currentSearchKeyword.toLowerCase()))
    );
  }
  
  // 직접 거래: paymentMethod가 'transfer' 또는 'cash'
  let bankData = monthData.filter(entry => 
    entry.paymentMethod === 'transfer' || entry.paymentMethod === 'cash'
  );
  
  // 카드 결제 대금 자동이체 내역 추가 (item이 '카드대금'인 경우)
  const cardPayments = monthData.filter(entry => 
    entry.item === '카드대금' || entry.item.includes('카드대금') || entry.item.includes('카드')
  );
  
  // 정렬 적용
  if (currentSortType) {
    bankData = sortTransactions(bankData, currentSortType);
    if (cardPayments.length > 0) {
      cardPayments.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });
    }
  } else {
    bankData = [...bankData].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    if (cardPayments.length > 0) {
      cardPayments.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    }
  }
  
  // 테이블 HTML 생성
  let tableHTML = `
    <div class="expense-table-container">
      <table class="expense-table" aria-label="통장 입출금 내역">
        <thead>
          <tr>
            <th>날짜</th>
            <th>담당자</th>
            <th>항목</th>
            <th>카테고리</th>
            <th>금액</th>
            <th>결제수단</th>
            <th>상태</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  // 직접 거래 먼저 표시
  if (bankData.length === 0 && cardPayments.length === 0) {
    tableHTML += `
      <tr>
        <td colspan="8" style="text-align:center; padding:40px;">통장 입출금 내역이 없습니다</td>
      </tr>
    `;
  } else {
    // 직접 거래 표시
    bankData.forEach(entry => {
      const dateObj = new Date(entry.date);
      const dateStr = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
      
      let amountStr = '';
      let amountClass = '';
      if (entry.type === 'income') {
        amountStr = `+${entry.amount.toLocaleString()}원`;
        amountClass = 'expense-income';
      } else {
        amountStr = `-${entry.amount.toLocaleString()}원`;
        amountClass = 'expense-out';
      }
      
      const paymentMethodText = getPaymentMethodText(entry);
      
      tableHTML += `
        <tr>
          <td>${dateStr}</td>
          <td>${entry.user || '-'}</td>
          <td>${entry.item || '-'}</td>
          <td>${entry.category || '-'}</td>
          <td class="${amountClass}">${amountStr}</td>
          <td>${paymentMethodText}</td>
          <td>${entry.status || '⏳대기'}</td>
          <td>
            <button class="btn-action" onclick="editTransaction(${entry.id})">수정</button>
            <button class="btn-action" onclick="deleteTransaction(${entry.id})">삭제</button>
          </td>
        </tr>
      `;
    });
    
    // 카드 결제 대금 자동이체 내역 표시 (별도 섹션으로 구분)
    if (cardPayments.length > 0) {
      cardPayments.forEach(entry => {
        const dateObj = new Date(entry.date);
        const dateStr = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
        
        const amountStr = `-${entry.amount.toLocaleString()}원`;
        const paymentMethodText = getPaymentMethodText(entry);
        
        tableHTML += `
          <tr class="expense-bankpay" style="background-color: #F0F9FF;">
            <td>${dateStr}</td>
            <td>${entry.user || '-'}</td>
            <td>${entry.item || '-'}</td>
            <td>${entry.category || '-'}</td>
            <td class="expense-out">${amountStr}</td>
            <td>${paymentMethodText}</td>
            <td>${entry.status || '✅완료'}</td>
            <td>
              <button class="btn-action" onclick="editTransaction(${entry.id})">수정</button>
              <button class="btn-action" onclick="deleteTransaction(${entry.id})">삭제</button>
            </td>
          </tr>
        `;
      });
    }
  }
  
  tableHTML += `
        </tbody>
      </table>
    </div>
  `;
  
  bankContent.innerHTML = tableHTML;
  console.log('통장 입출금 테이블 렌더링 완료:', bankData.length, '개 직접 거래', cardPayments.length, '개 카드 결제 대금');
}

// 카드 필터 변경 이벤트는 renderCardTable 내부에서 재등록됨

console.log('dashboard.js 로드 완료');
