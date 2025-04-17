
// css
import styles from './Register.module.css';


const Register = () => {
    return (
        <div className={ styles.register_container }>
            <div className={ `align_default ${styles.register_fields_container}` }>
                <div className='img_container container_images'></div>

                <h1 className='title is-3 has-text-black'>"Ajuda que conecta"</h1>

                <button className="button is-link is-outlined">
                    Continue com Google <img src="../../../public/images/google_icon.png"/>
                </button>

                <h1 className='title is-6 has-text-black'>Ou</h1>

                <input type="text" name="name" className={ styles.input_register } 
                placeholder='Seu nome'/>

                <input type="email" name="email" className={ styles.input_register } 
                placeholder='Endereço de Email'/>

                <input type="password" name="password" className={ styles.input_register } 
                placeholder='Crie uma senha'/>
            </div>
        </div>
    );
};

export default Register;