
// css
import styles from './HelpRequest.module.css';

// account details css
import stylesAccountDetails from '../AccountDetails/AccountDetail.module.css';

// sidebar
import SideBar from '../../components/SideBar/SideBar';

// hooks
import { useState, useRef, useEffect } from 'react';


const HelpRequest = () => {
    // states
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    // refs
    const modal = useRef(null);
    const modal_title = useRef(null);
    const modal_msg = useRef(null);
    const modal_btt = useRef(null);
    const modal_btt_2 = useRef(null);


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
            modal.current.style.display = 'none';

            // get navigation location
            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition((position) =>{
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                },
                (error) =>{
                    console.error('Erro ao obter geolocalização de usuário...', error);
                });
            }else{
                console.warn("Geolocalização não suportada neste navegador.")
            }
        }, 7000);

        return () =>{
            clearTimeout(clearModal);
        };
    }, []);


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
                <form className={ stylesAccountDetails.user_panel_container }>
                    <h1 className='title is-1'>Pedido de ajuda</h1>


                    <hr className='hr'/>
                    <h1 className="subtitle is-4">Por favor, preencha: </h1>

                    <div className={ stylesAccountDetails.container_input }>
                        <label className="label title is-5" id="label">Titulo: </label>
                        <input className="input is-hovered" name='title' type="text" required 
                        placeholder='Ex: "Preciso de ajuda com material escolar"' style={{ width:'80%' }}/>
                    </div>

                    <div className={`control ${stylesAccountDetails.textarea_container}`}>
                        <label className="label title is-5" id="label">Descrição: </label>
                        <textarea className="textarea is-hovered" name='description'
                        placeholder='Descreva sua situação com mais detalhes. Ex: Estou desempregado, com duas crianças pequenas, e preciso de alimentos básicos como arroz, feijão e leite. Qualquer ajuda será bem-vinda.'>
                        
                        </textarea>
                    </div>

                    <div className={ stylesAccountDetails.container_input }>
                        <label className="label title is-5" id="label">Categoria: </label>
                        <div className="select is-hovered" style={{ width:'70%' }}>
                            <select style={{ width:'100%' }} name='category'> {/* default: livre */}
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
                            <select style={{ width:'100%' }} name='urgency'>
                                <option value="alta">Alta</option>
                                <option value="media">Média</option>
                                <option value="baixa">Baixa</option>
                            </select>
                        </div>
                    </div>                    

                    <div className={ stylesAccountDetails.container_input }>
                        <label className="label title is-5" id="label">Status: </label>
                        <div className="select is-hovered" style={{ width:'70%' }}>
                            <select style={{ width:'100%' }} name='status'> {/* default: aberto */}
                                <option value="aberto">Aberto</option>
                                <option value="fechado">Fechado</option>
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
                <h2 className={ styles.h2_expires }>Urgência Alta: <ins>2 dias</ins></h2>
                <h2 className={ styles.h2_expires }>Urgência Média: <ins>5 dias</ins></h2>
                <h2 className={ styles.h2_expires }>Urgência Baixa: <ins>10 dias</ins></h2>
            </div>
        </div>
    );
};

export default HelpRequest;
