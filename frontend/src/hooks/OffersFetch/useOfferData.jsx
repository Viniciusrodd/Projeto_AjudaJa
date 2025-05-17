
// libs
import axios from 'axios';

// hooks
import { useState, useEffect } from "react"

export const useOfferData = () =>{
    const [ offerData, setOfferData ] = useState(null);

    useEffect(() =>{
        const request = async () =>{
            const response = await axios.get('http://localhost:2130/offers', { withCredentials: true });
            setOfferData(response.data.offers); 
        };
        request();
    }, []);


    return { offerData };
};