// ========================================
// 통계 탭
// ========================================

function initStats() {
  console.log('통계 초기화');
  
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;
  
  // 대시보드 콘텐츠 숨김
  const dashboardContent = document.getElementById('dashboard-content');
  if (dashboardContent) {
    dashboardContent.style.display = 'none';
  }
  
  mainContent.innerHTML = `
    <div style="padding: 20px;">
      <h2 style="margin-bottom: 20px;">📊 통계</h2>
      <p style="color: #6B7280;">통계 차트가 여기 표시됩니다.</p>
    </div>
  `;
}

console.log('stats.js 로드 완료');

