import { createOrUpdateUser, deleteUser } from '@/lib/actions/user';
import { clerkClient } from '@clerk/nextjs/server'; // ✅ correct import
import { verifyWebhook } from '@clerk/nextjs/webhooks';

export async function POST(req) {
  try {
    const evt = await verifyWebhook(req);
    const eventType = evt?.type;
    const { id } = evt?.data;

    console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
    console.log('Webhook payload:', evt?.data);

    // Handle user.created and user.updated
    if (eventType === 'user.created' || eventType === 'user.updated') {
      const {
        id,
        first_name,
        last_name,
        image_url,
        email_addresses,
        username
      } = evt?.data;

      const email = email_addresses?.[0]?.email_address || ''; // ✅ safe fallback

      try {
        const user = await createOrUpdateUser(
          id,
          first_name,
          last_name,
          image_url,
          email,
          username
        );

        // Update Clerk metadata after user creation
        if (user && eventType === 'user.created') {
          try {
            await clerkClient.users.updateUserMetadata(id, {
              publicMetadata: {
                userMongoId: user._id,
                isAdmin: user.isAdmin,
              },
            });
          } catch (error) {
            console.error('❌ Error updating user metadata:', error);
          }
        }
      } catch (error) {
        console.error('❌ Error creating or updating user:', error);
        return new Response('Error occurred', { status: 400 });
      }
    }

    // Handle user.deleted
    if (eventType === 'user.deleted') {
      try {
        await deleteUser(id);
      } catch (error) {
        console.error('❌ Error deleting user:', error);
        return new Response('Error occurred', { status: 400 });
      }
    }

    return new Response('Webhook received', { status: 200 });
  } catch (err) {
    console.error('❌ Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }
}
