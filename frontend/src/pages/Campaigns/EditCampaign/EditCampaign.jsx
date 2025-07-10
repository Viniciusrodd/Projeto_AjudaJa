// css
import '../../../utils/FormsCss/FormsUtil.css';

// hooks
import { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCampaignData } from '../../../hooks/CampaignFetch/useCampaignData'; // custom hook

// context
import { LoadingContext } from '../../../context/loadingContext';

// components
import SideBar from '../../../components/SideBar/SideBar';
import Modal from '../../../components/Modal';

// services
import { editCampaign } from '../../../services/CampaignService';


const EditCampaign = () => {
    // states
    const [ fieldsValues, setFieldsValue ] = useState({
        title: '', description: '', start_date: '', end_date: ''
    });
    const [ redirect, setRedirect ] = useState(false);

    // modal
    const [ modal_display, setModal_display ] = useState(false);
    const [ modal_title, setModal_title ] = useState(null);
    const [ modal_msg, setModal_msg ] = useState(null);
    const [ modal_btt, setmodal_btt ] = useState(false);
    const [ modal_btt_2, setModal_btt_2 ] = useState(false);
    const [ title_color, setTitle_color ] = useState('#000');

    // consts
    const navigate = useNavigate();
    const { campaignID } = useParams();

    // context
    const { loading } = useContext(LoadingContext);


    ////////////// functions

    // scroll top at beginning
    useEffect(() =>{
        window.scrollTo(0, 0);
    }, []);    

    // redirect user
    useEffect(() => {
        if(redirect === true){   
            const clearMessage = setTimeout(() => {
                modal_config({
                    title1: null, msg: null, btt1: false, 
                    btt2: false, display: false, title_color: '#000'
                });

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

    // edit form
    const editForm = async (e) =>{
        e.preventDefault();

        try{
            const response = await editCampaign(campaignID, fieldsValues);

            if(response.status === 200){
                modal_config({
                    title: 'Sucesso', msg: `Campanha Atualizada! \n 
                    você será redirecionado para a página de campanhas...`, 
                    btt1: false, btt2: false, display: 'flex', title_color: 'rgb(38, 255, 0)'
                });

                setRedirect(true);
            }
        }
        catch(error){
            console.log('Error at update campaign: ', error);

            if(error.response.data.error === 'Start date cannot be smaller than previous start date'){                
                modal_config({
                    title: 'Erro', msg: `Data inicial não pode ser menor que a original...`, 
                    btt1: false, btt2: 'Tentar novamente', display: 'flex', title_color: 'rgb(255, 0, 0)'
                });
                return;
            }
            
            if(error.response.data.error === 'End date must be within the next year'){
                modal_config({
                    title: 'Erro',
                    msg: `Data final não pode ser maior que ${new Date().getFullYear() + 1}...`,
                    btt1: false, btt2: 'Tentar novamente',
                    display: 'flex', title_color: 'rgb(255, 0, 0)'
                });
                return;
            }

            modal_config({
                title: 'Erro',
                msg: `Erro ao criar campanha...`,
                btt1: false, btt2: 'Tentar novamente',
                display: 'flex', title_color: 'rgb(255, 0, 0)'
            });
        }
    };


    ////////////// jsx    


    return (
        <div className='forms_container'>
            { /* Modal */ }
            <Modal 
                title={ modal_title }
                msg={ modal_msg }
                btt1={ modal_btt }
                btt2={ modal_btt_2 }
                display={ modal_display }
                title_color={ title_color } 
                onClose={ closeModal }
            />

            { /* SIDEBAR */ }
            <SideBar />
            
            { /* Formulário */}
            <div className='form'>
                <form onSubmit={ editForm } className='user_panel_container'>
                    <h1 className='title is-1'>Edite sua campanha de ajuda</h1>
                    {
                        loading && (
                            <div className='loading-container'>
                                <p>Carregando...</p>
                            </div>
                        )
                    }
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