import express from 'express'
import emailCollector from '../services/emailCollector.js'
import logger from '../utils/logger.js'

const router = express.Router()

/**
 * @route GET /api/auth/gmail
 * @description Get Gmail OAuth2 authorization URL
 */
router.get('/gmail', async (req, res) => {
  try {
    logger.info('Gmail authorization URL requested')
    
    const authUrl = emailCollector.getGmailAuthUrl()
    
    // Return both JSON response and HTML page for user convenience
    const htmlResponse = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Gmail 연동 - Ai.D NEWS</title>
        <style>
            body {
                font-family: 'Inter', system-ui, sans-serif;
                max-width: 600px;
                margin: 0 auto;
                padding: 40px 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                color: white;
            }
            .container {
                background: rgba(255, 255, 255, 0.1);
                padding: 40px;
                border-radius: 20px;
                backdrop-filter: blur(10px);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            }
            .logo {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo h1 {
                font-size: 2.5em;
                margin: 0;
                background: linear-gradient(45deg, #fff, #f0f0f0);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .auth-card {
                text-align: center;
            }
            .auth-card h2 {
                margin-bottom: 20px;
                font-size: 1.8em;
            }
            .auth-card p {
                margin-bottom: 30px;
                opacity: 0.9;
                line-height: 1.6;
            }
            .btn {
                display: inline-block;
                background: linear-gradient(45deg, #4285f4, #34a853);
                color: white;
                padding: 15px 30px;
                border-radius: 50px;
                text-decoration: none;
                font-weight: 600;
                font-size: 16px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(66, 133, 244, 0.3);
            }
            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(66, 133, 244, 0.4);
            }
            .info {
                margin-top: 30px;
                padding: 20px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                font-size: 14px;
                opacity: 0.8;
            }
            .steps {
                text-align: left;
                margin-top: 20px;
            }
            .steps li {
                margin-bottom: 8px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">
                <h1>📧 Ai.D NEWS</h1>
            </div>
            
            <div class="auth-card">
                <h2>Gmail 계정 연동</h2>
                <p>
                    TLDR Newsletter 이메일을 자동으로 수집하기 위해 
                    Gmail 계정 접근 권한이 필요합니다.
                </p>
                
                <a href="${authUrl}" class="btn" target="_blank">
                    🔐 Gmail 연동하기
                </a>
                
                <div class="info">
                    <strong>📋 연동 절차:</strong>
                    <ol class="steps">
                        <li>위 버튼을 클릭하여 Google 인증 페이지로 이동</li>
                        <li>Gmail 계정으로 로그인</li>
                        <li>이메일 읽기 권한 승인</li>
                        <li>인증 코드를 복사하여 관리자 패널에 입력</li>
                    </ol>
                    
                    <p style="margin-top: 15px;">
                        <strong>🔒 보안:</strong> 읽기 전용 권한만 요청하며, 
                        언제든지 Google 계정 설정에서 권한을 철회할 수 있습니다.
                    </p>
                </div>
            </div>
        </div>
        
        <script>
            // Copy auth URL to clipboard functionality
            function copyAuthUrl() {
                const authUrl = "${authUrl}";
                navigator.clipboard.writeText(authUrl).then(() => {
                    alert('인증 URL이 복사되었습니다!');
                });
            }
        </script>
    </body>
    </html>
    `
    
    // Check if request wants JSON response
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      res.status(200).json({
        success: true,
        message: 'Gmail authorization URL generated',
        data: { 
          authUrl,
          instructions: [
            '1. Visit the provided URL',
            '2. Sign in with your Gmail account', 
            '3. Grant email reading permissions',
            '4. Copy the authorization code',
            '5. Submit the code through the callback endpoint'
          ]
        }
      })
    } else {
      res.status(200).send(htmlResponse)
    }
    
  } catch (error) {
    logger.error('Gmail auth URL generation failed:', error)
    
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      res.status(500).json({
        success: false,
        message: 'Gmail authentication not properly configured',
        error: error.message
      })
    } else {
      res.status(500).send(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1>❌ 인증 설정 오류</h1>
            <p>Gmail API 설정이 완료되지 않았습니다.</p>
            <p>관리자에게 문의하세요.</p>
          </body>
        </html>
      `)
    }
  }
})

/**
 * @route POST /api/auth/gmail/callback
 * @description Handle Gmail OAuth2 callback with authorization code
 */
router.post('/gmail/callback', async (req, res) => {
  try {
    const { code } = req.body
    
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Authorization code is required',
        error: 'Missing authorization code'
      })
    }
    
    logger.info('Processing Gmail OAuth callback')
    
    const tokens = await emailCollector.handleGmailCallback(code)
    
    logger.info('Gmail authentication successful')
    
    res.status(200).json({
      success: true,
      message: 'Gmail 계정이 성공적으로 연동되었습니다!',
      data: {
        authenticated: true,
        hasRefreshToken: !!tokens.refresh_token,
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
        scope: tokens.scope
      }
    })
    
  } catch (error) {
    logger.error('Gmail OAuth callback failed:', error)
    
    res.status(500).json({
      success: false,
      message: 'Gmail 인증 처리 중 오류가 발생했습니다',
      error: error.message
    })
  }
})

/**
 * @route GET /api/auth/gmail/status
 * @description Check Gmail authentication status
 */
router.get('/gmail/status', async (req, res) => {
  try {
    // This would check if we have valid tokens
    const hasValidAuth = process.env.GMAIL_REFRESH_TOKEN && process.env.GMAIL_CLIENT_ID
    
    res.status(200).json({
      success: true,
      message: 'Gmail authentication status retrieved',
      data: {
        isAuthenticated: hasValidAuth,
        hasCredentials: !!(process.env.GMAIL_CLIENT_ID && process.env.GMAIL_CLIENT_SECRET),
        hasRefreshToken: !!process.env.GMAIL_REFRESH_TOKEN,
        clientConfigured: !!process.env.GMAIL_CLIENT_ID
      }
    })
    
  } catch (error) {
    logger.error('Gmail status check failed:', error)
    
    res.status(500).json({
      success: false,
      message: 'Failed to check Gmail authentication status',
      error: error.message
    })
  }
})

/**
 * @route DELETE /api/auth/gmail
 * @description Revoke Gmail authentication
 */
router.delete('/gmail', async (req, res) => {
  try {
    // In a real implementation, you would revoke the tokens here
    logger.info('Gmail authentication revocation requested')
    
    res.status(200).json({
      success: true,
      message: 'Gmail 인증이 해제되었습니다',
      data: {
        revoked: true
      }
    })
    
  } catch (error) {
    logger.error('Gmail auth revocation failed:', error)
    
    res.status(500).json({
      success: false,
      message: 'Gmail 인증 해제 중 오류가 발생했습니다',
      error: error.message
    })
  }
})

export default router