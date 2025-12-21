# 🚀 DDPW Moneybook Flux - 바이브 코딩 대기열

**목적**: Antigravity에 순서대로 복사-붙여넣기할 프롬프트 목록

---

## 📋 **현재 대기 중인 작업 - Phase 3**

### **✅ 완료된 프롬프트**

**Phase 1-1**: config.js 데이터 구조 추가 ✅
**Phase 1-2**: 월별현황 탭 버그 수정 (2025-12-21) ✅
- Bug 1: 저장 로직 정상화 ✅
- Bug 2: 수정/삭제 버튼 활성화 ✅
- Bug 3: 체크박스 및 일괄 삭제 ✅
- Bug 4: 검색 필터 정상화 ✅

---

### **⏳ 대기 중인 프롬프트 (실행 순서대로)**

---

## **1. config.js 데이터 구조 추가**

**예상 소요 시간**: 3분  
**의존성**: 없음  
**완료 조건**:
- [ ] PAYMENT_METHODS 추가
- [ ] ACCOUNT_DETAILS 추가
- [ ] USERS, TRANSACTION_TYPES 추가
- [ ] window 객체 바인딩

### **Antigravity에 복사-붙여넣기:**

js/config.js 파일을 열어서 다음 내용을 추가해줘:

1단계: 파일 맨 위에 주석 추가
// ========================================
// XLSX 기획 기반 데이터 구조 (2025-12-21 추가)
// ========================================

2단계: 결제수단 상수 추가 (기존 카테고리 위에)
// ========== 결제수단 ==========
const PAYMENT_METHODS = {
  creditCards: ["KB탄탄대로(파우)", "KB탄탄대로(둠둠)", "네이버페이탭탭", "KB국민행복카드", "삼성BENEFIT카드"],
  creditInstallment: ["KB탄탄대로(파우)", "KB탄탄대로(둠둠)", "네이버페이탭탭", "KB국민행복카드", "삼성BENEFIT카드"],
  checkCards: ["KB K패스(파우)", "KB K패스(둠둠)", "카카오뱅크(파우)"],
  accounts: ["KB(3652) 파우", "KB(96300) 파우", "KB(93618) 둠둠", "하나일반(28907)", "KB(9898) 파우", "카카오뱅크(6321)", "하나대출(06642)"],
  etc: ["네이버페이_계좌", "SSG페이_계좌", "카카오페이_계좌", "기타(기프티콘, 선물 등)", "현금"]
};

3단계: 계좌 상세 정보 추가
// ========== 계좌 상세 정보 ==========
const ACCOUNT_DETAILS = [
  { no: 1, accountNo: "247-980067-06642", name: "서울시신혼부부임차", bank: "하나은행", note: "(연장)2024-12-30" },
  { no: 2, accountNo: "247-910338-28907", name: "주거래 하나 통장", bank: "KB 국민", note: "파우" },
  { no: 3, accountNo: "9-6300-7451-59", name: "KB 마이홈 통장", bank: "KB 국민", note: "파우" },
  { no: 4, accountNo: "9-3618-9012-51", name: "KB 락스타 통장", bank: "KB 국민", note: "둠둠" },
  { no: 5, accountNo: "365202-01-114805", name: "KB Start 통장", bank: "KB 국민", note: "파우" },
  { no: 6, accountNo: "247910-38-828907", name: "서울시신혼부부임차_메인", bank: "하나은행", note: "-" }
];

4단계: 기타 상수 추가 (파일 끝부분에)
// ========== 사용자 목록 ==========
const USERS = ["공용", "파우", "둠둠"];
// ========== 거래 구분 ==========
const TRANSACTION_TYPES = ["수입", "지출"];

5단계: 기존 카테고리 변수 이름 변경
expenseCategoryItems 를 EXPENSE_CATEGORIES 로 변경
incomeCategoryItems 를 INCOME_CATEGORIES 로 변경
단, window 객체 할당은 기존 이름 유지 (호환성)

6단계: window 객체에 새로운 상수들도 추가
window.PAYMENT_METHODS = PAYMENT_METHODS;
window.ACCOUNT_DETAILS = ACCOUNT_DETAILS;
window.USERS = USERS;
window.TRANSACTION_TYPES = TRANSACTION_TYPES;
window.EXPENSE_CATEGORIES = EXPENSE_CATEGORIES;
window.INCOME_CATEGORIES = INCOME_CATEGORIES;
window.expenseCategoryItems = EXPENSE_CATEGORIES;
window.incomeCategoryItems = INCOME_CATEGORIES;

7단계: 주의사항
- 기존 코드는 최대한 보존
- 기존 전역 변수 및 상수는 그대로 유지
- 새로운 상수는 기존 카테고리 위에 추가
- console.log 메시지 유지

---

## **2. data-manager.js CRUD 함수 구현**

**예상 소요 시간**: 5분  
**의존성**: config.js 완료 필요  
**완료 조건**:
- [ ] 파일 생성 완료
- [ ] 모든 CRUD 함수 구현
- [ ] localStorage 초기화 로직

### **Antigravity에 복사-붙여넣기:**

js/data-manager.js 파일을 생성하고 다음 기능을 구현해줘:

1단계: localStorage 키 상수 정의
const STORAGE_KEYS = {
  PAYMENT_METHODS: 'ddpw_payment_methods',
  ACCOUNTS: 'ddpw_accounts',
  INCOME_CATEGORIES: 'ddpw_income_categories',
  EXPENSE_CATEGORIES: 'ddpw_expense_categories'
};

2단계: initializeData() 함수
- localStorage가 비어있으면 config.js의 window 객체에서 데이터 가져오기
- window.PAYMENT_METHODS, window.ACCOUNT_DETAILS 등 사용
- localStorage에 초기 데이터 저장

3단계: 결제수단 CRUD 함수
- getPaymentMethods(): localStorage에서 결제수단 조회, 파싱 후 반환
- addPaymentMethod(type, value): 해당 type 배열에 value 추가, 중복 체크 포함
- removePaymentMethod(type, value): 해당 type 배열에서 value 제거

4단계: 계좌 CRUD 함수
- getAccounts(): localStorage에서 계좌 목록 조회
- addAccount(account): 계좌 추가, 자동으로 no 생성 (기존 최대값 + 1)
- removeAccount(no): 해당 no의 계좌 삭제
- updateAccount(no, updatedData): 해당 no의 계좌 정보 업데이트

5단계: 수입 카테고리 CRUD
- getIncomeCategories(): 수입 카테고리 조회
- addIncomeSubCategory(mainCategory, subCategory): 대분류 아래 소분류 추가, 중복 체크
- removeIncomeSubCategory(mainCategory, subCategory): 소분류 삭제

6단계: 지출 카테고리 CRUD
- getExpenseCategories(): 지출 카테고리 조회
- addExpenseSubCategory(mainCategory, subCategory): 대분류 아래 소분류 추가, 중복 체크
- removeExpenseSubCategory(mainCategory, subCategory): 소분류 삭제

7단계: 모든 함수를 window 객체에 할당
window.DataManager = { initializeData, getPaymentMethods, addPaymentMethod, ... };
또는 각 함수를 개별적으로 window에 할당

8단계: 에러 처리
- try-catch 블록 사용
- localStorage 읽기/쓰기 실패 시 console.error 출력
- 함수는 성공/실패 boolean 반환

---

## **3. settings-modal.html UI 생성**

**예상 소요 시간**: 5분  
**의존성**: 없음  
**완료 조건**:
- [ ] modals/ 폴더에 파일 생성
- [ ] Bootstrap 모달 구조 완성
- [ ] 3개 탭 정상 표시

### **Antigravity에 복사-붙여넣기:**

modals/settings-modal.html 파일을 생성하고 Bootstrap 5 기반 모달을 작성해줘:

1단계: 모달 기본 구조
- 모달 ID: settingsModal
- 모달 타이틀: "⚙️ 항목관리"
- 모달 크기: modal-xl
- data-bs-backdrop="static" 추가 (외부 클릭으로 닫히지 않게)

2단계: 탭 구조 (Bootstrap nav-tabs)
- 탭 1: "💳 결제수단" (id: payment-tab, 연결: payment-panel)
- 탭 2: "🏦 계좌정보" (id: account-tab, 연결: account-panel)
- 탭 3: "📋 카테고리" (id: category-tab, 연결: category-panel)

3단계: 결제수단 탭 내용 (payment-panel)
Bootstrap row와 col-md-3으로 4열 그리드 구성:
- 열 1: 신용카드
  - label: "신용카드"
  - input id: new-credit-card, placeholder: "카드명 입력"
  - button: "추가" onclick="addPaymentMethod('creditCards')"
  - div id: credit-card-list, class: list-group mt-2
- 열 2: 체크카드
  - label: "체크카드"
  - input id: new-check-card, placeholder: "카드명 입력"
  - button: "추가" onclick="addPaymentMethod('checkCards')"
  - div id: check-card-list, class: list-group mt-2
- 열 3: 계좌
  - label: "계좌"
  - input id: new-account-payment, placeholder: "계좌 입력"
  - button: "추가" onclick="addPaymentMethod('accounts')"
  - div id: account-payment-list, class: list-group mt-2
- 열 4: 기타
  - label: "기타"
  - input id: new-etc-payment, placeholder: "결제수단 입력"
  - button: "추가" onclick="addPaymentMethod('etc')"
  - div id: etc-payment-list, class: list-group mt-2

4단계: 계좌정보 탭 내용 (account-panel)
- button: "➕ 계좌 추가" class: btn btn-primary mb-3, onclick: "openAddAccountForm()"
- table class: table table-striped, id: account-table
  - thead: NO | 계좌번호 | 계좌명 | 은행명 | 비고 | 작업
  - tbody id: account-table-body

5단계: 카테고리 탭 내용 (category-panel)
Bootstrap row와 col-md-6으로 2열 그리드:
- 열 1: 수입 카테고리
  - label: "수입 카테고리"
  - select id: income-main-category, class: form-select mb-2
  - input id: new-income-sub, placeholder: "소분류 입력"
  - button: "추가" onclick="addIncomeSubCategory()"
  - div id: income-category-list, class: mt-3
- 열 2: 지출 카테고리
  - label: "지출 카테고리"
  - select id: expense-main-category, class: form-select mb-2
  - input id: new-expense-sub, placeholder: "소분류 입력"
  - button: "추가" onclick="addExpenseSubCategory()"
  - div id: expense-category-list, class: mt-3

6단계: 모달 푸터
- button: "닫기" class: btn btn-secondary, data-bs-dismiss: modal

7단계: Bootstrap 클래스 일관성 유지
- 모든 input은 form-control
- 모든 button은 btn btn-primary 또는 btn-sm
- 적절한 spacing (mb-2, mt-2, p-3 등)

---

## **4. settings.js 이벤트 핸들러 구현**

**예상 소요 시간**: 10분  
**의존성**: data-manager.js, settings-modal.html  
**완료 조건**:
- [ ] 모든 함수 구현
- [ ] window 객체 바인딩 완료
- [ ] render 함수 동작 확인

### **Antigravity에 복사-붙여넣기:**

js/settings.js 파일을 생성하고 다음 기능을 구현해줘:

1단계: initSettingsModal() 함수
- window.DataManager.initializeData() 호출
- renderPaymentMethods() 호출
- renderAccounts() 호출
- renderCategories() 호출
- window.initSettingsModal에 할당

2단계: renderPaymentMethods() 함수
- window.DataManager.getPaymentMethods() 호출하여 데이터 가져오기
- creditCards 배열을 순회하며 credit-card-list에 렌더링
- checkCards 배열을 순회하며 check-card-list에 렌더링
- accounts 배열을 순회하며 account-payment-list에 렌더링
- etc 배열을 순회하며 etc-payment-list에 렌더링
- 각 항목은 list-group-item으로 표시
- 각 항목마다 삭제 버튼 포함: <button class="btn btn-sm btn-danger float-end" onclick="removePaymentMethodItem('type', 'value')">삭제</button>

3단계: renderAccounts() 함수
- window.DataManager.getAccounts() 호출
- account-table-body에 테이블 행 렌더링
- 각 행: <tr><td>no</td><td>accountNo</td><td>name</td><td>bank</td><td>note</td><td>버튼들</td></tr>
- 버튼들: 수정 버튼, 삭제 버튼
- 수정 버튼: onclick="editAccount(no)"
- 삭제 버튼: onclick="deleteAccount(no)"

4단계: renderCategories() 함수
- window.DataManager.getIncomeCategories() 호출
- window.DataManager.getExpenseCategories() 호출
- income-main-category select에 대분류 option 렌더링
- expense-main-category select에 대분류 option 렌더링
- income-category-list에 대분류별로 소분류 목록 표시
  - 각 대분류를 h6으로 표시
  - 소분류는 badge로 표시, 각 badge에 삭제 버튼
- expense-category-list에 대분류별로 소분류 목록 표시 (동일 방식)

5단계: addPaymentMethod(type) 전역 함수
- 해당 type의 input 값 가져오기 (예: new-credit-card)
- 빈 값 체크, 빈 값이면 alert("값을 입력하세요") 후 return
- window.DataManager.addPaymentMethod(type, value) 호출
- 성공하면 renderPaymentMethods() 호출하여 화면 갱신
- input 값 초기화
- window.addPaymentMethod에 할당

6단계: removePaymentMethodItem(type, value) 전역 함수
- confirm("정말 삭제하시겠습니까?")
- 확인하면 window.DataManager.removePaymentMethod(type, value) 호출
- renderPaymentMethods() 호출하여 화면 갱신
- window.removePaymentMethodItem에 할당

7단계: deleteAccount(no) 전역 함수
- confirm("정말 삭제하시겠습니까?")
- 확인하면 window.DataManager.removeAccount(no) 호출
- renderAccounts() 호출하여 화면 갱신
- window.deleteAccount에 할당

8단계: addIncomeSubCategory() 전역 함수
- income-main-category select 값 가져오기
- new-income-sub input 값 가져오기
- 빈 값 체크
- window.DataManager.addIncomeSubCategory(main, sub) 호출
- renderCategories() 호출하여 화면 갱신
- input 값 초기화
- window.addIncomeSubCategory에 할당

9단계: addExpenseSubCategory() 전역 함수
- expense-main-category select 값 가져오기
- new-expense-sub input 값 가져오기
- 빈 값 체크
- window.DataManager.addExpenseSubCategory(main, sub) 호출
- renderCategories() 호출하여 화면 갱신
- input 값 초기화
- window.addExpenseSubCategory에 할당

10단계: removeIncomeSubCategory(main, sub) 전역 함수
- confirm 다이얼로그
- window.DataManager.removeIncomeSubCategory(main, sub) 호출
- renderCategories() 호출
- window.removeIncomeSubCategory에 할당

11단계: removeExpenseSubCategory(main, sub) 전역 함수
- confirm 다이얼로그
- window.DataManager.removeExpenseSubCategory(main, sub) 호출
- renderCategories() 호출
- window.removeExpenseSubCategory에 할당

---

## **5. modal-loader.js 수정**

**예상 소요 시간**: 1분  
**의존성**: settings-modal.html  
**완료 조건**:
- [ ] modalFiles 배열에 추가 완료

### **Antigravity에 복사-붙여넣기:**

js/modal-loader.js 파일을 열어서 modalFiles 배열에 'modals/settings-modal.html'을 추가해줘.

기존 모달들 뒤에 7번째로 추가하고, 주석으로 "// 항목관리 모달" 표시해줘.

---

## **6. index.html 통합**

**예상 소요 시간**: 3분  
**의존성**: 모든 파일 완료  
**완료 조건**:
- [ ] script 태그 추가
- [ ] 항목관리 버튼 추가
- [ ] 브라우저 에러 없음

### **Antigravity에 복사-붙여넣기:**

index.html 파일을 수정해줘:

1단계: script 태그 추가
<body> 끝부분, 다른 script 태그들 근처에 추가:
<script src="js/data-manager.js"></script>
<script src="js/settings.js"></script>

2단계: DOMContentLoaded 이벤트에 초기화 추가
기존 DOMContentLoaded 이벤트 리스너를 찾아서, 그 안에 다음 코드 추가:
if (typeof window.initSettingsModal === 'function') {
  window.initSettingsModal();
}

3단계: 항목관리 버튼 추가
네비게이션 바 또는 상단 버튼 그룹에 항목관리 버튼 추가:
<button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#settingsModal">
  ⚙️ 항목관리
</button>

4단계: 주의사항
- 기존 코드는 최대한 보존
- 충돌 없도록 주의
- 버튼은 다른 버튼들과 같은 스타일 유지

---

## **7. 최종 검증**

**예상 소요 시간**: 5분  
**의존성**: 모든 작업 완료  
**완료 조건**:
- [ ] 7개 테스트 항목 모두 통과

### **Antigravity에 복사-붙여넣기:**

다음 항목들을 테스트하고 결과를 알려줘:

1번: 브라우저 콘솔을 열고 JavaScript 에러가 없는지 확인
2번: 항목관리 버튼을 클릭했을 때 모달이 정상적으로 열리는지
3번: 모달 안에서 3개 탭(결제수단, 계좌정보, 카테고리)이 정상적으로 전환되는지
4번: 결제수단 탭에서 카드명 입력 후 추가 버튼 클릭 시 목록에 추가되는지, 삭제 버튼 클릭 시 삭제되는지
5번: 계좌정보 탭에서 계좌 목록이 테이블로 표시되는지
6번: 카테고리 탭에서 대분류 선택 후 소분류 추가 버튼 클릭 시 추가되는지, 삭제 버튼 클릭 시 삭제되는지
7번: 브라우저 개발자도구의 Application 탭 → Local Storage에서 ddpw로 시작하는 키에 데이터가 정상적으로 저장되는지

각 항목별로 다음 형식으로 결과 알려줘:
1번: ✅ 또는 ❌ (에러 내용)
2번: ✅ 또는 ❌ (에러 내용)
...
7번: ✅ 또는 ❌ (에러 내용)

---

## 🎯 **다음 Phase 준비 - Phase 1-2**

(Phase 1-1 완료 후 여기에 Phase 1-2 프롬프트 추가 예정)

---

**마지막 업데이트**: 2025-12-21 21:54 KST
