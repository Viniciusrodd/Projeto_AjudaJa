
// css
import styles from './Register.module.css';

// hooks
import { Link } from 'react-router-dom';
import { useState, useRef } from 'react';

const Register = () => {
    const divImage = useRef(null);

    const uploadImage = (e) => {
        const file = e.target.files[0];
        if(file){
            const reader = new FileReader();

            reader.onload = (e) => {
                if(divImage.current){
                    divImage.current.style.backgroundImage = `url(${e.target.result})`;
                    divImage.current.style.backgroundSize = "cover";
                    divImage.current.style.backgroundRepeat = "no-repeat";
                    divImage.current.style.backgroundPosition = "center";
                }
            };

            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={ styles.register_container }>
            <div className={ `align_default ${styles.register_fields_container}` }>
                <div className='img_container container_images'></div>

                <h1 className='title is-3 has-text-black'>"Ajuda que conecta"</h1>

                <button className="button is-primary is-inverted">
                    Continue com Google <img src="../../../images/google_icon.png"/>
                </button>

                <h1 className={ styles.subtitle }>Ou</h1>

                <hr className='hr' />

                <input type="text" name="name" className={ styles.input_register } 
                placeholder='Seu nome'/>

                <input type="email" name="email" className={ styles.input_register } 
                placeholder='Endereço de Email'/>

                <input type="password" name="password" className={ styles.input_register } 
                placeholder='Crie uma senha'/>

                <input type="password" name="confirm_password" className={ styles.input_register } 
                placeholder='Confirme sua senha'/>

                <hr className='hr' />

                {/* image upload */}
                <h1 className={ styles.subtitle }>Escolha uma foto de perfil (opcional)</h1>

                <div className={ styles.div_imagem_perfil } ref={ divImage }>

                </div>
                {/* Formulário de upload de imagem */}
                <input type="file" name="imageCreate" accept="image/*" className={ styles.input_register } 
                onChange={ uploadImage }/>

                <hr className='hr' />

                <button className="button is-primary is-inverted">
                    Concluir
                </button>

                <hr className='hr' />

                <h1 className={ styles.subtitle }>Já tem um perfil ?</h1>
                <Link className='link_login'>Faça Login</Link>
            </div>
        </div>
    );
};

export default Register;