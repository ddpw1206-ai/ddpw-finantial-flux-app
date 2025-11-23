// ========================================
// localStorage 저장
// ========================================
function saveData() {
  try {
    if (dataFolderHandle) {
      // 폴더 저장 로직은 추후 구현
      saveDataToFolder();
    } else {
      localStorage.setItem('budgetData', JSON.stringify(transactionData));
      console.log('거래 데이터 저장:', transactionData.length);
    }
  } catch (error) {
    console.error('데이터 저장 오류:', error);
  }
}

function saveAccountData() {
  try {
    if (dataFolderHandle) {
      saveDataToFolder();
    } else {
      localStorage.setItem('accountData', JSON.stringify(accountData));
      console.log('계좌 데이터 저장:', accountData.length);
    }
  } catch (error) {
    console.error('계좌 데이터 저장 오류:', error);
  }
}

function saveMerchantHistory() {
  try {
    if (dataFolderHandle) {
      saveDataToFolder();
    } else {
      localStorage.setItem('merchantHistory', JSON.stringify(merchantHistory));
      console.log('사용처 히스토리 저장:', merchantHistory.length);
    }
  } catch (error) {
    console.error('사용처 저장 오류:', error);
  }
}

function saveCardData() {
  try {
    if (dataFolderHandle) {
      saveDataToFolder();
    } else {
      localStorage.setItem('cardData', JSON.stringify(cardData));
      console.log('카드 데이터 저장:', cardData.length);
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

// 폴더 저장 함수 (추후 구현)
function saveDataToFolder() {
  // File System Access API 사용
  console.log('폴더 저장 기능은 추후 구현');
}

// 폴더 로드 함수 (추후 구현)
function loadDataFromFolder() {
  // File System Access API 사용
  console.log('폴더 로드 기능은 추후 구현');
  return false;
}

// 폴더 핸들 복원 함수 (추후 구현)
function restoreFolderHandle() {
  // File System Access API 사용
  console.log('폴더 핸들 복원 기능은 추후 구현');
  return false;
}

console.log('data-manager.js 로드 완료');

