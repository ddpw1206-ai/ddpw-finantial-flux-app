// ========================================
// 엑셀 파일 파싱 관련 함수
// ========================================

// 날짜 파싱 헬퍼 함수
function parseDate(value) {
    if (!value) return null;

    const str = String(value);

    // Excel 날짜 숫자 형식 (예: 45678)
    if (typeof value === 'number' && value > 25569) {
        // Excel 날짜는 1900-01-01부터의 일수
        const excelEpoch = new Date(1900, 0, 1);
        const date = new Date(excelEpoch.getTime() + (value - 1) * 24 * 60 * 60 * 1000);
        return date.toISOString().split('T')[0];
    }

    // 2025-11-23 형식
    if (/\d{4}[-./]\d{2}[-./]\d{2}/.test(str)) {
        return str.replace(/[./]/g, '-').substring(0, 10);
    }

    // 20251123 형식
    if (/^\d{8}$/.test(str)) {
        return str.substring(0, 4) + '-' + str.substring(4, 6) + '-' + str.substring(6, 8);
    }

    // 11/23 형식 (올해로 가정)
    if (/^\d{1,2}[/-]\d{1,2}$/.test(str)) {
        const parts = str.split(/[/-]/);
        const year = new Date().getFullYear();
        const month = parts[0].padStart(2, '0');
        const day = parts[1].padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    return null;
}

// 금액 파싱 헬퍼 함수
function parseAmountFromCell(value) {
    if (!value) return 0;

    const str = String(value).replace(/[^0-9.-]/g, '');
    const num = parseFloat(str);

    return isNaN(num) ? 0 : Math.abs(num);
}

// 카드사 감지 함수
function detectCardCompany(filename, data) {
    const name = filename.toLowerCase();

    // 파일명에서 카드사 감지 (더 다양한 패턴 지원)
    if (name.includes('kb') || name.includes('국민') || name.includes('kookmin')) {
        return 'KB카드';
    } else if (name.includes('samsung') || name.includes('삼성') || name.includes('samsungcard')) {
        return '삼성카드';
    } else if (name.includes('shinhan') || name.includes('신한')) {
        return '신한카드';
    } else if (name.includes('hyundai') || name.includes('현대')) {
        return '현대카드';
    } else if (name.includes('lotte') || name.includes('롯데')) {
        return '롯데카드';
    } else if (name.includes('hana') || name.includes('하나')) {
        return '하나카드';
    } else if (name.includes('woori') || name.includes('우리')) {
        return '우리카드';
    } else if (name.includes('nh') || name.includes('농협')) {
        return 'NH카드';
    }

    // 파일 내용에서 카드사 찾기 (더 넓은 범위 검색)
    const firstRows = data.slice(0, 15).flat().join(' ');
    const firstRowsLower = firstRows.toLowerCase();

    if (firstRowsLower.includes('kb') || firstRowsLower.includes('국민') || firstRowsLower.includes('kookmin')) {
        return 'KB카드';
    } else if (firstRowsLower.includes('삼성') || firstRowsLower.includes('samsung')) {
        return '삼성카드';
    } else if (firstRowsLower.includes('신한') || firstRowsLower.includes('shinhan')) {
        return '신한카드';
    } else if (firstRowsLower.includes('현대') || firstRowsLower.includes('hyundai')) {
        return '현대카드';
    } else if (firstRowsLower.includes('롯데') || firstRowsLower.includes('lotte')) {
        return '롯데카드';
    } else if (firstRowsLower.includes('하나') || firstRowsLower.includes('hana')) {
        return '하나카드';
    } else if (firstRowsLower.includes('우리') || firstRowsLower.includes('woori')) {
        return '우리카드';
    } else if (firstRowsLower.includes('nh') || firstRowsLower.includes('농협')) {
        return 'NH카드';
    }

    return '알 수 없음';
}

// KB카드 파싱 함수
function parseKBCard(data) {
    console.log('KB카드 파싱 시작, 데이터 행 수:', data.length);

    // 헤더 찾기 (더 유연하게)
    let headerRow = -1;
    for (let i = 0; i < Math.min(20, data.length); i++) {
        const row = data[i];
        if (!row || row.length === 0) continue;

        // 행의 모든 셀을 문자열로 변환하여 검색
        const rowText = row.map(cell => String(cell || '')).join(' ').toLowerCase();

        // 거래일, 승인일시, 이용일 중 하나라도 있으면 헤더로 인식
        if (rowText.includes('거래일') || rowText.includes('승인일시') || rowText.includes('이용일') ||
            rowText.includes('거래일자') || rowText.includes('승인일자')) {
            headerRow = i;
            console.log('헤더 행 발견:', i, '내용:', row);
            break;
        }
    }

    // 헤더를 못 찾은 경우, 날짜 패턴이 있는 첫 번째 행을 헤더로 시도
    if (headerRow === -1) {
        for (let i = 0; i < Math.min(10, data.length); i++) {
            const row = data[i];
            if (!row) continue;

            // 날짜 패턴이 있고, 숫자(금액)도 있는 행을 헤더 다음 행으로 간주
            let hasDate = false;
            let hasAmount = false;

            for (let cell of row) {
                const cellStr = String(cell || '');
                if (/\d{4}[-./]\d{1,2}[-./]\d{1,2}/.test(cellStr) || (typeof cell === 'number' && cell > 25569)) {
                    hasDate = true;
                }
                const amount = parseAmountFromCell(cell);
                if (amount > 1000) {
                    hasAmount = true;
                }
            }

            if (hasDate && hasAmount) {
                // 이 행이 데이터 행이므로, 이전 행이 헤더일 가능성
                if (i > 0) {
                    headerRow = i - 1;
                    console.log('추정 헤더 행:', headerRow);
                    break;
                }
            }
        }
    }

    if (headerRow === -1) {
        throw new Error('헤더를 찾을 수 없습니다. 파일 형식을 확인해주세요.');
    }

    const headers = data[headerRow];
    console.log('헤더:', headers);

    // 컬럼 찾기 (KB카드 파일 구조에 맞게)
    // KB카드 파일은 보통 "거래일", "가맹점명", "이용금액" 순서로 되어 있음
    let dateCol = -1, merchantCol = -1, amountCol = -1, installmentCol = -1;

    // 정확한 컬럼명 매칭 시도
    for (let i = 0; i < headers.length; i++) {
        const h = headers[i];
        if (!h) continue;
        const hStr = String(h).trim().toLowerCase();

        // 거래일 컬럼
        if (dateCol === -1 && (hStr === '거래일' || hStr === '거래일자' || hStr === '승인일시' ||
            hStr === '이용일' || hStr === '승인일자' || hStr.includes('일자'))) {
            dateCol = i;
        }
        // 가맹점명 컬럼
        else if (merchantCol === -1 && (hStr === '가맹점명' || hStr === '가맹점' ||
            hStr === '사용처' || hStr === '사용처명' || hStr === '상호' || hStr === '상호명' ||
            hStr.includes('가맹점') || hStr.includes('사용처'))) {
            merchantCol = i;
        }
        // 이용금액 컬럼
        else if (amountCol === -1 && (hStr === '이용금액' || hStr === '승인금액' ||
            hStr === '거래금액' || hStr === '금액' || hStr.includes('금액'))) {
            amountCol = i;
        }
        // 할부 컬럼
        else if (installmentCol === -1 && (hStr === '할부' || hStr === '할부개월' ||
            hStr.includes('할부') || hStr.includes('개월'))) {
            installmentCol = i;
        }
    }

    // 컬럼을 못 찾은 경우, findIndex로 재시도
    if (dateCol === -1) {
        dateCol = headers.findIndex(h => {
            if (!h) return false;
            const hStr = String(h).toLowerCase();
            return hStr.includes('거래일') || hStr.includes('승인일시') || hStr.includes('이용일') ||
                hStr.includes('거래일자') || hStr.includes('승인일자') || hStr.includes('일자');
        });
    }

    if (merchantCol === -1) {
        merchantCol = headers.findIndex(h => {
            if (!h) return false;
            const hStr = String(h).toLowerCase();
            return hStr.includes('가맹점') || hStr.includes('사용처') || hStr.includes('상호') ||
                hStr.includes('가맹점명') || hStr.includes('사용처명') || hStr.includes('상호명');
        });
    }

    if (amountCol === -1) {
        amountCol = headers.findIndex(h => {
            if (!h) return false;
            const hStr = String(h).toLowerCase();
            return hStr.includes('이용금액') || hStr.includes('승인금액') || hStr.includes('거래금액') ||
                hStr.includes('금액') || hStr.includes('승인');
        });
    }

    if (installmentCol === -1) {
        installmentCol = headers.findIndex(h => {
            if (!h) return false;
            const hStr = String(h).toLowerCase();
            return hStr.includes('할부') || hStr.includes('개월') || hStr.includes('할부개월');
        });
    }

    console.log('컬럼 매핑:', { dateCol, merchantCol, amountCol, installmentCol });
    console.log('헤더 전체:', headers);

    // 거래 내역 추출
    const transactions = [];
    let dataEndRow = data.length;

    // 데이터 끝 행 찾기 (요약 정보가 시작되는 행 찾기)
    for (let i = headerRow + 1; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length === 0) continue;

        const rowText = row.map(cell => String(cell || '')).join(' ').toLowerCase();
        // 요약 정보가 시작되는 키워드 발견 시 데이터 끝으로 간주
        if (rowText.includes('합계') || rowText.includes('총') || rowText.includes('청구금액') ||
            rowText.includes('결제 예정금액') || rowText.includes('당월 이용금액') ||
            rowText.includes('청구기간') || rowText.includes('이용기간')) {
            // 이전 행까지가 데이터
            dataEndRow = i;
            break;
        }
    }

    for (let i = headerRow + 1; i < dataEndRow; i++) {
        const row = data[i];
        if (!row || row.length === 0) continue;

        // 빈 행 스킵 (모든 셀이 비어있거나 공백인 경우)
        const isEmpty = row.every(cell => !cell || String(cell).trim() === '');
        if (isEmpty) continue;

        // 날짜가 없으면 스킵
        if (dateCol >= 0 && (!row[dateCol] || String(row[dateCol]).trim() === '')) continue;

        const date = dateCol >= 0 ? parseDate(row[dateCol]) : null;
        const merchant = merchantCol >= 0 ? (row[merchantCol] || '').toString().trim() : '';
        const amount = amountCol >= 0 ? parseAmountFromCell(row[amountCol]) : 0;

        // 유효한 거래만 추가 (날짜와 금액이 모두 있어야 함)
        if (date && amount > 0 && merchant) {
            transactions.push({
                date: date,
                merchant: merchant,
                amount: amount,
                installment: installmentCol >= 0 ? (row[installmentCol] || '').toString().trim() : ''
            });
        }
    }

    console.log('추출된 거래 내역:', transactions.length, '건');

    // 요약 정보 추출 (파일 하단에서 찾기)
    let summary = {
        totalAmount: 0,
        discount: 0,
        finalAmount: 0,
        billingPeriod: { start: null, end: null },
        paymentDate: null
    };

    // 요약 정보 찾기 (전체 데이터에서 검색)
    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length === 0) continue;

        const rowText = row.map(cell => String(cell || '')).join(' ').toLowerCase();

        // 총 이용금액 찾기
        if ((rowText.includes('총 이용금액') || rowText.includes('당월 이용금액') ||
            rowText.includes('합계') || rowText.includes('총계')) && !summary.totalAmount) {
            // 마지막 컬럼 또는 숫자가 있는 컬럼에서 금액 찾기
            for (let j = row.length - 1; j >= 0; j--) {
                const amount = parseAmountFromCell(row[j]);
                if (amount > 0) {
                    summary.totalAmount = amount;
                    break;
                }
            }
        }

        // 할인/적립 찾기
        if ((rowText.includes('할인') || rowText.includes('적립') || rowText.includes('리워드')) && !summary.discount) {
            for (let j = row.length - 1; j >= 0; j--) {
                const amount = parseAmountFromCell(row[j]);
                if (amount > 0) {
                    summary.discount = amount;
                    break;
                }
            }
        }

        // 청구금액 찾기
        if ((rowText.includes('청구금액') || rowText.includes('결제 예정금액') ||
            rowText.includes('최종 청구금액') || rowText.includes('실제 결제금액')) && !summary.finalAmount) {
            for (let j = row.length - 1; j >= 0; j--) {
                const amount = parseAmountFromCell(row[j]);
                if (amount > 0) {
                    summary.finalAmount = amount;
                    break;
                }
            }
        }

        // 청구기간 찾기
        if (rowText.includes('청구기간') || rowText.includes('이용기간') || rowText.includes('거래기간')) {
            // 기간 추출 시도 (YYYY-MM-DD 형식)
            const periodMatch = rowText.match(/(\d{4}[-./]\d{1,2}[-./]\d{1,2})/g);
            if (periodMatch && periodMatch.length >= 2) {
                summary.billingPeriod.start = parseDate(periodMatch[0]);
                summary.billingPeriod.end = parseDate(periodMatch[1]);
            } else {
                // 행의 셀에서 날짜 찾기
                for (let cell of row) {
                    if (cell && /\d{4}[-./]\d{1,2}[-./]\d{1,2}/.test(String(cell))) {
                        if (!summary.billingPeriod.start) {
                            summary.billingPeriod.start = parseDate(cell);
                        } else if (!summary.billingPeriod.end) {
                            summary.billingPeriod.end = parseDate(cell);
                            break;
                        }
                    }
                }
            }
        }

        // 결제일 찾기
        if (rowText.includes('결제일') || rowText.includes('납부일') || rowText.includes('출금일')) {
            const dateMatch = rowText.match(/(\d{4}[-./]\d{1,2}[-./]\d{1,2})/);
            if (dateMatch) {
                summary.paymentDate = parseDate(dateMatch[0]);
            } else {
                // 행의 셀에서 날짜 찾기
                for (let cell of row) {
                    if (cell && /\d{4}[-./]\d{1,2}[-./]\d{1,2}/.test(String(cell))) {
                        summary.paymentDate = parseDate(cell);
                        break;
                    }
                }
            }
        }
    }

    // 거래 내역에서 기간 추출 (요약에서 못 찾은 경우)
    if (!summary.billingPeriod.start && transactions.length > 0) {
        const dates = transactions.map(t => new Date(t.date)).filter(d => !isNaN(d.getTime()));
        if (dates.length > 0) {
            dates.sort((a, b) => a - b);
            summary.billingPeriod.start = dates[0].toISOString().split('T')[0];
            summary.billingPeriod.end = dates[dates.length - 1].toISOString().split('T')[0];
        }
    }

    // 총 이용금액이 없으면 거래 합계로 계산
    if (!summary.totalAmount && transactions.length > 0) {
        summary.totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
    }

    // 최종 금액이 없으면 계산
    if (!summary.finalAmount) {
        if (summary.totalAmount) {
            summary.finalAmount = summary.totalAmount - (summary.discount || 0);
        } else if (transactions.length > 0) {
            summary.finalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
        }
    }

    console.log('요약 정보:', summary);

    return {
        cardCompany: 'KB카드',
        transactions: transactions,
        summary: summary,
        totalCount: transactions.length,
        columnMapping: {
            date: dateCol >= 0 ? headers[dateCol] : '',
            merchant: merchantCol >= 0 ? headers[merchantCol] : '',
            amount: amountCol >= 0 ? headers[amountCol] : '',
            installment: installmentCol >= 0 ? headers[installmentCol] : ''
        },
        headerRow: headerRow,
        dataStartRow: headerRow + 1
    };
}

// 삼성카드 파싱 함수
function parseSamsungCard(data) {
    // KB카드와 유사한 구조로 파싱 시도
    return parseKBCard(data);
}

// 범용 파싱 함수 (자동 감지)
function parseGenericCard(data) {
    // 날짜 패턴이 있는 행 찾기
    let dataStartRow = -1;
    for (let i = 0; i < Math.min(20, data.length); i++) {
        const row = data[i];
        if (!row) continue;

        for (let col of row) {
            if (col && (/\d{4}[-./]\d{2}[-./]\d{2}/.test(String(col)) || (typeof col === 'number' && col > 25569))) {
                dataStartRow = i;
                break;
            }
        }
        if (dataStartRow !== -1) break;
    }

    if (dataStartRow === -1) {
        throw new Error('거래 데이터를 찾을 수 없습니다');
    }

    // 컬럼 자동 감지
    const sampleRow = data[dataStartRow];
    let dateCol = -1, merchantCol = -1, amountCol = -1;

    for (let i = 0; i < sampleRow.length; i++) {
        const cell = sampleRow[i];
        if (!cell) continue;

        const cellStr = String(cell);

        // 날짜 컬럼
        if ((/\d{4}[-./]\d{2}[-./]\d{2}/.test(cellStr) || (typeof cell === 'number' && cell > 25569)) && dateCol === -1) {
            dateCol = i;
        }
        // 금액 컬럼 (숫자가 큰 컬럼)
        else if (!isNaN(parseAmountFromCell(cell)) && parseAmountFromCell(cell) > 100) {
            amountCol = i;
        }
        // 사용처 컬럼 (한글이 많은 컬럼)
        else if (/[가-힣]/.test(cellStr) && merchantCol === -1 && cellStr.length > 2) {
            merchantCol = i;
        }
    }

    // 거래 내역 추출
    const transactions = [];
    for (let i = dataStartRow; i < data.length; i++) {
        const row = data[i];
        if (!row || (dateCol >= 0 && !row[dateCol])) continue;

        const date = dateCol >= 0 ? parseDate(row[dateCol]) : null;
        const merchant = merchantCol >= 0 ? (row[merchantCol] || '').toString().trim() : '';
        const amount = amountCol >= 0 ? parseAmountFromCell(row[amountCol]) : 0;

        if (date && amount > 0) {
            transactions.push({
                date: date,
                merchant: merchant,
                amount: amount
            });
        }
    }

    // 거래 내역에서 기간 추출
    let billingPeriod = { start: null, end: null };
    if (transactions.length > 0) {
        const dates = transactions.map(t => new Date(t.date)).filter(d => !isNaN(d.getTime()));
        if (dates.length > 0) {
            dates.sort((a, b) => a - b);
            billingPeriod.start = dates[0].toISOString().split('T')[0];
            billingPeriod.end = dates[dates.length - 1].toISOString().split('T')[0];
        }
    }

    return {
        cardCompany: '알 수 없음',
        transactions: transactions,
        summary: {
            totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
            discount: 0,
            finalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
            billingPeriod: billingPeriod,
            paymentDate: null
        },
        totalCount: transactions.length
    };
}

// 엑셀 파일 읽기 및 파싱 메인 함수
window.parseCardStatement = function (file, forceCardCompany = null) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function (e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                // 첫 번째 시트 선택
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                // JSON으로 변환
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

                // 카드사 감지 또는 강제 지정
                let selectedCardCompany = forceCardCompany;

                if (!selectedCardCompany) {
                    // 사용자가 선택한 카드사 가져오기 (카드 대금 등록 모달에서)
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
                    parsedData = parseKBCard(jsonData);
                } else if (selectedCardCompany === '삼성카드') {
                    parsedData = parseSamsungCard(jsonData);
                } else {
                    // 기본 파싱 (자동 감지)
                    parsedData = parseGenericCard(jsonData);
                }

                // 감지된 카드사로 설정
                parsedData.cardCompany = selectedCardCompany;

                resolve(parsedData);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = function (error) {
            reject(error);
        };

        reader.readAsArrayBuffer(file);
    });
};
