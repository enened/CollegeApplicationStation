import {useState, useContext, useEffect} from "react";
import Axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom';
import { Context } from "./context.js";

function Header(){

    Axios.defaults.withCredentials = true;
    let navigate = useNavigate()
    let currentUrl = useLocation().pathname;
    const {setUser,  user} = useContext(Context);

    const signout = ()=>{
        Axios.post("http://localhost:30014/signout", ).then((response)=>{
            window.location.reload();
        })
    }

    return(
        <>
            <div className="header">
                <h1 className="headerH1">CollegeApplicationStation</h1>

                {user && <button className = "lightButton" onClick={signout}>Sign Out</button>}
                {!user && currentUrl == "/" && <button className = "lightButton" onClick={()=>{navigate("/signUp")}}>Sign Up</button>}
                {!user && currentUrl == "/signUp" && <button className = "lightButton" onClick={()=>{navigate("/")}}>Login</button>}
            </div>
        </>
    )

}

export default Header;