
// css
import '../../../utils/UsersCss/UsersUtil.css';

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

    // modal
    const [ modal_display, setModal_display ] = useState(false);
    const [ modal_title, setModal_title ] = useState(null);
    const [ modal_msg, setModal_msg ] = useState(null);
    const [ modal_btt, setmodal_btt ] = useState(false);
    const [ modal_btt_2, setModal_btt_2 ] = useState(false);
    const [ title_color, setTitle_color ] = useState('#000');

    // consts
    const navigate = useNavigate();


    ////////////// functions

    // scroll top at beginning
    useEffect(() =>{
        window.scrollTo(0, 0);
    }, []);

    // redirect
    useEffect(() =>{
        if(redirectHome){
            const clearMessage = setTimeout(() => {
                modal_config({
                    title1: null, msg: null, btt1: false, 
                    btt2: false, display: false, title_color: '#000'
                });
                navigate('/');
            }, 3000);
        
            return () => {
                clearTimeout(clearMessage);
            };
        }
    }, [redirectHome]);

    // modal config
    const modal_config = ({ title, msg, btt1, btt2, display, title_color }) => {
        setModal_title(title ?? null);
        setModal_msg(msg ?? null);
        setmodal_btt(btt1 ?? false);
        setModal_btt_2(btt2 ?? false);
        setModal_display(display ?? false);
        setTitle_color(title_color ?? '#000');

        // The "??" (nullish coalescing operator) 
        // returns the value on the right ONLY if the value on the left is null or undefined
    };    
    
    // close modal
    const closeModal = () =>{
        if(modal_btt_2 !== null){
            modal_config({
                title: null, msg: null, btt1: false, 
                btt2: false, display: false, title_color: '#000'
            });
        }
    };

    // verify login
    const { userData, errorRes } = useTokenVerify();
    useEffect(() => {
        if(userData){
            modal_config({
                title: 'Espere',
                msg: `Usuário já logado, você será redirecionado...`,
                btt1: false, btt2: false,
                display: 'flex', title_color: 'rgb(0, 136, 255)'
            });
            setRedirectHome(true);        
        }
        
        if(errorRes){
            console.log('Error at fetchToken at Login: ', errorRes);
        }
    }, [userData, errorRes]);

    // login
    const handleLoginForm = async (e) => {
        e.preventDefault();

        if(password != confirmPassword){
            modal_config({
                title: 'Erro',
                msg: `Por favor, confirme a senha correta para continuar...`,
                btt1: false, btt2: 'Tentar novamente',
                display: 'flex', title_color: 'rgb(255, 0, 0)'
            });
            return;
        }

        const data = { email, password };

        try{
            const response = await useLogin(data);
            if(response.status === 200){
                modal_config({
                    title: 'Sucesso',
                    msg: `Usuário logado \n
                    você será redirecionado para homepage...`,
                    btt1: false, btt2: false,
                    display: 'flex', title_color: 'rgb(38, 255, 0)'
                });
                setRedirectHome(true);
            }
        }
        catch(error){
            console.log('Error at Login user', error);
            modal_config({
                title: 'Erro',
                msg: `Erro ao efetuar login de usuário, \n 
                por favor tente novamente...`,
                btt1: false, btt2: 'Tentar novamente',
                display: 'flex', title_color: 'rgb(255, 0, 0)'
            });
        }
    };


    ////////////// jsx


    return (
        <div className='app_register_login'>
            <NavBar condition={ true } />

            { /* Modal */ }
            <div className='modal' style={{ display: modal_display ? 'flex' : 'none' }}>
            <div className='modal-background'></div>
                <div className='modal-card'>
                    <header className='modal-card-head'>
                        <p className='modal_title modal-card-title has-text-centered' 
                        style={{ textAlign:'center', color: title_color }}>
                            { modal_title }
                        </p>
                    </header>
                    <section className='modal-card-body'>
                        <p className='modal-card-title has-text-centered' style={{ textAlign:'center' }}>
                            {modal_msg?.split('\n').map((line, idx) => (
                                <span className='modal_span' key={idx}>
                                    {line}
                                    <br />
                                </span>
                            ))}
                        </p>
                    </section>
                    <footer className='modal-card-foot is-justify-content-center'>
                        <div className='div-buttons'>
                            {modal_btt && (
                                <button className="button is-danger is-dark">
                                    { modal_btt }
                                </button>
                            )}
                            {modal_btt_2 && (
                                <button onClick={ closeModal } className="button is-primary is-dark" 
                                style={{ marginLeft:'10px' }}>
                                    { modal_btt_2 }
                                </button>
                            )}
                        </div>
                    </footer>
                </div>
            </div>


            <div className='user_container'>
                <form onSubmit={ handleLoginForm } className={ `align_default user_fields_container` }>
                    <div className='img_container container_images'></div>

                    <h1 className='title is-3 has-text-black'>Faça seu Login...</h1>

                    <button className="button is-primary is-inverted">
                        Continue com Google <img src="../../../images/google_icon.png"/>
                    </button>

                    <h1 className='subtitleUsers'>Ou</h1>
                    
                    <hr className='hr' />

                    <input type="email" name="email" className='input_user' 
                    placeholder='Seu email' value={ email } onChange={ (e) => setEmail(e.target.value) } />

                    <input type="password" name="password" className='input_user' 
                    placeholder='Sua senha' value={ password } onChange={ (e) => setPassword(e.target.value) } />

                    <input type="password" name="confirm_password" className='input_user' 
                    placeholder='Confirme sua senha' value={ confirmPassword } onChange={ (e) => setConfirmPassword(e.target.value) } />

                    <hr className='hr' />

                    <button className="button is-primary is-inverted">
                        Concluir
                    </button>

                    <hr className='hr' />

                    <h1 className='subtitleUsers'>Não cadastrado ainda ? </h1>
                    <Link className='link_login_register' to='/cadastro'>
                        Registre-se
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default Login;
