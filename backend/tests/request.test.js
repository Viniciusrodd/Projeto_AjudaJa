// libs
const mongoose = require('mongoose');

// configs
const app = require('../app');
const supertest = require('supertest');
const request = supertest(app);

// variables
let jwtToken = '';
let userID = '';
let requestID = ''
let requestTitle = '';


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


// tests
describe('Request tests', () =>{
    
    // request create
    test('Should test a request creation...', async () =>{
        const postData = {
            title: 'test', description: 'test', category: 'livre', 
            urgency: 'baixa', latitude: -23.638056, longitude: -46.993745
        };
        try{
            const res = await request.post(`/createRequest/${userID}`).set('Cookie', `token=${jwtToken}`).send(postData);
            if(res.status === 200){
                console.log('HELP REQUEST CREATION TEST, SUCCESS!!!');
                requestID = res.body.helpPost.id;
                requestTitle = res.body.helpPost.title;
            }

            expect(res.status).toEqual(200);
        }
        catch(error){
            console.error('ERROR AT CREATE A HELP REQUEST...', error);
            throw error;
        }
    });


    // find requests
    test('Should test a find request route...', async () =>{
        try{
            const res = await request.get('/requests').set('Cookie', `token=${jwtToken}`);
            if(res.status === 200 || res.status === 204){
                console.log('FIND REQUEST TEST, SUCCESS!!!');
            }

            // can be 200 or 204...
            expect([200, 204]).toContain(res.status);
        }
        catch(error){
            console.error('ERROR AT FIND HELP POSTS REQUESTS...', error);
            throw error;
        }
    });


    // find request by id
    test('Should test a find request by id route...', async () =>{
        try{
            const res = await request.get(`/request/${requestID}`).set('Cookie', `token=${jwtToken}`);
            if(res.status === 200 || res.status === 204){
                console.log('FIND REQUEST BY ID TEST, SUCCESS!!!');
            }

            // can be 200 or 204...
            expect([200, 204]).toContain(res.status);
        }
        catch(error){
            console.error('ERROR AT FIND HELP POSTS REQUESTS BY ID TEST...', error);
            throw error;
        }
    });


    // find request by title
    test('Should test a find request by title route...', async () =>{
        try{
            const res = await request.get(`/requestSearch/${requestTitle}`).set('Cookie', `token=${jwtToken}`);
            if(res.status === 200 || res.status === 204){
                console.log('FIND REQUEST BY TITLE TEST, SUCCESS!!!');
            }

            // can be 200 or 204...
            expect([200, 204]).toContain(res.status);
        }
        catch(error){
            console.error('ERROR AT FIND HELP POSTS REQUESTS BY TITLE TEST...', error);
            throw error;
        }
    });


    // edit request
    test('Should test a edit request route...', async () =>{
        const requestData_edited = {
            title: 'title edited', description: 'description edited', 
            category: 'livre', urgency: 'alta', status: 'aberto'
        };
        try{
            const res = await request.put(`/updateRequest/${requestID}`).set('Cookie', `token=${jwtToken}`).send(requestData_edited);
            if(res.status === 200){
                console.log('EDIT REQUEST TEST, SUCCESS!!!');
            }

            expect(res.status).toEqual(200);
        }
        catch(error){
            console.error('ERROR AT EDIT REQUEST TEST...', error);
            throw error;
        }
    });


    // delete request
    test('Should test a delete request route...', async () =>{
        try{
            const res = await request.delete(`/deleteRequest/${requestID}`).set('Cookie', `token=${jwtToken}`);
            if(res.status === 200){
                console.log('DELETE REQUEST TEST, SUCCESS!!!');
            }

            expect(res.status).toEqual(200);
        }
        catch(error){
            console.error('ERROR AT DELETE REQUEST TEST...', error);
            throw error;
        }
    });
});