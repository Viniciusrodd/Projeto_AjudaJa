
// libs
import axios from 'axios';

// hooks
import { useState, useEffect } from "react"

export const useOfferData = (userID) =>{
    const [ offerData, setOfferData ] = useState(null);
    const [ offerDataByUserId, setOfferDataByUserId ] = useState(null);


    useEffect(() =>{
        const request = async () =>{
            const response = await axios.get('http://localhost:2130/offers', { withCredentials: true });
            setOfferData(response.data.combined_data); 
        };
        request();
    }, []);


    useEffect(() =>{
        const request = async () =>{
            const response = await axios.get(`http://localhost:2130/offers/${userID}`, { withCredentials: true });
            console.log(response.data.combined_data)
            setOfferDataByUserId(response.data.combined_data); 
        };
        request();
    }, [userID]);


    return { offerData, offerDataByUserId };
};