
// libs
import axios from 'axios';


// create offerHelp
export const postOffer = async (data, userID, requestID) =>{
    const response = await axios.post(`http://localhost:2130/offer/${userID}/${requestID}`, data, { withCredentials: true });
    return response;
};

// offer status change
export const statusChangeService = async (data, offerID) =>{
    const response = await axios.put(`http://localhost:2130/offer/status/${offerID}`, data, { withCredentials: true });
    return response;    
};

// edit offer
export const updateOffer = async (data, offerID) =>{
    const response = await axios.put(`http://localhost:2130/offer/${offerID}`, data, { withCredentials: true });
    return response;
};

// delete offer
export const deleteOffer = async (offerID) =>{
    const response = await axios.delete(`http://localhost:2130/offer/${offerID}`, { withCredentials: true });
    return response;
}