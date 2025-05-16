

class LogOut{
    // util function
    logOut(res){
        return res.clearCookie('token',{
            httpOnly: true,
            sameSite: 'Strict'
        });  
    };
};

module.exports = new LogOut();