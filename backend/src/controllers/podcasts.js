import logger from '../utils/logger.js'

// Mock data for demonstration
const mockPodcasts = [
  {
    id: 1,
    title: 'AI 분야 주간 브리핑 - 2024년 8월 2주차',
    description: 'OpenAI 최신 업데이트부터 구글의 새로운 AI 모델까지, 이번 주 AI 소식을 정리했습니다.',
    audioUrl: '/audio/ai-weekly-20240815.mp3',
    duration: '15:32',
    publishedAt: '2024-08-15T10:00:00Z',
    category: { id: 2, name: 'AI', slug: 'ai', color: '#8B5CF6' },
    listens: 1240,
    ttsProvider: 'elevenlabs',
    voiceId: 'news-anchor-male'
  },
  {
    id: 2,
    title: 'IT/TECH 분야 주간 브리핑 - 2024년 8월 2주차',
    description: '새로운 개발 프레임워크와 클라우드 서비스 업데이트를 다룹니다.',
    audioUrl: '/audio/tech-weekly-20240815.mp3',
    duration: '12:45',
    publishedAt: '2024-08-15T10:00:00Z',
    category: { id: 1, name: 'IT/TECH', slug: 'tech', color: '#3B82F6' },
    listens: 890,
    ttsProvider: 'elevenlabs',
    voiceId: 'news-anchor-female'
  }
]

/**
 * @desc    Get all podcasts with pagination and filtering
 * @route   GET /api/podcasts
 * @access  Public
 */
export const getPodcasts = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      sortBy = 'publishedAt', 
      sortOrder = 'desc' 
    } = req.query

    let filteredPodcasts = [...mockPodcasts]
    
    if (category) {
      filteredPodcasts = filteredPodcasts.filter(p => p.category.slug === category)
    }

    // Simple sorting
    filteredPodcasts.sort((a, b) => {
      if (sortBy === 'publishedAt') {
        return sortOrder === 'desc' 
          ? new Date(b.publishedAt) - new Date(a.publishedAt)
          : new Date(a.publishedAt) - new Date(b.publishedAt)
      }
      return 0
    })

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + parseInt(limit)
    const paginatedPodcasts = filteredPodcasts.slice(startIndex, endIndex)

    const totalPages = Math.ceil(filteredPodcasts.length / limit)

    res.status(200).json({
      success: true,
      data: {
        podcasts: paginatedPodcasts,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: filteredPodcasts.length,
          itemsPerPage: parseInt(limit),
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    })
  } catch (error) {
    logger.error('Error in getPodcasts:', error)
    next(error)
  }
}

/**
 * @desc    Get single podcast by ID
 * @route   GET /api/podcasts/:id
 * @access  Public
 */
export const getPodcastById = async (req, res, next) => {
  try {
    const { id } = req.params
    const podcast = mockPodcasts.find(p => p.id === parseInt(id))

    if (!podcast) {
      return res.status(404).json({
        success: false,
        error: 'Podcast not found'
      })
    }

    res.status(200).json({
      success: true,
      data: podcast
    })
  } catch (error) {
    logger.error('Error in getPodcastById:', error)
    next(error)
  }
}

/**
 * @desc    Get podcasts by category
 * @route   GET /api/podcasts/category/:categoryId
 * @access  Public
 */
export const getPodcastsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params
    const filteredPodcasts = mockPodcasts.filter(p => 
      p.category.id === parseInt(categoryId) || p.category.slug === categoryId
    )

    res.status(200).json({
      success: true,
      data: {
        podcasts: filteredPodcasts,
        category: filteredPodcasts[0]?.category
      }
    })
  } catch (error) {
    logger.error('Error in getPodcastsByCategory:', error)
    next(error)
  }
}

/**
 * @desc    Get featured podcasts
 * @route   GET /api/podcasts/featured
 * @access  Public
 */
export const getFeaturedPodcasts = async (req, res, next) => {
  try {
    const { limit = 3 } = req.query
    const featuredPodcasts = mockPodcasts.slice(0, parseInt(limit))

    res.status(200).json({
      success: true,
      data: featuredPodcasts
    })
  } catch (error) {
    logger.error('Error in getFeaturedPodcasts:', error)
    next(error)
  }
}