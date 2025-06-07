// css
import '../../../utils/FormsCss/FormsUtil.css';

// hooks
import { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCampaignData } from '../../../hooks/CampaignFetch/useCampaignData'; // custom hook

// components
import SideBar from '../../../components/SideBar/SideBar';

// services
import { editCampaign } from '../../../services/CampaignService';


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
        if(campaignDataById){
            setFieldsValue({ ...fieldsValues, 
                title: campaignDataById.title,
                description: campaignDataById.description,
                start_date: campaignDataById.start_date,
                end_date: campaignDataById.end_date 
            });
        }
    }, [campaignDataById]);


    // edit form
    const editForm = async (e) =>{
        e.preventDefault();

        try{
            const response = await editCampaign(campaignID, fieldsValues);

            if(response.status === 200){
                modal.current.style.display = 'flex';
                modal_title.current.innerText = 'Sucesso!!!'
                modal_msg.current.innerText = `Campanha Atualizada! \n 
                você será redirecionado para a página de campanhas...`;
                modal_btt.current.style.display = 'none';
                modal_btt_2.current.style.display = 'none';

                setRedirect(true);
            }
        }
        catch(error){
            console.log('Error at update campaign: ', error);

            if(error.response.data.error === 'Start date cannot be smaller than previous start date'){
                modal.current.style.display = 'flex';
                modal_title.current.innerText = 'Erro de datas';
                modal_msg.current.innerText = `Data inicial não pode ser menor que a original...`;
                modal_btt.current.innerText = 'Tentar novamente';
                modal_btt_2.current.style.display = 'none';

                modal_btt.current.onclick = () => {
                    modal.current.style.display = 'none';
                };
                return;
            }
            
            if(error.response.data.error === 'End date must be within the next year'){
                modal.current.style.display = 'flex';
                modal_title.current.innerText = 'Erro de datas';
                modal_msg.current.innerText = `Data final não pode ser maior que ${new Date().getFullYear() + 1}...`;
                modal_btt.current.innerText = 'Tentar novamente';
                modal_btt_2.current.style.display = 'none';

                modal_btt.current.onclick = () => {
                    modal.current.style.display = 'none';
                };
                return;
            }

            modal.current.style.display = 'flex';
            modal_msg.current.innerText = 'Erro ao editar campanha...'
            modal_btt.current.innerText = 'Tentar novamente'
            modal_btt_2.current.style.display = 'none';

            modal_btt.current.addEventListener('click', () =>{
                modal.current.style.display = 'none';
            });
        }
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
                        style={{ width:'80%' }} value={ fieldsValues.title }
                        onChange={ (e) => setFieldsValue({...fieldsValues, title: e.target.value}) }/>
                    </div>


                    <div className={`control textarea_container`}>
                        <label className="label title is-5" id="label">Descrição: </label>
                        <textarea className="textarea is-hovered" name='description' style={{ height:'30vh' }}
                        value={ fieldsValues.description } onChange={ (e) => setFieldsValue({...fieldsValues, description: e.target.value}) }>
                                                
                        </textarea>
                    </div>        

                    <div className='container_input'>
                        <label className="label title is-5" id="label">Data de inicio: </label>
                        <input className="input is-hovered" name='start-date' type="date" 
                        style={{ width:'40%' }} value={ fieldsValues.start_date }
                        onChange={ (e) => setFieldsValue({...fieldsValues, start_date: e.target.value}) }/>
                    </div>

                    <div className='container_input'>
                        <label className="label title is-5" id="label">Data de fim: </label>
                        <input className="input is-hovered" name='end-date' type="date" 
                        style={{ width:'40%' }} value={ fieldsValues.end_date }
                        onChange={ (e) => setFieldsValue({...fieldsValues, end_date: e.target.value}) }/>
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