# Phase 1 완료 보고서

## ✅ 완료된 작업

### Step 1-1: accountCardPayments 배열 초기화
**파일**: `js/config.js`
- `accountCardPayments` 배열 추가
- `ACCOUNT_CARD_PAYMENTS_FILE_NAME` 상수 추가

### Step 1-2: 저장/불러오기 함수 추가
**파일**: `js/data-manager.js`
- `saveAccountCardPayments()` 함수 추가
- `loadAccountCardPayments()` 함수 추가
- `saveDataToFolder()`에 accountCardPayments 저장 로직 추가
- `loadDataFromFolder()`에 accountCardPayments 로드 로직 추가

**파일**: `js/app.js`
- 초기 로드 시 `loadAccountCardPayments()` 호출 추가

### Step 1-3: js/modal.js 수정
**파일**: `js/modal.js` 라인 2349-2374
- `transactionData.push(newEntry)` → `accountCardPayments.push(newEntry)` 변경
- `saveData()` → `saveAccountCardPayments()` 변경
- `isCardPayment` 플래그 제거 (더 이상 필요 없음)

### Step 1-4: renderAccountTransactionTable() 수정
**파일**: `index.html` 라인 2953
- `accountCardPayments`도 현재 월로 필터링하여 합치기
- 레거시 호환: `isCardPayment === true` 항목도 계속 표시

### Step 1-5: calculateAccountBalances() 수정
**파일**: `index.html` 라인 2601
- `accountCardPayments`도 계좌 잔액 계산에 포함

---

## 🎯 결과

### 변경 전
- 계좌 관리 카드 대금 → `transactionData`에 저장
- 월별 현황에 표시됨 (필터링으로 제외 시도했지만 불완전)

### 변경 후
- 계좌 관리 카드 대금 → `accountCardPayments`에 저장
- 월별 현황에 **절대 표시되지 않음**
- 계좌 관리 목록에만 표시됨
- 계좌 잔액 계산에 정상 반영됨

---

## 🧪 테스트 체크리스트

### 시나리오 1: 계좌 관리 카드 대금 등록
1. [ ] 계좌 관리 > 입출금 내역 등록 > 카드 명세서 등록
2. [ ] 카드 대금 등록 완료
3. [ ] 월별 현황 > 전체 소비 탭 확인 → 카드 대금 항목이 **없어야 함**
4. [ ] 계좌 관리 > 계좌별 입출금 내역 확인 → 카드 대금 항목이 **있어야 함**
5. [ ] 계좌 잔액 확인 → 청구 총액만큼 **줄어들어야 함**

### 시나리오 2: 월별 현황 수동 입력
1. [ ] 월별 현황 > 신규 등록 > 수동 입력
2. [ ] 계좌이체(transfer)로 거래 등록
3. [ ] 월별 현황에 표시되는지 확인
4. [ ] 계좌 관리에도 표시되는지 확인
5. [ ] 계좌 잔액이 반영되는지 확인

### 시나리오 3: 월별 현황 자동 입력
1. [ ] 월별 현황 > 신규 등록 > 자동 입력
2. [ ] 카드 명세서 업로드 및 등록
3. [ ] 월별 현황에 개별 지출 내역이 표시되는지 확인
4. [ ] 계좌 잔액이 **변하지 않는지** 확인

---

## 📝 다음 단계 (Phase 2)

1. 필터링 로직 통합
2. 공통 필터 함수 생성
3. `expense-table-container` 사용 방식 통일

---

## ⚠️ 주의사항

- 레거시 데이터 호환: 기존 `isCardPayment: true` 항목은 계속 표시됨
- 마이그레이션 필요: 기존 `transactionData`의 카드 대금 항목을 `accountCardPayments`로 이동하는 스크립트 필요 (선택적)

