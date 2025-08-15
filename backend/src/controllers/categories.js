import logger from '../utils/logger.js'

// Mock data for demonstration
const mockCategories = [
  {
    id: 1,
    name: 'IT/TECH',
    slug: 'tech',
    description: '최신 기술 트렌드, 개발 도구, 프로그래밍 소식',
    color: '#3B82F6',
    icon: 'CpuChipIcon',
    isActive: true,
    articleCount: 15,
    podcastCount: 8
  },
  {
    id: 2,
    name: 'AI',
    slug: 'ai',
    description: '인공지능, 머신러닝, 딥러닝 관련 최신 연구와 동향',
    color: '#8B5CF6',
    icon: 'LightBulbIcon',
    isActive: true,
    articleCount: 20,
    podcastCount: 12
  },
  {
    id: 3,
    name: 'Marketing',
    slug: 'marketing',
    description: '디지털 마케팅, 브랜딩, 성장 전략에 대한 인사이트',
    color: '#10B981',
    icon: 'MegaphoneIcon',
    isActive: true,
    articleCount: 12,
    podcastCount: 5
  },
  {
    id: 4,
    name: 'Design',
    slug: 'design',
    description: 'UX/UI 디자인, 시각 디자인, 디자인 시스템 트렌드',
    color: '#F59E0B',
    icon: 'PaintBrushIcon',
    isActive: true,
    articleCount: 10,
    podcastCount: 4
  }
]

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
export const getCategories = async (req, res, next) => {
  try {
    const categories = mockCategories.filter(c => c.isActive)

    res.status(200).json({
      success: true,
      data: categories
    })
  } catch (error) {
    logger.error('Error in getCategories:', error)
    next(error)
  }
}

/**
 * @desc    Get single category by ID or slug
 * @route   GET /api/categories/:id
 * @access  Public
 */
export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params

    const category = mockCategories.find(c => 
      (c.id === parseInt(id) || c.slug === id) && c.isActive
    )

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      })
    }

    res.status(200).json({
      success: true,
      data: category
    })
  } catch (error) {
    logger.error('Error in getCategoryById:', error)
    next(error)
  }
}