// libs
const mongoose = require('mongoose');

// configs
const app = require('../app');
const supertest = require('supertest');
const request = supertest(app);

// variables
let jwtToken = '';
let userID = '';


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
        userID = res.body.user.id
    }
}, 15000); // dá até 15 segundos para conectar

// mongoDB Disconnect
afterAll(async () => {
    await mongoose.disconnect();
    console.log('Mongoose disconnected after tests');
});


describe('Chat tests', () =>{
    // get messages between users
    test('Should test a get messages between users', async () =>{
        try{
            const res = await request.get(`/messages/${userID}`).set('Cookie', `token=${jwtToken}`);
            if(res.status === 200){
                console.log('GET MESSAGES BETWEEN USERS TEST, SUCCESS!!!');
            }

            expect(res.status).toEqual(200);
        }
        catch(error){
            console.error('ERROR AT GET MESSAGES BETWEEN USERS TESTS', error);
            throw error;
        }
    });
});