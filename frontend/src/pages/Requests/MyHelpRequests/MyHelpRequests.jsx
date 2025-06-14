
// css
import '../../../utils/FeedsCss/FeedsUtil.css'

// hooks
import { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRequestData } from '../../../hooks/RequestsFetch/useRequestData'; // custom hook
import { useOfferData } from '../../../hooks/OffersFetch/useOfferData'; // custom hook

// components
import SideBar from '../../../components/SideBar/SideBar';

// context
import { UserContext } from '../../../context/UserContext';

// services
import { deleteRequest } from '../../../services/RequestHelpServices';
import { statusChangeService } from '../../../services/OfferHelpServices';


const MyHelpRequests = () => {
    // states
    const [ noPosts, setNoPosts ] = useState(false);
    const [ offers, setOffers ] = useState([]);
    const [showOffersMap, setShowOffersMap] = useState({});
    const [ helpRequestId, setHelpRequestId ] = useState(0);

    // modal
    const [ modal_display, setModal_display ] = useState(false);
    const [ modal_title, setModal_title ] = useState(null);
    const [ modal_msg, setModal_msg ] = useState(null);
    const [ modal_btt, setmodal_btt ] = useState(false);
    const [ modal_btt_2, setModal_btt_2 ] = useState(false);
    const [ title_color, setTitle_color ] = useState('#000');
    const [ modal_errorType, setModal_errorType ] = useState(null);

    // consts
    const { userId } = useContext(UserContext); // context
    const navigate = useNavigate();


    ////////////// functions

    // scroll top at beginning
    useEffect(() =>{
        window.scrollTo(0, 0);
    }, []);    

    // get request data
    const { requestDataByUserId, setRequestDataByUserId } = useRequestData(null, userId);
    useEffect(() =>{
        if (requestDataByUserId && requestDataByUserId.length === 0) {
            setNoPosts(true);
        }else{
            setNoPosts(false);
        }
        requestDataByUserId
    }, [requestDataByUserId, setRequestDataByUserId]);

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
    const modal_events = (event) =>{
        if(event === 'request delete'){
            deleteRequest_event();
        }
    };

    // modal for delete requestHelp
    const modal_deleteRequest = (id) =>{
        modal_config({
            title: 'Espere',
            msg: `Tem certeza que deseja excluir seu pedido de ajuda ?`,
            btt1: 'Tenho certeza', btt2: 'Voltar',
            display: 'flex', title_color: 'rgb(0, 136, 255)'
        });
        setModal_errorType('request delete');        
        setHelpRequestId(id);
    };

    // delete requestHelp
    const deleteRequest_event = async () =>{
        try{
            const res = await deleteRequest(helpRequestId);

            if(res.status === 200){                
                modal_config({
                    title: 'Sucesso',
                    msg: `Ainda poderá criar novo pedido mais tarde...`,
                    btt1: false, btt2: false,
                    display: 'flex', title_color: 'rgb(38, 255, 0)'
                });

                setTimeout(() => {
                    modal_config({
                        title1: null, msg: null, btt1: false, 
                        btt2: false, display: false, title_color: '#000'
                    });
                    setRequestDataByUserId(prev => prev.filter(data => data.id !== helpRequestId));
                }, 3000);
            }
        }
        catch(error){
            console.log('Error at delete request at frontend', error);
            modal_config({
                title: 'Erro',
                msg: `Erro ao excluir pedido de ajuda...`,
                btt1: false, btt2: 'Tentar novamente',
                display: 'flex', title_color: 'rgb(255, 0, 0)'
            });            
        };
    };

    // get offers data
    const { offerData } = useOfferData();
    useEffect(() =>{
        if(offerData && offerData.length > 0){
            setOffers(offerData)
        }
    }, [offerData]);

    // show offers
    const toggleOffers = (requestId) => {
        setShowOffersMap(prev => ({
            ...prev,
            [requestId]: !prev[requestId]
        }));
    };
    
    // status decision
    const statusChange = async (id, decision) =>{
        try{
            const response = await statusChangeService({ decision }, id);

            if(response.status === 200){
                modal_config({
                    title: 'Sucesso',
                    msg: `Oferta de ajuda ${decision === 'aceito' ? 'aceitada' : 'rejeitada'}!`,
                    btt1: false, btt2: false,
                    display: 'flex', title_color: 'rgb(38, 255, 0)'
                });    
    
                setTimeout(() => {
                    modal_config({
                        title1: null, msg: null, btt1: false, 
                        btt2: false, display: false, title_color: '#000'
                    });
                    setOffers(prevOffers => prevOffers.map(offer => offer.id === id ? { ...offer, status: decision } : offer));
                }, 3000);
            }
        }
        catch(error){
            console.log('Error at accept help');

            modal_config({
                title: 'Erro',
                msg: `Erro ao ${decision === 'aceito' ? 'aceitar' : 'rejeitar'} oferta de ajuda...`,
                btt1: false, btt2: 'Tentar novamente',
                display: 'flex', title_color: 'rgb(255, 0, 0)'
            });
        }
    };


    ////////////// jsx    


    return (
        <div className='container_home'>
            { /* Modal */ }
            <div className='modal' style={{ display: modal_display ? 'flex' : 'none' }}>
            <div className='modal-background'></div>
                <div className='modal-card'>
                    <header className='modal-card-head'>
                        <p className='modal_title modal-card-title has-text-centered' 
                        style={{ textAlign:'center', color: title_color }}>
                            { modal_title }
                        </p>
                    </header>
                    <section className='modal-card-body'>
                        <p className='modal-card-title has-text-centered' style={{ textAlign:'center' }}>
                            {modal_msg?.split('\n').map((line, idx) => (
                                <span className='modal_span' key={idx}>
                                    {line}
                                    <br />
                                </span>
                            ))}
                        </p>
                    </section>
                    <footer className='modal-card-foot is-justify-content-center'>
                        <div className='div-buttons'>
                            {modal_btt && (
                                <button onClick={ () => modal_events(modal_errorType) } className="button is-danger is-dark">
                                    { modal_btt }
                                </button>
                            )}
                            {modal_btt_2 && (
                                <button onClick={ closeModal } className="button is-primary is-dark" 
                                style={{ marginLeft:'10px' }}>
                                    { modal_btt_2 }
                                </button>
                            )}
                        </div>
                    </footer>
                </div>
            </div>            

            { /* SIDEBAR */ }
            <SideBar />


            { /* FEED CONTAINER */ }
            <div className='container_feed_2'>
                { /* FEED PUBLICATIONS */ }
                <h1 className='title is-1'>Meus pedidos de ajuda</h1>

                {
                    noPosts && (
                        <div className='noRequests'>
                            <h1 className='title is-2'>Sem pedidos de ajuda...</h1>
                        </div>
                    )
                }
                {
                    requestDataByUserId && requestDataByUserId.map((request) => {
                        const relatedOffers = offers.filter(offer => offer.request_id === request.id);
                        const isVisible = showOffersMap[request.id] || false;

                        return (
                            <div className='requests' key={request.id}>
                                { /* REQUESTS */ }
                                <div className='user_container_feed'>
                                    <div className='user_image'
                                    style={{ 
                                        backgroundImage: `url(data:${request.profile_image.content_type};base64,${request.profile_image.image_data})`                                        
                                    }}>

                                    </div>
                                    
                                    <h1 className='title is-3'>{ request.user_data.name }</h1>
                                </div>
                                
                                <div className='requests_container_image'>
                                    <div className='user_requests_container'>
                                        <div className='user_requests_title'>
                                            <h1 className='title is-2' style={{ 
                                                color:'white', textShadow: '0px 0px 10px rgb(0, 0, 0)' 
                                            }}>
                                                { request.title }
                                            </h1>
                                        </div>

                                        <div className='user_requests_description'>
                                            <h1 className='subtitle is-5'>{ request.description }</h1>
                                        </div>

                                        <div className='user_requests_details'>
                                            <div className='details'>
                                                <p className='titles_requests'>Categoria</p>
                                                <h1 className='subtitle is-4'>{ request.category }</h1>
                                            </div>  
                                            <div className='details'>
                                                <p className='titles_requests'>Urgência</p>
                                                { request.urgency === 'media' ? 
                                                    ( <h1 className='subtitle is-4'>média</h1> ) :
                                                    ( <h1 className='subtitle is-4'>{ request.urgency }</h1> ) 
                                                }
                                            </div>  
                                            <div className='details'>
                                                <p className='titles_requests'>Status</p>
                                                <h2 className={ request.status === 'aberto' ? 'status_aberto' :  'status_fechado' }>
                                                    { request.status }
                                                </h2>
                                            </div>  
                                        </div>
                                    </div>
                                </div>

                                <div className='div_bottoms'>
                                    <Link to={`/editarPedido/${request.id}`}>
                                        <button className="button is-info is-dark">
                                            Editar
                                        </button>
                                    </Link>
                                    <button className="button is-danger is-dark" onClick={ () => modal_deleteRequest(request.id) }>
                                        Excluir
                                    </button>
                                </div>

                                {
                                    relatedOffers.length > 0 && (
                                        <button onClick={ () => toggleOffers(request.id) } className='button is-primary is-outlined' 
                                        style={{ marginTop: '15px', padding:'15px', width:'25%' }}>
                                            { !isVisible ? ('Abrir ajudas oferecidas') : ('fechar ajudas oferecidas') }
                                        </button>
                                    )
                                }

                                {
                                    isVisible && relatedOffers.length > 0 && (
                                        <div className='relatedOffers_container'>
                                            <div className='user_requests_title'>
                                                <h1 className='title is-2' style={{ color:'#00EBC7' }}>
                                                    Ajudas oferecidas:
                                                </h1>
                                            </div>

                                            {relatedOffers.map((offer) =>(
                                                <div key={offer.id} className='relatedOffers_image'>
                                                    <div className='relatedOffers'>
                                                        <div className='user_requests_details'>
                                                            <div className='details'>
                                                                <p className='titles_requests'>Nome: </p>
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

                                                        { 
                                                            offer.status === 'aceito' ? (
                                                                <div className='div_bottoms'>
                                                                    <button onClick={ () => statusChange(offer.id,'rejeitado') } 
                                                                    className='button is-danger is-dark' 
                                                                    style={{ width:'120px' }}>
                                                                        Rejeitar ajuda
                                                                    </button>
                                                                </div>
                                                            ) : offer.status === 'pendente' ? (
                                                                <div className='div_bottoms'>
                                                                    <button onClick={ () => statusChange(offer.id, 'aceito') } 
                                                                    className='button is-primary is-dark' 
                                                                    style={{ width:'120px' }}>
                                                                        Aceitar ajuda
                                                                    </button>
                                                                    
                                                                    <button onClick={ () => statusChange(offer.id,'rejeitado') } 
                                                                    className='button is-danger is-dark' 
                                                                    style={{ width:'120px', marginLeft:'10px' }}>
                                                                        Rejeitar ajuda
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className='div_bottoms'>
                                                                    <button onClick={ () => statusChange(offer.id, 'aceito') } 
                                                                    className='button is-primary is-dark' 
                                                                    style={{ width:'120px' }}>
                                                                        Aceitar ajuda
                                                                    </button>
                                                                </div>
                                                            ) 
                                                        }
                                                    </div>
                                                </div>
                                            ))}
                                        </div>                                        
                                    )
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
};

export default MyHelpRequests;
