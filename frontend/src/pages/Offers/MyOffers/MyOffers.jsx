
// css
import '../../../utils/FeedsCss/FeedsUtil.css'

// hooks
import { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useOfferData } from '../../../hooks/OffersFetch/useOfferData'; // custom hook

// components
import SideBar from '../../../components/SideBar/SideBar';
import Modal from '../../../components/Modal';

// context
import { UserContext } from '../../../context/UserContext';
import { LoadingContext } from '../../../context/loadingContext';

// services
import { deleteOffer } from '../../../services/OfferHelpServices';


const MyOffers = () => {
    // states
    const [ noPosts, setNoPosts ] = useState(false);
    const [ offerId, setOfferId ] = useState(0);

    // modal
    const [ modal_display, setModal_display ] = useState(false);
    const [ modal_title, setModal_title ] = useState(null);
    const [ modal_msg, setModal_msg ] = useState(null);
    const [ modal_btt, setmodal_btt ] = useState(false);
    const [ modal_btt_2, setModal_btt_2 ] = useState(false);
    const [ title_color, setTitle_color ] = useState('#000');
    const [ modal_errorType, setModal_errorType ] = useState(null);

    // consts
    const navigate = useNavigate();
    
    // context
    const { userId } = useContext(UserContext);
    const { loading } = useContext(LoadingContext);


    ////////////// functions


    // scroll top at beginning
    useEffect(() =>{
        window.scrollTo(0, 0);
    }, []);    

    // get offers by user id
    const { offerDataByUserId, setOfferDataByUserId } = useOfferData(userId);
    useEffect(() =>{
        if(offerDataByUserId && offerDataByUserId.length === 0){
            setNoPosts(true);
        }else{
            setNoPosts(false);
        }
    }, [offerDataByUserId, setOfferDataByUserId]);

    // modal config
    const modal_config = ({ title, msg, btt1, btt2, display, title_color }) => {
        setModal_title(title ?? null);
        setModal_msg(msg ?? null);
        setmodal_btt(btt1 ?? false);
        setModal_btt_2(btt2 ?? false);
        setModal_display(display ?? false);
        setTitle_color(title_color ?? '#000');

        // The "??" (nullish coalescing operator) 
        // returns the value on the right ONLY if the value on the left is null or undefined
    };    
    
    // close modal
    const closeModal = () =>{
        if(modal_btt_2 !== null){
            modal_config({
                title: null, msg: null, btt1: false, 
                btt2: false, display: false, title_color: '#000'
            });
        }
    };

    // modal btt events
    const modal_events = () =>{
        if(modal_errorType === 'offer delete'){
            deleteOffer_event();
        }
    };

    // modal for delete requestHelp
    const modal_deleteOffer = (id) =>{
        setOfferId(id);
        modal_config({
            title: 'Espere',
            msg: `Tem certeza que deseja excluir sua oferta de ajuda ?`,
            btt1: 'Tenho certeza', btt2: 'voltar',
            display: 'flex', title_color: 'rgb(0, 136, 255)'
        });
        setModal_errorType('offer delete');
    };

    // delete requestHelp
    const deleteOffer_event = async () =>{
        try{
            const res = await deleteOffer(offerId);

            if(res.status === 200){
                modal_config({
                    title: 'Sucesso',
                    msg: `Oferta de ajuda excluida com sucesso`,
                    btt1: false, btt2: false,
                    display: 'flex', title_color: 'rgb(38, 255, 0)'
                });
                
                setTimeout(() => {
                    modal_config({
                        title1: null, msg: null, btt1: false, 
                        btt2: false, display: false, title_color: '#000'
                    });
                    setOfferDataByUserId(prev => prev.filter(data => data.id !== offerId));
                }, 3000);
            }
        }
        catch(error){
            console.log('Error at delete offer at frontend', error);

            modal_config({
                title: 'Erro',
                msg: 'Erro ao excluir oferta de ajuda...',
                btt1: false, btt2: 'Tente novamente',
                display: 'flex', title_color: 'rgb(255, 0, 0)'
            });
        };
    };


    ////////////// jsx


    return (
        <div className='container_home'>
            { /* Modal */ }
            <Modal 
                title={ modal_title }
                msg={ modal_msg }
                btt1={ modal_btt }
                btt2={ modal_btt_2 }
                display={ modal_display }
                title_color={ title_color } 
                onClose={ closeModal }
                modalEvent={ modal_events }
            />


            { /* SIDEBAR */ }
            <SideBar />


            { /* OFFERS CONTAINER */ }
            <div className='container_feed_2'>
                <h1 className='title is-1'>Minhas ofertas de ajuda</h1>

                {
                    loading && (
                        <div className='loading-container'>
                            <p>Carregando...</p>
                        </div>
                    )
                }

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
                                <div className='user_requests_details' style={{ marginBottom: '30px' }}>
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
