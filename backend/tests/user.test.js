
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);
const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE0NDM0YzQ0LWMzZTUtNDc3OS1iYTIwLTE2NzFiNmRmNjVjYSIsIm5hbWUiOiJtYXJpYSIsImVtYWlsIjoibWFyaWFAZ21haWwuY29tIiwiaWF0IjoxNzQ2MzA3OTg4LCJleHAiOjE3NDcxNzE5ODh9.4HXIRSChUxhUiVcgXLhotfvi2v8-nhOxo6h_2MoDD9s'


// mongoDB Connection
beforeAll(async () =>{
    await mongoose.connect('mongodb://localhost:27017/ajuda_ja', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000 // garante que falhe rápido se não conectar
    });
    console.log('MongoDB database connected');
}, 15000); // dá até 15 segundos para conectar

// mongoDB Disconnect
afterAll(async () => {
    await mongoose.disconnect();
    console.log('Mongoose disconnected after tests');
});


// tests
describe('User tests', () => {
    // random number
    const randomNumber = Math.floor(Math.random() * 1000) + 1; // random number


    // user register (without image)
    test('Should test a User Register (without image)...', async () =>{
        const userTest = {
            id: 'd9ba1e35-bc5a-4b39-b115-86f08318390d',
            name: 'userTest', email: `userTest${randomNumber}@gmail.com`, password: 'test123' 
        };
        try{
            const res = await request.post('/register').send(userTest);

            if(res.status === 201){
                console.log('USER REGISTER TEST (WITHOUT IMAGE), SUCCESS!!!');
            }

            expect(res.status).toEqual(201);
        }
        catch(error){
            console.error('ERROR AT USER REGISTER TEST (WITHOUT IMAGE)...', error);
            throw error;
        }
    });


    // user login
    test('Should test a User Login...', async () =>{
        const userTest = {
            email: `vini@gmail.com`, password: 'vini123' 
        };

        try{
            const res = await request.post('/login').send(userTest);
            
            if(res.status === 200){
                console.log('USER LOGIN TEST, SUCCESS!!!');
            }

            expect(res.status).toEqual(200);
        }
        catch(error){
            console.error('ERROR AT USER LOGIN TEST...', error);
            throw error;
        }
    }); 


    // user findOne
    test('Should test a findUser method...', async () =>{
        const userId = '4dae5317-2ec2-4e0c-925a-afee03684ced';

        try{
            const res = await request.get(`/findUser/${userId}`);
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
        const userId = '179bf611-a3a0-4e97-bbcc-4d0de572a22c';
        const userData = {
            name: 'nameEdited', email: 'emailEdited', role: 'usuario',
            street: 'streetEdited', city: 'cityEdited', state: 'stateEdited',
            zip_code: '000.000.000-00'
        };

        try{
            const res = await request.put(`/updateUser/${userId}`).send(userData);
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
        const userId = 'd9ba1e35-bc5a-4b39-b115-86f08318390d';

        try{
            const res = await request.delete(`/deleteUser/${userId}`).set('Cookie', `token=${jwtToken}`);
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