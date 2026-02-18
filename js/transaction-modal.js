// DDPW Moneybook Flux – transaction-modal.js (v2)

(function () {
    // DOM Elements Cache
    let modalEl = null;
    let bsModal = null;
    let formEl = null;

    // Inputs
    let inpId, inpDate, selUser, selType;
    let selMainCat, selSubCat;
    let inpMerchant, inpDetail, inpAmount;
    let selPaymentMethod, selPaymentDetail;
    let btnSave = null;

    /**
     * 초기화 함수
     */
    async function initTransactionModal() {
        console.log("TransactionModal initialized.");

        // 1. 모달 HTML 로드 (없으면 fetch)
        const container = document.getElementById("modals-container");
        if (!document.getElementById("transactionModal")) {
            try {
                const response = await fetch("modals/transaction-modal.html");
                if (response.ok) {
                    const html = await response.text();
                    container.insertAdjacentHTML("beforeend", html);
                } else {
                    console.error("Failed to load transaction-modal.html");
                    return;
                }
            } catch (e) {
                console.error("Error loading transaction-modal.html:", e);
                return;
            }
        }

        // 2. Element Reference
        modalEl = document.getElementById("transactionModal");
        bsModal = new bootstrap.Modal(modalEl);
        formEl = document.getElementById("transaction-form");

        inpId = document.getElementById("tx-id");
        inpDate = document.getElementById("tx-date");
        selUser = document.getElementById("tx-user");
        selType = document.getElementById("tx-type");
        selMainCat = document.getElementById("tx-main-category");
        selSubCat = document.getElementById("tx-sub-category");
        inpMerchant = document.getElementById("tx-merchant");
        inpDetail = document.getElementById("tx-detail");
        inpAmount = document.getElementById("tx-amount");
        selPaymentMethod = document.getElementById("tx-payment-method");
        selPaymentDetail = document.getElementById("tx-payment-detail");
        btnSave = document.getElementById("tx-save-btn");

        // 3. Event Listeners
        // Open Button (from index.html)
        const btnOpen = document.getElementById("btn-add-transaction");
        if (btnOpen) {
            btnOpen.addEventListener("click", () => {
                openModal(); // New mode
            });
        }

        // Modal Events
        modalEl.addEventListener("show.bs.modal", onShowModal);

        // Form Change Events
        selType.addEventListener("change", updateCategories);
        selMainCat.addEventListener("change", updateSubCategories);
        selPaymentMethod.addEventListener("change", updatePaymentDetails);

        // Save Button
        btnSave.addEventListener("click", saveTransaction);

        // Config Update Event Listener
        document.addEventListener("ddpw:configUpdated", () => {
            // Re-populate selects if config changes while app is running
            // But usually this happens when modal is opened, so onShowModal handles it.
        });
    }

    /**
     * 모달 열릴 때 실행
     */
    function onShowModal() {
        populateUserSelect();
        // Payment methods and categories are populated based on current selection or defaults
        // If it's new mode, reset form is called before show, so defaults are set.
        // If edit mode, populate from existing data.

        // Initial populations if empty
        if (selUser.options.length <= 1) populateUserSelect();

        // Trigger updates to ensure options are loaded
        updateCategories();
        updatePaymentDetails();
    }

    /**
     * 모달 열기 (신규/수정 분기)
     * @param {Object|null} transaction - 수정 시 거래 객체, 신규 시 null
     */
    function openModal(transaction = null) {
        // Wait for modal DOM to be ready if called immediately
        if (!modalEl) {
            console.warn("Modal not loaded yet.");
            return;
        }

        if (transaction) {
            // Edit Mode
            setupEditMode(transaction);
        } else {
            // New Mode
            setupNewMode();
        }

        bsModal.show();
    }

    function setupNewMode() {
        formEl.reset();
        inpId.value = "";

        // Set Default Date to Today or Selected Month's 1st day?
        // Better: Today if within selected month, else 1st of selected month.
        const dateInfo = getCurrentYearMonth();
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        if (dateInfo.year == currentYear && dateInfo.month == currentMonth) {
            inpDate.valueAsDate = new Date(); // To UTC/Local issue specific handling might be needed
            // Simple string YYYY-MM-DD
            inpDate.value = new Date().toISOString().substring(0, 10);
        } else {
            const strMonth = String(dateInfo.month).padStart(2, '0');
            inpDate.value = `${dateInfo.year}-${strMonth}-01`;
        }

        // Default Selects
        selUser.value = window.USERS[0] || ""; // 공용
        selType.value = "expense";

        // Trigger updates to fill dependent dropdowns
        updateCategories();
        updatePaymentDetails();
    }

    function setupEditMode(tx) {
        // TODO: 구현 예정 (Phase 2 or later in this task if requested)
        // For now, simple mapping
        inpId.value = tx.id;
        inpDate.value = tx.date;
        selUser.value = tx.user;
        selType.value = tx.type;

        updateCategories(); // Load categories for this type
        selMainCat.value = tx.mainCategory;

        updateSubCategories(); // Load sub-categories
        selSubCat.value = tx.subCategory;

        inpMerchant.value = tx.merchant || "";
        inpDetail.value = tx.detail || "";
        inpAmount.value = tx.amount;

        selPaymentMethod.value = tx.paymentMethod;
        updatePaymentDetails(); // Load details
        selPaymentDetail.value = tx.paymentDetail;
    }


    // ============================================================
    // Select Population Helpers
    // ============================================================

    function populateUserSelect() {
        selUser.innerHTML = '<option value="">선택</option>';
        window.USERS.forEach(user => {
            const opt = document.createElement("option");
            opt.value = user;
            opt.textContent = user;
            selUser.appendChild(opt);
        });
    }

    function updateCategories() {
        const type = selType.value; // income or expense
        const targetCats = (type === 'income')
            ? window.INCOME_CATEGORIES
            : window.EXPENSE_CATEGORIES;

        selMainCat.innerHTML = '<option value="">선택</option>';
        selSubCat.innerHTML = '<option value="">대분류를 먼저 선택하세요</option>';

        Object.keys(targetCats).forEach(key => {
            const opt = document.createElement("option");
            opt.value = key;
            opt.textContent = key;
            selMainCat.appendChild(opt);
        });
    }

    function updateSubCategories() {
        const type = selType.value;
        const mainCat = selMainCat.value;
        const targetCats = (type === 'income')
            ? window.INCOME_CATEGORIES
            : window.EXPENSE_CATEGORIES;

        selSubCat.innerHTML = '<option value="">선택</option>';

        if (mainCat && targetCats[mainCat]) {
            targetCats[mainCat].forEach(sub => {
                const opt = document.createElement("option");
                opt.value = sub;
                opt.textContent = sub;
                selSubCat.appendChild(opt);
            });
        }
    }

    function updatePaymentDetails() {
        const methodType = selPaymentMethod.value; // credit, check, account, cash, pay...

        selPaymentDetail.innerHTML = '<option value="">선택</option>';

        // Map methodType to PAYMENT_METHODS keys
        let targetList = [];
        const pm = window.PAYMENT_METHODS;

        switch (methodType) {
            case 'credit': targetList = pm.creditCards || []; break;
            case 'check': targetList = pm.checkCards || []; break;
            case 'account': targetList = pm.accounts || []; break;
            case 'cash':
            case 'pay':
            case 'other':
                targetList = pm.etc || [];
                break;
            default: targetList = []; break;
        }

        targetList.forEach(item => {
            // Filter by specific type if needed, but 'etc' has mixed types.
            // For simplification, just show all in the list or filter by item.type matching group logic if implemented strictly.
            // Here we just dump the list.
            const opt = document.createElement("option");
            opt.value = item.id; // Store ID
            opt.textContent = item.label;
            selPaymentDetail.appendChild(opt);
        });
    }


    // ============================================================
    // Save Logic
    // ============================================================

    function saveTransaction() {
        // 1. Validation
        if (!formEl.checkValidity()) {
            formEl.reportValidity();
            return;
        }

        // Additional manual checks
        if (inpAmount.value <= 0) {
            alert("금액은 0보다 커야 합니다.");
            return;
        }

        // 2. Prepare Data
        const dateVal = inpDate.value; // YYYY-MM-DD
        const [year, month, day] = dateVal.split('-').map(Number);

        const newTx = {
            id: inpId.value || `tx_${year}${String(month).padStart(2, '0')}_${Date.now()}`,
            date: dateVal,
            user: selUser.value,
            type: selType.value,
            mainCategory: selMainCat.value,
            subCategory: selSubCat.value,
            merchant: inpMerchant.value,
            detail: inpDetail.value,
            amount: Number(inpAmount.value),
            paymentMethod: selPaymentMethod.value, // e.g., 'credit'
            paymentDetail: selPaymentDetail.value, // e.g., 'kb_tantan_pau'
            isFixed: false, // Default
            fixedMasterId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // 3. Load & Update
        // Note: We deliberately use the year/month from the TRANSACTION DATE, not the currently selected dashboard month.
        // Transactions should be stored in the bucket corresponding to their date.
        const currentList = window.DataManager.loadTransactions(year, month);

        if (inpId.value) {
            // Update existing
            const index = currentList.findIndex(t => t.id === inpId.value);
            if (index !== -1) {
                newTx.createdAt = currentList[index].createdAt; // Keep original created time
                currentList[index] = newTx;
            } else {
                // Should not happen, but treat as new?
                currentList.push(newTx);
            }
        } else {
            // Insert new
            currentList.push(newTx);
        }

        window.DataManager.saveTransactions(year, month, currentList);

        // 4. Dispatch Event & Close
        const event = new CustomEvent("ddpw:transactionsUpdated", {
            detail: { year, month, count: currentList.length },
            bubbles: true
        });
        document.dispatchEvent(event);

        bsModal.hide();
        // alert("저장되었습니다."); // Optional
    }


    /**
     * Helper to get currently selected year/month from Dashboard UI
     * (Used for setting default date, etc.)
     */
    function getCurrentYearMonth() {
        const ySelect = document.getElementById("year-select");
        const mSelect = document.getElementById("month-select");

        const now = new Date();
        const year = ySelect ? parseInt(ySelect.value) || now.getFullYear() : now.getFullYear();
        const month = mSelect ? parseInt(mSelect.value) || (now.getMonth() + 1) : (now.getMonth() + 1);

        return { year, month };
    }


    /**
     * Window Binding
     */
    window.TransactionModal = {
        initTransactionModal,
        openModal // Expose for editing from table
    };

    console.log("TransactionModal loaded.");

})();
