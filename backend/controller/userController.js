
// data base
const { UserModel, CampaignModel, OfferModel, RequestModel } = require('../Database/Relations');
const profileImage = require('../mongoDatabase/Collections/profileImages');
const connection = require('../Database/Connection/connection');
const { Op } = require('sequelize');

// security
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretToken = process.env.SECRET_TOKEN;

// services
const LogOut_service = require('../services/userServices/logOut');

// class
class User{
    // register
    async registerUser(req, res){
        const { id, name, email, password } = req.body;
        const image = req.file;

        if(!name || !email || !password){
            return res.status(400).send({
                error: 'Bad request at fields sended'
            });
        }

        try{
            let hash = bcrypt.hashSync(password, 10);
            let newUser;

            if(id){
                newUser = await UserModel.create({ id, name, email, password: hash, role: 'usuario' });
            }else{
                newUser = await UserModel.create({
                    name, email, password: hash, role: 'usuario'
                });
            }

            if(!image){
                console.log('New User creation Without profile image');
                return res.status(201).send({
                    msg:'New User creation Without profile image'
                });    
            }

            // mongo creation
            const newImage = await profileImage.create({
                image_data: image.buffer.toString('base64'),
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
            const user = await UserModel.findOne({ where: { email } });
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
                user,
                tokenVar
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
            const userFind = await UserModel.findOne({ where:{ id: userId } });
            if(!userFind){
                return res.status(404).send({ errorFind: 'Error at find user data...' });
            }

            const userData = userFind.dataValues;
            const userImage = await profileImage.findOne({ user_id: userData.id });

            if(!userImage){
                return res.status(200).send({
                    successFind: 'User data find (without image) with success',
                    userData
                });    
            }

            return res.status(200).send({
                successFind: 'User data find with success',
                userData, userImage
            });
        }
        catch(error){
            console.error('Internal server error at Find user data controller', error);
            res.status(500).send({
                msgError: 'Internal server error at Find user data controller',
                details: error.message
            });
        };
    };


    // findAll users
    async findAllUsers(req, res){
        try{
            const users_data = await UserModel.findAll({
                attributes: ['id', 'name', 'role']
            });
            if(users_data.length === 0){
                return res.status(204).send({ 
                    noContent: `There's no users data...` 
                });
            }

            // get users ids
            const users_ids = users_data.map(data => data.id);

            // associated images
            const profile_images = await profileImage.find({
                user_id: { $in: users_ids }
            });

            // mapping user_id => images
            const imageMap = {};
            profile_images.forEach((image) =>{
                imageMap[image.user_id] = {
                    image_data: image.image_data,
                    content_type: image.content_type
                };
            });

            // combine users data + images
            const combined_data = users_data.map(user =>({
                ...user.dataValues, // sequelize instances, we need to extract the data
                profile_image: imageMap[user.id] || null
            }));

            return res.status(200).send({
                msg: 'Users find with success',
                combined_data
            });
        }
        catch(error){
            console.error('Internal server error at Find all users', error);
            return res.status(500).send({
                msgError: 'Internal server error at Find all users',
                details: error.response?.data || error.message 
            });
        }
    };


    // find user by name
    async findUserByName(req, res){
        const user_name = req.params.userName;
        if(!user_name){
            return res.status(400).send({
                error: 'Bad request at user_name params'
            });
        }

        try{
            const user_data = await UserModel.findAll({
                where: {
                    name: { [Op.like]: `%${user_name}%` }
                }
            });
            if(user_data.length === 0){
                return res.status(204).send({
                    msg: 'No users found matching the name'
                });                
            }

            // get users ids
            const users_ids = user_data.map(user => user.id);

            // associated images
            const profile_images = await profileImage.find({
                user_id: { $in: users_ids }
            });

            // mapping user_id => images
            const imageMap = {};
            profile_images.forEach((image) =>{
                imageMap[image.user_id] = {
                    image_data: image.image_data,
                    content_type: image.content_type
                }
            });

            // combine users data + images
            const combined_data = user_data.map(user =>({
                ...user.dataValues,
                profile_image: imageMap[user.id] || null
            }));

            return res.status(200).send({
                msg: 'Users find by name with success',
                combined_data
            });
        }
        catch(error){
            console.error('Internal server error at Find user by name', error);
            return res.status(500).send({
                msgError: 'Internal server error at Find user by name', 
                details: error.response?.data || error.message
            });
        }
    };


    // edit user
    async editUser(req, res){
        const userId = req.params.userID;
        const { name, email, actual_password, new_password, role, street, city, state, zip_code } = req.body;
        const userImage = req.file;

        if(!userId){
            return res.status(400).send({
                idRequired: 'Bad request, userId requires...'
            });
        }

        try{
            const userExist = await UserModel.findOne({ where: { id: userId } });
            if(!userExist){
                return res.status(404).send({
                    userNotFound: 'User data not found...'
                });
            }

            const dinamicData = {};
            if(name){ dinamicData.name = name }
            if(email){ dinamicData.email = email }
            
            if(actual_password && new_password){ 
                const comparePass = await bcrypt.compare(actual_password, userExist.password);
                if(!comparePass){
                    return res.status(404).send({
                        errorPass: 'Actual password not found'
                    });
                }
                let salt = bcrypt.genSaltSync(10);
                let hash = bcrypt.hashSync(new_password, salt);
                dinamicData.password = hash;
            }

            if(role){ dinamicData.role = role }
            if(street){ dinamicData.street = street }
            if(city){ dinamicData.city = city }
            if(state){ dinamicData.state = state }
            if(zip_code){ dinamicData.zip_code = zip_code }

            await UserModel.update(dinamicData, {
                where: { id: userId }
            });

            // get updated user
            const updatedUser = await UserModel.findOne({ where: { id: userId } });

            let updatedToken = jwt.sign({
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + (10 * 24 * 60 * 60)
            }, secretToken);

            res.cookie('token', updatedToken, {
                httpOnly: true,
                sameSite: 'Strict',
                maxAge: 10 * 24 * 60 * 60 * 1000,
            });

            if(!userImage){
                return res.status(200).send({
                    successMsg: 'Update user with success (without image)',
                    updatedUser
                });
            }
        
            // mongo update
            const imageUpdate = await profileImage.findOneAndUpdate({ user_id: userId }, {
                image_data: userImage.buffer.toString('base64'),
                content_type: userImage.mimetype
            }, { new: true, upsert: true }); 
            // "new: true" returns document updated... 
            // "upsert: true" create a document even he doesnt exist

            await UserModel.update(
                { profile_image_id: imageUpdate._id.toString() },
                { where: { id: userId } }
            );

            return res.status(200).send({
                successMsg: 'Update user with success (with image)',
                updatedUser
            });
        }
        catch(error){
            console.log('Internal server error at Edit user data controller', error);
            res.status(500).send({
                msgError: 'Internal server error at Edit user data controller',
                details: error.response?.data || error.message
            });
        }
    };


    // delete user
    async deleteUser(req, res){
        const userId = req.params.userID;
        if(!userId){
            return res.status(400).send({
                errorMsg: 'Bad request at user id params...' 
            });
        }

        try{
            await connection.transaction(async (t) => {
                await CampaignModel.destroy({
                    where: { moderator_id: userId },
                    transaction: t
                });

                await OfferModel.destroy({
                    where: { user_id: userId },
                    transaction: t
                });

                await RequestModel.destroy({
                    where: { user_id: userId },
                    transaction: t
                });
                
                await UserModel.destroy({
                    where: { id: userId },
                    transaction: t
                });
            });

            // clear token
            await LogOut_service.logOut(res);

            return res.status(200).send({
                successMsg: 'User profile + self relations deleted with success'
            });
        }
        catch(error){
            console.log('Internal server error at Delete user data', error);
            res.status(500).send({
                msgError: 'Internal server error at Delete user data',
                details: error.response?.data || error.message
            });
        }
    };


    // user logOut route
    async logOutRoute(req, res){
        try{
            // clear token
            await LogOut_service.logOut(res);
            return res.status(200).send({ message: "User logOut successfully" });
        }
        catch(error){
            console.error('Internal server error at logOut route', error);
            res.status(500).send({
                msgError: 'Internal server error at logOut route',
                details: error.response?.data || error.message
            });
        };
    };
};

module.exports = new User();