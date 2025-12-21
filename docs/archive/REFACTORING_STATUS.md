# index.html 리팩토링 진행 상황

**작업 시작일**: 2026년  
**목표**: index.html을 1,000줄 이하로 축소  
**현재 상태**: 7,847줄 (목표까지 약 6,847줄 감소 필요)

---

## ✅ 완료된 작업

### Phase 1: 모달 HTML 분리 (완료)
- ✅ `modals/monthly-entry-modal.html` 생성
- ✅ `modals/account-transaction-modal.html` 생성
- ✅ `modals/account-modal.html` 생성
- ✅ `modals/merchant-modal.html` 생성
- ✅ `modals/card-manage-modal.html` 생성
- ✅ `modals/card-payment-modal.html` 생성
- ✅ `index.html`에 `<div id="modals-container"></div>` 추가

### Phase 4: 모달 로더 구현 (완료)
- ✅ `js/modal-loader.js` 생성
- ✅ `index.html`에 `<script src="js/modal-loader.js"></script>` 추가

---

## 🚧 진행 중인 작업

### 주석 처리된 HTML 제거 (미완료)
**현재 상태**: `index.html`의 `<script>` 태그 안에 주석 처리된 모달 HTML이 남아있음

**위치**: 약 1167-1733 라인 (정확한 범위 확인 필요)

**문제점**:
- 주석 처리된 HTML이 `<script>` 태그 안에 있어서 JavaScript 파서 오류 가능성
- 약 600줄 정도의 불필요한 코드

**다음 단계**:
1. `index.html` 1167 라인부터 시작하는 주석 처리된 HTML 찾기
2. 주석 종료 지점(`-->`) 찾기 (약 1733 라인 근처)
3. 해당 범위 전체 제거

---

## 📋 남은 작업 (우선순위 순)

### Phase 2: 인라인 스타일 분리 (예상 감소: ~800줄)
**목표**: `css/inline-styles.css` 생성 및 인라인 `<style>` 태그 내용 이동

**작업 내용**:
1. `index.html`의 인라인 `<style>` 태그 내용 확인 (약 120-965 라인)
2. `css/inline-styles.css` 파일 생성
3. 인라인 스타일 내용을 새 파일로 이동
4. `index.html`에 `<link rel="stylesheet" href="css/inline-styles.css">` 추가
5. `index.html`에서 인라인 `<style>` 태그 제거

---

### Phase 3: 인라인 스크립트 분리 (예상 감소: ~4,500줄)

#### 3.1. 전역 함수 분리
**파일**: `js/global-handlers.js`
- `window.handleAccountTransactionFileChange` (라인 12-112)
- 기타 전역 함수들

#### 3.2. DOMContentLoaded 내부 로직 분리
**파일들**:
- `js/monthly-entry-handlers.js` (월별 현황 관련)
- `js/merchant-handlers.js` (사용처 관리)
- `js/excel-import-handlers.js` (엑셀 자동 입력)
- `js/account-transaction-handlers.js` (계좌 입출금)
- `js/account-handlers.js` (계좌 관리)
- `js/card-handlers.js` (카드 관리)
- `js/event-delegation.js` (이벤트 위임)
- `js/render-functions.js` (렌더링 함수)

**작업 순서**:
1. 각 기능별로 함수 그룹 식별
2. 해당 함수들을 외부 JS 파일로 이동
3. `index.html`에 `<script src="js/파일명.js"></script>` 추가
4. `index.html`에서 이동한 코드 제거

---

### Phase 5: 최종 검증
**작업 내용**:
1. `index.html` 라인 수 확인 (목표: 1,000줄 이하)
2. 모든 모달이 정상 작동하는지 테스트
3. 모든 기능이 정상 작동하는지 테스트
4. 브라우저 콘솔 에러 확인 (0개 목표)
5. Linter 에러 확인 (0개 목표)
6. 파일 로드 순서 확인
7. 모달 동적 로드 정상 작동 확인

---

## 🔍 다음 세션 시작 시 체크리스트

1. **주석 처리된 HTML 제거 완료**
   - [ ] `index.html` 1167 라인부터 주석 처리된 HTML 확인
   - [ ] 주석 종료 지점(`-->`) 찾기
   - [ ] 해당 범위 전체 제거
   - [ ] 브라우저 콘솔 에러 확인

2. **Phase 2 시작 전 확인**
   - [ ] `index.html` 현재 라인 수 확인
   - [ ] 인라인 `<style>` 태그 위치 확인 (약 120-965 라인)
   - [ ] `css/` 디렉토리 존재 확인

3. **Phase 3 시작 전 확인**
   - [ ] `index.html`의 `<script>` 태그 내부 구조 파악
   - [ ] DOMContentLoaded 이벤트 리스너 위치 확인
   - [ ] 함수별 그룹핑 계획 수립

---

## 📝 참고 사항

- **파일 구조** (리팩토링 후 예상):
  ```
  프로젝트/
  ├── index.html (1,000줄 이하 목표)
  ├── modals/
  │   ├── monthly-entry-modal.html ✅
  │   ├── account-transaction-modal.html ✅
  │   ├── account-modal.html ✅
  │   ├── merchant-modal.html ✅
  │   ├── card-manage-modal.html ✅
  │   └── card-payment-modal.html ✅
  ├── css/
  │   ├── common.css
  │   ├── dashboard.css
  │   ├── modal.css
  │   └── inline-styles.css (생성 예정)
  ├── js/
  │   ├── config.js
  │   ├── utils.js
  │   ├── data-manager.js
  │   ├── excel-parser.js
  │   ├── dashboard.js
  │   ├── accounts.js
  │   ├── cards.js
  │   ├── saving.js
  │   ├── settings.js
  │   ├── stats.js
  │   ├── modal.js
  │   ├── app.js
  │   ├── modal-loader.js ✅
  │   ├── global-handlers.js (생성 예정)
  │   ├── monthly-entry-handlers.js (생성 예정)
  │   ├── merchant-handlers.js (생성 예정)
  │   ├── excel-import-handlers.js (생성 예정)
  │   ├── account-transaction-handlers.js (생성 예정)
  │   ├── account-handlers.js (생성 예정)
  │   ├── card-handlers.js (생성 예정)
  │   ├── event-delegation.js (생성 예정)
  │   └── render-functions.js (생성 예정)
  ```

- **주의사항**:
  - 모든 기능이 정상 동작해야 함 (동작 변화 없음)
  - 외부 파일 로드 순서 중요 (의존성 고려)
  - 모달은 동적 로드이므로 초기 로딩 시점 고려
  - 브라우저 호환성 (fetch API 사용)

---

## 🎯 예상 최종 결과

- **index.html**: 약 800-1,000줄
- **모듈화**: 모든 주요 기능이 별도 파일로 분리
- **유지보수성**: 향상된 코드 구조
- **성능**: 동적 로딩으로 초기 로딩 시간 단축

---

**마지막 업데이트**: 작업 중단 시점  
**다음 작업**: 주석 처리된 HTML 제거 완료 → Phase 2 시작

