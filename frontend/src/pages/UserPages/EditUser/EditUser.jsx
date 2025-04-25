
// css
import styles from './EditUser.module.css';
import stylesRegister from '../Register/Register.module.css';

// hooks
import { useParams } from 'react-router-dom';

const EditUser = () => {
    const { id } = useParams();

    return (
        <div className={ styles.editUser_container }>
            <h1 className='title is-1'>Edição de perfil</h1>

            <div className={ styles.user_panel_container }>
                <h1 className='subtitle is-4' style={{ margin:'0px' }}>Escolha uma foto de perfil (opcional)</h1>
                <div className={ stylesRegister.div_imagem_perfil }>

                </div>
                {/* Formulário de upload de imagem */}
                <input type="file" name="image" accept="image/*" className={ stylesRegister.input_register } 
                style={{ marginBottom:'30px' }}/>

                <hr className='hr'/>

                <input class="input is-primary" type="text" placeholder="Nome"/>
                <input class="input is-primary" type="text" placeholder="Email"/>
                <input class="input is-primary" type="password" placeholder="Senha"/>
                <input class="input is-primary" type="text" placeholder="Perfil"/>
                <input class="input is-normal" type="text" placeholder="Rua"/>
                <input class="input is-normal" type="text" placeholder="Cidade"/>
                <input class="input is-normal" type="text" placeholder="CEP"/>
            </div>   
        </div>
    );
};

export default EditUser;
