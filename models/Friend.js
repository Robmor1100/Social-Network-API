const {Schema, Types, model} = require('mongoose');

const friendSchema = new Schema(
    {
        friendId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
    },
    username: {
        type: String,
        required: true
    }
},
{
    toJSON: {
        getters: true
    },
    id: false
}
);

const Friend = model('Friend', friendSchema);

module.exports = Friend;