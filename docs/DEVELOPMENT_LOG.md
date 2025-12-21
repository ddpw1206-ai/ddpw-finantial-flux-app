# DDPW Moneybook Flux - Development Log

## 2025-12-21: Phase 1-2 버그 수정 완료

### 수정된 버그

#### Bug 1: 저장 로직 ✅ FIXED
- **문제**: [저장] 클릭 시 데이터가 저장되지 않음
- **해결**: 
  - `transaction-modal.js` handleSubmit에서 localStorage에 정상 저장
  - 저장 후 `TransactionTable.render()` 및 `MonthlySummary.update()` 호출
  - 저장 키: `ddpw_transactions_YYYY_MM`

#### Bug 2: 수정/삭제 버튼 ✅ FIXED
- **문제**: 테이블 [수정], [삭제] 버튼 무반응
- **해결**:
  - `transaction-table.js` - `editRow()` 함수: 거래 데이터를 모달에 채워서 열기
  - `transaction-table.js` - `deleteRow()` 함수: confirm 후 삭제, 테이블/요약 리렌더링

### 2025-12-22: Phase 1-2 추가 버그 패치 & Phase 2-1 UX 보완
- **월별 이동 버그 수정**: +2개월 이동 문제 해결 (이벤트 중복 바인딩 제거 및 전역 연월 동기화).
- **고정 거래 시스템 구현**: 반복 등록일(fixedDay) 추가 및 월별 자동 노출 로직 구현 (DataManager 마스터/인스턴스 구조).
- **거래 입력 모달 UX 개선**: 
  - 고정 거래 체크박스 상향 배치.
  - 할부 UI 구조 개선 (결제방법에 종속되지 않고 항상 노출/체크 시 활성화).
  - 결제방법에서 `신용카드(할부)` 제거 및 일반 수단 단일화.
  - '자주 쓰는 사용처' 선택 영역(스켈레톤) 추가 및 히스토리 연동.
- **모달 오버레이 버그 수정**: 닫기/취소/저장 시 백드롭 잔존 문제 해결.
- **삭제/선택 삭제 기능 정상화**: string ID 기반으로 합성 ID 호환성 확보 및 삭제 로직 검증.
- **대시보드 UI 정리**: 불필요한 '필터 추가' 버튼 및 중복 '정렬' 드롭다운 제거.
#### Bug 3: 체크박스 및 일괄 삭제 ✅ FIXED
- **문제**: 선택 기능 없음
- **해결**:
  - 테이블 헤더에 "전체 선택" 체크박스 추가
  - 각 행에 개별 체크박스 추가
  - `selectedIds` Set으로 선택 상태 관리
  - "선택 삭제" 버튼 및 `deleteSelected()` 함수 구현

#### Bug 4: 검색 기능 ✅ FIXED
- **문제**: 텍스트 검색 필터링 안됨
- **해결**:
  - `transaction-filter.js` - `filter-search` input에 실시간 필터링 바인딩
  - 사용처, 세부내용, 카테고리, 금액 기준 필터링

### 정리된 파일
- **index.html**: 레거시 정적 테이블 HTML 190줄 삭제 (`total-content` 내부)
- **js/transaction-table.js**: 체크박스, 일괄 삭제 기능 추가

### 테스트 결과
```
✅ 데이터 저장 → localStorage ddpw_transactions_2025_12 확인
✅ 컨테이너 ID 존재 → monthly-summary-container, transaction-table-container
✅ 카테고리/결제수단 데이터 → window.EXPENSE_CATEGORIES, window.PAYMENT_METHODS
✅ TransactionModal 초기화 → 모달 열기/닫기 정상
```

### 남은 이슈
- 페이지 로드 시 초기 렌더링 지연 가능 (브라우저 캐시 문제)
- 권장: 브라우저 캐시 삭제 후 테스트 (Ctrl+Shift+R)

### 변경 파일 목록
1. `js/transaction-table.js` - 체크박스, 일괄 삭제 추가
2. `index.html` - 레거시 정적 테이블 제거
