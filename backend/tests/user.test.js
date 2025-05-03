
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

    // random number
    const randomNumber = Math.floor(Math.random() * 10) + 1; // random number
    
    // user register (without image)
    test('Should test a User Register (without image)...', async () =>{
        const userTest = {
            name: 'userTest', email: `userTest${randomNumber}@gmail.com`, password: 'test123' 
        };
        try{
            const res = await request.post('/register').send(userTest);
            expect(res.status).toEqual(201);
            if(res.status === 201){
                console.log('USER REGISTER TEST (WITHOUT IMAGE), SUCCESS!!!');
            }
        }
        catch(error){
            console.log('ERROR AT USER REGISTER TEST (WITHOUT IMAGE)...', error);
            throw error;
        }
    });


    test('Should test a User Login...', async () =>{
        const userTest = {
            email: `userTest@gmail.com`, password: 'test123' 
        };

        try{
            const res = await request.post('/login').send(userTest)
            expect(res.status).toEqual(200);
            if(res.status === 200){
                console.log('USER LOGIN TEST, SUCCESS!!!');
            }
        }
        catch(error){
            console.log('USER LOGIN TEST ERROR...', error);
            throw error;
        }
    }); 
});