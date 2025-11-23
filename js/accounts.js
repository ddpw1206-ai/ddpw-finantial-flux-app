// ========================================
// 계좌 입출금 관리 탭 (rollback.html에서 복원)
// ========================================

function initAccounts() {
  console.log('계좌 관리 초기화');
  
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;
  
  // mainContent 완전히 비우기 (중복 방지)
  mainContent.innerHTML = '';
  
  // 계좌 관리 HTML 생성
  const accountsContainer = document.createElement('div');
  accountsContainer.id = 'accounts-container';
  mainContent.appendChild(accountsContainer);
  
  window.renderAccountsTab(accountsContainer);
}

// ========================================
// 계좌 관리 탭 렌더링 (rollback.html에서 복원)
// ========================================
window.renderAccountsTab = function(container) {
  // container가 없으면 main-content를 찾아서 사용
  if (!container) {
    container = document.getElementById('main-content');
  }
  if (!container) {
    console.error('renderAccountsTab: container를 찾을 수 없습니다.');
    return;
  }
  
  // container 완전히 비우기 (안전성 보장)
  container.innerHTML = '';
  
  // 잔액 재계산
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
        background: #2563eb;
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
      <h2 class="accounts-title">계좌 관리</h2>
      <button class="add-account-btn" id="add-account-btn">+ 계좌 추가</button>
    </div>
    <div class="accounts-grid" id="accounts-grid">
      ${accountData.length === 0 ? '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #6B7280;">등록된 계좌가 없습니다. 계좌를 추가해주세요.</div>' : ''}
    </div>
    
    <!-- 계좌별 입출금 내역 섹션 -->
    <div style="margin-top: 48px;">
      <h3 style="font-size: 1.25rem; font-weight: 600; color: #111827; margin-bottom: 24px;">📋 계좌별 입출금 내역</h3>
      <div style="margin-bottom: 24px;">
        <label for="account-filter-select" style="font-size: 0.95rem; font-weight: 500; color: #374151; margin-right: 12px;">계좌 선택:</label>
        <select id="account-filter-select" style="padding: 10px 14px; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 0.95rem; outline: none; cursor: pointer; background: #FFFFFF; color: #111827; transition: all 0.2s ease; min-width: 200px;">
          <option value="all">전체 계좌</option>
        </select>
      </div>
      <div id="account-transaction-table"></div>
    </div>
  `;
  
  // 계좌 카드 렌더링
  const accountsGrid = container.querySelector('#accounts-grid');
  if (accountsGrid && accountData.length > 0) {
    accountsGrid.innerHTML = '';
    accountData.forEach(account => {
      const card = document.createElement('div');
      card.className = 'account-card';
      
      if (account.type === 'bank') {
        // 통장 계좌
        card.innerHTML = `
          <div class="account-header">
            <div>
              <div class="account-name">${account.name}</div>
              <span class="account-type">통장</span>
            </div>
            <div class="account-actions">
              <button class="account-action-btn" onclick="editAccount(${account.id})">수정</button>
              <button class="account-action-btn" onclick="deleteAccount(${account.id})">삭제</button>
            </div>
          </div>
          <div class="account-balance">${(account.currentBalance || 0).toLocaleString()}원</div>
          <div class="account-info">초기 잔액: ${(account.initialBalance || 0).toLocaleString()}원</div>
        `;
      } else if (account.type === 'card') {
        // 카드 계좌
        const creditLimit = account.creditLimit || 0;
        const usedAmount = account.currentBalance || 0; // 사용액
        const availableAmount = creditLimit - usedAmount; // 가용 잔액
        const usageRate = creditLimit > 0 ? (usedAmount / creditLimit) * 100 : 0;
        
        let usageBarClass = '';
        if (usageRate >= 80) usageBarClass = 'danger';
        else if (usageRate >= 60) usageBarClass = 'warning';
        
        card.innerHTML = `
          <div class="account-header">
            <div>
              <div class="account-name">${account.name}</div>
              <span class="account-type">카드</span>
            </div>
            <div class="account-actions">
              <button class="account-action-btn" onclick="editAccount(${account.id})">수정</button>
              <button class="account-action-btn" onclick="deleteAccount(${account.id})">삭제</button>
            </div>
          </div>
          <div class="card-usage">
            <div class="card-usage-item">
              <span class="card-usage-label">사용액</span>
              <span class="card-usage-value">${usedAmount.toLocaleString()}원</span>
            </div>
            <div class="card-usage-item">
              <span class="card-usage-label">한도</span>
              <span class="card-usage-value">${creditLimit.toLocaleString()}원</span>
            </div>
            <div class="card-usage-item">
              <span class="card-usage-label">사용률</span>
              <span class="card-usage-value">${Math.round(usageRate)}%</span>
            </div>
            <div class="card-usage-bar">
              <div class="card-usage-fill ${usageBarClass}" style="width: ${Math.min(usageRate, 100)}%"></div>
            </div>
            ${account.paymentDay ? `<div class="account-info" style="margin-top: 12px;">결제일: 매월 ${account.paymentDay}일</div>` : ''}
            ${account.linkedAccount ? `<div class="account-info">연결계좌: ${account.linkedAccount}</div>` : ''}
          </div>
        `;
      }
      
      accountsGrid.appendChild(card);
    });
  }
  
  // 계좌 추가 버튼 이벤트
  const addAccountBtn = container.querySelector('#add-account-btn');
  if (addAccountBtn) {
    addAccountBtn.addEventListener('click', () => {
      if (typeof openAccountModal === 'function') {
        openAccountModal();
      }
    });
  }
  
  // 계좌 필터 옵션 업데이트 및 계좌별 입출금 내역 렌더링
  updateAccountFilterOptions();
  renderAccountTransactionTable('all');
  
  // 계좌 필터 드롭다운 이벤트 리스너
  const accountFilterSelect = container.querySelector('#account-filter-select');
  if (accountFilterSelect) {
    accountFilterSelect.addEventListener('change', function() {
      renderAccountTransactionTable(this.value);
    });
  }
}

// ========================================
// 계좌 필터 옵션 업데이트 함수
// ========================================
function updateAccountFilterOptions() {
  const select = document.getElementById('account-filter-select');
  if (!select) return;
  
  // 기존 옵션 제거 (첫 번째 옵션 제외)
  while (select.children.length > 1) {
    select.removeChild(select.lastChild);
  }
  
  // 계좌 아이콘 매핑
  const accountIcons = {
    'bank': '🏦',
    'card': '💳'
  };
  
  // accountData를 순회하며 옵션 동적 생성
  accountData.forEach(account => {
    const option = document.createElement('option');
    option.value = account.name;
    const icon = accountIcons[account.type] || '📊';
    option.textContent = `${icon} ${account.name}`;
    select.appendChild(option);
  });
  
  console.log('계좌 필터 옵션 업데이트:', accountData.length, '개 계좌');
}

// ========================================
// 계좌별 입출금 내역 테이블 렌더링 함수 (독립화)
// ========================================
function renderAccountTransactionTable(selectedAccount = 'all') {
  const tableContainer = document.getElementById('account-transaction-table');
  if (!tableContainer) return;
  
  // 테이블 컨테이너 완전히 새로 생성 (중복 방지)
  tableContainer.innerHTML = '';
  
  // 현재 선택된 월의 데이터 가져오기
  let monthData = getCurrentMonthData();
  
  // 선택된 계좌 정보 가져오기
  let selectedAccountData = null;
  if (selectedAccount !== 'all') {
    selectedAccountData = accountData.find(acc => acc.name === selectedAccount);
  }
  
  // 직접 거래 필터링: paymentMethod가 'transfer' 또는 'cash'이고 paymentDetail이 selectedAccount인 항목
  let directTransactions = [];
  if (selectedAccount !== 'all' && selectedAccountData) {
    directTransactions = monthData.filter(entry => {
      return (entry.paymentMethod === 'transfer' || entry.paymentMethod === 'cash') &&
             entry.paymentDetail === selectedAccount;
    });
  } else if (selectedAccount === 'all') {
    // 전체 계좌 선택 시 모든 직접 거래 표시
    directTransactions = monthData.filter(entry => 
      entry.paymentMethod === 'transfer' || entry.paymentMethod === 'cash'
    );
  }
  
  // 카드 결제 대금 자동이체 내역 추가
  let cardPayments = [];
  if (selectedAccount !== 'all' && selectedAccountData && selectedAccountData.type === 'bank') {
    // accountData에서 해당 계좌에 연결된 카드 찾기
    const linkedCards = accountData.filter(acc => 
      acc.type === 'card' && acc.linkedAccount === selectedAccount
    );
    
    // 각 카드의 결제일에 맞춰 카드 결제 대금 생성
    linkedCards.forEach(card => {
      if (!card.paymentDay) return;
      
      // 현재 월의 결제일 계산
      const paymentDate = new Date(curYear, curMonth - 1, card.paymentDay);
      const paymentDateStr = paymentDate.toISOString().split('T')[0];
      
      // 해당 월의 카드 사용 총액 계산
      const cardTransactions = monthData.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getFullYear() === curYear &&
               tDate.getMonth() + 1 === curMonth &&
               t.paymentMethod === 'credit' &&
               t.paymentDetail === card.name;
      });
      
      const totalCardUsage = cardTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      if (totalCardUsage > 0) {
        // 카드 결제 대금 내역 생성
        cardPayments.push({
          id: `card-payment-${card.id}-${curYear}-${curMonth}`,
          date: paymentDateStr,
          user: '-',
          type: 'expense',
          item: `${card.name} 결제`,
          category: '카드대금',
          amount: totalCardUsage,
          paymentMethod: 'transfer',
          paymentDetail: selectedAccount,
          status: '✅완료',
          timestamp: paymentDate.getTime(),
          isAutoGenerated: true // 자동 생성된 내역임을 표시
        });
      }
    });
  }
  
  // 모든 거래 합치기
  let allTransactions = [...directTransactions, ...cardPayments];
  
  // 날짜순으로 정렬 (오래된 것부터)
  const sortedData = [...allTransactions].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (dateA.getTime() === dateB.getTime()) {
      return (a.timestamp || 0) - (b.timestamp || 0);
    }
    return dateA.getTime() - dateB.getTime();
  });
  
  // 초기 잔액 설정
  let runningBalance = 0;
  if (selectedAccountData) {
    if (selectedAccountData.type === 'bank') {
      runningBalance = selectedAccountData.initialBalance || 0;
    } else if (selectedAccountData.type === 'card') {
      runningBalance = selectedAccountData.creditLimit || 0;
    }
  }
  
  // 테이블 HTML 생성
  let tableHTML = `
    <div class="expense-table-container">
      <table class="expense-table" aria-label="계좌별 입출금 내역">
        <thead>
          <tr>
            <th>날짜</th>
            <th>담당자</th>
            <th>항목</th>
            <th>카테고리</th>
            <th>금액</th>
            <th>계좌/카드</th>
            <th>잔액</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  if (sortedData.length === 0) {
    tableHTML += `
      <tr>
        <td colspan="8" style="text-align:center; padding:40px;">입출금 내역이 없습니다</td>
      </tr>
    `;
  } else {
    sortedData.forEach(entry => {
      const dateObj = new Date(entry.date);
      const dateStr = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
      
      // 잔액 계산
      if (selectedAccountData) {
        if (selectedAccountData.type === 'bank') {
          // 통장: 수입은 +, 지출은 -
          if (entry.type === 'income') {
            runningBalance += entry.amount;
          } else if (entry.type === 'expense') {
            runningBalance -= entry.amount;
          }
        } else if (selectedAccountData.type === 'card') {
          // 카드: 지출만 사용액에 추가
          if (entry.type === 'expense') {
            runningBalance -= entry.amount;
          }
        }
      }
      
      // 금액 표시
      let amountStr = '';
      let amountClass = '';
      if (entry.type === 'income') {
        amountStr = `+${entry.amount.toLocaleString()}원`;
        amountClass = 'expense-income';
      } else {
        amountStr = `-${entry.amount.toLocaleString()}원`;
        amountClass = 'expense-out';
      }
      
      // 잔액 색상 설정
      const balanceColor = runningBalance >= 0 ? '#DC2626' : '#DC2626';
      const balanceStr = `${runningBalance.toLocaleString()}원`;
      
      const paymentMethodText = getPaymentMethodText(entry);
      
      // 자동 생성된 카드 결제 대금은 배경색으로 구분
      const rowStyle = entry.isAutoGenerated ? 'background-color: #F0F9FF;' : '';
      
      tableHTML += `
        <tr style="${rowStyle}">
          <td>${dateStr}</td>
          <td>${entry.user || '-'}</td>
          <td>${entry.item || '-'}</td>
          <td>${entry.category || '-'}</td>
          <td class="${amountClass}">${amountStr}</td>
          <td>${paymentMethodText}</td>
          <td style="color: ${balanceColor}; font-weight: 600;">${balanceStr}</td>
          <td>
            ${entry.isAutoGenerated ? '<span style="color: #6B7280; font-size: 0.85rem;">자동 생성</span>' : `
            <button class="btn-action" onclick="editTransaction(${entry.id})">수정</button>
            <button class="btn-action" onclick="deleteTransaction(${entry.id})">삭제</button>
            `}
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
  console.log('계좌별 입출금 내역 렌더링:', directTransactions.length, '개 직접 거래', cardPayments.length, '개 카드 결제 대금', selectedAccount !== 'all' ? `(필터: ${selectedAccount})` : '(전체)');
}

console.log('accounts.js 로드 완료');
