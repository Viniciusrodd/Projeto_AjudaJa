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
                console.log('GET MESSAGES BETWEEN USERS TEST, SUCCESS!!!(with messages)');
            }else if(res.status === 204){
                console.log('GET MESSAGES BETWEEN USERS TEST, SUCCESS!!!(without messages)');
            }

            expect([200, 204]).toContain(res.status);
        }
        catch(error){
            console.error('ERROR AT GET MESSAGES BETWEEN USERS TESTS', error);
            throw error;
        }
    });


    // get notifications
    test('Should test a get all notifications', async () =>{
        try{
            const res = await request.get('/notifications').set('Cookie', `token=${jwtToken}`);
            if(res.status === 200){
                console.log('GET ALL NOTIFICATIONS TEST, SUCCESS!!! (with notifications)');
            }else if(res.status === 204){
                console.log('GET ALL NOTIFICATIONS TEST, SUCCESS!!! (without notifications)');
            }

            expect([200, 204]).toContain(res.status);
        }
        catch(error){
            console.error('ERROR AT GET ALL NOTIFICATIONS TEST', error);
            throw error;
        }
    });


    // delete notifications
    test('Should test a delete notifications', async () =>{
        try{
            const res = await request.delete(`/notification/${userID}`).set('Cookie', `token=${jwtToken}`);
            if(res.status === 200){
                console.log('DELETE NOTIFICATIONS TEST, SUCCESS!!! (with notifications)');
            }else if(res.status === 404){
                console.log('DELETE NOTIFICATIONS TEST, SUCCESS!!! (without notifications)');
            }

            expect([200, 404]).toContain(res.status);
        }
        catch(error){
            console.error('ERROR AT DELETE NOTIFICATIONS TEST', error);
            throw error;
        }
    });
});