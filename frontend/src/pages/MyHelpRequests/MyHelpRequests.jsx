
// css
import styles from './MyHelpRequests.module.css';
import styles_homepage from '../HomePage/Home.module.css';

// hooks
import { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequestData } from '../../hooks/RequestsFetch/useRequestData'; // custom hook

// components
import SideBar from '../../components/SideBar/SideBar';

// context
import { UserContext } from '../../context/UserContext';

// services
import { deleteRequest } from '../../services/RequestHelpServices';



const MyHelpRequests = () => {
    // states
    const [ redirect, setRedirect ] = useState(false);    
    const [ noPosts, setNoPosts ] = useState(false);

    // consts
    const { userId } = useContext(UserContext); // context
    const navigate = useNavigate();
    const modal = useRef(null);
    const modal_title = useRef(null);
    const modal_msg = useRef(null);
    const modal_btt = useRef(null);
    const modal_btt_2 = useRef(null);


    // redirect user to homepage
    useEffect(() => {
        if(redirect === true){   
            const clearMessage = setTimeout(() => {
                navigate('/');
            }, 3000);
            
            return () => {
                clearTimeout(clearMessage);
            };
        }
    }, [redirect]);


    // get request data
    const { requestDataByUserId, setRequestDataByUserId } = useRequestData(null, userId);
    useEffect(() =>{
        if (requestDataByUserId && requestDataByUserId.length === 0) {
            setNoPosts(true);
        }
    }, [requestDataByUserId, setRequestDataByUserId]);


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


            { /* FEED CONTAINER */ }
            <div className={ styles_homepage.container_feed }>
                { /* FEED PUBLICATIONS */ }
                <h1 className='title is-1'>Meus pedidos de ajuda</h1>

                {
                    noPosts && (
                        <div className={ styles_homepage.noRequests }>
                            <h1 className='title is-2'>Sem pedidos de ajuda...</h1>
                        </div>
                    )
                }
                {
                    requestDataByUserId && requestDataByUserId.map((request) => (
                        <div className={ styles_homepage.requests } key={request.id}>
                            { /* REQUESTS */ }
                            <div className={ styles_homepage.user_container }>
                                <div className={ styles_homepage.user_image }
                                style={{ 
                                    backgroundImage: `url(data:${request.profile_image.content_type};base64,${request.profile_image.image_data})`                                        
                                }}>

                                </div>
                                
                                <h1 className='title is-3'>{ request.user_data.name }</h1>
                            </div>
                            
                            <div className={ styles_homepage.requests_container_image }>
                                <div className={ styles_homepage.user_requests_container }>
                                    <div className={ styles_homepage.user_requests_title }>
                                        <h1 className='title is-2' style={{ 
                                            color:'white', textShadow: '0px 0px 10px rgb(0, 0, 0)' 
                                        }}>
                                            { request.title }
                                        </h1>
                                    </div>

                                    <div className={ styles_homepage.user_requests_description }>
                                        <h1 className='subtitle is-5'>{ request.description }</h1>
                                    </div>

                                    <div className={ styles_homepage.user_requests_details }>
                                        <div className={ styles_homepage.details }>
                                            <p className={ styles_homepage.titles_requests }>Categoria</p>
                                            <h1 className='subtitle is-4'>{ request.category }</h1>
                                        </div>  
                                        <div className={ styles_homepage.details }>
                                            <p className={ styles_homepage.titles_requests }>Urgência</p>
                                            { request.urgency === 'media' ? 
                                                ( <h1 className='subtitle is-4'>média</h1> ) :
                                                ( <h1 className='subtitle is-4'>{ request.urgency }</h1> ) 
                                            }
                                        </div>  
                                        <div className={ styles_homepage.details }>
                                            <p className={ styles_homepage.titles_requests }>Status</p>
                                            <h2 className={ request.status === 'aberto' ? styles_homepage.status_aberto :  styles_homepage.status_fechado }>
                                                { request.status }
                                            </h2>
                                        </div>  
                                    </div>
                                </div>
                            </div>

                            <div className={ styles_homepage.div_bottoms }>
                                <button className="button is-info is-outlined" onClick={ () => editRequest(request.id) }>
                                    Editar
                                </button>
                                <button className="button is-danger is-outlined" onClick={ () => modal_deleteRequest(request.id) }>
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default MyHelpRequests;
