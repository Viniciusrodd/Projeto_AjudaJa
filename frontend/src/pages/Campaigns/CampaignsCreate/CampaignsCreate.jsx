
// css
import '../../../utils/FormsCss/FormsUtil.css';
import '../../../utils/FeedsCss/FeedsUtil.css';
import '../../../utils/modal.css';

// hooks
import { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// components
import SideBar from '../../../components/SideBar/SideBar';

// context
import { UserContext } from '../../../context/UserContext';

// services
import { createCampaign } from '../../../services/CampaignService';


const CampaignsCreate = () => {
    // states
    const [ fieldsValues, setFieldsValue ] = useState({
        moderator_id: '', title: '', description: '', start_date: '', end_date: ''
    });
    const [ redirect, setRedirect ] = useState(false);

    // modal
    const [ modal_display, setModal_display ] = useState(false);
    const [ modal_title, setModal_title ] = useState(null);
    const [ modal_msg, setModal_msg ] = useState(null);
    const [ modal_btt, setmodal_btt ] = useState(false);
    const [ modal_btt_2, setModal_btt_2 ] = useState(false);
    const [ title_color, setTitle_color ] = useState('#000');
    const [ modal_errorType, setModal_errorType ] = useState(null);

    // consts
    const navigate = useNavigate();
    const { userId } = useContext(UserContext);


    ////////////// functions


    // userId for moderator_id
    useEffect(() =>{
        setFieldsValue({...fieldsValues, moderator_id: userId});
    }, [userId]);

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

    // modal btt events
    const modal_events = (modal_error) =>{
        if(modal_error === 'requires be moderator'){
            navigate(`/detalhesDeConta/${userId}`);
        }
    };

    //handle form
    const handleForm = async (e) =>{
        e.preventDefault();

        try{
            const response = await createCampaign(fieldsValues);

            if(response.status === 200){
                modal_config({
                    title: 'Sucesso',
                    msg: `Campanha criada! \n 
                    você será redirecionado para a página de campanhas...`,
                    btt1: false, btt2: false,
                    display: 'flex', title_color: 'rgb(38, 255, 0)'
                });
                setRedirect(true);
            }
        }
        catch(error){
            console.log('Error at create a campaign: ', error);

            if(error.response.status === 401){
                modal_config({
                    title: 'Erro',
                    msg: `É necessário ser um moderador para criar a campanha...\n
                    mude seu papel de "usuário" para "moderador`,
                    btt1: 'Virar moderador', btt2: 'Voltar',
                    display: 'flex', title_color: 'rgb(255, 0, 0)'
                });
                setModal_errorType('requires be moderator');
                return;
            }
            
            if(error.response.data.error === 'Start date cannot be in the past'){
                modal_config({
                    title: 'Erro',
                    msg: `Data inicial não pode ser menor que a atual...`,
                    btt1: false, btt2: 'Tentar novamente',
                    display: 'flex', title_color: 'rgb(255, 0, 0)'
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
        <div className='container_campaigns'>
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
                            { modal_msg }
                        </p>
                    </section>
                    <footer className='modal-card-foot is-justify-content-center'>
                        <div className='div-buttons'>
                            {modal_btt && (
                                <button onClick={ () => modal_events(modal_errorType) } className="button is-danger is-dark">
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

            { /* SIDEBAR */ }
            <SideBar />

            { /* FEED CONTAINER */ }
            <div className='form'>
                <form onSubmit={ handleForm } className='user_panel_container'>
                    <h1 className='title is-1'>Criação de campanha</h1>
                    <hr className='hr' />

                    <h4 className="subtitle is-4">Por favor, preencha: </h4>

                    <div className='container_input'>
                        <label className="label title is-5" id="label">Titulo: </label>
                        <input className="input is-hovered" name='title' type="text" required 
                        placeholder='Ex: "Campanha o agasalho"' style={{ width:'80%' }}
                        value={ fieldsValues.title } onChange={(e) => setFieldsValue({...fieldsValues, title: e.target.value})}/>
                    </div>

                    <div className={`control textarea_container`}>
                        <label className="label title is-5" id="label">Descrição: </label>
                        <textarea className="textarea is-hovered" name='description' style={{ minHeight:'30vh' }}
                        placeholder='Ex: "Ajude a levar calor e esperança a quem mais precisa nesta temporada de frio. Doe agasalhos, cobertores e acessórios de inverno para famílias e pessoas em situação de vulnerabilidade. Juntos, podemos fazer a diferença! ❤️🧥. 
📍 Pontos de coleta: [Listar locais ou link] 
📅 Período: [Datas da campanha] Sua doação aquece o corpo e o coração!"'
                        value={ fieldsValues.description } onChange={(e) => setFieldsValue({...fieldsValues, description: e.target.value})}>
                                                
                        </textarea>
                    </div>

                    <div className='container_input'>
                        <label className="label title is-5" id="label">Data de inicio: </label>
                        <input className="input is-hovered" name='start-date' type="date" required 
                        style={{ width:'40%' }}
                        value={ fieldsValues.start_date } onChange={(e) => setFieldsValue({...fieldsValues, start_date: e.target.value})}/>
                    </div>

                    <div className='container_input'>
                        <label className="label title is-5" id="label">Data de fim: </label>
                        <input className="input is-hovered" name='end-date' type="date" required 
                        style={{ width:'40%' }}
                        value={ fieldsValues.end_date } onChange={(e) => setFieldsValue({...fieldsValues, end_date: e.target.value})}/>
                    </div>

                    <hr className='hr' />

                    <button className="button is-primary is-dark">
                        Publicar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CampaignsCreate;
