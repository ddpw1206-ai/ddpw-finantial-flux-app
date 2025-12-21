// ========================================
// 대시보드 탭 초기화 및 렌더링 (New Integrated Version)
// ========================================

// 대시보드 렌더링 함수 (mainContent를 파라미터로 받음)
window.renderDashboard = function (mainContent) {
  console.log('대시보드 렌더링 (통합 버전)');

  if (!mainContent) {
    mainContent = document.getElementById('main-content');
  }
  if (!mainContent) return;

  // mainContent 완전히 비우기 (중복 방지)
  mainContent.innerHTML = '';

  // 대시보드 컨테이너 생성
  const dashboardContent = document.createElement('div');
  dashboardContent.id = 'dashboard-content';
  dashboardContent.className = 'container-fluid py-4';
  mainContent.appendChild(dashboardContent);

  dashboardContent.innerHTML = `
      <style>
        .card { border-radius: 12px; }
        .btn { border-radius: 8px; }
        .form-control, .form-select { border-radius: 8px; }
        .sub-tabs {
            display: flex;
            gap: 8px;
            margin-bottom: 24px;
            border-bottom: 1px solid #E5E7EB;
        }
        .sub-tab-btn {
            background: none;
            border: none;
            padding: 12px 20px;
            color: #6B7280;
            font-weight: 500;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            margin-bottom: -1px;
        }
        .sub-tab-btn.active {
            color: #EF4444;
            border-bottom-color: #EF4444;
            font-weight: 600;
        }
      </style>

      <!-- 월별 현황 대시보드 (동적 렌더링) -->
      <div id="monthly-summary-container" class="mb-5">
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 text-muted">현황 데이터를 불러오고 있습니다...</p>
        </div>
      </div>

      <!-- 필터 및 검색 영역 -->
      <div class="card mb-4 shadow-sm border-0">
        <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h6 class="mb-0 fw-bold">🔍 검색 및 상세 필터</h6>
          <button class="btn btn-sm btn-outline-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#filterCollapse">
            접기/펴기
          </button>
        </div>
        <div class="collapse show" id="filterCollapse">
          <div class="card-body bg-light">
            <div class="row g-3">
              <div class="col-md-4">
                <label class="form-label small fw-bold text-muted">검색어 (사용처, 내용)</label>
                <input type="text" class="form-control" id="filter-search" placeholder="검색어를 입력하세요">
              </div>
              <div class="col-md-2">
                <label class="form-label small fw-bold text-muted">사용자</label>
                <select class="form-select" id="filter-user">
                  <option value="">전체</option>
                  <option value="공용">공용</option>
                  <option value="파우">파우</option>
                  <option value="둠둠">둠둠</option>
                </select>
              </div>
              <div class="col-md-2">
                <label class="form-label small fw-bold text-muted">구분</label>
                <select class="form-select" id="filter-type">
                  <option value="">전체</option>
                  <option value="income">수입</option>
                  <option value="expense">지출</option>
                </select>
              </div>
              <div class="col-md-2">
                <label class="form-label small fw-bold text-muted">카테고리</label>
                <select class="form-select" id="filter-category">
                  <option value="">전체</option>
                </select>
              </div>
              <div class="col-md-2">
                <label class="form-label small fw-bold text-muted">결제방법</label>
                <select class="form-select" id="filter-payment">
                  <option value="">전체</option>
                </select>
              </div>
              
              <div class="col-md-2">
                <label class="form-label small fw-bold text-muted">최소 금액</label>
                <input type="text" class="form-control" id="filter-amount-min" placeholder="0">
              </div>
              <div class="col-md-2">
                <label class="form-label small fw-bold text-muted">최대 금액</label>
                <input type="text" class="form-control" id="filter-amount-max" placeholder="무제한">
              </div>
              <div class="col-md-3">
                <label class="form-label small fw-bold text-muted">시작일</label>
                <input type="date" class="form-control" id="filter-date-start">
              </div>
              <div class="col-md-3">
                <label class="form-label small fw-bold text-muted">종료일</label>
                <input type="date" class="form-control" id="filter-date-end">
              </div>
              <div class="col-md-2 d-flex align-items-end">
                <button class="btn btn-secondary w-100 fw-bold" id="filter-reset-btn">🔄 초기화</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 액션 버튼 -->
      <div class="row mb-4 align-items-center">
        <div class="col-md-6 d-flex gap-2">
          <button id="new-entry-btn" class="btn btn-primary px-4 fw-bold">📝 신규 거래 등록</button>
        </div>
        <div class="col-md-6 d-flex justify-content-end align-items-center gap-3">
          <!-- 정렬 드롭다운 삭제 (테이블 헤더 정렬 사용) -->
        </div>
      </div>

      <!-- 하위 탭 -->
      <nav class="sub-tabs" id="sub-tabs">
        <button class="sub-tab-btn active" data-subtab="total">전체 소비 내역</button>
        <button class="sub-tab-btn" data-subtab="card" style="display:none;">카드별 내역</button>
        <button class="sub-tab-btn" data-subtab="bank" style="display:none;">통장 입출금</button>
      </nav>

      <!-- 거래 테이블 (동적 렌더링) -->
      <div id="transaction-table-container">
        <div class="text-center py-5 bg-white rounded-3 shadow-sm">
            <p class="text-muted mb-0">거래 내역을 불러오는 중입니다...</p>
        </div>
      </div>
  `;

  // 모듈 초기화 호출 (지연 실행하여 DOM 반영 시간 확보)
  setTimeout(() => {
    if (typeof window.MonthlyPage !== 'undefined' && typeof window.MonthlyPage.init === 'function') {
      window.MonthlyPage.init();
    } else {
      console.error('MonthlyPage 모듈이 정의되지 않았습니다.');
    }
  }, 50);
};

// 호환성 유지용 초기화 함수
function initDashboard() {
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    window.renderDashboard(mainContent);
  }
}

console.log('dashboard.js (Integrated) 로드 완료');
