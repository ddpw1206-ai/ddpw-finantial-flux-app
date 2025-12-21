// ========================================
// 거래 검색/필터 기능 (Transaction Filter)
// ========================================

const TransactionFilter = {
    // 현재 필터 상태
    filters: {
        search: '',
        user: '',
        type: '',
        mainCategory: '',
        paymentMethod: '',
        amountMin: null,
        amountMax: null,
        dateStart: '',
        dateEnd: ''
    },

    // 필터 적용
    apply: function () {
        if (typeof TransactionTable === 'undefined') return;

        let data = TransactionTable.getTransactions();

        // 검색어 필터
        if (this.filters.search) {
            const searchLower = this.filters.search.toLowerCase();
            data = data.filter(tx =>
                (tx.merchant || '').toLowerCase().includes(searchLower) ||
                (tx.detail || '').toLowerCase().includes(searchLower) ||
                (tx.mainCategory || '').toLowerCase().includes(searchLower) ||
                (tx.subCategory || '').toLowerCase().includes(searchLower) ||
                String(tx.amount || '').includes(this.filters.search)
            );
        }

        // 사용자 필터
        if (this.filters.user) {
            data = data.filter(tx => tx.user === this.filters.user);
        }

        // 구분 필터
        if (this.filters.type) {
            data = data.filter(tx => tx.type === this.filters.type);
        }

        // 카테고리 필터
        if (this.filters.mainCategory) {
            data = data.filter(tx => tx.mainCategory === this.filters.mainCategory);
        }

        // 결제수단 필터
        if (this.filters.paymentMethod) {
            data = data.filter(tx => tx.paymentMethod === this.filters.paymentMethod);
        }

        // 금액 범위 필터
        if (this.filters.amountMin !== null) {
            data = data.filter(tx => (tx.amount || 0) >= this.filters.amountMin);
        }
        if (this.filters.amountMax !== null) {
            data = data.filter(tx => (tx.amount || 0) <= this.filters.amountMax);
        }

        // 기간 필터
        if (this.filters.dateStart) {
            data = data.filter(tx => tx.date >= this.filters.dateStart);
        }
        if (this.filters.dateEnd) {
            data = data.filter(tx => tx.date <= this.filters.dateEnd);
        }

        // 필터링된 데이터로 테이블 렌더링
        TransactionTable.render(data);
    },

    // 필터 초기화
    reset: function () {
        this.filters = {
            search: '',
            user: '',
            type: '',
            mainCategory: '',
            paymentMethod: '',
            amountMin: null,
            amountMax: null,
            dateStart: '',
            dateEnd: ''
        };

        // 입력 필드 초기화
        const ids = ['filter-search', 'filter-user', 'filter-type', 'filter-category',
            'filter-payment', 'filter-amount-min', 'filter-amount-max',
            'filter-date-start', 'filter-date-end'];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });

        // 체크박스 필터 초기화
        document.querySelectorAll('.filter-checkbox').forEach(cb => cb.checked = false);

        this.apply();
    },

    // 카테고리 드롭다운 업데이트
    updateCategoryOptions: function () {
        const select = document.getElementById('filter-category');
        if (!select) return;

        select.innerHTML = '<option value="">전체</option>';

        const categories = {
            ...(window.EXPENSE_CATEGORIES || {}),
            ...(window.INCOME_CATEGORIES || {})
        };

        Object.keys(categories).forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            select.appendChild(option);
        });
    },

    // 결제방법 드롭다운 업데이트
    updatePaymentOptions: function () {
        const select = document.getElementById('filter-payment');
        if (!select) return;

        select.innerHTML = '<option value="">전체</option>';

        const options = [
            { value: 'creditCard', text: '신용카드' },
            { value: 'creditInstallment', text: '신용카드(할부)' },
            { value: 'checkCard', text: '체크카드' },
            { value: 'account', text: '계좌이체' },
            { value: 'etc', text: '기타' }
        ];

        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.text;
            select.appendChild(option);
        });
    },

    // 이벤트 바인딩
    bindEvents: function () {
        // 검색 입력
        const searchInput = document.getElementById('filter-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value;
                this.apply();
            });
        }

        // 사용자 필터
        const userSelect = document.getElementById('filter-user');
        if (userSelect) {
            userSelect.addEventListener('change', (e) => {
                this.filters.user = e.target.value;
                this.apply();
            });
        }

        // 구분 필터
        const typeSelect = document.getElementById('filter-type');
        if (typeSelect) {
            typeSelect.addEventListener('change', (e) => {
                this.filters.type = e.target.value;
                this.apply();
            });
        }

        // 카테고리 필터
        const categorySelect = document.getElementById('filter-category');
        if (categorySelect) {
            categorySelect.addEventListener('change', (e) => {
                this.filters.mainCategory = e.target.value;
                this.apply();
            });
        }

        // 결제수단 필터
        const paymentSelect = document.getElementById('filter-payment');
        if (paymentSelect) {
            paymentSelect.addEventListener('change', (e) => {
                this.filters.paymentMethod = e.target.value;
                this.apply();
            });
        }

        // 금액 범위 필터
        const amountMin = document.getElementById('filter-amount-min');
        if (amountMin) {
            amountMin.addEventListener('input', (e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                this.filters.amountMin = val ? Number(val) : null;
                e.target.value = val ? Number(val).toLocaleString() : '';
                this.apply();
            });
        }

        const amountMax = document.getElementById('filter-amount-max');
        if (amountMax) {
            amountMax.addEventListener('input', (e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                this.filters.amountMax = val ? Number(val) : null;
                e.target.value = val ? Number(val).toLocaleString() : '';
                this.apply();
            });
        }

        // 기간 필터
        const dateStart = document.getElementById('filter-date-start');
        if (dateStart) {
            dateStart.addEventListener('change', (e) => {
                this.filters.dateStart = e.target.value;
                this.apply();
            });
        }

        const dateEnd = document.getElementById('filter-date-end');
        if (dateEnd) {
            dateEnd.addEventListener('change', (e) => {
                this.filters.dateEnd = e.target.value;
                this.apply();
            });
        }

        // 초기화 버튼
        const resetBtn = document.getElementById('filter-reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.reset());
        }
    },

    // 초기화
    init: function () {
        console.log('TransactionFilter 초기화');
        this.updateCategoryOptions();
        this.updatePaymentOptions();
        this.bindEvents();

        // 기본값: 현재 월
        const year = TransactionTable?.currentYear || new Date().getFullYear();
        const month = TransactionTable?.currentMonth || new Date().getMonth() + 1;
        const mm = String(month).padStart(2, '0');

        const dateStart = document.getElementById('filter-date-start');
        const dateEnd = document.getElementById('filter-date-end');

        if (dateStart) {
            dateStart.value = `${year}-${mm}-01`;
            this.filters.dateStart = dateStart.value;
        }
        if (dateEnd) {
            const lastDay = new Date(year, month, 0).getDate();
            dateEnd.value = `${year}-${mm}-${String(lastDay).padStart(2, '0')}`;
            this.filters.dateEnd = dateEnd.value;
        }
    }
};

// window 객체에 할당
if (typeof window !== 'undefined') {
    window.TransactionFilter = TransactionFilter;
}

console.log('transaction-filter.js 로드 완료');
