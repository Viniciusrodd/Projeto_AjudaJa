// hooks
import { useEffect, useState } from "react";

// libs
import axios from 'axios'

const useTokenVerify = () => {
    const [ data, setData ] = useState('');
    const [ error, setError ] = useState(false);
  
    useEffect(() => {
        const verify = async () => {
            try{
                const res = await axios.post('http://localhost:2130/verifyToken', {}, { withCredentials: true });
                setData(res.data);
            }
            catch(error){
                setError(true);
            }
        }
        verify();
    }, []);


    return { data, error };
};

export default useTokenVerify;