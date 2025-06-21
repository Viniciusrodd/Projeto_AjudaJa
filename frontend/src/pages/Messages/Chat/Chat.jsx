
// css
import './Chat.css';
import '../../../utils/FeedsCss/FeedsUtil.css';

// hooks
import { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useUserdata } from '../../../hooks/UserFetch/useUserdata'; // custom hook

// components
import SideBar from '../../../components/SideBar/SideBar';


const Chat = () => {
// states
    const [ userFields, setUserFields ] = useState({
        id: '', name:''
    });
    const [ imageField, setImageField ] = useState({ image_data: null, content_type: '' });

    // consts
    const { userId } = useParams();
    const divImageRef = useRef(null);
    const divImageRef2 = useRef(null);

    // modal
    const [ modal_display, setModal_display ] = useState(false);
    const [ modal_title, setModal_title ] = useState(null);
    const [ modal_msg, setModal_msg ] = useState(null);
    const [ modal_btt, setmodal_btt ] = useState(false);
    const [ modal_btt_2, setModal_btt_2 ] = useState(false);
    const [ title_color, setTitle_color ] = useState('#000');
    
    
    ////////////// functions


    // scroll top at beginning
    useEffect(() =>{
        window.scrollTo(0, 0);
    }, []);    

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


    const { userData, userImage, errorRes } = useUserdata(userId);
    useEffect(() =>{
        if(userData){            
            setUserFields({ ...userFields, 
                id: userData.id || '',
                name: userData.name || ''
            });
        }
        
        if(!userImage) return;

        setImageField({ ...imageField,
            image_data: userImage.image_data,
            content_type: userImage.content_type,
        });

        if(errorRes){
            console.log('Error at findUser in Chat: ', errorRes);
        }
    }, [userData, userImage, errorRes]);

    // defining profile background image
    useEffect(() => {
        if (!divImageRef.current) return;

        if (imageField.image_data) {
            divImageRef.current.style.backgroundImage = `url(data:${imageField.content_type};base64,${imageField.image_data})`;
            divImageRef2.current.style.backgroundImage = `url(data:${imageField.content_type};base64,${imageField.image_data})`;
        } else {
            divImageRef.current.style.backgroundImage = `url('../../../images/user.jpg')`;
            divImageRef2.current.style.backgroundImage = `url('../../../images/user.jpg')`;
        }

        divImageRef.current.style.backgroundSize = "cover";
        divImageRef.current.style.backgroundRepeat = "no-repeat";
        divImageRef.current.style.backgroundPosition = "center";
        
        divImageRef2.current.style.backgroundSize = "cover";
        divImageRef2.current.style.backgroundRepeat = "no-repeat";
        divImageRef2.current.style.backgroundPosition = "center";
    }, [imageField]);


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
                        <p className='modal-card-title has-text-centered' 
                        style={{ textAlign:'center' }}>
                            {modal_msg?.split('\n').map((line, idx) => (
                                <span className='modal_span' key={idx}>
                                    {line}
                                    <br />
                                </span>
                            ))}
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


            { /* SIDEBAR */ }
            <SideBar />


            <div className='container_feed_2'>

                <div className='chat'>
                    <div className='header_image'>
                    <header>
                            <div ref={ divImageRef } className='user_image' style={{
                                height:'80px', width:'80px' 
                            }} ></div>
                            <h1 className='title is-4' style={{ textShadow: '0px 3px 4px rgba(0, 0, 0, 1)' }}>
                                { userFields.name }
                            </h1>
                    </header>
                    </div>

                    <div className='chat_body'>
                        <div className='message_sender'>
                            <div className='message'>
                                <p>messagem de quem envia</p>
                            </div>
                        </div>
                        <div className='message_receive'>
                            <div ref={ divImageRef2 }  className='receive_user_img'>

                            </div>
                            <div className='message'>
                                <p>messagem de quem recebe</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className='footer_image'>
                    <footer>
                        <input type="text" placeholder='Mensagem...' className="input is-rounded" />
                        <button className='button is-rounded'>
                            Enviar
                        </button>
                    </footer>
                    </div>
                </div>
            </div>            
        </div>
    );
};

export default Chat;
