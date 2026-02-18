// DDPW Moneybook Flux – config.js (v2)

/**
 * 1. 사용자 상수
 * - 고정 사용자: 공용, 파우, 둠둠
 */
const USERS = ["공용", "파우", "둠둠"];
window.USERS = USERS;


/**
 * 2. 결제수단 상수 PAYMENT_METHODS
 * - 신용카드, 체크카드, 계좌, 기타(현금/페이)
 */
const PAYMENT_METHODS = {
    creditCards: [
        { id: "kb_tantan_pau", label: "KB 탄탄대로 (파우)", type: "credit" },
        { id: "hyundai_m_doom", label: "현대카드 M (둠둠)", type: "credit" },
        { id: "shinhan_deep_common", label: "신한 Deep Dream (공용)", type: "credit" },
        { id: "samsung_taptap", label: "삼성 taptap O (파우)", type: "credit" }
    ],
    checkCards: [
        { id: "kakao_check_common", label: "카카오뱅크 프렌즈 체크 (공용)", type: "check" },
        { id: "toss_card_doom", label: "토스뱅크 카드 (둠둠)", type: "check" }
    ],
    accounts: [
        // 계좌 결제(이체) 시 사용되는 출금 계좌 참조용
        { id: "kb_salary", label: "KB국민 (급여)", type: "account" },
        { id: "kakao_living", label: "카카오뱅크 (생활비)", type: "account" },
        { id: "toss_emergency", label: "토스뱅크 (비상금)", type: "account" }
    ],
    etc: [
        { id: "cash", label: "현금", type: "cash" },
        { id: "naver_pay", label: "네이버페이", type: "pay" },
        { id: "kakao_pay", label: "카카오페이", type: "pay" }
    ]
};
window.PAYMENT_METHODS = PAYMENT_METHODS;


/**
 * 3. 계좌 상수 ACCOUNT_DETAILS
 * - 계좌 관리 및 자산 현황용
 */
const ACCOUNT_DETAILS = [
    {
        no: 1,
        accountNo: "123-456-7890",
        name: "급여 통장",
        bank: "KB국민",
        note: "월급 입금 및 고정지출 출금",
        initialBalance: 0,
        active: true
    },
    {
        no: 2,
        accountNo: "3333-01-2345678",
        name: "생활비 통장",
        bank: "카카오뱅크",
        note: "부부 공용 생활비 및 데이트 비용",
        initialBalance: 0,
        active: true
    },
    {
        no: 3,
        accountNo: "1000-00-000000",
        name: "비상금 통장",
        bank: "토스뱅크",
        note: "예비비 및 비정기 지출 대비",
        initialBalance: 0,
        active: true
    },
    {
        no: 4,
        accountNo: "110-123-456789",
        name: "개인 용돈 (파우)",
        bank: "신한수협",
        note: "파우 개인 용돈",
        initialBalance: 0,
        active: true
    }
];
window.ACCOUNT_DETAILS = ACCOUNT_DETAILS;


/**
 * 4. 카테고리 상수
 * - INCOME_CATEGORIES: 수입 카테고리
 * - EXPENSE_CATEGORIES: 지출 카테고리
 * - 1~3 Depth 구조 지원 (여기서는 Key-Array 형태의 2 Depth 예시)
 */
const INCOME_CATEGORIES = {
    "급여": ["기본급", "성과급", "상여금"],
    "부수입": ["이자소득", "배당소득", "중고판매", "캐시백"],
    "기타": ["용돈", "이월금", "기타수입"]
};
window.INCOME_CATEGORIES = INCOME_CATEGORIES;

const EXPENSE_CATEGORIES = {
    "식비": ["장보기", "외식", "카페/간식", "배달"],
    "주거": ["월세", "관리비", "가스/수도", "전기세", "인터넷/TV"],
    "생활": ["생활용품", "가구/가전", "청소/세탁", "잡화"],
    "교통": ["대중교통", "택시", "주유", "하이패스", "차량정비"],
    "통신": ["휴대폰요금", "구독서비스(OTT 등)"],
    "건강": ["병원/약국", "운동/헬스", "영양제"],
    "쇼핑": ["의류", "화장품", "취미/여가"],
    "문화/여가": ["영화/공연", "여행", "도서"],
    "교육": ["자기계발", "도서", "강의"],
    "경조사": ["결혼/장례", "선물", "용돈"],
    "금융/보험": ["보험료", "대출이자", "적금/투자불입"],
    "기타지출": ["기타", "알수없음"]
};
window.EXPENSE_CATEGORIES = EXPENSE_CATEGORIES;
