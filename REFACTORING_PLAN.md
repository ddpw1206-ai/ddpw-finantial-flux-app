# 3-8단계: 리팩토링 계획 및 실행 가이드

## 3단계: 계좌 관리 저장 경로 분리

### 현재 문제 지점

**위치**: `js/modal.js` 라인 2349-2370

```javascript
const newEntry = {
  // ...
  isCardPayment: true
};
transactionData.push(newEntry);  // ← 문제: transactionData에 저장
saveData();
```

### 분리 계획

#### 옵션 1: 별도 배열 `accountCardPayments` 생성

**1단계**: `data-manager.js` 또는 `index.html`에 배열 초기화
```javascript
let accountCardPayments = JSON.parse(localStorage.getItem('accountCardPayments') || '[]');
```

**2단계**: 저장 함수 추가
```javascript
function saveAccountCardPayments() {
  localStorage.setItem('accountCardPayments', JSON.stringify(accountCardPayments));
  if (typeof saveDataToFile === 'function') {
    // 파일 저장 로직
  }
}
```

**3단계**: `js/modal.js` 수정
```javascript
// 기존
transactionData.push(newEntry);
saveData();

// 변경
accountCardPayments.push(newEntry);
saveAccountCardPayments();
```

**4단계**: `renderAccountTransactionTable()` 수정
```javascript
// accountCardPayments도 함께 조회
const accountData = [...monthData.filter(...), ...accountCardPayments];
```

---

## 4단계: 렌더링 필터 전수 점검

### 현재 필터링 현황

| 함수 | 데이터 소스 | 필터 조건 | expense-table-container 사용 |
|------|------------|----------|----------------------------|
| `renderTable()` | `getCurrentMonthData()` | `!isCardPayment && !(category === '카드대금' && paymentMethod === 'transfer')` | ❌ (HTML에 정의됨) |
| `renderCardTable()` | `getCurrentMonthData()` | `paymentMethod === 'credit'\|'debit' && !isCardPayment && !(category === '카드대금' && paymentMethod === 'transfer')` | ✅ (innerHTML) |
| `renderBankTable()` | `getCurrentMonthData()` | `paymentMethod === 'transfer'\|'cash' && !isCardPayment && !(category === '카드대금' && paymentMethod === 'transfer')` | ✅ (innerHTML) |
| `renderAccountTransactionTable()` | `getCurrentMonthData()` | `isCardPayment === true \|\| (paymentMethod === 'transfer'\|'cash' && paymentMethod !== 'credit'\|'debit')` | ❌ (직접 DOM) |

### 통합 필터 함수 설계

```javascript
// 공통 필터 함수
function filterTransactionsBySource(data, source) {
  return data.filter(entry => {
    switch(source) {
      case 'MONTHLY':
        // 월별 현황용: 계좌 관리 거래 제외
        if (entry.sourceType === 'ACCOUNT') return false;
        if (entry.isCardPayment === true) return false;
        if (entry.category === '카드대금' && entry.paymentMethod === 'transfer') return false;
        return entry.sourceType === 'MONTHLY' || 
               entry.sourceType === 'AUTO_CARD' || 
               !entry.sourceType;
      
      case 'ACCOUNT':
        // 계좌 관리용: 계좌 관리 거래 포함, 월별 현황 transfer/debit 포함
        if (entry.sourceType === 'ACCOUNT') return true;
        if (entry.isCardPayment === true) return true;
        if (entry.sourceType === 'MONTHLY' || !entry.sourceType) {
          return entry.paymentMethod === 'transfer' || entry.paymentMethod === 'cash';
        }
        return false;
      
      default:
        return true;
    }
  });
}
```

---

## 5단계: 자동 입력 로직 점검

### 현재 경로

```
handleExcelAnalyze() → parseCardStatement() → window.parsedExcelData
  ↓
handleExcelImport() → importToTransactions() → transactionData.push()
```

### 수정 사항

**`importToTransactions()` 함수 수정** (`index.html` 라인 7173)

```javascript
function importToTransactions(transactions) {
  // ...
  transactions.forEach(t => {
    const newEntry = {
      // ...
      sourceType: 'AUTO_CARD',  // ✅ 추가
      // ...
    };
    transactionData.push(newEntry);
  });
  // calculateAccountBalances() 호출 안 함 ✅
}
```

---

## 6단계: 중복 체크 로직 재설계

### 중복 판정 기준

```javascript
function checkDuplicateTransaction(newEntry, existingData) {
  const duplicates = existingData.filter(existing => {
    // 기본 기준: 날짜, 금액, 결제수단
    const dateMatch = existing.date === newEntry.date;
    const amountMatch = Math.abs(existing.amount - newEntry.amount) < 1;
    const methodMatch = existing.paymentMethod === newEntry.paymentMethod;
    const detailMatch = existing.paymentDetail === newEntry.paymentDetail;
    
    // 사용처가 같으면 중복 확정에 더 가중치
    const merchantMatch = existing.merchant === newEntry.merchant;
    
    if (dateMatch && amountMatch && methodMatch && detailMatch) {
      return merchantMatch ? '확정' : '후보';
    }
    return false;
  });
  
  return duplicates;
}
```

### UX 플로우

```javascript
function handleDuplicateCheck(newEntry) {
  const duplicates = checkDuplicateTransaction(newEntry, transactionData);
  
  if (duplicates.length > 0) {
    const confirmed = confirm(
      `이미 등록된 거래 내역과 유사한 항목이 ${duplicates.length}개 있습니다.\n\n` +
      `날짜: ${newEntry.date}\n` +
      `금액: ${newEntry.amount.toLocaleString()}원\n` +
      `결제수단: ${newEntry.paymentDetail || newEntry.paymentMethod}\n\n` +
      `그래도 등록하시겠습니까?`
    );
    return confirmed;
  }
  return true;
}
```

### 적용 위치

- **월별 현황 수동 입력**: `index.html` 라인 2492 (신규 입력 모드)
- **월별 현황 자동 입력**: `importToTransactions()` 함수 내부
- **계좌 관리 입출금 등록**: `js/modal.js` 라인 2227 (이미 구현됨)

---

## 7단계: QA 문서와 Rule 파일 연동

### 규칙 준수 체크리스트

| 규칙 항목 | 현재 상태 | 설계안 준수 여부 | 테스트 항목 |
|----------|----------|----------------|------------|
| 계좌 관리 카드 대금이 transactionData에 저장 안 됨 | ❌ (현재 저장됨) | ✅ (별도 배열로 분리) | 계좌 관리에서 등록 후 월별 현황 확인 |
| 자동 입력이 계좌 잔액에 영향 없음 | ✅ | ✅ (sourceType: 'AUTO_CARD') | 자동 입력 후 계좌 잔액 확인 |
| 수동 입력 transfer/debit만 양쪽 반영 | ✅ | ✅ (조건부 calculateAccountBalances) | transfer/debit 입력 후 양쪽 확인 |
| 중복 체크 로직 | ⚠️ (부분 구현) | ✅ (통합 함수) | 중복 데이터 입력 시 경고 확인 |

---

## 8단계: 실제 수정 작업용 세부 프롬프트

### 1단계: 문제 지점 리스트업

**계좌 관리 카드 명세서 등록이 transactionData를 건드리는 지점**

1. `js/modal.js` 라인 2370: `transactionData.push(newEntry)`
2. `js/modal.js` 라인 2372: `saveData()` 호출
3. (기타 지점 없음)

### 2단계: 첫 번째 지점 수정

**수정 전**:
```javascript
transactionData.push(newEntry);
saveData();
```

**수정 후**:
```javascript
// accountCardPayments 배열에 저장 (transactionData 아님)
if (typeof accountCardPayments === 'undefined') {
  accountCardPayments = JSON.parse(localStorage.getItem('accountCardPayments') || '[]');
}
accountCardPayments.push(newEntry);
saveAccountCardPayments();
```

**동작 차이**:
- 수정 전: `transactionData`에 저장 → 월별 현황에 표시됨
- 수정 후: `accountCardPayments`에 저장 → 월별 현황에 표시 안 됨

**테스트 시나리오**:
1. 계좌 관리 > 입출금 내역 등록 > 카드 명세서 등록
2. 카드 대금 등록 완료
3. 월별 현황 > 전체 소비 탭 확인 → 카드 대금 항목이 없어야 함
4. 계좌 관리 > 계좌별 입출금 내역 확인 → 카드 대금 항목이 있어야 함
5. 계좌 잔액 확인 → 청구 총액만큼 줄어들어야 함

