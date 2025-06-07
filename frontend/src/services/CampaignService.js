
// libs
import axios from 'axios';


// create campaign
export const createCampaign = async (data) =>{
    const response = await axios.post('http://localhost:2130/campaign', data, { withCredentials: true });
    return response;
};

// edit campaign
export const editCampaign = async (campaignID, data) =>{
    const response = await axios.put(`http://localhost:2130/campaign/${campaignID}`, data, { withCredentials: true });
    return response;
};