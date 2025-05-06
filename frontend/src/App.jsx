
// css
import './App.css'

// hooks
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';

// components
import NavBar from './components/NavBar/NavBar'

// pages
import Home from './pages/HomePage/Home';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import AccountDetail from './pages/AccountDetails/AccountDetail';
import HelpRequest from './pages/HelpRequests/HelpRequest';


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
            </Routes>
        </div>
    )
}

export default App
