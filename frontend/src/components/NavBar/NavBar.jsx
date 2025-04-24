
// css
import styles from './NavBar.module.css'

// hooks
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useTokenVerify from '../../hooks/UserMiddleware/useTokenVerify';

const NavBar = ({ condition }) => {
    const { data } = useTokenVerify();
    const [ isLogged, setIsLogged ] = useState(false);

    useEffect(() => {
        if(data){
            setIsLogged(true);
        }
    }, [data]);

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
                    <p className={ styles.isLoggedMsg }>
                        Logado <i class="material-icons">check</i>
                    </p>
                </div>    
            ) : (       
                <div className={ `${styles.profile_container} container_images` }>
                    <Link to='/cadastro'>
                        <i class="material-icons" id='person'>person</i>
                    </Link>
                </div>                
            )}
        </nav>
    );
};

export default NavBar;
