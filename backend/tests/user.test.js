
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);


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


    // edit user
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
            console.log('ERROR AT EDIT USER TEST...', error);
            throw error;
        }
    });


    
});