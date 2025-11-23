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
      window.currentActiveTab = tabKey;
      
      // 2. mainContent 완전히 비우기
      const mainContent = document.getElementById('main-content');
      mainContent.innerHTML = '';
      
      console.log('탭 전환:', tabKey);
      
      // 연/월 표시 제어 (dashboard와 accounts만 표시)
      const monthBar = document.querySelector('.month-bar');
      if (monthBar) {
        if (tabKey === 'dashboard' || tabKey === 'accounts') {
          monthBar.style.display = 'flex';
        } else {
          monthBar.style.display = 'none';
        }
      }
      
      // FAB 버튼 상태 업데이트
      if (typeof window.updateFabButton === 'function') {
        window.updateFabButton();
      }
      
      // 3. 탭별 독립적인 렌더링 함수 호출 (window 객체를 통해 호출)
      if (tabKey === 'dashboard') {
        if (typeof window.renderDashboard === 'function') {
          window.renderDashboard(mainContent);
        } else {
          console.error('renderDashboard 함수를 찾을 수 없습니다.');
        }
      } else if (tabKey === 'accounts') {
        if (typeof window.renderAccountsTab === 'function') {
          window.renderAccountsTab(mainContent);
        } else {
          console.error('renderAccountsTab 함수를 찾을 수 없습니다.');
        }
      } else if (tabKey === 'cards') {
        if (typeof window.renderPaymentMethodsTab === 'function') {
          window.renderPaymentMethodsTab(mainContent);
        } else {
          console.error('renderPaymentMethodsTab 함수를 찾을 수 없습니다.');
        }
      } else if (tabKey === 'saving') {
        if (typeof window.renderSavingTab === 'function') {
          window.renderSavingTab(mainContent);
        } else {
          console.error('renderSavingTab 함수를 찾을 수 없습니다.');
        }
      } else if (tabKey === 'stats') {
        if (typeof window.renderStatsTab === 'function') {
          window.renderStatsTab(mainContent);
        } else {
          console.error('renderStatsTab 함수를 찾을 수 없습니다.');
        }
      } else if (tabKey === 'settings') {
        if (typeof window.renderSettingsTab === 'function') {
          window.renderSettingsTab(mainContent);
        } else {
          console.error('renderSettingsTab 함수를 찾을 수 없습니다.');
        }
      }
    });
  });
  
  // 월 선택 버튼 (dashboard와 accounts 탭에서만 동작)
  document.getElementById('prev-month')?.addEventListener('click', function() {
    // dashboard 또는 accounts 탭에서만 동작
    if (window.currentActiveTab !== 'dashboard' && window.currentActiveTab !== 'accounts') {
      return;
    }
    
    curMonth--;
    if (curMonth < 1) {
      curMonth = 12;
      curYear--;
    }
    updateMonthText();
    updateDashboard();
    
    // 대시보드가 열려있으면 테이블도 업데이트
    if (window.currentActiveTab === 'dashboard') {
      if (typeof renderTable === 'function') {
        renderTable();
      }
      if (typeof renderCardTable === 'function') {
        renderCardTable('all');
      }
      if (typeof renderBankTable === 'function') {
        renderBankTable();
      }
    } else if (window.currentActiveTab === 'accounts') {
      // 계좌 관리 탭인 경우 계좌 테이블 갱신
      if (typeof renderAccountTransactionTable === 'function') {
        const accountSelect = document.getElementById('account-filter-select');
        const selectedAccount = accountSelect ? accountSelect.value : 'all';
        renderAccountTransactionTable(selectedAccount);
      }
    }
  });
  
  document.getElementById('next-month')?.addEventListener('click', function() {
    // dashboard 또는 accounts 탭에서만 동작
    if (window.currentActiveTab !== 'dashboard' && window.currentActiveTab !== 'accounts') {
      return;
    }
    
    curMonth++;
    if (curMonth > 12) {
      curMonth = 1;
      curYear++;
    }
    updateMonthText();
    updateDashboard();
    
    // 대시보드가 열려있으면 테이블도 업데이트
    if (window.currentActiveTab === 'dashboard') {
      if (typeof renderTable === 'function') {
        renderTable();
      }
      if (typeof renderCardTable === 'function') {
        renderCardTable('all');
      }
      if (typeof renderBankTable === 'function') {
        renderBankTable();
      }
    } else if (window.currentActiveTab === 'accounts') {
      // 계좌 관리 탭인 경우 계좌 테이블 갱신
      if (typeof renderAccountTransactionTable === 'function') {
        const accountSelect = document.getElementById('account-filter-select');
        const selectedAccount = accountSelect ? accountSelect.value : 'all';
        renderAccountTransactionTable(selectedAccount);
      }
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
    
    if (window.currentActiveTab === 'dashboard' || window.currentActiveTab === 'accounts' || window.currentActiveTab === 'cards' || window.currentActiveTab === 'saving') {
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
          
          // 3. 해당 탭의 모달 열기 (탭 렌더링 완료 대기)
          // requestAnimationFrame을 사용하여 DOM 업데이트 완료 후 모달 열기
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              // 추가로 짧은 딜레이를 두어 모든 이벤트 리스너가 등록되도록 함
              setTimeout(() => {
                if (targetTab === 'dashboard') {
                  if (typeof window.openModal === 'function') {
                    window.openModal(false);
                  } else if (typeof window.openTransactionModal === 'function') {
                    window.openTransactionModal();
                  } else {
                    console.error('대시보드 모달 열기 함수를 찾을 수 없습니다.');
                  }
                } else if (targetTab === 'accounts') {
                  if (typeof window.openAccountTransactionModal === 'function') {
                    window.openAccountTransactionModal();
                  } else {
                    console.error('계좌 관리 모달 열기 함수를 찾을 수 없습니다.');
                  }
                } else if (targetTab === 'cards') {
                  if (typeof window.openPaymentMethodModal === 'function') {
                    window.openPaymentMethodModal();
                  } else if (typeof window.openAccountModal === 'function') {
                    window.openAccountModal(false);
                  } else {
                    console.error('결제수단 관리 모달 열기 함수를 찾을 수 없습니다.');
                  }
                } else if (targetTab === 'saving') {
                  alert('저축 등록 기능은 추후 구현 예정입니다.');
                }
              }, 100);
            });
          });
        } else {
          console.error(`탭 버튼을 찾을 수 없습니다: ${targetTab}`);
        }
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
  
  // 초기 연/월 표시 설정 (dashboard는 표시)
  const monthBar = document.querySelector('.month-bar');
  if (monthBar && window.currentActiveTab === 'dashboard') {
    monthBar.style.display = 'flex';
  }
  
  console.log('앱 초기화 완료');
});

console.log('app.js 로드 완료');

