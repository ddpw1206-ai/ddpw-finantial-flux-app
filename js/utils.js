// ========================================
// 숫자 포맷팅
// ========================================
function formatNumberWithCommas(value) {
  const str = String(value).replace(/[^\d]/g, '');
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function removeCommas(value) {
  return String(value).replace(/,/g, '');
}

function parseAmount(value) {
  if (!value) return 0;
  const str = String(value).replace(/[^0-9.-]/g, '');
  const num = parseFloat(str);
  return isNaN(num) ? 0 : Math.abs(num);
}

// ========================================
// 날짜 관련
// ========================================
function getCurrentMonthData() {
  return transactionData.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate.getFullYear() === curYear && (entryDate.getMonth() + 1) === curMonth;
  });
}

function updateMonthText() {
  const monthText = document.getElementById('month-text');
  if (monthText) {
    monthText.textContent = `${curYear}년 ${curMonth}월`;
  }
}

// ========================================
// 결제수단 한글 변환 함수 (rollback.html에서 복원)
// ========================================
function getPaymentMethodText(entry) {
  // paymentDetail이 있으면 그것을 사용
  if (entry.paymentDetail) {
    return entry.paymentDetail;
  }
  
  // paymentMethod를 한글로 변환
  const methodMap = {
    'credit': '신용카드',
    'debit': '체크카드',
    'transfer': '계좌이체',
    'cash': '현금'
  };
  
  return methodMap[entry.paymentMethod] || entry.paymentMethod;
}

// ========================================
// 계좌 잔액 자동 계산 함수 (rollback.html에서 복원)
// ========================================
function calculateAccountBalances() {
  // 모든 계좌의 잔액을 초기화
  accountData.forEach(account => {
    if (account.type === 'bank') {
      // 통장: 초기 잔액으로 초기화
      account.currentBalance = account.initialBalance || 0;
    } else if (account.type === 'card') {
      // 카드: 사용액을 0으로 초기화 (한도는 유지)
      account.currentBalance = 0;
    }
  });
  
  // 모든 거래 내역을 날짜순으로 정렬하여 처리
  const sortedTransactions = [...transactionData].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (dateA.getTime() === dateB.getTime()) {
      return (a.timestamp || 0) - (b.timestamp || 0);
    }
    return dateA.getTime() - dateB.getTime();
  });
  
  // 각 거래를 처리하여 계좌 잔액 업데이트
  sortedTransactions.forEach(transaction => {
    // transfer 또는 cash 거래만 처리 (직접 입출금 거래)
    if (transaction.paymentMethod !== 'transfer' && transaction.paymentMethod !== 'cash') {
      return;
    }
    
    const accountName = transaction.paymentDetail || '';
    
    // 해당 계좌 찾기
    const account = accountData.find(acc => acc.name === accountName);
    if (!account) return;
    
    if (account.type === 'bank') {
      // 통장: 수입은 +, 지출은 -
      if (transaction.type === 'income') {
        account.currentBalance += transaction.amount;
      } else if (transaction.type === 'expense') {
        account.currentBalance -= transaction.amount;
      }
    } else if (account.type === 'card') {
      // 카드: 지출만 사용액에 추가 (수입은 없음)
      if (transaction.type === 'expense') {
        account.currentBalance += transaction.amount;
      }
    }
  });
  
  // 계산된 잔액 저장
  if (typeof saveAccountData === 'function') {
    saveAccountData();
  }
}

// ========================================
// 대시보드 업데이트 (rollback.html에서 복원)
// ========================================
function updateDashboard() {
  console.log('대시보드 업데이트 시작');
  
  // 현재 선택된 월의 데이터만 필터링
  const monthData = getCurrentMonthData();
  
  // 총 수입 계산 (type === 'income')
  const totalIncome = monthData
    .filter(entry => entry.type === 'income')
    .reduce((sum, entry) => sum + entry.amount, 0);
  
  // 총 지출 계산 (type === 'expense')
  const totalExpense = monthData
    .filter(entry => entry.type === 'expense')
    .reduce((sum, entry) => sum + entry.amount, 0);
  
  // 순 자산 계산 (총 수입 - 총 지출)
  const netAsset = totalIncome - totalExpense;
  
  // 총 자산 계산 (모든 계좌 잔액 합계)
  calculateAccountBalances();
  const totalAssets = accountData.reduce((sum, account) => {
    if (account.type === 'bank') {
      // 통장: 현재 잔액
      return sum + (account.currentBalance || 0);
    } else if (account.type === 'card') {
      // 카드는 자산에 포함하지 않음 (부채이므로)
      return sum;
    }
    return sum;
  }, 0);
  
  // 예산 달성률 계산 (예산: 3,000,000원)
  const budget = 3000000;
  const budgetRate = budget > 0 ? Math.min((totalExpense / budget) * 100, 100) : 0;
  
  // 대시보드 카드 업데이트
  const dashCards = document.querySelectorAll('.dash-card');
  if (dashCards.length >= 4) {
    // 총 수입
    const incomeValue = dashCards[0].querySelector('.dash-value');
    if (incomeValue) {
      incomeValue.textContent = `${totalIncome.toLocaleString()}원`;
    }
    
    // 총 지출
    const expenseValue = dashCards[1].querySelector('.dash-value');
    if (expenseValue) {
      expenseValue.textContent = `${totalExpense.toLocaleString()}원`;
    }
    
    // 순 자산 (총 자산 표시)
    const assetValue = dashCards[2].querySelector('.dash-value');
    if (assetValue) {
      assetValue.textContent = `${totalAssets.toLocaleString()}원`;
    }
    
    // 예산 달성률
    const budgetValue = dashCards[3].querySelector('.dash-value');
    const progressBar = dashCards[3].querySelector('.progress-bar-fill');
    if (budgetValue) {
      budgetValue.textContent = `${Math.round(budgetRate)}%`;
    }
    if (progressBar) {
      progressBar.style.width = `${Math.min(budgetRate, 100)}%`;
    }
  }
  
  console.log('대시보드 업데이트 완료:', {
    totalIncome,
    totalExpense,
    netAsset,
    totalAssets,
    budgetRate: Math.round(budgetRate)
  });
}

console.log('utils.js 로드 완료');

