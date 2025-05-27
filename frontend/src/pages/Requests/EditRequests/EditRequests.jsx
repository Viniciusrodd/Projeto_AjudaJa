
// css
import styles from './EditRequests.module.css';
import stylesAccountDetail from '../../Users/AccountDetails/AccountDetail.module.css';
import stylesHelpRequest from '../../Requests/HelpRequests/HelpRequest.module.css'; 

// hooks
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRequestData } from '../../../hooks/RequestsFetch/useRequestData'; // custom hook

// components
import SideBar from '../../../components/SideBar/SideBar';

//services
import { updateRequest } from '../../../services/RequestHelpServices';


const EditRequests = () => {
    // states
    const [ data_fields, setData_fields ] = useState({
        title: '', description: '', category: '', urgency: 'baixa', status: 'aberto'
    });
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


    // handle update fórm
    const handleForm = async (e) =>{
        e.preventDefault();

        try{
            const response = await updateRequest(data_fields, requestID);
            
            if(response.status === 200){
                modal.current.style.display = 'flex';
                modal_title.current.innerText = 'Sucesso!!!'
                modal_msg.current.innerText = `Pedido de ajuda Atualizado! \n 
                você será redirecionado para a página principal...`;
                modal_btt.current.style.display = 'none';
                modal_btt_2.current.style.display = 'none';

                setRedirect(true);
            }
        }
        catch(error){
            console.log('Error at update request post: ', error);
            if(error){
                modal.current.style.display = 'flex';
                modal_msg.current.innerText = 'Erro ao editar pedido de ajuda...'
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
            

            { /* SIDEBAR */ }
            <SideBar />


            { /* Formulário */}
            <div className={ stylesAccountDetail.form_container }>
            <form onSubmit={ handleForm } className={ stylesAccountDetail.user_panel_container }>
                <h1 className='title is-1'>Edite seu pedido de ajuda</h1>
                <hr className='hr'/>

                <div className={ stylesAccountDetail.container_input }>
                    <label className="label title is-5" id="label">Titulo: </label>
                    <input className="input is-hovered" name='title' type="text" value={ data_fields.title }
                    onChange={ (e) => setData_fields({...data_fields, title: e.target.value}) } required />
                </div>

                <div className={`control ${stylesAccountDetail.textarea_container}`}>
                    <label className="label title is-5" id="label">Descrição: </label>
                    <textarea className="textarea is-hovered" name='description'
                    value={ data_fields.description } onChange={ (e) => setData_fields({...data_fields, description: e.target.value}) }>
                                            
                    </textarea>
                </div>
                
                <div className={ stylesAccountDetail.container_input }>
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

                <div className={ stylesAccountDetail.container_input }>
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

                <div className={ stylesAccountDetail.container_input }>
                    <label className="label title is-5" id="label">Status: </label>
                    <div className="select is-hovered" style={{ width:'70%' }}>
                        <select style={{ width:'100%' }} name='status'
                        value={ data_fields.status } onChange={ (e) => setData_fields({...data_fields, status: e.target.value}) }>
                            <option value="aberto">Aberto</option>
                            <option value="fechado">Fechado</option>
                        </select>
                    </div>
                </div>

                <hr className='hr'/>
                <button className="button is-primary is-dark">
                    Editar
                </button>
            </form>
            </div>

            <div className={ stylesHelpRequest.expiresAt_container }>
                <h1 className={ stylesHelpRequest.h1_expires }>Expiração de pedido: </h1>
                <h2 className={ stylesHelpRequest.h2_expires }>Urgência Alta: <strong>2 dias</strong></h2>
                <h2 className={ stylesHelpRequest.h2_expires }>Urgência Média: <strong>5 dias</strong></h2>
                <h2 className={ stylesHelpRequest.h2_expires }>Urgência Baixa: <strong>10 dias</strong></h2>
            </div>
        </div>
    );
};

export default EditRequests;
