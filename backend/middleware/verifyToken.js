
const jwt = require('jsonwebtoken');
const secretToken = 'gbdsajkgabkgbbfdbagkfagfda';


class Middleware{
    async verifyToken(req, res, next){
        const token = res.cookies.token;
        if(!token){
            return res.status(401).json({
                errorVerify: 'User not authenticated'
            });
        }

        jwt.verify(token, secretToken, (err, data) => {
            if(err){
                return res.status(403).json({ invalidToken: "Invalid token" });
            }

            req.user = data; // add user data at request
            next();
        });
    };
}

module.exports = new Middleware();