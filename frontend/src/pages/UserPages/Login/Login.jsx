
// css
import styles from '../Register/Register.module.css';

// hooks
import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTokenVerify } from '../../../hooks/UserMiddleware/useTokenVerify'; // custom hook

// services
import { useLogin } from '../../../services/UserServices';

// components
import NavBar from '../../../components/NavBar/NavBar';

const Login = () => {
    // states
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');
    const [ redirectHome, setRedirectHome ] = useState(false);

    // consts
    const navigate = useNavigate();
    const modal = useRef(null);
    const modal_title = useRef(null);
    const modal_msg = useRef(null);
    const modal_btt = useRef(null);


    // verify login
    const { userData, errorRes } = useTokenVerify();
    useEffect(() => {
        if(userData){
            modal.current.style.display = 'flex';
            modal_msg.current.innerText = 'Usuário já logado, você será redirecionado...';
            modal_btt.current.style.display = 'none';
    
            setRedirectHome(true);        
        }
        
        if(errorRes){
            console.log('Error at fetchToken at Login: ', errorRes);
        }
    }, [userData, errorRes]);


    // redirect
    useEffect(() =>{
        if(redirectHome){
            const clearMessage = setTimeout(() => {
                navigate('/');
            }, 3000);
        
            return () => {
                clearTimeout(clearMessage);
            };
        }
    }, [redirectHome]);


    // login
    const handleLoginForm = async (e) => {
        e.preventDefault();

        if(password != confirmPassword){
            modal.current.style.display = 'flex';
            modal_msg.current.innerText = 'Por favor, confirme a senha correta para continuar...';
            modal_btt.current.innerText = 'Tentar novamente';          

            modal_btt.current.addEventListener('click', () =>{
                modal.current.style.display = 'none';
            });

            return;
        }

        const data = { email, password };

        try{
            const response = await useLogin(data);
            if(response.status === 200){
                modal.current.style.display = 'flex';
                modal_title.current.innerText = 'Sucesso'
                modal_msg.current.innerText = `Usuário logado \n
                você será redirecionado para homepage...`;
                modal_btt.current.style.display = 'none'; 

                setRedirectHome(true);
            }
        }
        catch(error){
            console.log('Error at Login user', error);
            modal.current.style.display = 'flex';
            modal_msg.current.innerText = `Erro ao efetuar login de usuário, \n 
            por favor tente novamente...`;
            modal_btt.current.innerText = 'Tentar novamente';

            if(modal_btt.current){
                modal_btt.current.onclick = () =>{
                    modal.current.style.display = 'none';
                };        
            }
        }
    };

    return (
        <div className='app_register_login'>
            <NavBar condition={ true } />

            { /* Modal */ }
            <div className='modal' ref={ modal }>
            <div className='modal-background'></div>
                <div className='modal-card'>
                    <header className='modal-card-head'>
                        <p className='modal-card-title' style={{ textAlign:'center' }} ref={ modal_title }>
                            Espere um pouco
                        </p>
                    </header>
                    <section className='modal-card-body'>
                        <p className='modal-card-title' ref={ modal_msg } style={{ textAlign:'center' }}>Mensagem de aviso...</p>
                    </section>
                    <footer className='modal-card-foot is-justify-content-center'>
                        <div className='div-buttons'>
                            <button className="button is-danger is-dark" ref={ modal_btt }>
                                Excluir
                            </button>
                        </div>
                    </footer>
                </div>
            </div>

            <div className={ styles.register_container }>
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
