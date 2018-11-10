const jwt = require('jsonwebtoken');

module.exports = function (req,res,next){
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access denied. No token sent');
    try{
        const decodedToken = jwt.verify(token, 'jwtPrivateKey');
        req.user = decodedToken;
        next();
    }catch(e){
        res.status(400).send('Access denied. Invalid token');
    }
    
}
// TODO: auth middleware only applied to `student.js` post method 
//       have to apply to all end points that we want to secure
//       mostly post and put. Get is okay, no need to secure now.