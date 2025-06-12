
// css
import '../../../utils/FeedsCss/FeedsUtil.css'

// hooks
import { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// components
import SideBar from '../../../components/SideBar/SideBar';

// custom hook
import { useCampaignData } from '../../../hooks/CampaignFetch/useCampaignData';

// libs
import axios from 'axios';

// context
import { UserContext } from '../../../context/UserContext';

// service
import { deleteCampaign } from '../../../services/CampaignService';


const Campaigns = () => {
    // states
    const [ search, setSearch ] = useState('');    
    const [ isSearching, setIsSearching ] = useState(false);
    const [ searchedData, setSearchedData ] = useState(null);
    const [ noCampaigns, setNoCampaigns ] = useState(false);
    const [ noCampaignsFound, setNoCampaignsFound ] = useState(false);
    const [ myCampaigns, setMyCampaigns ] = useState(null);
    const [ campaignId, setCampaignId ] = useState(0);

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
    const select_options = useRef(null);


    ////////////// functions


    // get campaigns data
    const { campaignData, setCampaignData } = useCampaignData();
    useEffect(() =>{
        if(campaignData && campaignData.length === 0){
            setNoCampaigns('Sem campanhas...');
        }
    }, [campaignData, setCampaignData]);

    // search form
    const search_form = async (e) =>{
        e.preventDefault();

        if (search.trim() === '') {
            setSearchedData(null);
            return;
        }

        try{
            const response = await axios.get(`http://localhost:2130/campaign/search/${search}`, { withCredentials: true });

            if(response.data.combined_campaigns?.length > 0){
                setSearchedData(response.data.combined_campaigns);
            }else{
                setSearchedData([]); // limpa resultados anteriores
                setNoCampaignsFound('Campanha não encontrada');
                setTimeout(() =>{
                    setNoCampaignsFound('');
                    setSearchedData(null);
                    setSearch('');
                    setIsSearching(false);
                }, 3000);
            }
        }catch(error){
            console.error("Error at searching campaigns:", error);
        }
    };

    // is searching ?
    useEffect(() =>{
        if(search != ''){
            setIsSearching(true);
        }
    }, [search]);

    // clean search
    const cleanSearch = () =>{
        setNoCampaignsFound(false);
        setSearch('');
        setSearchedData(null);
        setIsSearching(false);
        return;
    };

    // filtering my campaigns 
    const filteredCampaigns = searchedData !== null ? searchedData : myCampaigns || campaignData;
    const handleFilterChange = (selectedValue) =>{
        if(selectedValue === 'Todas Campanhas'){
            setMyCampaigns(null);
        }else if(selectedValue === 'Minhas Campanhas'){
            const filtered = campaignData.filter(campaign => campaign.moderator_id === userId);
            
            if(filtered.length === 0){
                setNoCampaignsFound('Campanhas pessoais não encontradas')
                setTimeout(() =>{
                    setNoCampaignsFound('');
                    setMyCampaigns(null);
                    select_options.current.value = 'Todas Campanhas'
                }, 3000);
            }

            setMyCampaigns(filtered);
        }
    };

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

    // modal for delete campaign
    const modal_deleteCampaign = (id) =>{
        modal_config({
            title: 'Espere',
            msg: 'Tem certeza que deseja excluir sua campanha ?',
            btt1: 'Tenho certeza',
            btt2: 'Voltar',
            display: 'flex',
            title_color: 'rgb(0, 136, 255)'
        });
        setCampaignId(id);
    };

    // delete campaign
    const deleteCampaign_event = async () =>{
        try{
            const res = await deleteCampaign(campaignId);

            if(res.status === 200){
                modal_config({
                    title: 'Sucesso',
                    msg: 'Poderá criar nova campanha quando desejar...',
                    btt1: false,
                    btt2: false,
                    display: 'flex',
                    title_color: 'rgb(38, 255, 0)'
                });                
                
                setTimeout(() => {
                    modal_config({
                        title: null, msg: null, btt1: false, 
                        btt2: false, display: false, title_color: '#000'
                    });
                    const updatedCampaigns = filteredCampaigns?.filter(data => data.id !== campaignId);

                    if(searchedData !== null){
                        setSearchedData(updatedCampaigns);
                    }else if(myCampaigns !== null){
                        setMyCampaigns(updatedCampaigns);
                    }else{
                        setCampaignData(updatedCampaigns);
                    }
                }, 3000);
            }
        }
        catch(error){
            console.log('Error at delete campaign at frontend', error);
            modal_config({
                title: 'Erro',
                msg: 'Erro ao excluir campanha de ajuda...',
                btt1: false,
                btt2: 'Tente novamente',
                display: 'flex',
                title_color: 'rgb(255, 0, 0)'
            });
        };
    };


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
                        <p className='modal-card-title has-text-centered' style={{ textAlign:'center' }}>
                            { modal_msg }
                        </p>
                    </section>
                    <footer className='modal-card-foot is-justify-content-center'>
                        <div className='div_bottoms'>
                            {modal_btt && (
                                <button onClick={ deleteCampaign_event } className="button is-danger is-dark">
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

            { /* FEED CONTAINER */ }
            <div className='campaigns'>
                <h1 className='title is-1'>Campanhas</h1>

                { /* CAMAPAIGN SEARCH OPTION */ }
                <form onSubmit={ search_form } className='search_container_campaign'>
                    <div className="select is-primary">
                        <select onChange={(e) => handleFilterChange(e.target.value)} 
                        style={{ width:'100%' }} className='is-hovered' ref={ select_options }>
                            <option>Todas Campanhas</option>
                            <option>Minhas Campanhas</option>
                        </select>
                    </div>

                    <div className='searchInput_container_campaign'>
                        <input className='input is-primary' type="text" name="search" placeholder='Pesquise por campanha' value={ search }
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

                {/* CAMPAIGNS */}

                {
                    noCampaigns && !searchedData && !noCampaignsFound && (
                        <div className='noRequests'>
                            <h1 className='title is-2'>{ noCampaigns }</h1>
                        </div>
                    )
                }

                {
                    noCampaignsFound && (
                        <div className='noRequests'>
                            <h1 className='title is-2'>{ noCampaignsFound }</h1>
                        </div>
                    )
                }
                
                {
                    filteredCampaigns?.map((campaign) => (
                        <div className='campaign' key={ campaign.id }>
                            <div className='campaign_image'>
                                <div className='campaign_image_filter'></div>
                            </div>
                            
                            <h2 className='title is-2'>{ campaign.title }</h2>
                            <h4 className='title is-4'>Por: { campaign.user_data.name }</h4>

                            <div className='user_requests_description' style={{ margin:'0px 0px 20px 0px' }}>
                                <h5 className='subtitle is-5'>{ campaign.description }</h5>
                            </div>

                            <div className='user_requests_details' style={{ justifyContent:'space-around' }}>
                                <div className='details' style={{ margin:'0px' }}>
                                    <p className='titles_requests'>Data de início</p>
                                    <h1 className='subtitle is-4'>{ campaign.start_date }</h1>
                                </div>  

                                <div className='details' style={{ margin:'0px' }}>
                                    <p className='titles_requests'>Data de fim</p>
                                    <h1 className='subtitle is-4'>{ campaign.end_date }</h1>
                                </div>  
                            </div>

                            {
                                campaign.moderator_id === userId && (
                                    <div className='div_bottoms'>
                                        <Link to={`/editarCampanha/${campaign.id}`}>
                                            <button className="button is-info is-dark">
                                                Editar
                                            </button>
                                        </Link>
                                    
                                        <button onClick={ () => modal_deleteCampaign(campaign.id) }  className="button is-danger is-dark">
                                            Excluir
                                        </button>
                                    </div>
                                )
                            }
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default Campaigns;
