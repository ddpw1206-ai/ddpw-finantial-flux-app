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
// 대시보드 업데이트
// ========================================
function updateDashboard() {
  const monthData = getCurrentMonthData();
  
  let totalIncome = 0;
  let totalExpense = 0;
  
  monthData.forEach(entry => {
    if (entry.type === 'income') {
      totalIncome += entry.amount;
    } else if (entry.type === 'expense') {
      totalExpense += entry.amount;
    }
  });
  
  const netAsset = totalIncome - totalExpense;
  const budget = 3000000;
  const budgetAchievement = budget > 0 ? Math.round((totalExpense / budget) * 100) : 0;
  
  // DOM 업데이트
  const incomeEl = document.querySelector('.income');
  const expenseEl = document.querySelector('.expense');
  const assetEl = document.querySelector('.asset');
  const budgetEl = document.querySelector('.budget');
  const progressFill = document.querySelector('.progress-bar-fill');
  
  if (incomeEl) incomeEl.textContent = totalIncome.toLocaleString() + '원';
  if (expenseEl) expenseEl.textContent = totalExpense.toLocaleString() + '원';
  if (assetEl) {
    assetEl.textContent = (netAsset >= 0 ? '+' : '') + netAsset.toLocaleString() + '원';
  }
  if (budgetEl) budgetEl.textContent = budgetAchievement + '%';
  if (progressFill) progressFill.style.width = Math.min(budgetAchievement, 100) + '%';
  
  console.log('대시보드 업데이트:', { totalIncome, totalExpense, netAsset });
}

console.log('utils.js 로드 완료');

