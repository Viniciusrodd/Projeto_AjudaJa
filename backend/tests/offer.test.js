// libs
const mongoose = require('mongoose');

// configs
const app = require('../app');
const supertest = require('supertest');
const request = supertest(app);

// variables
let jwtToken = '';
let userID = '';
const requestID = 'bd3e1f9a-8722-4b10-b63b-c9d41c0908b9'
let offerID = '';


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


describe('Offers tests', () =>{

    // offer create
    test('Should test a offer creation...', async () =>{
        const description = 'Description test...'
        try{
            const res = await request.post(`/createOffer/${userID}/${requestID}`).set('Cookie', `token=${jwtToken}`).send({ description });
            if(res.status === 200){
                console.log('OFFER CREATION TEST, SUCCESS!!!');
                offerID = res.body.offers.id
            }

            expect(res.status).toEqual(200);
        }
        catch(error){
            console.error('ERROT AT OFFER CREATION TEST...', error);
            throw error;
        }
    });


    // find all offers
    test('Should test a findAll offers...', async () =>{
        try{
            const res = await request.get(`/offers`).set('Cookie', `token=${jwtToken}`);
            if(res.status === 200){
                console.log('FIND ALL OFFERS TEST, SUCCESS!!!');
            }

            expect(res.status).toEqual(200);
        }
        catch(error){
            console.error('ERROT AT FIND ALL OFFERS TEST...', error);
            throw error;
        }
    });


    // offer status change
    test('Should test a offers status change...', async () =>{
        const decision = 'pendente';

        try{
            const res = await request.put(`/offerStatus/${offerID}`).set('Cookie', `token=${jwtToken}`).send({ decision });
            if(res.status === 200){
                console.log('OFFERS STATUS CHANGE TEST, SUCCESS!!!');
            }

            expect(res.status).toEqual(200);
        }
        catch(error){
            console.error('ERROT AT OFFERS STATUS CHANGE TEST...', error);
            throw error;
        }
    });
});