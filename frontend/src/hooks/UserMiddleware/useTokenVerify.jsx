
// hooks
import { useState, useEffect, useContext } from 'react';

// libs
import axios from 'axios'

// context
import { LoadingContext } from '../../context/loadingContext';


export const useTokenVerify = () => {
    // states
    const [ userData, setUserData ] = useState(null);
    const [ errorRes, setErroRes ] = useState(null);

    // context
    const { setLoading } = useContext(LoadingContext);


    ///////// functions


    useEffect(() =>{
        const request = async () =>{
            setLoading(true);

            try{
                const res = await axios.post('http://localhost:2130/verifyToken', {}, { withCredentials: true });
                //console.log('token verify res: ', res.data.user)
                setUserData(res.data.user);
                setLoading(false);
            }
            catch(error){
                console.log('Error at useTokenVerify hook request: ', error);
                setErroRes(error);
                setLoading(false);
            }
        }        
        request();
    }, []);
    
    return { userData, errorRes };
};