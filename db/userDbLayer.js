const mongoose = require('mongoose');

const schema = mongoose.Schema({
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
    }

});

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