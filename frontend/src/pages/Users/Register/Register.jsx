
// css
import styles from './Register.module.css';

// hooks
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTokenVerify } from '../../../hooks/UserMiddleware/useTokenVerify'; // custom hook

// services
import { userRegister } from '../../../services/UserServices';

// components
import NavBar from '../../../components/NavBar/NavBar';


const Register = () => {
    // states
    const [ name, setName ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');
    const [ image, setImage ] = useState('');
    const [ redirectHome, setRedirectHome ] = useState(false);
    const [ redirectLogin, setRedirectLogin ] = useState(false);

    // consts
    const divImage = useRef(null);
    const imageInput = useRef(null);
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
            console.log('Error at fetchToken at Register: ', errorRes);
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

        if(redirectLogin){
            const clearMessage = setTimeout(() => {
                navigate('/login');
            }, 3000);
        
            return () => {
                clearTimeout(clearMessage);
            };
        }
    }, [redirectHome, redirectLogin]);


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


    // create user request
    const handleForm = async (e) =>{
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

        const data = new FormData();
        data.append('name', name);
        data.append('email', email);
        data.append('password', password);
        if(image) data.append('image', image);

        try{
            const response = await userRegister(data);
            if(response.status === 201){
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                divImage.current.style.backgroundImage = `url(../../../images/user.jpg)`
                imageInput.current.value = ''

                modal.current.style.display = 'flex';
                modal_title.current.innerText = 'Sucesso'
                modal_msg.current.innerText = `Usuário criado!!! \n 
                você será redirecionado para login...`;
                modal_btt.current.style.display = 'none';            
    
                setRedirectLogin(true);
            }
        }
        catch(error){
            console.log('Error ar register user', error);

            modal.current.style.display = 'flex';
            modal_msg.current.innerText = 'Erro ao registrar usuário, por favor tente novamente...';
            modal_btt.current.innerText = 'Tentar novamente';

            modal_btt.current.onclick = () =>{
                modal.current.style.display = 'none';
            };
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

                    <h1 className={ styles.subtitle }>Já tem um perfil cadastrado ?</h1>
                    <Link className='link_login_register' to='/login'>
                        Faça Login
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default Register;