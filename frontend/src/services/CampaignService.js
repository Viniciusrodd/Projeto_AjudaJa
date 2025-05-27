
// libs
import axios from 'axios';


// create campaign
export const createCampaign = async (data) =>{
    const response = await axios.post('http://localhost:2130/campaign', data, { withCredentials: true });
    return response;
};