import { createOrUpdateUser, deleteUser } from '@/lib/actions/user';
import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(req) {
  try {
    const evt = await verifyWebhook(req);
    const eventType = evt?.type;

    const {
      id: clerkId,
      first_name,
      last_name,
      image_url,
      email_addresses,
      username
    } = evt?.data;

    const email = email_addresses?.[0]?.email_address || '';

    console.log(`✅ Webhook Event: ${eventType}`);
    console.log('📦 Payload:', evt?.data);

    if (eventType === 'user.created' || eventType === 'user.updated') {
      try {
        const user = await createOrUpdateUser(
          clerkId,
          first_name,
          last_name,
          image_url,
          email,
          username
        );

        console.log('🧾 MongoDB user:', user);

        if (user && eventType === 'user.created') {
          try {
            // ✅ Ensuring clerkClient is instantiated properly
            const client = await clerkClient;

            await client.users.updateUserMetadata(clerkId, {
              publicMetadata: {
                userMongoId: user._id?.toString() ?? '',
                isAdmin: user.isAdmin ?? false,
              },
            });

            console.log('✅ Clerk metadata updated');
          } catch (metaErr) {
            console.error('❌ Failed to update Clerk metadata:', metaErr);
          }
        }
      } catch (createErr) {
        console.error('❌ Failed to create/update user:', createErr);
        return new Response('Failed to process user data', { status: 400 });
      }
    }

    if (eventType === 'user.deleted') {
      try {
        await deleteUser(clerkId);
        console.log('✅ User deleted from MongoDB');
      } catch (deleteErr) {
        console.error('❌ Failed to delete user:', deleteErr);
        return new Response('Failed to delete user', { status: 400 });
      }
    }

    return new Response(`✅ Webhook processed: ${eventType}`, { status: 200 });
  } catch (err) {
    console.error('❌ Webhook verification failed:', err);
    return new Response('Webhook verification failed', { status: 400 });
  }
}
