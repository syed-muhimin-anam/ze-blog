import User from "../mongodb/models/user.model";

import { connect } from "../mongodb/mongoose";


export const createOrUpdateUser = async(
    id,
    first_name,
    last_name,
    image_url,
    email_addresses,
    userName

) => {
    try {
        await connect();
        const user = await User.findByIdAndUpdate(
            {clerkId: id},
            {
                $set: {
                    firstName: first_name,
                    lastName: last_name,
                    profilePicture:image_url,
                    email: email_addresses[0].email_address,
                    userName,
                }

            }, {new:true, upsert: true}
        );
        return user;
    } catch (error) {
        console.log('Error creating or updating user:', error);
        
        
    }
};


export const deleteUser = async (id) => {
    try {
        await connect();
        await User.findOneAndDelete({clerkId: id})
    } catch (error) {
        console.log('Error creating or updating user:', error);
    }
}