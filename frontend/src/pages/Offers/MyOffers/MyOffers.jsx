
// css
import '../../../utils/FeedsCss/FeedsUtil.css'

// hooks
import { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useOfferData } from '../../../hooks/OffersFetch/useOfferData'; // custom hook

// components
import SideBar from '../../../components/SideBar/SideBar';

// context
import { UserContext } from '../../../context/UserContext';

// services
import { deleteOffer } from '../../../services/OfferHelpServices';


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
    const { offerDataByUserId, setOfferDataByUserId } = useOfferData(userId);
    useEffect(() =>{
        if(offerDataByUserId && offerDataByUserId.length === 0){
            setNoPosts(true);
        }else{
            setNoPosts(false);
        }
    }, [offerDataByUserId, setOfferDataByUserId]);


    // modal for delete requestHelp
    const modal_deleteOffer = (id) =>{
        modal.current.style.display = 'flex';
        modal_msg.current.innerText = 'Tem certeza que deseja excluir sua oferta de ajuda ?'
        modal_btt.current.innerText = 'Tenho certeza'
        
        modal_btt.current.onclick = () =>{
            deleteOffer_event(id)
        };        
        modal_btt_2.current.onclick = () =>{
            modal.current.style.display = 'none';
        };
    };


    // delete requestHelp
    const deleteOffer_event = async (offerID) =>{
        try{
            const res = await deleteOffer(offerID);

            if(res.status === 200){                
                modal.current.style.display = 'flex';
                modal_title.current.innerText = 'Sucesso'
                modal_msg.current.innerText = `Oferta de ajuda excluida com sucesso`;
                modal_btt.current.style.display = 'none';
                modal_btt_2.current.style.display = 'none';                
                
                
                const clearMessage = setTimeout(() => {
                    modal.current.style.display = 'none';                    
                    setOfferDataByUserId(prev => prev.filter(data => data.id !== offerID));
                }, 3000);
                
                return () => {
                    clearTimeout(clearMessage);
                };
            }
        }
        catch(error){
            console.log('Error at delete offer at frontend', error);
            modal.current.style.display = 'flex';
            modal_msg.current.innerText = `Erro ao excluir oferta de ajuda...`;
            modal_btt.current.innerText = 'Tente novamente';
            modal_btt_2.current.style.display = 'none';

            modal_btt.current.onclick = () => {
                modal.current.style.display = 'none';
            };           
        };
    };


    return (
        <div className='container_home'>
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
            <div className='container_feed'>
                <h1 className='title is-1'>Minhas ofertas de ajuda</h1>

                {
                    noPosts && (
                        <div className='noRequests'>
                            <h1 className='title is-2' style={{ marginBottom: '0px' }}>
                                Sem ofertas de ajuda...
                            </h1>
                        </div>
                    )
                }

                {
                    offerDataByUserId && offerDataByUserId.map((offer) => (
                        <div key={ offer.id } className='relatedOffers_image' style={{ margin:'8px 0px 8% 0px' }}>
                            <div className='relatedOffers' style={{ padding:'30px 10px 50px 10px' }}>
                                <div className='user_requests_details'>
                                    <div className='details'>
                                        <p className='titles_requests'>Ofereceu para: </p>
                                        <h1 className='subtitle is-4'>{ offer.user_data.name }</h1>
                                    </div>

                                    <div className='details'>
                                        <p className='titles_requests'>Status: </p>
                                        <h2 className={ offer.status === 'aceito' ? 'status_aberto' : offer.status === 'pendente' ? 'status_pendente' : 'status_fechado' }>
                                            { offer.status }
                                        </h2>
                                    </div>
                                </div>

                                <div className='user_requests_description'>
                                    <p className='titles_requests'>Descrição: </p>
                                    <h1 className='subtitle is-5'>{ offer.description }</h1>
                                </div>

                                <div className='div_bottoms'>
                                    <Link to={`/editarOfertaDeAjuda/${offer.id}`}>
                                        <button className="button is-info is-dark">
                                            Editar
                                        </button>
                                    </Link>
                                    <button className="button is-danger is-dark" onClick={ () => modal_deleteOffer(offer.id) }>
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
