
// css
import styles from './Home.module.css';

// hooks
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Home = () => {
    // consts
    const navigate = useNavigate();

    return (
        <div>
            <h1 className='title is-1 '>AjudaJá - homepage</h1>
        </div>
    );
};

export default Home;
