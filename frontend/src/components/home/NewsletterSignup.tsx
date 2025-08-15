'use client'

import { useState } from 'react'
import { CheckIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

const categories = [
  {
    id: 'tech',
    name: 'IT/TECH',
    description: '개발, 프로그래밍, 신기술 소식',
    subscribers: 1200
  },
  {
    id: 'ai',
    name: 'AI',
    description: '인공지능, 머신러닝, 딥러닝',
    subscribers: 1800
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: '디지털 마케팅, 브랜딩, 성장',
    subscribers: 950
  },
  {
    id: 'design',
    name: 'Design',
    description: 'UX/UI, 시각디자인, 디자인시스템',
    subscribers: 720
  }
]

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || selectedCategories.length === 0) return

    setIsSubmitting(true)

    // 실제로는 API 호출
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 2000)
  }

  if (isSubmitted) {
    return (
      <section className="py-16">
        <div className="container-custom">
          <div className="newsletter-form max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckIcon className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold mb-4">구독 완료!</h2>
            <p className="text-white/90 mb-6">
              {email}으로 첫 번째 뉴스레터를 곧 보내드리겠습니다.
            </p>
            <p className="text-white/75 text-sm">
              매주 토요일 오전 10시에 선택하신 분야의 최신 뉴스를 받아보실 수 있습니다.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="newsletter-form max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <EnvelopeIcon className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold mb-4">무료 뉴스레터 구독</h2>
            <p className="text-white/90 max-w-2xl mx-auto">
              AI가 큐레이션한 최신 뉴스를 매주 토요일 오전 10시에 받아보세요. 
              원하는 분야를 선택하여 맞춤형 뉴스레터를 구독할 수 있습니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 이메일 입력 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-3">
                이메일 주소
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                required
              />
            </div>

            {/* 카테고리 선택 */}
            <div>
              <label className="block text-sm font-medium mb-4">
                관심 분야 선택 <span className="text-white/70">(다중 선택 가능)</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="category-checkbox cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryToggle(category.id)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 border-white/30 flex items-center justify-center transition-colors duration-200 ${
                      selectedCategories.includes(category.id)
                        ? 'bg-white border-white'
                        : 'bg-transparent'
                    }`}>
                      {selectedCategories.includes(category.id) && (
                        <CheckIcon className="w-3 h-3 text-aid-primary-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{category.name}</span>
                        <span className="text-xs text-white/70">
                          {category.subscribers.toLocaleString()}명 구독
                        </span>
                      </div>
                      <p className="text-sm text-white/70 mt-1">
                        {category.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 제출 버튼 */}
            <div className="text-center">
              <button
                type="submit"
                disabled={!email || selectedCategories.length === 0 || isSubmitting}
                className="btn-primary bg-white text-aid-primary-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 text-lg font-semibold"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="spinner"></div>
                    <span>구독 중...</span>
                  </div>
                ) : (
                  '무료 구독하기'
                )}
              </button>
              
              {selectedCategories.length === 0 && (
                <p className="text-white/70 text-sm mt-2">
                  최소 하나의 분야를 선택해주세요.
                </p>
              )}
            </div>

            {/* 안내 문구 */}
            <div className="text-center">
              <p className="text-white/70 text-sm">
                구독은 언제든지 해지할 수 있으며, 개인정보는 안전하게 보호됩니다.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}