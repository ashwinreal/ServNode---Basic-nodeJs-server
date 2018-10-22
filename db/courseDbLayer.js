const mongoose = require('mongoose');

const schema = mongoose.Schema({
    name: {
        type:String,
        required: true,
        minlength: 5,
        maxlength: 255
        },
    category: {
        type: String,
        enum: ['web', 'wobile', 'network'],
        required: true,
        lowercase: true,
        trim: true
    },
    author: String,
    tags: {
        type:[String],
        validate:{
            isAsync: true,
            validator: function(v, callback){
                setTimeout(()=>{
                    const result = v && v.length > 0;
                    callback(result);
                },4000);
            },
            message: 'A course should have atleast one tag'
        }
    },
    date: {type: Date, default: Date.now},
    isPublished: Boolean,
    price: {
        type: Number,
        required: function(){ return this.isPublished;},
        get: v => Math.round(v),
        set: v => Math.round(v)
    }
});

const Course = mongoose.model('Course', schema)

async function getCourses() {
    const courses = await Course.find();
    return courses;
}

async function getCourse(id) {
    const course = await Course.find({_id: id});
    return course;
}

async function createCourse(courseObj) {
    try{
        const course = new Course(courseObj);
        const result = await course.save(course);
        return result;
    }catch(err){
        throw err;
    }
}

async function updateCourse(id, courseObj) {
    let course = await Course.findByIdAndUpdate(id, courseObj, {
        new: true
    });
    return course;

}

async function deleteCourse(id) {
    let res = await Course.findByIdAndRemove(id);
    return res;
}

module.exports = {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
}