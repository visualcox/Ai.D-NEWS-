import express from 'express'

const router = express.Router()

/**
 * @route   POST /api/email/send
 * @desc    Send email (placeholder)
 * @access  Public
 */
router.post('/send', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Email functionality will be implemented'
  })
})

export default router