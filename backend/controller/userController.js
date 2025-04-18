
const sequelize = require('sequelize');
const mongoose = require('mongoose');
const { UserModel } = require('../Database/Relations');
const profileImage = require('../mongoDatabase/Collections/profileImages');

class User{
    test(req, res){
        //console.log('teste de rota');
        res.status(200).send({
            msg: 'teste ok'
        });
    };

    async registerUser(req, res){
        const { name, email, password } = req.body;
        const image = req.file;

        if(!name, !email, !password){
            return res.status(400).send({
                error: 'Bad request at fields: name, email, password'
            });
        }

        try{
            const newUser = await UserModel.create({
                name, email, password, role: 'usuario'
            });

            if(!image){
                console.log('New User creation Without profile image');
                return res.status(201).send({
                    msg:'New User creation Without profile image'
                });    
            }

            // mongo creation
            const newImage = await profileImage.create({
                image_data: image.buffer,
                content_type: image.mimetype,
                user_id: newUser.id
            });

            // update image of user sql
            await UserModel.update(
                { profile_image_id: newImage._id.toString() },
                { where: { id: newUser.id } }
            );

            console.log('New User creation With profile image');
            return res.status(201).send({
                msg:'New User creation With profile image'
            });
        }
        catch(error){
            console.log('Internal server error at User creation without image', error);
            return res.status(500).json({
                msgError: 'Internal server error at User creation without image',
                details: error.response?.data || error.message
            });
        };
    };
};

module.exports = new User();