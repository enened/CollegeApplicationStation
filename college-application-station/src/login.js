import {useState, useContext, useEffect} from "react";
import Axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { Context } from "./context.js";
import checkLoggedIn from "./checkLoggedIn.js";

function Login(){

    Axios.defaults.withCredentials = true;
    let navigate = useNavigate()
    const {setUser,  user} = useContext(Context);
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()

    useEffect(()=>{
        if(!user){
            checkLoggedIn(setUser).then((user)=>{
                if(user){
                    setUser(user)   
                    if (user.school){
                        navigate("/findOpportunities")            
                    }
                    else{
                        navigate("/giveOpportunities")            
                    }      
                }
            })
        }
        else{
            if (user.school){
                navigate("/findOpportunities")            
            }
            else{
                navigate("/giveOpportunities")            
            }
        }
    }, [])

    const login = (e)=>{
        e.preventDefault();
        Axios.post("http://localhost:30014/login", {username: username, password: password}).then((response)=>{
            if (response.data == "Wrong combo"){
                alert("Wrong username or password")
            }
            else{
                setUser(response.data.user);
                if (response.data.user.school != "0"){
                    navigate("/findOpportunities")            
                }
                else{
                    navigate("/giveOpportunities")            
                }
            }
        });    
    }


    return(
        <>
            <h1>Login</h1>

            <form onSubmit={login}>
                <input required onChange={(e)=>{setUsername(e.target.value)}} type="text" placeholder="Username" maxLength={300}/>
                <br/>
                <input required onChange={(e)=>{setPassword(e.target.value)}} type="password" placeholder="Password" maxLength={300}/>
                <br/>
                <button type="submit">Login</button>
            </form>
            
            <p className="link" onClick={()=>{navigate("signUp")}}>Don't have an account? Sign Up!</p>
        </>
    )
}

export default Login;