'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CalendarIcon, ClockIcon, PlayIcon } from '@heroicons/react/24/outline'

// 임시 데이터 (실제로는 API에서 가져올 예정)
const featuredArticles = [
  {
    id: 1,
    title: 'OpenAI GPT-4 Turbo 새로운 업데이트 소식',
    excerpt: 'GPT-4 Turbo의 최신 기능과 성능 개선사항에 대한 상세한 분석을 제공합니다.',
    category: 'AI',
    publishedAt: '2024-08-15T10:00:00Z',
    readTime: 5,
    imageUrl: '/images/ai-featured-1.jpg',
    slug: 'openai-gpt4-turbo-update'
  },
  {
    id: 2,
    title: '2024년 UX/UI 디자인 트렌드 분석',
    excerpt: '올해 주목해야 할 디자인 트렌드와 실무에 적용할 수 있는 핵심 요소들을 정리했습니다.',
    category: 'Design',
    publishedAt: '2024-08-15T10:00:00Z',
    readTime: 7,
    imageUrl: '/images/design-featured-1.jpg',
    slug: 'ux-ui-design-trends-2024'
  },
  {
    id: 3,
    title: '마케팅에서 AI 활용 사례 10가지',
    excerpt: '실제 기업들이 AI를 마케팅에 활용한 성공 사례들과 실무 적용 방법을 소개합니다.',
    category: 'Marketing',
    publishedAt: '2024-08-15T10:00:00Z',
    readTime: 6,
    imageUrl: '/images/marketing-featured-1.jpg',
    slug: 'ai-marketing-use-cases'
  }
]

const categoryColors = {
  'AI': 'bg-purple-100 text-purple-700',
  'IT/TECH': 'bg-blue-100 text-blue-700',
  'Marketing': 'bg-green-100 text-green-700',
  'Design': 'bg-pink-100 text-pink-700'
}

export default function FeaturedArticles() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 실제로는 API 호출
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title">주요 뉴스</h2>
            <p className="section-subtitle">이번 주 가장 주목받은 뉴스들을 확인해보세요</p>
          </div>
          
          <div className="news-grid">
            {[1, 2, 3].map((item) => (
              <div key={item} className="article-card animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-16 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="flex items-center space-x-4">
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-title">주요 뉴스</h2>
          <p className="section-subtitle">이번 주 가장 주목받은 뉴스들을 확인해보세요</p>
        </div>
        
        <div className="news-grid">
          {featuredArticles.map((article) => (
            <article key={article.id} className="article-card group hover:scale-105 transition-transform duration-200">
              {/* 이미지 영역 */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[article.category as keyof typeof categoryColors]}`}>
                    {article.category}
                  </span>
                </div>
                {/* 팟캐스트 재생 버튼 */}
                <button className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <PlayIcon className="w-5 h-5 text-aid-primary-600 ml-0.5" />
                </button>
              </div>
              
              {/* 콘텐츠 영역 */}
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-aid-primary-700 transition-colors duration-200">
                  <Link href={`/article/${article.slug}`}>
                    {article.title}
                  </Link>
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="w-3 h-3" />
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="w-3 h-3" />
                      <span>{article.readTime}분 읽기</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link
            href="/archive"
            className="btn-secondary inline-flex items-center"
          >
            더 많은 뉴스 보기
          </Link>
        </div>
      </div>
    </section>
  )
}