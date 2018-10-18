const express = require('express');
const router = express.Router();
const Joi = require('joi');

var courses = [];

router.get('/',(req, res) => {
    res.status(200).send(courses);
});

router.get('/:id',(req, res) => {
    let id = parseInt(req.params.id);
    let course = courses.filter(c => c.id === id);
    if(!course.length){
        res.status(404).send('id not found');
        return;
    }
    res.send(course);
});

router.post('/', (req, res) => {
    const valRes = validateCourse(req.body);
    if(valRes.error){
        res.status(400).send('Input validation failed. '+valRes.error);
        return;
    }
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

router.put('/:id',(req, res) => {
    const valRes = validateCourse(req.body);
    if(valRes.error){
        res.status(400).send('Input validation failed. '+valRes.error);
        return;
    }
    let id = parseInt(req.params.id);
    let course = courses.filter(c => c.id === id);
    if(!course.length){
        res.status(404).send('id not found');
        return;
    }
    course = course[0];
    course.name = req.body.name;
    res.send(course);
});

router.delete('/:id',(req,res)=>{
    let id = parseInt(req.params.id);
    let course = courses.filter(c => c.id === id);
    if(!course.length){
        res.status(404).send('id not found');
        return;
    }
    course = course[0];
    const index = courses.indexOf(course);
    courses.splice(index,1);
    res.send(course);
    
});

function validateCourse(course){
    const schema = Joi.object().keys({
        name: Joi.string().min(3).required()
    });

    return Joi.validate(course, schema);
}

module.exports = router;