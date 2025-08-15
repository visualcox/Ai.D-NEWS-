import logger from '../utils/logger.js'

export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false })
    
    if (error) {
      const errorMessages = error.details.map(detail => detail.message)
      logger.warn(`Validation error: ${errorMessages.join(', ')}`)
      
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errorMessages
      })
    }
    
    next()
  }
}

export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query, { abortEarly: false })
    
    if (error) {
      const errorMessages = error.details.map(detail => detail.message)
      logger.warn(`Query validation error: ${errorMessages.join(', ')}`)
      
      return res.status(400).json({
        success: false,
        error: 'Query validation failed',
        details: errorMessages
      })
    }
    
    next()
  }
}

export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params, { abortEarly: false })
    
    if (error) {
      const errorMessages = error.details.map(detail => detail.message)
      logger.warn(`Params validation error: ${errorMessages.join(', ')}`)
      
      return res.status(400).json({
        success: false,
        error: 'Parameters validation failed',
        details: errorMessages
      })
    }
    
    next()
  }
}