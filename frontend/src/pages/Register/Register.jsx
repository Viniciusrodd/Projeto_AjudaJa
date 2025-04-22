
// css
import styles from './Register.module.css';

// hooks
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { userRegister } from '../../hooks/UserFetch/useRegister'; // custom hook
import { useNavigate } from 'react-router-dom';
import useTokenVerify from '../../hooks/UserMiddleware/useTokenVerify'; // custom hook

// components
import NavBar from '../../components/NavBar/NavBar';


const Register = () => {
    // states
    const [ name, setName ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');
    const [ image, setImage ] = useState('');
    const [ message, setMessage ] = useState('');
    const [ messageLogin, setMessageLogin ] = useState('');

    // consts
    const divImage = useRef(null);
    const messageRef = useRef(null);
    const messageLoginRef = useRef(null);
    const imageInput = useRef(null);
    const URL = 'http://localhost:2130/register';
    const navigate = useNavigate();

    
    // verify token for login
    const { data } = useTokenVerify();
    // verify login
    useEffect(() => {
        if(data){
            setMessageLogin('User já logado, você será redirecionado...');
        }
    }, [data]);
    // set messageLogin
    useEffect(() => {
        if(messageLogin !== '' && messageLoginRef.current){
            messageLoginRef.current.scrollIntoView({ behavior: "smooth" });
            const clearMessage = setTimeout(() => {
                setMessageLogin('');
                navigate('/');
            }, 3000);
    
            return () => clearTimeout(clearMessage);
        }
    }, [messageLogin]);


    // upload image
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


    // advice message
    useEffect(() => {
        if(message !== ''){
            messageRef.current.scrollIntoView({
                behavior: "smooth"
            });
            const clearMessage = setTimeout(() => {
                setMessage('');
            }, 3000);

            return () => {
                clearTimeout(clearMessage);
            };
        };
    }, [message]);


    // create user request
    const handleForm = async (e) =>{
        e.preventDefault();

        if(password != confirmPassword){
            setMessage('Por favor, confirme a senha correta...');
            return;
        }

        const data = new FormData();
        data.append('name', name);
        data.append('email', email);
        data.append('password', password);
        if(image) data.append('image', image);

        try{
            const response = await userRegister(URL, data);
            if(response.status === 201){
                setMessage('Usuário criado com sucesso!');

                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                divImage.current.style.backgroundImage = `url(../../../images/user.jpg)`
                imageInput.current.value = ''
            
                navigate('/login');
            }
        }
        catch(error){
            console.log('Error ar register user', error);
            setMessage('Erro ao criar usuário...');
        }
    };


    return (
        <div className='app_register_login'>
            <NavBar condition={ true } />

            <div className={ styles.register_container }>
                { message != '' && 
                    <p className='subtitle is-3' ref={ messageRef } style={{ backgroundColor:'black' }}>
                        { message }
                    </p> 
                }
                { messageLogin != '' && 
                    <p className='subtitle is-3' ref={ messageLoginRef } style={{ backgroundColor:'black' }}>
                        { messageLogin }
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
                    onChange={ uploadImage } ref={ imageInput }/>

                    <hr className='hr' />

                    <button className="button is-primary is-inverted">
                        Concluir
                    </button>

                    <hr className='hr' />

                    <h1 className={ styles.subtitle }>Já tem um perfil ?</h1>
                    <Link className='link_login'>Faça Login</Link>
                </form>
            </div>
        </div>
    );
};

export default Register;