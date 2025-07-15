
// styles
import '../../../utils/FormsCss/FormsUtil.css';
import '../../../utils/FormsCss/FormsUtilMobile.css';

// hooks
import { useRef, useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 

// components
import SideBar from '../../../components/SideBar/SideBar';
import Modal from '../../../components/Modal';

// services
import { postOffer } from '../../../services/OfferHelpServices';

// custom hooks
import { useTokenVerify } from '../../../hooks/UserMiddleware/useTokenVerify';

// context
import { LoadingContext } from '../../../context/loadingContext';
import { MenuContext } from '../../../context/menuContext';


const OfferRequest = () => {
    // states
    const [ description, setDescription ] = useState('');
    const [ redirect, setRedirect ] = useState(false);
    const [ userID, setUserID ] = useState(0);

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

    // get user data
    const { userData, errorRes } = useTokenVerify();
    useEffect(() =>{
        if(userData){
            setUserID(userData.id);
        }
        
        if(errorRes){
            console.log('Error in fetchToken at navbar component: ', errorRes);
        }  
    }, [userData, errorRes]);

    // redirect user to homepage
    useEffect(() => {
        if(redirect === true){   
            const clearMessage = setTimeout(() => {
                modal_config({
                    title1: null, msg: null, btt1: false, 
                    btt2: false, display: false, title_color: '#000'
                });

                navigate('/');
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

    // handle offer
    const handleForm = async (e) =>{
        e.preventDefault();

        try{
            const response = await postOffer({ description }, userID, requestID);

            if(response.status === 200){
                modal_config({
                    title: 'Sucesso',
                    msg: `Oferta de ajuda enviada! \n
                    você será redirecionado para a página principal...`,
                    btt1: false, btt2: false,
                    display: 'flex', title_color: 'rgb(38, 255, 0)'
                });
                setRedirect(true);
            }
        }
        catch(error){
            console.log('Error at handle offer form...', error);
            if(error){
                modal_config({
                    title: 'Erro',
                    msg: `Erro ao enviar oferta de ajuda...`,
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


            { /* sidebar */ }
            <SideBar />


            { /* page */ }
            <div className='form' style={{ width: menu ? '95vw' : '75vw' }}>
                <form onSubmit={ handleForm } className='user_panel_container'>
                    <h1 className='title is-1'>Ofereça ajuda</h1>
                    {
                        loading && (
                            <div className='loading-container'>
                                <p>Carregando...</p>
                            </div>
                        )
                    }
                    <hr className='hr_formsUtil'/>

                    <div className={`control textarea_container`}>
                        <label className="label title is-5" id="label">Descrição de ajuda: </label>
                        <textarea className="textarea is-hovered" name='description' style={{ height:'20vh' }}
                        value={ description } onChange={(e) => setDescription(e.target.value)}
                        placeholder='Descreva de forma detalhada como você pode ajudar nesta categoria. Ex: Tenho roupas em bom estado para doar, posso oferecer transporte até hospitais, dar aulas de reforço, ou ajudar com cuidados de animais. Qualquer contribuição será bem-vinda!'>
                                                
                        </textarea>
                    </div>

                    <hr className='hr_formsUtil'/>
                    <button className="button is-primary is-dark">
                        Ajudar
                    </button>          
                </form>
            </div>
        </div>
    );
};

export default OfferRequest;
