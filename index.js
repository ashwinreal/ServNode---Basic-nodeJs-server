const helmet = require('helmet');
const express = require('express');
const morgan = require('morgan');
const config = require('config');
const courses = require('./routes/courses');
const home = require('./routes/home');
const app = express();
// console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
// console.log(`NODE_ENV: ${app.get('env')}`);

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
app.use('/',home);

console.log(config.get('name'));
console.log(config.get('mail.host'));
// console.log(config.get('mail.password'));

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})