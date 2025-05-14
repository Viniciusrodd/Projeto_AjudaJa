// libs
const mongoose = require('mongoose');
const supertest = require('supertest');
const { v4: uuidv4 } = require('uuid');

// configs
const app = require('../app');
const request = supertest(app);
require('dotenv').config();

// variables
let jwtToken = '';
let createdUserId = '';
let userActualPassword = '';


// mongoDB Connection
beforeAll(async () =>{
    await mongoose.connect('mongodb://localhost:27017/ajuda_ja', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000 // garante que falhe rápido se não conectar
    });
    console.log('MongoDB database connected');

    // login
    const userTest = {
        email: `vini@gmail.com`, password: 'vini123' 
    };
    
    const res = await request.post('/login').send(userTest);
    
    if(res.status === 200){
        console.log('USER LOGIN TEST, SUCCESS!!!');
        jwtToken = res.body.tokenVar
    }
}, 15000); // dá até 15 segundos para conectar

// mongoDB Disconnect
afterAll(async () => {
    await mongoose.disconnect();
    console.log('Mongoose disconnected after tests');
});


// tests
describe('User tests', () => {

    // user creation (without image)
    test('Should test a User Register (without image)...', async () =>{
        const userTest = {
            id: uuidv4(),
            name: 'userTest', email: `userTest${Date.now()}@gmail.com`, password: 'test123'
        };
        try{
            const res = await request.post('/register').send(userTest);

            if(res.status === 201){
                console.log('USER REGISTER TEST (WITHOUT IMAGE), SUCCESS!!!');
                createdUserId = userTest.id;
                userActualPassword = userTest.password;
            }

            expect(res.status).toEqual(201);
        }
        catch(error){
            console.error('ERROR AT USER REGISTER TEST (WITHOUT IMAGE)...', error);
            throw error;
        }
    }); 


    // user findOne
    test('Should test a findUser method...', async () =>{
        try{
            const res = await request.get(`/findUser/${createdUserId}`).set('Cookie', `token=${jwtToken}`);
            if(res.status === 200){
                console.log('FIND USER TEST, SUCCESS!!!');
                console.log(
                    res.body.userImage 
                    ? `USER WITH IMAGE: ${JSON.stringify(res.body.userData)}`
                    : `USER WITHOUT IMAGE: ${JSON.stringify(res.body.userData)}`
                );
            }
            expect(res.status).toEqual(200);
        }
        catch(error){
            console.error('ERROR AT FIND USER TEST...', error);
            throw error;
        }
    }, 15000); // 15 seg. máx for this test...


    // edit user (without image)
    test('Should test a edit user route...', async () =>{
        const userData = {
            name: 'nameEdited', email: `${Date.now()}@gmail.com`, role: 'usuario', 
            street: 'streetEdited', city: 'cityEdited', state: 'stateEdited', 
            zip_code: '000.000.000-00'
        };

        try{
            const res = await request.put(`/updateUser/${createdUserId}`)
            .set('Cookie', `token=${jwtToken}`)
            .field('name', userData.name)
            .field('email', userData.email)
            .field('role', userData.role)
            .field('street', userData.street)
            .field('city', userData.city)
            .field('state', userData.state)
            .field('zip_code', userData.zip_code);

            if(res.status === 200){
                console.log('EDIT USER TEST, SUCCESS!!!');
            }

            expect(res.status).toEqual(200);
        }
        catch(error){
            console.error('ERROR AT EDIT USER TEST...', error);
            throw error;
        }
    });


    // delete user (with token send)
    test('Should test a delete user route...', async () =>{
        try{
            const res = await request.delete(`/deleteUser/${createdUserId}`).set('Cookie', `token=${jwtToken}`);
            if(res.status === 200){
                console.log('USER DELETE TEST, SUCCESS!!!');
            }
            expect(res.status).toEqual(200);
        }
        catch(error){
            console.log('ERROR AT USER DELETE TEST...', error);
            throw error;
        }
    });


    // user LogOut
    test('Should test a user logOut route...', async () =>{        
        try{
            const res = await request.get('/logOut').set('Cookie', `token=${jwtToken}`);
            if(res.status === 200){
                console.log('USER LOGOUT TEST, SUCCESS!!!');
            }
            
            if(res.status === 401){
                console.error('ERROR AT LOGOUT BODY: ', res.body);
            }

            expect(res.status).toEqual(200);
        }
        catch(error){
            console.error('ERROR AT USER LOGOUT TEST...', error);
            throw error;
        }
    });
});