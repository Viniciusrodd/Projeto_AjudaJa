
// css
import styles from './MyHelpRequests.module.css';
import styles_homepage from '../HomePage/Home.module.css';

// hooks
import { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequestData } from '../../hooks/RequestsFetch/useRequestData'; // custom hook

// components
import SideBar from '../../components/SideBar/SideBar';


const MyHelpRequests = () => {
    // states
    const [ data_fields, setData_fields ] = useState({
        title: '', description: '', category: '', urgency: 'baixa', status: 'aberto'
    });
    const [ redirect, setRedirect ] = useState(false);

    // consts
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
                <div className={ styles_homepage.requests }>
                    { /* REQUESTS */ }
                    <div className={ styles_homepage.user_container }>
                        <div className={ styles_homepage.user_image }>

                        </div>
                        
                        <h1 className='title is-3'>nome de user</h1>
                    </div>
                    
                    <div className={ styles_homepage.requests_container_image }>
                        <div className={ styles_homepage.user_requests_container }>
                            <div className={ styles_homepage.user_requests_title }>
                                <h1 className='title is-2' style={{ 
                                    color:'white', textShadow: '0px 0px 10px rgb(0, 0, 0)' 
                                }}>
                                    titulo
                                </h1>
                            </div>

                            <div className={ styles_homepage.user_requests_description }>
                                <h1 className='subtitle is-5'>Descrição</h1>
                            </div>

                            <div className={ styles_homepage.user_requests_details }>
                                <div className={ styles_homepage.details }>
                                    <p className={ styles_homepage.titles_requests }>Categoria</p>
                                    <h1 className='subtitle is-4'>categoria</h1>
                                </div>  
                                <div className={ styles_homepage.details }>
                                    <p className={ styles_homepage.titles_requests }>Urgência</p>
                                    <h1 className='subtitle is-4'>urgencia</h1>
                                </div>  
                                <div className={ styles_homepage.details }>
                                    <p className={ styles_homepage.titles_requests }>Status</p>
                                    <h2 className='subtitle is-4'>
                                        status
                                    </h2>
                                </div>  
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyHelpRequests;
