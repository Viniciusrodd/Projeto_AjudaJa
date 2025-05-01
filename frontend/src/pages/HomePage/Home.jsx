
// css
import styles from './Home.module.css';

// hooks
import { useEffect, useState, useRef } from 'react';
import useTokenVerify from '../../hooks/UserMiddleware/useTokenVerify'; // custom hook
import { useNavigate } from 'react-router-dom';
import { useLogOut } from '../../hooks/UserFetch/useLogOut'; // custom hook


const Home = () => {
    // states
    const [ isLogged, setIsLogged ] = useState(false);
    const [ redirectLogin, setRedirectLogin ] = useState(false);
    
    // consts
    const { data, error } = useTokenVerify(); // custom hook
    const navigate = useNavigate();
    const modal = useRef(null);
    const modal_title = useRef(null);
    const modal_msg = useRef(null);
    const modal_btt = useRef(null);


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
    useEffect(() => {
        if(error){
            console.log('Erro detectado: ', error.message);            
            modal.current.style.display = 'flex';
            modal_msg.current.style.display = 'É necessário login para continuar, você será redirecionado em...';

            setRedirectLogin(true);
        }
        if(data){
            setIsLogged(true);
        }
    }, [data, error]);


    // logout
    const logoutFunction = async () =>{
        try{
            const res = await useLogOut();
            if(res.status == 200){
                modal.current.style.display = 'flex';
                modal_title.current.innerText = 'Volte em breve!!!'
                modal_msg.current.innerText = `Você será redirecionado para login...`;
                modal_btt.current.style.display = 'none';            
    
                setRedirectLogin(true);
            }
        }
        catch(error){
            console.log('Error at logOut request at front...', error);

            modal.current.style.display = 'flex';
            modal_msg.current.innerText = `Erro durante o logOut, \n
            por favor, tente novamente...`;
            modal_btt.current.innerText = 'Tentar novamente';
            
            if(modal_btt.current){
                modal_btt.current.onclick = () =>{
                    modal.current.style.display = 'none';
                };        
            }
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
                        </div>
                    </footer>
                </div>
            </div>

            
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
                    <li onClick={ logoutFunction }><i className="material-icons">logout</i> 
                        Sair 
                    </li>
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
