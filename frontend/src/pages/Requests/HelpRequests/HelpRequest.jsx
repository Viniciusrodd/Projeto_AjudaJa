
// css
import '../../../utils/FormsCss/FormsUtil.css';
import '../../../utils/FeedsCss/expiresAtUtil.css'

// sidebar
import SideBar from '../../../components/SideBar/SideBar';

// hooks
import { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// services
import { postRequest } from '../../../services/RequestHelpServices';

// context
import { UserContext } from '../../../context/UserContext';

const HelpRequest = () => {
    // states
    const [ userFields, setUserFields ] = useState({
        title: '', description: '', category: 'livre', urgency: 'baixa', latitude: 0, longitude: 0
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
    const { userId } = useContext(UserContext);
    const navigate = useNavigate();
    

    ////////////// functions

    // scroll top at beginning
    useEffect(() =>{
        window.scrollTo(0, 0);
    }, []);    

    // redirect
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

    // get user location + advice
    useEffect(() =>{
        modal_config({
            title: 'Espere',
            msg: `
            Usamos sua localização para\n complementar seu pedido !!!\n
            FIQUE TRANQUILO/A\n
            isso torna a ajuda ainda mais fácil,\n uma vez que sabemos ONDE ajudar...`,
            btt1: false, btt2: false,
            display: 'flex', title_color: 'rgb(0, 136, 255)'
        });
        
        const clearModal = setTimeout(() =>{
            modal_config({
                title1: null, msg: null, btt1: false, 
                btt2: false, display: false, title_color: '#000'
            });

            // get navigation location
            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition((position) =>{
                    setUserFields(prev =>({ ...prev, latitude: position.coords.latitude, longitude: position.coords.longitude }));
                },(error) =>{
                    console.error('Erro ao obter geolocalização de usuário...', error);
                },{
                    enableHighAccuracy: true, // forcing high precision
                    timeout: 5000,
                    maximumAge: 0
                });
            }else{
                console.warn("Geolocalização não suportada neste navegador.")
            }
        }, 6000);

        return () =>{
            clearTimeout(clearModal);
        };
    }, []);    

    // handle form
    const handleForm = async (e) =>{
        e.preventDefault();

        try{
            const response = await postRequest(userFields, userId);

            if(response.status === 200){
                modal_config({
                    title: 'Sucesso',
                    msg: `Pedido de ajuda postado! \n 
                    você será redirecionado para seus pedidos de ajuda...`,
                    btt1: false, btt2: false,
                    display: 'flex', title_color: 'rgb(38, 255, 0)'
                });
                setRedirect(true);
            }
        }
        catch(error){
            console.log('Error at create a help request: ', error);

            modal_config({
                title: 'Erro',
                msg: `Erro ao criar pedido de ajuda...`,
                btt1: false, btt2: 'Tentar novamente',
                display: 'flex', title_color: 'rgb(255, 0, 0)'
            });
        }
    };
    
    
    ////////////// jsx


    return (
        <div className='forms_container'>
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

            { /* sidebar */ }
            <SideBar />

            { /* formulário */ }
            <div className='form'>
                <form onSubmit={ handleForm } className='user_panel_container'>
                    <h1 className='title is-1'>Pedido de ajuda</h1>

                    <hr className='hr'/>
                    <h4 className="subtitle is-4">Por favor, preencha: </h4>

                    <div className='container_input'>
                        <label className="label title is-5" id="label">Titulo: </label>
                        <input className="input is-hovered" name='title' type="text" required 
                        placeholder='Ex: "Preciso de ajuda com material escolar"' style={{ width:'80%' }}
                        value={ userFields.title } onChange={ (e) => setUserFields({...userFields, title: e.target.value}) }/>
                    </div>

                    <div className={`control textarea_container`}>
                        <label className="label title is-5" id="label">Descrição: </label>
                        <textarea className="textarea is-hovered" name='description'
                        placeholder='Descreva sua situação com mais detalhes. Ex: Estou desempregado, com duas crianças pequenas, e preciso de alimentos básicos como arroz, feijão e leite. Qualquer ajuda será bem-vinda.'
                        value={ userFields.description } onChange={ (e) => setUserFields({...userFields, description: e.target.value}) }>
                                                
                        </textarea>
                    </div>

                    <div className='container_input'>
                        <label className="label title is-5" id="label">Categoria: </label>
                        <div className="select is-hovered" style={{ width:'70%' }}>
                            {/* default: livre */}
                            <select style={{ width:'100%' }} name='category'
                            value={ userFields.category } onChange={ (e) => setUserFields({...userFields, category: e.target.value}) }>
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
                            value={ userFields.urgency } onChange={ (e) => setUserFields({...userFields, urgency: e.target.value}) }>
                                <option value="baixa">Baixa</option>
                                <option value="media">Média</option>
                                <option value="alta">Alta</option>
                            </select>
                        </div>
                    </div>                    

                    <hr className='hr'/>

                    <button className="button is-primary is-dark">
                        Publicar
                    </button>
                </form>
            </div>

            <div className='expiresAt_container'>
                <h1 className='h1_expires'>Expiração de pedido: </h1>
                <h2 className='h2_expires'>Urgência Alta: <strong>2 dias</strong></h2>
                <h2 className='h2_expires'>Urgência Média: <strong>5 dias</strong></h2>
                <h2 className='h2_expires'>Urgência Baixa: <strong>10 dias</strong></h2>
            </div>
        </div>
    );
};

export default HelpRequest;
