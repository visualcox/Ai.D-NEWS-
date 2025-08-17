import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

// Import routes
import articlesRouter from './routes/articles.js'
import categoriesRouter from './routes/categories.js'
import subscriptionsRouter from './routes/subscriptions.js'
import podcastsRouter from './routes/podcasts.js'
import emailRouter from './routes/email.js'
import emailCollectionRouter from './routes/emailCollection.js'
import authRouter from './routes/auth.js'

// Import middleware
import { errorHandler } from './middleware/errorHandler.js'
import { requestLogger } from './middleware/requestLogger.js'

// Import services
import { startScheduler } from './services/scheduler.js'
import logger from './utils/logger.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
})

// Security middleware
app.use(helmet())
app.use(compression())
app.use(limiter)

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://3000-i402476dd7n2ezs3gvmuv-6532622b.e2b.dev',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Request logging
app.use(requestLogger)

// Root endpoint - API information
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Ai.D NEWS API Server',
    version: '1.0.0',
    description: 'Automated news curation API for IT/TECH, AI, Marketing, and Design content',
    status: 'Online',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/health',
      articles: '/api/articles',
      categories: '/api/categories', 
      subscriptions: '/api/subscriptions',
      podcasts: '/api/podcasts',
      email: '/api/email',
      emailCollection: '/api/email-collection',
      auth: '/api/auth'
    },
    documentation: '/api/docs'
  })
})

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.status(200).json({
    title: 'Ai.D NEWS API Documentation',
    version: '1.0.0',
    baseUrl: req.protocol + '://' + req.get('host'),
    endpoints: [
      {
        path: '/health',
        method: 'GET',
        description: 'Health check endpoint',
        response: { status: 'OK', timestamp: 'ISO string', environment: 'string' }
      },
      {
        path: '/api/articles',
        method: 'GET',
        description: 'Get all published articles',
        queryParams: { page: 'number', limit: 'number', category: 'string' },
        response: { success: 'boolean', data: { articles: 'array', pagination: 'object' } }
      },
      {
        path: '/api/articles/featured',
        method: 'GET', 
        description: 'Get featured articles',
        response: { success: 'boolean', data: { articles: 'array' } }
      },
      {
        path: '/api/categories',
        method: 'GET',
        description: 'Get all content categories',
        response: { success: 'boolean', data: { categories: 'array' } }
      },
      {
        path: '/api/subscriptions',
        method: 'POST',
        description: 'Create newsletter subscription',
        body: { email: 'string', categories: 'array' },
        response: { success: 'boolean', message: 'string', data: 'object' }
      },
      {
        path: '/api/podcasts',
        method: 'GET',
        description: 'Get podcast episodes',
        queryParams: { category: 'string', limit: 'number' },
        response: { success: 'boolean', data: { episodes: 'array' } }
      },
      {
        path: '/api/email-collection/collect',
        method: 'POST',
        description: 'Collect TLDR emails and update site content',
        body: { maxResults: 'number (optional, default: 50)' },
        response: { success: 'boolean', message: 'string', data: 'object' }
      },
      {
        path: '/api/email-collection/articles',
        method: 'GET',
        description: 'Get collected articles from TLDR emails',
        queryParams: { category: 'string', featured: 'boolean', page: 'number', limit: 'number' },
        response: { success: 'boolean', data: { articles: 'array', pagination: 'object' } }
      },
      {
        path: '/api/email-collection/status',
        method: 'GET',
        description: 'Get email collection status and statistics',
        response: { success: 'boolean', data: 'object' }
      },
      {
        path: '/api/email-collection/initialize',
        method: 'POST',
        description: 'Initialize email collector service',
        response: { success: 'boolean', data: { initialized: 'boolean' } }
      },
      {
        path: '/api/auth/gmail',
        method: 'GET',
        description: 'Get Gmail OAuth2 authorization URL or authentication page',
        response: { success: 'boolean', data: { authUrl: 'string' } }
      },
      {
        path: '/api/auth/gmail/callback',
        method: 'POST', 
        description: 'Handle Gmail OAuth2 callback with authorization code',
        body: { code: 'string (required)' },
        response: { success: 'boolean', data: { authenticated: 'boolean' } }
      },
      {
        path: '/api/auth/gmail/status',
        method: 'GET',
        description: 'Check Gmail authentication status',
        response: { success: 'boolean', data: { isAuthenticated: 'boolean' } }
      }
    ],
    categories: ['tech', 'ai', 'marketing', 'design'],
    features: [
      'Automated email collection from TLDR Newsletter',
      'Content categorization using AI',
      'Weekly newsletter generation',
      'Podcast creation and streaming',
      'Multi-category subscriptions',
      'Scheduled content updates every Saturday 10:00 AM KST'
    ]
  })
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// API routes
app.use('/api/articles', articlesRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/subscriptions', subscriptionsRouter)
app.use('/api/podcasts', podcastsRouter)
app.use('/api/email', emailRouter)
app.use('/api/email-collection', emailCollectionRouter)
app.use('/api/auth', authRouter)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  })
})

// Error handling middleware
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Ai.D NEWS API Server running on port ${PORT}`)
  logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
  logger.info(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`)
  
  // Start the scheduler for automated tasks
  if (process.env.NODE_ENV !== 'test') {
    startScheduler()
    logger.info('📅 Scheduler started - Weekly updates on Saturday 10:00 AM KST')
  }
})

// Graceful shutdown
const gracefulShutdown = (signal) => {
  logger.info(`🛑 ${signal} received, shutting down gracefully`)
  
  process.exit(0)
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

export default app