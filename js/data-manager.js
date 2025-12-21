// ========================================
// localStorage 저장
// ========================================
function saveData() {
  try {
    // 항상 localStorage에 저장 (즉시 반영)
    localStorage.setItem('budgetData', JSON.stringify(transactionData));
    console.log('거래 데이터 저장:', transactionData.length);

    // 폴더가 선택되어 있으면 파일에도 저장
    const folderHandle = window.dataFolderHandle || (typeof dataFolderHandle !== 'undefined' ? dataFolderHandle : null);
    if (folderHandle) {
      saveDataToFolder().catch(error => {
        console.error('파일 저장 실패, localStorage만 사용:', error);
      });
    }
  } catch (error) {
    console.error('데이터 저장 오류:', error);
  }
}

function saveAccountData() {
  try {
    // 항상 localStorage에 저장 (즉시 반영)
    localStorage.setItem('accountData', JSON.stringify(accountData));
    console.log('계좌 데이터 저장:', accountData.length);

    // 폴더가 선택되어 있으면 파일에도 저장
    const folderHandle = window.dataFolderHandle || (typeof dataFolderHandle !== 'undefined' ? dataFolderHandle : null);
    if (folderHandle) {
      saveDataToFolder().catch(error => {
        console.error('파일 저장 실패, localStorage만 사용:', error);
      });
    }
  } catch (error) {
    console.error('계좌 데이터 저장 오류:', error);
  }
}

function saveMerchantHistory() {
  try {
    // 항상 localStorage에 저장 (즉시 반영)
    localStorage.setItem('merchantHistory', JSON.stringify(merchantHistory));
    console.log('사용처 히스토리 저장:', merchantHistory.length);

    // 폴더가 선택되어 있으면 파일에도 저장
    const folderHandle = window.dataFolderHandle || (typeof dataFolderHandle !== 'undefined' ? dataFolderHandle : null);
    if (folderHandle) {
      saveDataToFolder().catch(error => {
        console.error('파일 저장 실패, localStorage만 사용:', error);
      });
    }
  } catch (error) {
    console.error('사용처 저장 오류:', error);
  }
}

function saveCardData() {
  try {
    // 항상 localStorage에 저장 (즉시 반영)
    localStorage.setItem('cardData', JSON.stringify(cardData));
    console.log('카드 데이터 저장:', cardData.length);

    // 폴더가 선택되어 있으면 파일에도 저장
    const folderHandle = window.dataFolderHandle || (typeof dataFolderHandle !== 'undefined' ? dataFolderHandle : null);
    if (folderHandle) {
      saveDataToFolder().catch(error => {
        console.error('파일 저장 실패, localStorage만 사용:', error);
      });
    }
  } catch (error) {
    console.error('카드 데이터 저장 오류:', error);
  }
}

function saveAccountCardPayments() {
  try {
    // 항상 localStorage에 저장 (즉시 반영)
    localStorage.setItem('accountCardPayments', JSON.stringify(accountCardPayments));
    console.log('카드 대금 납부 내역 저장:', accountCardPayments.length);

    // 폴더가 선택되어 있으면 파일에도 저장
    const folderHandle = window.dataFolderHandle || (typeof dataFolderHandle !== 'undefined' ? dataFolderHandle : null);
    if (folderHandle) {
      saveDataToFolder().catch(error => {
        console.error('파일 저장 실패, localStorage만 사용:', error);
      });
    }
  } catch (error) {
    console.error('카드 대금 납부 내역 저장 오류:', error);
  }
}

// ========================================
// localStorage 로드
// ========================================
function loadData() {
  try {
    const saved = localStorage.getItem('budgetData');
    if (saved) {
      transactionData = JSON.parse(saved);
      console.log('거래 데이터 로드:', transactionData.length);
    }
  } catch (error) {
    console.error('데이터 로드 오류:', error);
  }
}

function loadAccountData() {
  try {
    const saved = localStorage.getItem('accountData');
    if (saved) {
      accountData = JSON.parse(saved);
      console.log('계좌 데이터 로드:', accountData.length);
    }
  } catch (error) {
    console.error('계좌 데이터 로드 오류:', error);
  }
}

function loadMerchantHistory() {
  try {
    const saved = localStorage.getItem('merchantHistory');
    if (saved) {
      merchantHistory = JSON.parse(saved);
      console.log('사용처 히스토리 로드:', merchantHistory.length);
    }
  } catch (error) {
    console.error('사용처 로드 오류:', error);
  }
}

function loadCardData() {
  try {
    const saved = localStorage.getItem('cardData');
    if (saved) {
      cardData = JSON.parse(saved);
      console.log('카드 데이터 로드:', cardData.length);
    } else {
      // 기본 카드 데이터 (초기값)
      cardData = [
        { id: Date.now(), name: 'KB 탄탄대로 올쇼핑', type: 'credit', cardCompany: 'KB카드' },
        { id: Date.now() + 1, name: '삼성 네이버 taptap', type: 'credit', cardCompany: '삼성카드' },
        { id: Date.now() + 2, name: '삼성 베네핏', type: 'credit', cardCompany: '삼성카드' },
        { id: Date.now() + 3, name: '카카오뱅크 체크', type: 'debit', cardCompany: '카카오뱅크' }
      ];
      localStorage.setItem('cardData', JSON.stringify(cardData));
    }
  } catch (error) {
    console.error('카드 데이터 로드 오류:', error);
  }
}

function loadAccountCardPayments() {
  try {
    const saved = localStorage.getItem('accountCardPayments');
    if (saved) {
      accountCardPayments = JSON.parse(saved);
      console.log('카드 대금 납부 내역 로드:', accountCardPayments.length);
    }
  } catch (error) {
    console.error('카드 대금 납부 내역 로드 오류:', error);
  }
}

function loadCardParsingTemplates() {
  try {
    const saved = localStorage.getItem('cardParsingTemplates');
    if (saved) {
      cardParsingTemplates = JSON.parse(saved);
      console.log('카드 파싱 템플릿 로드 완료');
    }
  } catch (error) {
    console.error('카드 파싱 템플릿 로드 오류:', error);
  }
}

// ========================================
// File System Access API를 사용한 파일 저장/로드
// ========================================

// dataFolderHandle은 config.js에서 선언되어 있으므로 여기서는 사용만 함
// window.dataFolderHandle을 통해 접근

// 폴더 선택 및 저장
async function selectDataFolder() {
  try {
    if ('showDirectoryPicker' in window) {
      // config.js의 전역 변수 사용
      window.dataFolderHandle = await window.showDirectoryPicker();
      // config.js의 dataFolderHandle도 업데이트
      if (typeof dataFolderHandle !== 'undefined') {
        dataFolderHandle = window.dataFolderHandle;
      }
      // 폴더 핸들을 localStorage에 저장 (권한 유지)
      localStorage.setItem('dataFolderHandle', JSON.stringify({ selected: true }));
      console.log('데이터 폴더 선택 완료');
      return true;
    } else {
      console.warn('File System Access API를 지원하지 않는 브라우저입니다.');
      return false;
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('폴더 선택 오류:', error);
    }
    return false;
  }
}

// 폴더에 데이터 저장
async function saveDataToFolder() {
  // config.js의 전역 변수 사용
  const folderHandle = window.dataFolderHandle || (typeof dataFolderHandle !== 'undefined' ? dataFolderHandle : null);
  if (!folderHandle) {
    // 폴더가 선택되지 않았으면 localStorage만 사용
    return false;
  }

  try {
    // 거래 데이터 저장
    const transactionsFile = await folderHandle.getFileHandle(DATA_FILE_NAME, { create: true });
    const transactionsWritable = await transactionsFile.createWritable();
    await transactionsWritable.write(JSON.stringify(transactionData, null, 2));
    await transactionsWritable.close();

    // 계좌 데이터 저장
    const accountsFile = await folderHandle.getFileHandle(ACCOUNT_FILE_NAME, { create: true });
    const accountsWritable = await accountsFile.createWritable();
    await accountsWritable.write(JSON.stringify(accountData, null, 2));
    await accountsWritable.close();

    // 사용처 히스토리 저장
    const merchantsFile = await folderHandle.getFileHandle(MERCHANT_FILE_NAME, { create: true });
    const merchantsWritable = await merchantsFile.createWritable();
    await merchantsWritable.write(JSON.stringify(merchantHistory, null, 2));
    await merchantsWritable.close();

    // 카드 데이터 저장
    const cardsFile = await folderHandle.getFileHandle(CARD_FILE_NAME, { create: true });
    const cardsWritable = await cardsFile.createWritable();
    await cardsWritable.write(JSON.stringify(cardData, null, 2));
    await cardsWritable.close();

    // 카드 파싱 템플릿 저장
    const templatesFile = await folderHandle.getFileHandle(CARD_PARSING_TEMPLATES_FILE_NAME, { create: true });
    const templatesWritable = await templatesFile.createWritable();
    await templatesWritable.write(JSON.stringify(cardParsingTemplates, null, 2));
    await templatesWritable.close();

    // 카드 대금 납부 내역 저장
    const paymentsFile = await folderHandle.getFileHandle(ACCOUNT_CARD_PAYMENTS_FILE_NAME, { create: true });
    const paymentsWritable = await paymentsFile.createWritable();
    await paymentsWritable.write(JSON.stringify(accountCardPayments, null, 2));
    await paymentsWritable.close();

    console.log('파일 저장 완료');
    return true;
  } catch (error) {
    console.error('파일 저장 오류:', error);
    return false;
  }
}

// 폴더에서 데이터 로드
async function loadDataFromFolder() {
  // config.js의 전역 변수 사용
  const folderHandle = window.dataFolderHandle || (typeof dataFolderHandle !== 'undefined' ? dataFolderHandle : null);
  if (!folderHandle) {
    return false;
  }

  let loadedAny = false;

  try {
    // 거래 데이터 로드
    try {
      const transactionsFile = await folderHandle.getFileHandle(DATA_FILE_NAME);
      const transactionsContent = await transactionsFile.getFile();
      const transactionsText = await transactionsContent.text();
      transactionData = JSON.parse(transactionsText);
      console.log('파일에서 거래 데이터 로드:', transactionData.length);
      loadedAny = true;
    } catch (error) {
      console.warn('거래 데이터 파일이 없습니다.');
    }

    // 계좌 데이터 로드
    try {
      const accountsFile = await folderHandle.getFileHandle(ACCOUNT_FILE_NAME);
      const accountsContent = await accountsFile.getFile();
      const accountsText = await accountsContent.text();
      accountData = JSON.parse(accountsText);
      console.log('파일에서 계좌 데이터 로드:', accountData.length);
      loadedAny = true;
    } catch (error) {
      console.warn('계좌 데이터 파일이 없습니다.');
    }

    // 사용처 히스토리 로드
    try {
      const merchantsFile = await folderHandle.getFileHandle(MERCHANT_FILE_NAME);
      const merchantsContent = await merchantsFile.getFile();
      const merchantsText = await merchantsContent.text();
      merchantHistory = JSON.parse(merchantsText);
      console.log('파일에서 사용처 히스토리 로드:', merchantHistory.length);
      loadedAny = true;
    } catch (error) {
      console.warn('사용처 히스토리 파일이 없습니다.');
    }

    // 카드 데이터 로드
    try {
      const cardsFile = await folderHandle.getFileHandle(CARD_FILE_NAME);
      const cardsContent = await cardsFile.getFile();
      const cardsText = await cardsContent.text();
      cardData = JSON.parse(cardsText);
      console.log('파일에서 카드 데이터 로드:', cardData.length);
      loadedAny = true;
    } catch (error) {
      console.warn('카드 데이터 파일이 없습니다.');
    }

    // 카드 파싱 템플릿 로드
    try {
      const templatesFile = await folderHandle.getFileHandle(CARD_PARSING_TEMPLATES_FILE_NAME);
      const templatesContent = await templatesFile.getFile();
      const templatesText = await templatesContent.text();
      cardParsingTemplates = JSON.parse(templatesText);
      console.log('파일에서 카드 파싱 템플릿 로드 완료');
      loadedAny = true;
    } catch (error) {
      console.warn('카드 파싱 템플릿 파일이 없습니다.');
    }

    // 카드 대금 납부 내역 로드
    try {
      const paymentsFile = await folderHandle.getFileHandle(ACCOUNT_CARD_PAYMENTS_FILE_NAME);
      const paymentsContent = await paymentsFile.getFile();
      const paymentsText = await paymentsContent.text();
      accountCardPayments = JSON.parse(paymentsText);
      console.log('파일에서 카드 대금 납부 내역 로드 완료:', accountCardPayments.length);
      loadedAny = true;
    } catch (error) {
      console.warn('카드 대금 납부 내역 파일이 없습니다.');
    }

    return loadedAny;
  } catch (error) {
    console.error('파일 로드 오류:', error);
    return false;
  }
}

// 폴더 핸들 복원 (페이지 새로고침 후)
// 주의: File System Access API는 보안상 페이지 새로고침 후 권한이 유지되지 않습니다.
// 따라서 사용자가 다시 폴더를 선택해야 합니다.
async function restoreFolderHandle() {
  try {
    const saved = localStorage.getItem('dataFolderHandle');
    if (saved && JSON.parse(saved).selected) {
      // 폴더가 이전에 선택되었음을 알림 (실제 핸들은 복원 불가)
      console.log('폴더가 이전에 선택되었습니다. 사용자에게 다시 선택을 요청해야 합니다.');
      return { wasSelected: true, handle: null };
    }
  } catch (error) {
    console.error('폴더 핸들 복원 오류:', error);
  }
  return { wasSelected: false, handle: null };
}

// 폴더 지정 여부 확인
function checkFolderSelected() {
  try {
    const saved = localStorage.getItem('dataFolderHandle');
    if (saved) {
      const data = JSON.parse(saved);
      return data.selected === true;
    }
  } catch (error) {
    console.error('폴더 지정 여부 확인 오류:', error);
  }
  return false;
}

// 전역 함수로 내보내기
if (typeof window !== 'undefined') {
  window.selectDataFolder = selectDataFolder;
  window.saveDataToFolder = saveDataToFolder;
  window.loadDataFromFolder = loadDataFromFolder;
  window.restoreFolderHandle = restoreFolderHandle;
  window.checkFolderSelected = checkFolderSelected;
}

console.log('data-manager.js 로드 완료');

// ========================================
// 설정 관리 (Configuration Management) - Vibe Coding Phase 1-1
// ========================================
const CONFIG_KEY = 'ddpw_config';

const DataManager = {
  // 1. 설정 저장
  saveConfig: function (config) {
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
      return true;
    } catch (e) {
      console.error('설정 저장 실패:', e);
      return false;
    }
  },

  // 2. 설정 불러오기 (없으면 초기값 생성)
  loadConfig: function () {
    try {
      const saved = localStorage.getItem(CONFIG_KEY);
      if (saved) {
        return JSON.parse(saved);
      } else {
        // config.js의 전역 변수를 초기값으로 사용
        const initialConfig = {
          paymentMethods: window.PAYMENT_METHODS || {},
          accountDetails: window.ACCOUNT_DETAILS || [],
          incomeCategories: window.INCOME_CATEGORIES || {},
          expenseCategories: window.EXPENSE_CATEGORIES || {}
        };
        this.saveConfig(initialConfig);
        return initialConfig;
      }
    } catch (e) {
      console.error('설정 로드 실패:', e);
      return null;
    }
  },

  // 3. 결제수단 추가
  addPaymentMethod: function (category, name) {
    const config = this.loadConfig();
    if (!config || !config.paymentMethods) return false;

    // category가 없으면 생성 (안전장치)
    if (!config.paymentMethods[category]) config.paymentMethods[category] = [];

    if (config.paymentMethods[category].includes(name)) {
      alert('이미 존재하는 결제수단입니다.');
      return false;
    }

    config.paymentMethods[category].push(name);
    return this.saveConfig(config);
  },

  // 4. 결제수단 삭제
  removePaymentMethod: function (category, name) {
    const config = this.loadConfig();
    if (!config || !config.paymentMethods || !config.paymentMethods[category]) return false;

    const index = config.paymentMethods[category].indexOf(name);
    if (index > -1) {
      config.paymentMethods[category].splice(index, 1);
      return this.saveConfig(config);
    }
    return false;
  },

  // 5. 계좌 추가
  addAccount: function (accountData) {
    const config = this.loadConfig();
    if (!config) return false;
    if (!config.accountDetails) config.accountDetails = [];

    // 자동 순번 생성 (기존 최대값 + 1)
    const maxNo = config.accountDetails.reduce((max, acc) => Math.max(max, acc.no || 0), 0);
    accountData.no = maxNo + 1;

    config.accountDetails.push(accountData);
    return this.saveConfig(config);
  },

  // 6. 계좌 삭제
  removeAccount: function (accountNo) {
    const config = this.loadConfig();
    if (!config || !config.accountDetails) return false;

    const index = config.accountDetails.findIndex(acc => acc.no === accountNo);
    if (index > -1) {
      config.accountDetails.splice(index, 1);
      return this.saveConfig(config);
    }
    return false;
  },

  // 7. 계좌 수정
  updateAccount: function (accountNo, updates) {
    const config = this.loadConfig();
    if (!config || !config.accountDetails) return false;

    const index = config.accountDetails.findIndex(acc => acc.no === accountNo);
    if (index > -1) {
      config.accountDetails[index] = { ...config.accountDetails[index], ...updates };
      return this.saveConfig(config);
    }
    return false;
  },

  // 8. 카테고리 추가
  addCategory: function (type, mainCategory, subCategory) {
    const config = this.loadConfig();
    if (!config) return false;

    const targetCategories = type === 'income' ? config.incomeCategories : config.expenseCategories;
    if (!targetCategories) return false;

    // 대분류가 없으면 배열 생성
    if (!targetCategories[mainCategory]) {
      targetCategories[mainCategory] = [];
    }

    if (targetCategories[mainCategory].includes(subCategory)) {
      alert('이미 존재하는 카테고리입니다.');
      return false;
    }

    targetCategories[mainCategory].push(subCategory);
    return this.saveConfig(config);
  },

  // 9. 카테고리 삭제
  removeCategory: function (type, mainCategory, subCategory) {
    const config = this.loadConfig();
    if (!config) return false;

    const targetCategories = type === 'income' ? config.incomeCategories : config.expenseCategories;
    if (!targetCategories || !targetCategories[mainCategory]) return false;

    const index = targetCategories[mainCategory].indexOf(subCategory);
    if (index > -1) {
      targetCategories[mainCategory].splice(index, 1);
      return this.saveConfig(config);
    }
    return false;
  },

  // --- 거래 내역 관리 ---

  // 10. 스토리지 키 생성
  getStorageKey: function (dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `ddpw_transactions_${year}_${month}`;
  },

  // 11. 거래 목록 가져오기 (특정 연월 + 고정 거래 포함)
  getTransactions: function (year, month) {
    const mm = String(month).padStart(2, '0');
    const key = `ddpw_transactions_${year}_${mm}`;
    try {
      const storageData = localStorage.getItem(key);
      let transactions = storageData ? JSON.parse(storageData) : [];

      // 고정 거래 마스터 가져와서 해당 월에 해당하는 것들 추가
      const fixedMasters = this.getFixedMasters();
      const currentMonthStr = `${year}-${mm}`;

      console.log(`${year}-${mm} 고정 마스터 조회:`, fixedMasters.length, '건');

      fixedMasters.forEach(master => {
        // 이미 해당 월에 이 마스터로부터 생성된 거래가 있는지 확인 (중복 방지)
        const exists = transactions.some(tx => tx.masterId === master.id);

        // 기간 확인 (YYYY-MM 비교)
        const start = master.fixedStart || '0000-00';
        const end = master.fixedEnd || '9999-12';
        const isInRange = start <= currentMonthStr && end >= currentMonthStr;

        if (isInRange && !exists) {
          // 인스턴스 생성 (해당 월의 지정된 일자로)
          let day = 1;
          const maxDay = new Date(year, month, 0).getDate();
          if (master.fixedDay === 'last') {
            day = maxDay;
          } else {
            day = Math.min(parseInt(master.fixedDay) || 1, maxDay);
          }

          const instance = {
            ...master,
            masterId: master.id,
            id: `fixed-${master.id}-${year}-${mm}`, // 합성 ID (문자열)
            date: `${year}-${mm}-${String(day).padStart(2, '0')}`,
            isFixedInstance: true,
            isFixed: true // 테이블 필터링을 위해 명시적 설정
          };
          transactions.push(instance);
          console.log(`고정 거래 생성: ${master.merchant} (${instance.date})`);
        }
      });

      return transactions;
    } catch (e) {
      console.error('거래 로드 실패:', e);
      return [];
    }
  },

  // 11-1. 고정 거래 마스터 목록 가져오기
  getFixedMasters: function () {
    try {
      const data = localStorage.getItem('ddpw_fixed_masters');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('고정 마스터 로드 실패:', e);
      return [];
    }
  },

  // 11-2. 고정 거래 마스터 저장
  saveFixedMasters: function (masters) {
    try {
      localStorage.setItem('ddpw_fixed_masters', JSON.stringify(masters));
      return true;
    } catch (e) {
      console.error('고정 마스터 저장 실패:', e);
      return false;
    }
  },

  // 12. 거래 저장 (특정 연월)
  saveTransactions: function (year, month, transactions) {
    const mm = String(month).padStart(2, '0');
    const key = `ddpw_transactions_${year}_${mm}`;
    try {
      localStorage.setItem(key, JSON.stringify(transactions));
      return true;
    } catch (e) {
      console.error('거래 저장 실패:', e);
      return false;
    }
  },

  // 13. 거래 추가
  addTransaction: function (transaction) {
    // 고정 거래인 경우 마스터에 저장
    if (transaction.isFixed) {
      const masters = this.getFixedMasters();
      transaction.id = transaction.id || Date.now();
      transaction.createdAt = new Date().toISOString();
      masters.push(transaction);
      return this.saveFixedMasters(masters);
    }

    const date = new Date(transaction.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const transactions = this.getTransactions(year, month);
    transaction.id = transaction.id || Date.now();
    transaction.createdAt = new Date().toISOString();
    transactions.push(transaction);

    return this.saveTransactions(year, month, transactions);
  },

  // 14. 거래 수정
  updateTransaction: function (id, updates) {
    // 1. 고정 마스터에서 찾기
    const masters = this.getFixedMasters();
    const mIndex = masters.findIndex(m => m.id === id);
    if (mIndex > -1) {
      masters[mIndex] = { ...masters[mIndex], ...updates, updatedAt: new Date().toISOString() };
      return this.saveFixedMasters(masters);
    }

    // 2. 일반 거래에서 찾기
    const date = new Date(updates.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const transactions = this.getTransactions(year, month);
    const index = transactions.findIndex(tx => tx.id.toString() === id.toString());

    if (index > -1) {
      transactions[index] = { ...transactions[index], ...updates, updatedAt: new Date().toISOString() };
      return this.saveTransactions(year, month, transactions);
    }
    return false;
  },

  // 사용처 히스토리 가져오기
  getMerchantHistory: function () {
    try {
      const saved = localStorage.getItem('merchantHistory');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('사용처 히스토리 로드 실패:', e);
      return [];
    }
  },

  // 15. 거래 삭제
  deleteTransaction: function (id, year, month) {
    // 1. 고정 마스터에서 삭제 시도
    const masters = this.getFixedMasters();
    const mIndex = masters.findIndex(m => m.id === id);
    if (mIndex > -1) {
      masters.splice(mIndex, 1);
      return this.saveFixedMasters(masters);
    }

    // 2. 일반 거래에서 삭제
    const transactions = this.getTransactions(year, month);
    const index = transactions.findIndex(tx => tx.id.toString() === id.toString());

    if (index > -1) {
      transactions.splice(index, 1);
      return this.saveTransactions(year, month, transactions);
    }

    // 3. 합성 ID인 경우 (고정 거래의 인스턴스) - 마스터를 삭제해야 함
    if (id.toString().startsWith('fixed-')) {
      const parts = id.toString().split('-');
      const masterIdStr = parts[1];
      const masters2 = this.getFixedMasters();
      const mIndex2 = masters2.findIndex(m => m.id.toString() === masterIdStr);

      if (mIndex2 > -1) {
        if (confirm('이 항목은 고정 거래의 일부입니다. 전체 고정 거래를 삭제하시겠습니까?')) {
          masters2.splice(mIndex2, 1);
          return this.saveFixedMasters(masters2);
        }
      }
    }

    return false;
  }
};

// window 객체에 할당 (전역 접근)
if (typeof window !== 'undefined') {
  window.DataManager = DataManager;
}

