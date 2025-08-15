import Link from 'next/link'
import { SparklesIcon, ClockIcon, GlobeAltIcon } from '@heroicons/react/24/outline'

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-aid-primary-50 via-white to-aid-accent-50 py-20">
      <div className="container-custom">
        <div className="text-center max-w-4xl mx-auto">
          {/* 배지 */}
          <div className="inline-flex items-center px-4 py-2 bg-aid-primary-100 text-aid-primary-700 rounded-full text-sm font-medium mb-6">
            <SparklesIcon className="w-4 h-4 mr-2" />
            AI 기반 자동 큐레이션
          </div>
          
          {/* 메인 헤딩 */}
          <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-6 leading-tight">
            <span className="text-aid-primary-700">Ai.D NEWS</span>
            <br />
            <span className="text-gray-700">스마트한 뉴스 큐레이션</span>
          </h1>
          
          {/* 서브 헤딩 */}
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            IT/TECH, AI, Marketing, Design 분야의 최신 소식을 AI가 자동으로 분석하고 정리하여 
            매주 토요일 오전 10시에 전달합니다.
          </p>
          
          {/* CTA 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/subscribe"
              className="btn-primary text-lg px-8 py-3"
            >
              무료 뉴스레터 구독
            </Link>
            <Link
              href="/archive"
              className="btn-secondary text-lg px-8 py-3"
            >
              지난 뉴스 보기
            </Link>
          </div>
          
          {/* 특징 카드들 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-aid-primary-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <SparklesIcon className="w-6 h-6 text-aid-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI 자동 분류</h3>
              <p className="text-gray-600 text-sm">
                머신러닝 알고리즘이 뉴스를 4개 분야로 자동 분류하고 중요도를 분석합니다.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-aid-accent-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <ClockIcon className="w-6 h-6 text-aid-accent-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">정시 업데이트</h3>
              <p className="text-gray-600 text-sm">
                매주 토요일 오전 10시 정확히 최신 뉴스로 업데이트됩니다.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <GlobeAltIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">맞춤형 구독</h3>
              <p className="text-gray-600 text-sm">
                원하는 분야만 선택해서 맞춤형 뉴스레터를 받아보세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}