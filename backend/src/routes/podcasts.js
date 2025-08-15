import express from 'express'
import { 
  getPodcasts, 
  getPodcastById, 
  getPodcastsByCategory,
  getFeaturedPodcasts
} from '../controllers/podcasts.js'
import { validateQuery } from '../middleware/validation.js'
import { podcastQuerySchema } from '../utils/validation.js'

const router = express.Router()

/**
 * @route   GET /api/podcasts
 * @desc    Get all podcasts with pagination and filtering
 * @access  Public
 */
router.get('/', validateQuery(podcastQuerySchema), getPodcasts)

/**
 * @route   GET /api/podcasts/featured
 * @desc    Get featured podcasts
 * @access  Public
 */
router.get('/featured', getFeaturedPodcasts)

/**
 * @route   GET /api/podcasts/category/:categoryId
 * @desc    Get podcasts by category
 * @access  Public
 */
router.get('/category/:categoryId', getPodcastsByCategory)

/**
 * @route   GET /api/podcasts/:id
 * @desc    Get single podcast by ID
 * @access  Public
 */
router.get('/:id', getPodcastById)

export default router