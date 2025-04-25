
const sequelize = require('sequelize');
const mongoose = require('mongoose');
const { UserModel } = require('../Database/Relations');
const profileImage = require('../mongoDatabase/Collections/profileImages');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretToken = process.env.SECRET_TOKEN;

class User{
    // test
    test(req, res){
        //console.log('teste de rota');
        res.status(200).send({
            msg: 'teste ok'
        });
    };

    // register
    async registerUser(req, res){
        const { name, email, password } = req.body;
        const image = req.file;
        //console.log('imagem enviada: ', image);

        if(!name, !email, !password){
            return res.status(400).send({
                error: 'Bad request at fields: name, email, password'
            });
        }

        try{
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(password, salt);

            const newUser = await UserModel.create({
                name, email, password: hash, role: 'usuario'
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
            console.log('Internal server error at User creation', error);
            return res.status(500).json({
                msgError: 'Internal server error at User creation',
                details: error.response?.data || error.message
            });
        };
    };


    // login
    async Login(req, res){
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).send({
                emptyFields: 'Fields for login invalid'
            });
        }

        try{
            const user = await UserModel.findOne({ email });
            if(!user){
                return res.status(404).send({
                    emailNotFound: 'User email data not found...'
                });
            }

            const comparePassword = await bcrypt.compare(password, user.password);
            if(!comparePassword){
                return res.status(406).send({
                    status: false,
                    passwordNotFound: 'User password may wrong...'
                });
            }

            let tokenVar = jwt.sign({
                id: user.id,
                name: user.name,
                email: user.email,
                iat: Math.floor(Date.now() / 1000), // creation data (seconds)
                exp: Math.floor(Date.now() / 1000) + (10 * 24 * 60 * 60) // 10 days (seconds)
            }, secretToken);

            res.cookie('token', tokenVar,{
                httpOnly: true, // preventing access via JavaScript, avoiding XSS, (only server)
                sameSite: 'Strict', // protects against CSRF
                maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
            });

            return res.status(200).send({
                successMsg: 'User login successfully',
                user
            });
        }
        catch(error){
            console.log('Internal server error at Login controller', error);
            res.status(500).send({
                msgError: 'Internal server error at Login controller',
                details: error.response?.data || error.message
            });
        };
    };


    // findOne user
    async findUser(req, res){
        const userId = req.params.userID;
        if(!userId){
            return res.status(400).send({
                emptyParams: 'Bad request, need send user id params...'
            });
        }

        try{
            const userFind = await UserModel.findOne({id: userId});
            if(!userFind){
                return res.status(404).send({ errorFind: 'Error at find user data...' });
            }

            const userData = userFind.dataValues;
            return res.status(200).send({
                successFind: 'User data find with success',
                userData
            });
        }
        catch(error){
            console.log('Internal server error at Find user data controller', error);
            res.status(500).send({
                msgError: 'Internal server error at Find user data controller',
                details: error.response?.data || error.message
            });
        };
    };
};

module.exports = new User();