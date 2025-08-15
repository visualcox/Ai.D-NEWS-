import Joi from 'joi'

// Article validation schemas
export const articleQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  category: Joi.string().valid('tech', 'ai', 'marketing', 'design'),
  sortBy: Joi.string().valid('publishedAt', 'title', 'readTime', 'viewCount').default('publishedAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  featured: Joi.boolean(),
  published: Joi.boolean().default(true)
})

// Subscription validation schemas
export const subscriptionCreateSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  categories: Joi.array()
    .items(Joi.string().valid('tech', 'ai', 'marketing', 'design'))
    .min(1)
    .required()
    .messages({
      'array.min': 'Please select at least one category',
      'any.required': 'Categories are required'
    }),
  preferences: Joi.object({
    frequency: Joi.string().valid('weekly', 'daily').default('weekly'),
    format: Joi.string().valid('html', 'text').default('html'),
    timezone: Joi.string().default('Asia/Seoul'),
    language: Joi.string().valid('ko', 'en').default('ko')
  }).default({})
})

export const subscriptionUpdateSchema = Joi.object({
  categories: Joi.array()
    .items(Joi.string().valid('tech', 'ai', 'marketing', 'design'))
    .min(1),
  preferences: Joi.object({
    frequency: Joi.string().valid('weekly', 'daily'),
    format: Joi.string().valid('html', 'text'),
    timezone: Joi.string(),
    language: Joi.string().valid('ko', 'en')
  })
}).min(1)

// Email validation schemas
export const emailSendSchema = Joi.object({
  to: Joi.alternatives().try(
    Joi.string().email(),
    Joi.array().items(Joi.string().email()).min(1)
  ).required(),
  subject: Joi.string().min(1).max(200).required(),
  content: Joi.string().min(1).required(),
  category: Joi.string().valid('tech', 'ai', 'marketing', 'design'),
  template: Joi.string().valid('newsletter', 'welcome', 'verification')
})

// Search validation schemas
export const searchSchema = Joi.object({
  q: Joi.string().min(1).max(100).required().messages({
    'string.min': 'Search query must be at least 1 character long',
    'string.max': 'Search query must be less than 100 characters',
    'any.required': 'Search query is required'
  }),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  category: Joi.string().valid('tech', 'ai', 'marketing', 'design')
})

// Podcast validation schemas
export const podcastQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  category: Joi.string().valid('tech', 'ai', 'marketing', 'design'),
  sortBy: Joi.string().valid('publishedAt', 'title', 'duration', 'listens').default('publishedAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc')
})