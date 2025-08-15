import express from 'express'
import { 
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getSubscriptionByEmail,
  verifySubscription
} from '../controllers/subscriptions.js'
import { validateBody } from '../middleware/validation.js'
import { 
  subscriptionCreateSchema,
  subscriptionUpdateSchema 
} from '../utils/validation.js'

const router = express.Router()

/**
 * @route   POST /api/subscriptions
 * @desc    Create new subscription
 * @access  Public
 */
router.post('/', validateBody(subscriptionCreateSchema), createSubscription)

/**
 * @route   GET /api/subscriptions/:email
 * @desc    Get subscription by email
 * @access  Public
 */
router.get('/:email', getSubscriptionByEmail)

/**
 * @route   PUT /api/subscriptions/:email
 * @desc    Update subscription preferences
 * @access  Public
 */
router.put('/:email', validateBody(subscriptionUpdateSchema), updateSubscription)

/**
 * @route   DELETE /api/subscriptions/:email
 * @desc    Unsubscribe
 * @access  Public
 */
router.delete('/:email', deleteSubscription)

/**
 * @route   GET /api/subscriptions/verify/:token
 * @desc    Verify subscription via email token
 * @access  Public
 */
router.get('/verify/:token', verifySubscription)

export default router