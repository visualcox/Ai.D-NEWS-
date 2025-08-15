import logger from '../utils/logger.js'

export const requestLogger = (req, res, next) => {
  const start = Date.now()
  
  // Log request
  logger.info(`${req.method} ${req.originalUrl} - ${req.ip}`)
  
  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info'
    
    logger[logLevel](`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`)
  })
  
  next()
}