const UserModel = require('../models/user.model');
const fs = require('fs');
const { uploadErrors } = require('../utils/error.utils');


module.exports.uploadProfil =  async (req, res) => {
    
    try {
        if (req.file.mimetype !== "image/jpg" && 
            req.file.mimetype !== "image/png" && 
            req.file.mimetype !== "image/jpeg")
            throw Error('invalid file');
        
        if (req.file.size > 500000) throw Error('max size');
    }catch(err){
        const errors = uploadErrors(err);
        return res.status(201).json(errors);
    }

    const fileName = req.body.name + '.jpg';

    var outStream = fs.createWriteStream(`${__dirname}/../client/public/uploads/profil/${fileName}`);
    await outStream.write(req.file.buffer);
    outStream.end();


    try {
        UserModel.findByIdAndUpdate(
            req.body.userId,
            { $set: { picture: "./uploads/profil/" + fileName }},
            { new: true },
            (err, docs) => {
                if (!err) return res.send(docs);
                else return res.status(500).send({ message: err});
            }
        )
    } catch (err) {
        return res.status(500).send({ message: err});
    }
}