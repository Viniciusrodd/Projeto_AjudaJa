
const sequelize = require('sequelize');
const { UserModel } = require('../Database/Relations');

class User{
    test(req, res){
        //console.log('teste de rota');
        res.status(200).send({
            msg: 'teste ok'
        });
    };

    async register(req, res){
        const { name, email, password } = req.body;
        const image = req.file;

        if(!name, !email, !password){
            return res.status(400).send({
                emptyCamps: 'Bad request at fields sended'
            });
        }

        if(!image){
            try{
                await UserModel.create({
                    name, email, password, role: 'usuario'
                });
                console.log('New User creation Without profile image');
                return res.status(200).send({
                    msg:'New User creation Without profile image'
                });
            }
            catch(error){
                console.log('Internal server error at User creation', error);
                return res.status(500).json({
                    msgError: 'Internal server error at User creation',
                    details: error.response?.data || error.message
                });
            };
        }

        // Try/catch for Logic for create a user with image using a mongodb...
    };
};

module.exports = new User();