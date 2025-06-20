
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

    // modal
    const [ modal_display, setModal_display ] = useState(false);
    const [ modal_title, setModal_title ] = useState(null);
    const [ modal_msg, setModal_msg ] = useState(null);
    const [ modal_btt, setmodal_btt ] = useState(false);
    const [ modal_btt_2, setModal_btt_2 ] = useState(false);
    const [ title_color, setTitle_color ] = useState('#000');

    // consts
    const navigate = useNavigate();
    const { setUserName, setIsLogged, setUserId } = useContext(UserContext); // context
    const divImageRef = useRef(null);
    const select_options = useRef(null);


    ////////////// functions


    // scroll top at beginning
    useEffect(() =>{
        window.scrollTo(0, 0);
    }, []);    

    // redirect to login
    useEffect(() =>{
        if(redirectLogin){
            const clearMessage = setTimeout(() => {
                modal_config({
                    title1: null, msg: null, btt1: false, 
                    btt2: false, display: false, title_color: '#000'
                });

                navigate('/login');
            }, 3000);
        
            return () => {
                clearTimeout(clearMessage);
            };
        }
    }, [redirectLogin]);

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
            modal_config({
                title: 'Espere',
                msg: `É necessário login para continuar, você será redirecionado...`,
                btt1: false, btt2: false,
                display: 'flex', title_color: 'rgb(0, 136, 255)'
            });    
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
            modal_config({
                title: 'Erro',
                msg: `Erro ao pesquisar por pedido de ajuda...`,
                btt1: false, btt2: false,
                display: 'flex', title_color: 'rgb(255, 0, 0)'
            });
            setTimeout(() => {
                modal_config({
                    title: null, msg: null, btt1: false, 
                    btt2: false, display: false, title_color: '#000'
                });
                setSearch('');
                setIsSearching(false);
            }, 3000);
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
                modal_config({
                    title: 'Sucesso', 
                    msg: `Oferta de ajuda ${decision === 'aceito' ? 'aceitada' : 'rejeitada'}!`,
                    btt1: false, btt2: false, 
                    display: 'flex', title_color: 'rgb(38, 255, 0)'
                });

                setTimeout(() => {
                    setOffers(prevOffers => prevOffers.map(offer => offer.id === id ? { ...offer, status: decision } : offer));
                    modal_config({
                        title: null, msg: null, btt1: false, 
                        btt2: false, display: false, title_color: '#000'
                    });
                }, 3000);                
            }
        }
        catch(error){
            console.log('Error at accept help');

            modal_config({
                title: 'Erro', 
                msg: `Erro ao ${decision === 'aceito' ? 'aceitar' : 'rejeitar'} oferta de ajuda...`,
                btt1: false, btt2: 'Tente novamente', 
                display: 'flex', title_color: 'rgb(255, 0, 0)'
            });
        }
    };

    // filtering service function
    const filtering = (data) =>{
        const filtered = requestData.filter(request => request.urgency === data);

        if(filtered.length === 0){
            setNoPostsFound(`Pedidos de ajuda de ${data} urgência não encontrados`);
            setSearchedData(null);
            setTimeout(() => {
                setNoPostsFound('');
                setMyRequests(null);
                setSearch('');
                setIsSearching(false)
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
                        <p className='modal-card-title has-text-centered' 
                        style={{ textAlign:'center' }}>
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
                                <button className="button is-danger is-dark">
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
                                                                        <button onClick={ () => statusChange(offer.id, 'aceito') } className='button is-primary is-dark' 
                                                                        style={{ width:'120px', marginRight: '10px' }}>
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
