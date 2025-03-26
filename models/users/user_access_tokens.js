const mongoose = require('mongoose');

// user Access Token Schema
const userAccessTokenSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
    },
    access_token: {
        type: String,
    },
    refresh_token: {
        type: String,
    },
}, {
    timestamps: {},
});
userAccessTokenSchema.index({ user_id: 1 });
const UserAccessToken = mongoose.model('access_token', userAccessTokenSchema);

module.exports = UserAccessToken;
