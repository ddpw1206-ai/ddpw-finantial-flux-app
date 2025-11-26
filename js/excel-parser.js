// ========================================
// 엑셀 파일 파싱 전용 모듈
// 리팩토링: index.html에서 분리 (2025-11-26)
// ========================================

// ========================================
// 유틸리티 함수들
// ========================================

/**
 * 날짜 문자열을 YYYY-MM-DD 형식으로 파싱
 */
function parseDate(value) {
  if (!value) return null;
  
  try {
    const str = String(value).trim();
    
    // YYYYMMDD 형식 (예: 20250101)
    if (/^\d{8}$/.test(str)) {
      const year = str.substring(0, 4);
      const month = str.substring(4, 6);
      const day = str.substring(6, 8);
      return `${year}-${month}-${day}`;
    }
    
    // YYYY-MM-DD, YYYY/MM/DD, YYYY.MM.DD 형식
    if (/^\d{4}[-/.]\d{1,2}[-/.]\d{1,2}$/.test(str)) {
      const parts = str.split(/[-/.]/);
      const year = parts[0];
      const month = parts[1].padStart(2, '0');
      const day = parts[2].padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    
    // MM/DD 형식 (현재 연도 가정)
    if (/^\d{1,2}\/\d{1,2}$/.test(str)) {
      const parts = str.split('/');
      const year = new Date().getFullYear();
      const month = parts[0].padStart(2, '0');
      const day = parts[1].padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    
    return null;
  } catch (error) {
    console.error('날짜 파싱 오류:', error);
    return null;
  }
}

/**
 * 금액 문자열/숫자를 파싱
 */
function parseAmount(value) {
  if (!value) return 0;
  const str = String(value).replace(/[^0-9.-]/g, '');
  const num = parseFloat(str);
  return isNaN(num) ? 0 : Math.abs(num);
}

/**
 * 엑셀 셀에서 금액 추출
 */
function parseAmountFromCell(value) {
  if (!value) return 0;
  // 숫자만 추출
  const numbers = String(value).replace(/[^0-9.-]/g, '');
  const amount = parseFloat(numbers);
  return isNaN(amount) ? 0 : Math.abs(amount);
}

// ========================================
// 카드사 감지
// ========================================

/**
 * 파일명과 데이터에서 카드사를 자동 감지
 */
function detectCardCompany(filename, data) {
  const lowerName = filename.toLowerCase();
  
  // 파일명에서 카드사 키워드 검색
  if (lowerName.includes('kb') || lowerName.includes('국민')) return 'KB카드';
  if (lowerName.includes('samsung') || lowerName.includes('삼성')) return '삼성카드';
  if (lowerName.includes('shinhan') || lowerName.includes('신한')) return '신한카드';
  if (lowerName.includes('hyundai') || lowerName.includes('현대')) return '현대카드';
  if (lowerName.includes('lotte') || lowerName.includes('롯데')) return '롯데카드';
  if (lowerName.includes('hana') || lowerName.includes('하나')) return '하나카드';
  if (lowerName.includes('woori') || lowerName.includes('우리')) return '우리카드';
  if (lowerName.includes('nh') || lowerName.includes('농협')) return 'NH카드';
  if (lowerName.includes('kakao') || lowerName.includes('카카오')) return '카카오뱅크';
  
  // 데이터 헤더에서 카드사 키워드 검색 (상위 5행 검색)
  const headerRows = data.slice(0, 5);
  for (const row of headerRows) {
    const rowText = row.join(' ').toLowerCase();
    if (rowText.includes('kb') || rowText.includes('국민')) return 'KB카드';
    if (rowText.includes('samsung') || rowText.includes('삼성')) return '삼성카드';
    if (rowText.includes('shinhan') || rowText.includes('신한')) return '신한카드';
    if (rowText.includes('hyundai') || rowText.includes('현대')) return '현대카드';
  }
  
  return '알 수 없음';
}

// ========================================
// KB카드 전용 파서
// ========================================

function parseKBCard(data) {
  console.log('KB카드 파싱 시작, 전체 행:', data.length);
  
  const transactions = [];
  let dateColIdx = -1;
  let merchantColIdx = -1;
  let amountColIdx = -1;
  
  // 헤더 행 찾기 (첫 10행 내에서)
  for (let i = 0; i < Math.min(data.length, 10); i++) {
    const row = data[i];
    row.forEach((cell, idx) => {
      const cellStr = String(cell).trim().toLowerCase();
      if (cellStr.includes('이용일') || cellStr.includes('거래일') || cellStr.includes('승인일')) dateColIdx = idx;
      if (cellStr.includes('가맹점') || cellStr.includes('이용처') || cellStr.includes('사용처')) merchantColIdx = idx;
      if (cellStr.includes('이용금액') || cellStr.includes('금액') || cellStr.includes('승인금액')) amountColIdx = idx;
    });
    if (dateColIdx >= 0 && merchantColIdx >= 0 && amountColIdx >= 0) break;
  }
  
  console.log('컬럼 인덱스:', { dateColIdx, merchantColIdx, amountColIdx });
  
  if (dateColIdx < 0 || merchantColIdx < 0 || amountColIdx < 0) {
    console.warn('필수 컬럼을 찾을 수 없습니다. 범용 파싱 사용 권장');
    return parseGenericCard(data);
  }
  
  // 데이터 행 파싱
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;
    
    const date = parseDate(row[dateColIdx]);
    const merchant = String(row[merchantColIdx] || '').trim();
    const amount = parseAmountFromCell(row[amountColIdx]);
    
    if (date && merchant && amount > 0) {
      transactions.push({ date, merchant, amount });
    }
  }
  
  console.log('KB카드 파싱 완료, 거래 건수:', transactions.length);
  
  return {
    cardCompany: 'KB카드',
    transactions: transactions,
    summary: {
      totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
      finalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
      discount: 0,
      billingPeriod: { start: null, end: null },
      paymentDate: null
    },
    totalCount: transactions.length
  };
}

// ========================================
// 삼성카드 전용 파서
// ========================================

function parseSamsungCard(data) {
  console.log('삼성카드 파싱 시작');
  // KB카드와 유사한 로직
  return parseGenericCard(data);
}

// ========================================
// 범용 파서 (자동 감지)
// ========================================

function parseGenericCard(data) {
  console.log('범용 파싱 시작, 전체 행:', data.length);
  
  const transactions = [];
  let dateColIdx = -1;
  let merchantColIdx = -1;
  let amountColIdx = -1;
  
  // 헤더 행 찾기
  for (let i = 0; i < Math.min(data.length, 15); i++) {
    const row = data[i];
    row.forEach((cell, idx) => {
      const cellStr = String(cell).trim().toLowerCase();
      // 날짜 컬럼
      if ((cellStr.includes('일') || cellStr.includes('date')) && !cellStr.includes('금') && dateColIdx < 0) {
        dateColIdx = idx;
      }
      // 가맹점 컬럼
      if ((cellStr.includes('가맹점') || cellStr.includes('이용처') || cellStr.includes('사용처') || cellStr.includes('상호')) && merchantColIdx < 0) {
        merchantColIdx = idx;
      }
      // 금액 컬럼
      if ((cellStr.includes('금액') || cellStr.includes('amount')) && !cellStr.includes('할부') && amountColIdx < 0) {
        amountColIdx = idx;
      }
    });
    if (dateColIdx >= 0 && merchantColIdx >= 0 && amountColIdx >= 0) break;
  }
  
  console.log('자동 감지된 컬럼:', { dateColIdx, merchantColIdx, amountColIdx });
  
  if (dateColIdx < 0 || merchantColIdx < 0 || amountColIdx < 0) {
    throw new Error('필수 컬럼(날짜, 가맹점, 금액)을 찾을 수 없습니다.');
  }
  
  // 데이터 행 파싱
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;
    
    const date = parseDate(row[dateColIdx]);
    const merchant = String(row[merchantColIdx] || '').trim();
    const amount = parseAmountFromCell(row[amountColIdx]);
    
    if (date && merchant && amount > 0) {
      transactions.push({ date, merchant, amount });
    }
  }
  
  console.log('범용 파싱 완료, 거래 건수:', transactions.length);
  
  return {
    cardCompany: '알 수 없음',
    transactions: transactions,
    summary: {
      totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
      finalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
      discount: 0,
      billingPeriod: { start: null, end: null },
      paymentDate: null
    },
    totalCount: transactions.length
  };
}

// ========================================
// 메인 엑셀 파싱 함수
// ========================================

/**
 * 엑셀 파일을 읽고 카드 명세서 데이터를 파싱
 * @param {File} file - 업로드된 엑셀 파일
 * @param {String|null} forceCardCompany - 강제 지정할 카드사 (선택)
 * @returns {Promise} 파싱 결과
 */
window.parseCardStatement = function(file, forceCardCompany = null) {
  console.log('parseCardStatement 함수 호출됨, 파일:', file.name);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      try {
        console.log('파일 읽기 완료, 파싱 시작');
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // 첫 번째 시트 선택
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // JSON으로 변환
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
        console.log('JSON 변환 완료, 행 개수:', jsonData.length);
        
        // 카드사 감지 또는 강제 지정
        let selectedCardCompany = forceCardCompany;
        
        if (!selectedCardCompany) {
          // 사용자가 선택한 카드사 가져오기
          const cardCompanySelect = document.getElementById('card-payment-card-company-select');
          selectedCardCompany = cardCompanySelect ? cardCompanySelect.value : '';
        }
        
        // 카드사가 없으면 자동 감지
        if (!selectedCardCompany) {
          selectedCardCompany = detectCardCompany(file.name, jsonData);
          console.log('자동 감지된 카드사:', selectedCardCompany);
        }
        
        // 카드사별 파싱 로직 선택
        let parsedData;
        if (selectedCardCompany === 'KB카드') {
          console.log('KB카드 파싱 시작');
          parsedData = parseKBCard(jsonData);
        } else if (selectedCardCompany === '삼성카드') {
          console.log('삼성카드 파싱 시작');
          parsedData = parseSamsungCard(jsonData);
        } else {
          console.log('범용 파싱 시작');
          parsedData = parseGenericCard(jsonData);
        }
        
        // 감지된 카드사로 설정
        parsedData.cardCompany = selectedCardCompany;
        console.log('파싱 완료, 거래 건수:', parsedData.totalCount);
        
        resolve(parsedData);
      } catch (error) {
        console.error('파싱 중 오류:', error);
        reject(error);
      }
    };
    
    reader.onerror = function(error) {
      console.error('파일 읽기 오류:', error);
      reject(error);
    };
    
    reader.readAsArrayBuffer(file);
  });
};

console.log('excel-parser.js 로드 완료');

