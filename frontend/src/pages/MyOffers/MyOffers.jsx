
// css
import styles from './MyOffers.module.css';
import styles_homepage from '../HomePage/Home.module.css';

// hooks
import { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOfferData } from '../../hooks/OffersFetch/useOfferData'; // custom hook

// components
import SideBar from '../../components/SideBar/SideBar';

// context
import { UserContext } from '../../context/UserContext';


const MyOffers = () => {
    // states
    const [ noPosts, setNoPosts ] = useState(false);

    // consts
    const { userId } = useContext(UserContext); // context
    const navigate = useNavigate();
    const modal = useRef(null);
    const modal_title = useRef(null);
    const modal_msg = useRef(null);
    const modal_btt = useRef(null);
    const modal_btt_2 = useRef(null);


    // get offers by user id
    const { offerDataByUserId } = useOfferData(userId);
    useEffect(() =>{
        if(offerDataByUserId === null){
            // It's still loading, it's not doing anything
            return;
        }

        if(offerDataByUserId && offerDataByUserId.length === 0){
            setNoPosts(true);
        }else{
            setNoPosts(false);
        }
        console.log(offerDataByUserId);
    }, [offerDataByUserId]);


    return (
        <div className={ styles_homepage.container_home }>
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


            { /* OFFERS CONTAINER */ }
            <div className={ styles_homepage.container_feed }>
                <h1 className='title is-1'>Minhas ofertas de ajuda</h1>

                {
                    noPosts && (
                        <div className={ styles_homepage.noRequests }>
                            <h1 className='title is-2' style={{ marginBottom: '0px' }}>
                                Sem pedidos de ajuda...
                            </h1>
                        </div>
                    )
                }

                {
                    offerDataByUserId && offerDataByUserId.map((offer) => (
                        <div key={ offer.id } className={ styles_homepage.relatedOffers_image }>
                            <div className={ styles_homepage.relatedOffers } style={{ padding:'30px 10px 50px 10px' }}>
                                <div className={ styles_homepage.user_requests_details }>
                                    <div className={ styles_homepage.details }>
                                        <p className={ styles_homepage.titles_requests }>Ofereceu para: </p>
                                        <h1 className='subtitle is-4'>{ offer.user_data.name }</h1>
                                    </div>

                                    <div className={ styles_homepage.details }>
                                        <p className={ styles_homepage.titles_requests }>Status: </p>
                                        <h2 className={ offer.status === 'aceito' ? styles_homepage.status_aberto : offer.status === 'pendente' ? styles_homepage.status_pendente : styles_homepage.status_fechado }>
                                            { offer.status }
                                        </h2>
                                    </div>
                                </div>

                                <div className={ styles_homepage.user_requests_description }>
                                    <p className={ styles_homepage.titles_requests }>Descrição: </p>
                                    <h1 className='subtitle is-5'>{ offer.description }</h1>
                                </div>

                                <div className={ styles_homepage.div_bottoms }>
                                    <button className="button is-info is-dark">
                                        Editar
                                    </button>
                                    <button className="button is-danger is-dark">
                                        Excluir
                                    </button>
                                </div>                            
                            </div>
                        </div>                                
                    ))
                }            
            </div>
        </div>
    );
};

export default MyOffers;
