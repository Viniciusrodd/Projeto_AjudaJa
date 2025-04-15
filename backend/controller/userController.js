
class User{
    test(req, res){
        //console.log('teste de rota');
        res.status(200).send({
            msg: 'teste ok'
        });
    };
};

module.exports = new User();