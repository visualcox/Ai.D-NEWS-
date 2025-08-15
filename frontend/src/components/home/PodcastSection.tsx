'use client'

import { useState } from 'react'
import { 
  PlayIcon, 
  PauseIcon, 
  SpeakerWaveIcon,
  ClockIcon,
  CalendarIcon 
} from '@heroicons/react/24/outline'

// 임시 팟캐스트 데이터
const latestPodcasts = [
  {
    id: 1,
    title: 'AI 분야 주간 브리핑 - 2024년 8월 2주차',
    description: 'OpenAI 최신 업데이트부터 구글의 새로운 AI 모델까지, 이번 주 AI 소식을 정리했습니다.',
    duration: '15:32',
    publishedAt: '2024-08-15T10:00:00Z',
    category: 'AI',
    audioUrl: '/audio/ai-weekly-20240815.mp3',
    listens: 1240
  },
  {
    id: 2,
    title: 'IT/TECH 분야 주간 브리핑 - 2024년 8월 2주차',
    description: '새로운 개발 프레임워크와 클라우드 서비스 업데이트를 다룹니다.',
    duration: '12:45',
    publishedAt: '2024-08-15T10:00:00Z',
    category: 'IT/TECH',
    audioUrl: '/audio/tech-weekly-20240815.mp3',
    listens: 890
  },
  {
    id: 3,
    title: 'Marketing 분야 주간 브리핑 - 2024년 8월 2주차',
    description: '소셜미디어 마케팅 트렌드와 새로운 광고 플랫폼 소식을 전합니다.',
    duration: '11:20',
    publishedAt: '2024-08-15T10:00:00Z',
    category: 'Marketing',
    audioUrl: '/audio/marketing-weekly-20240815.mp3',
    listens: 650
  }
]

const categoryColors = {
  'AI': 'from-purple-500 to-purple-600',
  'IT/TECH': 'from-blue-500 to-blue-600',
  'Marketing': 'from-green-500 to-green-600',
  'Design': 'from-pink-500 to-pink-600'
}

export default function PodcastSection() {
  const [playingId, setPlayingId] = useState<number | null>(null)

  const togglePlay = (podcastId: number) => {
    if (playingId === podcastId) {
      setPlayingId(null)
    } else {
      setPlayingId(podcastId)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-aid-accent-100 text-aid-accent-700 rounded-full text-sm font-medium mb-4">
            <SpeakerWaveIcon className="w-4 h-4 mr-2" />
            주간 팟캐스트
          </div>
          <h2 className="section-title">음성으로 듣는 뉴스</h2>
          <p className="section-subtitle">
            AI가 생성한 음성으로 주요 뉴스를 편리하게 들어보세요
          </p>
        </div>

        {/* 메인 팟캐스트 플레이어 */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 mb-8 text-white">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* 플레이어 컨트롤 */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  최신 에피소드
                </span>
                <span className="text-gray-300 text-sm">
                  {formatDate(latestPodcasts[0].publishedAt)}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold mb-2">
                {latestPodcasts[0].title}
              </h3>
              
              <p className="text-gray-300 mb-6">
                {latestPodcasts[0].description}
              </p>

              {/* 플레이 컨트롤 */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => togglePlay(latestPodcasts[0].id)}
                  className="w-16 h-16 bg-white text-gray-900 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
                >
                  {playingId === latestPodcasts[0].id ? (
                    <PauseIcon className="w-8 h-8" />
                  ) : (
                    <PlayIcon className="w-8 h-8 ml-1" />
                  )}
                </button>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
                    <span>0:00</span>
                    <span>{latestPodcasts[0].duration}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-white rounded-full h-2 transition-all duration-300"
                      style={{ width: playingId === latestPodcasts[0].id ? '35%' : '0%' }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <SpeakerWaveIcon className="w-4 h-4" />
                  <span>{latestPodcasts[0].listens.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* 시각적 요소 */}
            <div className="w-48 h-48 bg-gradient-to-br from-aid-primary-500 to-aid-accent-500 rounded-2xl flex items-center justify-center">
              <SpeakerWaveIcon className="w-24 h-24 text-white" />
            </div>
          </div>
        </div>

        {/* 다른 팟캐스트 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {latestPodcasts.slice(1).map((podcast) => (
            <div key={podcast.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start gap-4">
                {/* 플레이 버튼 */}
                <button
                  onClick={() => togglePlay(podcast.id)}
                  className={`w-12 h-12 bg-gradient-to-br ${categoryColors[podcast.category as keyof typeof categoryColors]} text-white rounded-xl flex items-center justify-center hover:scale-105 transition-transform duration-200`}
                >
                  {playingId === podcast.id ? (
                    <PauseIcon className="w-5 h-5" />
                  ) : (
                    <PlayIcon className="w-5 h-5 ml-0.5" />
                  )}
                </button>

                {/* 콘텐츠 */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                      {podcast.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <ClockIcon className="w-3 h-3" />
                      <span>{podcast.duration}</span>
                    </div>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {podcast.title}
                  </h4>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {podcast.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3" />
                      <span>{formatDate(podcast.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <SpeakerWaveIcon className="w-3 h-3" />
                      <span>{podcast.listens.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 더 보기 버튼 */}
        <div className="text-center mt-8">
          <a
            href="/podcast"
            className="btn-secondary inline-flex items-center"
          >
            모든 팟캐스트 보기
          </a>
        </div>
      </div>
    </section>
  )
}