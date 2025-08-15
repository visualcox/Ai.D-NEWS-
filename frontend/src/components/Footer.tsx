import Link from 'next/link'

const categories = [
  { name: 'IT/TECH', href: '/category/tech' },
  { name: 'AI', href: '/category/ai' },
  { name: 'Marketing', href: '/category/marketing' },
  { name: 'Design', href: '/category/design' },
]

const quickLinks = [
  { name: '뉴스레터 구독', href: '/subscribe' },
  { name: '팟캐스트', href: '/podcast' },
  { name: '아카이브', href: '/archive' },
  { name: '소개', href: '/about' },
]

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 브랜드 정보 */}
          <div className="col-span-1 md:col-span-2">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-2xl font-display font-bold text-aid-primary-700 mb-4"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-aid-primary-600 to-aid-accent-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
              <span>Ai.D NEWS</span>
            </Link>
            <p className="text-gray-600 mb-4 max-w-md">
              AI 기반 자동화된 뉴스 큐레이션으로 IT/TECH, AI, Marketing, Design 분야의 
              최신 소식을 매주 전달합니다.
            </p>
            <p className="text-sm text-gray-500">
              매주 토요일 오전 10시 업데이트
            </p>
          </div>

          {/* 카테고리 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">카테고리</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="text-gray-600 hover:text-aid-primary-700 transition-colors duration-200"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 빠른 링크 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">빠른 링크</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-aid-primary-700 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 하단 구분선 및 저작권 */}
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2024 Ai.D NEWS. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="text-gray-500 hover:text-aid-primary-700 text-sm transition-colors duration-200"
            >
              개인정보처리방침
            </Link>
            <Link
              href="/terms"
              className="text-gray-500 hover:text-aid-primary-700 text-sm transition-colors duration-200"
            >
              이용약관
            </Link>
            <Link
              href="/contact"
              className="text-gray-500 hover:text-aid-primary-700 text-sm transition-colors duration-200"
            >
              문의하기
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}