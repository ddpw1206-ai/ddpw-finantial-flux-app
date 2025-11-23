// ========================================
// 설정 탭
// ========================================

function initSettings() {
  console.log('설정 초기화');
  
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;
  
  // mainContent 완전히 비우기 (중복 방지)
  mainContent.innerHTML = '';
  
  // 설정 컨테이너 생성
  const settingsContainer = document.createElement('div');
  settingsContainer.id = 'settings-container';
  mainContent.appendChild(settingsContainer);
  
  window.renderSettingsTab(settingsContainer);
}

// ========================================
// 설정 탭 렌더링
// ========================================
window.renderSettingsTab = function(container) {
  // container가 없으면 main-content를 찾아서 사용
  if (!container) {
    container = document.getElementById('main-content');
  }
  if (!container) {
    console.error('renderSettingsTab: container를 찾을 수 없습니다.');
    return;
  }
  
  // container 완전히 비우기 (안전성 보장)
  container.innerHTML = '';
  
  container.innerHTML = `
    <div style="padding: 20px;">
      <h2 style="margin-bottom: 20px;">⚙️ 설정</h2>
      <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #E5E7EB; margin-bottom: 20px;">
        <h3 style="margin-bottom: 16px;">데이터 관리</h3>
        <div style="margin-top: 16px; display: flex; gap: 12px; flex-wrap: wrap;">
          <button id="backup-btn" class="header-btn">💾 백업 (다운로드)</button>
          <button id="restore-btn" class="header-btn">📥 복원 (파일 선택)</button>
        </div>
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #E5E7EB;">
          <p style="font-size: 0.9rem; color: #6B7280; margin-bottom: 12px;">
            File System Access API를 사용하여 OneDrive 등 클라우드 폴더에 자동 동기화할 수 있습니다.
          </p>
          <button id="select-folder-btn" class="header-btn" style="background: #10B981;">📁 데이터 폴더 선택</button>
          <p id="folder-status" style="font-size: 0.85rem; color: #6B7280; margin-top: 8px;">
            ${(typeof dataFolderHandle !== 'undefined' && dataFolderHandle) || (typeof window !== 'undefined' && window.dataFolderHandle) ? '✅ 폴더가 선택되었습니다. 데이터가 자동으로 동기화됩니다.' : '폴더를 선택하면 데이터가 자동으로 파일에 저장됩니다.'}
          </p>
        </div>
      </div>
    </div>
  `;
  
  // 백업 버튼
  container.querySelector('#backup-btn')?.addEventListener('click', function() {
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
    
    alert('백업 완료! 파일이 다운로드되었습니다.');
  });
  
  // 폴더 선택 버튼 (16번 QA: 최초 폴더 선택 시 불러오기 확인)
  container.querySelector('#select-folder-btn')?.addEventListener('click', async function() {
    if (typeof window.selectDataFolder === 'function') {
      const success = await window.selectDataFolder();
      if (success) {
        const folderStatus = container.querySelector('#folder-status');
        if (folderStatus) {
          folderStatus.textContent = '✅ 폴더가 선택되었습니다. 헤더의 저장/불러오기 버튼을 사용하세요.';
          folderStatus.style.color = '#10B981';
        }
        
        // 최초 폴더 선택 시 불러오기 확인 (16번 QA 요구사항)
        const shouldLoad = confirm('이 폴더의 데이터를 불러오시겠습니까?');
        if (shouldLoad) {
          if (typeof window.loadDataFromFolder === 'function') {
            const loadSuccess = await window.loadDataFromFolder();
            if (loadSuccess) {
              // 파일에서 로드한 후 localStorage와 동기화
              if (typeof saveData === 'function') saveData();
              if (typeof saveAccountData === 'function') saveAccountData();
              if (typeof saveMerchantHistory === 'function') saveMerchantHistory();
              if (typeof saveCardData === 'function') saveCardData();
              
              // UI 갱신
              if (typeof updateDashboard === 'function') updateDashboard();
              const mainContent = document.getElementById('main-content');
              if (mainContent) {
                if (window.currentActiveTab === 'dashboard' && typeof window.renderDashboard === 'function') {
                  window.renderDashboard(mainContent);
                } else if (window.currentActiveTab === 'accounts' && typeof window.renderAccountsTab === 'function') {
                  window.renderAccountsTab(mainContent);
                } else if (window.currentActiveTab === 'cards' && typeof window.renderPaymentMethodsTab === 'function') {
                  window.renderPaymentMethodsTab(mainContent);
                }
              }
              alert('데이터를 불러왔습니다.');
            } else {
              // 폴더에는 데이터가 없지만 선택은 완료됨
              // 현재 localStorage 데이터를 폴더에 저장
              if (typeof saveData === 'function') saveData();
              if (typeof saveAccountData === 'function') saveAccountData();
              if (typeof saveMerchantHistory === 'function') saveMerchantHistory();
              if (typeof saveCardData === 'function') saveCardData();
              
              alert('폴더가 선택되었습니다. 현재 데이터가 폴더에 저장되었습니다.');
            }
          } else {
            // loadDataFromFolder 함수가 없는 경우에도 현재 데이터 저장
            if (typeof saveData === 'function') saveData();
            if (typeof saveAccountData === 'function') saveAccountData();
            if (typeof saveMerchantHistory === 'function') saveMerchantHistory();
            if (typeof saveCardData === 'function') saveCardData();
            
            alert('폴더가 선택되었습니다. 이제 데이터가 자동으로 파일에 저장됩니다.');
          }
        } else {
          // 폴더만 지정하고 불러오지 않음
          console.log('폴더만 선택되었습니다. 이후 헤더의 저장/불러오기 버튼을 사용하세요.');
        }
      } else {
        alert('폴더 선택이 취소되었습니다.');
      }
    } else {
      alert('File System Access API를 지원하지 않는 브라우저입니다.');
    }
  });
  
  // 복원 버튼
  container.querySelector('#restore-btn')?.addEventListener('click', function() {
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

