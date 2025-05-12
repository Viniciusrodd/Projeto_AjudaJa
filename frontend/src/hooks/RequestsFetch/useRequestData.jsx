
//libs
import axios from 'axios';

// hooks
import { useState, useEffect } from "react"

export const useRequestData = (id) =>{
    const [ requestData, setRequestData ] = useState(null);
    const [ requestDataById, setRequestDataById ] = useState(null);

    useEffect(() =>{
        const request = async () =>{
            const response = await axios.get('http://localhost:2130/requests', { withCredentials: true });
            setRequestData(response.data.combined_requests); 
        };
        request();
    }, []);


    useEffect(() =>{
        const requestById = async () =>{
            const response = await axios.get(`http://localhost:2130/request/${id}`, { withCredentials: true });
            setRequestDataById(response.data.request_data);
        };
        requestById();
    }, [id]);


    return { requestData, requestDataById };
};