
// css
import '../../../utils/FormsCss/FormsUtil.css';
import '../../../utils/FormsCss/FormsUtilMobile.css';
import '../../../utils/FeedsCss/expiresAtUtil.css'

// hooks
import { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRequestData } from '../../../hooks/RequestsFetch/useRequestData'; // custom hook

// context
import { LoadingContext } from '../../../context/loadingContext';
import { MenuContext } from '../../../context/menuContext';

// components
import SideBar from '../../../components/SideBar/SideBar';
import Modal from '../../../components/Modal';

//services
import { updateRequest } from '../../../services/RequestHelpServices';


const EditRequests = () => {
    // states
    const [ data_fields, setData_fields ] = useState({
        title: '', description: '', category: '', urgency: 'baixa', status: 'aberto'
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
    const { requestID } = useParams();
    const navigate = useNavigate();

    // context
    const { loading } = useContext(LoadingContext);
    const { menu } = useContext(MenuContext);


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

                navigate('/meusPedidosDeAjuda');
            }, 3000);
            
            return () => {
                clearTimeout(clearMessage);
            };
        }
    }, [redirect]); 
    
    // get requests data
    const { requestDataById } = useRequestData(requestID);
    useEffect(() =>{
        if(requestDataById){
            setData_fields({...data_fields, 
                title: requestDataById.title || '',
                description: requestDataById.description || '',
                category: requestDataById.category || '',
                urgency: requestDataById.urgency || '',
                status: requestDataById.status || ''
            });
        }
    }, [requestDataById]);

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

    // handle update fórm
    const handleForm = async (e) =>{
        e.preventDefault();

        try{
            const response = await updateRequest(data_fields, requestID);
            
            if(response.status === 200){
                modal_config({
                    title: 'Sucesso',
                    msg: `Pedido de ajuda Atualizado! \n 
                    você será redirecionado para os seus pedidos de ajuda...`,
                    btt1: false, btt2: false,
                    display: 'flex', title_color: 'rgb(38, 255, 0)'
                });        
                setRedirect(true);
            }
        }
        catch(error){
            console.log('Error at update request post: ', error);
            if(error){
                modal_config({
                    title: 'Erro',
                    msg: `Erro ao editar pedido de ajuda...`,
                    btt1: false, btt2: 'Tentar novamente',
                    display: 'flex', title_color: 'rgb(255, 0, 0)'
                });
            }
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
            <div className='form' style={{ width: menu ? '95vw' : '75vw' }}>

            <form onSubmit={ handleForm } className='user_panel_container'>
                <h2 className='title is-2'>Edite seu pedido de ajuda</h2>
                {
                    loading && (
                        <div className='loading-container'>
                            <p>Carregando...</p>
                        </div>
                    )
                }
                <hr className='hr_formsUtil'/>
                

                <div className='container_input'>
                    <label className="label title is-5" id="label">Titulo: </label>
                    <input className="input is-hovered" name='title' type="text" value={ data_fields.title }
                    onChange={ (e) => setData_fields({...data_fields, title: e.target.value}) } required />
                </div>

                <div className={`control textarea_container`}>
                    <label className="label title is-5" id="label">Descrição: </label>
                    <textarea className="textarea is-hovered" name='description'
                    value={ data_fields.description } onChange={ (e) => setData_fields({...data_fields, description: e.target.value}) }>
                                            
                    </textarea>
                </div>
                
                <div className='container_input'>
                    <label className="label title is-5" id="label">Categoria: </label>
                    <div className="select is-hovered" style={{ width:'70%' }}>
                        {/* default: livre */}
                        <select style={{ width:'100%' }} name='category'
                        value={ data_fields.category } onChange={ (e) => setData_fields({...data_fields, category: e.target.value}) }>
                            <option value="livre">Livre</option>
                            <option value="alimentos">Alimentos</option>
                            <option value="roupas_calçados">Roupas e Calçados</option>
                            <option value="transporte">Transporte</option>
                            <option value="serviços_gerais">Serviços Gerais</option>
                            <option value="apoio_emocional">Apoio Emocional</option>
                            <option value="moradia_abrigo">Moradia / Abrigo</option>
                            <option value="educação">Educação</option>
                            <option value="trabalho_renda">Trabalho e Renda</option>
                            <option value="saúde_remédios">Saúde e Remédios</option>
                            <option value="animais">Animais</option>
                            <option value="tecnologia">Tecnologia</option>
                        </select>
                    </div>                    
                </div>

                <div className='container_input'>
                    <label className="label title is-5" id="label">Urgencia: </label>
                    <div className="select is-hovered" style={{ width:'70%' }}>
                        <select style={{ width:'100%' }} name='urgency'
                        value={ data_fields.urgency } onChange={ (e) => setData_fields({...data_fields, urgency: e.target.value}) }>
                            <option value="baixa">Baixa</option>
                            <option value="media">Média</option>
                            <option value="alta">Alta</option>
                        </select>
                    </div>
                </div>                    

                <div className='container_input'>
                    <label className="label title is-5" id="label">Status: </label>
                    <div className="select is-hovered" style={{ width:'70%' }}>
                        <select style={{ width:'100%' }} name='status'
                        value={ data_fields.status } onChange={ (e) => setData_fields({...data_fields, status: e.target.value}) }>
                            <option value="aberto">Aberto</option>
                            <option value="fechado">Fechado</option>
                        </select>
                    </div>
                </div>

                <hr className='hr_formsUtil'/>
                <button className="button is-primary is-dark">
                    Editar
                </button>
            </form>
            </div>

            <div className='expiresAt_container' style={{ marginLeft: menu ? '46%' : '' }}>
                <h1 className='h1_expires'>Expiração de pedido: </h1>
                <h2 className='h2_expires'>Urgência Alta: <strong>2 dias</strong></h2>
                <h2 className='h2_expires'>Urgência Média: <strong>5 dias</strong></h2>
                <h2 className='h2_expires'>Urgência Baixa: <strong>10 dias</strong></h2>
            </div>
        </div>
    );
};

export default EditRequests;
