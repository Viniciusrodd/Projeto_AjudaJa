
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


const Campaigns = () => {
    // states
    const [ search, setSearch ] = useState('');    
    const [ isSearching, setIsSearching ] = useState(false);
    const [ searchedData, setSearchedData ] = useState(null);
    const [ noCampaigns, setNoCampaigns ] = useState(false);
    const [ noCampaignsFound, setNoCampaignsFound ] = useState(false);

    // consts
    const { userId } = useContext(UserContext);
    const navigate = useNavigate();
    const modal = useRef(null);
    const modal_title = useRef(null);
    const modal_msg = useRef(null);
    const modal_btt = useRef(null);
    const modal_btt_2 = useRef(null);


    // get campaigns data
    const { campaignData } = useCampaignData();
    useEffect(() =>{
        if(campaignData && campaignData.length === 0){
            setNoCampaigns('Sem campanhas...');
        }
    }, [campaignData]);


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
                setNoCampaignsFound(false);
            }else{
                setSearchedData([]); // limpa resultados anteriores

                setNoCampaignsFound('Campanha não encontrada');
                setTimeout(() =>{
                    setNoCampaignsFound('');
                    setSearchedData(null);
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


    return (
        <div className='container_campaigns'>
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

            { /* FEED CONTAINER */ }
            <div className='campaigns'>
                <h1 className='title is-1'>Campanhas</h1>

                {
                    noCampaigns && !searchedData && (
                        <div className='noRequests'>
                            <h1 className='title is-2'>{ noCampaigns }</h1>
                        </div>
                    )
                }

                { /* CAMAPAIGN SEARCH OPTION */ }
                <form onClick={ search_form } className='search_container_campaign'>
                    <div className="select is-primary">
                        <select style={{ width:'100%' }} className='is-hovered'>
                            <option>Todas Campanhas</option>
                            <option>Minhas Campanhas</option>
                            <option>Campanhas + recentes</option>
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
                    noCampaignsFound && (
                        <div className='noRequests'>
                            <h1 className='title is-2'>{ noCampaignsFound }</h1>
                        </div>
                    )
                }
                
                {
                    (searchedData || campaignData)?.map((campaign) => (
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
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default Campaigns;
