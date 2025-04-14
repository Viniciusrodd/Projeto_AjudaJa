
// css
import './App.css'

// hooks
import { useFetchTest } from './hooks/useFetchTest'
import { useEffect } from 'react';

function App() {
    const URL = 'http://localhost:2130/teste';
    const { message } = useFetchTest(URL);

    useEffect(() => {
        console.log(message)
    }, [message]);

    return (
        <div>
            <h1 className='title is-1'>AjudaJá</h1>
            <p>Mensagem do backend: { message }</p>
        </div>
    )
}

export default App
