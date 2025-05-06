
// css
import styles from './HelpRequest.module.css';

// account details css
import stylesAccountDetails from '../AccountDetails/AccountDetail.module.css';

// sidebar
import SideBar from '../../components/SideBar/SideBar';


const HelpRequest = () => {
    return (
        <div className={ stylesAccountDetails.accountDetail_container }>

            { /* sidebar */ }
            <SideBar />

            { /* formulário */ }
            <div className={ stylesAccountDetails.form_container }>
                <form className={ stylesAccountDetails.user_panel_container }>
                    <h1 className='title is-1'>Pedido de ajuda</h1>


                    <hr className='hr'/>
                    <h1 className="subtitle is-4">Por favor, preencha: </h1>

                    <div className={ stylesAccountDetails.container_input }>
                        <label className="label title is-5" id="label">Titulo: </label>
                        <input className="input is-hovered" name='title' type="text" required 
                        placeholder='Ex: "Preciso de ajuda com material escolar"' style={{ width:'80%' }}/>
                    </div>

                    <div className={`control ${stylesAccountDetails.textarea_container}`}>
                        <label className="label title is-5" id="label">Descrição: </label>
                        <textarea className="textarea is-hovered" 
                        placeholder='Descreva sua situação com mais detalhes. Ex: Estou desempregado, com duas crianças pequenas, e preciso de alimentos básicos como arroz, feijão e leite. Qualquer ajuda será bem-vinda.'>
                        
                        </textarea>
                    </div>

                    <div className={ stylesAccountDetails.container_input }>
                        <label className="label title is-5" id="label">Categoria: </label>
                        <div className="select is-hovered" style={{ width:'70%' }}>
                            <select style={{ width:'100%' }} name='category'> {/* default: livre */}
                                <option value="alimentos">Alimentos</option>
                                <option value="roupas_calçados">Roupas e Calçados</option>
                                <option value="transporte">Transporte</option>
                                <option value="serviços_gerais">Serviços Gerais</option>
                                <option value="apoio_emocional">Apoio Emocional</option>
                                <option value="moradia_abrigo">Moradia / Abrigo</option>
                                <option value="educação">Educação</option>
                                <option value="trabalho_renda">Trabalho e Renda</option>
                                <option value="saúde_remédios">Saúde e Remédios</option>
                                <option value="animais">Animais</option>
                                <option value="tecnologia">Tecnologia</option>
                                <option value="livre">Livre</option>
                            </select>
                        </div>                    
                    </div>

                    <div className={ stylesAccountDetails.container_input }>
                        <label className="label title is-5" id="label">Urgencia: </label>
                        <div className="select is-hovered" style={{ width:'70%' }}>
                            <select style={{ width:'100%' }} name='urgency'>
                                <option value="baixa">Baixa</option>
                                <option value="media">Média</option>
                                <option value="alta">Alta</option>
                            </select>
                        </div>
                    </div>                    

                    <div className={ stylesAccountDetails.container_input }>
                        <label className="label title is-5" id="label">Status: </label>
                        <div className="select is-hovered" style={{ width:'70%' }}>
                            <select style={{ width:'100%' }} name='status'> {/* default: aberto */}
                                <option value="aberto">Aberto</option>
                                <option value="fechado">Fechado</option>
                            </select>
                        </div>
                    </div>

                    <hr className='hr'/>

                    <button className="button is-primary is-dark">
                        Publicar
                    </button>
                </form>
            </div>

            <div className={ styles.expiresAt_container }>
                <h1 className={ styles.h1_expires }>Pedido expira em: </h1>
                <h2 className={ styles.h2_expires }>Urgência Alta: 2 dias</h2>
                <h2 className={ styles.h2_expires }>Urgência Média: 5 dias</h2>
                <h2 className={ styles.h2_expires }>Urgência Baixa: 10 dias</h2>
            </div>

        </div>
    );
};

export default HelpRequest
