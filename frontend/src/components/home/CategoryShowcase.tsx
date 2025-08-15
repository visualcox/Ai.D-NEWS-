import Link from 'next/link'
import { 
  CpuChipIcon, 
  LightBulbIcon, 
  MegaphoneIcon, 
  PaintBrushIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

const categories = [
  {
    name: 'IT/TECH',
    description: '최신 기술 트렌드, 개발 도구, 프로그래밍 소식을 전합니다',
    icon: CpuChipIcon,
    href: '/category/tech',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    stats: { articles: 24, subscribers: 1200 }
  },
  {
    name: 'AI',
    description: '인공지능, 머신러닝, 딥러닝 관련 최신 연구와 동향을 다룹니다',
    icon: LightBulbIcon,
    href: '/category/ai',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    stats: { articles: 32, subscribers: 1800 }
  },
  {
    name: 'Marketing',
    description: '디지털 마케팅, 브랜딩, 성장 전략에 대한 인사이트를 제공합니다',
    icon: MegaphoneIcon,
    href: '/category/marketing',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    stats: { articles: 18, subscribers: 950 }
  },
  {
    name: 'Design',
    description: 'UX/UI 디자인, 시각 디자인, 디자인 시스템 트렌드를 소개합니다',
    icon: PaintBrushIcon,
    href: '/category/design',
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-700',
    stats: { articles: 15, subscribers: 720 }
  }
]

export default function CategoryShowcase() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-title">분야별 뉴스</h2>
          <p className="section-subtitle">
            관심 있는 분야를 선택해서 맞춤형 뉴스를 받아보세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon
            
            return (
              <div
                key={category.name}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200"
              >
                {/* 아이콘과 그라데이션 배경 */}
                <div className={`w-16 h-16 ${category.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* 카테고리 정보 */}
                <h3 className={`text-xl font-bold ${category.textColor} mb-3`}>
                  {category.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  {category.description}
                </p>

                {/* 통계 정보 */}
                <div className="flex items-center justify-between mb-6 text-sm">
                  <div className="text-gray-500">
                    <span className="font-medium text-gray-900">{category.stats.articles}</span>개 기사
                  </div>
                  <div className="text-gray-500">
                    <span className="font-medium text-gray-900">{category.stats.subscribers.toLocaleString()}</span>명 구독
                  </div>
                </div>

                {/* CTA 버튼 */}
                <Link
                  href={category.href}
                  className={`inline-flex items-center justify-between w-full px-4 py-3 ${category.bgColor} ${category.textColor} rounded-xl font-medium hover:bg-opacity-80 transition-colors duration-200 group`}
                >
                  <span>뉴스 보기</span>
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            )
          })}
        </div>

        {/* 전체 구독 CTA */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              모든 분야의 뉴스를 한 번에
            </h3>
            <p className="text-gray-600 mb-6">
              4개 분야 모두 구독하고 매주 종합 뉴스레터를 받아보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/subscribe?all=true"
                className="btn-primary"
              >
                전체 구독하기
              </Link>
              <Link
                href="/subscribe"
                className="btn-secondary"
              >
                맞춤 구독하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}