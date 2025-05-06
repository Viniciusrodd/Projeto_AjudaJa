
// css
import styles from './NavBar.module.css'

// hooks
import { Link } from 'react-router-dom';
import { useContext } from 'react';

// context
import { UserContext } from '../../context/UserContext';


const NavBar = ({ condition }) => {
    const { isLogged, userName, userId } = useContext(UserContext);

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
                    <Link to={`/detalhesDeConta/${userId}`} className={ styles.isLoggedMsg }>
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
