
// css
import styles from './HelpRequest.module.css';

// account details css
import stylesAccountDetails from '../AccountDetails/AccountDetail.module.css';

// sidebar
import SideBar from '../../components/SideBar/SideBar';

// hooks
import { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// services
import { postRequest } from '../../services/RequestHelpServices';

// context
import { UserContext } from '../../context/UserContext';

const HelpRequest = () => {
    // context
    const { userId } = useContext(UserContext);

    // states
    const [ userFields, setUserFields ] = useState({
        title: '', description: '', category: 'livre', urgency: 'baixa', latitude: 0, longitude: 0
    });
    const [ redirect, setRedirect ] = useState(false);
    const navigate = useNavigate();

    // refs
    const modal = useRef(null);
    const modal_title = useRef(null);
    const modal_msg = useRef(null);
    const modal_btt = useRef(null);
    const modal_btt_2 = useRef(null);


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


    // get user location + advice
    useEffect(() =>{
        // modal message
        modal.current.style.display = 'flex';
        modal_title.current.innerText = 'Lembrete...'
        modal_msg.current.innerText = `
        Usamos sua localização para\n complementar seu pedido !!!\n
        FIQUE TRANQUILO\n
        isso torna a ajuda ainda mais fácil,\n uma vez que sabemos ONDE ajudar...`;
        modal_btt.current.style.display = 'none';
        modal_btt_2.current.style.display = 'none';

        
        const clearModal = setTimeout(() =>{
            modal_btt.current.style.display = 'flex';
            modal_btt_2.current.style.display = 'flex';    
            modal.current.style.display = 'none';

            // get navigation location
            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition((position) =>
                {
                    setUserFields(prev =>({ ...prev, latitude: position.coords.latitude, longitude: position.coords.longitude }));
                },
                (error) =>{
                    console.error('Erro ao obter geolocalização de usuário...', error);
                },
                {
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
                modal.current.style.display = 'flex';
                modal_title.current.innerText = 'Sucesso!!!'
                modal_msg.current.innerText = `Pedido de ajuda postado! \n 
                você será redirecionado para a página principal...`;
                modal_btt.current.style.display = 'none';
                modal_btt_2.current.style.display = 'none';

                setRedirect(true);
            }
        }
        catch(error){
            console.log('Error at create a help request: ', error);

            modal.current.style.display = 'flex';
            modal_title.current.innerText = 'Erro'
            modal_msg.current.innerText = 'Erro ao criar pedido de ajuda...'

            modal_btt.current.innerText = 'Tentar novamente'
            modal_btt_2.current.style.display = 'none';

            modal_btt.current.onclick = () => {
                modal.current.style.display = 'none';
            }; 
        }
    }; 


    return (
        <div className={ stylesAccountDetails.accountDetail_container }>
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

            { /* formulário */ }
            <div className={ stylesAccountDetails.form_container }>
                <form onSubmit={ handleForm } className={ stylesAccountDetails.user_panel_container }>
                    <h1 className='title is-1'>Pedido de ajuda</h1>

                    <hr className='hr'/>
                    <h1 className="subtitle is-4">Por favor, preencha: </h1>

                    <div className={ stylesAccountDetails.container_input }>
                        <label className="label title is-5" id="label">Titulo: </label>
                        <input className="input is-hovered" name='title' type="text" required 
                        placeholder='Ex: "Preciso de ajuda com material escolar"' style={{ width:'80%' }}
                        value={ userFields.title } onChange={ (e) => setUserFields({...userFields, title: e.target.value}) }/>
                    </div>

                    <div className={`control ${stylesAccountDetails.textarea_container}`}>
                        <label className="label title is-5" id="label">Descrição: </label>
                        <textarea className="textarea is-hovered" name='description'
                        placeholder='Descreva sua situação com mais detalhes. Ex: Estou desempregado, com duas crianças pequenas, e preciso de alimentos básicos como arroz, feijão e leite. Qualquer ajuda será bem-vinda.'
                        value={ userFields.description } onChange={ (e) => setUserFields({...userFields, description: e.target.value}) }>
                                                
                        </textarea>
                    </div>

                    <div className={ stylesAccountDetails.container_input }>
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

                    <div className={ stylesAccountDetails.container_input }>
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

            <div className={ styles.expiresAt_container }>
                <h1 className={ styles.h1_expires }>Expiração de pedido: </h1>
                <h2 className={ styles.h2_expires }>Urgência Alta: <strong>2 dias</strong></h2>
                <h2 className={ styles.h2_expires }>Urgência Média: <strong>5 dias</strong></h2>
                <h2 className={ styles.h2_expires }>Urgência Baixa: <strong>10 dias</strong></h2>
            </div>
        </div>
    );
};

export default HelpRequest;
