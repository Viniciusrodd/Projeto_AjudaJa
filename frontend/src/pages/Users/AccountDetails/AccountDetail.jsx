
// css
import '../../../utils/FormsCss/FormsUtil.css';
import '../../../utils/UsersCss/UsersUtil.css';


// hooks
import { useEffect, useState, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserdata } from '../../../hooks/UserFetch/useUserdata'; // custom hook

// services
import { useEditUser, useDeleteUser } from '../../../services/UserServices';

// context
import { UserContext } from '../../../context/UserContext';

// components
import SideBar from '../../../components/SideBar/SideBar';


const AccountDetail = () => {
    // states
    const [ userFields, setUserFields ] = useState({
        id: '', name:'', email:'', role:'', street:'', 
        city:'', state: '', zip_code:'', actual_password: '', new_password: ''
    });
    const [ imageField, setImageField ] = useState({ image_data: null, content_type: '' });
    const [ redirect, setRedirect ] = useState(false);

    // modal
    const [ modal_display, setModal_display ] = useState(false);
    const [ modal_title, setModal_title ] = useState(null);
    const [ modal_msg, setModal_msg ] = useState(null);
    const [ modal_btt, setmodal_btt ] = useState(false);
    const [ modal_btt_2, setModal_btt_2 ] = useState(false);
    const [ title_color, setTitle_color ] = useState('#000');
    const [ modal_errorType, setModal_errorType ] = useState(null);

    // consts
    const { userID } = useParams();
    const divImageRef = useRef(null);
    const navigate = useNavigate();
    const { setUserName } = useContext(UserContext);


    ////////////// functions
    
    // redirect user to homepage
    useEffect(() => {
        if(redirect === true){   
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
    }, [redirect]);
    
    // set fields from request
    const { userData, userImage, errorRes } = useUserdata(userID);
    useEffect(() => {
        if(userData){
            setUserName(userData.name);
            
            setUserFields({ ...userFields, 
                id: userData.id || '',
                name: userData.name || '',
                email: userData.email || '',
                role: userData.role || '',
                street: userData.street || '',
                city: userData.city || '',
                state: userData.state || '',
                zip_code: userData.zip_code || ''
            });
        }
        
        if(!userImage) return;

        setImageField({ ...imageField,
            image_data: userImage.image_data,
            content_type: userImage.content_type,
        });

        if(errorRes){
            console.log('Error at findUser at Homepage: ', errorRes);
        }
    }, [userData, userImage, errorRes]);

    // defining profile background image from request
    useEffect(() => {
        if (!divImageRef.current) return;

        if (imageField.image_data) {
            divImageRef.current.style.backgroundImage = `url(data:${imageField.content_type};base64,${imageField.image_data})`;
        } else {
            divImageRef.current.style.backgroundImage = `url('../../../images/user.jpg')`;
        }

        divImageRef.current.style.backgroundSize = "cover";
        divImageRef.current.style.backgroundRepeat = "no-repeat";
        divImageRef.current.style.backgroundPosition = "center";
    }, [imageField]);

    // uploading a profile image
    const uploadImage = (e) => {
        const file = e.target.files[0];
        if(file){
            setImageField(prev => ({ ...prev, file }));

            const reader = new FileReader();
            reader.onload = (e) => {
                if(divImageRef.current){
                    divImageRef.current.style.backgroundImage = `url(${e.target.result})`;
                    divImageRef.current.style.backgroundSize = "cover";
                    divImageRef.current.style.backgroundRepeat = "no-repeat";
                    divImageRef.current.style.backgroundPosition = "center";
                }
            };

            reader.readAsDataURL(file);
        }
    };

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

    // modal btt events
    const modal_events = (event) =>{
        if(event === 'delete profile'){
            delete_profile();
        }
    };

    // form to update user
    const handleForm = async (e) => {
        e.preventDefault();

        try{
            const formData = new FormData();

            for(const key in userFields){
                formData.append(key, userFields[key]);
            }

            if(imageField.file){
                formData.append('image', imageField.file);
            }    

            const response = await useEditUser(userFields.id, formData);

            if(response.status === 200){
                modal_config({
                    title: 'Sucesso',
                    msg: `Perfil atualizado! \n 
                    você será redirecionado para a página principal...`,
                    btt1: false, btt2: false,
                    display: 'flex', title_color: 'rgb(38, 255, 0)'
                });
                setRedirect(true);
            }
        }
        catch(error){
            console.log('Error at update user', error);
            if(error.response.data.errorPass){
                modal_config({
                    title: 'Erro',
                    msg: `Senha atual incorreta, tente novamente...`,
                    btt1: false, btt2: 'Tentar novamente',
                    display: 'flex', title_color: 'rgb(255, 0, 0)'
                });                
            }
        }
    };

    // modal messages
    const modal_deleteProfile = () =>{
        modal_config({
            title: 'Espere',
            msg: `Tem certeza que deseja excluir seu perfil ?`,
            btt1: 'Tenho certeza', btt2: 'Voltar',
            display: 'flex', title_color: 'rgb(0, 136, 255)'
        });
        setModal_errorType('delete profile');
    };
    
    // delete profile
    const delete_profile = async () =>{
        try{
            const res = await useDeleteUser(userID);

            if(res.status === 200){
                modal_config({
                    title: 'Sucesso',
                    msg: `Você será redirecionado... \n 
                    Ainda poderá criar nova conta mais tarde...`,
                    btt1: false, btt2: false,
                    display: 'flex', title_color: 'rgb(38, 255, 0)'
                });

                setTimeout(() => {
                    modal_config({
                        title1: null, msg: null, btt1: false, 
                        btt2: false, display: false, title_color: '#000'
                    });
                    navigate('/login');
                }, 3000);
            }    
        }
        catch(error){
            console.log('Error at delete user at front request', error);

            modal_config({
                title: 'Erro',
                msg: `Erro ao excluir usuário...`,
                btt1: false, btt2: 'Tentar novamente',
                display: 'flex', title_color: 'rgb(255, 0, 0)'
            });
        }
    };


    ////////////// jsx


    return (
        <div className='forms_container'>
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
                            { modal_msg }
                        </p>
                    </section>
                    <footer className='modal-card-foot is-justify-content-center'>
                        <div className='div-buttons'>
                            {modal_btt && (
                                <button onClick={ () => modal_events(modal_errorType) } className="button is-danger is-dark">
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


            { /* SIDEBAR */ }
            <SideBar />


            { /* Formulário */}
            <div className='form'>
                <form onSubmit={ handleForm } className='user_panel_container'>
                    <h1 className='title is-1'>Detalhes de conta</h1>

                    <h1 className='subtitle is-4' style={{ margin:'0px' }}>Edite sua foto de perfil</h1>
                    <div className='div_imagem_perfil' ref={divImageRef}>
                        
                    </div>
                    {/* Formulário de upload de imagem */}
                    <input type="file" name="image" accept="image/*" className='input_user' 
                    style={{ marginBottom:'30px' }} onChange={ uploadImage }/>

                    <hr className='hr'/>
                    <h1 className="title is-3">Seus dados</h1>

                    <div className='container_input'>
                        <label className="label title is-5" id="label">Nome: </label>
                        <input className="input is-hovered" name='name' type="text" value={ userFields.name }
                        onChange={ (e) => setUserFields({...userFields, name: e.target.value}) } required />
                    </div>
                    
                    <div className='container_input'>
                        <label className="label title is-5" id="label">Email: </label>
                        <input className="input is-hovered" name='email' type="text" value={ userFields.email }
                        onChange={ (e) => setUserFields({...userFields, email: e.target.value}) } required />
                    </div>

                    <div className='container_input'>
                        <label className="label title is-5" id="label">Senha Atual: </label>
                        <input className="input is-hovered" name='actual_password' type="password" value={ userFields.actual_password }
                        placeholder='Senha atual (opcional)'
                        onChange={ (e) => setUserFields({...userFields, actual_password: e.target.value}) } />
                    </div>

                    <div className='container_input'>
                        <label className="label title is-5" id="label">Senha Nova: </label>
                        <input className="input is-hovered" name='new_password' type="password" value={ userFields.new_password }
                        placeholder='Senha nova (opcional)'
                        onChange={ (e) => setUserFields({...userFields, new_password: e.target.value}) } />
                    </div>

                    <div className='container_input'>
                        <label className="label title is-5" id="label">Papel: </label>
                        <div className="select is-hovered" style={{ width:'70%' }}>
                            <select 
                                style={{ width:'100%' }} name='role' value={ userFields.role }
                                onChange={ (e) => setUserFields({...userFields, role: e.target.value}) }
                            >
                                <option value="usuario">Usuário</option>
                                <option value="moderador">Moderador</option>
                            </select>
                        </div>
                    </div>

                    <hr className='hr'/>
                    <h1 className="title is-3">Endereço</h1>

                    <div className='container_input'>
                        <label className="label title is-5" id="label">Rua: </label>
                        <input className="input is-hovered" name='street' type="text" value={ userFields.street }
                        onChange={ (e) => setUserFields({...userFields, street: e.target.value}) } />
                    </div>
                    <div className='container_input'>
                        <label className="label title is-5" id="label">Cidade: </label>
                        <input className="input is-hovered" name='city' type="text" value={ userFields.city }
                        onChange={ (e) => setUserFields({...userFields, city: e.target.value}) } />
                    </div>
                    <div className='container_input'>
                        <label className="label title is-5" id="label">Estado: </label>
                        <input className="input is-hovered" name='state' type="text" value={ userFields.state }
                        onChange={ (e) => setUserFields({...userFields, state: e.target.value}) } />
                    </div>
                    <div className='container_input'>
                        <label className="label title is-5" id="label">CEP: </label>
                        <input className="input is-hovered" name='cep' type="text" value={ userFields.zip_code }
                        onChange={ (e) => setUserFields({...userFields, zip_code: e.target.value}) } />
                    </div>

                    <hr className='hr'/>
                    <button className="button is-primary is-outlined">
                        Editar
                    </button>
                </form>

                <div className='delete_div' onClick={ modal_deleteProfile }>
                    <button className="button is-danger is-outlined">
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountDetail;
