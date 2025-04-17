
// css
import './App.css'

// hooks
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// components
import NavBar from './components/NavBar/NavBar'

// pages
import Home from './pages/HomePage/Home';
import Register from './pages/Register/Register';


function App() {
    return (
        <div>
            <BrowserRouter>
                <NavBar />
                <Routes>
                    <Route path='/' element={ <Home /> } />
                    <Route path='/cadastro' element={ <Register /> } />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App
