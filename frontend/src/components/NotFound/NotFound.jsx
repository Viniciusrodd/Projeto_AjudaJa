
// css
import styles from './NotFound.module.css';
import '../../utils/FeedsCss/FeedsUtil.css';

// components
import SideBar from '../SideBar/SideBar';

// hooks
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const NotFound = () => {
    // states
    const [ cont, setCont ] = useState(5);
    const [ timer, setTimer ] = useState(true);

    // const
    const navigate = useNavigate();


    //////// functions


    useEffect(() =>{
        if(timer){
            const regressiveCont = setInterval(() => {
                setCont(prevCont => prevCont - 1);
            }, 1000);

            return () =>{
                clearInterval(regressiveCont);
            };
        }
    }, [timer]);


    useEffect(() =>{
        if(cont === 0){
            navigate('/');
        }
    }, [cont])


    //////// jsx


    return (
        <div className='container_home'>
            { /* SIDEBAR */ }
            <SideBar />

            <div className='container_feed'>
                <div className={ styles.notfound }>
                    <i className="material-icons">close</i>
                    <h1>404</h1>
                    <h2>Página não encontrada</h2>
                </div>
                <p className={ styles.p_notfound }>
                    Você será redirecionado em... <strong style={{ color:'red' }}>{ cont }</strong>
                </p>
            </div>
        </div>
    );
};

export default NotFound;
