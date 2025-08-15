import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import logger from '../utils/logger.js'

// Mock data for demonstration
let mockSubscriptions = []

/**
 * @desc    Create new subscription
 * @route   POST /api/subscriptions
 * @access  Public
 */
export const createSubscription = async (req, res, next) => {
  try {
    const { email, categories = [], preferences = {} } = req.body

    // Check if subscription already exists
    const existingSubscription = mockSubscriptions.find(s => s.email === email)

    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        error: 'Email is already subscribed'
      })
    }

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Create subscription
    const subscription = {
      id: mockSubscriptions.length + 1,
      email,
      categories,
      preferences,
      verificationToken,
      verificationTokenExpires,
      isActive: false, // Will be activated after email verification
      isVerified: false,
      subscribedAt: new Date(),
      updatedAt: new Date()
    }

    mockSubscriptions.push(subscription)

    // Mock verification email sending
    logger.info(`Mock verification email sent to ${email}`)

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully. Please check your email to verify.',
      data: {
        email: subscription.email,
        categories: subscription.categories,
        needsVerification: true
      }
    })
  } catch (error) {
    logger.error('Error in createSubscription:', error)
    next(error)
  }
}

/**
 * @desc    Get subscription by email
 * @route   GET /api/subscriptions/:email
 * @access  Public
 */
export const getSubscriptionByEmail = async (req, res, next) => {
  try {
    const { email } = req.params

    const subscription = mockSubscriptions.find(s => s.email === email)

    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: 'Subscription not found'
      })
    }

    res.status(200).json({
      success: true,
      data: subscription
    })
  } catch (error) {
    logger.error('Error in getSubscriptionByEmail:', error)
    next(error)
  }
}

/**
 * @desc    Update subscription preferences
 * @route   PUT /api/subscriptions/:email
 * @access  Public
 */
export const updateSubscription = async (req, res, next) => {
  try {
    const { email } = req.params
    const { categories, preferences } = req.body

    const subscriptionIndex = mockSubscriptions.findIndex(s => s.email === email)

    if (subscriptionIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Subscription not found'
      })
    }

    // Update subscription
    if (categories) mockSubscriptions[subscriptionIndex].categories = categories
    if (preferences) mockSubscriptions[subscriptionIndex].preferences = preferences
    mockSubscriptions[subscriptionIndex].updatedAt = new Date()

    const updatedSubscription = mockSubscriptions[subscriptionIndex]

    res.status(200).json({
      success: true,
      message: 'Subscription updated successfully',
      data: updatedSubscription
    })
  } catch (error) {
    logger.error('Error in updateSubscription:', error)
    next(error)
  }
}

/**
 * @desc    Delete subscription (unsubscribe)
 * @route   DELETE /api/subscriptions/:email
 * @access  Public
 */
export const deleteSubscription = async (req, res, next) => {
  try {
    const { email } = req.params

    const subscriptionIndex = mockSubscriptions.findIndex(s => s.email === email)

    if (subscriptionIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Subscription not found'
      })
    }

    mockSubscriptions.splice(subscriptionIndex, 1)

    logger.info(`Subscription deleted for ${email}`)

    res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed'
    })
  } catch (error) {
    logger.error('Error in deleteSubscription:', error)
    next(error)
  }
}

/**
 * @desc    Verify subscription via email token
 * @route   GET /api/subscriptions/verify/:token
 * @access  Public
 */
export const verifySubscription = async (req, res, next) => {
  try {
    const { token } = req.params

    const subscription = mockSubscriptions.find(s => 
      s.verificationToken === token && 
      s.verificationTokenExpires > new Date()
    )

    if (!subscription) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired verification token'
      })
    }

    // Update subscription to verified and active
    subscription.isVerified = true
    subscription.isActive = true
    subscription.verificationToken = null
    subscription.verificationTokenExpires = null
    subscription.verifiedAt = new Date()

    // Mock welcome email sending
    logger.info(`Mock welcome email sent to ${subscription.email}`)

    res.status(200).json({
      success: true,
      message: 'Subscription verified successfully',
      data: {
        email: subscription.email,
        categories: subscription.categories,
        verifiedAt: subscription.verifiedAt
      }
    })
  } catch (error) {
    logger.error('Error in verifySubscription:', error)
    next(error)
  }
}