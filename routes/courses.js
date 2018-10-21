const express = require('express');
const router = express.Router();
const Joi = require('joi');
const courseDbManager = require('../db/courseDbLayer');

router.get('/', async (req, res) => {
    const courses = await courseDbManager.getCourses();
    res.status(200).send(courses);
});

router.get('/:id', async (req, res) => {
    let id = req.params.id;
    let course = await courseDbManager.getCourse(id);
    if(!course){
        res.status(404).send('id not found');
        return;
    }
    res.send(course);
});

router.post('/', async (req, res) => {
    const valRes = validateCourse(req.body);
    if(valRes.error){
        res.status(400).send('Input validation failed. '+valRes.error);
        return;
    }
    const course = await courseDbManager.createCourse(req.body);
    res.send(course);
});

router.put('/:id', async (req, res) => {
    const valRes = validateCourse(req.body);
    if(valRes.error){
        res.status(400).send('Input validation failed. '+valRes.error);
        return;
    }
    let id = req.params.id;
    course = await courseDbManager.updateCourse(id, req.body);
    if(!course){
        res.status(404).send('id not found');
        return;
    }
    res.send(course);
});

router.delete('/:id', async (req,res)=>{
    let id = req.params.id;
    let course = await courseDbManager.deleteCourse(id);
    if(!course){
        res.status(404).send('id not found');
        return;
    }
    res.send(course);
    
});

function validateCourse(course){
    const schema = Joi.object().keys({
        name: Joi.string().min(3).required(),
        category: Joi.string(),
        author: Joi.string(),
        tags: Joi.array().items(Joi.string()),
        date: Joi.date(),
        isPublished: Joi.boolean(),
        price: Joi.number()
    });

    return Joi.validate(course, schema);
}

module.exports = router;