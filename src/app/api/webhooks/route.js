import { verifyWebhook } from '@clerk/nextjs/webhooks'

export async function POST(req) {
  try {
    const evt = await verifyWebhook(req)

    // Optional: log general info
    const { id } = evt.data
    const eventType = evt.type
    console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
    console.log('Webhook payload:', evt.data)

    // 👇 Place this here
    if (evt.type === 'user.created') {
      console.log('New user created with userId:', evt.data.id)
      // You can do more here, like saving the user in your DB
    }
    if (evt.type === 'user.updated') {
      console.log('User is updated:', evt.data.id)
      // You can do more here, like saving the user in your DB
    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}
