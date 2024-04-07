import {useState, useContext, useEffect} from "react";
import Axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { Context } from "../context.js";

function Grade(){
    Axios.defaults.withCredentials = true;
    let navigate = useNavigate()
    const {setUser,  user} = useContext(Context);
    const [data, setData] = useState([])
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()


    const getAccess = ()=>{
        Axios.post(`http://localhost:30014/getHACinfo`, {username: username, password: password}).then((response)=>{
            if(response.data == "wrong combo"){
                alert("Wrong username or password")
            }
            else{
                setData(response.data["2023-24 - Semester "].data)
            }
        });
    }


    return(
        <>
            <h3>Enter your home access center credentials</h3>
            <input onChange={(e)=>{setUsername(e.target.value)}} required placeholder="Username"/>
            <br/>
            <input onChange={(e)=>{setPassword(e.target.value)}} required placeholder="Password" type="password"/>
            <br/>
            <button onClick={getAccess}>Access</button>

            {data.map((val, index)=>{
                if (index != 0){
                    return(
                        <>
                            <div className="slide">
                                <p>Course: {val[1]}</p>
                                <p>Average: {val[4]}</p>
                            </div>
                        </>
                    )
                }
            })}
        </>
    )   
}

export default Grade;