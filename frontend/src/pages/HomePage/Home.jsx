
// css
import '../../utils/FeedsCss/FeedsUtil.css';

// libs
import axios from 'axios';

// hooks
import { useEffect, useState, useRef, useContext } from 'react';
import { useTokenVerify } from '../../hooks/UserMiddleware/useTokenVerify'; // custom hook
import { useNavigate, Link } from 'react-router-dom';
import { useRequestData } from '../../hooks/RequestsFetch/useRequestData'; // custom hook
import { useOfferData } from '../../hooks/OffersFetch/useOfferData'; // custom hook

// components
import SideBar from '../../components/SideBar/SideBar';

// context
import { UserContext } from '../../context/UserContext';

// services
import { statusChangeService } from '../../services/OfferHelpServices';


const Home = () => {
    // states
    const [ redirectLogin, setRedirectLogin ] = useState(false);
    const [ noPosts, setNoPosts ] = useState(false);
    const [ userID, setUserID ] = useState(0);
    const [ noPostsFound, setNoPostsFound ] = useState(false);
    const [ offers, setOffers ] = useState([]);
    const [showOffersMap, setShowOffersMap] = useState({});
    const [ search, setSearch ] = useState('');    
    const [ searchedData, setSearchedData ] = useState(null);
    const [ isSearching, setIsSearching ] = useState(false);
    const [ myRequests, setMyRequests ] = useState(null);

    // consts
    const navigate = useNavigate();
    const modal = useRef(null);
    const modal_title = useRef(null);
    const modal_msg = useRef(null);
    const modal_btt = useRef(null);
    const modal_btt_2 = useRef(null);
    const { setUserName, setIsLogged, setUserId } = useContext(UserContext); // context
    const divImageRef = useRef(null);
    const select_options = useRef(null);


    // redirect
    useEffect(() =>{
        if(redirectLogin){
            const clearMessage = setTimeout(() => {
                navigate('/login');
            }, 3000);
        
            return () => {
                clearTimeout(clearMessage);
            };
        }
    }, [redirectLogin]);


    // login verify
    const { userData, errorRes } = useTokenVerify();
    useEffect(() => {
        if(userData){
            setIsLogged(true);
            setUserId(userData.id)
            setUserName(userData.name);

            // id for show div_bottoms
            setUserID(userData.id)
        }
        
        if(errorRes){
            console.log('Error at fetchToken in Homepage: ', errorRes);            
            modal.current.style.display = 'flex';
            modal_title.current.innerText = 'Espere';
            modal_title.current.style.color = 'rgb(255, 0, 0)';
            modal_msg.current.innerText = 'É necessário login para continuar, você será redirecionado...';
            modal_btt.current.style.display = 'none';
            modal_btt_2.current.style.display = 'none';
    
            setRedirectLogin(true);
        }
    }, [userData, errorRes]);


    // get Help requestsHelp data
    const { requestData, setRequestData } = useRequestData(); // array with objects...
    useEffect(() =>{
        if (requestData && requestData.length === 0) {
            setNoPosts(true);
        }
    }, [requestData]);


    // search
    const search_form = async (e) => {
        e.preventDefault();

        if (search.trim() === '') {
            setSearchedData(null);
            return;
        }

        try{
            const response = await axios.get(`http://localhost:2130/request/search/${search}`, { withCredentials: true });

            if(response.data.combined_requests?.length > 0){
                setSearchedData(response.data.combined_requests);
                setNoPostsFound(false);
            }else{
                setSearchedData([]); // limpa resultados anteriores
                setNoPostsFound('Pedido de ajuda não encontrado');
                setTimeout(() =>{
                    setNoPostsFound('');
                    setSearchedData(null);
                    setSearch('');
                    setIsSearching(false);
                }, 3000);
            }
        }catch(error){
            console.error("Error at searching requests:", error);
        }
    };


    // is searching ?
    useEffect(() =>{
        if(search != ''){
            setIsSearching(true);
        }
    }, [search]);


    // clean search
    const cleanSearch = () =>{
        setSearch('');
        setSearchedData(null);
        setIsSearching(false);
        return;
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
                modal_title.current.style.color = 'rgb(38, 255, 0)';
                modal_msg.current.innerText = `Oferta de ajuda ${decision === 'aceito' ? 'aceitada' : 'rejeitada'}!`;
                modal_btt.current.style.display = 'none';
                modal_btt_2.current.style.display = 'none';

                setTimeout(() => {
                    modal.current.style.display = 'none';                    
                    setOffers(prevOffers => prevOffers.map(offer => offer.id === id ? { ...offer, status: decision } : offer));
                }, 3000);                
            }
        }
        catch(error){
            console.log('Error at accept help');

            modal.current.style.display = 'flex';
            modal_title.current.innerText = 'Erro';
            modal_title.current.style.color = 'rgb(255, 0, 0)';
            modal_msg.current.innerText = `Erro ao ${decision === 'aceito' ? 'aceitar' : 'rejeitar'} oferta de ajuda...`;
            modal_btt.current.innerText = 'Tente novamente';
            modal_btt_2.current.style.display = 'none';

            modal_btt.current.onclick = () => {
                modal.current.style.display = 'none';
            };           
        }
    };


    // filtering service function
    const filtering = (data) =>{
        const filtered = requestData.filter(request => request.urgency === data);

        if(filtered.length === 0){
            setNoPostsFound(`Pedidos de ajuda de ${data} urgência não encontrados`);
            setTimeout(() => {
                setNoPostsFound('');
                setMyRequests(null);
                select_options.current.value = 'Todos pedidos'
            }, 3000);
        }

        setMyRequests(filtered);
    };

    // filtering help requests
    const filteredRequests = searchedData !== null ? searchedData : myRequests || requestData;
    const handleFilterChange = (selectedValue) =>{
        if(selectedValue === 'Todos pedidos'){
            setMyRequests(null);
        }else if(selectedValue === 'De alta urgência'){
            filtering('alta');
        }else if(selectedValue === 'De média urgência'){
            filtering('media');
        }else if(selectedValue === 'De baixa urgência'){
            filtering('baixa');
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
            <div className='container_feed'>
                
                { /* FEED OPTIONS */ }
                <div className='feed_options'>
                    <div className="select is-primary">
                        <select style={{ width:'100%' }} className='is-hovered' 
                        onChange={(e) => handleFilterChange(e.target.value)} ref={ select_options }>
                            <option>Todos pedidos</option>
                            <option>De alta urgência</option>
                            <option>De média urgência</option>
                            <option>De baixa urgência</option>
                        </select>
                    </div>
                    <form onSubmit={ search_form } className='search_container_home'>
                        <div className='searchInput_container'>
                            <input className='input is-primary' type="text" name="search" placeholder='Pesquise por ajuda' value={ search }
                            autoComplete='off' onChange={ (e) => setSearch(e.target.value) }/>
                            
                            <button className="button is-primary is-outlined" style={{ height:'40px' ,width:'40px' }}>
                                <i className="material-icons" id='person'>search</i>
                            </button>
                        </div>
                    </form>
                </div>

                <button onClick={ () => cleanSearch() } className="button is-primary is-outlined" 
                style={{ 
                    margin: isSearching ? '10px 0px 20px 0px' : '0px', 
                    opacity: isSearching ? 1 : 0, 
                    visibility: isSearching ? 'visible' : 'hidden', 
                    transition: 'opacity 0.3s ease-out, visibility 0.3s ease-out' 
                }}>
                    Limpar pesquisa...
                </button>

                { /* FEED PUBLICATIONS */ }
                {
                    noPosts && !searchedData && !noPostsFound && (
                        <div className='noRequests'>
                            <h1 className='title is-2'>Sem pedidos de ajuda...</h1>
                        </div>
                    )
                }
                {
                    noPostsFound && (
                        <div className='noRequests'>
                            <h1 className='title is-2'>{ noPostsFound }</h1>
                        </div>
                    )
                }
                {
                    filteredRequests?.map((request) => {
                        const relatedOffers = offers.filter(offer => offer.request_id === request.id);
                        const isVisible = showOffersMap[request.id] || false;
    
                        return (
                            <div className='requests' key={ request.id }>
                                { /* REQUESTS */ }
                                <div className='user_container_feed'>
                                    <div className='user_image' ref={ divImageRef }
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

                                {
                                    request.user_id !== userID && (
                                        <div className='div_bottoms'>
                                            <Link to={`/oferecerAjuda/${request.id}`}>
                                                <button className="button is-primary is-dark"
                                                style={{ width:'13.5vw', padding:'10px' }}>
                                                    Ajudar
                                                </button>
                                            </Link>
                                        </div>
                                    )
                                }

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

                                                        
                                                        { request.user_id === userID && (
                                                        <div style={{ marginTop:'20px' }}>
                                                            { 
                                                                offer.status === 'aceito' ? (
                                                                    <div className='div_bottoms'>
                                                                        <button onClick={ () => statusChange(offer.id,'rejeitado') } className='button is-danger is-dark' style={{ width:'120px' }}>
                                                                            Rejeitar ajuda
                                                                        </button>
                                                                    </div>
                                                                ) : offer.status === 'pendente' ? (
                                                                    <div className='div_bottoms'>
                                                                        <button onClick={ () => statusChange(offer.id, 'aceito') } className='button is-primary is-dark' style={{ width:'120px' }}>
                                                                            Aceitar ajuda
                                                                        </button>
                                                                        
                                                                        <button onClick={ () => statusChange(offer.id,'rejeitado') } className='button is-danger is-dark' style={{ width:'120px' }}>
                                                                            Rejeitar ajuda
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <div className='div_bottoms'>
                                                                        <button onClick={ () => statusChange(offer.id, 'aceito') } className='button is-primary is-dark' style={{ width:'120px' }}>
                                                                            Aceitar ajuda
                                                                        </button>
                                                                    </div>
                                                                ) 
                                                            }
                                                        </div>
                                                        )}
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

export default Home;
