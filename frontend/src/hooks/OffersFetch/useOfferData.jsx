
// libs
import axios from 'axios';

// hooks
import { useState, useEffect, useContext } from "react"

// context
import { LoadingContext } from '../../context/loadingContext';


export const useOfferData = (userID, offerID) =>{
    // states
    const [ offerData, setOfferData ] = useState(null);
    const [ offerDataByUserId, setOfferDataByUserId ] = useState(null);
    const [ offerDataById, setOfferDataById ] = useState(null);

    // context
    const { setLoading } = useContext(LoadingContext);


    ////////// functions


    useEffect(() =>{
        const request = async () =>{
            setLoading(true);

            const response = await axios.get('http://localhost:2130/offers', { withCredentials: true });
            if(response.status === 204){
                setLoading(false);
                setOfferData([]);    
            }else{
                setLoading(false);
                setOfferData(response.data.combined_data); 
            }
        };
        request();
    }, []);


    useEffect(() =>{
        const request = async () =>{
            setLoading(true);

            const response = await axios.get(`http://localhost:2130/offers/${userID}`, { withCredentials: true });
            if(response.status === 204){
                setLoading(false);
                setOfferDataByUserId([]);    
            }else{
                setLoading(false);
                setOfferDataByUserId(response.data.combined_data); 
            }
        };
        request();
    }, [userID]);


    useEffect(() =>{
        const request = async () =>{
            setLoading(true);
            
            const response = await axios.get(`http://localhost:2130/offer/${offerID}`, { withCredentials: true });
            if(response.status === 204){
                setLoading(false);
                setOfferDataById([]);    
            }else{
                setLoading(false);
                setOfferDataById(response.data.offers); 
            }
        };
        request();
    }, [offerID]);


    return { offerData, offerDataByUserId, setOfferDataByUserId, offerDataById };
};