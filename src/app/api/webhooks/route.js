import { createOrUpdateUser, deleteUser } from '@/lib/actions/user'
import { clerkClient } from '@clerk/nextjs/dist/types/server'
import { verifyWebhook } from '@clerk/nextjs/webhooks'

export async function POST(req) {
  try {
    const evt = await verifyWebhook(req)

    // Optional: log general info
    const { id } = evt?.data
    const eventType = evt?.type
    console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
    console.log('Webhook payload:', evt.data)

    // // 👇 Place this here
    // if (evt.type === 'user.created') {
    //   console.log('New user created with userId:', evt.data.id)
    //   // You can do more here, like saving the user in your DB
    // }
    // if (evt.type === 'user.updated') {
    //   console.log('User is updated:', evt.data.id)
    //   // You can do more here, like saving the user in your DB
    // }

    if (eventType === 'user.created' || eventType === 'user.updated') {
        const {
            id,
            first_name,
            last_name,
            image_url,
            email_addresses,
            username

        } = evt?.data;

        try {
            const user = await createOrUpdateUser(
                id,
            first_name,
            last_name,
            image_url,
            email_addresses,
            username
            )
            if (user && eventType === 'user.created') {
                try {
                    await clerkClient.users.updateUserMetadata(id,{
                        publicMetadata: {
                            userMongoId: user._id,
                            isAdmin: user.isAdmin,
                        }
                    })
                }catch (error) {
            console.log('Error Updating user metadata:', error);
            
        }
            } 
            
        } catch (error) {
            console.log('Error creating or updating user :', error);
            return new Response('error occurd', {status: 400});
        }
    }
    if (eventType === 'user.deleted') {
        const {id} = evt?.data;
        try {
            await deleteUser(id);
            
        } catch (error) {
            console.log('Error Deleting User:', error);
               return new Response('error occurd', {status: 400});
        }
    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}
