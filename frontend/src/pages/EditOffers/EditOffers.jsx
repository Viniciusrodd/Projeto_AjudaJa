
// css
import styles from './EditOffers.module.css';
import stylesAccountDetail from '../AccountDetails/AccountDetail.module.css';
import stylesHelpRequest from '../HelpRequests/HelpRequest.module.css'; 

// hooks
import { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// components
import SideBar from '../../components/SideBar/SideBar';


const EditOffers = () => {
    // consts
    const navigate = useNavigate();
    const modal = useRef(null);
    const modal_title = useRef(null);
    const modal_msg = useRef(null);
    const modal_btt = useRef(null);
    const modal_btt_2 = useRef(null);
    

    return (
        <div className={ stylesAccountDetail.accountDetail_container }>
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
            <div className={ stylesAccountDetail.form_container }>
                <form className={ stylesAccountDetail.user_panel_container }>
                    <h1 className='title is-1'>Edite sua oferta de ajuda</h1>
                    <hr className='hr'/>

                    <div className={`control ${stylesAccountDetail.textarea_container}`}>
                        <label className="label title is-5" id="label">Descrição de ajuda: </label>
                        <textarea className="textarea is-hovered" name='description' style={{ height:'20vh' }}>
                                                
                        </textarea>
                    </div>

                    <hr className='hr'/>
                    <button className="button is-primary is-dark">
                        Editar ajuda
                    </button>          
                </form>
            </div>
        </div>
    );
};

export default EditOffers;
