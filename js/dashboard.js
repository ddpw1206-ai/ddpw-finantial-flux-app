// ========================================
// 대시보드 탭 초기화 및 렌더링
// ========================================

function initDashboard() {
  console.log('대시보드 초기화');
  
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;
  
  // 대시보드 HTML이 이미 있으면 표시만
  let dashboardContent = document.getElementById('dashboard-content');
  if (dashboardContent) {
    dashboardContent.style.display = 'block';
    updateDashboard();
    return;
  }
  
  // 대시보드 HTML 생성
  dashboardContent = document.createElement('div');
  dashboardContent.id = 'dashboard-content';
  mainContent.appendChild(dashboardContent);
  
  // 대시보드 HTML 구조 생성
  dashboardContent.innerHTML = `
    <div class="dashboard-cards">
      <div class="dash-card">
        <div class="dash-title">💰 총 수입</div>
        <div class="dash-value income">0원</div>
      </div>
      <div class="dash-card">
        <div class="dash-title">💸 총 지출</div>
        <div class="dash-value expense">0원</div>
      </div>
      <div class="dash-card">
        <div class="dash-title">📊 순 자산</div>
        <div class="dash-value asset">0원</div>
      </div>
      <div class="dash-card">
        <div class="dash-title">🎯 예산 달성률</div>
        <div class="dash-value budget">0%</div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: 0%;"></div>
        </div>
      </div>
    </div>
    
    <div class="sub-tabs">
      <button class="sub-tab-btn active" data-subtab="total">전체</button>
      <button class="sub-tab-btn" data-subtab="card">카드</button>
      <button class="sub-tab-btn" data-subtab="bank">통장</button>
    </div>
    
    <div class="sub-tab-content">
      <div id="total-content" style="display: block;">
        <div class="search-bar">
          <input type="text" id="search-input" placeholder="검색어 입력...">
          <button class="search-btn" id="search-btn">검색</button>
          <button class="search-clear-btn" id="search-clear-btn">초기화</button>
        </div>
        <div class="sort-controls">
          <label>정렬:</label>
          <select id="sort-select">
            <option value="date-desc">날짜 최신순</option>
            <option value="date-asc">날짜 오래된순</option>
            <option value="amount-desc">금액 큰순</option>
            <option value="amount-asc">금액 작은순</option>
          </select>
        </div>
        <div id="expense-table-container" class="expense-table-container">
          <table class="expense-table" id="expense-table">
            <thead>
              <tr>
                <th>날짜</th>
                <th>유형</th>
                <th>카테고리</th>
                <th>사용처</th>
                <th>금액</th>
                <th>결제수단</th>
                <th>메모</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody id="expense-table-body">
              <!-- 데이터가 여기에 동적으로 추가됨 -->
            </tbody>
          </table>
        </div>
      </div>
      
      <div id="card-content" style="display: none;">
        <div style="margin-bottom: 24px;">
          <label for="card-filter-select" style="font-size: 0.95rem; font-weight: 500; color: #374151; margin-right: 12px;">카드 선택:</label>
          <select id="card-filter-select" style="padding: 10px 14px; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 0.9rem;">
            <option value="all">전체</option>
          </select>
        </div>
        <div id="card-table-container" class="expense-table-container">
          <table class="expense-table" id="card-table">
            <thead>
              <tr>
                <th>날짜</th>
                <th>카테고리</th>
                <th>사용처</th>
                <th>금액</th>
                <th>카드</th>
                <th>메모</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody id="card-table-body">
              <!-- 데이터가 여기에 동적으로 추가됨 -->
            </tbody>
          </table>
        </div>
      </div>
      
      <div id="bank-content" style="display: none;">
        <div id="bank-table-container" class="expense-table-container">
          <table class="expense-table" id="bank-table">
            <thead>
              <tr>
                <th>날짜</th>
                <th>유형</th>
                <th>카테고리</th>
                <th>사용처</th>
                <th>금액</th>
                <th>계좌</th>
                <th>메모</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody id="bank-table-body">
              <!-- 데이터가 여기에 동적으로 추가됨 -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  
  // 서브탭 이벤트 리스너
  const subTabButtons = dashboardContent.querySelectorAll('.sub-tab-btn');
  subTabButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      subTabButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      const subtab = this.getAttribute('data-subtab');
      const totalContent = document.getElementById('total-content');
      const cardContent = document.getElementById('card-content');
      const bankContent = document.getElementById('bank-content');
      
      if (totalContent) totalContent.style.display = subtab === 'total' ? 'block' : 'none';
      if (cardContent) cardContent.style.display = subtab === 'card' ? 'block' : 'none';
      if (bankContent) bankContent.style.display = subtab === 'bank' ? 'block' : 'none';
      
      if (subtab === 'total') {
        renderTable();
      } else if (subtab === 'card') {
        const cardFilterSelect = document.getElementById('card-filter-select');
        if (cardFilterSelect) {
          cardFilterSelect.value = 'all';
        }
        renderCardTable('all');
      } else if (subtab === 'bank') {
        renderBankTable();
      }
    });
  });
  
  // 초기 렌더링
  renderTable();
  renderCardTable('all');
  renderBankTable();
  updateDashboard();
}

// 테이블 렌더링 함수 (기존 로직 유지 필요)
function renderTable() {
  console.log('테이블 렌더링');
  const tbody = document.getElementById('expense-table-body');
  if (!tbody) return;
  
  const monthData = getCurrentMonthData();
  tbody.innerHTML = '';
  
  if (monthData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px; color: #6B7280;">데이터가 없습니다.</td></tr>';
    return;
  }
  
  monthData.forEach(entry => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${new Date(entry.date).toLocaleDateString('ko-KR')}</td>
      <td>${entry.type === 'income' ? '수입' : '지출'}</td>
      <td>${entry.category || '-'}</td>
      <td>${entry.merchant || '-'}</td>
      <td class="${entry.type === 'income' ? 'expense-income' : 'expense-out'}">${entry.amount.toLocaleString()}원</td>
      <td>${entry.paymentMethod || '-'}</td>
      <td>${entry.memo || '-'}</td>
      <td>
        <button class="btn-action" onclick="editEntry(${entry.id})">수정</button>
        <button class="btn-action" onclick="deleteEntry(${entry.id})">삭제</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function renderCardTable(selectedCard = 'all') {
  console.log('카드 테이블 렌더링:', selectedCard);
  const tbody = document.getElementById('card-table-body');
  if (!tbody) return;
  
  const monthData = getCurrentMonthData().filter(entry => {
    if (entry.type !== 'expense') return false;
    if (selectedCard === 'all') return entry.paymentMethod && entry.paymentMethod.includes('카드');
    return entry.paymentMethod === selectedCard;
  });
  
  tbody.innerHTML = '';
  
  if (monthData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px; color: #6B7280;">데이터가 없습니다.</td></tr>';
    return;
  }
  
  monthData.forEach(entry => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${new Date(entry.date).toLocaleDateString('ko-KR')}</td>
      <td>${entry.category || '-'}</td>
      <td>${entry.merchant || '-'}</td>
      <td class="expense-out">${entry.amount.toLocaleString()}원</td>
      <td>${entry.paymentMethod || '-'}</td>
      <td>${entry.memo || '-'}</td>
      <td>
        <button class="btn-action" onclick="editEntry(${entry.id})">수정</button>
        <button class="btn-action" onclick="deleteEntry(${entry.id})">삭제</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function renderBankTable() {
  console.log('통장 테이블 렌더링');
  const tbody = document.getElementById('bank-table-body');
  if (!tbody) return;
  
  const monthData = getCurrentMonthData().filter(entry => {
    if (entry.type === 'expense') {
      return entry.paymentMethod && !entry.paymentMethod.includes('카드');
    }
    return entry.type === 'income';
  });
  
  tbody.innerHTML = '';
  
  if (monthData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px; color: #6B7280;">데이터가 없습니다.</td></tr>';
    return;
  }
  
  monthData.forEach(entry => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${new Date(entry.date).toLocaleDateString('ko-KR')}</td>
      <td>${entry.type === 'income' ? '수입' : '지출'}</td>
      <td>${entry.category || '-'}</td>
      <td>${entry.merchant || '-'}</td>
      <td class="${entry.type === 'income' ? 'expense-income' : 'expense-out'}">${entry.amount.toLocaleString()}원</td>
      <td>${entry.paymentMethod || '-'}</td>
      <td>${entry.memo || '-'}</td>
      <td>
        <button class="btn-action" onclick="editEntry(${entry.id})">수정</button>
        <button class="btn-action" onclick="deleteEntry(${entry.id})">삭제</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// 전역 함수로 노출 (임시)
window.editEntry = function(id) {
  console.log('수정:', id);
  alert('수정 기능은 추후 구현');
};

window.deleteEntry = function(id) {
  if (confirm('정말 삭제하시겠습니까?')) {
    const index = transactionData.findIndex(t => t.id === id);
    if (index > -1) {
      transactionData.splice(index, 1);
      saveData();
      renderTable();
      renderCardTable('all');
      renderBankTable();
      updateDashboard();
    }
  }
};

console.log('dashboard.js 로드 완료');

