
import supertest from "supertest";
import app from '../app.js';
const request = supertest(app);


describe('User tests', () =>{
    // initial test
    test('Should test first route', async () => {
        const res = await request.get('/test')
        if(res){
            console.log('TEST ONE SUCCESS');
        }
        expect(res.status).toEqual(200);
    })
})
