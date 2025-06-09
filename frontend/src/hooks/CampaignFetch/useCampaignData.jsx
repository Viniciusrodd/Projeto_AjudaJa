
//libs
import axios from 'axios';

// hooks
import { useState, useEffect } from "react"

// custom hook
export const useCampaignData = (id) =>{
    const [ campaignData, setCampaignData ] = useState(null);
    const [ campaignDataByModeratorId, setCampaignDataByModeratorId ] = useState(null);
    const [ campaignDataById, setCampaignDataById ] = useState(null);


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


    // campaign by id
    useEffect(() =>{
        const requestById = async () =>{
            const response = await axios.get(`http://localhost:2130/campaign/${id}`, { withCredentials: true });
            if(response.status === 204){
                setCampaignDataById([]);
            }else{
                setCampaignDataById(response.data.campaign_data);
            }
        };
        requestById();
    }, []);


    return { campaignData, setCampaignData, campaignDataById };
}