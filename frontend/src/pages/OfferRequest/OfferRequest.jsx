
// styles
import styles from './OfferRequest.module.css';
import stylesAccountDetail from '../AccountDetails/AccountDetail.module.css';
import stylesHelpRequest from '../HelpRequests/HelpRequest.module.css'; 

// hooks
import { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 


const OfferRequest = () => {
    // consts
    const { requestID } = useParams();
    const modal = useRef(null);
    const modal_title = useRef(null);
    const modal_msg = useRef(null);
    const modal_btt = useRef(null);
    const modal_btt_2 = useRef(null);
    const navigate = useNavigate();


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

            <h1 className='title is-1'>Ofereça ajuda</h1>
            <h2 className='title is-2'>id: { requestID }</h2>
        </div>
    );
};

export default OfferRequest;
