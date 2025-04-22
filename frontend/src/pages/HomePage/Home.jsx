
// css
import styles from './Home.module.css';

// hooks
import { useEffect } from 'react';
import { useTokenVerify } from '../../hooks/UserMiddleware/useTokenVerify';


const Home = () => {

    useEffect(() => {
        const fetch = async () => {
            const res = await useTokenVerify();
            console.log(res);
        }
        fetch();
    }, []);

    return (
        <div>
            <h1 className='title is-1 '>AjudaJá - homepage</h1>
        </div>
    );
};

export default Home;
