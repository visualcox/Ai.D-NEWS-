import logger from '../utils/logger.js'
import emailCollector from '../services/emailCollector.js'

// Mock data for demonstration
const mockArticles = [
  {
    id: 1,
    title: 'OpenAI GPT-4 Turbo 새로운 업데이트 소식',
    slug: 'openai-gpt4-turbo-update',
    excerpt: 'GPT-4 Turbo의 최신 기능과 성능 개선사항에 대한 상세한 분석을 제공합니다.',
    content: 'GPT-4 Turbo의 최신 업데이트 내용...',
    category: { id: 2, name: 'AI', slug: 'ai', color: '#8B5CF6' },
    featured: true,
    published: true,
    publishedAt: '2024-08-15T10:00:00Z',
    readTime: 5,
    viewCount: 1240
  },
  {
    id: 2,
    title: '2024년 UX/UI 디자인 트렌드 분석',
    slug: 'ux-ui-design-trends-2024',
    excerpt: '올해 주목해야 할 디자인 트렌드와 실무에 적용할 수 있는 핵심 요소들을 정리했습니다.',
    content: '2024년 디자인 트렌드 분석...',
    category: { id: 4, name: 'Design', slug: 'design', color: '#F59E0B' },
    featured: true,
    published: true,
    publishedAt: '2024-08-15T10:00:00Z',
    readTime: 7,
    viewCount: 890
  },
  {
    id: 3,
    title: '마케팅에서 AI 활용 사례 10가지',
    slug: 'ai-marketing-use-cases',
    excerpt: '실제 기업들이 AI를 마케팅에 활용한 성공 사례들과 실무 적용 방법을 소개합니다.',
    content: 'AI 마케팅 활용 사례...',
    category: { id: 3, name: 'Marketing', slug: 'marketing', color: '#10B981' },
    featured: true,
    published: true,
    publishedAt: '2024-08-15T10:00:00Z',
    readTime: 6,
    viewCount: 650
  }
]

/**
 * @desc    Get all articles with pagination and filtering
 * @route   GET /api/articles
 * @access  Public
 */
export const getArticles = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      sortBy = 'publishedAt', 
      sortOrder = 'desc',
      includeCollected = 'true'
    } = req.query

    // Get collected articles from email collector
    let allArticles = [...mockArticles]
    
    if (includeCollected === 'true') {
      try {
        const collectedResult = emailCollector.getCollectedArticles({ 
          category: category ? category.toLowerCase() : undefined 
        })
        
        // Add unique IDs to collected articles and merge
        const collectedArticles = collectedResult.articles.map((article, index) => ({
          ...article,
          id: 1000 + index, // Use higher IDs for collected articles
          source: 'TLDR Newsletter'
        }))
        
        allArticles = [...allArticles, ...collectedArticles]
        logger.info(`Merged ${collectedArticles.length} collected articles with ${mockArticles.length} mock articles`)
      } catch (error) {
        logger.warn('Failed to get collected articles, using mock data only:', error)
      }
    }
    
    // Filter by category if specified
    let filteredArticles = allArticles
    if (category) {
      filteredArticles = allArticles.filter(a => a.category.slug === category.toLowerCase())
    }

    // Sort articles
    filteredArticles.sort((a, b) => {
      if (sortBy === 'publishedAt') {
        return sortOrder === 'desc' 
          ? new Date(b.publishedAt) - new Date(a.publishedAt)
          : new Date(a.publishedAt) - new Date(b.publishedAt)
      }
      return 0
    })

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + parseInt(limit)
    const articles = filteredArticles.slice(startIndex, endIndex)
    const total = filteredArticles.length

    const totalPages = Math.ceil(total / limit)

    res.status(200).json({
      success: true,
      data: {
        articles,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit),
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    })
  } catch (error) {
    logger.error('Error in getArticles:', error)
    next(error)
  }
}

/**
 * @desc    Get single article by ID
 * @route   GET /api/articles/:id
 * @access  Public
 */
export const getArticleById = async (req, res, next) => {
  try {
    const { id } = req.params

    const article = mockArticles.find(a => 
      a.id === parseInt(id) || a.slug === id
    )

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      })
    }

    res.status(200).json({
      success: true,
      data: article
    })
  } catch (error) {
    logger.error('Error in getArticleById:', error)
    next(error)
  }
}

/**
 * @desc    Get articles by category
 * @route   GET /api/articles/category/:categoryId
 * @access  Public
 */
export const getArticlesByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params
    const { page = 1, limit = 10 } = req.query

    const offset = (page - 1) * limit

    const filteredArticles = mockArticles.filter(a => 
      a.category.id === parseInt(categoryId) || a.category.slug === categoryId
    )

    if (filteredArticles.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      })
    }

    const category = filteredArticles[0].category
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + parseInt(limit)
    const articles = filteredArticles.slice(startIndex, endIndex)
    const total = filteredArticles.length

    const totalPages = Math.ceil(total / limit)

    res.status(200).json({
      success: true,
      data: {
        category,
        articles,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit),
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    })
  } catch (error) {
    logger.error('Error in getArticlesByCategory:', error)
    next(error)
  }
}

/**
 * @desc    Get featured articles
 * @route   GET /api/articles/featured
 * @access  Public
 */
export const getFeaturedArticles = async (req, res, next) => {
  try {
    const { limit = 6 } = req.query

    const featuredArticles = mockArticles
      .filter(a => a.featured)
      .slice(0, parseInt(limit))

    res.status(200).json({
      success: true,
      data: featuredArticles
    })
  } catch (error) {
    logger.error('Error in getFeaturedArticles:', error)
    next(error)
  }
}

/**
 * @desc    Search articles
 * @route   GET /api/articles/search
 * @access  Public
 */
export const searchArticles = async (req, res, next) => {
  try {
    const { 
      q, 
      page = 1, 
      limit = 10, 
      category 
    } = req.query

    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      })
    }

    const offset = (page - 1) * limit
    
    const whereClause = {
      published: true,
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { excerpt: { contains: q, mode: 'insensitive' } },
        { content: { contains: q, mode: 'insensitive' } }
      ],
      ...(category && { category: { slug: category } })
    }

    let searchResults = mockArticles.filter(a => 
      a.title.toLowerCase().includes(q.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(q.toLowerCase()) ||
      a.content.toLowerCase().includes(q.toLowerCase())
    )
    
    if (category) {
      searchResults = searchResults.filter(a => a.category.slug === category)
    }

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + parseInt(limit)
    const articles = searchResults.slice(startIndex, endIndex)
    const total = searchResults.length

    const totalPages = Math.ceil(total / limit)

    res.status(200).json({
      success: true,
      data: {
        articles,
        searchQuery: q,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit),
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    })
  } catch (error) {
    logger.error('Error in searchArticles:', error)
    next(error)
  }
}