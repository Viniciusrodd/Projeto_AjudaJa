
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

    // modal
    const [ modal_display, setModal_display ] = useState(false);
    const [ modal_title, setModal_title ] = useState(null);
    const [ modal_msg, setModal_msg ] = useState(null);
    const [ modal_btt, setmodal_btt ] = useState(false);
    const [ modal_btt_2, setModal_btt_2 ] = useState(false);
    const [ title_color, setTitle_color ] = useState('#000');

    // consts
    const navigate = useNavigate();
    const { setIsLogged } = useContext(UserContext); // context
    const location = useLocation();


    ////////////// functions


    // redirect
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

    // logout
    const logoutFunction = async () =>{
        try{
            const res = await useLogOut();
            if(res.status == 200){
                setIsLogged(false);

                modal_config({
                    title: 'Sucesso',
                    msg: `Volte em breve!!! \n você será redirecionado para login...`,
                    btt1: false, btt2: false,
                    display: 'flex', title_color: 'rgb(38, 255, 0)'
                });
                setRedirectLogin(true);
            }
        }
        catch(error){
            console.log('Error at logOut request at front...', error);

            modal_config({
                title: 'Erro',
                msg: `Erro durante o logOut, \n
                por favor, tente novamente...`,
                btt1: false, btt2: 'Tentar novamente',
                display: 'flex', title_color: 'rgb(255, 0, 0)'
            });
        }
    };


    ////////////// jsx


    return (
        <aside className={ styles.sidebar }>
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
                        <p className='modal-card-title has-text-centered' style={{ textAlign:'center' }}>
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
                <Link to='/mensagens'>
                    {
                        location.pathname === '/mensagens' || location.pathname.includes('/chat') ? (
                            <li style={{ color:'#00EBC7' }}> <i className="material-icons" style={{ color:'#00EBC7' }}>chat</i>
                                Mensagens
                            </li>
                        ) : (
                            <li> <i className="material-icons">chat</i>
                                Mensagens
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
