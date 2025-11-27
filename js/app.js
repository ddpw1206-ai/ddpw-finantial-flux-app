// ========================================
// 메인 초기화 및 이벤트
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('앱 시작 - 버전:', APP_VERSION);
  
  // 버전 표시
  const versionEl = document.querySelector('.version');
  if (versionEl) versionEl.textContent = `V.${APP_VERSION}`;
  
  // 데이터 로드 (localStorage에서 먼저 로드)
  loadData();
  loadAccountData();
  loadMerchantHistory();
  loadCardData();
  loadCardParsingTemplates();
  loadAccountCardPayments(); // 계좌 카드 대금 내역 로드
  
  // 자동 불러오기 로직 제거 (16번 QA: 수동 제어로 변경)
  // initializeFolderData() 함수는 제거되었고, 사용자가 명시적으로 불러오기 버튼을 눌렀을 때만 동기화됩니다.
  
  // 탭 전환 이벤트 (완전 독립 렌더링, 오류 방지 강화)
  const tabButtons = document.querySelectorAll('.nav-tab');
  
  // 탭 전환 핸들러 함수 (중복 등록 방지)
  const handleTabSwitch = function(tabKey) {
    // 1. 유효성 검사
    if (!tabKey) {
      console.error('탭 키가 없습니다.');
      return;
    }
    
    // 2. mainContent 확인
    const mainContent = document.getElementById('main-content');
    if (!mainContent) {
      console.error('main-content 요소를 찾을 수 없습니다.');
      return;
    }
    
    // 3. 이전 탭의 모든 이벤트 리스너 정리 (필요시)
    // mainContent의 모든 자식 요소 제거로 자동 정리됨
    
    // 4. mainContent 완전히 비우기
    try {
      mainContent.innerHTML = '';
    } catch (error) {
      console.error('mainContent 초기화 오류:', error);
      return;
    }
    
    console.log('탭 전환:', tabKey);
    
    // 5. 연/월 표시 제어 (dashboard와 accounts만 표시)
    const monthBar = document.querySelector('.month-bar');
    if (monthBar) {
      if (tabKey === 'dashboard' || tabKey === 'accounts') {
        monthBar.style.display = 'flex';
      } else {
        monthBar.style.display = 'none';
      }
    }
    
    // 6. FAB 버튼 상태 업데이트
    if (typeof window.updateFabButton === 'function') {
      try {
        window.updateFabButton();
      } catch (error) {
        console.error('updateFabButton 오류:', error);
      }
    }
    
    // 7. 탭별 독립적인 렌더링 함수 호출 (window 객체를 통해 호출)
    // requestAnimationFrame을 사용하여 DOM 업데이트 완료 후 렌더링
    requestAnimationFrame(() => {
      try {
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
        } else {
          console.warn('알 수 없는 탭 키:', tabKey);
        }
      } catch (error) {
        console.error('탭 렌더링 오류:', error);
      }
    });
  };
  
  // 탭 버튼에 이벤트 리스너 등록 (중복 방지)
  tabButtons.forEach(btn => {
    // 기존 이벤트 리스너 제거 (중복 방지)
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    
    newBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // 모든 탭 버튼을 다시 쿼리 (최신 상태 보장)
      const allTabButtons = document.querySelectorAll('.nav-tab');
      
      // 1. 모든 탭의 active 클래스 제거 및 스타일 초기화
      allTabButtons.forEach(b => {
        b.classList.remove('active');
        // 인라인 스타일도 모두 제거하여 CSS 기본값으로 복원
        b.style.color = '';
        b.style.fontWeight = '';
        b.style.borderBottom = '';
        b.style.borderBottomColor = '';
        b.style.background = '';
      });
      
      // 2. 클릭한 탭만 활성화 (CSS 클래스만 사용, 인라인 스타일 제거)
      this.classList.add('active');
      
      const tabKey = this.getAttribute('data-tab');
      if (!tabKey) {
        console.error('탭 버튼에 data-tab 속성이 없습니다.');
        return;
      }
      
      window.currentActiveTab = tabKey;
      
      console.log('탭 전환:', tabKey, '활성화된 탭:', this.textContent);
      
      // 탭 전환 핸들러 호출
      handleTabSwitch(tabKey);
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
          // 모든 탭의 active 클래스 제거 및 스타일 초기화
          const allTabButtons = document.querySelectorAll('.nav-tab');
          allTabButtons.forEach(b => {
            b.classList.remove('active');
            b.style.color = '';
            b.style.fontWeight = '';
            b.style.borderBottom = '';
            b.style.borderBottomColor = '';
            b.style.background = '';
          });
          
          // 선택한 탭만 활성화
          tabButton.classList.add('active');
          
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
  
  // 초기 로드 시 탭 활성화 상태 정리 (모든 탭의 인라인 스타일 제거)
  const initialTabButtons = document.querySelectorAll('.nav-tab');
  initialTabButtons.forEach(btn => {
    // active 클래스가 없는 탭은 스타일 초기화
    if (!btn.classList.contains('active')) {
      btn.style.color = '';
      btn.style.fontWeight = '';
      btn.style.borderBottom = '';
      btn.style.borderBottomColor = '';
      btn.style.background = '';
    }
  });
  
  // 초기 활성 탭 설정
  window.currentActiveTab = 'dashboard';
  
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
  
  // 저장/불러오기 버튼 이벤트 리스너 (16번 QA: 수동 제어)
  const saveDataBtn = document.getElementById('save-data-btn');
  const loadDataBtn = document.getElementById('load-data-btn');
  
  if (saveDataBtn) {
    saveDataBtn.addEventListener('click', async function() {
      const folderHandle = window.dataFolderHandle || dataFolderHandle;
      if (!folderHandle) {
        alert('먼저 설정에서 저장 폴더를 선택해주세요.');
        return;
      }
      
      // localStorage의 모든 데이터를 폴더에 저장
      if (typeof window.saveDataToFolder === 'function') {
        const success = await window.saveDataToFolder();
        if (success) {
          // localStorage에도 저장 (동기화)
          if (typeof saveData === 'function') saveData();
          if (typeof saveAccountData === 'function') saveAccountData();
          if (typeof saveMerchantHistory === 'function') saveMerchantHistory();
          if (typeof saveCardData === 'function') saveCardData();
          alert('데이터가 성공적으로 저장되었습니다.');
        } else {
          alert('데이터 저장에 실패했습니다.');
        }
      } else {
        alert('저장 기능을 찾을 수 없습니다.');
      }
    });
  }
  
  if (loadDataBtn) {
    loadDataBtn.addEventListener('click', async function() {
      const folderHandle = window.dataFolderHandle || dataFolderHandle;
      if (!folderHandle) {
        alert('먼저 설정에서 저장 폴더를 선택해주세요.');
        return;
      }
      
      const shouldLoad = confirm('폴더에서 최신 데이터를 불러오시겠습니까?\n\n현재 데이터가 사라질 수 있습니다.');
      if (!shouldLoad) {
        return;
      }
      
      if (typeof window.loadDataFromFolder === 'function') {
        const loaded = await window.loadDataFromFolder();
        if (loaded) {
          // 파일에서 로드한 후 localStorage에 저장
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
          alert('불러올 데이터가 없습니다.');
        }
      } else {
        alert('불러오기 기능을 찾을 수 없습니다.');
      }
    });
  }
  
  console.log('앱 초기화 완료');
});

console.log('app.js 로드 완료');

