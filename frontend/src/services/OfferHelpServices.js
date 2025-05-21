
// libs
import axios from 'axios';


// create offerHelp
export const postOffer = async (data, userID, requestID) =>{
    const response = await axios.post(`http://localhost:2130/createOffer/${userID}/${requestID}`, data, { withCredentials: true });
    return response;
};

// offer status change
export const statusChangeService = async (data, offerID) =>{
    const response = await axios.put(`http://localhost:2130/offerStatus/${offerID}`, data, { withCredentials: true });
    return response;    
};

// edit offer
export const updateOffer = async (data, offerID) =>{
    const response = await axios.put(`http://localhost:2130/updateOffer/${offerID}`, data, { withCredentials: true });
    return response;
};