const { Thought, Reaction} = require('../models');

module.exports = {
    // get all thoughts
    getAllThoughts(req,res) {
        Thought.find()
        .then((thoughts) => res.json(thoughts))
        .catch((err) => res.status(500).json(err));
    },
    // Create a new thought
    createThought(req,res) {
        Thought.create(req.body)
        .then((thought) => res.json(thought))
        .catch((err) => res.status(500).json(err));
    },
    // Get a single thought by id
    getThoughtById(req,res) {
        Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v')
        .then((thought) => 
        !thought ? res.status(404).json({ message: 'No thought found with this id!' }) 
        : res.json(thought))
        .catch((err) => res.status(500).json(err));
    },
    // Update a thought by id
    updateThought(req,res) {
        Thought.updateOne(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )       
        .then((thought) =>
        !thought
        ? res.status(404).json({ message: 'No thought found with this id!' })
        : res.json(thought))
        .catch((err) => res.status(500).json(err));
    },
    // Delete a thought by id
    deleteThought(req,res) {
        Thought.deleteOne({ _id: req.params.thoughtId })
        .then((thought) =>
        !thought
        ? res.status(404).json({ message: 'No thought found with this id!' })
        : res.json(thought))
        .catch((err) => res.status(500).json(err));
    },
    // Create a reaction and add it to a thought
    createReaction(req,res) {
        Reaction.create(req.body)
        .then((reaction) => {
            return Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: reaction._id } },
                { runValidators: true, new: true }
            )
        })
        .then((thought) =>
        !thought
        ? res.status(404).json({ message: 'No thought found with this id!' })
        : res.json(thought))
        .catch((err) => res.status(500).json(err));
    },
    // Delete a reaction from a thought
    deleteReaction(req,res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: req.params.reactionId } },
            { runValidators: true, new: true }
        )
        .then((thought) =>
        !thought
        ? res.status(404).json({ message: 'No thought found with this id!' })
        : res.json(thought))
        .catch((err) => res.status(500).json(err));
    }
};
