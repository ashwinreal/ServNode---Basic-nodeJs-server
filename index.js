const helmet = require('helmet');
const express = require('express');
const morgan = require('morgan');
const config = require('config');
const courses = require('./routes/courses');
const home = require('./routes/home');
const student = require('./routes/student');
const user = require('./routes/users');
const login = require('./routes/auth');
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/express-demo').then((res) => {
    console.log('connected to MongoDB');
}).catch((err) => {
    console.log(err);
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(helmet());
if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    console.log('Morgan enabled');
}
app.use(require('./middleware/logger'));


app.use('/api/courses', courses);
app.use('/api/students',  student);
app.use('/api/users', user);
app.use('/api/logins', login);
app.use('/',home);

// error middleware
app.use((err, req, res, next) => {
    res.status(500).send('Something is wrong');
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});


// console.log(config.get('name'));
// console.log(config.get('mail.host'));
// console.log(config.get('mail.password'));
// console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
// console.log(`NODE_ENV: ${app.get('env')}`);