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