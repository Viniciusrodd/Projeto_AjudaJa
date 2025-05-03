
const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);


describe('User tests', () => {
    test('Should test our first route', async () => {
        const res = await request.get('/teste');
        expect(res.status).toEqual(200);
        if(res){
            console.log('TEST OF FIRST ROUTE SUCCESS');
        }
    });


    // user register (without image)
    test('Should test a user register route', async () =>{
        const emailNumber = Math.floor(Math.random() * 10) + 1; // random number
        const userTest = {
            name: 'userTest', email: `userTest${emailNumber}@gmail.com`, password: 'test123' 
        };
        try{
            const res = await request.post('/register').send(userTest);
            expect(res.status).toEqual(201);
            if(res.status === 201){
                console.log('USER REGISTER TEST WITHOUT IMAGE, SUCCESS!!!');
            }
        }
        catch(error){
            console.log('ERROR AT USER REGISTER TEST...', error);
            throw error;
        }
    });


    
});