
// css
import styles from '../Register/Register.module.css';

// components
import NavBar from '../../components/NavBar/NavBar';

const Login = () => {
    return (
        <div className='app_register_login'>
            <NavBar condition={ true } />

            <div className={ styles.register_container }>
                <form className={ `align_default ${styles.register_fields_container}` }>
                    <div className='img_container container_images'></div>

                    <h1 className='title is-3 has-text-black'>Faça seu Login...</h1>

                    <button className="button is-primary is-inverted">
                        Continue com Google <img src="../../../images/google_icon.png"/>
                    </button>

                    <h1 className={ styles.subtitle }>Ou</h1>
                    
                    <hr className='hr' />

                    <input type="text" name="name" className={ styles.input_register } 
                    placeholder='Seu nome' />

                    <input type="password" name="password" className={ styles.input_register } 
                    placeholder='Sua senha' />

                    <input type="password" name="confirm_password" className={ styles.input_register } 
                    placeholder='Confirme sua senha' />

                    <hr className='hr' />

                    <button className="button is-primary is-inverted">
                        Concluir
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
