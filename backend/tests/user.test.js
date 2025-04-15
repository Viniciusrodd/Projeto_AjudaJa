
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
});