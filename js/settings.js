// DDPW Moneybook Flux – settings.js (v2)

(function () {
    let currentConfig = {
        paymentMethods: {},
        accounts: [],
        incomeCategories: {},
        expenseCategories: {}
    };

    let selectedCategoryType = 'expense'; // 'income' or 'expense'
    let selectedMainCategory = null; // Currently selected main category key

    // 모달 DOM 엘리먼트 캐싱
    let modalEl = null;
    let paymentTbody = null;
    let accountsTbody = null;
    let categoryMainList = null;
    let categorySubList = null;
    let btnSave = null;

    /**
     * 초기화 함수
     */
    async function initSettingsModule() {
        console.log("SettingsModule initialized.");

        // 1. 모달 HTML 로드 (없으면 fetch)
        const container = document.getElementById("modals-container");
        if (!document.getElementById("settingsModal")) {
            try {
                const response = await fetch("modals/settings-modal.html");
                if (response.ok) {
                    const html = await response.text();
                    container.insertAdjacentHTML("beforeend", html);
                } else {
                    console.error("Failed to load settings-modal.html");
                    return;
                }
            } catch (e) {
                console.error("Error loading settings-modal.html:", e);
                return;
            }
        }

        // 2. Element Reference
        modalEl = document.getElementById("settingsModal");
        paymentTbody = document.getElementById("payment-methods-tbody");
        accountsTbody = document.getElementById("accounts-tbody");
        categoryMainList = document.getElementById("category-main-list");
        categorySubList = document.getElementById("category-sub-list");
        btnSave = document.getElementById("settings-save-btn");

        // 3. Event Listeners
        modalEl.addEventListener("show.bs.modal", onShowModal);
        btnSave.addEventListener("click", saveSettings);

        // Payment Tab Buttons
        document.getElementById("btn-add-payment").addEventListener("click", addPaymentMethod);

        // Accounts Tab Buttons
        document.getElementById("btn-add-account").addEventListener("click", addAccount);

        // Categories Tab Buttons
        document.getElementById("btn-add-main-cat").addEventListener("click", addMainCategory);
        document.getElementById("btn-add-sub-cat").addEventListener("click", addSubCategory);

        // Category Type Toggle
        document.querySelectorAll('input[name="categoryType"]').forEach(radio => {
            radio.addEventListener("change", (e) => {
                selectedCategoryType = e.target.value;
                selectedMainCategory = null; // Reset selection
                renderCategories();
            });
        });
    }

    /**
     * 모달 열릴 때 실행
     */
    function onShowModal() {
        console.log("Settings Modal Opened. Loading config...");
        loadConfigData();
        renderAll();
    }

    /**
     * 설정 데이터 로드
     * - DataManager에서 로드 시도
     * - 없으면 Window 전역 상수에서 복사
     */
    function loadConfigData() {
        const saved = window.DataManager.loadConfig();

        if (saved) {
            // 깊은 복사로 참조 끊기
            currentConfig = JSON.parse(JSON.stringify(saved));
        } else {
            // 기본값 사용
            currentConfig = {
                paymentMethods: JSON.parse(JSON.stringify(window.PAYMENT_METHODS)),
                accounts: JSON.parse(JSON.stringify(window.ACCOUNT_DETAILS)),
                incomeCategories: JSON.parse(JSON.stringify(window.INCOME_CATEGORIES)),
                expenseCategories: JSON.parse(JSON.stringify(window.EXPENSE_CATEGORIES))
            };
        }
    }

    /**
     * 전체 렌더링
     */
    function renderAll() {
        renderPaymentMethods();
        renderAccounts();
        renderCategories();
    }

    // ============================================================
    // 1. Payment Methods Logic
    // ============================================================

    function renderPaymentMethods() {
        if (!paymentTbody) return;
        paymentTbody.innerHTML = "";

        const groups = [
            { key: "creditCards", label: "신용카드" },
            { key: "checkCards", label: "체크카드" },
            { key: "accounts", label: "계좌결제" },
            { key: "etc", label: "기타" }
        ];

        groups.forEach(group => {
            const list = currentConfig.paymentMethods[group.key] || [];
            if (list.length === 0) return;

            // Group Header (Optional, or just list flattened)
            // Flattening for simplicity as per requirement
            list.forEach((item, index) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td><span class="badge bg-secondary">${group.label}</span></td>
                    <td><small>${item.id}</small></td>
                    <td>${item.label}</td>
                    <td class="text-truncate" style="max-width: 150px;">${item.note || ""}</td>
                    <td>
                        <button class="btn btn-xs btn-outline-danger btn-delete-payment" 
                                data-group="${group.key}" data-index="${index}">삭제</button>
                    </td>
                `;
                paymentTbody.appendChild(tr);
            });
        });

        // Event delegation for delete buttons
        paymentTbody.querySelectorAll(".btn-delete-payment").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const group = e.target.dataset.group;
                const idx = parseInt(e.target.dataset.index);
                deletePaymentMethod(group, idx);
            });
        });
    }

    function addPaymentMethod() {
        // 간단 구현: Prompt로 입력받기
        const typeMap = { "1": "creditCards", "2": "checkCards", "3": "accounts", "4": "etc" };
        const typeSelection = prompt("추가할 결제수단 유형을 선택하세요:\n1. 신용카드\n2. 체크카드\n3. 계좌결제\n4. 기타");

        const groupKey = typeMap[typeSelection];
        if (!groupKey) return alert("잘못된 선택입니다.");

        const id = prompt("결제수단 ID (영문 권장):", `new_${groupKey}_${Date.now()}`);
        if (!id) return;

        const label = prompt("표시 이름:", "새 결제수단");
        if (!label) return;

        if (!currentConfig.paymentMethods[groupKey]) {
            currentConfig.paymentMethods[groupKey] = [];
        }

        currentConfig.paymentMethods[groupKey].push({
            id: id,
            label: label,
            type: groupKey === 'creditCards' ? 'credit' :
                groupKey === 'checkCards' ? 'check' :
                    groupKey === 'accounts' ? 'account' : 'other'
        });

        renderPaymentMethods();
    }

    function deletePaymentMethod(groupKey, index) {
        if (confirm("정말 삭제하시겠습니까?")) {
            currentConfig.paymentMethods[groupKey].splice(index, 1);
            renderPaymentMethods();
        }
    }


    // ============================================================
    // 2. Accounts Logic
    // ============================================================

    function renderAccounts() {
        if (!accountsTbody) return;
        accountsTbody.innerHTML = "";

        currentConfig.accounts.forEach((acc, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${acc.accountNo}</td>
                <td>${acc.name}</td>
                <td>${acc.bank}</td>
                <td>${acc.note || ""}</td>
                <td>${(acc.initialBalance || 0).toLocaleString()}</td>
                <td class="text-center">
                    <input type="checkbox" class="form-check-input check-account-active" 
                        data-index="${index}" ${acc.active ? "checked" : ""}>
                </td>
                <td>
                    <button class="btn btn-xs btn-outline-danger btn-delete-account" data-index="${index}">삭제</button>
                </td>
            `;
            accountsTbody.appendChild(tr);
        });

        // Active Toggle
        accountsTbody.querySelectorAll(".check-account-active").forEach(chk => {
            chk.addEventListener("change", (e) => {
                const idx = parseInt(e.target.dataset.index);
                currentConfig.accounts[idx].active = e.target.checked;
            });
        });

        // Delete
        accountsTbody.querySelectorAll(".btn-delete-account").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = parseInt(e.target.dataset.index);
                deleteAccount(idx);
            });
        });
    }

    function addAccount() {
        const name = prompt("계좌 별칭 (예: 생활비 통장):");
        if (!name) return;

        const bank = prompt("은행명:", "KB국민");
        const accountNo = prompt("계좌번호:", "000-0000-0000");

        currentConfig.accounts.push({
            no: currentConfig.accounts.length + 1,
            accountNo: accountNo || "",
            name: name,
            bank: bank || "",
            note: "",
            initialBalance: 0,
            active: true
        });

        renderAccounts();
    }

    function deleteAccount(index) {
        if (confirm("계좌를 삭제하시겠습니까? (거래 내역이 유실될 수 있으니 주의하세요)")) {
            currentConfig.accounts.splice(index, 1);
            renderAccounts();
        }
    }


    // ============================================================
    // 3. Categories Logic
    // ============================================================

    function renderCategories() {
        renderMainCategoryList();
        renderSubCategoryList();
    }

    // 대분류 렌더링
    function renderMainCategoryList() {
        if (!categoryMainList) return;
        categoryMainList.innerHTML = "";

        const targetCategories = (selectedCategoryType === 'income')
            ? currentConfig.incomeCategories
            : currentConfig.expenseCategories;

        const keys = Object.keys(targetCategories);

        if (keys.length === 0) {
            categoryMainList.innerHTML = `<li class="list-group-item text-muted text-center">카테고리 없음</li>`;
            return;
        }

        keys.forEach(key => {
            const li = document.createElement("li");
            li.className = `list-group-item list-group-item-action d-flex justify-content-between align-items-center ${key === selectedMainCategory ? 'active' : ''}`;
            li.style.cursor = "pointer";

            li.innerHTML = `
                <span>${key}</span>
                <button class="btn btn-sm btn-link text-danger p-0 btn-del-main-cat" style="text-decoration:none;">×</button>
            `;

            // Row Click -> Select Main
            li.addEventListener("click", (e) => {
                // Ignore if delete button clicked
                if (e.target.classList.contains("btn-del-main-cat")) return;
                selectedMainCategory = key;
                renderCategories(); // Re-render to update active state and sub-list
            });

            // Delete Button
            li.querySelector(".btn-del-main-cat").addEventListener("click", (e) => {
                e.stopPropagation();
                deleteMainCategory(key);
            });

            categoryMainList.appendChild(li);
        });
    }

    // 소분류 렌더링
    function renderSubCategoryList() {
        if (!categorySubList) return;
        categorySubList.innerHTML = "";

        const btnAddSub = document.getElementById("btn-add-sub-cat");

        if (!selectedMainCategory) {
            categorySubList.innerHTML = `<li class="list-group-item text-muted text-center py-4">대분류를 선택하세요.</li>`;
            if (btnAddSub) btnAddSub.disabled = true;
            return;
        }

        if (btnAddSub) btnAddSub.disabled = false;

        const targetCategories = (selectedCategoryType === 'income')
            ? currentConfig.incomeCategories
            : currentConfig.expenseCategories;

        const subList = targetCategories[selectedMainCategory] || [];

        if (subList.length === 0) {
            categorySubList.innerHTML = `<li class="list-group-item text-muted text-center">소분류 없음</li>`;
        } else {
            subList.forEach((sub, index) => {
                const li = document.createElement("li");
                li.className = "list-group-item d-flex justify-content-between align-items-center";
                li.innerHTML = `
                    <span>${sub}</span>
                    <button class="btn btn-sm btn-link text-danger p-0 btn-del-sub-cat">×</button>
                `;

                li.querySelector(".btn-del-sub-cat").addEventListener("click", () => {
                    deleteSubCategory(selectedMainCategory, index);
                });

                categorySubList.appendChild(li);
            });
        }
    }

    function addMainCategory() {
        const name = prompt("대분류 명을 입력하세요:");
        if (!name) return;

        const targetCategories = (selectedCategoryType === 'income')
            ? currentConfig.incomeCategories
            : currentConfig.expenseCategories;

        if (targetCategories[name]) {
            alert("이미 존재하는 분류입니다.");
            return;
        }

        targetCategories[name] = [];
        selectedMainCategory = name; // Auto select new
        renderCategories();
    }

    function deleteMainCategory(key) {
        if (!confirm(`'${key}' 대분류와 하위 모든 소분류를 삭제하시겠습니까?`)) return;

        const targetCategories = (selectedCategoryType === 'income')
            ? currentConfig.incomeCategories
            : currentConfig.expenseCategories;

        delete targetCategories[key];

        if (selectedMainCategory === key) {
            selectedMainCategory = null;
        }
        renderCategories();
    }

    function addSubCategory() {
        if (!selectedMainCategory) return;
        const name = prompt(`'${selectedMainCategory}' 하위에 추가할 소분류 명:`);
        if (!name) return;

        const targetCategories = (selectedCategoryType === 'income')
            ? currentConfig.incomeCategories
            : currentConfig.expenseCategories;

        if (!targetCategories[selectedMainCategory]) {
            targetCategories[selectedMainCategory] = [];
        }

        targetCategories[selectedMainCategory].push(name);
        renderCategories();
    }

    function deleteSubCategory(mainKey, index) {
        const targetCategories = (selectedCategoryType === 'income')
            ? currentConfig.incomeCategories
            : currentConfig.expenseCategories;

        if (targetCategories[mainKey]) {
            targetCategories[mainKey].splice(index, 1);
            renderCategories();
        }
    }


    // ============================================================
    // 4. Save Logic
    // ============================================================

    function saveSettings() {
        // 1. Save to LocalStorage
        window.DataManager.saveConfig(currentConfig);

        // 2. Update Global Constants
        window.PAYMENT_METHODS = currentConfig.paymentMethods;
        window.ACCOUNT_DETAILS = currentConfig.accounts;
        window.INCOME_CATEGORIES = currentConfig.incomeCategories;
        window.EXPENSE_CATEGORIES = currentConfig.expenseCategories;

        // 3. Dispatch Event
        const event = new CustomEvent("ddpw:configUpdated", {
            detail: currentConfig,
            bubbles: true
        });
        document.dispatchEvent(event);

        // 4. Feedback & Close
        alert("설정이 저장되었습니다.");

        // Close Modal
        const bsModal = bootstrap.Modal.getInstance(modalEl);
        if (bsModal) bsModal.hide();
    }


    /**
     * Window Binding
     */
    window.SettingsModule = {
        initSettingsModule
    };

    console.log("SettingsModule loaded.");

})();
