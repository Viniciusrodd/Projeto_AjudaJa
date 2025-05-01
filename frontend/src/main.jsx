import { BrowserRouter } from 'react-router-dom'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import '../node_modules/bulma/css/bulma.css';

// provider - UserContext
import { UserProvider } from './context/UserContext.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <UserProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </UserProvider>
    </StrictMode>,
)
