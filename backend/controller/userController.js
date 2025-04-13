
class User{
    test(req, res){
        console.log('teste de rota');
        res.status(200).send('teste de rota, ok')
    };
}

export default new User();