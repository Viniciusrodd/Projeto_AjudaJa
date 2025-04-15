
// css
import styles from './NavBar.module.css'

const NavBar = () => {
    return (
        <nav className={ styles.nav_bar }>
            <div className={ styles.nav_bar_container }>
                <h1 className={ styles.title_navbar }>Ajuda<span>Já</span></h1>
                <div className={ `${styles.img_container} container_images` }></div>
            </div>

            <div className={ `${styles.profile_container} container_images` }>
                <span class="material-symbols-outlined" id='person'>person</span>
            </div>
        </nav>
    );
};

export default NavBar;
