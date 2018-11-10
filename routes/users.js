const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const userDbManager = require('../db/userDbLayer');
const auth = require('../middleware/auth');

router.get('/me', auth, async (req, res)=>{
    // req.user is comming from the middleware, not the payload
    const user = await userDbManager.getUser(req.user._id);
    res.send(_.pick(user, ['_id', 'name']));
})

router.post('/', async (req, res) => {
    try {
        const valRes = validateUser(req.body);
        if (valRes.error) {
            res.status(400).send('Input validation failed. ' + valRes.error);
            return;
        }
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt) 
        const user = await userDbManager.createUser(req.body);
        const token  = user.generateAuthToken();
        res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
    }catch(ex){
        res.status(500).send('Internal Error Occurred');
        console.log(ex);
    }
    
});

function validateUser(user) {
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    return Joi.validate(user, schema);
}

module.exports = router;
