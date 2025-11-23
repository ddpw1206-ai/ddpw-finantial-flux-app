// ========================================
// 카드 결제 대금 교차 검증 기능
// ========================================

// 카드 결제 대금 교차 검증 함수
function verifyCardPayments(year, month) {
  const results = [];
  
  // accountData에서 카드 계정 추출
  if (typeof accountData === 'undefined' || !Array.isArray(accountData)) {
    console.error('accountData가 정의되지 않았습니다.');
    return results;
  }
  
  const cardAccounts = accountData.filter(acc => acc.type === 'card' && acc.creditLimit);
  
  cardAccounts.forEach(card => {
    if (!card.linkedAccount || !card.paymentDay) return;
    
    // 해당 월 카드 사용 총액 계산
    if (typeof transactionData === 'undefined' || !Array.isArray(transactionData)) {
      console.error('transactionData가 정의되지 않았습니다.');
      return;
    }
    
    const cardTransactions = transactionData.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getFullYear() === year 
        && tDate.getMonth() + 1 === month
        && t.paymentMethod === 'credit'
        && t.paymentDetail === card.name;
    });
    
    const totalCardUsage = cardTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    // 명세서 결제일에 통장에서 빠져나간 금액 찾기
    const paymentDate = new Date(year, month - 1, card.paymentDay);
    const paymentDateStr = paymentDate.toISOString().split('T')[0];
    
    const accountPayment = transactionData.find(t => {
      return t.date === paymentDateStr
        && t.paymentDetail === card.linkedAccount
        && (t.item === '카드대금' || t.item.includes('카드') || t.item.includes(card.name))
        && (t.category === '카드대금' || t.category.includes('결제'));
    });
    
    const paidAmount = accountPayment ? accountPayment.amount : 0;
    
    results.push({
      cardName: card.name,
      linkedAccount: card.linkedAccount,
      paymentDay: card.paymentDay,
      totalUsage: totalCardUsage,
      paidAmount: paidAmount,
      difference: totalCardUsage - paidAmount,
      status: totalCardUsage === paidAmount ? '일치' : '불일치',
      paymentDate: paymentDateStr
    });
  });
  
  return results;
}

// 검증 결과 표시 함수 (전역으로 노출)
window.displayVerificationResults = function(results) {
  const container = document.getElementById('verification-results');
  if (!container) return;
  
  if (results.length === 0) {
    container.innerHTML = '<div style="text-align: center; padding: 20px; color: #6B7280;">검증할 카드가 없습니다.</div>';
    return;
  }
  
  let tableHTML = `
    <div class="expense-table-container">
      <table class="expense-table" aria-label="카드 결제 검증 결과">
        <thead>
          <tr>
            <th>카드명</th>
            <th>연결계좌</th>
            <th>결제일</th>
            <th>카드 사용액</th>
            <th>결제 금액</th>
            <th>차이</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  results.forEach(result => {
    const statusColor = result.status === '일치' ? '#14BD5A' : '#EF4444';
    const differenceColor = result.difference === 0 ? '#14BD5A' : '#EF4444';
    const differenceStr = result.difference > 0 
      ? `+${result.difference.toLocaleString()}원` 
      : `${result.difference.toLocaleString()}원`;
    
    tableHTML += `
      <tr>
        <td>${result.cardName}</td>
        <td>${result.linkedAccount}</td>
        <td>${result.paymentDay}일</td>
        <td>${result.totalUsage.toLocaleString()}원</td>
        <td>${result.paidAmount.toLocaleString()}원</td>
        <td style="color: ${differenceColor}; font-weight: 600;">${differenceStr}</td>
        <td style="color: ${statusColor}; font-weight: 600;">${result.status}</td>
      </tr>
    `;
  });
  
  tableHTML += `
        </tbody>
      </table>
    </div>
  `;
  
  container.innerHTML = tableHTML;
};

// 검증 실행 함수 (전역으로 노출)
window.runVerification = function() {
  const yearSelect = document.getElementById('verification-year-select');
  const monthSelect = document.getElementById('verification-month-select');
  
  if (!yearSelect || !monthSelect) {
    alert('연도와 월을 선택해주세요.');
    return;
  }
  
  const year = parseInt(yearSelect.value);
  const month = parseInt(monthSelect.value);
  
  if (!year || !month) {
    alert('연도와 월을 선택해주세요.');
    return;
  }
  
  const results = verifyCardPayments(year, month);
  window.displayVerificationResults(results);
};

console.log('verification.js 로드 완료');

