
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
    const [userNameManuallySet, setUserNameManuallySet] = useState(false);
    const [ notification, setNotification ] = useState(null);
    
    
    // token verify + user id
    const { userData, errorRes } = useTokenVerify();
    useEffect(() => {
        if(userData){
            setIsLogged(true);
            setUserId(userData.id);
        }
        
        if(errorRes){
            console.log('Error in fetchToken at navbar component: ', errorRes);
        }        
    }, [userData, errorRes]);


    // get user name
    useEffect(() =>{
        if(userId !== null && !userNameManuallySet){
            const getUserName = async () =>{
                try{
                    const user = await axios.get(`http://localhost:2130/user/${userId}`, { withCredentials: true });
                    setUserName(user.data.userData.name);
                }
                catch(error){
                    console.log('Error in getUserName at navbar component: ', error);
                }
            }
            getUserName();
        }
    }, [userId, userNameManuallySet]);


    return(
        <UserContext.Provider value={{ 
            userId, setUserId, userName, 
            setUserName, isLogged, setIsLogged,
            userNameManuallySet, setUserNameManuallySet,
            notification, setNotification
        }}>
            { children }
        </UserContext.Provider>
    );
};