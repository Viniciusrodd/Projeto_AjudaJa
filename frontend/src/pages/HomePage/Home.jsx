
// css
import styles from './Home.module.css';

// libs
import axios from 'axios';

// hooks
import { useEffect, useState, useRef, useContext } from 'react';
import { useTokenVerify } from '../../hooks/UserMiddleware/useTokenVerify'; // custom hook
import { useNavigate } from 'react-router-dom';
import { useRequestData } from '../../hooks/RequestsFetch/useRequestData'; // custom hook

// components
import SideBar from '../../components/SideBar/SideBar';

// context
import { UserContext } from '../../context/UserContext';

// services
import { deleteRequest } from '../../services/RequestHelpServices';

const Home = () => {
    // states
    const [ redirectLogin, setRedirectLogin ] = useState(false);
    const [ noPosts, setNoPosts ] = useState(false);
    const [ userID, setUserID ] = useState(0);
    const [ search, setSearch ] = useState('');    
    const [ noPostsFound, setNoPostsFound ] = useState(false);
    const [searchedData, setSearchedData] = useState(null);

    // consts
    const navigate = useNavigate();
    const modal = useRef(null);
    const modal_title = useRef(null);
    const modal_msg = useRef(null);
    const modal_btt = useRef(null);
    const modal_btt_2 = useRef(null);
    const { setUserName, setIsLogged, setUserId } = useContext(UserContext); // context
    const divImageRef = useRef(null);
    const div_bottoms = useRef(null);


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
            console.log('Error at fetchToken at Homepage: ', errorRes);            
            modal.current.style.display = 'flex';
            modal_msg.current.innerText = 'É necessário login para continuar, você será redirecionado...';
            modal_btt.current.style.display = 'none';
    
            setRedirectLogin(true);
        }
    }, [userData, errorRes]);


    // get Help requestsHelp data
    const { requestData } = useRequestData(); // array with objects...
    useEffect(() =>{
        if (requestData && requestData.length === 0) {
            setNoPosts(true);
        }
        //console.log('dados pegos: ', requestData);
    }, [requestData]);


    // redirect to edit requestHelp
    const editRequest = (id) =>{
        navigate(`/editarPedido/${id}`);
    };


    // modal for delete requestHelp
    const modal_deleteRequest = (id) =>{
        modal.current.style.display = 'flex';
        modal_msg.current.innerText = 'Tem certeza que deseja excluir seu pedido de ajuda ?'
        modal_btt.current.innerText = 'Tenho certeza'
        
        modal_btt.current.onclick = () =>{
            deleteRequest_event(id)
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
                    window.location.reload();
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


    const search_form = async (e) => {
        e.preventDefault();

        if (search.trim() === '') {
            setSearchedData(null);
            return;
        }

        try{
            const response = await axios.get(`http://localhost:2130/requestSearch/${search}`, { withCredentials: true });

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
                    <div className="select is-success">
                        <select style={{ width:'100%' }}>
                            <option>Filtro</option>
                            <option>Opções aqui...</option>
                        </select>
                    </div>
                    <form onSubmit={ search_form } className={ styles.search_container }>
                        <input className='input is-success' type="text" name="search" placeholder='Pesquise por ajuda' value={ search } 
                        autoComplete='off' onChange={ (e) => setSearch(e.target.value) }/>
                        <button className="button is-primary is-dark" style={{ marginLeft:'5px', height:'40px' ,width:'40px' }}>
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
                    (searchedData || requestData)?.map((request) => (
                        <div className={ styles.requests_container } key={ request.id }>
                            { /* REQUESTS */ }
                            <div className={ styles.requests }>
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
                                    request.user_id === userID ? (
                                        <div className={ styles.div_bottoms } ref={ div_bottoms }>
                                            <button className="button is-primary is-dark" onClick={ () => editRequest(request.id) }>
                                                Editar
                                            </button>
                                            <button className="button is-danger is-dark" onClick={ () => modal_deleteRequest(request.id) }>
                                                Excluir
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={ styles.div_bottoms } ref={ div_bottoms }>
                                            <button className="button is-info is-dark">
                                                Ajudar
                                            </button>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default Home;
