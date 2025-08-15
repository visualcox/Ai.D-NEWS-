import express from 'express'
import { 
  getArticles, 
  getArticleById, 
  getArticlesByCategory,
  getFeaturedArticles,
  searchArticles
} from '../controllers/articles.js'
import { validateQuery } from '../middleware/validation.js'
import { articleQuerySchema } from '../utils/validation.js'

const router = express.Router()

/**
 * @route   GET /api/articles
 * @desc    Get all articles with pagination and filtering
 * @access  Public
 */
router.get('/', validateQuery(articleQuerySchema), getArticles)

/**
 * @route   GET /api/articles/featured
 * @desc    Get featured articles
 * @access  Public
 */
router.get('/featured', getFeaturedArticles)

/**
 * @route   GET /api/articles/search
 * @desc    Search articles
 * @access  Public
 */
router.get('/search', searchArticles)

/**
 * @route   GET /api/articles/category/:categoryId
 * @desc    Get articles by category
 * @access  Public
 */
router.get('/category/:categoryId', getArticlesByCategory)

/**
 * @route   GET /api/articles/:id
 * @desc    Get single article by ID
 * @access  Public
 */
router.get('/:id', getArticleById)

export default router