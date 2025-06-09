
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

    // consts
    const { userId } = useContext(UserContext); // context
    const navigate = useNavigate();
    const modal = useRef(null);
    const modal_title = useRef(null);
    const modal_msg = useRef(null);
    const modal_btt = useRef(null);
    const modal_btt_2 = useRef(null);


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


    // modal for delete requestHelp
    const modal_deleteRequest = (id) =>{
        modal.current.style.display = 'flex';
        modal_msg.current.innerText = 'Tem certeza que deseja excluir seu pedido de ajuda ?'
        modal_btt.current.innerText = 'Tenho certeza'
        
        modal_btt.current.onclick = () =>{
            deleteRequest_event(id);
        };        
        modal_btt_2.current.onclick = () =>{
            modal.current.style.display = 'none';
        };
    };


    // delete requestHelp
    const deleteRequest_event = async (id) =>{
        try{
            const res = await deleteRequest(id);

            if(res.status === 200){                
                modal.current.style.display = 'flex';
                modal_title.current.innerText = 'Sucesso'
                modal_msg.current.innerText = `Ainda poderá criar nova pedido mais tarde...`;
                modal_btt.current.style.display = 'none';
                modal_btt_2.current.style.display = 'none';                
                
                
                const clearMessage = setTimeout(() => {
                    modal.current.style.display = 'none';                    
                    setRequestDataByUserId(prev => prev.filter(data => data.id !== id));
                }, 3000);
                
                return () => {
                    clearTimeout(clearMessage);
                };
            }
        }
        catch(error){
            console.log('Error at delete request at frontend', error);
            modal.current.style.display = 'flex';
            modal_msg.current.innerText = `Erro ao excluir pedido de ajuda...`;
            modal_btt.current.innerText = 'Tente novamente';
            modal_btt_2.current.style.display = 'none';

            modal_btt.current.onclick = () => {
                modal.current.style.display = 'none';
            };           
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
                modal.current.style.display = 'flex';
                modal_title.current.innerText = 'Sucesso!!!';
                modal_msg.current.innerText = `Oferta de ajuda ${decision === 'aceito' ? 'aceitada' : 'rejeitada'}!`;
                modal_btt.current.style.display = 'none';
                modal_btt_2.current.style.display = 'none';

                const clearMessage = setTimeout(() => {
                    modal.current.style.display = 'none';                    
                    setOffers(prevOffers => prevOffers.map(offer => offer.id === id ? { ...offer, status: decision } : offer));
                }, 3000);
                
                return () => {
                    clearTimeout(clearMessage);
                };
            }
        }
        catch(error){
            console.log('Error at accept help');

            modal.current.style.display = 'flex';
            modal_msg.current.innerText = `Erro ao ${decision === 'aceito' ? 'aceitar' : 'rejeitar'} oferta de ajuda...`;
            modal_btt.current.innerText = 'Tente novamente';
            modal_btt_2.current.style.display = 'none';

            modal_btt.current.onclick = () => {
                modal.current.style.display = 'none';
            };           
        }
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
                                        style={{ marginTop: '15px', padding:'15px', width:'24%' }}>
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
