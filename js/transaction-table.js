// ========================================
// 거래 테이블 렌더링 (Transaction Table)
// ========================================

const TransactionTable = {
  // 현재 정렬 상태
  sortColumn: 'date',
  sortOrder: 'desc',

  // 현재 연월
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth() + 1,

  // 테이블 컨테이너 ID
  containerId: 'transaction-table-container',

  // 선택된 항목 IDs
  selectedIds: new Set(),

  // 컬럼 정의 (체크박스 추가)
  columns: [
    { key: 'checkbox', label: '<input type="checkbox" id="select-all-checkbox" onchange="TransactionTable.toggleSelectAll(this)">', sortable: false, width: '40px' },
    { key: 'no', label: 'NO', sortable: false, width: '50px' },
    { key: 'date', label: '날짜', sortable: true, width: '100px' },
    { key: 'user', label: '사용자', sortable: true, width: '70px' },
    { key: 'type', label: '구분', sortable: true, width: '60px' },
    { key: 'mainCategory', label: '대분류', sortable: true, width: '100px' },
    { key: 'subCategory', label: '소분류', sortable: true, width: '100px' },
    { key: 'merchant', label: '사용처', sortable: true, width: '150px' },
    { key: 'amount', label: '금액', sortable: true, width: '120px' },
    { key: 'paymentDetail', label: '결제수단', sortable: true, width: '150px' },
    { key: 'actions', label: '작업', sortable: false, width: '100px' }
  ],

  // 현재 연월 설정
  setMonth: function (year, month) {
    this.currentYear = year;
    this.currentMonth = month;
    this.selectedIds.clear();
    this.render();
  },

  // 거래 목록 가져오기
  getTransactions: function () {
    if (typeof TransactionModal !== 'undefined') {
      return TransactionModal.getTransactions(this.currentYear, this.currentMonth);
    }
    return [];
  },

  // 정렬
  sortData: function (data) {
    const col = this.sortColumn;
    const order = this.sortOrder;

    return [...data].sort((a, b) => {
      let valA = a[col];
      let valB = b[col];

      // 날짜 정렬
      if (col === 'date') {
        valA = new Date(valA);
        valB = new Date(valB);
      }

      // 금액 정렬
      if (col === 'amount') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      }

      // 문자열 정렬
      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });
  },

  // 정렬 토글
  toggleSort: function (column) {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
    this.render();
  },

  // 전체 선택 토글
  toggleSelectAll: function (checkbox) {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    checkboxes.forEach(cb => {
      cb.checked = checkbox.checked;
      const id = cb.dataset.id;
      if (checkbox.checked) {
        this.selectedIds.add(id);
      } else {
        this.selectedIds.delete(id);
      }
    });
    this.updateBulkDeleteButton();
  },

  // 행 체크박스 토글
  toggleRowSelect: function (checkbox, id) {
    if (checkbox.checked) {
      this.selectedIds.add(id);
    } else {
      this.selectedIds.delete(id);
    }
    this.updateSelectAllCheckbox();
    this.updateBulkDeleteButton();
  },

  // 전체 선택 체크박스 상태 업데이트
  updateSelectAllCheckbox: function () {
    const allCheckbox = document.getElementById('select-all-checkbox');
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');
    if (allCheckbox && rowCheckboxes.length > 0) {
      allCheckbox.checked = [...rowCheckboxes].every(cb => cb.checked);
    }
  },

  // 일괄 삭제 버튼 상태 업데이트
  updateBulkDeleteButton: function () {
    const btn = document.getElementById('bulk-delete-btn');
    if (btn) {
      btn.disabled = this.selectedIds.size === 0;
      btn.textContent = this.selectedIds.size > 0
        ? `선택 삭제 (${this.selectedIds.size}개)`
        : '선택 삭제';
    }
  },

  // 선택 항목 일괄 삭제
  deleteSelected: function () {
    if (this.selectedIds.size === 0) {
      alert('삭제할 항목을 선택해주세요.');
      return;
    }

    if (!confirm(`선택한 ${this.selectedIds.size}개의 거래를 삭제하시겠습니까?`)) {
      return;
    }

    let successCount = 0;
    this.selectedIds.forEach(id => {
      if (typeof TransactionModal !== 'undefined') {
        const success = TransactionModal.deleteTransaction(id, this.currentYear, this.currentMonth);
        if (success) successCount++;
      }
    });

    this.selectedIds.clear();
    this.render();

    if (typeof MonthlySummary !== 'undefined') {
      MonthlySummary.update();
    }

    alert(`${successCount}개의 거래가 삭제되었습니다.`);
  },

  // 테이블 렌더링
  render: function (filteredData = null) {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.warn('Transaction table container not found');
      return;
    }

    let data = filteredData || this.getTransactions();
    data = this.sortData(data);

    // 고정/변동 분리
    const fixedTx = data.filter(tx => tx.isFixed);
    const variableTx = data.filter(tx => !tx.isFixed);

    let html = `
      <div class="d-flex justify-content-between align-items-center mb-3">
        <span class="text-muted">총 ${data.length}건 (고정 ${fixedTx.length}, 변동 ${variableTx.length})</span>
        <button class="btn btn-danger btn-sm" id="bulk-delete-btn" onclick="TransactionTable.deleteSelected()" disabled>
          선택 삭제
        </button>
      </div>
    `;

    // 1. 고정 거래 테이블
    html += `
      <div class="mb-5">
        <h5 class="mb-3">📌 고정 지출/수입</h5>
        <div class="table-responsive">
          <table class="table table-hover table-bordered align-middle mb-0">
            <thead class="table-light">
              <tr>
                ${this.renderHeader()}
              </tr>
            </thead>
            <tbody>
              ${fixedTx.length > 0 ? fixedTx.map((tx, idx) => this.renderRow(tx, idx + 1)).join('') : `
                <tr><td colspan="${this.columns.length}" class="text-center py-4 text-muted">고정 거래가 없습니다.</td></tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // 2. 변동 거래 테이블
    html += `
      <div class="mb-4">
        <h5 class="mb-3">📌 변동 지출/수입</h5>
        <div class="table-responsive">
          <table class="table table-hover table-bordered align-middle mb-0">
            <thead class="table-light">
              <tr>
                ${this.renderHeader()}
              </tr>
            </thead>
            <tbody>
              ${variableTx.length > 0 ? variableTx.map((tx, idx) => this.renderRow(tx, idx + 1)).join('') : `
                <tr><td colspan="${this.columns.length}" class="text-center py-4 text-muted">변동 거래가 없습니다.</td></tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;

    container.innerHTML = html;
    this.updateBulkDeleteButton();
    this.updateSelectAllCheckbox();
  },

  // 헤더 렌더링 헬퍼
  renderHeader: function () {
    return this.columns.map(col => `
      <th style="width: ${col.width}; cursor: ${col.sortable ? 'pointer' : 'default'};"
          ${col.sortable ? `onclick="TransactionTable.toggleSort('${col.key}')"` : ''}>
        ${col.label}
        ${col.sortable && this.sortColumn === col.key ?
        (this.sortOrder === 'asc' ? '↑' : '↓') : ''}
      </th>
    `).join('');
  },

  // 행 렌더링
  renderRow: function (tx, idx) {
    const typeClass = tx.type === 'income' ? 'text-success' : 'text-danger';
    const typeText = tx.type === 'income' ? '수입' : '지출';
    const amount = (tx.amount || 0).toLocaleString();
    const isChecked = this.selectedIds.has(tx.id) ? 'checked' : '';

    return `
      <tr data-id="${tx.id}">
        <td>
          <input type="checkbox" class="form-check-input row-checkbox" 
                 data-id="${tx.id}" ${isChecked}
                 onchange="TransactionTable.toggleRowSelect(this, '${tx.id}')">
        </td>
        <td>${idx}</td>
        <td>${tx.date || '-'}</td>
        <td>${tx.user || '-'}</td>
        <td class="${typeClass} fw-bold">${typeText}</td>
        <td>${tx.mainCategory || '-'}</td>
        <td>${tx.subCategory || '-'}</td>
        <td>${tx.merchant || '-'}</td>
        <td class="text-end fw-bold ${typeClass}">${amount}원</td>
        <td>${tx.paymentDetail || '-'}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary me-1" onclick="TransactionTable.editRow('${tx.id}')">수정</button>
          <button class="btn btn-sm btn-outline-danger" onclick="TransactionTable.deleteRow('${tx.id}')">삭제</button>
        </td>
      </tr>
    `;
  },

  // 행 수정
  editRow: function (id) {
    const transactions = this.getTransactions();
    const tx = transactions.find(t => t.id === id);

    if (tx && typeof TransactionModal !== 'undefined') {
      TransactionModal.open(tx);
    } else {
      console.error('거래를 찾을 수 없습니다:', id);
    }
  },

  // 행 삭제
  deleteRow: function (id) {
    if (!confirm('이 거래를 삭제하시겠습니까?')) return;

    if (typeof TransactionModal !== 'undefined') {
      const success = TransactionModal.deleteTransaction(id, this.currentYear, this.currentMonth);
      if (success) {
        this.selectedIds.delete(id);
        this.render();
        if (typeof MonthlySummary !== 'undefined') {
          MonthlySummary.update();
        }
        alert('거래가 삭제되었습니다.');
      } else {
        alert('삭제에 실패했습니다.');
      }
    }
  },

  // 초기화
  init: function () {
    console.log('TransactionTable 초기화');
    this.selectedIds.clear();
    this.render();
  }
};

// window 객체에 할당
if (typeof window !== 'undefined') {
  window.TransactionTable = TransactionTable;
  window.renderTable = function () { TransactionTable.render(); };
}

console.log('transaction-table.js 로드 완료');
