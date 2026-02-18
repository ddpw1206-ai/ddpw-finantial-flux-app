# SKILL v2 – DDPW Moneybook Flux (MVP 개발용)

## 1. 프로젝트 컨텍스트

- 프로젝트명: DDPW Moneybook Flux v2
- 목적: 기존 엑셀 가계부(연도별 파일, 월별 시트)를 대체하는 **부부 공동 가계부 웹앱**을 만든다.
- 주요 특징:
  - 완전 프론트엔드 앱 (HTML + Vanilla JS + CSS + Bootstrap 5)
  - 데이터는 모두 localStorage에 저장 (ddpw_* 네이밍)
  - 사용자: 공용, 파우, 둠둠
  - 핵심 기능: 
    - 월별 사용내역 관리(수동 입력 + 엑셀 Import)
    - 계좌관리(계좌별 입출금/잔액)
    - 고정 거래 관리
    - 월별 현황 대시보드(예산, 고정/변동, 결제수단, 계좌)

이 문서는 **“AI를 시니어 JS 개발자처럼 사용하는 개발 지침서”**다.  
비개발자인 사용자가, Antigravity/Claude Code에게 아래 내용을 그대로 주면서 개발을 진행한다.


## 2. 기술/구조 제약

1. 프론트엔드만 사용
   - 프레임워크 금지 (React, Vue 등 X)
   - HTML + Vanilla JS + CSS + Bootstrap 5

2. 저장소
   - localStorage에 JSON 구조로 저장
   - 주요 키:
     - ddpw_config
     - ddpw_transactions_YYYY_MM
     - ddpw_fixed_transactions
     - ddpw_account_transactions_YYYY_MM (또는 동등 구조)
     - ddpw_budgets_YYYY / ddpw_budgets_YYYY_MM
     - ddpw_monthly_summary_YYYY_MM

3. 파일 구조(목표)
   - index.html
   - css/
     - common.css
     - dashboard.css
     - modal.css
   - js/
     - config.js
     - data-manager.js
     - settings.js
     - transaction-modal.js
     - transaction-table.js
     - fixed-transaction.js
     - monthly-summary.js
     - accounts.js (계좌관리용)
     - excel-import.js (엑셀 Import 관련)
   - modals/
     - settings-modal.html
     - transaction-modal.html
     - fixed-transaction-modal.html
     - account-modal.html (필요 시)

4. 공통 규칙
   - DOMContentLoaded 이벤트 리스너는 최대 1개로 관리하고, 그 안에서 초기화 함수들을 호출한다.
   - 각 js 파일은 “한 역할”만 담당하도록 한다 (데이터, UI, 핸들러 분리 지향).
   - 데이터 스키마/네이밍은 PRD v2의 계약을 절대로 깨지 않는다.


## 3. 데이터 계약(Contracts) – 요약

AI가 지켜야 할 “약속”들이다. 구현 시 상세 스키마는 PRD v2를 참고하되, 여기선 핵심만 요약한다.

1) 공통 필드 규칙
- 날짜: YYYY-MM-DD 문자열
- 월: YYYY-MM 문자열
- 금액: number, 양수, 원 단위
- 타입:
  - user: "공용" | "파우" | "둠둠"
  - type: "income" | "expense"
  - paymentMethod: "credit" | "debit" | "transfer" | "cash" | "other" 등

2) 거래 데이터 – ddpw_transactions_YYYY_MM
- 필수 필드:
  - id: string (고유 ID, 예: tx_20250215_001)
  - date: string (YYYY-MM-DD)
  - user: string
  - type: "income" | "expense"
  - mainCategory: string
  - subCategory: string (또는 depth3까지 표현 가능)
  - merchant: string | null
  - detail: string | null
  - amount: number (양수)
  - paymentMethod: string
  - paymentDetail: string (실제 카드/계좌명)
  - isFixed: boolean
  - fixedMasterId: string | null
  - createdAt: string (ISO)
  - updatedAt: string (ISO)

3) 고정 거래 – ddpw_fixed_transactions
- FIXED_TRANSACTION_SCHEMA:
  - id, user, type, amount,
    mainCategory, subCategory,
    paymentMethod, paymentDetail,
    merchant, detail,
    fixedDay(1~31 또는 "last"),
    fixedStart(YYYY-MM),
    fixedEnd(YYYY-MM 또는 "infinite"),
    createdAt, updatedAt

4) 계좌 – ACCOUNT_DETAILS (ddpw_config 내부)
- 계좌 목록 항목:
  - accountNo: string
  - name: string
  - bank: string
  - note: string (용도)
  - initialBalance?: number
  - active: boolean

5) 계좌 입출금 – ddpw_account_transactions_YYYY_MM (또는 동등 구조)
- 기본 필드:
  - id, date, accountNo, type(입금/출금/이체/카드대금), 
    amount, counterpart(상대 계좌/카드사/현금 등), memo, createdAt, updatedAt

6) 예산 – ddpw_budgets_YYYY 또는 ddpw_budgets_YYYY_MM
- 카테고리별 예산:
  - key: 카테고리 코드/ID
  - value: 예산 금액(number)

7) 월별 요약 – ddpw_monthly_summary_YYYY_MM
- 수입/지출 합계, 고정/변동 구분, 잔액, 예산 달성률, 결제수단/계좌 요약 등을 포함
- 계산식:
  - 당월말 잔액 = 전월말 잔액 + 당월 총수입 – 당월 총지출


## 4. 구현 단계(Phase) 로드맵

### Phase 1 – 설정/데이터 레이어

**목표:** config.js + data-manager.js + settings UI로 “항목관리 + 기본 데이터 저장/로드”를 안정화.

1) config.js
- 초기 설정 데이터 정의:
  - 사용자 목록 (공용/파우/둠둠)
  - PAYMENT_METHODS (신용/체크/계좌/기타)
  - ACCOUNT_DETAILS (초기 계좌 목록)
  - INCOME_CATEGORIES, EXPENSE_CATEGORIES (1~3 Depth)
- window.CONFIG 또는 개별 window 상수로 바인딩

2) data-manager.js
- localStorage 접근 레이어
- 함수 예:
  - loadConfig(), saveConfig()
  - loadTransactions(year, month), saveTransactions(year, month)
  - loadFixedTransactions(), saveFixedTransactions()
  - loadAccountTransactions(year, month), saveAccountTransactions(year, month)
  - loadBudgets(year, month), saveBudgets(year, month)
  - loadMonthlySummary(year, month), saveMonthlySummary(year, month)
- 모든 함수는 예외 처리(try/catch) 포함, 실패 시 기본값 반환

3) settings-modal.html + settings.js
- 항목관리 UI:
  - 결제수단, 계좌, 카테고리 CRUD
- data-manager를 사용해 데이터를 불러오고/저장
- index.html에 “항목관리” 버튼 + 모달 로딩/초기화 연결


### Phase 2 – 사용내역(거래) 입력/조회

**목표:** 월별 거래 입력/수정/삭제/필터 + 엑셀 Import v1.

1) transaction-modal.html + transaction-modal.js
- 거래 입력 모달:
  - 필수 필드 검증
  - isFixed 플래그는 일단 false 기본값, 고정 거래와는 분리
- 저장 시:
  - ddpw_transactions_YYYY_MM에 push
  - createdAt/updatedAt 자동 설정

2) transaction-table.js
- 현재 선택된 연/월에 대한 거래 목록을 테이블로 렌더링
- 기능:
  - 필터(사용자, 구분, 카테고리, 결제수단, 기간, 금액, 텍스트)
  - 정렬(날짜, 금액)
  - 개별 삭제, 체크박스 기반 일괄 삭제
- data-manager를 통해 데이터를 읽고/저장

3) excel-import.js (MVP: 카드/은행 명세서 타입 1)
- 엑셀/CSV 파일 선택 → 파싱 → 임시 목록 표시 → 확정 시 거래로 저장
- 중복 감지 로직 포함:
  - 기준: 날짜, 금액, paymentMethod, paymentDetail, merchant
  - 중복 후보가 있으면 사용자에게 다이얼로그로 알림 + 선택 옵션 제공


### Phase 3 – 고정 거래 + 계좌관리 + 대시보드 1차

**목표:** 고정 거래/계좌 흐름/월별 현황을 “엑셀 수준”으로 맞춘다.

1) fixed-transaction-modal.html + fixed-transaction.js
- FIXED_TRANSACTION CRUD UI
- 저장 시 ddpw_fixed_transactions에 반영
- 월 전환/앱 로딩 시:
  - fixedStart~fixedEnd 범위 내 월이면 TRANSACTION 자동 생성
  - isFixed, fixedMasterId 세팅

2) accounts.js (+ account-modal.html)
- 계좌 목록 조회/추가/수정/비활성화
- 계좌별 입출금 이력 조회 UI
- 사용내역과의 동기화:
  - transactionData에서 paymentMethod가 transfer/cash/카드대금인 경우, 계좌 이력에 반영

3) monthly-summary.js
- ddpw_transactions_YYYY_MM과 계좌 이력을 기반으로 ddpw_monthly_summary_YYYY_MM 계산/저장
- index.html의 “월별 현황” 섹션에 요약 정보 렌더:
  - 고정/변동 수입/지출
  - 전월/당월 잔액, 증감
  - 카테고리별 예산 vs 실제, 달성률
  - 결제수단별 사용액, 계좌별 잔액


### Phase 4 – 확장 (연간/AI/RAG 등, 추후)

- 연간/기간 대시보드
- 카드 명세서 다수 포맷 지원
- AI LLM + RAG 기반 소비 패턴 분석 리포트


## 5. Antigravity용 프롬프트 패턴 예시

아래는 Phase 1-1 (config.js 구현) 때 Antigravity에 줄 수 있는 예시 프롬프트다.  
각 Phase마다 “파일 1개 + 역할 + 완료 조건 + 테스트 방법”을 이 패턴으로 써서 보낸다.

---

### 예시: Phase 1-1 – config.js 구현

**프롬프트 예시**

1) 컨텍스트 요약

- 프로젝트명: DDPW Moneybook Flux v2
- 목적: 부부(공용/파우/둠둠) 공동 가계부 웹앱
- 기술: HTML + Vanilla JS + CSS + Bootstrap 5, localStorage 사용
- 데이터 계약: 사용자/결제수단/계좌/카테고리 설정을 config.js에서 초기 상수로 정의하고, 추후 data-manager.js에서 이 값을 localStorage로 옮긴다.

2) 작업 요청

다음 요구사항에 맞게 js/config.js 파일을 생성·수정해줘.

- 해야 할 일:
  1. 사용자 상수 정의
     - USERS = ["공용", "파우", "둠둠"]
  2. 결제수단 상수 PAYMENT_METHODS 정의
     - creditCards, checkCards, accounts, etc 네 개의 배열 그룹을 가진 객체
  3. 계좌 상수 ACCOUNT_DETAILS 정의
     - no, accountNo, name, bank, note, initialBalance?, active 필드를 가진 객체 배열
  4. 카테고리 상수 INCOME_CATEGORIES, EXPENSE_CATEGORIES 정의
     - 1~3 Depth 구조를 표현하는 객체 (대분류: [소분류 리스트] 형태)
  5. window 바인딩
     - window.USERS, window.PAYMENT_METHODS,
       window.ACCOUNT_DETAILS, window.INCOME_CATEGORIES,
       window.EXPENSE_CATEGORIES 에 각각 바인딩

- 제약:
  - 기존 코드가 있다면 최대한 보존하고, 상수 정의 부분만 안전하게 추가한다.
  - 파일 상단에 주석으로 “// DDPW Moneybook Flux – config.js (v2)”를 추가한다.

3) 완료 조건

- config.js를 로드한 상태에서 브라우저 콘솔에서 다음이 정상적으로 출력되어야 한다.
  - console.log(window.USERS)
  - console.log(window.PAYMENT_METHODS)
  - console.log(window.ACCOUNT_DETAILS)
  - console.log(window.INCOME_CATEGORIES)
  - console.log(window.EXPENSE_CATEGORIES)
- 에러 없이 각 상수가 기대하는 구조를 가진다.

---

### 예시: Phase 1-2 – data-manager.js 구현

비슷한 패턴으로:

- 컨텍스트 요약 (localStorage 사용, 키 네이밍 규칙)
- 해야 할 일:
  - STORAGE_KEYS 정의
  - loadConfig/saveConfig 등 CRUD 함수 구현
  - 예외 처리 전략
  - window.DataManager = { ... } 바인딩
- 완료 조건:
  - 브라우저 콘솔에서 DataManager 함수 호출 시 에러 없이 동작
  - localStorage에 예상 키가 생성되는지 확인

---

## 6. Claude Code용 가이드 (요약)

나중에 Claude Code로 리팩토링/확장을 할 때는:

- “지금 코드베이스 + PRD + SKILL”을 같이 주고,
- 요청은 다음 식으로 한다:
  - 특정 기능의 리팩토링 (예: transaction-table.js에서 필터/정렬 로직 분리)
  - 타입/에러 핸들링 개선
  - 코드 중복 제거 및 함수/모듈 분리
  - 연간 대시보드/AI 분석 기능 추가

핵심은:
- **Antigravity = 구현 위주 / 작은 단위**
- **Claude Code = 구조/리팩토링/고급 기능 확장**

이라는 역할 분리를 유지하는 것이다.
