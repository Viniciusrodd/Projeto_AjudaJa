
// css
import styles from './EditOffers.module.css';
import stylesAccountDetail from '../../Users/AccountDetails/AccountDetail.module.css';
import stylesHelpRequest from '../../Requests/HelpRequests/HelpRequest.module.css'; 

// hooks
import { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOfferData } from '../../../hooks/OffersFetch/useOfferData'; // custom hook

// components
import SideBar from '../../../components/SideBar/SideBar';

// services
import { updateOffer } from '../../../services/OfferHelpServices';


const EditOffers = () => {
    // state
    const [ description, setDescription ] = useState('');
    const [ redirect, setRedirect ] = useState(false);

    // consts
    const { offerID } = useParams();
    const navigate = useNavigate();
    const modal = useRef(null);
    const modal_title = useRef(null);
    const modal_msg = useRef(null);
    const modal_btt = useRef(null);
    const modal_btt_2 = useRef(null);


    // redirect user to my offers page
    useEffect(() => {
        if(redirect === true){   
            const clearMessage = setTimeout(() => {
                navigate('/minhasOfertasDeAjuda');
            }, 3000);
            
            return () => {
                clearTimeout(clearMessage);
            };
        }
    }, [redirect]); 
    

    // get offer data by id
    const { offerDataById } = useOfferData(null, offerID);
    useEffect(() =>{
        if(offerDataById){
            setDescription(offerDataById.description);
        }
    }, [offerDataById]);


    // handle form
    const editForm = async (e) =>{
        e.preventDefault();

        try{
            const response = await updateOffer({ description }, offerID);
            
            if(response.status === 200){
                modal.current.style.display = 'flex';
                modal_title.current.innerText = 'Sucesso!!!'
                modal_msg.current.innerText = `Oferta de ajuda Atualizada! \n 
                você será redirecionado para suas ofertas de ajuda...`;
                modal_btt.current.style.display = 'none';
                modal_btt_2.current.style.display = 'none';

                setRedirect(true);
            }
        }
        catch(error){
            console.log('Error at update offer: ', error);
            if(error){
                modal.current.style.display = 'flex';
                modal_msg.current.innerText = 'Erro ao editar oferta de ajuda...'
                modal_btt.current.innerText = 'Tentar novamente'
                modal_btt_2.current.style.display = 'none';

                modal_btt.current.addEventListener('click', () =>{
                    modal.current.style.display = 'none';
                });
            }
        }
    }


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


            { /* SIDEBAR */ }
            <SideBar />
         

            { /* Formulário */}
            <div className={ stylesAccountDetail.form_container }>
                <form onSubmit={ editForm } className={ stylesAccountDetail.user_panel_container }>
                    <h1 className='title is-1'>Edite sua oferta de ajuda</h1>
                    <hr className='hr'/>

                    <div className={`control ${stylesAccountDetail.textarea_container}`}>
                        <label className="label title is-5" id="label">Descrição de ajuda: </label>
                        <textarea className="textarea is-hovered" name='description' style={{ height:'20vh' }}
                        value={ description } onChange={(e) => setDescription(e.target.value)}>
                                                
                        </textarea>
                    </div>

                    <hr className='hr'/>
                    <button className="button is-primary is-dark">
                        Editar ajuda
                    </button>          
                </form>
            </div>
        </div>
    );
};

export default EditOffers;
