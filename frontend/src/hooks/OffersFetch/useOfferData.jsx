
// libs
import axios from 'axios';

// hooks
import { useState, useEffect } from "react"

export const useOfferData = (userID, offerID) =>{
    const [ offerData, setOfferData ] = useState(null);
    const [ offerDataByUserId, setOfferDataByUserId ] = useState(null);
    const [ offerDataById, setOfferDataById ] = useState(null);


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
            setOfferDataByUserId(response.data.combined_data); 
        };
        request();
    }, [userID]);


    useEffect(() =>{
        const request = async () =>{
            const response = await axios.get(`http://localhost:2130/offer/${offerID}`, { withCredentials: true });
            setOfferDataById(response.data.offers); 
        };
        request();
    }, [offerID]);


    return { offerData, offerDataByUserId, setOfferDataByUserId, offerDataById };
};