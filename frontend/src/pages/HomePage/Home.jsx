
// css
import styles from './Home.module.css';

// hooks
import { useEffect, useState, useRef } from 'react';
import useTokenVerify from '../../hooks/UserMiddleware/useTokenVerify'; // custom hook
import { useNavigate } from 'react-router-dom';


const Home = () => {
    const { data } = useTokenVerify(); // custom hook
    const navigate = useNavigate();
    const messageRef = useRef(null);

    const [ isLogged, setIsLogged ] = useState(false);
    const [ message, setMessage ] = useState('');

    
    // login verify
    useEffect(() => {
        if(data){
            setIsLogged(true);
        }else{
            setMessage('É necessário login para continuar, você será redirecionado...');            
        }
    }, [data]);


    // advice message
    useEffect(() => {
        if(message !== ''){
            messageRef.current.scrollIntoView({
                behavior: "smooth"
            });
            const clearMessage = setTimeout(() => {
                setMessage('');
                navigate('/login');
            }, 3000);

            return () => {
                clearTimeout(clearMessage);
            };
        };
    }, [message]);

    return (
        <div className='container_default'>
            { message != '' && 
                <p className='subtitle is-3' ref={ messageRef } style={{ backgroundColor:'black' }}>
                    { message }
                </p> 
            }
            <h1 className='title is-1 '>AjudaJá - homepage</h1>
        </div>
    );
};

export default Home;
