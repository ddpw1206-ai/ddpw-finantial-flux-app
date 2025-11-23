// ========================================
// 저축관리 탭
// ========================================

function initSaving() {
  console.log('저축관리 초기화');
  
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;
  
  // 대시보드 콘텐츠 숨김
  const dashboardContent = document.getElementById('dashboard-content');
  if (dashboardContent) {
    dashboardContent.style.display = 'none';
  }
  
  mainContent.innerHTML = `
    <div style="padding: 20px;">
      <h2 style="margin-bottom: 20px;">💰 저축관리</h2>
      <p style="color: #6B7280;">저축 목표 관리가 여기 표시됩니다.</p>
    </div>
  `;
}

console.log('saving.js 로드 완료');

