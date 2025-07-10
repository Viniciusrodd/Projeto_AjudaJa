
// css
import '../../../utils/FormsCss/FormsUtil.css';

// hooks
import { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOfferData } from '../../../hooks/OffersFetch/useOfferData'; // custom hook

// context
import { LoadingContext } from '../../../context/loadingContext';

// components
import SideBar from '../../../components/SideBar/SideBar';
import Modal from '../../../components/Modal';

// services
import { updateOffer } from '../../../services/OfferHelpServices';


const EditOffers = () => {
    // state
    const [ description, setDescription ] = useState('');
    const [ redirect, setRedirect ] = useState(false);

    // modal
    const [ modal_display, setModal_display ] = useState(false);
    const [ modal_title, setModal_title ] = useState(null);
    const [ modal_msg, setModal_msg ] = useState(null);
    const [ modal_btt, setmodal_btt ] = useState(false);
    const [ modal_btt_2, setModal_btt_2 ] = useState(false);
    const [ title_color, setTitle_color ] = useState('#000');

    // consts
    const { offerID } = useParams();
    const navigate = useNavigate();

    // context
    const { loading } = useContext(LoadingContext);


    ////////////// functions    

    // scroll top at beginning
    useEffect(() =>{
        window.scrollTo(0, 0);
    }, []);    

    // redirect user to my offers page
    useEffect(() => {
        if(redirect === true){   
            const clearMessage = setTimeout(() => {
                modal_config({
                    title1: null, msg: null, btt1: false, 
                    btt2: false, display: false, title_color: '#000'
                });

                navigate('/minhasOfertasDeAjuda');
            }, 3000);
            
            return () => {
                clearTimeout(clearMessage);
            };
        }
    }, [redirect]); 

    // get offer data by id
    const { offerDataById } = useOfferData(null, offerID);
    useEffect(() =>{
        if(offerDataById){
            setDescription(offerDataById.description);
        }
    }, [offerDataById]);

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

    // handle form
    const editForm = async (e) =>{
        e.preventDefault();

        try{
            const response = await updateOffer({ description }, offerID);
            
            if(response.status === 200){
                modal_config({
                    title: 'Sucesso',
                    msg: `Oferta de ajuda Atualizada! \n 
                    você será redirecionado para suas ofertas de ajuda...`,
                    btt1: false, btt2: false,
                    display: 'flex', title_color: 'rgb(38, 255, 0)'
                });
                setRedirect(true);
            }
        }
        catch(error){
            console.log('Error at update offer: ', error);
            if(error){
                modal_config({
                    title: 'Erro',
                    msg: `Erro ao editar oferta de ajuda...`,
                    btt1: false, btt2: 'Tentar novamente',
                    display: 'flex', title_color: 'rgb(255, 0, 0)'
                });
            }
        }
    }


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
                    <h1 className='title is-1'>Edite sua oferta de ajuda</h1>
                    {
                        loading && (
                            <div className='loading-container'>
                                <p>Carregando...</p>
                            </div>
                        )
                    }                    
                    <hr className='hr'/>

                    <div className={`control textarea_container`}>
                        <label className="label title is-5" id="label">Descrição de ajuda: </label>
                        <textarea className="textarea is-hovered" name='description' style={{ height:'20vh' }}
                        value={ description } onChange={(e) => setDescription(e.target.value)}>
                                                
                        </textarea>
                    </div>

                    <hr className='hr'/>
                    <button className="button is-primary is-dark">
                        Editar ajuda
                    </button>          
                </form>
            </div>
        </div>
    );
};

export default EditOffers;
