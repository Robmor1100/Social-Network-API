
const router = require('express').Router();
const {User, Thought} = require("../../models")

//TODO - ROUTE THAT GETS ALL THE USERS, include friends?
router.get('/', (req,res)=> {
    User.find({})
    .select('-__v')
    .populate('friends')
    .populate('thoughts')
    .sort({ _id: -1 })
    .then(users => res.json(users))
    .catch(err => res.status(400).json(err));

});

//TODO - ROUTE THAT CREATES A NEW USER
router.post('/', (req,res)=> {
    User.create(req.body)
    .then(user => res.json(user))
    .catch(err => res.status(400).json(err));

});

//TODO - ROUTE THAT GETS A SINGLE USER BASED ON USER ID
router.get('/:userId', (req,res) => {
    User.findOne({_id: req.params.userId})
    .select('-__v')
    .populate('friends')
    .populate('thoughts')
    .then(user => {
        if(!user){
            res.status(404).json({message: 'No user found with this id!'});
            return;
        }
        res.json(user);
    })
    .catch(err => res.status(400).json(err));

});

//TODO - ROUTE THAT UPDATES A SINGLE USER
router.put('/:userId', (req,res)=> {
    User.updateOne(
        {_id: req.params.userId},
        { $set: req.body },
        { runValidators: true, new: true }
    )
    .then(user => {
        if(!user){
            res.status(404).json({message: 'No user found with this id!'});
            return;
        }
        res.json(user);
    })
    .catch(err => res.status(400).json(err));

});

//TODO - ROUTE THAT DELETES A SINGLE USER BASED ON USER ID AND REMOVES THE USERS THOUGHTS WHEN DELETED
router.delete('/:userId', (req,res)=> {
    User.deleteOne({_id: req.params.userId})
    .then(user => {
        if(!user){
            res.status(404).json({message: 'No user found with this id!'});
            return;
        }
        return Thought.deleteMany({_id: {$in: user.thoughts}});
    })
    .then(() => {
        res.json({message: 'User deleted!'});
    })
    .catch(err => res.status(400).json(err));

});

//TODO - ROUTE THAT ADDS A FRIEND TO A USER
router.post('/:userId/friends/:friendId', (req,res)=> {
    User.findOneAndUpdate(
        {_id: req.params.userId},
        {$push: {friends: req.params.friendId}},
        {new: true}
    )
    .then(user => {
        if(!user){
            res.status(404).json({message: 'No user found with this id!'});
            return;
        }
        res.json(user);
    })
    .catch(err => res.status(400).json(err));

});

//TODO - ROUTE THAT DELETES A FRIEND FROM A USER'S FRIENDS, DONT DELETE THE FRIEND AS A USER THOUGH!
router.delete('/:userId/friends/:friendId', (req,res)=> {
    User.findOneAndUpdate(
        {_id: req.params.userId},
        {$pull: {friends: req.params.friendId}},
        {new: true}
    )
    .then(user => {
        if(!user){
            res.status(404).json({message: 'No user found with this id!'});
            return;
        }
        res.json(user);
    })
    .catch(err => res.status(400).json(err));
  
});

module.exports = router;
