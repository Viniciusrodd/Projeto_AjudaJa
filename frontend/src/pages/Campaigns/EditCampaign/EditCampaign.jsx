// css
import '../../../utils/FormsCss/FormsUtil.css';

// hooks
import { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOfferData } from '../../../hooks/OffersFetch/useOfferData'; // custom hook

// components
import SideBar from '../../../components/SideBar/SideBar';

// services
import { useCampaignData } from '../../../hooks/CampaignFetch/useCampaignData';


const EditCampaign = () => {
    // states
    const [ fieldsValues, setFieldsValue ] = useState({
        title: '', description: '', start_date: '', end_date: ''
    });
    const [ redirect, setRedirect ] = useState(false);

    // consts
    const navigate = useNavigate();
    const modal = useRef(null);
    const modal_title = useRef(null);
    const modal_msg = useRef(null);
    const modal_btt = useRef(null);
    const modal_btt_2 = useRef(null);
    const { campaignID } = useParams();


    // redirect user
    useEffect(() => {
        if(redirect === true){   
            const clearMessage = setTimeout(() => {
                navigate('/campanhas');
            }, 3000);
            
            return () => {
                clearTimeout(clearMessage);
            };
        }
    }, [redirect]);


    // get campaign data
    const { campaignDataById } = useCampaignData(campaignID);
    useEffect(() =>{
        console.log(campaignDataById);
    }, [campaignDataById]);


    // edit form
    const editForm = (e) =>{
        e.preventDefault();


    };


    return (
        <div className='forms_container'>
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
            <div className='form'>
                <form onSubmit={ editForm } className='user_panel_container'>
                    <h1 className='title is-1'>Edite sua campanha de ajuda</h1>
                    <hr className='hr'/>

                    <div className='container_input'>
                        <label className="label title is-5" id="label">Titulo: </label>
                        <input className="input is-hovered" name='title' type="text"
                        style={{ width:'80%' }}/>
                    </div>


                    <div className={`control textarea_container`}>
                        <label className="label title is-5" id="label">Descrição: </label>
                        <textarea className="textarea is-hovered" name='description' style={{ height:'30vh' }}>
                                                
                        </textarea>
                    </div>        

                    <div className='container_input'>
                        <label className="label title is-5" id="label">Data de inicio: </label>
                        <input className="input is-hovered" name='start-date' type="date" 
                        style={{ width:'40%' }}/>
                    </div>

                    <div className='container_input'>
                        <label className="label title is-5" id="label">Data de fim: </label>
                        <input className="input is-hovered" name='end-date' type="date" 
                        style={{ width:'40%' }}/>
                    </div>

                    <hr className='hr' />

                    <button className="button is-primary is-dark">
                        Editar
                    </button>                    
                </form>
            </div>
        </div>
    );
};

export default EditCampaign;