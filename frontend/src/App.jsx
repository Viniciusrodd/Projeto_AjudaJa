
// css
import './App.css'

// hooks
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';

// components
import NavBar from './components/NavBar/NavBar'

// pages
import Home from './pages/HomePage/Home';
import Register from './pages/Users/Register/Register';
import Login from './pages/Users/Login/Login';
import AccountDetail from './pages/Users/AccountDetails/AccountDetail';
import HelpRequest from './pages/Requests/HelpRequests/HelpRequest';
import EditRequests from './pages/Requests/EditRequests/EditRequests';
import MyHelpRequests from './pages/Requests/MyHelpRequests/MyHelpRequests';
import OfferRequest from './pages/Offers/OfferRequest/OfferRequest';
import MyOffers from './pages/Offers/MyOffers/MyOffers';
import EditOffers from './pages/Offers/EditOffers/EditOffers';
import Campaigns from './pages/Campaigns/CampaignsView/CampaignsView';
import CampaignsCreate from './pages/Campaigns/CampaignsCreate/CampaignsCreate';
import EditCampaign from './pages/Campaigns/EditCampaign/EditCampaign';


function App() {
    const location = useLocation();
    const isOnRegisterPage = location.pathname === '/cadastro';
    const isOnLoginPage = location.pathname === '/login';

    return (
        <div>
            { !isOnRegisterPage && !isOnLoginPage && <NavBar condition={ false }/> }
            <Routes>
                <Route path='/' element={ <Home /> } />
                <Route path='/cadastro' element={ <Register /> } />
                <Route path='/login' element={ <Login /> } />
                <Route path='/detalhesDeConta/:userID' element={ <AccountDetail /> } />
                <Route path='/pedidoDeAjuda' element={ <HelpRequest /> } />                
                <Route path='/editarPedido/:requestID' element={ <EditRequests /> } />                
                <Route path='/oferecerAjuda/:requestID' element={ <OfferRequest /> } />                
                <Route path='/meusPedidosDeAjuda' element={ <MyHelpRequests /> } />                
                <Route path='/minhasOfertasDeAjuda' element={ <MyOffers /> } />                
                <Route path='/editarOfertaDeAjuda/:offerID' element={ <EditOffers /> } />                
                <Route path='/campanhas' element={ <Campaigns /> } />                
                <Route path='/criarCampanha' element={ <CampaignsCreate /> } />                
                <Route path='/editarCampanha/:campaignID' element={ <EditCampaign /> } />                
            </Routes>
        </div>
    )
}

export default App
