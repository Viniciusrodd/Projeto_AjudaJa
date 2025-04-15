
// css
import './App.css'

// hooks
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// components
import NavBar from './components/NavBar/NavBar'

// pages
import Home from './pages/HomePage/Home';


function App() {
    return (
        <div>
            <BrowserRouter>
                <NavBar />
                <Routes>
                    <Route path='/' element={ <Home /> } />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App
