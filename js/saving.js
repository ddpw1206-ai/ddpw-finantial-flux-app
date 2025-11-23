// ========================================
// 저축관리 탭
// ========================================

function initSaving() {
  console.log('저축관리 초기화');
  
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;
  
  // mainContent 완전히 비우기 (중복 방지)
  mainContent.innerHTML = '';
  
  // 저축관리 컨테이너 생성
  const savingContainer = document.createElement('div');
  savingContainer.id = 'saving-container';
  mainContent.appendChild(savingContainer);
  
  window.renderSavingTab(savingContainer);
}

// ========================================
// 저축관리 탭 렌더링
// ========================================
window.renderSavingTab = function(container) {
  // container가 없으면 main-content를 찾아서 사용
  if (!container) {
    container = document.getElementById('main-content');
  }
  if (!container) {
    console.error('renderSavingTab: container를 찾을 수 없습니다.');
    return;
  }
  
  // container 완전히 비우기 (안전성 보장)
  container.innerHTML = '';
  
  container.innerHTML = `
    <div style="padding: 20px;">
      <h2 style="margin-bottom: 20px;">💰 저축관리</h2>
      <p style="color: #6B7280;">저축 목표 관리가 여기 표시됩니다.</p>
    </div>
  `;
}

console.log('saving.js 로드 완료');

