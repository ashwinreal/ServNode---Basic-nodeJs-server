const userDbManager = require('../db/userDbLayer');
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const _ = require('lodash');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    const valRes = validateLogin(req.body);
    if(valRes.error){
        res.status(400).send('Wrong Username or Password');
        return;
    }
    let user = await userDbManager.getUserWithProps({email :req.body.email});
    user = user[0];
    if(!user){
        res.status(400).send('Wrong Username or Password');
        return;
    }
    
    let isValid = await bcrypt.compare(req.body.password, user.password);
    if(!isValid){
        res.status(400).send('Wrong Username or Password');
        return;
    }
    const token  = user.generateAuthToken();
    res.send(token);
});

function validateLogin(obj){
    const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });
    return Joi.validate(obj, schema);
}

module.exports = router;