import { createOrUpdateUser, deleteUser } from '@/lib/actions/user';
import { clerkClient } from '@clerk/nextjs/server';
import { verifyWebhook } from '@clerk/nextjs/webhooks';

export async function POST(req) {
  try {
    const evt = await verifyWebhook(req);
    const eventType = evt?.type;
    const { id } = evt?.data;

    console.log(`✅ Webhook received — ID: ${id}, Type: ${eventType}`);
    console.log('Payload:', evt?.data);

    // Handle user creation and updates
    if (eventType === 'user.created' || eventType === 'user.updated') {
      const {
        id: clerkId,
        first_name,
        last_name,
        image_url,
        email_addresses,
        username
      } = evt?.data;

      const email = email_addresses?.[0]?.email_address || '';

      const user = await createOrUpdateUser(
        clerkId,
        first_name,
        last_name,
        image_url,
        email,
        username
      );

      // If user was created, store MongoDB ID in Clerk metadata
      if (user && eventType === 'user.created') {
        try {
          await clerkClient.users.updateUserMetadata(clerkId, {
            publicMetadata: {
              userMongoId: user._id,
              isAdmin: user.isAdmin,
            },
          });
          console.log('✅ Metadata updated for Clerk user:', clerkId);
        } catch (metaError) {
          console.error('❌ Error updating Clerk metadata:', metaError);
        }
      }
    }

    // Handle user deletion
    if (eventType === 'user.deleted') {
      try {
        await deleteUser(id);
        console.log('✅ Deleted user from MongoDB with Clerk ID:', id);
      } catch (deleteErr) {
        console.error('❌ Error deleting user:', deleteErr);
        return new Response('Error deleting user', { status: 400 });
      }
    }

    return new Response('✅ Webhook processed successfully', { status: 200 });
  } catch (err) {
    console.error('❌ Webhook verification failed:', err);
    return new Response('Webhook verification failed', { status: 400 });
  }
}
