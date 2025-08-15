'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  CpuChipIcon,
  LightBulbIcon,
  MegaphoneIcon,
  PaintBrushIcon
} from '@heroicons/react/24/outline'

const categories = [
  { name: '홈', href: '/', icon: HomeIcon },
  { name: 'IT/TECH', href: '/category/tech', icon: CpuChipIcon },
  { name: 'AI', href: '/category/ai', icon: LightBulbIcon },
  { name: 'Marketing', href: '/category/marketing', icon: MegaphoneIcon },
  { name: 'Design', href: '/category/design', icon: PaintBrushIcon },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          {/* 로고 */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 text-2xl font-display font-bold text-aid-primary-700"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-aid-primary-600 to-aid-accent-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <span>Ai.D NEWS</span>
          </Link>

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex items-center space-x-8">
            {categories.map((category) => {
              const Icon = category.icon
              const isActive = pathname === category.href
              
              return (
                <Link
                  key={category.name}
                  href={category.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-aid-primary-700 bg-aid-primary-50'
                      : 'text-gray-600 hover:text-aid-primary-700 hover:bg-aid-primary-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{category.name}</span>
                </Link>
              )
            })}
          </div>

          {/* 뉴스레터 구독 버튼 */}
          <div className="hidden md:block">
            <Link
              href="/subscribe"
              className="btn-primary"
            >
              뉴스레터 구독
            </Link>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-aid-primary-700 hover:bg-aid-primary-50"
          >
            {isOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 pt-4 mt-4">
            <div className="flex flex-col space-y-2">
              {categories.map((category) => {
                const Icon = category.icon
                const isActive = pathname === category.href
                
                return (
                  <Link
                    key={category.name}
                    href={category.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-aid-primary-700 bg-aid-primary-50'
                        : 'text-gray-600 hover:text-aid-primary-700 hover:bg-aid-primary-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{category.name}</span>
                  </Link>
                )
              })}
              <Link
                href="/subscribe"
                onClick={() => setIsOpen(false)}
                className="btn-primary mt-4"
              >
                뉴스레터 구독
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}