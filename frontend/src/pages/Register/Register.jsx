
// css
import styles from './Register.module.css';

// hooks
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useUserRegister } from '../../hooks/UserFetch/useUserRegister'; // custom hook - create user

const Register = () => {
    const [ name, setName ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');
    const [ image, setImage ] = useState('');
    const [ message, setMessage ] = useState('');

    const divImage = useRef(null);
    const messageRef = useRef(null);
    const URL = 'http://localhost:2130/register';

    const uploadImage = (e) => {
        const file = e.target.files[0];
        if(file){
            const reader = new FileReader();
            setImage(file);

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


    useEffect(() => {
        if(message !== ''){
            messageRef.current.scrollIntoView({
                behavior: "smooth"
            });
            const clearMessage = setTimeout(() => {
                console.log('clear message executed...');
                setMessage('');
            }, 3000);

            return () => {
                clearTimeout(clearMessage);
                console.log('clear message remove...');
            };
        };    
    }, [message]);

    const handleForm = (e) =>{
        e.preventDefault();

        if(password != confirmPassword){
            setMessage('Por favor, confirme a senha correta...');
            return;
        }
        const data = {
            name, email, password, image
        }

        const { success } = useUserRegister(URL, data);
        if(success){
            setMessage(success);
            return;
        }
    };

    return (
        <div className={ styles.register_container }>
            { message !== '' && 
                <p className='subtitle is-3' ref={ messageRef } style={{ color:'red', backgroundColor:'#600000' }}>
                    { message }
                </p> 
            }
            <form onSubmit={ handleForm } className={ `align_default ${styles.register_fields_container}` }>
                <div className='img_container container_images'></div>

                <h1 className='title is-3 has-text-black'>"Ajuda que conecta"</h1>

                <button className="button is-primary is-inverted">
                    Continue com Google <img src="../../../images/google_icon.png"/>
                </button>

                <h1 className={ styles.subtitle }>Ou</h1>

                <hr className='hr' />

                <input type="text" name="name" className={ styles.input_register } 
                placeholder='Seu nome' value={ name } onChange={ (e) => setName(e.target.value) } />

                <input type="email" name="email" className={ styles.input_register } 
                placeholder='Endereço de Email' value={ email } onChange={ (e) => setEmail(e.target.value) }/>

                <input type="password" name="password" className={ styles.input_register } 
                placeholder='Crie uma senha' value={ password } onChange={ (e) => setPassword(e.target.value) }/>

                <input type="password" name="confirm_password" className={ styles.input_register } 
                placeholder='Confirme sua senha' value={ confirmPassword } onChange={ (e) => setConfirmPassword(e.target.value) }/>

                <hr className='hr' />

                {/* image upload */}
                <h1 className={ styles.subtitle }>Escolha uma foto de perfil (opcional)</h1>

                <div className={ styles.div_imagem_perfil } ref={ divImage }>

                </div>
                {/* Formulário de upload de imagem */}
                <input type="file" name="image" accept="image/*" className={ styles.input_register } 
                onChange={ uploadImage }/>

                <hr className='hr' />

                <button className="button is-primary is-inverted">
                    Concluir
                </button>

                <hr className='hr' />

                <h1 className={ styles.subtitle }>Já tem um perfil ?</h1>
                <Link className='link_login'>Faça Login</Link>
            </form>
        </div>
    );
};

export default Register;