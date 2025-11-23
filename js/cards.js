// ========================================
// 카드 관리 탭
// ========================================

function initCards() {
  console.log('카드 관리 초기화');
  
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;
  
  // 대시보드 콘텐츠 숨김
  const dashboardContent = document.getElementById('dashboard-content');
  if (dashboardContent) {
    dashboardContent.style.display = 'none';
  }
  
  mainContent.innerHTML = `
    <div style="padding: 20px;">
      <h2 style="margin-bottom: 20px;">💳 카드 관리</h2>
      <p style="color: #6B7280;">카드 관리 기능이 여기 표시됩니다.</p>
    </div>
  `;
}

console.log('cards.js 로드 완료');

