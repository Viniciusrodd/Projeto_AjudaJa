
// css
import styles from './Home.module.css';

// hooks
import { useEffect, useState, useRef } from 'react';
import useTokenVerify from '../../hooks/UserMiddleware/useTokenVerify'; // custom hook
import { useNavigate } from 'react-router-dom';


const Home = () => {
    const { data, error } = useTokenVerify(); // custom hook
    const navigate = useNavigate();
    const messageRef = useRef(null);

    const [ isLogged, setIsLogged ] = useState(false);
    const [ message, setMessage ] = useState('');
    const [ count, setCount ] = useState(3);

    
    // login verify
    useEffect(() => {
        if(error){
            setMessage('É necessário login para continuar, você será redirecionado em...');            
        }
        if(data){
            setIsLogged(true);
        }
    }, [data, error]);


    // advice message
    useEffect(() => {
        if(message !== ''){
            messageRef.current.scrollIntoView({
                behavior: "smooth"
            });

            const clearCount = setInterval(() => {
                setCount(prevCount => prevCount - 1);
            }, 1000);

            const clearMessage = setTimeout(() => {
                setMessage('');
                navigate('/login');
            }, 4000);

            return () => {
                clearTimeout(clearMessage);
                clearInterval(clearCount);
            };
        };
    }, [message]);
    

    return (
        <div className={ styles.container_home }>
            { message != '' && 
                <p className='subtitle is-3' ref={ messageRef } style={{ backgroundColor:'black' }}>
                    { message } { count }
                </p> 
            }

            
            { /* SIDEBAR */ }
            <aside className={ styles.sidebar }>
                <ul className={ styles.sidebar_items }>
                    <li> <i className="material-icons">home</i> Página principal </li>
                    <li> <i className="material-icons">shopping_bag</i> Doações </li>
                    <li> <i className="material-icons">forum</i> Conversas </li>
                    <li> <i className="material-icons">notifications</i> Notificações </li>
                    <li> <i className="material-icons">group</i> Grupos </li>
                    <li> <i className="material-icons">campaign</i> Campanhas </li>
                    <li> <i className="material-icons">person_add</i> Convide vizinhos </li>
                </ul>

                <button className="button is-primary is-dark">
                    Publique
                </button>

                <ul className={ styles.sidebar_items }>
                    <li><i className="material-icons">logout</i> Sair </li>
                    <li><i className="material-icons">settings</i> Configurações </li>
                    <li><i className="material-icons">help</i> Ajuda com o site </li>
                </ul>
            </aside>


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
                    <button className="button is-primary is-dark">
                        + Publicação
                    </button>
                </div>

                { /* FEED PUBLICATIONS */ }
                <div className={ styles.requests_container }>
                    { /* REQUESTS */ }
                    <div className={ styles.requests }>
                        <div className={ styles.user_container }>
                            <div className={ styles.user_image }></div>
                            
                            <h1 className='subtitle is-4'>Nome do usuário</h1>
                        </div>
            
                        <div className={ styles.user_requests_container }>
                            <div className={ styles.user_requests_title }>
                                title
                            </div>

                            <div className={ styles.user_requests_description }>
                                description
                            </div>

                            <div className={ styles.user_requests_details }>
                                <div className={ styles.details }>category</div>  
                                <div className={ styles.details }>urgency</div>  
                                <div className={ styles.details }>status</div>  
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
