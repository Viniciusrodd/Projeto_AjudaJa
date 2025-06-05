
// libs
const mongoose = require('mongoose');

// configs
const app = require('../app');
const supertest = require('supertest');
const request = supertest(app);


// variables
let jwtToken = '';
let userID = '';
let campaignID = '';
let title_campaign = '';


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
describe('Campaigns tests', () =>{

    // campaign create
    test('Should test a campaign creation...', async () =>{
        const today = new Date();
        today.setDate(today.getDate() + 1); // amanhã

        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 5); // + 5 dias...

        const campaignData = {
            moderator_id: userID, title: 'test', description: 'test', 
            start_date: today.toISOString().split('T')[0], 
            end_date: endDate.toISOString().split('T')[0]
        };

        try{
            const res = await request.post('/campaign').set('Cookie', `token=${jwtToken}`).send(campaignData);
            if(res.status === 200){
                console.log('CAMPAIGN CREATION TEST, SUCCESS!!!');
                campaignID = res.body.campaign.id;
                title_campaign = res.body.campaign.title;
            }

            expect(res.status).toEqual(200);
        }
        catch(error){
            console.error('ERROT AT CAMPAIGN CREATION TEST...', error);
            throw error;
        }
    });


    // find by title
    test('Should test a campaign search by title', async () =>{
        try{
            const res = await request.get(`/campaign/search/${title_campaign}`).set('Cookie', `token=${jwtToken}`);
            if(res.status === 200 || res.status === 204){
                console.log('SEARCH CAMPAIGN BY TITLE TEST, SUCCESS!!!');
            }
            expect([200, 204]).toContain(res.status);
        }
        catch(error){
            console.error('ERROR AT SEARCH CAMPAIGN BY TITLE TEST...', error);
            throw error;
        }
    });
});