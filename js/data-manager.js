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

