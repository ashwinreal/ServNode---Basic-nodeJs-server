const express = require('express');
const app = express();
const Joi = require('joi');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
// console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
// console.log(`NODE_ENV: ${app.get('env')}`);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(helmet());

console.log(config.get('name'));
console.log(config.get('mail.host'));
// console.log(config.get('mail.password'));
if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    console.log('Morgan enabled');
}
// app.use(require('./logger'));


var courses = [];
app.get('/',(req, res) => {
    res.send('Hello world');
});

app.get('/api/courses',(req, res) => {
    res.status(200).send(courses);
});

app.get('/api/courses/:id',(req, res) => {
    let id = parseInt(req.params.id);
    let course = courses.filter(c => c.id === id);
    if(!course.length){
        res.status(404).send('id not found');
        return;
    }
    res.send(course);
});

app.post('/api/courses', (req, res) => {
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

app.put('/api/courses/:id',(req, res) => {
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

app.delete('/api/courses/:id',(req,res)=>{
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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})