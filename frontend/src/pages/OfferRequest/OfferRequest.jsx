
// styles
import styles from './OfferRequest.module.css';
import stylesAccountDetail from '../AccountDetails/AccountDetail.module.css';
import stylesHelpRequest from '../HelpRequests/HelpRequest.module.css'; 

// hooks
import { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 


// components
import SideBar from '../../components/SideBar/SideBar';


const OfferRequest = () => {
    // states
    const [ description, setDescription ] = useState('');
    const [ redirect, setRedirect ] = useState(false);

    // consts
    const { requestID } = useParams();
    const modal = useRef(null);
    const modal_title = useRef(null);
    const modal_msg = useRef(null);
    const modal_btt = useRef(null);
    const modal_btt_2 = useRef(null);
    const navigate = useNavigate();


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


    // handle offer
    const handleForm = async (e) =>{
        e.preventDefault();

        try{
            console.log(description);

            modal.current.style.display = 'flex';
            modal_title.current.innerText = 'Sucesso!!!'
            modal_msg.current.innerText = `Oferta de ajuda enviada! \n
            você será redirecionado para a página principal...`;
            modal_btt.current.style.display = 'none';
            modal_btt_2.current.style.display = 'none';

            setRedirect(true);
        }
        catch(error){
            console.log('Error at handle offer form...', error);
            if(error){
                modal.current.style.display = 'flex';
                modal_msg.current.innerText = 'Erro ao enviar oferta de ajuda...'
                modal_btt.current.innerText = 'Tentar novamente'
                modal_btt_2.current.style.display = 'none';

                modal_btt.current.addEventListener('click', () =>{
                    modal.current.style.display = 'none';
                });
            }
        }
    };


    return (
        <div className={ stylesAccountDetail.accountDetail_container }>
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

            { /* sidebar */ }
            <SideBar />

            <div className={ stylesAccountDetail.form_container }>
                <form onSubmit={ handleForm } className={ stylesAccountDetail.user_panel_container }>
                    <h1 className='title is-1'>Ofereça ajuda</h1>
                    <hr className='hr'/>

                    <div className={`control ${stylesAccountDetail.textarea_container}`}>
                        <label className="label title is-5" id="label">Descrição de ajuda: </label>
                        <textarea className="textarea is-hovered" name='description' style={{ height:'20vh' }}
                        value={ description } onChange={(e) => setDescription(e.target.value)}
                        placeholder='Descreva de forma detalhada como você pode ajudar nesta categoria. Ex: Tenho roupas em bom estado para doar, posso oferecer transporte até hospitais, dar aulas de reforço, ou ajudar com cuidados de animais. Qualquer contribuição será bem-vinda!
'>
                                                
                        </textarea>
                    </div>

                    <hr className='hr'/>
                    <button className="button is-primary is-dark">
                        Ajudar
                    </button>          
                </form>
            </div>
        </div>
    );
};

export default OfferRequest;
