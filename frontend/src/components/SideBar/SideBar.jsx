
// css
import styles from './SideBar.module.css';

// hooks
import { useRef, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTokenVerify } from '../../hooks/UserMiddleware/useTokenVerify'; // custom hook

// services
import { useLogOut } from '../../services/UserServices';

// context
import { UserContext } from '../../context/UserContext';


const SideBar = () => {
    const [ redirectLogin, setRedirectLogin ] = useState(false);
    
    const navigate = useNavigate();
    const modal = useRef(null);
    const modal_title = useRef(null);
    const modal_msg = useRef(null);
    const modal_btt = useRef(null);
    const { setIsLogged } = useContext(UserContext); // context


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


    // homepage redirect
    const homePage_redirect = () =>{
        navigate('/');
    };


    // pedidoDeAjuda redirect
    const pedidoDeAjuda_redirect = () =>{
        navigate('/pedidoDeAjuda');
    };


    // my Help Requests redirect
    const myHelpRequests_redirect = () =>{
        navigate('/meusPedidosDeAjuda');
    };


    // my offers redirect
    const myOffers_redirect = () =>{
        navigate('/minhasOfertasDeAjuda');
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
                <li onClick={ homePage_redirect }> <i className="material-icons">home</i> 
                    Página principal 
                </li>
                <li onClick={ myHelpRequests_redirect }> <i className="material-icons">emoji_people</i> 
                    Pedidos de ajuda 
                </li>
                <li onClick={ myOffers_redirect }> <i className="material-icons">volunteer_activism</i> 
                    Ajudas oferecidas 
                </li>
                <li> <i className="material-icons">group</i> Grupos </li>
                <li> <i className="material-icons">campaign</i> Campanhas </li>
                <li> <i className="material-icons">person_add</i> Convide vizinhos </li>
            </ul>

            <button onClick={ pedidoDeAjuda_redirect } className="button is-primary is-outlined">
                Postar pedido de ajuda
            </button>

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
