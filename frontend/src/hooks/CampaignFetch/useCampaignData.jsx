
//libs
import axios from 'axios';

// hooks
import { useState, useEffect, useContext } from "react"

// context
import { LoadingContext } from '../../context/loadingContext';


// custom hook
export const useCampaignData = (id) =>{
    // states
    const [ campaignData, setCampaignData ] = useState(null);
    const [ campaignDataByModeratorId, setCampaignDataByModeratorId ] = useState(null);
    const [ campaignDataById, setCampaignDataById ] = useState(null);

    // context
    const { setLoading } = useContext(LoadingContext);


    ////////// functions


    useEffect(() =>{
        const request = async () =>{
            setLoading(true);

            const response = await axios.get('http://localhost:2130/campaigns', { withCredentials: true });
            if(response.status === 204){
                setLoading(false);
                setCampaignData([]);
            }else{
                setLoading(false);
                setCampaignData(response.data.combined_campaigns);
            }
        };
        request();
    }, []);


    // campaign by id
    useEffect(() =>{
        setLoading(true);

        const requestById = async () =>{
            const response = await axios.get(`http://localhost:2130/campaign/${id}`, { withCredentials: true });
            if(response.status === 204){
                setLoading(false);
                setCampaignDataById([]);
            }else{
                setLoading(false);
                setCampaignDataById(response.data.campaign_data);
            }
        };
        requestById();
    }, []);


    return { campaignData, setCampaignData, campaignDataById };
}