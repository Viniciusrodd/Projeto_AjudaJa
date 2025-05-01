
// hooks
import { createContext, useState, useEffect } from "react";
import { useTokenVerify } from "../hooks/UserMiddleware/useTokenVerify"; // custom hook

// libs
import axios from 'axios';

// export context
export const UserContext = createContext();


// provider
export const UserProvider = ({ children }) => {
    const [ isLogged, setIsLogged ] = useState(false);
    const [ userName, setUserName ] = useState('');
    const [ userId, setUserId ] = useState(null);

    useEffect(() => {
        const fetchToken = async () =>{
            try{
                const res = await useTokenVerify();
                if(res){
                    setIsLogged(true);
                    setUserId(res.data.user.id);
                }
            }
            catch(error){
                console.log('Error in fetchToken at navbar component: ', error);
            }
        };
        fetchToken();
    }, []);


    // get user name
    useEffect(() =>{
        if(userId !== null){
            const getUserName = async () =>{
                try{
                    const user = await axios.get(`http://localhost:2130/findUser/${userId}`);
                    setUserName(user.data.userData.name);
                }
                catch(error){
                    console.log('Error in getUserName at navbar component: ', error);
                }
            }
            getUserName();
        }
    }, [userId]);


    return(
        <UserContext.Provider value={{ userId, userName, isLogged, setUserName }}>
            { children }
        </UserContext.Provider>
    );
};