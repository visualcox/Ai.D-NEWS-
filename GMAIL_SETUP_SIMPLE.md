# 🚀 Gmail 연동 완전 가이드 (5분 완성)

**현재 상황**: Gmail 연동 버튼은 보이지만 Google OAuth2 자격증명이 필요합니다.

## 📍 환경 변수 설정 위치

**파일**: `/home/user/webapp/backend/.env`

```bash
# 현재 설정된 위치
cd /home/user/webapp/backend
nano .env
```

## 🔧 1단계: Google Cloud Console 설정 (5분)

### 1.1 Google Cloud Console 접속
🔗 **링크**: https://console.cloud.google.com/

### 1.2 새 프로젝트 생성
1. 우상단 프로젝트 선택 → **"새 프로젝트"**
2. 프로젝트 이름: `Ai-D-NEWS-Gmail`
3. **"만들기"** 클릭

### 1.3 Gmail API 활성화
1. 좌측 메뉴 → **"API 및 서비스"** → **"라이브러리"**
2. 검색창에 **"Gmail API"** 입력
3. **Gmail API** 선택 → **"사용"** 클릭

### 1.4 OAuth 동의 화면 설정
1. 좌측 메뉴 → **"API 및 서비스"** → **"OAuth 동의 화면"**
2. **"외부"** 선택 → **"만들기"**
3. 필수 입력:
   - **앱 이름**: `Ai.D NEWS`
   - **사용자 지원 이메일**: 본인 이메일
   - **개발자 연락처 정보**: 본인 이메일
4. **"저장 후 계속"** 클릭
5. **범위 추가** → **"Gmail API"** → **".../auth/gmail.readonly"** 선택
6. 모든 단계 **"저장 후 계속"** 클릭

### 1.5 OAuth2 자격증명 생성 ⭐ **가장 중요**
1. 좌측 메뉴 → **"API 및 서비스"** → **"사용자 인증 정보"**
2. **"+ 사용자 인증 정보 만들기"** → **"OAuth 클라이언트 ID"**
3. 애플리케이션 유형: **"데스크톱 애플리케이션"**
4. 이름: `Ai.D NEWS Desktop Client`
5. **"만들기"** 클릭

### 1.6 자격증명 복사 📋
팝업창에서 다음 정보 복사:
- **클라이언트 ID**: `123456789-abc...googleusercontent.com`
- **클라이언트 보안 비밀번호**: `GOCSPX-abc123...`

## ⚙️ 2단계: 환경 변수 설정

### 2.1 .env 파일 수정
```bash
cd /home/user/webapp/backend
nano .env
```

### 2.2 Gmail API 섹션 업데이트
```env
# Gmail API - 여기에 복사한 값 입력
GMAIL_CLIENT_ID="여기에_클라이언트_ID_붙여넣기"
GMAIL_CLIENT_SECRET="여기에_클라이언트_시크릿_붙여넣기"
GMAIL_REFRESH_TOKEN=""
GMAIL_ACCESS_TOKEN=""
GMAIL_REDIRECT_URI="urn:ietf:wg:oauth:2.0:oob"
```

### 2.3 서버 재시작
```bash
cd /home/user/webapp
pm2 restart aid-news-backend
```

## 🔐 3단계: 웹에서 Gmail 연동

### 3.1 웹사이트 접속
🔗 **URL**: https://3000-i402476dd7n2ezs3gvmuv-6532622b.e2b.dev

### 3.2 관리자 패널 열기
1. 웹사이트 **우하단** ⚙️ 버튼 클릭
2. **관리자 패널**이 나타남

### 3.3 Gmail 연동 시작
1. **"Gmail 연동하기"** 버튼 클릭
2. **새 창**에서 Google 인증 페이지 열림
3. 본인 Gmail 계정으로 **로그인**
4. **"Ai.D NEWS가 다음을 원합니다"** 화면에서 **"허용"** 클릭
5. **인증 코드** 나타남 → 복사

### 3.4 인증 코드 입력
1. 관리자 패널로 돌아가기
2. 인증 코드 입력창에 **붙여넣기**
3. **"인증 코드 제출"** 버튼 클릭
4. **"✅ Gmail 계정 연동 성공!"** 메시지 확인

## 🧪 4단계: 실제 이메일 수집 테스트

### 4.1 이메일 수집 시작
1. 관리자 패널에서 **"이메일 수집 시작"** 클릭
2. 실제 Gmail에서 TLDR Newsletter 이메일 수집 시작
3. **진행상황** 실시간 표시

### 4.2 결과 확인
- **수집된 이메일 수**: 실제 Gmail의 TLDR 이메일 개수
- **추출된 기사 수**: 파싱된 기사 개수
- **카테고리별 분포**: AI, IT/TECH, Marketing, Design

## 🚨 문제 해결

### ❌ "Gmail 연동하기" 버튼이 안 보임
```bash
# 프론트엔드 재시작
cd /home/user/webapp
pm2 restart aid-news-frontend
```

### ❌ "Gmail authentication not properly configured"
1. `.env` 파일의 `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET` 확인
2. Google Cloud Console에서 자격증명 재확인
3. 백엔드 재시작: `pm2 restart aid-news-backend`

### ❌ "Authorization failed"
1. OAuth 동의 화면에서 Gmail API 범위 확인
2. 애플리케이션 유형이 "데스크톱 애플리케이션"인지 확인
3. 자격증명 재생성

### ❌ "No TLDR emails found"
- Gmail 계정에 TLDR Newsletter 구독 확인
- 발신자: `dan@tldrnewsletter.com`

## 🎯 완료 후 확인사항

✅ **관리자 패널에서 "✅ 연동 완료" 표시**
✅ **이메일 수집 시 실제 Gmail 데이터 사용**  
✅ **메인 페이지에 실제 TLDR 기사 표시**

---

**💡 팁**: 전체 과정은 5-10분이면 완성됩니다!
**🔒 보안**: 읽기 전용 권한만 사용하며, Google 계정에서 언제든 철회 가능