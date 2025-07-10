
//libs
import axios from 'axios';

// context
import { LoadingContext } from '../../context/loadingContext';

// hooks
import { useState, useEffect, useContext } from "react"


export const useRequestData = (id, userID) =>{
    // states
    const [ requestData, setRequestData ] = useState(null);
    const [ requestDataById, setRequestDataById ] = useState(null);
    const [ requestDataByUserId, setRequestDataByUserId ] = useState(null);

    // context
    const { setLoading } = useContext(LoadingContext);


    useEffect(() =>{
        const request = async () =>{
            setLoading(true);

            const response = await axios.get('http://localhost:2130/requests', { withCredentials: true });
            if(response.status === 204){
                setLoading(false);
                setRequestData([]);
            }else{
                setLoading(false);
                setRequestData(response.data.combined_requests); 
            }
        };
        request();
    }, []);


    useEffect(() =>{
        const requestById = async () =>{
            setLoading(true);

            const response = await axios.get(`http://localhost:2130/request/${id}`, { withCredentials: true });
            if(response.status === 204){
                setLoading(false);
                setRequestDataById([]);    
            }else{
                setLoading(false);
                setRequestDataById(response.data.request_data);
            }
        };
        requestById();
    }, [id]);


    useEffect(() =>{
        const requestByUserId = async () =>{
            setLoading(true);

            const response = await axios.get(`http://localhost:2130/requests/${userID}`, { withCredentials: true });
            if(response.status === 204){
                setLoading(false);
                setRequestDataByUserId([]);
            }else{
                setLoading(false);
                setRequestDataByUserId(response.data.combined_requests);
            }
        }
        requestByUserId();
    }, [userID]);


    return { requestData, setRequestData, requestDataById, requestDataByUserId, setRequestDataByUserId };
};