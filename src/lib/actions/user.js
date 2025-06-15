import User from "../mongodb/models/user.model";
import { connect } from "../mongodb/mongoose";

export const createOrUpdateUser = async (
  id,
  first_name,
  last_name,
  image_url,
  email,
  userName
) => {
  try {
    await connect();

    const user = await User.findOneAndUpdate(
      { clerkId: id }, // ✅ clerkId দিয়ে খোঁজা হচ্ছে
      {
        $set: {
          firstName: first_name,
          lastName: last_name,
          profilePicture: image_url,
          email: email,
          userName,
        },
      },
      { new: true, upsert: true } // ✅ না থাকলে তৈরি করবে, থাকলে আপডেট করবে
    );

    return user;
  } catch (error) {
    console.log('❌ Error creating or updating user:', error);
  }
};
