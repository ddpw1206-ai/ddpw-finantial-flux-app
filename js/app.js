// ========================================
// 메인 초기화 및 이벤트
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('앱 시작 - 버전:', APP_VERSION);
  
  // 버전 표시
  const versionEl = document.querySelector('.version');
  if (versionEl) versionEl.textContent = `V.${APP_VERSION}`;
  
  // 데이터 로드
  loadData();
  loadAccountData();
  loadMerchantHistory();
  loadCardData();
  loadCardParsingTemplates();
  
  // 탭 전환 이벤트
  const tabButtons = document.querySelectorAll('.nav-tab');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      console.log('탭 클릭:', this.getAttribute('data-tab'));
      
      // 모든 탭 비활성화
      tabButtons.forEach(b => b.classList.remove('active'));
      // 클릭한 탭 활성화
      this.classList.add('active');
      
      const tabKey = this.getAttribute('data-tab');
      currentActiveTab = tabKey;
      
      // 대시보드 콘텐츠 숨김
      const dashboardContent = document.getElementById('dashboard-content');
      if (dashboardContent) {
        dashboardContent.style.display = 'none';
      }
      
      // FAB 버튼 표시/숨김
      const fabBtn = document.getElementById('fab-btn');
      if (fabBtn) {
        if (tabKey === 'dashboard') {
          fabBtn.style.display = 'flex';
        } else {
          fabBtn.style.display = 'none';
        }
      }
      
      // 탭별 초기화
      if (tabKey === 'dashboard') {
        initDashboard();
      } else if (tabKey === 'accounts') {
        initAccounts();
      } else if (tabKey === 'cards') {
        initCards();
      } else if (tabKey === 'stats') {
        initStats();
      } else if (tabKey === 'saving') {
        initSaving();
      } else if (tabKey === 'settings') {
        initSettings();
      }
    });
  });
  
  // 월 선택 버튼
  document.getElementById('prev-month')?.addEventListener('click', function() {
    curMonth--;
    if (curMonth < 1) {
      curMonth = 12;
      curYear--;
    }
    updateMonthText();
    updateDashboard();
    
    // 대시보드가 열려있으면 테이블도 업데이트
    if (currentActiveTab === 'dashboard') {
      renderTable();
      renderCardTable('all');
      renderBankTable();
    }
  });
  
  document.getElementById('next-month')?.addEventListener('click', function() {
    curMonth++;
    if (curMonth > 12) {
      curMonth = 1;
      curYear++;
    }
    updateMonthText();
    updateDashboard();
    
    // 대시보드가 열려있으면 테이블도 업데이트
    if (currentActiveTab === 'dashboard') {
      renderTable();
      renderCardTable('all');
      renderBankTable();
    }
  });
  
  // FAB 버튼
  document.getElementById('fab-btn')?.addEventListener('click', function() {
    console.log('FAB 클릭');
    alert('신규 등록 모달 (추후 구현)');
  });
  
  // 월 텍스트 초기화
  updateMonthText();
  
  // 초기 탭 로드
  initDashboard();
  
  console.log('앱 초기화 완료');
});

console.log('app.js 로드 완료');

