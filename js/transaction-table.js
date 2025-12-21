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

    // 컬럼 정의
    columns: [
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
      <div class="table-responsive">
        <table class="table table-hover table-striped align-middle" id="transaction-table">
          <thead class="table-light">
            <tr>
              ${this.columns.map(col => `
                <th style="width: ${col.width}; cursor: ${col.sortable ? 'pointer' : 'default'};"
                    ${col.sortable ? `onclick="TransactionTable.toggleSort('${col.key}')"` : ''}>
                  ${col.label}
                  ${col.sortable && this.sortColumn === col.key ?
                (this.sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
    `;

        // 고정 거래 섹션
        if (fixedTx.length > 0) {
            html += `
        <tr class="table-secondary">
          <td colspan="${this.columns.length}" class="fw-bold">🔄 고정 거래</td>
        </tr>
      `;
            fixedTx.forEach((tx, idx) => {
                html += this.renderRow(tx, idx + 1);
            });
        }

        // 변동 거래 섹션
        if (variableTx.length > 0) {
            html += `
        <tr class="table-secondary">
          <td colspan="${this.columns.length}" class="fw-bold">📊 변동 거래</td>
        </tr>
      `;
            variableTx.forEach((tx, idx) => {
                html += this.renderRow(tx, fixedTx.length + idx + 1);
            });
        }

        // 데이터 없음
        if (data.length === 0) {
            html += `
        <tr>
          <td colspan="${this.columns.length}" class="text-center text-muted py-5">
            등록된 거래가 없습니다.
          </td>
        </tr>
      `;
        }

        html += `
          </tbody>
        </table>
      </div>
    `;

        container.innerHTML = html;
    },

    // 행 렌더링
    renderRow: function (tx, idx) {
        const typeClass = tx.type === 'income' ? 'text-success' : 'text-danger';
        const typeText = tx.type === 'income' ? '수입' : '지출';
        const amount = (tx.amount || 0).toLocaleString();

        return `
      <tr data-id="${tx.id}">
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
          <button class="btn btn-sm btn-outline-primary me-1" onclick="TransactionTable.editRow(${tx.id})">수정</button>
          <button class="btn btn-sm btn-outline-danger" onclick="TransactionTable.deleteRow(${tx.id})">삭제</button>
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
        }
    },

    // 행 삭제
    deleteRow: function (id) {
        if (!confirm('이 거래를 삭제하시겠습니까?')) return;

        if (typeof TransactionModal !== 'undefined') {
            const success = TransactionModal.deleteTransaction(id, this.currentYear, this.currentMonth);
            if (success) {
                this.render();
                if (typeof MonthlySummary !== 'undefined') {
                    MonthlySummary.update();
                }
                alert('거래가 삭제되었습니다.');
            }
        }
    },

    // 초기화
    init: function () {
        console.log('TransactionTable 초기화');
        this.render();
    }
};

// window 객체에 할당
if (typeof window !== 'undefined') {
    window.TransactionTable = TransactionTable;
}

console.log('transaction-table.js 로드 완료');
