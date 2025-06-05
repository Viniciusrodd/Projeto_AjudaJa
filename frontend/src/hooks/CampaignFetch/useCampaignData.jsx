
//libs
import axios from 'axios';

// hooks
import { useState, useEffect } from "react"

// custom hook
export const useCampaignData = (title) =>{
    const [ campaignData, setCampaignData ] = useState(null);

    useEffect(() =>{
        const request = async () =>{
            const response = await axios.get('http://localhost:2130/campaigns', { withCredentials: true });
            if(response.status === 204){
                setCampaignData([]);
            }else{
                setCampaignData(response.data.combined_campaigns);
            }
        };
        request();
    }, []);


    return { campaignData };
}