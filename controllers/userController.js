const {User, Friend} = require("../models");

module.exports = {

    // get all users
    getAllUsers(req,res) {
        User.find()
        .then((users) => res.json(users))
        .catch((err) => res.status(500).json(err));
    },
    // create a new user
    createUser(req,res) {
        User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err));
    },
    // get a single user by id
    getUserById(req,res) {
        User.findOne({ _id: req.params.userId })
        .select('-__v')
        .then((user) => 
        !user ? res.status(404).json({ message: 'No user found with this id!' }) 
        : res.json(user))
        .catch((err) => res.status(500).json(err));
    },
    // update a user by id
    updateUser(req,res) {
        User.updateOne(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
        .then((user) =>
        !user
        ? res.status(404).json({ message: 'No user found with this id!' })
        : res.json(user))
        .catch((err) => res.status(500).json(err));
    },
    // delete a user by id
    deleteUser(req,res) {
        User.deleteOne({ _id: req.params.userId })
        .then((user) =>
        !user
        ? res.status(404).json({ message: 'No user found with this id!' })
        : res.json(user))
        .catch((err) => res.status(500).json(err));
    },
    // add a new friend to a user's friend list
    addFriend(req,res) {
        Friend.create(req.body)
        .then((friend) => {
            return User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: friend._id } },
                { runValidators: true, new: true }
            )
        }
        )
        .then((user) =>
        !user
        ? res.status(404).json({ message: 'No user found with this id!' })
        : res.json(user))
        .catch((err) => res.status(500).json(err));

    },
    // remove a friend from a user's friend list
    removeFriend(req,res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { new: true }
        )
        .then((user) =>
        !user
        ? res.status(404).json({ message: 'No user found with this id!' })
        : res.json(user))
        .catch((err) => res.status(500).json(err));
        
    },


};
