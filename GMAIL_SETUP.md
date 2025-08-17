# 📧 Gmail API 설정 가이드

이 가이드는 Ai.D NEWS에서 실제 Gmail API를 사용하여 TLDR Newsletter 이메일을 수집하기 위한 설정 방법을 설명합니다.

## 🚀 1단계: Google Cloud Console 설정

### 1.1 프로젝트 생성
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. 프로젝트 이름: `Ai.D NEWS Gmail Integration`

### 1.2 Gmail API 활성화
1. 좌측 메뉴 → `API 및 서비스` → `라이브러리`
2. `Gmail API` 검색 후 선택
3. `사용` 버튼 클릭

### 1.3 OAuth2 자격 증명 생성
1. 좌측 메뉴 → `API 및 서비스` → `사용자 인증 정보`
2. `+ 사용자 인증 정보 만들기` → `OAuth 클라이언트 ID`
3. 애플리케이션 유형: `데스크톱 애플리케이션`
4. 이름: `Ai.D NEWS Desktop Client`
5. `만들기` 클릭
6. **클라이언트 ID**와 **클라이언트 보안 비밀번호** 복사

## 🔧 2단계: 환경 변수 설정

### 2.1 .env 파일 생성
```bash
cd /home/user/webapp/backend
cp .env.example .env
```

### 2.2 Gmail API 정보 입력
`.env` 파일에서 다음 값들을 설정:

```env
# Gmail API 설정
GMAIL_CLIENT_ID="여기에_클라이언트_ID_입력"
GMAIL_CLIENT_SECRET="여기에_클라이언트_시크릿_입력"
GMAIL_REDIRECT_URI="urn:ietf:wg:oauth:2.0:oob"

# 아래 토큰들은 OAuth 인증 후 자동 생성됨
GMAIL_REFRESH_TOKEN=""
GMAIL_ACCESS_TOKEN=""
```

## 🔐 3단계: OAuth2 인증 수행

### 3.1 서버 재시작
```bash
cd /home/user/webapp
pm2 restart aid-news-backend
```

### 3.2 웹 브라우저에서 인증
1. 웹사이트 접속: https://3000-i402476dd7n2ezs3gvmuv-6532622b.e2b.dev
2. 우하단 ⚙️ 버튼 클릭 (관리자 패널)
3. `Gmail 연동하기` 버튼 클릭
4. 새 창에서 Google 계정 로그인
5. Gmail 읽기 권한 승인
6. **인증 코드** 복사
7. 관리자 패널에 인증 코드 입력 후 제출

### 3.3 대체 방법 (직접 URL 접속)
```
https://3001-i402476dd7n2ezs3gvmuv-6532622b.e2b.dev/api/auth/gmail
```

## ✅ 4단계: 인증 확인

### 4.1 로그 확인
```bash
cd /home/user/webapp
pm2 logs aid-news-backend --nostream --lines 20
```

성공 시 다음과 같은 로그 확인:
```
✅ Gmail authentication successful for: your-email@gmail.com
🔑 Tokens obtained: { hasAccessToken: true, hasRefreshToken: true }
💾 Save this refresh token to your environment variables:
GMAIL_REFRESH_TOKEN="your-refresh-token-here"
```

### 4.2 토큰 저장
로그에서 표시된 토큰들을 `.env` 파일에 저장:
```env
GMAIL_REFRESH_TOKEN="로그에서_복사한_리프레시_토큰"
GMAIL_ACCESS_TOKEN="로그에서_복사한_액세스_토큰"
```

### 4.3 서버 재시작
```bash
pm2 restart aid-news-backend
```

## 🧪 5단계: 이메일 수집 테스트

### 5.1 관리자 패널에서 테스트
1. 관리자 패널 → `이메일 수집 시작`
2. 실제 Gmail에서 TLDR Newsletter 수집 확인

### 5.2 API로 직접 테스트
```bash
curl -X POST "https://3001-i402476dd7n2ezs3gvmuv-6532622b.e2b.dev/api/email-collection/collect" \
  -H "Content-Type: application/json" \
  -d '{"maxResults": 10}'
```

## 🔒 보안 고려사항

### 권한 범위
- **읽기 전용**: 이메일 읽기만 가능
- **특정 발신자**: TLDR Newsletter만 대상
- **언제든 철회**: Google 계정 설정에서 권한 철회 가능

### 토큰 관리
- Refresh Token은 장기 보관용 (만료되지 않음)
- Access Token은 단기용 (1시간 후 자동 갱신)
- 환경 변수로 안전하게 저장

## 🚨 문제 해결

### 일반적인 오류들

#### 1. "OAuth2 client not initialized"
- `.env` 파일의 `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET` 확인
- 서버 재시작 필요

#### 2. "Gmail authentication failed"
- Google Cloud Console에서 OAuth2 설정 확인
- 클라이언트 ID/Secret 정확성 확인

#### 3. "No TLDR emails found"
- Gmail 계정에 TLDR Newsletter 구독 확인
- 발신자 이메일: `dan@tldrnewsletter.com`

#### 4. "Token expired"
- Refresh Token으로 자동 갱신됨
- 문제 지속 시 재인증 필요

### 로그 확인 명령어
```bash
# 실시간 로그 모니터링
pm2 logs aid-news-backend

# 최근 로그만 확인
pm2 logs aid-news-backend --nostream --lines 50
```

## 📞 추가 지원

설정 중 문제가 발생하면:
1. 로그 파일 확인
2. 환경 변수 재점검
3. Google Cloud Console 설정 재확인
4. 서버 재시작 시도

---

**📝 참고**: 이 설정은 개발 환경용입니다. 프로덕션 환경에서는 보다 안전한 토큰 저장 방식을 사용하세요.