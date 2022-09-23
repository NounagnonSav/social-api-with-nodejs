const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
}

module.exports.userInfo = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send(`ID is not a valid ${req.params.id}`)

    UserModel.findById(req.params.id, (err, docs) => {
        if (!err) res.send(docs);
        else console.log(`ID is not a valid ${err}`)
    }).select('-password');
}

module.exports.updateUser =  (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send(`ID is not a valid ${req.params.id}`);

    UserModel.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    bio: req.body.bio
                }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true},
            (err, docs) => {
                if (!err) return res.send(docs);
                if (err) res.status(500).send({ message: err});
            }
        );
    
}

module.exports.deleteUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send(`ID is not a valid ${req.params.id}`);

    try {
        await UserModel.remove({ _id: req.params.id }).exec();
        res.status(200).json({ message: "successfully deleted."});
    }
    catch (err){
        return res.status(500).json({ message: "unsuccessfully deleted."});
    }
}

module.exports.follow =  (req, res) => {
    if (!ObjectID.isValid(req.params.id)  || !ObjectID.isValid(req.body.idToFollow))
        return res.status(400).send(`ID is not a valid ${req.params.id}`);

    
    // Add to follower list
    UserModel.findByIdAndUpdate(
        req.params.id,
        {$addToSet: {following: req.body.idToFollow}},
        { new: true},
        (err, docs) => {
            if (!err)  res.status(201).json(docs);
            else return res.status(400).json(err);
        }
    );

    // Add to following list
    UserModel.findByIdAndUpdate(
        req.body.idToFollow,
        {$addToSet: {followers: req.params.id}},
        { new: true},
        (err, docs) => {
            // if (!err)  res.status(201).json(docs);
            if (err) return res.status(400).json(err);
        }
    );
    
}

module.exports.unfollow = (req, res) => {
    if (!ObjectID.isValid(req.params.id)  || !ObjectID.isValid(req.body.idToUnFollow))
        return res.status(400).send(`ID is not a valid ${req.params.id}`);

    // Add to follower list
    UserModel.findByIdAndUpdate(
        req.params.id,
        {$pull: {following: req.body.idToUnFollow}},
        { new: true},
        (err, docs) => {
            if (!err)  res.status(201).json(docs);
            else return res.status(400).json(err);
        }
    );

    // Add to following list
    UserModel.findByIdAndUpdate(
        req.body.idToUnFollow,
        {$pull: {followers: req.params.id}},
        { new: true},
        (err, docs) => {
            // if (!err)  res.status(201).json(docs);
            if (err) return res.status(400).json(err);
        }
        );
}