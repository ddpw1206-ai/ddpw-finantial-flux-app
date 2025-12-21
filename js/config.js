// ========================================
// 앱 설정
// ========================================
const APP_VERSION = '0.0.2';

// ========================================
// XLSX 기획 기반 데이터 구조 (2025-12-21 추가)
// ========================================

// ========== 결제수단 ==========
const PAYMENT_METHODS = {
  creditCards: ["KB탄탄대로(파우)", "KB탄탄대로(둠둠)", "네이버페이탭탭", "KB국민행복카드", "삼성BENEFIT카드"],
  creditInstallment: ["KB탄탄대로(파우)", "KB탄탄대로(둠둠)", "네이버페이탭탭", "KB국민행복카드", "삼성BENEFIT카드"],
  checkCards: ["KB K패스(파우)", "KB K패스(둠둠)", "카카오뱅크(파우)"],
  accounts: ["KB(3652) 파우", "KB(96300) 파우", "KB(93618) 둠둠", "하나일반(28907)", "KB(9898) 파우", "카카오뱅크(6321)", "하나대출(06642)"],
  etc: ["네이버페이_계좌", "SSG페이_계좌", "카카오페이_계좌", "기타(기프티콘, 선물 등)", "현금"]
};

// ========== 계좌 상세 정보 ==========
const ACCOUNT_DETAILS = [
  { no: 1, accountNo: "247-980067-06642", name: "서울시신혼부부임차", bank: "하나은행", note: "(연장)2024-12-30" },
  { no: 2, accountNo: "247-910338-28907", name: "주거래 하나 통장", bank: "KB 국민", note: "파우" },
  { no: 3, accountNo: "9-6300-7451-59", name: "KB 마이홈 통장", bank: "KB 국민", note: "파우" },
  { no: 4, accountNo: "9-3618-9012-51", name: "KB 락스타 통장", bank: "KB 국민", note: "둠둠" },
  { no: 5, accountNo: "365202-01-114805", name: "KB Start 통장", bank: "KB 국민", note: "파우" },
  { no: 6, accountNo: "247910-38-828907", name: "서울시신혼부부임차_메인", bank: "하나은행", note: "-" }
];

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
let accountCardPayments = []; // 계좌 관리에서 등록한 카드 대금 납부 내역

// ========================================
// 파일 시스템
// ========================================
const DATA_FILE_NAME = 'budget-data.json';
const ACCOUNT_FILE_NAME = 'account-data.json';
const MERCHANT_FILE_NAME = 'merchant-history.json';
const CARD_FILE_NAME = 'card-data.json';
const CARD_PARSING_TEMPLATES_FILE_NAME = 'card-parsing-templates.json';
const ACCOUNT_CARD_PAYMENTS_FILE_NAME = 'account-card-payments.json';

// ========== 카테고리 (기존 변수명 변경 및 호환성 유지) ==========
// 지출용 카테고리별 항목 매핑
const EXPENSE_CATEGORIES = {
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

// 수입용 카테고리별 항목 매핑
const INCOME_CATEGORIES = {
  '급여': ['주급여(파우)', '주급여(둠둠)', '상여(파우)', '상여(둠둠)', '복지(파우)', '복지(둠둠)'],
  '부수입': ['투자수익', '현금수입', '전문가비', '중고판매'],
  '기타수익': ['국세환급', '일반이체', '전월이월', '기타현금', '청구할인', '이자소득']
};

// 기존 이름으로도 참조 가능하게 설정 (호환성)
const expenseCategoryItems = EXPENSE_CATEGORIES;
const incomeCategoryItems = INCOME_CATEGORIES;

// ========== 사용자 및 거래 구분 ==========
const USERS = ["공용", "파우", "둠둠"];
const TRANSACTION_TYPES = ["수입", "지출"];

// window 객체에 할당 (전역 접근 보장)
if (typeof window !== 'undefined') {
  window.PAYMENT_METHODS = PAYMENT_METHODS;
  window.ACCOUNT_DETAILS = ACCOUNT_DETAILS;
  window.USERS = USERS;
  window.TRANSACTION_TYPES = TRANSACTION_TYPES;
  window.EXPENSE_CATEGORIES = EXPENSE_CATEGORIES;
  window.INCOME_CATEGORIES = INCOME_CATEGORIES;

  // 기존 이름 호환성
  window.expenseCategoryItems = EXPENSE_CATEGORIES;
  window.incomeCategoryItems = INCOME_CATEGORIES;
}

// 기존 categoryData도 유지 (호환성)
const categoryData = {
  expense: expenseCategoryItems,
  income: incomeCategoryItems
};

console.log('config.js 로드 완료');

