const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 255
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean
    }

});

schema.methods.generateAuthToken = function(){
    const token  = jwt.sign({ _id: this._id, isAdmin: this.isAdmin}, 'jwtPrivateKey'); //TODO: store private key to an env variable
    return token;
}

const User = mongoose.model('User',schema);

async function createUser(userObj){
    try{
        const user = new User(userObj);
        const result = await user.save();
        return result;
    }catch(err){
        throw err;
    }
}

async function getUser(id){
    const user = await User.findById(id);
    return user;
}

async function getUserWithProps(props){
    const user = await User.find(props);
    return user;
}

module.exports = {
    createUser,
    getUser,
    getUserWithProps
}