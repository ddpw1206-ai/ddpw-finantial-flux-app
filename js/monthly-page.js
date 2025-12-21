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

    // 거래 추가 모달 열기
    openAddModal: function () {
        console.log('openAddModal 호출됨');

        // TransactionModal 사용 (Bootstrap 5 모달)
        if (typeof TransactionModal !== 'undefined') {
            TransactionModal.open();
            return;
        }

        // 대안: 직접 Bootstrap 모달 열기
        const modal = document.getElementById('transactionModal');
        if (modal && typeof bootstrap !== 'undefined') {
            const bsModal = new bootstrap.Modal(modal);
            bsModal.show();
            return;
        }

        console.warn('거래 입력 모달을 찾을 수 없습니다.');
        alert('거래 입력 모달을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
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

    // FAB 메뉴 토글
    toggleFabMenu: function () {
        const fabMenu = document.getElementById('fab-menu');
        const fabMain = document.getElementById('fab-main');

        if (fabMenu) {
            fabMenu.classList.toggle('active');
        }
        if (fabMain) {
            fabMain.classList.toggle('active');
        }
    },

    // 이벤트 바인딩
    bindEvents: function () {
        const self = this;

        // ========== 월 이동 버튼 ==========
        const prevBtn = document.getElementById('prev-month');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => self.prevMonth());
        }

        const nextBtn = document.getElementById('next-month');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => self.nextMonth());
        }

        // ========== 거래 추가 버튼들 ==========

        // 1. 필터 영역의 "+ 거래 추가" 버튼
        const addBtn = document.getElementById('add-transaction-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => self.openAddModal());
        }

        // 2. 상단 "신규 등록" 버튼
        const newEntryBtn = document.getElementById('new-entry-btn');
        if (newEntryBtn) {
            newEntryBtn.addEventListener('click', () => self.openAddModal());
        }

        // ========== FAB 버튼 ==========

        // FAB 메인 버튼 (+ 버튼)
        const fabMain = document.getElementById('fab-main');
        if (fabMain) {
            fabMain.addEventListener('click', () => self.toggleFabMenu());
        }

        // FAB 대시보드 버튼 (월별 현황 등록)
        const fabDashboard = document.getElementById('fab-dashboard');
        if (fabDashboard) {
            fabDashboard.addEventListener('click', () => {
                self.openAddModal();
                self.toggleFabMenu(); // 메뉴 닫기
            });
        }

        // FAB 계좌 버튼
        const fabAccounts = document.getElementById('fab-accounts');
        if (fabAccounts) {
            fabAccounts.addEventListener('click', () => {
                // 계좌 입출금 모달 열기 (있으면)
                if (typeof window.openAccountTransactionModal === 'function') {
                    window.openAccountTransactionModal();
                } else {
                    self.openAddModal(); // 대안으로 거래 모달 열기
                }
                self.toggleFabMenu();
            });
        }

        // FAB 결제수단 버튼
        const fabPayments = document.getElementById('fab-payments');
        if (fabPayments) {
            fabPayments.addEventListener('click', () => {
                // 카드 대금 모달 열기 (있으면)
                if (typeof window.openCardPaymentModal === 'function') {
                    window.openCardPaymentModal();
                } else {
                    self.openAddModal();
                }
                self.toggleFabMenu();
            });
        }

        // FAB 저축 버튼
        const fabSaving = document.getElementById('fab-saving');
        if (fabSaving) {
            fabSaving.addEventListener('click', () => {
                // 저축 모달 열기 (있으면)
                console.log('저축 등록 기능은 추후 구현 예정입니다.');
                self.toggleFabMenu();
            });
        }

        console.log('MonthlyPage 이벤트 바인딩 완료');
    },

    // 초기화
    init: function () {
        console.log('MonthlyPage 초기화 시작');

        // 현재 월 표시
        this.updateMonthDisplay();

        // 이벤트 바인딩
        this.bindEvents();

        // 각 모듈 초기화 (순서 중요)
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
        document.addEventListener('DOMContentLoaded', () => setTimeout(() => MonthlyPage.init(), 100));
    } else {
        // 약간의 지연 후 초기화 (다른 스크립트 로드 대기)
        setTimeout(() => MonthlyPage.init(), 100);
    }
}

console.log('monthly-page.js 로드 완료');
