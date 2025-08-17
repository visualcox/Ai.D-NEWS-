import gmailService from '../config/gmail.js'
import contentParser from './contentParser.js'
import logger from '../utils/logger.js'

class EmailCollector {
  constructor() {
    this.isProcessing = false
    this.lastCollectionDate = null
    this.collectedArticles = []
  }

  /**
   * Initialize the email collector
   */
  async initialize() {
    try {
      const initialized = await gmailService.initialize()
      if (initialized) {
        logger.info('Email collector initialized with Gmail API')
      } else {
        logger.info('Email collector initialized with mock data')
      }
      return true
    } catch (error) {
      logger.error('Failed to initialize email collector:', error)
      return false
    }
  }

  /**
   * Collect and process TLDR emails
   */
  async collectTLDREmails(options = {}) {
    if (this.isProcessing) {
      logger.warn('Email collection already in progress')
      return {
        success: false,
        message: 'Collection already in progress',
        data: null
      }
    }

    this.isProcessing = true
    
    try {
      logger.info('Starting TLDR email collection...')
      
      const maxResults = options.maxResults || 50
      const emails = await gmailService.searchTLDREmails(maxResults)
      
      if (!emails || emails.length === 0) {
        logger.warn('No TLDR emails found')
        return {
          success: true,
          message: 'No emails found',
          data: { articles: [], emailCount: 0, articleCount: 0 }
        }
      }

      logger.info(`Found ${emails.length} TLDR emails, processing content...`)
      
      const allArticles = []
      let processedEmails = 0

      for (const email of emails) {
        try {
          const articles = contentParser.parseEmailContent(email)
          
          // Add email metadata to articles
          articles.forEach(article => {
            article.emailId = email.id
            article.emailDate = email.date
            article.emailSubject = email.subject
          })
          
          allArticles.push(...articles)
          processedEmails++
          
          logger.info(`Processed email "${email.subject}" - extracted ${articles.length} articles`)
        } catch (error) {
          logger.error(`Failed to process email ${email.id}:`, error)
        }
      }

      // Remove duplicates and sort by date
      const uniqueArticles = this.removeDuplicateArticles(allArticles)
      const sortedArticles = uniqueArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))

      // Store articles for later retrieval
      this.collectedArticles = sortedArticles
      this.lastCollectionDate = new Date()

      logger.info(`Email collection completed: ${processedEmails} emails processed, ${sortedArticles.length} unique articles extracted`)

      return {
        success: true,
        message: 'Email collection completed successfully',
        data: {
          articles: sortedArticles,
          emailCount: processedEmails,
          articleCount: sortedArticles.length,
          collectionDate: this.lastCollectionDate,
          categories: this.getCategoryStats(sortedArticles)
        }
      }

    } catch (error) {
      logger.error('Email collection failed:', error)
      return {
        success: false,
        message: 'Email collection failed: ' + error.message,
        data: null
      }
    } finally {
      this.isProcessing = false
    }
  }

  /**
   * Remove duplicate articles based on title similarity
   */
  removeDuplicateArticles(articles) {
    const uniqueArticles = []
    const seenTitles = new Set()

    for (const article of articles) {
      const normalizedTitle = article.title.toLowerCase().replace(/[^a-z0-9]/g, '')
      
      // Check if we've seen a very similar title
      let isDuplicate = false
      for (const seenTitle of seenTitles) {
        if (this.calculateSimilarity(normalizedTitle, seenTitle) > 0.8) {
          isDuplicate = true
          break
        }
      }

      if (!isDuplicate) {
        uniqueArticles.push(article)
        seenTitles.add(normalizedTitle)
      }
    }

    return uniqueArticles
  }

  /**
   * Calculate similarity between two strings using Jaccard similarity
   */
  calculateSimilarity(str1, str2) {
    const set1 = new Set(str1.split(''))
    const set2 = new Set(str2.split(''))
    
    const intersection = new Set([...set1].filter(x => set2.has(x)))
    const union = new Set([...set1, ...set2])
    
    return intersection.size / union.size
  }

  /**
   * Get category statistics
   */
  getCategoryStats(articles) {
    const stats = {}
    
    articles.forEach(article => {
      const categoryName = article.category.name
      if (!stats[categoryName]) {
        stats[categoryName] = {
          count: 0,
          slug: article.category.slug,
          color: article.category.color
        }
      }
      stats[categoryName].count++
    })

    return stats
  }

  /**
   * Get collected articles with filtering options
   */
  getCollectedArticles(options = {}) {
    let articles = [...this.collectedArticles]

    // Filter by category
    if (options.category) {
      articles = articles.filter(article => 
        article.category.slug === options.category.toLowerCase()
      )
    }

    // Filter by featured
    if (options.featured !== undefined) {
      articles = articles.filter(article => article.featured === options.featured)
    }

    // Pagination
    const page = parseInt(options.page) || 1
    const limit = parseInt(options.limit) || 10
    const offset = (page - 1) * limit

    const paginatedArticles = articles.slice(offset, offset + limit)

    return {
      articles: paginatedArticles,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(articles.length / limit),
        totalItems: articles.length,
        itemsPerPage: limit,
        hasNextPage: offset + limit < articles.length,
        hasPrevPage: page > 1
      }
    }
  }

  /**
   * Get collection status
   */
  getCollectionStatus() {
    return {
      isProcessing: this.isProcessing,
      lastCollectionDate: this.lastCollectionDate,
      articleCount: this.collectedArticles.length,
      categories: this.getCategoryStats(this.collectedArticles)
    }
  }

  /**
   * Clear collected articles
   */
  clearCollectedArticles() {
    this.collectedArticles = []
    this.lastCollectionDate = null
    logger.info('Collected articles cleared')
  }

  /**
   * Get OAuth2 authorization URL for Gmail
   */
  getGmailAuthUrl() {
    try {
      return gmailService.getAuthUrl()
    } catch (error) {
      logger.error('Failed to get Gmail auth URL:', error)
      throw new Error('Gmail authentication not configured')
    }
  }

  /**
   * Handle OAuth2 callback and exchange code for tokens
   */
  async handleGmailCallback(code) {
    try {
      const tokens = await gmailService.getTokens(code)
      logger.info('Gmail authentication successful')
      return tokens
    } catch (error) {
      logger.error('Gmail authentication failed:', error)
      throw new Error('Failed to authenticate with Gmail')
    }
  }
}

export default new EmailCollector()