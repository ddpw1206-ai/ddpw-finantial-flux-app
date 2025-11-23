// ========================================
// 앱 설정
// ========================================
const APP_VERSION = '0.0.2';

// ========================================
// 전역 상태 변수
// ========================================
window.currentActiveTab = 'dashboard';
let curYear = new Date().getFullYear();
let curMonth = new Date().getMonth() + 1;
let editingId = null;
let editingAccountId = null;

// ========================================
// 데이터 배열
// ========================================
let transactionData = [];
let accountData = [];
let merchantHistory = [];
let cardData = [];
let cardParsingTemplates = {};
// dataFolderHandle은 data-manager.js에서 정의됨
let lastModifiedTime = {};

// ========================================
// 파일 시스템
// ========================================
const DATA_FILE_NAME = 'budget-data.json';
const ACCOUNT_FILE_NAME = 'account-data.json';
const MERCHANT_FILE_NAME = 'merchant-history.json';
const CARD_FILE_NAME = 'card-data.json';
const CARD_PARSING_TEMPLATES_FILE_NAME = 'card-parsing-templates.json';

// ========================================
// 카테고리 데이터 (rollback.html에서 복원)
// ========================================
// 지출용 카테고리별 항목 매핑 (항목관리 이미지 기준으로 업데이트)
const expenseCategoryItems = {
  '주거': ['관리비', '수도세', '도시가스', '수리/청소', '기타', '통신비'],
  '식비': ['식재료', '부식/간식', '외식', '카페', '배달/포장', '주류'],
  '패션·뷰티': ['의류', '잡화', '신발', '화장품', '미용/시술', '세탁'],
  '교통·차량': ['주유비', '소모품/수리', '주차/통행료', '대중교통', '택시', '보험/세금', '우편/택배'],
  '문화·계발': ['교육/수강', '시험/자격', '영화', '게임', '도서/문구', '여행'],
  '건강': ['병원', '약국', '건강보조', '운동', '정기검진'],
  '보험·저축': ['둠둠보험', '파우보험', '적금1', '적금2', '이자적립', '주식', '여행저축', '기타저축'],
  '대출·이자': ['대출이자(임차)', '대출이자(파우)', '기타이자'],
  '기타지출': ['일반이체', '용돈(둠둠)', '용돈(파우)', '경조사(둠둠)', '경조사(파우)', '유가증권', '선물', '연회비/정기구독'],
  '생활': ['가전/가구', '생활용품', '주방용품', '청소용품', '기타소품']
};

// 수입용 카테고리별 항목 매핑 (항목관리 이미지 기준으로 업데이트)
const incomeCategoryItems = {
  '급여': ['주급여(파우)', '주급여(둠둠)', '상여(파우)', '상여(둠둠)', '복지(파우)', '복지(둠둠)'],
  '부수입': ['투자수익', '현금수입', '전문가비', '중고판매'],
  '기타수익': ['국세환급', '일반이체', '전월이월', '기타현금', '청구할인', '이자소득']
};

// window 객체에 할당 (전역 접근 보장)
if (typeof window !== 'undefined') {
  window.expenseCategoryItems = expenseCategoryItems;
  window.incomeCategoryItems = incomeCategoryItems;
}

// 기존 categoryData도 유지 (호환성)
const categoryData = {
  expense: expenseCategoryItems,
  income: incomeCategoryItems
};

console.log('config.js 로드 완료');

