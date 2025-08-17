import { load } from 'cheerio'
import { convert } from 'html-to-text'
import logger from '../utils/logger.js'

class ContentParser {
  constructor() {
    // Category keywords for classification
    this.categoryKeywords = {
      tech: [
        'javascript', 'typescript', 'react', 'vue', 'angular', 'node.js', 'python', 'java',
        'programming', 'development', 'coding', 'software', 'framework', 'library',
        'api', 'database', 'cloud', 'aws', 'docker', 'kubernetes', 'microservices',
        'frontend', 'backend', 'fullstack', 'web development', 'mobile development',
        'devops', 'ci/cd', 'git', 'github', 'open source', 'cybersecurity'
      ],
      ai: [
        'artificial intelligence', 'machine learning', 'deep learning', 'neural network',
        'gpt', 'openai', 'claude', 'chatgpt', 'llm', 'language model', 'ai', 'ml',
        'computer vision', 'nlp', 'natural language processing', 'tensorflow', 'pytorch',
        'generative ai', 'automation', 'robotics', 'algorithm', 'data science',
        'predictive analytics', 'ai ethics', 'anthropic', 'google ai', 'microsoft ai'
      ],
      marketing: [
        'marketing', 'digital marketing', 'seo', 'sem', 'social media', 'content marketing',
        'email marketing', 'growth hacking', 'conversion', 'analytics', 'roi', 'kpi',
        'brand', 'advertising', 'campaign', 'customer acquisition', 'retention',
        'personalization', 'segmentation', 'a/b testing', 'funnel', 'lead generation',
        'crm', 'marketing automation', 'influencer marketing', 'affiliate marketing'
      ],
      design: [
        'design', 'ui', 'ux', 'user interface', 'user experience', 'figma', 'sketch',
        'adobe', 'photoshop', 'illustrator', 'typography', 'color theory', 'layout',
        'wireframe', 'prototype', 'design system', 'component library', 'accessibility',
        'responsive design', 'mobile design', 'web design', 'graphic design',
        'branding', 'logo', 'visual design', 'interaction design', 'design thinking'
      ]
    }
  }

  /**
   * Parse email content and extract articles
   */
  parseEmailContent(email) {
    try {
      const $ = load(email.body)
      const articles = []

      // Remove script and style tags
      $('script, style').remove()

      // Extract text content
      const textContent = convert(email.body, {
        wordwrap: false,
        ignoreHref: true,
        ignoreImage: true
      })

      // Try to identify individual articles/stories
      const sections = this.extractSections($, textContent)
      
      sections.forEach((section, index) => {
        const article = this.createArticle(section, email, index)
        if (article) {
          articles.push(article)
        }
      })

      logger.info(`Parsed ${articles.length} articles from email: ${email.subject}`)
      return articles

    } catch (error) {
      logger.error('Failed to parse email content:', error)
      return []
    }
  }

  /**
   * Extract sections from email content
   */
  extractSections($, textContent) {
    const sections = []

    // Try to find articles by headers (h1, h2, h3)
    $('h1, h2, h3').each((index, element) => {
      const $header = $(element)
      const headerText = $header.text().trim()
      
      if (headerText && headerText.length > 10) {
        let content = ''
        let $next = $header.next()
        
        // Collect content until next header or end
        while ($next.length && !$next.is('h1, h2, h3')) {
          if ($next.is('p, div, span')) {
            content += $next.text().trim() + '\n\n'
          }
          $next = $next.next()
        }

        if (content.trim().length > 50) {
          sections.push({
            title: headerText,
            content: content.trim(),
            type: 'header-based'
          })
        }
      }
    })

    // If no header-based sections found, try paragraph-based extraction
    if (sections.length === 0) {
      const paragraphs = $('p').map((i, el) => $(el).text().trim()).get()
      const strongTexts = $('strong, b').map((i, el) => $(el).text().trim()).get()

      // Group paragraphs by strong/bold text that might be titles
      strongTexts.forEach(strongText => {
        if (strongText.length > 10 && strongText.length < 200) {
          const relatedContent = paragraphs
            .filter(p => p.includes(strongText))
            .join('\n\n')

          if (relatedContent.length > 100) {
            sections.push({
              title: strongText,
              content: relatedContent,
              type: 'paragraph-based'
            })
          }
        }
      })
    }

    // Fallback: split by line breaks and create sections
    if (sections.length === 0) {
      const lines = textContent.split('\n').filter(line => line.trim().length > 0)
      let currentSection = null

      lines.forEach(line => {
        const trimmed = line.trim()
        
        // Potential title (shorter lines with specific patterns)
        if (trimmed.length < 200 && 
            (trimmed.includes(':') || trimmed.match(/^[A-Z].*[a-z]$/))) {
          if (currentSection && currentSection.content.length > 100) {
            sections.push(currentSection)
          }
          currentSection = {
            title: trimmed,
            content: '',
            type: 'line-based'
          }
        } else if (currentSection && trimmed.length > 20) {
          currentSection.content += trimmed + '\n\n'
        }
      })

      if (currentSection && currentSection.content.length > 100) {
        sections.push(currentSection)
      }
    }

    return sections.slice(0, 10) // Limit to 10 sections per email
  }

  /**
   * Create article object from section
   */
  createArticle(section, email, index) {
    try {
      const title = section.title
      const content = section.content
      
      if (!title || !content || content.length < 50) {
        return null
      }

      // Classify category
      const category = this.classifyContent(title + ' ' + content)
      
      // Generate excerpt
      const excerpt = this.generateExcerpt(content)
      
      // Generate slug
      const slug = this.generateSlug(title)

      // Estimate read time
      const readTime = this.estimateReadTime(content)

      return {
        title: title.substring(0, 200), // Limit title length
        slug: slug,
        excerpt: excerpt,
        content: content.substring(0, 2000), // Limit content length
        category: category,
        published: true,
        featured: index < 3, // Mark first 3 as featured
        publishedAt: email.date,
        readTime: readTime,
        viewCount: 0,
        source: 'TLDR Newsletter',
        sourceEmail: email.id,
        originalSubject: email.subject
      }
    } catch (error) {
      logger.error('Failed to create article from section:', error)
      return null
    }
  }

  /**
   * Classify content into categories using keyword matching
   */
  classifyContent(text) {
    const lowerText = text.toLowerCase()
    const scores = {}

    // Calculate scores for each category
    Object.keys(this.categoryKeywords).forEach(category => {
      scores[category] = 0
      this.categoryKeywords[category].forEach(keyword => {
        const keywordRegex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'g')
        const matches = lowerText.match(keywordRegex)
        if (matches) {
          scores[category] += matches.length
        }
      })
    })

    // Find category with highest score
    let maxScore = 0
    let bestCategory = 'tech' // default

    Object.keys(scores).forEach(category => {
      if (scores[category] > maxScore) {
        maxScore = scores[category]
        bestCategory = category
      }
    })

    return {
      id: this.getCategoryId(bestCategory),
      name: this.getCategoryName(bestCategory),
      slug: bestCategory,
      color: this.getCategoryColor(bestCategory)
    }
  }

  /**
   * Get category ID
   */
  getCategoryId(slug) {
    const mapping = { tech: 1, ai: 2, marketing: 3, design: 4 }
    return mapping[slug] || 1
  }

  /**
   * Get category display name
   */
  getCategoryName(slug) {
    const mapping = { 
      tech: 'IT/TECH', 
      ai: 'AI', 
      marketing: 'Marketing', 
      design: 'Design' 
    }
    return mapping[slug] || 'IT/TECH'
  }

  /**
   * Get category color
   */
  getCategoryColor(slug) {
    const mapping = {
      tech: '#3B82F6',
      ai: '#8B5CF6', 
      marketing: '#10B981',
      design: '#F59E0B'
    }
    return mapping[slug] || '#3B82F6'
  }

  /**
   * Generate excerpt from content
   */
  generateExcerpt(content, maxLength = 200) {
    const cleaned = content.replace(/\n/g, ' ').trim()
    if (cleaned.length <= maxLength) {
      return cleaned
    }
    
    const truncated = cleaned.substring(0, maxLength)
    const lastSpace = truncated.lastIndexOf(' ')
    
    return truncated.substring(0, lastSpace) + '...'
  }

  /**
   * Generate URL slug from title
   */
  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-')
      .substring(0, 100)
  }

  /**
   * Estimate reading time in minutes
   */
  estimateReadTime(content) {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
  }
}

export default new ContentParser()