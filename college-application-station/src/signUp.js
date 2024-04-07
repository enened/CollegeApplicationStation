import {useState, useContext, useEffect} from "react";
import Axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { Context } from "./context.js";
import checkLoggedIn from "./checkLoggedIn.js";
import Autocomplete from "react-google-autocomplete";

function SignUp(){

    Axios.defaults.withCredentials = true;
    let navigate = useNavigate()
    const {setUser,  user} = useContext(Context);
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const [firstName, setFirstName] = useState()
    const [lastName, setLastName] = useState()
    const [location, setLocation] = useState()
    const [school, setSchool] = useState()
    const [page, setPage] = useState("choice")

    useEffect(()=>{
        if(!user){
            checkLoggedIn(setUser).then((user)=>{
                if(user){
                    setUser(user)         
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

    const signUp = (e)=>{
        e.preventDefault()
        if (confirmPassword != password){
            alert("Retyped password doesn't match password")
            return
        }
        if(!location){
            alert("Please enter a valid address")
            return
        }
        Axios.post("http://localhost:30014/signUp", {username: username, password: password, firstName: firstName, lastName: lastName, location: location, school: page == "school" && school}).then((response)=>{
            if (response.data == "username in use"){
                alert("Username in use. Please choose another username")
            }
            else{
                setUser(response.data.user);
                if(page == "school"){
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
            <h1>Sign Up</h1>

            {page == "choice" ? 
                <>
                    <h2 style={{"margin": "50px"}}>What do you want to do in CollegeApplicationStation?</h2>
                    <button className="bigChoiceButton" onClick={()=>{setPage("opportunities")}}>I want to provide opportunities</button>
                    <br/>
                    <button className="bigChoiceButton" onClick={()=>{setPage("school")}}>I want to find opportunities</button>
                </>
            
            :
                <>
                    
                        <form onSubmit={signUp}>
                            <input required onChange={(e)=>{setUsername(e.target.value)}} type="text" placeholder="Username" maxLength={300}/>
                            <br/>
                            <input required onChange={(e)=>{setPassword(e.target.value)}} type="password" placeholder="Password" maxLength={300}/>
                            <br/>
                            <input required onChange={(e)=>{setConfirmPassword(e.target.value)}} type="password" placeholder="Confirm password" maxLength={300}/>
                            <br/>
                            <input required onChange={(e)=>{setFirstName(e.target.value)}} type="text" placeholder="First name" maxLength={300}/>
                            <br/>
                            <input required onChange={(e)=>{setLastName(e.target.value)}} type="text" placeholder="Last name" maxLength={300}/>
                            <br/>

                            <Autocomplete
                                apiKey={""}
                                onPlaceSelected={(place) => {
                                    if(place.geometry){
                                        setLocation({coordinates: place.geometry.location.lat() + ", " + place.geometry.location.lng(), formattedAddress: place.formatted_address})
                                    }
                                    else{
                                        alert("Please enter a valid address")
                                    }
                                }}
                                required
                                options = {{types: ["address"]}}
                                placeholder = "Enter your address"
                            />

                            <br/>
                            {page == "school" && <input onChange={(e)=>{setSchool(e.target.value)}} type="text" placeholder="School Name" maxLength={300}/>}
                            <br/>
                            <button type="submit">Sign Up</button>
                        </form>
                </>
            }
        </>
    )
}

export default SignUp;