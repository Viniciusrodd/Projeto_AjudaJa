
// import modules
import express from 'express';
const app = express();
import router from './routes/routes.js'; 


// use modules
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router);


export default app;