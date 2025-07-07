import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
})

async function main() {
  try {
    // Create Basic Plan Product
    const basicProduct = await stripe.products.create({
      name: 'Basic Plan',
      description: 'Perfect for getting started with CreatorFlow',
      metadata: {
        features: JSON.stringify([
          'Up to 10 posts per month',
          '2 social media accounts',
          'Basic analytics',
          'Email support',
        ]),
      },
    })

    // Create Basic Plan Price
    const basicPrice = await stripe.prices.create({
      product: basicProduct.id,
      unit_amount: 900, // $9.00
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      metadata: {
        tier: 'basic',
      },
    })

    // Create Pro Plan Product
    const proProduct = await stripe.products.create({
      name: 'Pro Plan',
      description: 'Best for growing creators',
      metadata: {
        features: JSON.stringify([
          'Unlimited posts',
          '5 social media accounts',
          'Advanced analytics',
          'AI content suggestions',
          'Priority support',
        ]),
      },
    })

    // Create Pro Plan Price
    const proPrice = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 2900, // $29.00
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      metadata: {
        tier: 'pro',
      },
    })

    // Create Enterprise Plan Product
    const enterpriseProduct = await stripe.products.create({
      name: 'Enterprise Plan',
      description: 'For professional content teams',
      metadata: {
        features: JSON.stringify([
          'Everything in Pro',
          'Unlimited social accounts',
          'Team collaboration',
          'Custom templates',
          'API access',
          'Dedicated support',
        ]),
      },
    })

    // Create Enterprise Plan Price
    const enterprisePrice = await stripe.prices.create({
      product: enterpriseProduct.id,
      unit_amount: 9900, // $99.00
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      metadata: {
        tier: 'enterprise',
      },
    })

    console.log('Stripe products and prices created successfully!')
    console.log('\nPrice IDs to use in your code:')
    console.log('Basic:', basicPrice.id)
    console.log('Pro:', proPrice.id)
    console.log('Enterprise:', enterprisePrice.id)

  } catch (error) {
    console.error('Error creating Stripe products and prices:', error)
  }
}

main() 