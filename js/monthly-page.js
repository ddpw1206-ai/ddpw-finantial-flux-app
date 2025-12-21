// ========================================
// 월별현황 탭 통합 (Monthly Page)
// ========================================

const MonthlyPage = {
    // 현재 연월
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,

    // 연월 변경
    setMonth: function (year, month) {
        // 유효성 검사
        if (month < 1) { month = 12; year--; }
        if (month > 12) { month = 1; year++; }

        this.currentYear = year;
        this.currentMonth = month;

        // UI 업데이트
        this.updateMonthDisplay();

        // 각 모듈에 연월 전달
        if (typeof TransactionTable !== 'undefined') {
            TransactionTable.setMonth(year, month);
        }
        if (typeof MonthlySummary !== 'undefined') {
            MonthlySummary.setMonth(year, month);
        }
        if (typeof TransactionFilter !== 'undefined') {
            // 필터 기간 업데이트
            const mm = String(month).padStart(2, '0');
            const lastDay = new Date(year, month, 0).getDate();
            TransactionFilter.filters.dateStart = `${year}-${mm}-01`;
            TransactionFilter.filters.dateEnd = `${year}-${mm}-${String(lastDay).padStart(2, '0')}`;
            TransactionFilter.apply();
        }
    },

    // 이전 달
    prevMonth: function () {
        this.setMonth(this.currentYear, this.currentMonth - 1);
    },

    // 다음 달
    nextMonth: function () {
        this.setMonth(this.currentYear, this.currentMonth + 1);
    },

    // 월 표시 업데이트
    updateMonthDisplay: function () {
        const display = document.getElementById('month-display');
        if (display) {
            display.textContent = `${this.currentYear}년 ${this.currentMonth}월`;
        }

        // 기존 month-text도 업데이트 (레거시 호환)
        const monthText = document.getElementById('month-text');
        if (monthText) {
            monthText.textContent = `${this.currentYear}년 ${this.currentMonth}월`;
        }
    },

    // 거래 추가 버튼 클릭
    openAddModal: function () {
        if (typeof TransactionModal !== 'undefined') {
            TransactionModal.open();
        }
    },

    // 모든 모듈 새로고침
    refresh: function () {
        if (typeof TransactionTable !== 'undefined') {
            TransactionTable.render();
        }
        if (typeof MonthlySummary !== 'undefined') {
            MonthlySummary.update();
        }
    },

    // 이벤트 바인딩
    bindEvents: function () {
        // 이전 달 버튼
        const prevBtn = document.getElementById('prev-month');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevMonth());
        }

        // 다음 달 버튼
        const nextBtn = document.getElementById('next-month');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextMonth());
        }

        // 거래 추가 버튼
        const addBtn = document.getElementById('add-transaction-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.openAddModal());
        }

        // 신규 등록 버튼 (기존 버튼 호환)
        const newEntryBtn = document.getElementById('new-entry-btn');
        if (newEntryBtn) {
            newEntryBtn.addEventListener('click', () => this.openAddModal());
        }
    },

    // 초기화
    init: function () {
        console.log('MonthlyPage 초기화 시작');

        // 현재 월 표시
        this.updateMonthDisplay();

        // 이벤트 바인딩
        this.bindEvents();

        // 각 모듈 초기화
        if (typeof TransactionModal !== 'undefined') {
            TransactionModal.init();
        }
        if (typeof TransactionTable !== 'undefined') {
            TransactionTable.currentYear = this.currentYear;
            TransactionTable.currentMonth = this.currentMonth;
            TransactionTable.init();
        }
        if (typeof TransactionFilter !== 'undefined') {
            TransactionFilter.init();
        }
        if (typeof MonthlySummary !== 'undefined') {
            MonthlySummary.currentYear = this.currentYear;
            MonthlySummary.currentMonth = this.currentMonth;
            MonthlySummary.init();
        }

        console.log('MonthlyPage 초기화 완료');
    }
};

// window 객체에 할당
if (typeof window !== 'undefined') {
    window.MonthlyPage = MonthlyPage;

    // DOMContentLoaded 후 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => MonthlyPage.init());
    } else {
        // 약간의 지연 후 초기화 (다른 스크립트 로드 대기)
        setTimeout(() => MonthlyPage.init(), 100);
    }
}

console.log('monthly-page.js 로드 완료');
