import logger from '../utils/logger.js'

export const requestLogger = (req, res, next) => {
  const start = Date.now()
  
  // Log request with more details
  logger.info(`${req.method} ${req.originalUrl} - ${req.ip} - Origin: ${req.get('Origin') || 'none'} - User-Agent: ${req.get('User-Agent')?.substring(0, 50) || 'none'}`)
  
  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info'
    
    logger[logLevel](`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms - CORS: ${res.get('Access-Control-Allow-Origin') || 'none'}`)
  })
  
  next()
}