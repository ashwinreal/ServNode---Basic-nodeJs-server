const express = require('express');
const router = express.Router();
const Joi = require('joi');
const studentDbManager = require('../db/studentDbLayer');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', async (req, res) => {
    const student = await studentDbManager.getStudents();
    res.status(200).send(student);
});

router.get('/:id', async (req, res) => {
    let id = req.params.id;
    let student = await studentDbManager.getStudent(id);
    if(!student){
        res.status(404).send('id not found');
        return;
    }
    res.send(student);
});

router.post('/',auth, async (req, res) => {
    const valRes = validateStudent(req.body);
    if(valRes.error){
        res.status(400).send('Input validation failed. '+valRes.error);
        return;
    }
    const student = await studentDbManager.createStudent(req.body);
    res.send(student);
});

router.put('/:id', async (req, res) => {
    const valRes = validateStudent(req.body);
    if(valRes.error){
        res.status(400).send('Input validation failed. '+valRes.error);
        return;
    }
    let id = req.params.id;
    let student = await studentDbManager.updateStudent(id, req.body);
    if(!student){
        res.status(404).send('id not found');
        return;
    }
    res.send(student);
});

router.delete('/:id', [auth, admin], async (req,res)=>{
    let id = req.params.id;
    let student = await studentDbManager.deleteStudent(id);
    if(!student){
        res.status(404).send('id not found');
        return;
    }
    res.send(student);
});

function validateStudent(student){
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        phone: Joi.string(),
        batch: Joi.string()
    });

    return Joi.validate(student, schema);
}

module.exports = router;
