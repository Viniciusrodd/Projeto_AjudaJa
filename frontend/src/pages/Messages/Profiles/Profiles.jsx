
// css
import '../../../utils/FeedsCss/FeedsUtil.css';
import './Profiles.css';

// hooks
import { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserdata } from '../../../hooks/UserFetch/useUserdata'; // custom hook
import { useTokenVerify } from '../../../hooks/UserMiddleware/useTokenVerify'; // custom hook

// components
import SideBar from '../../../components/SideBar/SideBar';
import Modal from '../../../components/Modal';

// libs
import axios from 'axios';

// services
import socket from '../../../services/socket';
import { findNotifications, deleteNotification } from '../../../services/MessagesService';


const Profiles = () => {
    // states
    const [ profiles, setProfiles ] = useState(null)
    const [ search, setSearch ] = useState('');
    const [ isSearching, setIsSearching ] = useState(false);
    const [ searchedData, setSearchedData ] = useState(null);
    const [ noProfiles, setNoProfiles ] = useState(false);
    const [ noProfileFound, setNoProfileFound ] = useState(false);
    const [ notificationList, setNotificationList ] = useState([]);
    const [ messagesQuantity, setMessagesQuantity ] = useState();

    // consts
    const select_options = useRef(null);
    const navigate = useNavigate();

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

    // get profiles data
    const { allUsersData, setAllUsersData } = useUserdata();
    useEffect(() =>{
        if(allUsersData && allUsersData.length === 0){
            setNoProfiles('Perfis não encontrados...');
        }
    }, [allUsersData, setAllUsersData]);

    // search form
    const search_form = async (e) =>{
        e.preventDefault();

        if(search.trim() === ''){
            setSearchedData(null);
            return;
        }

        try{
            const response = await axios.get(`http://localhost:2130/user/search/${search}`, { withCredentials: true });

            if(response.data.combined_data?.length > 0){
                setSearchedData(response.data.combined_data);
                setNoProfileFound(false);
            }else{
                setSearchedData([]); // limpa resultados anteriores
                setNoProfileFound('Usuário não encontrado');
                setTimeout(() =>{
                    setNoProfileFound('');
                    setSearchedData(null);
                    setSearch('');
                    setIsSearching(false);
                }, 3000);
            }
        }
        catch(error){
            console.error("Error at searching user:", error);
            modal_config({
                title: 'Erro',
                msg: `Erro ao pesquisar por Usuários...`,
                btt1: false, btt2: false,
                display: 'flex', title_color: 'rgb(255, 0, 0)'
            });
            setTimeout(() => {
                modal_config({
                    title: null, msg: null, btt1: false, 
                    btt2: false, display: false, title_color: '#000'
                });
                setSearch('');
                setIsSearching(false);
            }, 3000);
        }
    }

    // is searching ?
    useEffect(() =>{
        if(search != ''){
            setIsSearching(true);
        }
    }, [search]);

    // clean search
    const cleanSearch = () =>{
        setNoProfileFound(false);
        setSearch('');
        setSearchedData(null);
        setIsSearching(false);
        return;
    };

    // filtering service function
    const filtering = (data) =>{
        const filtered = allUsersData.filter(user => user.role === data);

        if(filtered.length === 0){
            setNoProfileFound(`${data} não encontrado`);
            setSearchedData(null);
            setTimeout(() => {
                setNoProfileFound('');
                setProfiles(null);
                setSearch('');
                setIsSearching(false)
                select_options.current.value = 'Todos perfis'
            }, 3000);
        }

        setProfiles(filtered);
    };

    // filtering profiles
    const filteredProfiles = searchedData !== null ? searchedData : profiles || allUsersData;
    const handleFilterChange = (selectedValue) =>{
        if(selectedValue === 'Todos perfis'){
            setProfiles(null);
        }else if(selectedValue === 'Usuários'){
            filtering('usuario');
        }else if(selectedValue === 'Moderadores'){
            filtering('moderador');
        }
    };


    // socket io functions

    
    // get user logged data
    const { userData: userDataLogged  } = useTokenVerify();

    // join in private room (socket io)
    useEffect(() =>{
        if(userDataLogged?.id){
            socket.emit('join', userDataLogged.id)
        }
    }, [userDataLogged]);

    // get notifications from bd
    useEffect(() =>{
        const fetchNotifications = async () =>{
            if(!userDataLogged?.id) return;

            try{
                const response = await findNotifications();

                if(response.status === 200){
                    setNotificationList(response.data?.notification_data);
                }
            }
            catch(error){
                console.error("Error at get messages notifications:", error);
            }
        };

        fetchNotifications();
    }, [userDataLogged]);

    // notifications in real time from socket.io
    useEffect(() =>{
        const handleNotification = async (fromUserId) => {
            try{
                const response = await findNotifications();
                if (response.status === 200) {
                    setNotificationList(response.data?.notification_data); // atualiza lista
                }
            }catch(err){
                console.error('Error at update socket.io notifications:', err);
            }
        };

        socket.on('notification-message', handleNotification);

        return () => socket.off('notification-message', handleNotification);        
    }, []);

    // redirect to chat + clean notifications
    const chatRedirect = async (profileId) =>{
        try{
            // request
            const response = await deleteNotification(userDataLogged?.id);
            if(response.status === 200){
                // filter
                setNotificationList((prev) => prev.filter(n => n.from_user_id !== profileId));
            }
        }
        catch(error){
            console.error('Error at clean notifications', error);    
        }
        navigate(`/chat/${profileId}`);
    };

    // check if exist pending notification for user logged...
    const hasNotificationFrom = (profileId) => {
        return notificationList.some(n => n.from_user_id === profileId && n.user_id === userDataLogged.id);
    };    

    
    ////////////// jsx

    
    return (
        <div className='container_campaigns'>
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


            { /* FEED CONTAINER */ }
            <div className='campaigns'>            
                <h2 className='title is-2' style={{ marginBottom: '40px' }}>
                    Perfis disponíveis para mensagem
                </h2>

                { /* PROFILES SEARCH OPTION */ }
                <form onSubmit={ search_form } className='search_container_campaign'>
                    <div className="select is-primary">
                        <select onChange={(e) => handleFilterChange(e.target.value)} 
                        style={{ width:'100%' }} className='is-hovered' ref={ select_options }>
                            <option>Todos perfis</option>
                            <option>Usuários</option>
                            <option>Moderadores</option>
                        </select>
                    </div>

                    <div className='searchInput_container_campaign' style={{ width:'80%' }}>
                        <input className='input is-primary' type="text" name="userName" 
                        placeholder='Pesquise pelo nome do perfil' value={ search }
                        autoComplete='off' onChange={ (e) => setSearch(e.target.value) } />
                        
                        <button className="button is-primary is-outlined" style={{ height:'40px' ,width:'40px' }}>
                            <i className="material-icons" id='person'>search</i>
                        </button>
                    </div>
                </form>

                <button onClick={ () => cleanSearch() } className="button is-primary is-outlined"
                style={{ 
                    margin: isSearching ? '10px 0px 20px 0px' : '0px', 
                    opacity: isSearching ? 1 : 0, 
                    visibility: isSearching ? 'visible' : 'hidden', 
                    transition: 'opacity 0.2s ease-out, visibility 0.2s ease-out' 
                }}>
                    Limpar pesquisa...
                </button>   

                {/* Profiles */}

                {
                    noProfiles && !searchedData && !noProfileFound && (
                        <div className='noRequests'>
                            <h1 className='title is-2'>{ noProfiles }</h1>
                        </div>
                    )
                }

                {
                    noProfileFound && (
                        <div className='noRequests'>
                            <h1 className='title is-2'>{ noProfileFound }</h1>
                        </div>
                    )
                }

                {
                    filteredProfiles && filteredProfiles?.map((profile) =>(
                        <div className='profile' key={ profile.id }>
                                { hasNotificationFrom(profile.id) && (
                                    <div className='notification-container'>
                                        <img src="../../../images/notification.png"/>
                                        <p>
                                            { 
                                                notificationList?.filter(n => 
                                                    n.from_user_id === profile.id && 
                                                    n.user_id === userDataLogged.id
                                                ).length 
                                            }
                                        </p>
                                    </div>
                                ) }

                            {
                                profile.profile_image ? (
                                    <div className='profile_image' style={{ 
                                        backgroundImage: `url(data:${profile.profile_image.content_type};base64,${profile.profile_image.image_data})`                                        
                                    }}>

                                    </div>
                                ) : (
                                    <div className='profile_image'>

                                    </div>
                                )
                            }

                            <h1 className='title is-3'>{ profile.name }</h1>

                            <div className='div_bottoms' style={{ margin:'0px' }}>
                                <button className="button is-info is-dark" onClick={ () => chatRedirect(profile.id) }>
                                    Iniciar conversa
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default Profiles;
