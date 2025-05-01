
// css
import styles from './NavBar.module.css'

// hooks
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTokenVerify } from '../../hooks/UserMiddleware/useTokenVerify'; // custom hook

// libs
import axios from 'axios';

const NavBar = ({ condition }) => {
    const [ isLogged, setIsLogged ] = useState(false);
    const [ userName, setUserName ] = useState('');
    const [ userId, setUserId ] = useState(null);

    useEffect(() => {
        const fetchToken = async () =>{
            try{
                const res = await useTokenVerify();
                if(res){
                    setIsLogged(true);
                    setUserId(res.data.user.id);
                }
            }
            catch(error){
                console.log('Error in fetchToken at navbar component: ', error);
            }
        };
        fetchToken();
    }, []);


    // get user name
    useEffect(() =>{
        if(userId !== null){
            const getUserName = async () =>{
                try{
                    const user = await axios.get(`http://localhost:2130/findUser/${userId}`);
                    setUserName(user.data.userData.name);
                }
                catch(error){
                    console.log('Error in getUserName at navbar component: ', error);
                }
            }
            getUserName();
        }
    }, [userId]);

    return (
        <nav className={ condition ? styles.nav_bar_register : styles.nav_bar }>
            <div className={ styles.nav_bar_container }>
                <Link to='/'>
                    <h1 className={ styles.title_navbar }>Ajuda<span>Já</span></h1>
                </Link>
                <div className='img_container container_images'></div>
            </div>

            { isLogged ? (
                <div className={ `${styles.profile_container}` }>
                    <i className="material-icons" id='person'>person</i>
                    <Link to={`/accountDetails/${userId}`} className={ styles.isLoggedMsg }>
                        Olá, { userName }!
                    </Link>
                </div>    
            ) : (       
                <div className={ `${styles.profile_container} container_images` }>
                    <Link to='/cadastro'>
                        <i className="material-icons" id='person'>person</i>
                    </Link>
                </div>                
            )}
        </nav>
    );
};

export default NavBar;
