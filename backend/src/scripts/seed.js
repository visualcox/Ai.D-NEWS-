import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data (in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('🧹 Clearing existing data...')
    await prisma.newsletterSend.deleteMany()
    await prisma.podcast.deleteMany()
    await prisma.article.deleteMany()
    await prisma.subscription.deleteMany()
    await prisma.category.deleteMany()
    await prisma.emailCollectionLog.deleteMany()
    await prisma.jobQueue.deleteMany()
    await prisma.systemSetting.deleteMany()
  }

  // Create categories
  console.log('📁 Creating categories...')
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'IT/TECH',
        slug: 'tech',
        description: '최신 기술 트렌드, 개발 도구, 프로그래밍 소식',
        color: '#3B82F6',
        icon: 'CpuChipIcon'
      }
    }),
    prisma.category.create({
      data: {
        name: 'AI',
        slug: 'ai',
        description: '인공지능, 머신러닝, 딥러닝 관련 최신 연구와 동향',
        color: '#8B5CF6',
        icon: 'LightBulbIcon'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Marketing',
        slug: 'marketing',
        description: '디지털 마케팅, 브랜딩, 성장 전략에 대한 인사이트',
        color: '#10B981',
        icon: 'MegaphoneIcon'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Design',
        slug: 'design',
        description: 'UX/UI 디자인, 시각 디자인, 디자인 시스템 트렌드',
        color: '#F59E0B',
        icon: 'PaintBrushIcon'
      }
    })
  ])

  console.log(`✅ Created ${categories.length} categories`)

  // Create sample articles
  console.log('📰 Creating sample articles...')
  const sampleArticles = [
    {
      title: 'OpenAI GPT-4 Turbo 새로운 업데이트 소식',
      slug: 'openai-gpt4-turbo-update',
      excerpt: 'GPT-4 Turbo의 최신 기능과 성능 개선사항에 대한 상세한 분석을 제공합니다.',
      content: `# OpenAI GPT-4 Turbo 업데이트

OpenAI가 GPT-4 Turbo의 새로운 업데이트를 발표했습니다. 이번 업데이트는 다음과 같은 주요 개선사항을 포함합니다:

## 주요 개선사항

### 1. 컨텍스트 윈도우 확장
- 기존 32K 토큰에서 128K 토큰으로 확장
- 더 긴 문서와 대화 처리 가능

### 2. 성능 향상
- 응답 속도 30% 개선
- 정확도 향상

### 3. 비용 절감
- 입력 토큰 비용 50% 감소
- 출력 토큰 비용 25% 감소

이러한 개선사항은 개발자들이 더 효율적으로 AI를 활용할 수 있도록 도움을 줄 것으로 예상됩니다.`,
      categoryId: categories.find(c => c.slug === 'ai').id,
      featured: true,
      published: true,
      publishedAt: new Date('2024-08-15T10:00:00Z'),
      readTime: 5,
      aiSummary: 'OpenAI GPT-4 Turbo의 주요 업데이트: 컨텍스트 윈도우 확장, 성능 향상, 비용 절감',
      aiKeywords: ['OpenAI', 'GPT-4', 'AI', '업데이트', '성능향상'],
      aiSentiment: 'positive',
      aiImportance: 0.9
    },
    {
      title: '2024년 UX/UI 디자인 트렌드 분석',
      slug: 'ux-ui-design-trends-2024',
      excerpt: '올해 주목해야 할 디자인 트렌드와 실무에 적용할 수 있는 핵심 요소들을 정리했습니다.',
      content: `# 2024년 UX/UI 디자인 트렌드

올해 디자인 업계에서 주목받고 있는 주요 트렌드들을 살펴보겠습니다.

## 주요 트렌드

### 1. 네오모피즘 (Neumorphism)
- 부드러운 그림자와 하이라이트를 활용한 디자인
- 현실감 있는 사용자 경험 제공

### 2. 다크 모드의 진화
- 단순한 어두운 테마를 넘어선 정교한 컬러 시스템
- 사용자 눈의 피로도 감소와 배터리 절약 효과

### 3. 마이크로 인터랙션
- 세밀한 애니메이션과 피드백
- 사용자 참여도 향상

### 4. 접근성 우선 디자인
- 모든 사용자를 고려한 인클루시브 디자인
- WCAG 2.1 가이드라인 준수

이러한 트렌드들을 적절히 활용하면 더 나은 사용자 경험을 제공할 수 있습니다.`,
      categoryId: categories.find(c => c.slug === 'design').id,
      featured: true,
      published: true,
      publishedAt: new Date('2024-08-15T10:00:00Z'),
      readTime: 7,
      aiSummary: '2024년 UX/UI 디자인의 주요 트렌드: 네오모피즘, 다크모드, 마이크로 인터랙션, 접근성',
      aiKeywords: ['UX', 'UI', '디자인', '트렌드', '2024'],
      aiSentiment: 'neutral',
      aiImportance: 0.8
    },
    {
      title: '마케팅에서 AI 활용 사례 10가지',
      slug: 'ai-marketing-use-cases',
      excerpt: '실제 기업들이 AI를 마케팅에 활용한 성공 사례들과 실무 적용 방법을 소개합니다.',
      content: `# 마케팅에서 AI 활용 사례

기업들이 AI를 마케팅에 활용하는 다양한 방법들을 살펴보겠습니다.

## 주요 활용 사례

### 1. 개인화된 콘텐츠 추천
- Netflix의 시청 기록 기반 추천 시스템
- Amazon의 구매 패턴 분석을 통한 상품 추천

### 2. 챗봇을 활용한 고객 서비스
- 24/7 고객 지원
- 자주 묻는 질문에 대한 자동 응답

### 3. 예측 분석
- 고객 이탈 예측
- 매출 예측 및 재고 관리

### 4. 소셜 미디어 모니터링
- 브랜드 멘션 추적
- 감정 분석을 통한 브랜드 인식 파악

### 5. 동적 가격 책정
- 수요와 공급에 따른 실시간 가격 조정
- 경쟁사 가격 모니터링

이러한 AI 도구들을 적절히 활용하면 마케팅 효율성을 크게 향상시킬 수 있습니다.`,
      categoryId: categories.find(c => c.slug === 'marketing').id,
      featured: true,
      published: true,
      publishedAt: new Date('2024-08-15T10:00:00Z'),
      readTime: 6,
      aiSummary: '마케팅에서 AI 활용: 개인화 추천, 챗봇, 예측분석, 소셜미디어 모니터링, 동적 가격책정',
      aiKeywords: ['AI', '마케팅', '개인화', '챗봇', '예측분석'],
      aiSentiment: 'positive',
      aiImportance: 0.85
    }
  ]

  const articles = await Promise.all(
    sampleArticles.map(article => prisma.article.create({ data: article }))
  )

  console.log(`✅ Created ${articles.length} sample articles`)

  // Create sample podcasts
  console.log('🎙️ Creating sample podcasts...')
  const samplePodcasts = [
    {
      title: 'AI 분야 주간 브리핑 - 2024년 8월 2주차',
      description: 'OpenAI 최신 업데이트부터 구글의 새로운 AI 모델까지, 이번 주 AI 소식을 정리했습니다.',
      audioUrl: '/audio/ai-weekly-20240815.mp3',
      duration: '15:32',
      publishedAt: new Date('2024-08-15T10:00:00Z'),
      categoryId: categories.find(c => c.slug === 'ai').id,
      listens: 1240,
      ttsProvider: 'elevenlabs',
      voiceId: 'news-anchor-male'
    },
    {
      title: 'IT/TECH 분야 주간 브리핑 - 2024년 8월 2주차',
      description: '새로운 개발 프레임워크와 클라우드 서비스 업데이트를 다룹니다.',
      audioUrl: '/audio/tech-weekly-20240815.mp3',
      duration: '12:45',
      publishedAt: new Date('2024-08-15T10:00:00Z'),
      categoryId: categories.find(c => c.slug === 'tech').id,
      listens: 890,
      ttsProvider: 'elevenlabs',
      voiceId: 'news-anchor-female'
    }
  ]

  const podcasts = await Promise.all(
    samplePodcasts.map(podcast => prisma.podcast.create({ data: podcast }))
  )

  console.log(`✅ Created ${podcasts.length} sample podcasts`)

  // Create system settings
  console.log('⚙️ Creating system settings...')
  const systemSettings = [
    { key: 'email_collection_enabled', value: 'true' },
    { key: 'newsletter_sending_enabled', value: 'true' },
    { key: 'podcast_generation_enabled', value: 'true' },
    { key: 'last_email_check', value: new Date().toISOString() },
    { key: 'weekly_schedule', value: '0 10 * * SAT' }, // Every Saturday at 10:00 AM
  ]

  await Promise.all(
    systemSettings.map(setting => 
      prisma.systemSetting.create({ data: setting })
    )
  )

  console.log(`✅ Created ${systemSettings.length} system settings`)

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })