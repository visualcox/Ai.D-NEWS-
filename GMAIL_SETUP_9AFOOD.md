# 📧 9afood@gmail.com Gmail 연동 가이드

**계정**: 9afood@gmail.com
**목적**: TLDR Newsletter 이메일 자동 수집

## 🚀 1단계: Google Cloud Console 설정 (9afood 계정으로)

### 1.1 9afood@gmail.com으로 로그인
🔗 **Google Cloud Console**: https://console.cloud.google.com/
- **중요**: 반드시 **9afood@gmail.com** 계정으로 로그인

### 1.2 새 프로젝트 생성
1. 우상단 프로젝트 선택 → **"새 프로젝트"**
2. 프로젝트 이름: **`AiD-NEWS-9afood`**
3. **"만들기"** 클릭

### 1.3 Gmail API 활성화
1. 좌측 메뉴 → **"API 및 서비스"** → **"라이브러리"**
2. 검색창에 **"Gmail API"** 입력
3. **Gmail API** 선택 → **"사용"** 클릭

### 1.4 OAuth 동의 화면 설정
1. 좌측 메뉴 → **"API 및 서비스"** → **"OAuth 동의 화면"**
2. **"외부"** 선택 → **"만들기"**
3. 입력 정보:
   ```
   앱 이름: Ai.D NEWS - 9afood
   사용자 지원 이메일: 9afood@gmail.com
   앱 도메인 - 홈페이지: https://3000-i402476dd7n2ezs3gvmuv-6532622b.e2b.dev
   개발자 연락처 정보: 9afood@gmail.com
   ```
4. **"저장 후 계속"** 클릭

### 1.5 범위 추가
1. **"범위 추가 또는 삭제"** 클릭
2. **"수동으로 추가"**에서 다음 입력:
   ```
   https://www.googleapis.com/auth/gmail.readonly
   ```
3. **"업데이트"** 클릭
4. **"저장 후 계속"** 클릭

### 1.6 테스트 사용자 추가
1. **"+ ADD USERS"** 클릭
2. **9afood@gmail.com** 입력
3. **"저장 후 계속"** 클릭

### 1.7 OAuth2 자격증명 생성 ⭐
1. 좌측 메뉴 → **"API 및 서비스"** → **"사용자 인증 정보"**
2. **"+ 사용자 인증 정보 만들기"** → **"OAuth 클라이언트 ID"**
3. 설정:
   ```
   애플리케이션 유형: 데스크톱 애플리케이션
   이름: AiD-NEWS-9afood-Desktop
   ```
4. **"만들기"** 클릭

### 1.8 자격증명 다운로드 📥
1. 생성된 OAuth2 클라이언트에서 **다운로드** 아이콘 클릭
2. JSON 파일 다운로드
3. **클라이언트 ID**와 **클라이언트 보안 비밀번호** 메모

## ⚙️ 2단계: 환경 변수 설정

### 2.1 서버 접속 및 파일 수정
```bash
cd /home/user/webapp/backend
nano .env
```

### 2.2 Gmail API 섹션 업데이트
다음 부분을 찾아서 수정:
```env
# Gmail API - 9afood@gmail.com 계정 전용
GMAIL_CLIENT_ID="여기에_9afood_계정용_클라이언트_ID_입력"
GMAIL_CLIENT_SECRET="여기에_9afood_계정용_클라이언트_시크릿_입력"
GMAIL_REFRESH_TOKEN=""
GMAIL_ACCESS_TOKEN=""
GMAIL_REDIRECT_URI="urn:ietf:wg:oauth:2.0:oob"

# 9afood 계정 설정
TARGET_GMAIL_ACCOUNT="9afood@gmail.com"
```

### 2.3 서버 재시작
```bash
cd /home/user/webapp
pm2 restart aid-news-backend
pm2 restart aid-news-frontend
```

## 🔐 3단계: 9afood@gmail.com으로 Gmail 연동

### 3.1 웹사이트 접속
🔗 **Ai.D NEWS**: https://3000-i402476dd7n2ezs3gvmuv-6532622b.e2b.dev

### 3.2 관리자 패널 열기
1. 페이지 **우하단** ⚙️ 버튼 클릭
2. **Gmail 인증** 섹션 확인

### 3.3 Gmail 연동 시작
1. **"Gmail 연동하기"** 버튼 클릭
2. 새 창에서 Google 인증 페이지 열림
3. **중요**: **9afood@gmail.com** 계정으로 로그인
4. **"Ai.D NEWS - 9afood가 다음을 원합니다"** 화면
5. Gmail 읽기 권한 **"허용"** 클릭
6. 인증 코드 표시됨 → **복사**

### 3.4 인증 코드 제출
1. 관리자 패널로 돌아가기
2. 인증 코드 입력창에 **붙여넣기**
3. **"인증 코드 제출"** 클릭
4. **"✅ Gmail 계정 연동 성공!"** 확인

## 📧 4단계: TLDR Newsletter 확인

### 4.1 9afood@gmail.com에서 TLDR 구독 확인
TLDR Newsletter 구독이 필요합니다:
1. **TLDR Newsletter**: https://tldr.tech/
2. **9afood@gmail.com**으로 구독
3. 발신자: **dan@tldrnewsletter.com** 확인

### 4.2 이메일 수집 테스트
1. 관리자 패널 → **"이메일 수집 시작"**
2. 9afood@gmail.com의 TLDR 이메일 수집 시작
3. 결과 확인:
   ```
   📧 처리된 이메일: X개 (9afood 계정의 TLDR 이메일)
   📰 추출된 기사: Y개
   📊 카테고리 분포: AI, IT/TECH, Marketing, Design
   ```

## 🧪 5단계: 연동 확인

### 5.1 성공 지표
✅ **관리자 패널**: "✅ 연동 완료" 표시
✅ **이메일 수집**: 9afood@gmail.com의 실제 TLDR 이메일 처리
✅ **메인 페이지**: 실제 수집된 콘텐츠 표시
✅ **로그 확인**: `✅ Gmail authentication successful for: 9afood@gmail.com`

### 5.2 로그 확인 방법
```bash
cd /home/user/webapp
pm2 logs aid-news-backend --nostream --lines 20
```

성공 시 다음과 같은 로그 표시:
```
✅ Gmail authentication successful for: 9afood@gmail.com
🔑 Tokens obtained: { hasAccessToken: true, hasRefreshToken: true }
💾 Save this refresh token to your environment variables:
GMAIL_REFRESH_TOKEN="실제_토큰_값"
```

## 🚨 9afood 계정 전용 문제 해결

### ❌ "This app isn't verified"
- Google OAuth 동의 화면에서 **"Advanced"** → **"Go to Ai.D NEWS (unsafe)"** 클릭
- 테스트 사용자(9afood@gmail.com)로 등록되어 있어야 함

### ❌ "Access blocked"
1. OAuth 동의 화면에서 9afood@gmail.com이 테스트 사용자로 등록되었는지 확인
2. Gmail API 범위가 올바르게 설정되었는지 확인

### ❌ "No TLDR emails found"
1. 9afood@gmail.com으로 TLDR Newsletter 구독
2. dan@tldrnewsletter.com에서 온 이메일 확인

## 📊 완료 후 확인사항

✅ **Google Cloud Console**: 9afood@gmail.com으로 프로젝트 생성
✅ **OAuth2 자격증명**: 9afood 계정용 클라이언트 ID/Secret 설정
✅ **환경 변수**: .env 파일에 9afood 계정 정보 저장
✅ **Gmail 연동**: 9afood@gmail.com으로 성공적 인증
✅ **TLDR 수집**: 9afood 계정의 실제 Newsletter 이메일 처리

---

**🎯 9afood@gmail.com 계정으로 완전한 Gmail 연동이 완료됩니다!**