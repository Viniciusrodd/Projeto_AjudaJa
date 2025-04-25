
// css
import styles from './AccountDetail.module.css';
import stylesRegister from '../Register/Register.module.css';

// hooks
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useUserdata } from '../../../hooks/UserFetch/useUserdata'; // custom hook

const AccountDetail = () => {
    // consts
    const { userID } = useParams();
    const { userData, userImage } = useUserdata(userID);
    const [ userFields, setUserFields ] = useState({
        id: '', name:'', email:'', role:'', street:'', city:'', zip_code:''
    });
    const [ imageField, setImageField ] = useState({image_data: null, content_type: ''});
    const divImageRef = useRef(null);

    
    // set fields from request
    useEffect(() => {
        if(!userData) return;

        setUserFields({ ...userFields, 
            id: userData.id || '',
            name: userData.name || '',
            email: userData.email || '',
            role: userData.role || '',
            street: userData.street || '',
            city: userData.city || '',
            zip_code: userData.zip_code || ''
        });

        setImageField({ ...imageField,
            image_data: userImage.image_data,
            content_type: userImage.content_type,
        });
    }, [userData]);


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

    return (
        <div className={ styles.accountDetail_container }>
            <h1 className='title is-1'>Detalhes de conta</h1>

            <div className={ styles.user_panel_container }>
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
                    <input className="input is-hovered" name='name' type="text" placeholder={ userFields.name }/>
                </div>
                <div className={ styles.container_input }>
                    <label className="label title is-5" id="label">Email: </label>
                    <input className="input is-hovered" name='email' type="text" placeholder={ userFields.email }/>
                </div>
                <div className={ styles.container_input }>
                    <label className="label title is-5" id="label">Senha Atual: </label>
                    <input className="input is-hovered" name='actual_password' type="text" placeholder="Senha atual aqui..."/>
                </div>
                <div className={ styles.container_input }>
                    <label className="label title is-5" id="label">Senha Nova: </label>
                    <input className="input is-hovered" name='new_password' type="text" placeholder="Nova senha aqui..."/>
                </div>
                <div className={ styles.container_input }>
                    <label className="label title is-5" id="label">Papel: </label>
                    <input className="input is-hovered" name='role' type="text" placeholder={ userFields.role }/>
                </div>

                <hr className='hr'/>
                <h1 className="title is-3">Endereço</h1>

                <div className={ styles.container_input }>
                    <label className="label title is-5" id="label">Rua: </label>
                    <input className="input is-hovered" name='street' type="text" placeholder={ userFields.street }/>
                </div>
                <div className={ styles.container_input }>
                    <label className="label title is-5" id="label">Cidade: </label>
                    <input className="input is-hovered" name='city' type="text" placeholder={ userFields.city }/>
                </div>
                <div className={ styles.container_input }>
                    <label className="label title is-5" id="label">CEP: </label>
                    <input className="input is-hovered" name='cep' type="text" placeholder={ userFields.zip_code }/>
                </div>

                <hr className='hr'/>
                <button className="btt button is-primary is-dark">
                    Editar
                </button>
            </div>   
        </div>
    );
};

export default AccountDetail;
