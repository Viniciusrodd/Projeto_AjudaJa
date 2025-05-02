
// hooks
import { useState, useEffect } from 'react';

// libs
import axios from 'axios'

export const useTokenVerify = () => {
    const [ userData, setUserData ] = useState(null);
    const [ errorRes, setErroRes ] = useState(null);

    useEffect(() =>{
        const request = async () =>{
            try{
                const res = await axios.post('http://localhost:2130/verifyToken', {}, { withCredentials: true });
                //console.log('token verify res: ', res.data.user)
                setUserData(res.data.user);
            }
            catch(error){
                console.log('Error at useTokenVerify hook request: ', error);
                setErroRes(error);
            }
        }        
        request();
    }, []);
    
    return { userData, errorRes };
};