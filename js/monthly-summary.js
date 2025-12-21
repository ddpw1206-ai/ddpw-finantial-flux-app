// ========================================
// 월별 현황 대시보드 (Monthly Summary)
// ========================================

const MonthlySummary = {
  // 현재 연월
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth() + 1,

  // 컨테이너 ID
  containerId: 'monthly-summary-container',

  // localStorage 키
  getStorageKey: function (year, month) {
    const mm = String(month).padStart(2, '0');
    return `ddpw_monthly_summary_${year}_${mm}`;
  },

  // 캐시된 요약 저장
  saveCache: function (year, month, summary) {
    try {
      const key = this.getStorageKey(year, month);
      localStorage.setItem(key, JSON.stringify(summary));
    } catch (e) {
      console.error('월별 요약 캐시 저장 실패:', e);
    }
  },

  // 캐시된 요약 로드
  loadCache: function (year, month) {
    try {
      const key = this.getStorageKey(year, month);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('월별 요약 캐시 로드 실패:', e);
      return null;
    }
  },

  // 거래 데이터 가져오기
  getTransactions: function (year, month) {
    if (typeof TransactionModal !== 'undefined') {
      return TransactionModal.getTransactions(year, month);
    }
    return [];
  },

  // 요약 계산
  calculate: function (year, month) {
    const transactions = this.getTransactions(year, month);

    // 수입 계산
    const incomeTx = transactions.filter(tx => tx.type === 'income');
    const fixedIncome = incomeTx.filter(tx => tx.isFixed).reduce((sum, tx) => sum + (tx.amount || 0), 0);
    const variableIncome = incomeTx.filter(tx => !tx.isFixed).reduce((sum, tx) => sum + (tx.amount || 0), 0);
    const totalIncome = fixedIncome + variableIncome;

    // 지출 계산
    const expenseTx = transactions.filter(tx => tx.type === 'expense');
    const fixedExpense = expenseTx.filter(tx => tx.isFixed).reduce((sum, tx) => sum + (tx.amount || 0), 0);
    const variableExpense = expenseTx.filter(tx => !tx.isFixed).reduce((sum, tx) => sum + (tx.amount || 0), 0);
    const totalExpense = fixedExpense + variableExpense;

    // 순자산 계산
    const monthlyChange = totalIncome - totalExpense;

    // 전월 잔액 가져오기
    let prevYear = year;
    let prevMonth = month - 1;
    if (prevMonth < 1) {
      prevMonth = 12;
      prevYear--;
    }
    const prevSummary = this.loadCache(prevYear, prevMonth);
    const prevBalance = prevSummary ? (prevSummary.endBalance || 0) : 0;
    const endBalance = prevBalance + monthlyChange;

    // 예산 달성률 (예산 데이터가 있을 경우)
    const budget = this.getBudget(year, month);
    const budgetRate = budget > 0 ? Math.round((totalExpense / budget) * 100) : 0;
    let budgetStatus = '✅';
    if (budgetRate > 100) budgetStatus = '❌';
    else if (budgetRate > 80) budgetStatus = '🟡';

    const summary = {
      year, month,
      fixedIncome, variableIncome, totalIncome,
      fixedExpense, variableExpense, totalExpense,
      prevBalance, endBalance, monthlyChange,
      budget, budgetRate, budgetStatus,
      transactionCount: transactions.length,
      lastUpdated: new Date().toISOString()
    };

    // 캐시 저장
    this.saveCache(year, month, summary);

    return summary;
  },

  // 예산 가져오기
  getBudget: function (year, month) {
    // 예산 데이터가 있으면 사용, 없으면 기본값
    try {
      const key = `ddpw_budgets_${year}`;
      const data = localStorage.getItem(key);
      if (data) {
        const budgets = JSON.parse(data);
        return budgets[month] || 0;
      }
    } catch (e) {
      console.error('예산 로드 실패:', e);
    }
    return 0;
  },

  // 렌더링
  render: function () {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.warn('Monthly summary container not found');
      return;
    }

    const summary = this.calculate(this.currentYear, this.currentMonth);

    container.innerHTML = `
      <div class="row g-4">
        <!-- 수입 현황 -->
        <div class="col-md-4">
          <div class="card border-success h-100">
            <div class="card-header bg-success text-white">
              <h6 class="mb-0">💰 수입 현황</h6>
            </div>
            <div class="card-body">
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">고정 수입</span>
                <strong class="text-success">${summary.fixedIncome.toLocaleString()}원</strong>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">변동 수입</span>
                <strong class="text-success">${summary.variableIncome.toLocaleString()}원</strong>
              </div>
              <hr>
              <div class="d-flex justify-content-between">
                <span class="fw-bold">총 수입</span>
                <strong class="text-success fs-5">${summary.totalIncome.toLocaleString()}원</strong>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 지출 현황 -->
        <div class="col-md-4">
          <div class="card border-danger h-100">
            <div class="card-header bg-danger text-white">
              <h6 class="mb-0">💸 지출 현황</h6>
            </div>
            <div class="card-body">
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">고정 지출</span>
                <strong class="text-danger">${summary.fixedExpense.toLocaleString()}원</strong>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">변동 지출</span>
                <strong class="text-danger">${summary.variableExpense.toLocaleString()}원</strong>
              </div>
              <hr>
              <div class="d-flex justify-content-between">
                <span class="fw-bold">총 지출</span>
                <strong class="text-danger fs-5">${summary.totalExpense.toLocaleString()}원</strong>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 순자산 현황 -->
        <div class="col-md-4">
          <div class="card border-primary h-100">
            <div class="card-header bg-primary text-white">
              <h6 class="mb-0">💵 순자산 현황</h6>
            </div>
            <div class="card-body">
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">전월 말 잔액</span>
                <strong>${summary.prevBalance.toLocaleString()}원</strong>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">월별 변동</span>
                <strong class="${summary.monthlyChange >= 0 ? 'text-success' : 'text-danger'}">
                  ${summary.monthlyChange >= 0 ? '+' : ''}${summary.monthlyChange.toLocaleString()}원
                </strong>
              </div>
              <hr>
              <div class="d-flex justify-content-between">
                <span class="fw-bold">이월 말 잔액</span>
                <strong class="fs-5">${summary.endBalance.toLocaleString()}원</strong>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 예산 달성률 -->
        ${summary.budget > 0 ? `
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h6 class="mb-0">📊 예산 달성률</h6>
            </div>
            <div class="card-body">
              <div class="d-flex justify-content-between mb-2">
                <span>예산: ${summary.budget.toLocaleString()}원</span>
                <span>지출: ${summary.totalExpense.toLocaleString()}원</span>
                <span class="fw-bold">${summary.budgetStatus} ${summary.budgetRate}%</span>
              </div>
              <div class="progress" style="height: 20px;">
                <div class="progress-bar ${summary.budgetRate > 100 ? 'bg-danger' : summary.budgetRate > 80 ? 'bg-warning' : 'bg-success'}" 
                     role="progressbar" 
                     style="width: ${Math.min(summary.budgetRate, 100)}%">
                  ${summary.budgetRate}%
                </div>
              </div>
            </div>
          </div>
        </div>
        ` : ''}
      </div>
    `;
  },

  // 업데이트
  update: function () {
    this.render();
  },

  // 연월 설정
  setMonth: function (year, month) {
    this.currentYear = year;
    this.currentMonth = month;
    this.render();
  },

  // 초기화
  init: function () {
    console.log('MonthlySummary 초기화');
    this.render();
  }
};

// window 객체에 할당
if (typeof window !== 'undefined') {
  window.MonthlySummary = MonthlySummary;
  window.updateDashboard = function () { MonthlySummary.update(); };
}

console.log('monthly-summary.js 로드 완료');
