
// css
import styles from './Campaigns.module.css';
import styles_homepage from '../HomePage/Home.module.css';

// hooks
import { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// components
import SideBar from '../../components/SideBar/SideBar';



const Campaigns = () => {
    // states
    const [ search, setSearch ] = useState('');    
    const [ isSearching, setIsSearching ] = useState(false);
    const [ noCampaigns, setNoCampaigns ] = useState(false);

    // consts
    const navigate = useNavigate();
    const modal = useRef(null);
    const modal_title = useRef(null);
    const modal_msg = useRef(null);
    const modal_btt = useRef(null);
    const modal_btt_2 = useRef(null);


    // is searching ?
    useEffect(() =>{
        if(search != ''){
            setIsSearching(true);
        }
    }, [search]);


    // clean search
    const cleanSearch = () =>{
        setSearch('');
        setIsSearching(false);
        return;
    };


    return (
        <div className={ styles_homepage.container_home }>
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
            <div className={ styles.container }>
                <h1 className='title is-1'>Campanhas</h1>

                {
                    noCampaigns && (
                        <div className={ styles_homepage.noRequests }>
                            <h1 className='title is-2'>{ noCampaigns }</h1>
                        </div>
                    )
                }

                <form className={ styles.search_container }>
                    <input className='input is-primary' type="text" name="search" placeholder='Pesquise por campanha' 
                    autoComplete='off' onChange={ (e) => setSearch(e.target.value) } />

                    <button className="button is-primary is-outlined" style={{ height:'45px' ,width:'45px' }}>
                        <i className="material-icons" id='person'>search</i>
                    </button>

                    <button onClick={ () => cleanSearch() } className="button is-primary is-outlined"
                    style={{ marginTop:'10px', opacity: isSearching ? 1 : 0, visibility: isSearching ? 'visible' : 'hidden', transition: 'opacity 0.3s ease-out, visibility 0.3s ease-out' }}>
                        Limpar pesquisa...
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Campaigns;
