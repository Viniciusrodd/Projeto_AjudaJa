
// import modules
import express from 'express';
import cors from 'cors';
import router from './routes/routes.js'; 

const app = express();

// use modules
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/', router);


export default app;