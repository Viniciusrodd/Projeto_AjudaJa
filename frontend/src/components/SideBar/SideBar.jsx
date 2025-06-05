
// css
import styles from './SideBar.module.css';

// hooks
import { useRef, useState, useEffect, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTokenVerify } from '../../hooks/UserMiddleware/useTokenVerify'; // custom hook

// services
import { useLogOut } from '../../services/UserServices';

// context
import { UserContext } from '../../context/UserContext';


const SideBar = () => {
    // states
    const [ redirectLogin, setRedirectLogin ] = useState(false);

    // consts
    const navigate = useNavigate();
    const modal = useRef(null);
    const modal_title = useRef(null);
    const modal_msg = useRef(null);
    const modal_btt = useRef(null);
    const { setIsLogged } = useContext(UserContext); // context
    const location = useLocation();


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


    // logout
    const logoutFunction = async () =>{
        try{
            const res = await useLogOut();
            if(res.status == 200){
                setIsLogged(false);

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


    // pedidoDeAjuda redirect
    const pedidoDeAjuda_redirect = () =>{
        navigate('/pedidoDeAjuda');
    };


    return (
        <aside className={ styles.sidebar }>
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

            <ul className={ styles.sidebar_items }>
                <Link to='/'>
                    {
                        location.pathname === '/' ? (
                            <li style={{ color:'#00EBC7' }}><i className="material-icons" style={{ color:'#00EBC7' }}>home</i>
                                Página principal
                            </li>
                        ) : (
                            <li><i className="material-icons">home</i>
                                Página principal
                            </li>
                        )
                    }
                </Link>
                <Link to='/meusPedidosDeAjuda'>
                    {
                        location.pathname === '/meusPedidosDeAjuda' ? (
                            <li style={{ color:'#00EBC7' }}><i className="material-icons" style={{ color:'#00EBC7' }}>emoji_people</i>
                                Pedidos de ajuda
                            </li>
                        ) : (
                            <li><i className="material-icons">emoji_people</i>
                                Pedidos de ajuda
                            </li>
                        )
                    }
                </Link>
                <Link to='/minhasOfertasDeAjuda'>
                    {
                        location.pathname === '/minhasOfertasDeAjuda' ? (
                            <li style={{ color:'#00EBC7' }}><i className="material-icons" style={{ color:'#00EBC7' }}>volunteer_activism</i>
                                Ajudas oferecidas
                            </li>
                        ) : (
                            <li><i className="material-icons">volunteer_activism</i>
                                Ajudas oferecidas
                            </li>
                        )
                    }
                </Link>
                <Link to='/campanhas'>
                    {
                        location.pathname === '/campanhas' ? (
                            <li style={{ color:'#00EBC7' }}> <i className="material-icons" style={{ color:'#00EBC7' }}>campaign</i>
                                Campanhas
                            </li>
                        ) : (
                            <li> <i className="material-icons">campaign</i>
                                Campanhas
                            </li>
                        )
                    }
                </Link>
                <li> <i className="material-icons">person_add</i> Convide vizinhos </li>
            </ul>

            <div className={ styles.div_btts }>
                <Link to='/pedidoDeAjuda'>
                    <button className="button is-primary is-outlined">
                        Criar pedido de ajuda
                    </button>
                </Link>
                
                <Link to='/criarCampanha'>
                    <button className="button is-info is-outlined">
                        Criar campanha
                    </button>
                </Link>
            </div>

            <ul className={ styles.sidebar_items }>
                <li onClick={ logoutFunction }><i className="material-icons">logout</i> 
                    Sair 
                </li>
                <li><i className="material-icons">settings</i> Configurações </li>
                <li><i className="material-icons">help</i> Dúvidas sobre o site </li>
            </ul>
        </aside>
    );
};

export default SideBar;
