const express = require('express');
const app = express();
app.use(express.json());

app.get('/',(req, res) => {
    res.send('Hello world');
});

app.get('/api/courses',(req, res) => {
    res.status(200).send([1,2,3,4,5,6]);
});

app.get('/api/courses/:id',(req, res) => {
    res.send(req.params.id);
});

var courses = [];
app.post('/api/courses', (req, res) => {
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})