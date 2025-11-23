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
  
  // 탭 전환 이벤트 (완전 독립 렌더링)
  const tabButtons = document.querySelectorAll('.nav-tab');
  
  tabButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // 1. active 클래스 제거
      tabButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      const tabKey = this.getAttribute('data-tab');
      currentActiveTab = tabKey;
      
      // 2. mainContent 완전히 비우기
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.innerHTML = '';
      }
      
      console.log('탭 전환:', tabKey);
      
      // FAB 버튼 상태 업데이트
      if (typeof window.updateFabButton === 'function') {
        window.updateFabButton();
      }
      
      // 3. 탭별 독립적인 렌더링 함수 호출
      if (tabKey === 'dashboard') {
        if (typeof initDashboard === 'function') {
          initDashboard();
        }
      } else if (tabKey === 'accounts') {
        if (typeof initAccounts === 'function') {
          initAccounts();
        }
      } else if (tabKey === 'cards') {
        if (typeof initCards === 'function') {
          initCards();
        }
      } else if (tabKey === 'stats') {
        if (typeof initStats === 'function') {
          initStats();
        }
      } else if (tabKey === 'saving') {
        if (typeof initSaving === 'function') {
          initSaving();
        }
      } else if (tabKey === 'settings') {
        if (typeof initSettings === 'function') {
          initSettings();
        }
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
  
  // FAB 메뉴 토글
  const fabMain = document.getElementById('fab-main');
  const fabContainer = document.getElementById('fab-container');
  const fabMenu = document.getElementById('fab-menu');
  let fabMenuOpen = false;
  
  // FAB 버튼 표시/숨김 업데이트 함수
  window.updateFabButton = function() {
    if (!fabContainer) return;
    
    if (currentActiveTab === 'dashboard' || currentActiveTab === 'accounts' || currentActiveTab === 'cards' || currentActiveTab === 'saving') {
      fabContainer.style.display = 'flex';
    } else {
      fabContainer.style.display = 'none';
    }
    
    // 메뉴 닫기
    if (fabMenu && fabMenuOpen) {
      fabMenuOpen = false;
      fabMain.classList.remove('active');
      fabMenu.classList.remove('active');
    }
  };
  
  if (fabMain && fabMenu) {
    // 메인 FAB 클릭 시 메뉴 토글
    fabMain.addEventListener('click', function(e) {
      e.stopPropagation();
      fabMenuOpen = !fabMenuOpen;
      
      if (fabMenuOpen) {
        fabMain.classList.add('active');
        fabMenu.classList.add('active');
        console.log('FAB 메뉴 열림, fabMenuOpen:', fabMenuOpen);
      } else {
        fabMain.classList.remove('active');
        fabMenu.classList.remove('active');
        console.log('FAB 메뉴 닫힘, fabMenuOpen:', fabMenuOpen);
      }
    });
    
    // 외부 클릭 시 메뉴 닫기
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.fab-container') && fabMenuOpen) {
        fabMenuOpen = false;
        fabMain.classList.remove('active');
        fabMenu.classList.remove('active');
        console.log('외부 클릭으로 FAB 메뉴 닫힘');
      }
    });
    
    // 하위 FAB 버튼 클릭 이벤트 (이벤트 위임 사용)
    if (fabMenu) {
      fabMenu.addEventListener('click', function(e) {
        const target = e.target.closest('.fab-sub');
        if (!target) return;
        
        e.stopPropagation();
        
        const targetTab = target.getAttribute('data-tab');
        console.log('FAB 버튼 클릭:', targetTab);
        
        // 1. 메뉴 닫기
        fabMenuOpen = false;
        fabMain.classList.remove('active');
        fabMenu.classList.remove('active');
        
        // 2. 해당 탭으로 전환
        const tabButton = document.querySelector(`.nav-tab[data-tab="${targetTab}"]`);
        if (tabButton) {
          // 탭 버튼 클릭 이벤트 트리거 (기존 로직 재사용)
          tabButton.click();
        }
        
        // 3. 해당 탭의 모달 열기 (300ms 딜레이 - 탭 렌더링 완료 대기)
        setTimeout(() => {
          if (targetTab === 'dashboard') {
            if (typeof window.openTransactionModal === 'function') {
              window.openTransactionModal();
            } else if (typeof window.openModal === 'function') {
              window.openModal(false);
            }
          } else if (targetTab === 'accounts') {
            if (typeof window.openAccountTransactionModal === 'function') {
              window.openAccountTransactionModal();
            }
          } else if (targetTab === 'cards') {
            if (typeof window.openPaymentMethodModal === 'function') {
              window.openPaymentMethodModal();
            } else if (typeof window.openAccountModal === 'function') {
              window.openAccountModal(false);
            }
          } else if (targetTab === 'saving') {
            alert('저축 등록 기능은 추후 구현 예정입니다.');
          }
        }, 300);
      });
    }
  }
  
  // 월 텍스트 초기화
  updateMonthText();
  
  // 모달 초기화 (카테고리 옵션, 자주 쓰는 사용처, 결제수단 옵션)
  setTimeout(() => {
    if (typeof updateCategoryOptions === 'function') {
      updateCategoryOptions();
    }
    if (typeof updateMerchantHistorySelect === 'function') {
      updateMerchantHistorySelect();
    }
    if (typeof updatePaymentOptions === 'function') {
      updatePaymentOptions();
    }
  }, 200);
  
  // 초기 탭 로드
  initDashboard();
  
  console.log('앱 초기화 완료');
});

console.log('app.js 로드 완료');

