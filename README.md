# Ai.D NEWS - 자동화된 뉴스 큐레이션 플랫폼

## 프로젝트 개요
Ai.D NEWS는 TLDR 뉴스레터를 자동으로 수집, 분석, 분류하여 IT/TECH, AI, Marketing, Design 4개 분야로 나누어 매주 업데이트되는 뉴스 큐레이션 플랫폼입니다.

## 주요 기능
- 📧 **자동 이메일 수집**: dan@tldrnewsletter.com에서 오는 메일 자동 수집
- 🤖 **AI 기반 분류**: 콘텐츠를 4개 분야로 자동 분류 및 요약
- 📅 **자동화 스케줄링**: 매주 토요일 오전 10시 자동 업데이트
- 🎙️ **팟캐스트 생성**: 각 분야별 팟캐스트 자동 생성
- 📬 **뉴스레터 발송**: 구독자에게 맞춤형 뉴스레터 발송
- 📱 **반응형 웹**: 다양한 디바이스에서 최적화된 사용자 경험

## 기술 스택
### Frontend
- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Headless UI

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT
- **Email Service**: Nodemailer with Gmail API
- **Task Scheduling**: node-cron

### AI/ML Services
- **Content Classification**: OpenAI GPT-4
- **Text-to-Speech**: ElevenLabs API
- **Content Summarization**: OpenAI GPT-4

## 프로젝트 구조
```
webapp/
├── frontend/           # Next.js 프론트엔드
│   ├── src/
│   │   ├── components/ # 재사용 가능한 컴포넌트
│   │   ├── pages/      # 페이지 컴포넌트
│   │   ├── utils/      # 유틸리티 함수
│   │   ├── styles/     # 스타일 파일
│   │   ├── contexts/   # React Context
│   │   └── hooks/      # Custom Hooks
│   └── public/         # 정적 파일
├── backend/            # Express.js 백엔드
│   ├── src/
│   │   ├── controllers/# API 컨트롤러
│   │   ├── models/     # 데이터 모델
│   │   ├── routes/     # API 라우트
│   │   ├── middleware/ # 미들웨어
│   │   ├── services/   # 비즈니스 로직
│   │   └── utils/      # 유틸리티 함수
│   └── config/         # 설정 파일
├── database/           # DB 스키마 및 마이그레이션
├── scripts/            # 자동화 스크립트
└── docs/              # 문서
```

## 설치 및 실행

### 환경 변수 설정
```bash
# backend/.env
DATABASE_URL="postgresql://username:password@localhost:5432/aid_news"
JWT_SECRET="your-jwt-secret"
OPENAI_API_KEY="your-openai-api-key"
ELEVENLABS_API_KEY="your-elevenlabs-api-key"
GMAIL_CLIENT_ID="your-gmail-client-id"
GMAIL_CLIENT_SECRET="your-gmail-client-secret"
GMAIL_REFRESH_TOKEN="your-gmail-refresh-token"
```

### 개발 환경 실행
```bash
# 백엔드 실행
cd backend
npm install
npm run dev

# 프론트엔드 실행
cd frontend
npm install
npm run dev
```

## 주요 워크플로우
1. **이메일 수집**: Gmail API를 통해 TLDR 뉴스레터 수집
2. **콘텐츠 분석**: AI를 활용한 자동 분류 및 요약
3. **웹사이트 업데이트**: 새로운 콘텐츠를 웹사이트에 게시
4. **팟캐스트 생성**: 각 분야별 오디오 콘텐츠 생성
5. **뉴스레터 발송**: 구독자에게 맞춤형 뉴스레터 발송

## 개발 일정
- **Phase 1**: 기본 웹사이트 및 백엔드 API 구현
- **Phase 2**: 이메일 처리 및 AI 분류 시스템 구현
- **Phase 3**: 팟캐스트 생성 및 뉴스레터 발송 기능
- **Phase 4**: 자동화 스케줄링 및 최적화
- **Phase 5**: 배포 및 모니터링 시스템 구축

## 라이선스
MIT License