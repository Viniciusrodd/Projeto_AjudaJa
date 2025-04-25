
// css
import styles from './AccountDetail.module.css';
import stylesRegister from '../Register/Register.module.css';

// hooks
import { useParams } from 'react-router-dom';

const AccountDetail = () => {
    const { id } = useParams();

    return (
        <div className={ styles.accountDetail_container }>
            <h1 className='title is-1'>Detalhes de conta</h1>

            <div className={ styles.user_panel_container }>
                <h1 className='subtitle is-4' style={{ margin:'0px' }}>Edite sua foto de perfil</h1>
                <div className={ stylesRegister.div_imagem_perfil }>

                </div>
                {/* Formulário de upload de imagem */}
                <input type="file" name="image" accept="image/*" className={ stylesRegister.input_register } 
                style={{ marginBottom:'30px' }}/>

                <hr className='hr'/>
                <h1 class="title is-3">Seus dados</h1>

                <div className={ styles.container_input }>
                    <label for="name" class="label title is-5" id="label">Nome: </label>
                    <input className="input is-hovered" name='name' type="text" placeholder="**Nome**"/>
                </div>
                <div className={ styles.container_input }>
                    <label for="email" class="label title is-5" id="label">Email: </label>
                    <input className="input is-hovered" name='email' type="text" placeholder="**Email**"/>
                </div>
                <div className={ styles.container_input }>
                    <label for="password" class="label title is-5" id="label">Senha: </label>
                    <input className="input is-hovered" name='password' type="text" placeholder="**password**"/>
                </div>
                <div className={ styles.container_input }>
                    <label for="role" class="label title is-5" id="label">Papel: </label>
                    <input className="input is-hovered" name='role' type="text" placeholder="**role**"/>
                </div>

                <hr className='hr'/>
                <h1 class="title is-3">Endereço</h1>

                <div className={ styles.container_input }>
                    <label for="street" class="label title is-5" id="label">Rua: </label>
                    <input className="input is-hovered" name='street' type="text" placeholder="**street**"/>
                </div>
                <div className={ styles.container_input }>
                    <label for="city" class="label title is-5" id="label">Cidade: </label>
                    <input className="input is-hovered" name='city' type="text" placeholder="**city**"/>
                </div>
                <div className={ styles.container_input }>
                    <label for="cep" class="label title is-5" id="label">CEP: </label>
                    <input className="input is-hovered" name='cep' type="text" placeholder="**cep**"/>
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
