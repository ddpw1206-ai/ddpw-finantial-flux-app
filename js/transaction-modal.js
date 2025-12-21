// ========================================
// 거래 입력 모달 로직 (Transaction Modal)
// ========================================

const TransactionModal = {
    // localStorage 키 생성
    getStorageKey: function (year, month) {
        const mm = String(month).padStart(2, '0');
        return `ddpw_transactions_${year}_${mm}`;
    },

    // 거래 목록 가져오기
    getTransactions: function (year, month) {
        return window.DataManager ? window.DataManager.getTransactions(year, month) : [];
    },

    // 거래 추가
    addTransaction: function (transaction) {
        if (!window.DataManager) return false;

        // 중복 검사
        if (this.isDuplicate(transaction)) {
            if (!confirm('유사한 거래가 이미 존재합니다. 그래도 추가하시겠습니까?')) {
                return false;
            }
        }

        return window.DataManager.addTransaction(transaction);
    },

    // 중복 검사
    isDuplicate: function (newTx) {
        const date = new Date(newTx.date);
        const transactions = this.getTransactions(date.getFullYear(), date.getMonth() + 1);
        return transactions.some(tx =>
            tx.date === newTx.date &&
            tx.user === newTx.user &&
            tx.mainCategory === newTx.mainCategory &&
            tx.subCategory === newTx.subCategory &&
            tx.paymentDetail === newTx.paymentDetail &&
            tx.amount === newTx.amount
        );
    },

    // 거래 수정
    updateTransaction: function (id, updates) {
        return window.DataManager ? window.DataManager.updateTransaction(id, updates) : false;
    },

    // 거래 삭제
    deleteTransaction: function (id, year, month) {
        return window.DataManager ? window.DataManager.deleteTransaction(id, year, month) : false;
    },

    // 폼 데이터 수집
    collectFormData: function () {
        const form = document.getElementById('transaction-form');
        if (!form) return null;

        // 필수 필드
        const date = document.getElementById('tx-date')?.value;
        const user = document.getElementById('tx-user')?.value;
        const typeRadio = form.querySelector('input[name="tx-type"]:checked');
        const type = typeRadio ? typeRadio.value : null;
        const mainCategory = document.getElementById('tx-main-category')?.value;
        const subCategory = document.getElementById('tx-sub-category')?.value;
        const amountRaw = document.getElementById('tx-amount')?.value;
        const amount = Number((amountRaw || '').replace(/,/g, '')) || 0;
        const paymentMethod = document.getElementById('tx-payment-method')?.value;
        const paymentDetail = document.getElementById('tx-payment-detail')?.value;

        // 선택 필드
        const merchant = document.getElementById('tx-merchant')?.value || '';
        const detail = document.getElementById('tx-detail')?.value || '';
        const isFixed = document.getElementById('tx-is-fixed')?.checked || false;

        // 고정 거래용 기간
        let fixedStart = null;
        let fixedEnd = null;
        if (isFixed) {
            fixedStart = document.getElementById('tx-fixed-start')?.value;
            fixedEnd = document.getElementById('tx-fixed-end')?.value;
        }

        // 할부 정보
        let installment = { period: 1, isInterestFree: false };
        const useInstallment = document.getElementById('tx-use-installment')?.checked;
        if (useInstallment) {
            installment.period = Number(document.getElementById('tx-installment-period')?.value) || 1;
            installment.isInterestFree = document.getElementById('tx-is-interest-free')?.checked || false;
        }

        return {
            date, user, type, mainCategory, subCategory,
            amount, paymentMethod, paymentDetail,
            merchant, detail, isFixed, fixedStart, fixedEnd, installment
        };
    },

    // 폼 유효성 검사
    validateForm: function (data) {
        if (!data.date) { alert('날짜를 입력해주세요.'); return false; }
        if (!data.user) { alert('사용자를 선택해주세요.'); return false; }
        if (!data.type) { alert('구분을 선택해주세요.'); return false; }
        if (!data.mainCategory) { alert('대분류를 선택해주세요.'); return false; }
        if (!data.subCategory) { alert('소분류를 선택해주세요.'); return false; }
        if (!data.amount || data.amount <= 0) { alert('금액을 0보다 큰 값으로 입력해주세요.'); return false; }
        if (!data.paymentMethod) { alert('결제방법을 선택해주세요.'); return false; }
        if (!data.paymentDetail) { alert('세부 결제수단을 선택해주세요.'); return false; }
        return true;
    },

    // 카테고리 옵션 업데이트
    updateCategoryOptions: function (type) {
        const mainSelect = document.getElementById('tx-main-category');
        const subSelect = document.getElementById('tx-sub-category');
        if (!mainSelect || !subSelect) return;

        const categories = type === 'income' ?
            (window.INCOME_CATEGORIES || window.incomeCategoryItems || {}) :
            (window.EXPENSE_CATEGORIES || window.expenseCategoryItems || {});

        mainSelect.innerHTML = '<option value="">--선택--</option>';
        subSelect.innerHTML = '<option value="">대분류를 먼저 선택하세요</option>';

        Object.keys(categories).forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            mainSelect.appendChild(option);
        });
    },

    // 소분류 옵션 업데이트
    updateSubCategoryOptions: function (type, mainCategory) {
        const subSelect = document.getElementById('tx-sub-category');
        if (!subSelect) return;

        const categories = type === 'income' ?
            (window.INCOME_CATEGORIES || window.incomeCategoryItems || {}) :
            (window.EXPENSE_CATEGORIES || window.expenseCategoryItems || {});

        subSelect.innerHTML = '<option value="">--선택--</option>';

        if (mainCategory && categories[mainCategory]) {
            categories[mainCategory].forEach(item => {
                const option = document.createElement('option');
                option.value = item;
                option.textContent = item;
                subSelect.appendChild(option);
            });
        }
    },

    // 결제수단 드롭다운 업데이트
    updatePaymentMethods: function () {
        const methodSelect = document.getElementById('tx-payment-method');
        if (!methodSelect) return;

        methodSelect.innerHTML = '<option value="">--선택--</option>';
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
            methodSelect.appendChild(option);
        });
    },

    // 세부 결제수단 업데이트
    updatePaymentDetails: function (method) {
        const detailSelect = document.getElementById('tx-payment-detail');
        if (!detailSelect) return;

        detailSelect.innerHTML = '<option value="">--선택--</option>';

        const pm = window.PAYMENT_METHODS || {};
        let items = [];

        switch (method) {
            case 'creditCard':
                items = pm.creditCards || [];
                break;
            case 'creditInstallment':
                items = pm.creditInstallment || [];
                break;
            case 'checkCard':
                items = pm.checkCards || [];
                break;
            case 'account':
                items = pm.accounts || [];
                break;
            case 'etc':
                items = pm.etc || [];
                break;
        }

        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            option.textContent = item;
            detailSelect.appendChild(option);
        });
    },

    // 모달 열기
    open: function (editData = null) {
        const modal = document.getElementById('transactionModal');
        if (!modal) {
            console.error('transactionModal not found');
            return;
        }

        // Bootstrap 5 모달 사용
        const bsModal = new bootstrap.Modal(modal);

        // 폼 초기화
        this.resetForm();

        // 수정 모드인 경우 데이터 채우기
        if (editData) {
            this.fillForm(editData);
            window._editingTransactionId = editData.id;
        } else {
            window._editingTransactionId = null;
        }

        bsModal.show();
    },

    // 모달 닫기
    close: function () {
        const modal = document.getElementById('transactionModal');
        if (modal) {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) bsModal.hide();
        }
        window._editingTransactionId = null;
    },

    // 폼 초기화
    resetForm: function () {
        const form = document.getElementById('transaction-form');
        if (form) form.reset();

        // 오늘 날짜로 설정
        const dateInput = document.getElementById('tx-date');
        if (dateInput) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }

        // 드롭다운 초기화
        this.updateCategoryOptions('expense');
        this.updatePaymentMethods();

        const subSelect = document.getElementById('tx-sub-category');
        if (subSelect) subSelect.innerHTML = '<option value="">대분류를 먼저 선택하세요</option>';

        const detailSelect = document.getElementById('tx-payment-detail');
        if (detailSelect) detailSelect.innerHTML = '<option value="">결제방법을 먼저 선택하세요</option>';
    },

    // 폼 데이터 채우기 (수정 모드)
    fillForm: function (data) {
        if (!data) return;

        document.getElementById('tx-date').value = data.date || '';
        document.getElementById('tx-user').value = data.user || '';

        const typeRadio = document.querySelector(`input[name="tx-type"][value="${data.type}"]`);
        if (typeRadio) typeRadio.checked = true;

        this.updateCategoryOptions(data.type);
        document.getElementById('tx-main-category').value = data.mainCategory || '';

        this.updateSubCategoryOptions(data.type, data.mainCategory);
        document.getElementById('tx-sub-category').value = data.subCategory || '';

        document.getElementById('tx-merchant').value = data.merchant || '';
        document.getElementById('tx-detail').value = data.detail || '';
        document.getElementById('tx-amount').value = data.amount ? data.amount.toLocaleString() : '';

        document.getElementById('tx-payment-method').value = data.paymentMethod || '';
        this.updatePaymentDetails(data.paymentMethod);
        document.getElementById('tx-payment-detail').value = data.paymentDetail || '';

        // 고정 거래 복원
        const isFixed = data.isFixed || false;
        document.getElementById('tx-is-fixed').checked = isFixed;
        const fixedOptions = document.getElementById('tx-fixed-options');
        if (fixedOptions) fixedOptions.style.display = isFixed ? 'block' : 'none';
        if (isFixed) {
            document.getElementById('tx-fixed-start').value = data.fixedStart || '';
            document.getElementById('tx-fixed-end').value = data.fixedEnd || '';
        }

        // 할부 정보 복원
        const installment = data.installment || { period: 1, isInterestFree: false };
        const isCreditCard = data.paymentMethod === 'creditCard' || data.paymentMethod === 'creditInstallment';
        const installmentArea = document.getElementById('tx-installment-area');
        if (installmentArea) installmentArea.style.display = isCreditCard ? 'block' : 'none';

        const useInst = installment.period > 1;
        document.getElementById('tx-use-installment').checked = useInst;
        const instOptions = document.getElementById('tx-installment-options');
        if (instOptions) instOptions.style.display = useInst ? 'flex' : 'none';

        if (useInst) {
            document.getElementById('tx-installment-period').value = installment.period;
            document.getElementById('tx-is-interest-free').checked = installment.isInterestFree;
        }
    },

    // 폼 제출 처리
    handleSubmit: function (e) {
        e.preventDefault();

        const data = this.collectFormData();
        if (!data) return;

        if (!this.validateForm(data)) return;

        let success = false;

        if (window._editingTransactionId) {
            // 수정 모드
            success = this.updateTransaction(window._editingTransactionId, data);
            if (success) alert('거래가 수정되었습니다.');
        } else {
            // 추가 모드
            success = this.addTransaction(data);
            if (success) alert('거래가 등록되었습니다.');
        }

        if (success) {
            this.close();
            // 테이블 및 대시보드 갱신
            if (typeof TransactionTable !== 'undefined') {
                TransactionTable.render();
            }
            if (typeof MonthlySummary !== 'undefined') {
                MonthlySummary.update();
            }
        }
    },

    // 초기화
    init: function () {
        console.log('TransactionModal 초기화 시작');

        // 폼 제출 이벤트
        const form = document.getElementById('transaction-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // 구분 변경 이벤트
        const typeRadios = document.querySelectorAll('input[name="tx-type"]');
        typeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.updateCategoryOptions(e.target.value);
            });
        });

        // 대분류 변경 이벤트
        const mainCatSelect = document.getElementById('tx-main-category');
        if (mainCatSelect) {
            mainCatSelect.addEventListener('change', (e) => {
                const typeRadio = document.querySelector('input[name="tx-type"]:checked');
                const type = typeRadio ? typeRadio.value : 'expense';
                this.updateSubCategoryOptions(type, e.target.value);
            });
        }

        // 결제방법 변경 이벤트
        const payMethodSelect = document.getElementById('tx-payment-method');
        if (payMethodSelect) {
            payMethodSelect.addEventListener('change', (e) => {
                const val = e.target.value;
                this.updatePaymentDetails(val);

                // 신용카드일 때만 할부 UI 표시 (다양한 신용카드 계열 호환)
                const installmentArea = document.getElementById('tx-installment-area');
                if (installmentArea) {
                    // creditCard, creditInstallment 등 'credit'을 포함하는 경우 표시
                    const isCredit = val.toLowerCase().includes('credit');
                    installmentArea.style.display = isCredit ? 'block' : 'none';
                    console.log('Installment UI display set to:', isCredit ? 'block' : 'none', 'for value:', val);
                }
            });
        }

        // 할부 체크박스 이벤트
        const useInstallmentCheck = document.getElementById('tx-use-installment');
        if (useInstallmentCheck) {
            useInstallmentCheck.addEventListener('change', (e) => {
                const options = document.getElementById('tx-installment-options');
                if (options) options.style.display = e.target.checked ? 'flex' : 'none';
            });
        }

        // 고정 거래 체크박스 이벤트
        const isFixedCheck = document.getElementById('tx-is-fixed');
        if (isFixedCheck) {
            isFixedCheck.addEventListener('change', (e) => {
                const options = document.getElementById('tx-fixed-options');
                if (options) options.style.display = e.target.checked ? 'block' : 'none';

                // 체크 시 현재 월을 시작월로 기본값 설정
                if (e.target.checked) {
                    const dateVal = document.getElementById('tx-date').value;
                    if (dateVal) {
                        document.getElementById('tx-fixed-start').value = dateVal.substring(0, 7);
                    }
                }
            });
        }

        // 금액 입력 콤마 처리
        const amountInput = document.getElementById('tx-amount');
        if (amountInput) {
            amountInput.addEventListener('input', (e) => {
                let val = e.target.value.replace(/[^0-9]/g, '');
                e.target.value = val ? Number(val).toLocaleString() : '';
            });
        }

        // 취소 버튼
        const cancelBtn = document.getElementById('tx-cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.close());
        }

        console.log('TransactionModal 초기화 완료');
    }
};

// window 객체에 할당
if (typeof window !== 'undefined') {
    window.TransactionModal = TransactionModal;
    window.openTransactionModal = function (data = null) { TransactionModal.open(data); };
    window.openModal = function (isEdit = false) {
        if (isEdit && window.editingId) {
            // Find transaction by id and open
            const tx = DataManager.getTransactions().find(t => t.id === window.editingId);
            TransactionModal.open(tx);
        } else {
            TransactionModal.open();
        }
    };

    // DOMContentLoaded 후 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => TransactionModal.init());
    } else {
        TransactionModal.init();
    }
}

console.log('transaction-modal.js 로드 완료');

