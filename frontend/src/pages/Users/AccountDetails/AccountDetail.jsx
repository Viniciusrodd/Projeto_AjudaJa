
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
    // consts
    const { userID } = useParams();
    const divImageRef = useRef(null);
    const navigate = useNavigate();
    const modal = useRef(null);
    const modal_title = useRef(null);
    const modal_msg = useRef(null);
    const modal_btt = useRef(null);
    const modal_btt_2 = useRef(null);
    const { setUserName } = useContext(UserContext);

    // states
    const [ userFields, setUserFields ] = useState({
        id: '', name:'', email:'', role:'', street:'', 
        city:'', state: '', zip_code:'', actual_password: '', new_password: ''
    });
    const [ imageField, setImageField ] = useState({ image_data: null, content_type: '' });
    const [ redirect, setRedirect ] = useState(false);
    
    
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
                modal.current.style.display = 'flex';
                modal_title.current.innerText = 'Sucesso!!!'
                modal_msg.current.innerText = `Perfil atualizado! \n 
                você será redirecionado para a página principal...`;
                modal_btt.current.style.display = 'none';
                modal_btt_2.current.style.display = 'none';

                setRedirect(true);
            }
        }
        catch(error){
            console.log('Error at update user', error);
            if(error.response.data.errorPass){
                modal.current.style.display = 'flex';
                modal_msg.current.innerText = 'Senha atual incorreta, tente novamente...'
                modal_btt.current.innerText = 'Tentar novamente'
                modal_btt_2.current.style.display = 'none';

                modal_btt.current.addEventListener('click', () =>{
                    modal.current.style.display = 'none';
                });
            }
        }
    };


    // redirect user to homepage
    useEffect(() => {
        if(redirect === true){   
            const clearMessage = setTimeout(() => {
                navigate('/');
            }, 3000);
            
            return () => {
                clearTimeout(clearMessage);
            };
        }
    }, [redirect]);


    // modal messages
    const modal_deleteProfile = () =>{
        modal.current.style.display = 'flex';
        modal_msg.current.innerText = 'Tem certeza que deseja excluir seu perfil ?'
        modal_btt.current.innerText = 'Tenho certeza'
        
        modal_btt.current.addEventListener('click', delete_profile);
        modal_btt_2.current.onclick = () =>{
            modal.current.style.display = 'none';
        };
    };

    
    // delete profile
    const delete_profile = async () =>{
        try{
            const res = await useDeleteUser(userID);

            if(res.status === 200){
                modal.current.style.display = 'flex';
                modal_title.current.innerText = 'Sucesso'
                modal_msg.current.innerText = `Você será redirecionado... \n 
                Ainda poderá criar nova conta mais tarde...`;
                modal_btt.current.style.display = 'none';
                modal_btt_2.current.style.display = 'none';                

                const clearMessage = setTimeout(() => {
                    navigate('/cadastro');
                }, 3000);
        
                return () => {
                    clearTimeout(clearMessage);
                };
            }    
        }
        catch(error){
            console.log('Error at delete user at front request', error);
            modal.current.style.display = 'flex';
            modal_msg.current.innerText = `Erro ao excluir usuário...`;
            modal_btt.current.innerText = 'Tente novamente';
            modal_btt_2.current.style.display = 'none';

            modal_btt.current.onclick = () => {
                modal.current.style.display = 'none';
            };           
        }
    };


    return (
        <div className='forms_container'>
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
                            <button className="button is-primary is-dark" ref={ modal_btt_2 } style={{ marginLeft:'10px' }}>
                                Voltar
                            </button>
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
