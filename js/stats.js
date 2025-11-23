// ========================================
// 통계 탭
// ========================================

function initStats() {
  console.log('통계 초기화');
  
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;
  
  // mainContent 완전히 비우기 (중복 방지)
  mainContent.innerHTML = '';
  
  // 통계 컨테이너 생성
  const statsContainer = document.createElement('div');
  statsContainer.id = 'stats-container';
  mainContent.appendChild(statsContainer);
  
  window.renderStatsTab(statsContainer);
}

// ========================================
// 통계 탭 렌더링
// ========================================
window.renderStatsTab = function(container) {
  // container가 없으면 main-content를 찾아서 사용
  if (!container) {
    container = document.getElementById('main-content');
  }
  if (!container) {
    console.error('renderStatsTab: container를 찾을 수 없습니다.');
    return;
  }
  
  // container 완전히 비우기 (안전성 보장)
  container.innerHTML = '';
  
  container.innerHTML = `
    <div style="padding: 20px;">
      <h2 style="margin-bottom: 20px;">📊 통계</h2>
      <p style="color: #6B7280;">통계 차트가 여기 표시됩니다.</p>
    </div>
  `;
}

console.log('stats.js 로드 완료');

