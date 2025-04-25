
// css
import styles from '../Register/Register.module.css';

// hooks
import { useState, useRef, useEffect } from 'react';
import { useLogin } from '../../../hooks/UserFetch/useLogin';
import { useNavigate, Link } from 'react-router-dom';

// components
import NavBar from '../../../components/NavBar/NavBar';

const Login = () => {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');

    const [ message, setMessage ] = useState('');
    const messageRef = useRef(null);
    const navigate = useNavigate();

    // advice message
    useEffect(() => {
        if(message !== ''){
            messageRef.current.scrollIntoView({
                behavior: 'smooth'
            });
            const clearMessage = setTimeout(() => {
                setMessage('');
            }, 3000);

            return () => {
                clearTimeout(clearMessage);
            };
        };
    }, [ message ]);

    const handleLoginForm = async (e) => {
        e.preventDefault();

        if(password != confirmPassword){
            setMessage('Por favor, confirme a senha correta...');
            return;
        }

        const data = { email, password };

        try{
            const response = await useLogin(data);
            if(response.status === 200){
                setMessage('Usuário criado com sucesso!');
                navigate('/');
            }
        }
        catch(error){
            console.log('Error at Login user');
            setMessage('Erro ao efetuar Login de usuário...');
        }
    };

    return (
        <div className='app_register_login'>
            <NavBar condition={ true } />

            <div className={ styles.register_container }>
                { message !== '' && 
                    <p className='subtitle is-3' ref={ messageRef } style={{ backgroundColor:'black' }}>
                        { message }
                    </p>                  
                }
                <form onSubmit={ handleLoginForm } className={ `align_default ${styles.register_fields_container}` }>
                    <div className='img_container container_images'></div>

                    <h1 className='title is-3 has-text-black'>Faça seu Login...</h1>

                    <button className="button is-primary is-inverted">
                        Continue com Google <img src="../../../images/google_icon.png"/>
                    </button>

                    <h1 className={ styles.subtitle }>Ou</h1>
                    
                    <hr className='hr' />

                    <input type="email" name="email" className={ styles.input_register } 
                    placeholder='Seu email' value={ email } onChange={ (e) => setEmail(e.target.value) } />

                    <input type="password" name="password" className={ styles.input_register } 
                    placeholder='Sua senha' value={ password } onChange={ (e) => setPassword(e.target.value) } />

                    <input type="password" name="confirm_password" className={ styles.input_register } 
                    placeholder='Confirme sua senha' value={ confirmPassword } onChange={ (e) => setConfirmPassword(e.target.value) } />

                    <hr className='hr' />

                    <button className="button is-primary is-inverted">
                        Concluir
                    </button>

                    <hr className='hr' />

                    <h1 className={ styles.subtitle }>Não cadastrado ainda ? </h1>
                    <Link className='link_login_register' to='/cadastro'>
                        Clique aqui
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default Login;
