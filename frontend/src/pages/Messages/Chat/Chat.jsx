
// css
import './Chat.css';
import '../../../utils/FeedsCss/FeedsUtil.css';

// hooks
import { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useUserdata } from '../../../hooks/UserFetch/useUserdata'; // custom hook

// components
import SideBar from '../../../components/SideBar/SideBar';
import Modal from '../../../components/Modal';

// services
import socket from '../../../services/socket';

// context
import { useTokenVerify } from '../../../hooks/UserMiddleware/useTokenVerify';

// libs
import axios from 'axios';


const Chat = () => {
    // states
    const [ userFields, setUserFields ] = useState({
        id: '', name:''
    });
    const [ imageField, setImageField ] = useState({ image_data: null, content_type: '' });
    const [ messages, setMessages ] = useState([]);
    const [ messageText, setMessageText ] = useState('');

    // consts
    const { userId } = useParams();
    const divImageRef = useRef(null);
    const messagesEndRef = useRef(null);

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

    // get user destiny data + image
    const { userData, userImage, errorRes } = useUserdata(userId);
    useEffect(() =>{
        if(userData){            
            setUserFields({ ...userFields, 
                id: userData.id || '',
                name: userData.name || ''
            });
        }
        
        if(userImage){
            setImageField({ ...imageField,
                image_data: userImage.image_data,
                content_type: userImage.content_type,
            });
        }

        if(errorRes){
            console.log('Error at findUser in Chat: ', errorRes);
        }
    }, [userData, userImage, errorRes]);

    // defining profile background image
    useEffect(() => {
        if(divImageRef.current){
            divImageRef.current.style.backgroundImage = `url(data:${imageField.content_type};base64,${imageField.image_data})`;
            divImageRef.current.style.backgroundSize = "cover";
            divImageRef.current.style.backgroundRepeat = "no-repeat";
            divImageRef.current.style.backgroundPosition = "center";
        }

    }, [imageField]);

    // get user logged data
    const { userData: userDataLogged  } = useTokenVerify();


    // socket io functions


    // join in private room (socket io)
    useEffect(() =>{
        if(userDataLogged?.id){
            socket.emit('join', userDataLogged.id)
        }
    }, [userDataLogged]);

    // send messages
    const sendMessage = (e) =>{
        e.preventDefault();

        const data = {
            from: userDataLogged.id,
            to: userId,
            content: messageText
        };

        socket.emit('private-message', data);
        setMessages((prev) => [...prev, data]);
        setMessageText('');
    };

    // receive messages
    useEffect(() =>{
        socket.on('private-message', (msg) =>{
            if(msg.to === userDataLogged.id || msg.from === userDataLogged.id){
                setMessages((prev) => [...prev, msg]);
            }
        });

        return () => socket.off('private-message')
    }, [userDataLogged]);


    // historical messages
    useEffect(() =>{
        if(userId){
            const getMessagesHistoric = async () =>{
                try{
                    const response = await axios.get(`http://localhost:2130/messages/${userId}`, { withCredentials: true });
                    setMessages(response.data.messages);
                }
                catch(error){
                    console.error("Error at searching historic messages:", error);
                    modal_config({
                        title: 'Erro',
                        msg: `Erro ao recuperar histórico de mensagens...`,
                        btt1: false, btt2: false,
                        display: 'flex', title_color: 'rgb(255, 0, 0)'
                    });
                    setTimeout(() => {
                        modal_config({
                            title: null, msg: null, btt1: false, 
                            btt2: false, display: false, title_color: '#000'
                        });
                    }, 3000);
                }
            };
            getMessagesHistoric();
        }
    }, [userId]);

    // scroll to last message
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);


    /*
    useEffect(() =>{
        if(messages.length > 0){
            console.log(messages);
        }
    }, [messages]);
    */


    ////////////// jsx


    return (
        <div className='container_campaigns' style={{ paddingBottom:'25px' }}>
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
                        {
                            messages?.map((msg, index) => {
                                const isSender = msg.from === userDataLogged?.id;

                                return(
                                    <div key={index} className={isSender ? 'message_sender' : 'message_receive'}>
                                        {!isSender && (
                                            <div className='receive_user_img'
                                            style={{
                                                backgroundImage: `url(data:${imageField.content_type};base64,${imageField.image_data})`,
                                                backgroundSize: 'cover',
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'center'
                                            }}></div>
                                        )}
                                        <div className='message'>
                                            <div className='message_date_time'>
                                                <p>
                                                    { msg.timestamp?.split('T')[0] }
                                                </p>
                                                <p>
                                                    { msg.timestamp &&
                                                        new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                    }
                                                </p>
                                            </div>
                                            <hr />
                                            <p>{ msg.content }</p>
                                        </div>
                                    </div>
                                )
                            })
                        }

                        {/* Referência para scroll automático */}
                        <div ref={messagesEndRef}></div>
                    </div>
                    
                    <div className='footer_image'>
                    <form onSubmit={ sendMessage }>
                        <input type="text" placeholder='Mensagem...' className="input is-rounded"
                        value={ messageText } onChange={(e) => setMessageText(e.target.value)} />
                        <button className='button is-rounded'>
                            Enviar
                        </button>
                    </form>
                    </div>
                </div>
            </div>            
        </div>
    );
};

export default Chat;
