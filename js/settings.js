// ========================================
// 설정 탭
// ========================================

function initSettings() {
  console.log('설정 초기화');
  
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;
  
  // 대시보드 콘텐츠 숨김
  const dashboardContent = document.getElementById('dashboard-content');
  if (dashboardContent) {
    dashboardContent.style.display = 'none';
  }
  
  mainContent.innerHTML = `
    <div style="padding: 20px;">
      <h2 style="margin-bottom: 20px;">⚙️ 설정</h2>
      <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #E5E7EB;">
        <h3>데이터 관리</h3>
        <div style="margin-top: 16px; display: flex; gap: 12px;">
          <button id="backup-btn" class="header-btn">💾 백업</button>
          <button id="restore-btn" class="header-btn">📥 복원</button>
        </div>
      </div>
    </div>
  `;
  
  // 백업 버튼
  document.getElementById('backup-btn')?.addEventListener('click', function() {
    const data = {
      transactions: transactionData,
      accounts: accountData,
      merchants: merchantHistory,
      cards: cardData,
      version: APP_VERSION,
      date: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ddpw-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert('백업 완료!');
  });
  
  // 복원 버튼
  document.getElementById('restore-btn')?.addEventListener('click', function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const data = JSON.parse(e.target.result);
          if (data.transactions) transactionData = data.transactions;
          if (data.accounts) accountData = data.accounts;
          if (data.merchants) merchantHistory = data.merchants;
          if (data.cards) cardData = data.cards;
          
          saveData();
          saveAccountData();
          saveMerchantHistory();
          saveCardData();
          
          alert('복원 완료! 페이지를 새로고침하세요.');
        } catch (error) {
          alert('복원 실패: ' + error.message);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  });
}

console.log('settings.js 로드 완료');

