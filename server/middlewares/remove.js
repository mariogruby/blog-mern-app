import User from '../models/user.js';

export const removePostFromUsers = async function (next) {
    try {
        const postId = this._id;

        const users = await User.find({ userSavedPost: postId });

        console.log(`Post ID to remove: ${postId}`);
        console.log(`Users with this post saved: ${users.length}`);

        for (const user of users) {
            console.log(`Removing post from user: ${user.username}`);
            user.userSavedPost.pull(postId);
            await user.save();
        }
        console.log("Finished removing post from users.");
        next();
    } catch (error) {
        console.error("Error in removePostFromUsers middleware:", error);
        next(error);
    }
};
