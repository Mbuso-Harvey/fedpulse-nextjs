import { loadStripe } from '@stripe/stripe-js'

let stripePromise = null

export const getStripe = () => {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  if (!key) return null
  if (!stripePromise) {
    stripePromise = loadStripe(key)
  }
  return stripePromise
}
