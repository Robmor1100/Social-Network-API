
const router = require('express').Router();
const { Thought, User, Reaction} = require('../../models')

//TODO: ROUTE TO GET ALL THOUGHTS
router.get('/', (req,res)=> {
    Thought.find({})
    .select('-__v')
    .populate('reactions')
    .sort({ _id: -1 })
    .then(thoughts => res.json(thoughts))
    .catch(err => res.status(400).json(err))
});

//TODO: ROUTE TO CREATE A NEW THOUGHT AND ADD IT TO THE USER
router.post('/', (req,res)=> {
    Thought.create(req.body)
    .then(({_id}) => {
        return User.findOneAndUpdate(
            {_id: req.body.userId},
            {$push: {thoughts: _id}},
            {new: true}
        );
    })
    .then(userData => {
        if(!userData){
            res.status(404).json({message: 'No user found with this id!'});
            return;
        }
        res.json(userData);
    })
    .catch(err => res.json(err));

});

//TODO: ROUTE TO GET SINGLE THOUGHT BASED ON THOUGHT ID
router.get('/:thoughtId', (req,res)=> {
    Thought.findOne({_id: req.params.thoughtId})
    .select('-__v')
    .populate('reactions')
    .then(thought => {
        if(!thought){
            res.status(404).json({message: 'No thought found with this id!'});
            return;
        }
        res.json(thought);       
    })
    .catch(err => res.status(400).json(err));

});

//TODO: ROUTE TO UPDATE A THOUGHT
router.put('/:thoughtId', (req,res)=> {
    Thought.findOneAndUpdate(
        {_id: req.params.thoughtId},
        {$set: req.body},
        {new: true}
    )
    .then(thought => {
        if(!thought){
            res.status(404).json({message: 'No thought found with this id!'});
            return;
        }
        res.json(thought);
    })
    .catch(err => res.status(400).json(err));
});

//TODO: ROUTE TO DELETE A THOUGHT BASED ON THOUGHT ID
router.delete('/:thoughtId', (req,res)=> {
    Thought.findOneAndDelete({_id: req.params.thoughtId})
    .then(thought => {
        if(!thought){
            res.status(404).json({message: 'No thought found with this id!'});
            return;
        }
        res.json(thought);
    })
    .catch(err => res.status(400).json(err));

});

//TODO: ROUTE CREATE A REACTION STORED IN A SINGLE THOUGHT'S ARRAY
router.post('/:thoughtId/reactions', (req,res)=> {
    Reaction.create(req.body)
    .then(({_id}) => {
        return Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$push: {reactions: _id}},
            {new: true}
        );
    })
    .then(thought => {
        if(!thought){
            res.status(404).json({message: 'No thought found with this id!'});
            return;
        }
        res.json(thought);
    }
    )
    .catch(err => res.status(400).json(err));

});
//TODO: ROUTE TO DELETE A REACTION FROM A THOUGHT BASED ON THOUGHT ID AND REACTION ID
router.delete('/:thoughtId/reactions/:reactionId', (req,res)=> {
    Reaction.findOneAndDelete({_id: req.params.reactionId})
    .then(reaction => {
        if(!reaction){
            res.status(404).json({message: 'No reaction found with this id!'});
            return;
        }
        return Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$pull: {reactions: req.params.reactionId}},
            {new: true}
        );
    }
    )
    .then(thought => {
        if(!thought){
            res.status(404).json({message: 'No thought found with this id!'});
            return;
        }
        res.json(thought);
    }
    )
    .catch(err => res.status(400).json(err));

})

module.exports = router;
