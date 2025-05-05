
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretToken = process.env.SECRET_TOKEN;

class Middleware{
    async verifyToken(req, res, next){
        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({
                errorVerify: 'User not authenticated'
            });
        }

        jwt.verify(token, secretToken, (err, data) => {
            if(err){
                console.log('JWT verification failed:', err);
                return res.status(403).json({ invalidToken: "Invalid token" });
            }

            req.user = data; // add user data at request
            next();
        });
    };
}

module.exports = new Middleware();