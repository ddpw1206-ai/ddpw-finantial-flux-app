// DDPW Moneybook Flux – data-manager.js (v2)

(function () {
    /**
     * 1. Storage Keys Definition
     */
    const STORAGE_KEYS = {
        CONFIG: "ddpw_config",
        TRANSACTIONS_PREFIX: "ddpw_transactions_",       // 예: ddpw_transactions_2025_01
        FIXED_TRANSACTIONS: "ddpw_fixed_transactions",
        ACCOUNT_TX_PREFIX: "ddpw_account_transactions_", // 예: ddpw_account_transactions_2025_01
        BUDGETS_PREFIX: "ddpw_budgets_",                 // 예: ddpw_budgets_2025_01
        MONTHLY_SUMMARY_PREFIX: "ddpw_monthly_summary_"  // 예: ddpw_monthly_summary_2025_01
    };

    /**
     * 2. Utility Functions
     */

    // JSON 파싱 실패 시 기본값 반환
    const safeParse = (jsonString, defaultValue) => {
        if (!jsonString) return defaultValue;
        try {
            return JSON.parse(jsonString);
        } catch (e) {
            console.error("JSON Parse Error:", e);
            return defaultValue;
        }
    };

    // 연/월 키 생성 (예: prefix + "2025_01")
    const buildKey = (prefix, year, month) => {
        // month가 숫자인 경우 1~9월을 "01"~"09"로 변환
        const msg = String(month).padStart(2, "0");
        return `${prefix}${year}_${msg}`;
    };


    /**
     * 3. Config (설정)
     */
    const loadConfig = () => {
        const data = localStorage.getItem(STORAGE_KEYS.CONFIG);
        return safeParse(data, null);
    };

    const saveConfig = (config) => {
        try {
            localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
        } catch (e) {
            console.error("Config Save Error:", e);
        }
    };


    /**
     * 4. Transactions (월별 거래 내역)
     */
    const loadTransactions = (year, month) => {
        const key = buildKey(STORAGE_KEYS.TRANSACTIONS_PREFIX, year, month);
        const data = localStorage.getItem(key);
        return safeParse(data, []);
    };

    const saveTransactions = (year, month, transactions) => {
        const key = buildKey(STORAGE_KEYS.TRANSACTIONS_PREFIX, year, month);
        try {
            localStorage.setItem(key, JSON.stringify(transactions));
        } catch (e) {
            console.error("Transactions Save Error:", e);
        }
    };


    /**
     * 5. Fixed Transactions (고정 거래)
     */
    const loadFixedTransactions = () => {
        const data = localStorage.getItem(STORAGE_KEYS.FIXED_TRANSACTIONS);
        return safeParse(data, []);
    };

    const saveFixedTransactions = (fixedList) => {
        try {
            localStorage.setItem(STORAGE_KEYS.FIXED_TRANSACTIONS, JSON.stringify(fixedList));
        } catch (e) {
            console.error("Fixed Transactions Save Error:", e);
        }
    };


    /**
     * 6. Account Transactions (계좌별 입출금 내역)
     */
    const loadAccountTransactions = (year, month) => {
        const key = buildKey(STORAGE_KEYS.ACCOUNT_TX_PREFIX, year, month);
        const data = localStorage.getItem(key);
        return safeParse(data, []);
    };

    const saveAccountTransactions = (year, month, list) => {
        const key = buildKey(STORAGE_KEYS.ACCOUNT_TX_PREFIX, year, month);
        try {
            localStorage.setItem(key, JSON.stringify(list));
        } catch (e) {
            console.error("Account Transactions Save Error:", e);
        }
    };


    /**
     * 7. Budgets (월별 예산)
     */
    const loadBudgets = (year, month) => {
        const key = buildKey(STORAGE_KEYS.BUDGETS_PREFIX, year, month);
        const data = localStorage.getItem(key);
        return safeParse(data, {}); // 예산은 객체 형태 권장
    };

    const saveBudgets = (year, month, budgets) => {
        const key = buildKey(STORAGE_KEYS.BUDGETS_PREFIX, year, month);
        try {
            localStorage.setItem(key, JSON.stringify(budgets));
        } catch (e) {
            console.error("Budgets Save Error:", e);
        }
    };


    /**
     * 8. Monthly Summary (월별 요약)
     */
    const loadMonthlySummary = (year, month) => {
        const key = buildKey(STORAGE_KEYS.MONTHLY_SUMMARY_PREFIX, year, month);
        const data = localStorage.getItem(key);
        return safeParse(data, null);
    };

    const saveMonthlySummary = (year, month, summary) => {
        const key = buildKey(STORAGE_KEYS.MONTHLY_SUMMARY_PREFIX, year, month);
        try {
            localStorage.setItem(key, JSON.stringify(summary));
        } catch (e) {
            console.error("Monthly Summary Save Error:", e);
        }
    };


    /**
     * 9. Window Binding
     */
    window.DataManager = {
        STORAGE_KEYS,
        // Utils (Testing purpose)
        _buildKey: buildKey,

        // Functions
        loadConfig,
        saveConfig,
        loadTransactions,
        saveTransactions,
        loadFixedTransactions,
        saveFixedTransactions,
        loadAccountTransactions,
        saveAccountTransactions,
        loadBudgets,
        saveBudgets,
        loadMonthlySummary,
        saveMonthlySummary
    };

    console.log("DataManager loaded.");

})();
