import {createContext} from "react";
import axios from 'axios';
import { toast } from "react-toastify";

export const App_Context = createContext();

export const App_Context_Provider = ({children}) =>{

    const url = 'http://localhost:3000';
    const token = localStorage.getItem("token");

    const studentdetails = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
        console.warn("Token not available yet");
        return null;
    }

    let newUrl = url + '/api/student/info';

    try {
        const response = await axios.get(newUrl, {
        headers: {
            Authorization: `Bearer ${token}`
        }
        });
        return response.data;
    } catch (err) {
        console.error("Failed to fetch student info:", err.response?.data || err.message);
        return null;
    }
    };

    const signout = () =>{
        localStorage.removeItem("token");
    
        toast.success("Signed out successfully");
        window.location.href = '/';
    }
    

    const contextValue = {
        studentdetails,
        signout,
    };

    return(
        <App_Context.Provider value={contextValue}>
            {children}
        </App_Context.Provider>
    )
}

export default App_Context_Provider;