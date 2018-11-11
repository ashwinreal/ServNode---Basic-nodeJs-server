module.exports = function (req,res,next){
    // req.user is already set
    if(!req.user.isAdmin){
        return res.status(403).send('Access denied. Not an admin');
    }
    next();
}
// TODO: auth middleware only applied to `student.js` delete method 
//       have to apply to all end points that we want to secure with authorization
