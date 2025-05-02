
// css
import styles from './AccountDetail.module.css';
import stylesRegister from '../Register/Register.module.css';

// hooks
import { useEffect, useState, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserdata } from '../../../hooks/UserFetch/useUserdata'; // custom hook
import { useEditUser } from '../../../hooks/UserFetch/useEditUser'; // custom hook
import { useDeleteUser } from '../../../hooks/UserFetch/useDeleteUser'; // custom hook

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
    const [ imageField, setImageField ] = useState({image_data: null, content_type: ''});
    const [ redirect, setRedirect ] = useState(false);
    
    
    // set fields from request
    useEffect(() => {
        const fetchUserData = async () =>{
            const res = await useUserdata(userID);

            if(res.data.userData){
                setUserName(res.data.userData.name);
                
                setUserFields({ ...userFields, 
                    id: res.data.userData.id || '',
                    name: res.data.userData.name || '',
                    email: res.data.userData.email || '',
                    role: res.data.userData.role || '',
                    street: res.data.userData.street || '',
                    city: res.data.userData.city || '',
                    state: res.data.userData.state || '',
                    zip_code: res.data.userData.zip_code || ''
                });
            }
    
            if(!res.data.userImage) return;
    
            setImageField({ ...imageField,
                image_data: res.data.userImage.image_data,
                content_type: res.data.userImage.content_type,
            });
        };
        fetchUserData();
    }, []);


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


    // redirect user
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
        <div className={ styles.accountDetail_container }>
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
            <div className={ styles.form_container }>
            <form onSubmit={ handleForm } className={ styles.user_panel_container }>
                <h1 className='title is-1'>Detalhes de conta</h1>

                <h1 className='subtitle is-4' style={{ margin:'0px' }}>Edite sua foto de perfil</h1>
                <div className={ stylesRegister.div_imagem_perfil } ref={divImageRef}>
                    
                </div>
                {/* Formulário de upload de imagem */}
                <input type="file" name="image" accept="image/*" className={ stylesRegister.input_register } 
                style={{ marginBottom:'30px' }} onChange={ uploadImage }/>

                <hr className='hr'/>
                <h1 className="title is-3">Seus dados</h1>

                <div className={ styles.container_input }>
                    <label className="label title is-5" id="label">Nome: </label>
                    <input className="input is-hovered" name='name' type="text" value={ userFields.name }
                    onChange={ (e) => setUserFields({...userFields, name: e.target.value}) } required />
                </div>
                
                <div className={ styles.container_input }>
                    <label className="label title is-5" id="label">Email: </label>
                    <input className="input is-hovered" name='email' type="text" value={ userFields.email }
                    onChange={ (e) => setUserFields({...userFields, email: e.target.value}) } required />
                </div>

                <div className={ styles.container_input }>
                    <label className="label title is-5" id="label">Senha Atual: </label>
                    <input className="input is-hovered" name='actual_password' type="password" value={ userFields.actual_password }
                    placeholder='Senha atual (opcional)'
                    onChange={ (e) => setUserFields({...userFields, actual_password: e.target.value}) } />
                </div>

                <div className={ styles.container_input }>
                    <label className="label title is-5" id="label">Senha Nova: </label>
                    <input className="input is-hovered" name='new_password' type="password" value={ userFields.new_password }
                    placeholder='Senha nova (opcional)'
                    onChange={ (e) => setUserFields({...userFields, new_password: e.target.value}) } />
                </div>

                <div className={ styles.container_input }>
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

                <div className={ styles.container_input }>
                    <label className="label title is-5" id="label">Rua: </label>
                    <input className="input is-hovered" name='street' type="text" value={ userFields.street }
                    onChange={ (e) => setUserFields({...userFields, street: e.target.value}) } />
                </div>
                <div className={ styles.container_input }>
                    <label className="label title is-5" id="label">Cidade: </label>
                    <input className="input is-hovered" name='city' type="text" value={ userFields.city }
                    onChange={ (e) => setUserFields({...userFields, city: e.target.value}) } />
                </div>
                <div className={ styles.container_input }>
                    <label className="label title is-5" id="label">Estado: </label>
                    <input className="input is-hovered" name='state' type="text" value={ userFields.state }
                    onChange={ (e) => setUserFields({...userFields, state: e.target.value}) } />
                </div>
                <div className={ styles.container_input }>
                    <label className="label title is-5" id="label">CEP: </label>
                    <input className="input is-hovered" name='cep' type="text" value={ userFields.zip_code }
                    onChange={ (e) => setUserFields({...userFields, zip_code: e.target.value}) } />
                </div>

                <hr className='hr'/>
                <button className="button is-primary is-dark">
                    Editar
                </button>
            </form>

            <div className={ styles.delete_div } onClick={ modal_deleteProfile }>
                <button className="button is-danger is-dark">
                    Excluir
                </button>
            </div>
            </div>
        </div>
    );
};

export default AccountDetail;
