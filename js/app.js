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
      
      // FAB 버튼 표시/숨김
      const fabBtn = document.getElementById('fab-btn');
      if (fabBtn) {
        if (tabKey === 'dashboard' || tabKey === 'accounts' || tabKey === 'saving') {
          // 월별현황, 계좌 관리, 저축관리 탭에서는 FAB 버튼 표시
          fabBtn.style.display = 'flex';
        } else {
          // 다른 탭에서는 숨김
          fabBtn.style.display = 'none';
        }
        // FAB 버튼 툴팁 업데이트
        if (typeof window.updateFabTooltip === 'function') {
          window.updateFabTooltip();
        }
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
  
  // FAB 버튼 (rollback.html에서 복원)
  const fabBtn = document.getElementById('fab-btn');
  
  // FAB 버튼 툴팁 업데이트 함수 (전역으로 노출)
  window.updateFabTooltip = function() {
    if (!fabBtn) return;
    
    if (currentActiveTab === 'accounts') {
      fabBtn.title = '계좌 입출금 내역 추가';
    } else {
      fabBtn.title = '거래 내역 입력';
    }
  };
  
  if (fabBtn) {
    fabBtn.addEventListener('click', function() {
      const modalTitle = document.querySelector('.modal-title');
      const methodSelect = document.getElementById('entry-method');
      
      if (currentActiveTab === 'accounts') {
        // 계좌 관리 탭: 계좌 입출금 내역 추가 모달 열기
        if (modalTitle) {
          modalTitle.textContent = '💰 계좌 입출금 내역 추가';
        }
        if (typeof openModal === 'function') {
          openModal(false);
        }
        // 결제수단을 계좌이체로 설정
        if (methodSelect) {
          methodSelect.value = 'transfer';
          if (typeof updatePaymentFields === 'function') {
            updatePaymentFields();
          }
        }
      } else if (currentActiveTab === 'dashboard') {
        // 월별현황: 내역 입력 모달 열기
        if (typeof openModal === 'function') {
          openModal(false);
        }
      } else if (currentActiveTab === 'saving') {
        // 저축관리: 저축 목표 추가 (추후 구현)
        alert('저축 목표 추가 기능은 추후 구현 예정입니다.');
      } else {
        // 기타 탭: 기본 내역 입력 모달 열기
        if (typeof openModal === 'function') {
          openModal(false);
        }
      }
    });
    
    // 초기 FAB 툴팁 설정
    window.updateFabTooltip();
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

