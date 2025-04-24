
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
            
            <aside className={ styles.sidebar }>
                <ul className={ styles.sidebar_items }>
                    <li> <i class="material-icons">home</i> Página principal </li>
                    <li> <i class="material-icons">shopping_bag</i> Doações </li>
                    <li> <i class="material-icons">forum</i> Conversas </li>
                    <li> <i class="material-icons">notifications</i> Notificações </li>
                    <li> <i class="material-icons">group</i> Grupos </li>
                    <li> <i class="material-icons">event_available</i> Eventos </li>
                    <li> <i class="material-icons">person_add</i> Convide vizinhos </li>
                </ul>

                <button className="button is-success is-outlined">
                    Publique
                </button>

                <ul className={ styles.sidebar_items }>
                    <li><i class="material-icons">logout</i> Sair </li>
                    <li><i class="material-icons">settings</i> Configurações </li>
                    <li><i class="material-icons">help</i> Ajuda com o site </li>
                </ul>
            </aside>

            <div className={ styles.container_feed }>
                <div className={ styles.feed_options }>
                    <div class="select is-success">
                        <select>
                            <option>Filtro</option>
                            <option>Opções aqui...</option>
                        </select>
                    </div>
                    <button className="button is-success is-outlined">
                        + Publicação
                    </button>
                </div>

                <div className={ styles.posts_container }>
                    <div className={ styles.posts }>
                        <p>posts here...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
