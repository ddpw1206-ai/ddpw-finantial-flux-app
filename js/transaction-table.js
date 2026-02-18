// DDPW Moneybook Flux – transaction-table.js (v2)

(function () {
    // DOM Elements Cache
    let tableBody;
    let checkAll;
    let btnDeleteSelected;
    let sortSelect;

    // Filter Inputs
    let filterUser, filterType, filterCategory, filterPayment;
    let filterText, filterMin, filterMax;
    let btnApply, btnReset;

    // State
    let currentTransactionList = [];

    /**
     * 초기화 함수
     */
    function initTransactionTable() {
        console.log("TransactionTable initialized.");

        // 1. Element References
        tableBody = document.getElementById("transaction-table-body");
        checkAll = document.getElementById("check-all-rows");
        btnDeleteSelected = document.getElementById("btn-delete-selected");
        sortSelect = document.getElementById("sort-select");

        filterUser = document.getElementById("filter-user");
        filterType = document.getElementById("filter-type");
        filterCategory = document.getElementById("filter-category");
        filterPayment = document.getElementById("filter-payment");
        filterText = document.getElementById("filter-text");
        filterMin = document.getElementById("filter-amount-min");
        filterMax = document.getElementById("filter-amount-max");

        btnApply = document.getElementById("btn-apply-filters");
        btnReset = document.getElementById("btn-reset-filters");

        // 2. Event Listeners
        // Sort & Checkbox
        if (sortSelect) sortSelect.addEventListener("change", refreshTable);
        if (checkAll) checkAll.addEventListener("change", toggleAllCheckboxes);
        if (btnDeleteSelected) btnDeleteSelected.addEventListener("click", deleteSelectedTransactions);

        // Filters
        if (btnApply) btnApply.addEventListener("click", refreshTable);
        if (btnReset) btnReset.addEventListener("click", resetFilters);

        // Year/Month Change (Assuming index.html triggers change event or custom event)
        // Ideally index.html should dispatch 'ddpw:dateChanged' or similar. 
        // For now, we listen to change on select elements directly if they exist.
        const yearSelect = document.getElementById("year-select");
        const monthSelect = document.getElementById("month-select");
        if (yearSelect) yearSelect.addEventListener("change", refreshTable);
        if (monthSelect) monthSelect.addEventListener("change", refreshTable);

        // Global Events
        document.addEventListener("ddpw:transactionsUpdated", (e) => {
            console.log("Transactions updated, refreshing table...", e.detail);
            refreshTable();
        });
        document.addEventListener("ddpw:configUpdated", () => {
            populateFilterOptions();
            refreshTable();
        });

        // 3. Initial Load
        populateFilterOptions();
        refreshTable();
    }

    /**
     * 필터 옵션 채우기 (카테고리, 결제수단 등)
     */
    function populateFilterOptions() {
        if (!filterCategory || !filterPayment) return;

        // Categories (Merge Income & Expense keys for filtering)
        const incomeKeys = Object.keys(window.INCOME_CATEGORIES || {});
        const expenseKeys = Object.keys(window.EXPENSE_CATEGORIES || {});
        const allCats = Array.from(new Set([...incomeKeys, ...expenseKeys])).sort();

        filterCategory.innerHTML = '<option value="">전체</option>';
        allCats.forEach(cat => {
            const opt = document.createElement("option");
            opt.value = cat;
            opt.textContent = cat;
            filterCategory.appendChild(opt);
        });

        // Payment Methods (Flatten groups)
        filterPayment.innerHTML = '<option value="">전체</option>';
        const pm = window.PAYMENT_METHODS || {};
        const groups = [pm.creditCards, pm.checkCards, pm.accounts, pm.etc];

        groups.forEach(group => {
            if (Array.isArray(group)) {
                group.forEach(item => {
                    const opt = document.createElement("option");
                    opt.value = item.id;
                    opt.textContent = item.label;
                    filterPayment.appendChild(opt);
                });
            }
        });
    }

    /**
     * 테이블 새로고침 (데이터 로드 -> 필터 -> 정렬 -> 렌더링)
     */
    function refreshTable() {
        if (!tableBody) return;

        const { year, month } = getCurrentYearMonth();
        let list = window.DataManager.loadTransactions(year, month);

        // 1. Filter
        list = applyFilters(list);

        // 2. Sort
        list = applySort(list);

        // 3. Render
        renderTable(list);

        // Update Label
        const label = document.getElementById("current-month-label");
        if (label) label.textContent = `(${year}년 ${month}월, 총 ${list.length.toLocaleString()}건)`;

        currentTransactionList = list; // Cache for selection
        if (checkAll) checkAll.checked = false;
    }

    /**
     * 필터 적용 Logic
     */
    function applyFilters(list) {
        const userVal = filterUser ? filterUser.value : "";
        const typeVal = filterType ? filterType.value : "";
        const catVal = filterCategory ? filterCategory.value : "";
        const payVal = filterPayment ? filterPayment.value : "";
        const textVal = filterText ? filterText.value.toLowerCase().trim() : "";
        const minVal = filterMin && filterMin.value ? Number(filterMin.value) : null;
        const maxVal = filterMax && filterMax.value ? Number(filterMax.value) : null;

        return list.filter(tx => {
            if (userVal && tx.user !== userVal) return false;
            if (typeVal && tx.type !== typeVal) return false;
            if (catVal && tx.mainCategory !== catVal) return false;
            // Payment Detail ID check
            if (payVal && tx.paymentDetail !== payVal) return false;

            // Text Search (Merchant or Detail)
            if (textVal) {
                const merchant = (tx.merchant || "").toLowerCase();
                const detail = (tx.detail || "").toLowerCase();
                if (!merchant.includes(textVal) && !detail.includes(textVal)) return false;
            }

            // Amount Range
            if (minVal !== null && tx.amount < minVal) return false;
            if (maxVal !== null && tx.amount > maxVal) return false;

            return true;
        });
    }

    /**
     * 정렬 적용 Logic
     */
    function applySort(list) {
        const sortType = sortSelect ? sortSelect.value : "date-desc";

        // 원본 보존을 위해 복사
        const sorted = [...list];

        sorted.sort((a, b) => {
            switch (sortType) {
                case "date-desc":
                    // 날짜 내림차순 (최신순) -> 같으면 ID 내림차순(등록순)
                    return b.date.localeCompare(a.date) || b.id.localeCompare(a.id);
                case "date-asc":
                    return a.date.localeCompare(b.date) || a.id.localeCompare(b.id);
                case "amount-desc":
                    return b.amount - a.amount;
                case "amount-asc":
                    return a.amount - b.amount;
                default:
                    return 0;
            }
        });

        return sorted;
    }

    /**
     * 테이블 렌더링
     */
    function renderTable(list) {
        tableBody.innerHTML = "";

        if (list.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="12" class="text-center py-4 text-muted">거래 내역이 없습니다.</td></tr>`;
            return;
        }

        list.forEach(tx => {
            const tr = document.createElement("tr");

            // Type Badge
            const typeBadge = tx.type === 'income'
                ? `<span class="badge bg-success bg-opacity-10 text-success">수입</span>`
                : `<span class="badge bg-danger bg-opacity-10 text-danger">지출</span>`;

            // Amount formatting
            const amountClass = tx.type === 'income' ? 'text-primary' : 'text-danger';
            const amountPrefix = tx.type === 'income' ? '+' : '-';

            // Payment Label Lookup
            let paymentLabel = tx.paymentDetail || "-";
            // Optional: Find label from PAYMENT_METHODS if you want pretty name instead of ID
            // Simple lookup for now:
            const pm = window.PAYMENT_METHODS;
            const allMethods = [...(pm.creditCards || []), ...(pm.checkCards || []), ...(pm.accounts || []), ...(pm.etc || [])];
            const found = allMethods.find(m => m.id === tx.paymentDetail);
            if (found) paymentLabel = found.label;

            tr.innerHTML = `
                <td class="text-center"><input type="checkbox" class="form-check-input row-check" value="${tx.id}"></td>
                <td>${tx.date}</td>
                <td>${tx.user}</td>
                <td>${typeBadge}</td>
                <td>${tx.mainCategory}</td>
                <td>${tx.subCategory || "-"}</td>
                <td>${tx.merchant || "-"}</td>
                <td>${tx.detail || "-"}</td>
                <td class="text-end fw-bold ${amountClass}">${Number(tx.amount).toLocaleString()}</td>
                <td><small class="text-muted">${getPaymentTypeLabel(tx.paymentMethod)}</small></td>
                <td><small>${paymentLabel}</small></td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-secondary btn-edit-tx" data-id="${tx.id}">✏️</button>
                        <button class="btn btn-outline-danger btn-del-tx" data-id="${tx.id}">🗑️</button>
                    </div>
                </td>
            `;

            tableBody.appendChild(tr);
        });

        // Event Attachments for dynamic buttons
        tableBody.querySelectorAll(".btn-del-tx").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = e.target.closest("button").dataset.id;
                deleteTransaction(id);
            });
        });

        tableBody.querySelectorAll(".btn-edit-tx").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = e.target.closest("button").dataset.id;
                editTransaction(id);
            });
        });
    }

    function getPaymentTypeLabel(type) {
        const map = {
            credit: "신용", check: "체크", account: "계좌", cash: "현금", pay: "페이", other: "기타"
        };
        return map[type] || type;
    }


    // ============================================================
    // Actions
    // ============================================================

    function deleteTransaction(id) {
        if (!confirm("해당 거래를 삭제하시겠습니까?")) return;

        const { year, month } = getCurrentYearMonth();
        let list = window.DataManager.loadTransactions(year, month);

        const newList = list.filter(tx => tx.id !== id);

        window.DataManager.saveTransactions(year, month, newList);

        // Refresh with event
        document.dispatchEvent(new CustomEvent("ddpw:transactionsUpdated", {
            detail: { year, month, count: newList.length }
        }));
    }

    function deleteSelectedTransactions() {
        const checkboxes = tableBody.querySelectorAll(".row-check:checked");
        if (checkboxes.length === 0) return alert("삭제할 항목을 선택해주세요.");

        if (!confirm(`선택한 ${checkboxes.length}건을 삭제하시겠습니까?`)) return;

        const idsToDelete = Array.from(checkboxes).map(cb => cb.value);
        const { year, month } = getCurrentYearMonth();
        let list = window.DataManager.loadTransactions(year, month);

        const newList = list.filter(tx => !idsToDelete.includes(tx.id));

        window.DataManager.saveTransactions(year, month, newList);

        document.dispatchEvent(new CustomEvent("ddpw:transactionsUpdated", {
            detail: { year, month, count: newList.length }
        }));
    }

    function editTransaction(id) {
        // Find transaction object
        const { year, month } = getCurrentYearMonth();
        const list = window.DataManager.loadTransactions(year, month);
        const tx = list.find(t => t.id === id);

        if (tx && window.TransactionModal && window.TransactionModal.openModal) {
            window.TransactionModal.openModal(tx);
        } else {
            console.error("TransactionModal not available.");
        }
    }

    function toggleAllCheckboxes(e) {
        const isChecked = e.target.checked;
        const checkboxes = tableBody.querySelectorAll(".row-check");
        checkboxes.forEach(cb => cb.checked = isChecked);
    }

    function resetFilters() {
        if (filterUser) filterUser.value = "";
        if (filterType) filterType.value = "";
        if (filterCategory) filterCategory.value = "";
        if (filterPayment) filterPayment.value = "";
        if (filterText) filterText.value = "";
        if (filterMin) filterMin.value = "";
        if (filterMax) filterMax.value = "";

        refreshTable();
    }

    // Reuse from Modal or standalone utility
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
    window.TransactionTable = {
        initTransactionTable,
        refresh: refreshTable
    };

    console.log("TransactionTable loaded.");

})();
