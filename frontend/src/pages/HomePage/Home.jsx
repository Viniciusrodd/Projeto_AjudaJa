
// css
import styles from './Home.module.css';

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
import { deleteRequest } from '../../services/RequestHelpServices';
import { statusChangeService } from '../../services/OfferHelpServices';


const Home = () => {
    // states
    const [ redirectLogin, setRedirectLogin ] = useState(false);
    const [ noPosts, setNoPosts ] = useState(false);
    const [ userID, setUserID ] = useState(0);
    const [ search, setSearch ] = useState('');    
    const [ noPostsFound, setNoPostsFound ] = useState(false);
    const [ searchedData, setSearchedData ] = useState(null);
    const [ offers, setOffers ] = useState([]);
    const [showOffersMap, setShowOffersMap] = useState({});
    const [ isSearching, setIsSearching ] = useState(false);

    // consts
    const navigate = useNavigate();
    const modal = useRef(null);
    const modal_title = useRef(null);
    const modal_msg = useRef(null);
    const modal_btt = useRef(null);
    const modal_btt_2 = useRef(null);
    const { setUserName, setIsLogged, setUserId } = useContext(UserContext); // context
    const divImageRef = useRef(null);


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
        <div className={ styles.container_home }>
            
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
            <div className={ styles.container_feed }>

                { /* FEED OPTIONS */ }
                <div className={ styles.feed_options }>
                    <div className="select is-primary">
                        <select style={{ width:'100%' }} className='is-hovered'>
                            <option>Filtro</option>
                            <option>Opções aqui...</option>
                        </select>
                    </div>
                    <form onSubmit={ search_form } className={ styles.search_container }>
                        <button onClick={ () => cleanSearch() } className="button is-primary is-outlined" 
                        style={{ marginBottom:'5px', opacity: isSearching ? 1 : 0, visibility: isSearching ? 'visible' : 'hidden', transition: 'opacity 0.3s ease-out, visibility 0.3s ease-out' }}>
                            Limpar pesquisa...
                        </button>

                        <input className='input is-primary' type="text" name="search" placeholder='Pesquise por ajuda' value={ search }
                        autoComplete='off' onChange={ (e) => setSearch(e.target.value) }/>
                
                        <button className="button is-primary is-outlined" style={{ height:'40px' ,width:'40px' }}>
                            <i className="material-icons" id='person'>search</i>
                        </button>
                    </form>
                </div>

                { /* FEED PUBLICATIONS */ }
                {
                    noPosts && !searchedData && (
                        <div className={ styles.noRequests }>
                            <h1 className='title is-2'>Sem pedidos de ajuda...</h1>
                        </div>
                    )
                }
                {
                    noPostsFound && (
                        <div className={ styles.noRequests }>
                            <h1 className='title is-2'>{ noPostsFound }</h1>
                        </div>
                    )
                }
                {
                    (searchedData || requestData)?.map((request) => {
                        const relatedOffers = offers.filter(offer => offer.request_id === request.id);
                        const isVisible = showOffersMap[request.id] || false;
    
                        return (
                            <div className={ styles.requests } key={ request.id }>
                                { /* REQUESTS */ }
                                <div className={ styles.user_container }>
                                    <div className={ styles.user_image } ref={ divImageRef }
                                    style={{ 
                                        backgroundImage: `url(data:${request.profile_image.content_type};base64,${request.profile_image.image_data})`                                        
                                    }}>

                                    </div>
                                    
                                    <h1 className='title is-3'>{ request.user_data.name }</h1>
                                </div>
                    
                                <div className={ styles.requests_container_image }>
                                    <div className={ styles.user_requests_container }>
                                        <div className={ styles.user_requests_title }>
                                            <h1 className='title is-2' style={{ 
                                                color:'white', textShadow: '0px 0px 10px rgb(0, 0, 0)' 
                                            }}>
                                                { request.title }
                                            </h1>
                                        </div>

                                        <div className={ styles.user_requests_description }>
                                            <h1 className='subtitle is-5'>{ request.description }</h1>
                                        </div>

                                        <div className={ styles.user_requests_details }>
                                            <div className={ styles.details }>
                                                <p className={ styles.titles_requests }>Categoria</p>
                                                <h1 className='subtitle is-4'>{ request.category }</h1>
                                            </div>  
                                            <div className={ styles.details }>
                                                <p className={ styles.titles_requests }>Urgência</p>
                                                { request.urgency === 'media' ? 
                                                    ( <h1 className='subtitle is-4'>média</h1> ) :
                                                    ( <h1 className='subtitle is-4'>{ request.urgency }</h1> ) 
                                                }
                                            </div>  
                                            <div className={ styles.details }>
                                                <p className={ styles.titles_requests }>Status</p>
                                                <h2 className={ request.status === 'aberto' ? styles.status_aberto :  styles.status_fechado }>
                                                    { request.status }
                                                </h2>
                                            </div>  
                                        </div>
                                    </div>
                                </div>

                                {
                                    request.user_id !== userID && (
                                        <div className={ styles.div_bottoms }>
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
                                        style={{ marginTop: '15px', marginRight:'8px', padding:'15px', width:'25%' }}>
                                            { !isVisible ? ('Abrir ajudas oferecidas') : ('fechar ajudas oferecidas') }
                                        </button>
                                    )
                                }

                                {
                                    isVisible && relatedOffers.length > 0 && (
                                        <div className={ styles.relatedOffers_container }>
                                            <div className={ styles.user_requests_title }>
                                                <h1 className='title is-2' style={{ color:'#00EBC7' }}>
                                                    Ajudas oferecidas:
                                                </h1>
                                            </div>

                                            {relatedOffers.map((offer) =>(
                                                <div key={offer.id} className={ styles.relatedOffers_image }>
                                                    <div className={ styles.relatedOffers }>
                                                        <div className={ styles.user_requests_details }>
                                                            <div className={ styles.details }>
                                                                <p className={ styles.titles_requests }>Nome: </p>
                                                                <h1 className='subtitle is-4'>{ offer.user_data.name }</h1>
                                                            </div>
                                                            <div className={ styles.details }>
                                                                <p className={ styles.titles_requests }>Status: </p>
                                                                <h2 className={ offer.status === 'aceito' ? styles.status_aberto : offer.status === 'pendente' ? styles.status_pendente : styles.status_fechado }>
                                                                    { offer.status }
                                                                </h2>
                                                            </div>
                                                        </div>

                                                        <div className={ styles.user_requests_description }>
                                                            <p className={ styles.titles_requests }>Descrição: </p>
                                                            <h1 className='subtitle is-5'>{ offer.description }</h1>
                                                        </div>

                                                        
                                                        { request.user_id === userID && (
                                                        <div style={{ marginTop:'20px' }}>
                                                            { 
                                                                offer.status === 'aceito' ? (
                                                                    <div className={ styles.div_bottoms }>
                                                                        <button onClick={ () => statusChange(offer.id,'rejeitado') } className='button is-danger is-dark' style={{ width:'120px' }}>
                                                                            Rejeitar ajuda
                                                                        </button>
                                                                    </div>
                                                                ) : offer.status === 'pendente' ? (
                                                                    <div className={ styles.div_bottoms }>
                                                                        <button onClick={ () => statusChange(offer.id, 'aceito') } className='button is-primary is-dark' style={{ width:'120px' }}>
                                                                            Aceitar ajuda
                                                                        </button>
                                                                        
                                                                        <button onClick={ () => statusChange(offer.id,'rejeitado') } className='button is-danger is-dark' style={{ width:'120px' }}>
                                                                            Rejeitar ajuda
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <div className={ styles.div_bottoms }>
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
