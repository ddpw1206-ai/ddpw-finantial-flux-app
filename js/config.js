// ========================================
// 앱 설정
// ========================================
const APP_VERSION = '001';

// ========================================
// 전역 상태 변수
// ========================================
let currentActiveTab = 'dashboard';
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
let dataFolderHandle = null;
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
// 카테고리 데이터
// ========================================
const categoryData = {
  expense: {
    식비: ['아침', '점심', '저녁', '간식', '배달'],
    교통: ['대중교통', '택시', '주유', '톨비', '주차'],
    생활: ['마트', '편의점', '생필품', '의류', '미용'],
    문화: ['영화', '공연', '도서', '취미', '여행'],
    의료: ['병원', '약국', '건강검진'],
    통신: ['휴대폰', '인터넷', '케이블'],
    교육: ['학원', '교재', '강의']
  },
  income: {
    급여: ['월급', '상여금', '수당'],
    사업: ['매출', '부수입'],
    기타: ['환급', '선물', '이자']
  }
};

console.log('config.js 로드 완료');

