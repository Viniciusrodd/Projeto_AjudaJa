
// css
import '../../../utils/UsersCss/UsersUtil.css';

// hooks
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTokenVerify } from '../../../hooks/UserMiddleware/useTokenVerify'; // custom hook

// services
import { userRegister } from '../../../services/UserServices';

// components
import NavBar from '../../../components/NavBar/NavBar';
import Modal from '../../../components/Modal';


const Register = () => {
    // states
    const [ name, setName ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');
    const [ image, setImage ] = useState('');
    const [ redirectHome, setRedirectHome ] = useState(false);
    const [ redirectLogin, setRedirectLogin ] = useState(false);

    // modal
    const [ modal_display, setModal_display ] = useState(false);
    const [ modal_title, setModal_title ] = useState(null);
    const [ modal_msg, setModal_msg ] = useState(null);
    const [ modal_btt, setmodal_btt ] = useState(false);
    const [ modal_btt_2, setModal_btt_2 ] = useState(false);
    const [ title_color, setTitle_color ] = useState('#000');

    // consts
    const divImage = useRef(null);
    const imageInput = useRef(null);
    const navigate = useNavigate();


    ////////////// functions

    // scroll top at beginning
    useEffect(() =>{
        window.scrollTo(0, 0);
    }, []);    

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
    const closeModal = () => {
        modal_config({
            title: null,
            msg: null,
            btt1: false,
            btt2: false,
            display: false,
            title_color: '#000'
        });
    };    

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

        if(redirectLogin){
            const clearMessage = setTimeout(() => {
                modal_config({
                    title1: null, msg: null, btt1: false, 
                    btt2: false, display: false, title_color: '#000'
                });
                navigate('/login');
            }, 3000);
        
            return () => {
                clearTimeout(clearMessage);
            };
        }
    }, [redirectHome, redirectLogin]);

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
            console.log('Error at fetchToken at Register: ', errorRes);
        }
    }, [userData, errorRes]);

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
            modal_config({
                title: 'Erro',
                msg: `Por favor, confirme a senha correta para continuar...`,
                btt1: false, btt2: 'Tentar novamente',
                display: 'flex', title_color: 'rgb(255, 0, 0)'
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

                modal_config({
                    title: 'Sucesso',
                    msg: `Usuário criado \n
                    você será redirecionado para login...`,
                    btt1: false, btt2: false,
                    display: 'flex', title_color: 'rgb(38, 255, 0)'
                });
                setRedirectLogin(true);
            }
        }
        catch(error){
            console.log('Error ar register user', error);

            modal_config({
                title: 'Erro',
                msg: `Erro ao registrar usuário, por favor tente novamente...`,
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
            <Modal 
                title={ modal_title }
                msg={ modal_msg }
                btt1={ modal_btt }
                btt2={ modal_btt_2 }
                display={ modal_display }
                title_color={ title_color } 
                onClose={ closeModal }
            />


            { /* page */ }
            <div className='user_container'>
                <form onSubmit={ handleForm } className={ `align_default user_fields_container` }>
                    <div className='img_container container_images'></div>

                    <h1 className='title is-3 has-text-black'>"Ajuda que conecta"</h1>

                    <button className="button is-primary is-inverted">
                        Continue com Google <img src="../../../images/google_icon.png"/>
                    </button>

                    <h1 className='subtitleUsers'>Ou</h1>

                    <hr className='hr' />

                    <input type="text" name="name" className='input_user' 
                    placeholder='Seu nome' value={ name } onChange={ (e) => setName(e.target.value) } />

                    <input type="email" name="email" className='input_user' 
                    placeholder='Endereço de Email' value={ email } onChange={ (e) => setEmail(e.target.value) }/>

                    <input type="password" name="password" className='input_user' 
                    placeholder='Crie uma senha' value={ password } onChange={ (e) => setPassword(e.target.value) }/>

                    <input type="password" name="confirm_password" className='input_user' 
                    placeholder='Confirme sua senha' value={ confirmPassword } onChange={ (e) => setConfirmPassword(e.target.value) }/>

                    <hr className='hr' />

                    {/* image upload */}
                    <h1 className='subtitleUsers'>Escolha uma foto de perfil (opcional)</h1>

                    <div className='div_imagem_perfil' ref={ divImage }>

                    </div>
                    {/* Formulário de upload de imagem */}
                    <input type="file" name="image" accept="image/*" className='input_user' 
                    onChange={ uploadImage } ref={ imageInput }/>

                    <hr className='hr' />

                    <button className="button is-primary is-inverted">
                        Concluir
                    </button>

                    <hr className='hr' />

                    <h1 className='subtitleUsers'>Já tem um perfil cadastrado ?</h1>
                    <Link className='link_login_register' to='/login'>
                        Faça Login
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default Register;