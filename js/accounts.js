// ========================================
// 계좌 입출금 관리 탭
// ========================================

function initAccounts() {
  console.log('계좌 관리 초기화');
  
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;
  
  // 대시보드 콘텐츠 숨김
  const dashboardContent = document.getElementById('dashboard-content');
  if (dashboardContent) {
    dashboardContent.style.display = 'none';
  }
  
  mainContent.innerHTML = `
    <div style="padding: 20px;">
      <h2 style="margin-bottom: 20px;">💰 계좌 입출금 관리</h2>
      <div style="margin-bottom: 20px;">
        <button id="add-account-btn" class="header-btn">+ 계좌 추가</button>
      </div>
      <div id="accounts-list"></div>
    </div>
  `;
  
  renderAccountsList();
  
  // 계좌 추가 버튼
  document.getElementById('add-account-btn')?.addEventListener('click', function() {
    alert('계좌 추가 기능 (추후 구현)');
  });
}

function renderAccountsList() {
  const container = document.getElementById('accounts-list');
  if (!container) return;
  
  if (accountData.length === 0) {
    container.innerHTML = '<p style="color: #6B7280;">등록된 계좌가 없습니다.</p>';
    return;
  }
  
  let html = '<div style="display: grid; gap: 16px;">';
  accountData.forEach(account => {
    html += `
      <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #E5E7EB;">
        <h3>${account.name}</h3>
        <p>잔액: ${(account.currentBalance || 0).toLocaleString()}원</p>
      </div>
    `;
  });
  html += '</div>';
  
  container.innerHTML = html;
}

console.log('accounts.js 로드 완료');

