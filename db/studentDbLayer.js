const mongoose = require('mongoose');

const schema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 255
    },
    phone: {
        type: String
    },
    batch: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        enum: ['ug', 'pg']
    }

});

const Student = mongoose.model('Student',schema);

async function getStudents(){
    const students = await Student.find();
    return students;
}

async function getStudent(id){
    const student = await Student.findById(id);
    return student;
}

async function createStudent(studentObj){
    try{
        const student = new Student(studentObj);
        const result = await student.save();
        return result;
    }catch(err){
        throw err;
    }
}

async function updateStudent(id, studentObj) {
    let student = await Student.findByIdAndUpdate(id, studentObj, {
        new: true
    });
    return student;

}

async function deleteStudent(id) {
    let res = await Student.findByIdAndRemove(id);
    return res;
}

module.exports = {
    getStudent,
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent
}