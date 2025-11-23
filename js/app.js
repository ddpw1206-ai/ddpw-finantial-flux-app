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
      console.log('탭 클릭:', this.getAttribute('data-tab'));
      
      // 모든 탭 비활성화
      tabButtons.forEach(b => b.classList.remove('active'));
      // 클릭한 탭 활성화
      this.classList.add('active');
      
      const tabKey = this.getAttribute('data-tab');
      currentActiveTab = tabKey;
      
      // mainContent 완전히 비우기 (중복 방지)
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.innerHTML = '';
      }
      
      // FAB 버튼 상태 업데이트
      if (typeof window.updateFabButton === 'function') {
        window.updateFabButton();
      }
      
      // 탭별 독립적인 렌더링 함수 호출
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
  
  // FAB 버튼 및 서브 메뉴
  const fabBtn = document.getElementById('fab-btn');
  const fabContainer = document.getElementById('fab-container');
  const fabSubmenu = document.getElementById('fab-submenu');
  let fabSubmenuOpen = false;
  
  // FAB 버튼 표시/숨김 업데이트 함수
  window.updateFabButton = function() {
    if (!fabContainer) return;
    
    if (currentActiveTab === 'dashboard' || currentActiveTab === 'accounts' || currentActiveTab === 'cards' || currentActiveTab === 'saving') {
      fabContainer.style.display = 'block';
    } else {
      fabContainer.style.display = 'none';
    }
    
    // 서브 메뉴 닫기
    if (fabSubmenu) {
      fabSubmenu.classList.remove('show');
      fabSubmenuOpen = false;
    }
  };
  
  // FAB 버튼 클릭/호버 이벤트
  if (fabBtn && fabSubmenu) {
    // 메인 FAB 버튼 클릭/호버
    fabBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleFabSubmenu();
    });
    
    // FAB 버튼 호버 시 서브 메뉴 표시
    fabBtn.addEventListener('mouseenter', function() {
      if (!fabSubmenuOpen && fabSubmenu) {
        fabSubmenu.classList.add('show');
        fabSubmenuOpen = true;
      }
    });
    
    // FAB 컨테이너에서 마우스가 벗어날 때 서브 메뉴 닫기 (약간의 지연)
    let fabHoverTimeout;
    if (fabContainer) {
      fabContainer.addEventListener('mouseleave', function() {
        fabHoverTimeout = setTimeout(() => {
          if (fabSubmenu && fabSubmenuOpen) {
            fabSubmenu.classList.remove('show');
            fabSubmenuOpen = false;
          }
        }, 300); // 300ms 지연
      });
      
      fabContainer.addEventListener('mouseenter', function() {
        if (fabHoverTimeout) {
          clearTimeout(fabHoverTimeout);
        }
      });
    }
    
    // 서브 메뉴 버튼들
    const fabSubDashboard = document.getElementById('fab-sub-dashboard');
    const fabSubAccounts = document.getElementById('fab-sub-accounts');
    const fabSubCards = document.getElementById('fab-sub-cards');
    const fabSubSaving = document.getElementById('fab-sub-saving');
    
    // 월별현황 신규 등록
    if (fabSubDashboard) {
      fabSubDashboard.addEventListener('click', function(e) {
        e.stopPropagation();
        // 월별현황 탭으로 이동
        switchToTab('dashboard', () => {
          // 탭 이동 후 모달 열기
          setTimeout(() => {
            if (typeof window.openTransactionModal === 'function') {
              window.openTransactionModal();
            } else if (typeof window.openModal === 'function') {
              window.openModal(false);
            }
          }, 100);
        });
        toggleFabSubmenu();
      });
    }
    
    // 계좌 관리 입출금 내역 등록
    if (fabSubAccounts) {
      fabSubAccounts.addEventListener('click', function(e) {
        e.stopPropagation();
        // 계좌 관리 탭으로 이동
        switchToTab('accounts', () => {
          // 탭 이동 후 모달 열기
          setTimeout(() => {
            if (typeof window.openAccountTransactionModal === 'function') {
              window.openAccountTransactionModal();
            }
          }, 100);
        });
        toggleFabSubmenu();
      });
    }
    
    // 결제수단 관리 결제 수단 등록
    if (fabSubCards) {
      fabSubCards.addEventListener('click', function(e) {
        e.stopPropagation();
        // 결제수단 관리 탭으로 이동
        switchToTab('cards', () => {
          // 탭 이동 후 모달 열기
          setTimeout(() => {
            if (typeof window.openPaymentMethodModal === 'function') {
              window.openPaymentMethodModal();
            } else if (typeof window.openAccountModal === 'function') {
              window.openAccountModal(false);
            }
          }, 100);
        });
        toggleFabSubmenu();
      });
    }
    
    // 저축관리
    if (fabSubSaving) {
      fabSubSaving.addEventListener('click', function(e) {
        e.stopPropagation();
        // 저축관리 탭으로 이동
        switchToTab('saving', () => {
          alert('저축 등록 기능 준비 중');
        });
        toggleFabSubmenu();
      });
    }
    
    // 서브 메뉴 토글 함수
    function toggleFabSubmenu() {
      if (!fabSubmenu) return;
      
      if (fabSubmenuOpen) {
        fabSubmenu.classList.remove('show');
        fabSubmenuOpen = false;
      } else {
        fabSubmenu.classList.add('show');
        fabSubmenuOpen = true;
      }
    }
    
    // 탭 전환 함수
    function switchToTab(tabKey, callback) {
      console.log('탭 전환:', tabKey);
      const tabButton = document.querySelector(`.nav-tab[data-tab="${tabKey}"]`);
      if (tabButton) {
        // 탭 버튼 클릭으로 전환
        tabButton.click();
        // 콜백 실행 (탭 전환 후 모달 열기)
        if (callback) {
          // 탭 전환이 완료될 때까지 충분한 시간 대기
          setTimeout(callback, 200);
        }
      } else {
        console.error('탭 버튼을 찾을 수 없습니다:', tabKey);
      }
    }
    
    // 외부 클릭 시 서브 메뉴 닫기
    document.addEventListener('click', function(e) {
      if (fabContainer && !fabContainer.contains(e.target)) {
        if (fabSubmenu) {
          fabSubmenu.classList.remove('show');
          fabSubmenuOpen = false;
        }
      }
    });
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

