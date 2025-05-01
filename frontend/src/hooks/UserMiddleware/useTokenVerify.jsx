// hooks
import { useEffect, useState } from "react";

// libs
import axios from 'axios'

const useTokenVerify = () => {
    const [ data, setData ] = useState('');
    const [ error, setError ] = useState(null);
  
    useEffect(() => {
        const verify = async () => {
            try{
                const res = await axios.post('http://localhost:2130/verifyToken', {}, { withCredentials: true });
                setData(res.data);
            }
            catch(error){
                console.log('Error at token verification hook: ', error);
                setError(error);
            }
        }
        verify();
    }, []);


    return { data, error };
};

export default useTokenVerify;