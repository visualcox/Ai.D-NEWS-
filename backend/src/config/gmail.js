import { google } from 'googleapis'
import fs from 'fs/promises'
import path from 'path'
import logger from '../utils/logger.js'

class GmailService {
  constructor() {
    this.oauth2Client = null
    this.gmail = null
    this.initialized = false
  }

  /**
   * Initialize Gmail API with OAuth2 credentials
   */
  async initialize() {
    try {
      // For development/demo purposes, we'll use a mock implementation
      // In production, you would need to set up proper OAuth2 credentials
      
      if (process.env.GMAIL_CLIENT_ID && process.env.GMAIL_CLIENT_SECRET) {
        this.oauth2Client = new google.auth.OAuth2(
          process.env.GMAIL_CLIENT_ID,
          process.env.GMAIL_CLIENT_SECRET,
          process.env.GMAIL_REDIRECT_URI || 'http://localhost:3001/auth/gmail/callback'
        )

        if (process.env.GMAIL_REFRESH_TOKEN) {
          this.oauth2Client.setCredentials({
            refresh_token: process.env.GMAIL_REFRESH_TOKEN
          })

          this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client })
          this.initialized = true
          logger.info('Gmail API initialized successfully')
        } else {
          logger.warn('Gmail refresh token not found. Email collection will use mock data.')
        }
      } else {
        logger.warn('Gmail API credentials not configured. Using mock implementation.')
      }

      return this.initialized
    } catch (error) {
      logger.error('Failed to initialize Gmail API:', error)
      return false
    }
  }

  /**
   * Get OAuth2 authorization URL
   */
  getAuthUrl() {
    if (!this.oauth2Client) {
      throw new Error('OAuth2 client not initialized')
    }

    const scopes = [
      'https://www.googleapis.com/auth/gmail.readonly'
    ]

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    })
  }

  /**
   * Exchange authorization code for tokens
   */
  async getTokens(code) {
    if (!this.oauth2Client) {
      throw new Error('OAuth2 client not initialized')
    }

    const { tokens } = await this.oauth2Client.getToken(code)
    this.oauth2Client.setCredentials(tokens)
    
    logger.info('Gmail tokens obtained successfully')
    return tokens
  }

  /**
   * Search for emails from TLDR newsletter
   */
  async searchTLDREmails(maxResults = 50) {
    try {
      if (!this.initialized) {
        logger.warn('Gmail API not initialized, returning mock data')
        return this.getMockTLDREmails()
      }

      const query = 'from:dan@tldrnewsletter.com'
      
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults: maxResults
      })

      const messages = response.data.messages || []
      logger.info(`Found ${messages.length} TLDR emails`)

      const emails = []
      for (const message of messages) {
        try {
          const emailData = await this.getEmailContent(message.id)
          if (emailData) {
            emails.push(emailData)
          }
        } catch (error) {
          logger.error(`Failed to fetch email ${message.id}:`, error)
        }
      }

      return emails
    } catch (error) {
      logger.error('Failed to search TLDR emails:', error)
      return this.getMockTLDREmails()
    }
  }

  /**
   * Get email content by message ID
   */
  async getEmailContent(messageId) {
    try {
      const response = await this.gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full'
      })

      const message = response.data
      const headers = message.payload.headers
      
      // Extract email metadata
      const subject = headers.find(h => h.name === 'Subject')?.value || ''
      const date = headers.find(h => h.name === 'Date')?.value || ''
      const from = headers.find(h => h.name === 'From')?.value || ''

      // Extract email body
      let body = ''
      if (message.payload.body && message.payload.body.data) {
        body = Buffer.from(message.payload.body.data, 'base64').toString()
      } else if (message.payload.parts) {
        body = this.extractBodyFromParts(message.payload.parts)
      }

      return {
        id: messageId,
        subject,
        date: new Date(date),
        from,
        body,
        snippet: message.snippet
      }
    } catch (error) {
      logger.error(`Failed to get email content for ${messageId}:`, error)
      return null
    }
  }

  /**
   * Extract body from email parts
   */
  extractBodyFromParts(parts) {
    let body = ''
    
    for (const part of parts) {
      if (part.mimeType === 'text/html' && part.body && part.body.data) {
        body += Buffer.from(part.body.data, 'base64').toString()
      } else if (part.mimeType === 'text/plain' && part.body && part.body.data) {
        body += Buffer.from(part.body.data, 'base64').toString()
      } else if (part.parts) {
        body += this.extractBodyFromParts(part.parts)
      }
    }
    
    return body
  }

  /**
   * Mock TLDR emails for development/demo
   */
  getMockTLDREmails() {
    const mockEmails = [
      {
        id: 'mock_1',
        subject: 'TLDR: AI breakthrough in language models, new React features, and cybersecurity updates',
        date: new Date('2024-08-15T10:00:00Z'),
        from: 'dan@tldrnewsletter.com',
        body: `
          <html>
            <body>
              <h2>🤖 AI & Tech News</h2>
              <p><strong>OpenAI releases GPT-4 Turbo with vision capabilities</strong></p>
              <p>OpenAI has announced a major update to GPT-4 Turbo, now featuring enhanced vision capabilities and faster processing speeds. The new model can analyze images, charts, and diagrams with unprecedented accuracy.</p>
              
              <p><strong>Meta's new AR glasses prototype shows promise</strong></p>
              <p>Meta unveiled their latest AR glasses prototype at their developer conference, featuring lightweight design and impressive display quality.</p>
              
              <h2>💻 Development Updates</h2>
              <p><strong>React 19 introduces new server components</strong></p>
              <p>The React team has released React 19 with revolutionary server components that enable better performance and SEO optimization.</p>
              
              <p><strong>TypeScript 5.3 brings new features</strong></p>
              <p>TypeScript 5.3 includes improved type inference and better support for modern JavaScript features.</p>
              
              <h2>🎨 Design Trends</h2>
              <p><strong>Minimalist UI design gains popularity</strong></p>
              <p>Designers are embracing ultra-minimalist interfaces with focus on white space and subtle animations.</p>
              
              <h2>📈 Marketing Insights</h2>
              <p><strong>AI-powered marketing automation sees 300% growth</strong></p>
              <p>Companies using AI for marketing automation report significant improvements in conversion rates and customer engagement.</p>
            </body>
          </html>
        `,
        snippet: 'AI breakthrough in language models, new React features, and cybersecurity updates'
      },
      {
        id: 'mock_2',
        subject: 'TLDR: Quantum computing milestone, Next.js 14 release, and UX design innovations',
        date: new Date('2024-08-14T10:00:00Z'),
        from: 'dan@tldrnewsletter.com',
        body: `
          <html>
            <body>
              <h2>🔬 Tech Breakthroughs</h2>
              <p><strong>Google achieves quantum supremacy milestone</strong></p>
              <p>Google's quantum computer successfully performed a calculation that would take classical computers thousands of years to complete.</p>
              
              <h2>⚛️ Frontend Development</h2>
              <p><strong>Next.js 14 introduces app router improvements</strong></p>
              <p>Vercel released Next.js 14 with significant improvements to the app router, better caching, and enhanced developer experience.</p>
              
              <p><strong>Svelte 5 runes system revolutionizes reactivity</strong></p>
              <p>Svelte 5 introduces a new runes system that makes reactivity more explicit and powerful.</p>
              
              <h2>🎨 Design Innovation</h2>
              <p><strong>Neomorphism design trend gains traction</strong></p>
              <p>The neomorphism design trend is becoming popular among mobile app designers for its soft, tactile appearance.</p>
              
              <p><strong>Voice UI design principles emerge</strong></p>
              <p>As voice interfaces become more common, new design principles are emerging for creating intuitive voice experiences.</p>
              
              <h2>📊 Marketing Technology</h2>
              <p><strong>Personalization engines drive 250% increase in engagement</strong></p>
              <p>Advanced personalization engines are helping companies achieve remarkable improvements in user engagement and retention.</p>
            </body>
          </html>
        `,
        snippet: 'Quantum computing milestone, Next.js 14 release, and UX design innovations'
      },
      {
        id: 'mock_3',
        subject: 'TLDR: AI ethics guidelines, Vue 3.4 features, and sustainable design practices',
        date: new Date('2024-08-13T10:00:00Z'),
        from: 'dan@tldrnewsletter.com',
        body: `
          <html>
            <body>
              <h2>🤖 AI Development</h2>
              <p><strong>New AI ethics guidelines released by IEEE</strong></p>
              <p>The IEEE has published comprehensive guidelines for ethical AI development, focusing on transparency, fairness, and accountability.</p>
              
              <p><strong>Claude 3 shows impressive reasoning capabilities</strong></p>
              <p>Anthropic's Claude 3 demonstrates advanced reasoning and coding abilities, competing closely with GPT-4.</p>
              
              <h2>🖥️ Web Development</h2>
              <p><strong>Vue 3.4 improves performance and DX</strong></p>
              <p>Vue 3.4 brings significant performance improvements and enhanced developer experience with better TypeScript support.</p>
              
              <p><strong>Web Components gain mainstream adoption</strong></p>
              <p>Major frameworks are embracing Web Components, making cross-framework component sharing easier than ever.</p>
              
              <h2>🌱 Sustainable Design</h2>
              <p><strong>Green web design reduces carbon footprint</strong></p>
              <p>Designers are adopting sustainable practices to reduce the environmental impact of digital products.</p>
              
              <h2>🎯 Growth Marketing</h2>
              <p><strong>Product-led growth strategies show 40% higher retention</strong></p>
              <p>Companies focusing on product-led growth are seeing significantly higher user retention and organic growth rates.</p>
            </body>
          </html>
        `,
        snippet: 'AI ethics guidelines, Vue 3.4 features, and sustainable design practices'
      }
    ]

    logger.info(`Returning ${mockEmails.length} mock TLDR emails`)
    return mockEmails
  }
}

export default new GmailService()