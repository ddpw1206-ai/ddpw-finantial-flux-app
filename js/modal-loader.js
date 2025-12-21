// ========================================
// 모달 동적 로더 (Modal Dynamic Loader)
// ========================================

(function () {
    'use strict';

    // 로드할 모달 파일 목록
    const modalFiles = [
        'modals.html',
        'modals/settings-modal.html',
        'modals/transaction-modal.html'
    ];

    // 모달 컨테이너
    const container = document.getElementById('modals-container');

    if (!container) {
        console.error('modals-container를 찾을 수 없습니다.');
        return;
    }

    // 모든 모달 파일 로드
    let loadedCount = 0;

    modalFiles.forEach(file => {
        fetch(file)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${file}: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                // 모달 HTML을 컨테이너에 추가
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                container.appendChild(tempDiv);

                loadedCount++;
                console.log(`✓ 모달 로드 완료: ${file}`);

                // 모든 모달이 로드되면 초기화 함수 호출
                if (loadedCount === modalFiles.length) {
                    initializeModals();
                }
            })
            .catch(error => {
                console.error(`✗ 모달 로드 실패: ${file}`, error);
            });
    });

    // 모달 초기화 함수
    function initializeModals() {
        console.log('모든 모달 로드 완료 - 초기화 시작');

        // 각 모달의 초기화 함수 호출
        if (typeof window.initMonthlyEntryModal === 'function') {
            window.initMonthlyEntryModal();
        }
        if (typeof window.initMerchantManageModal === 'function') {
            window.initMerchantManageModal();
        }
        if (typeof window.initAccountModal === 'function') {
            window.initAccountModal();
        }
        if (typeof window.initAccountTransactionModal === 'function') {
            window.initAccountTransactionModal();
        }
        if (typeof window.initCardManageModal === 'function') {
            window.initCardManageModal();
        }
        if (typeof window.initCardPaymentModal === 'function') {
            window.initCardPaymentModal();
        }
        if (typeof window.initSettingsModal === 'function') {
            window.initSettingsModal();
        }

        console.log('모달 초기화 완료');
    }
})();
