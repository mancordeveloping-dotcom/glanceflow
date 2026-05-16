import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 })

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const obj = event.data.object as unknown as Record<string, unknown>
  const customerId = typeof obj.customer === 'string' ? obj.customer : null
  if (!customerId) return NextResponse.json({ received: true })

  const ACTIVE_EVENTS = [
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
  ]

  if (ACTIVE_EVENTS.includes(event.type)) {
    const status = obj.status as string | undefined
    const isPremium = !status || ['active', 'trialing'].includes(status)
    await supabaseAdmin
      .from('user_profiles')
      .update({ subscription_status: isPremium ? 'premium' : 'free' })
      .eq('stripe_customer_id', customerId)
  }

  if (event.type === 'customer.subscription.deleted') {
    await supabaseAdmin
      .from('user_profiles')
      .update({ subscription_status: 'free' })
      .eq('stripe_customer_id', customerId)
  }

  return NextResponse.json({ received: true })
}
