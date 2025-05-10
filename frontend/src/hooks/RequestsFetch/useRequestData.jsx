
//libs
import axios from 'axios';

// hooks
import { useState, useEffect } from "react"

export const useRequestData = () =>{
    const [ requestData, setRequestData ] = useState(null);

    useEffect(() =>{
        const request = async () =>{
            const response = await axios.get('http://localhost:2130/requests', { withCredentials: true });
            setRequestData(response.data.combined_requests); 
        }
        request();
    }, []);

    return { requestData };
};