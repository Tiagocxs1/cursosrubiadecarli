import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = (await headers()).get('Stripe-Signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return new NextResponse('Invalid signature', { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const userId = session?.metadata?.userId
  const courseId = session?.metadata?.courseId

  if (event.type === 'checkout.session.completed') {
    if (!userId || !courseId) {
      return new NextResponse('Missing metadata', { status: 400 })
    }

    await db.purchase.upsert({
      where: { userId_courseId: { userId, courseId } },
      create: { courseId, userId },
      update: {},
    })
  } else {
    return new NextResponse(`Webhook Error: Unhandled event type ${event.type}`, { status: 200 })
  }

  return new NextResponse(null, { status: 200 })
}
