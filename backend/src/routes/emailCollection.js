import express from 'express'
import emailCollector from '../services/emailCollector.js'
import logger from '../utils/logger.js'

const router = express.Router()

/**
 * @route POST /api/email-collection/collect
 * @description Collect TLDR emails and update site content
 */
router.post('/collect', async (req, res) => {
  try {
    logger.info('Email collection requested')
    
    const options = {
      maxResults: req.body.maxResults || 50
    }

    const result = await emailCollector.collectTLDREmails(options)

    if (result.success) {
      logger.info(`Email collection successful: ${result.data.articleCount} articles collected`)
      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      })
    } else {
      logger.warn(`Email collection failed: ${result.message}`)
      res.status(500).json({
        success: false,
        message: result.message,
        error: result.data
      })
    }
  } catch (error) {
    logger.error('Email collection endpoint error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error during email collection',
      error: error.message
    })
  }
})

/**
 * @route GET /api/email-collection/articles
 * @description Get collected articles with filtering and pagination
 */
router.get('/articles', (req, res) => {
  try {
    const options = {
      category: req.query.category,
      featured: req.query.featured ? req.query.featured === 'true' : undefined,
      page: req.query.page,
      limit: req.query.limit
    }

    const result = emailCollector.getCollectedArticles(options)

    res.status(200).json({
      success: true,
      message: 'Articles retrieved successfully',
      data: result
    })
  } catch (error) {
    logger.error('Get collected articles error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve collected articles',
      error: error.message
    })
  }
})

/**
 * @route GET /api/email-collection/status
 * @description Get email collection status
 */
router.get('/status', (req, res) => {
  try {
    const status = emailCollector.getCollectionStatus()

    res.status(200).json({
      success: true,
      message: 'Collection status retrieved successfully',
      data: status
    })
  } catch (error) {
    logger.error('Get collection status error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve collection status',
      error: error.message
    })
  }
})

/**
 * @route POST /api/email-collection/initialize
 * @description Initialize email collector
 */
router.post('/initialize', async (req, res) => {
  try {
    const initialized = await emailCollector.initialize()

    if (initialized) {
      res.status(200).json({
        success: true,
        message: 'Email collector initialized successfully',
        data: { initialized: true }
      })
    } else {
      res.status(200).json({
        success: true,
        message: 'Email collector initialized with mock data (Gmail API not configured)',
        data: { initialized: false, usingMockData: true }
      })
    }
  } catch (error) {
    logger.error('Email collector initialization error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to initialize email collector',
      error: error.message
    })
  }
})

/**
 * @route DELETE /api/email-collection/clear
 * @description Clear collected articles
 */
router.delete('/clear', (req, res) => {
  try {
    emailCollector.clearCollectedArticles()

    res.status(200).json({
      success: true,
      message: 'Collected articles cleared successfully',
      data: null
    })
  } catch (error) {
    logger.error('Clear collected articles error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to clear collected articles',
      error: error.message
    })
  }
})

/**
 * @route GET /api/email-collection/auth/gmail
 * @description Get Gmail OAuth2 authorization URL
 */
router.get('/auth/gmail', (req, res) => {
  try {
    const authUrl = emailCollector.getGmailAuthUrl()

    res.status(200).json({
      success: true,
      message: 'Gmail authorization URL generated',
      data: { authUrl }
    })
  } catch (error) {
    logger.error('Gmail auth URL error:', error)
    res.status(500).json({
      success: false,
      message: 'Gmail authentication not configured',
      error: error.message
    })
  }
})

/**
 * @route POST /api/email-collection/auth/callback
 * @description Handle Gmail OAuth2 callback
 */
router.post('/auth/callback', async (req, res) => {
  try {
    const { code } = req.body

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Authorization code is required',
        error: 'Missing code parameter'
      })
    }

    const tokens = await emailCollector.handleGmailCallback(code)

    res.status(200).json({
      success: true,
      message: 'Gmail authentication successful',
      data: { authenticated: true, tokens }
    })
  } catch (error) {
    logger.error('Gmail auth callback error:', error)
    res.status(500).json({
      success: false,
      message: 'Gmail authentication failed',
      error: error.message
    })
  }
})

export default router