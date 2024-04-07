import {useState, useContext, useEffect} from "react";
import Axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { Context } from "../context.js";
import Autocomplete from "react-google-autocomplete";

function AddVolunteeringOffer({setOpen, setVolunteeringOffers}){
    Axios.defaults.withCredentials = true;
    let navigate = useNavigate()
    const {setUser,  user} = useContext(Context);
    const [request, setRequest] = useState()
    const [details, setDetails] = useState()
    const [deadline, setDeadline] = useState()
    const [location, setLocation] = useState()
    const [applicationProccess, setApplicationProccess] = useState()

    const addVolunteeringOffer = (e)=>{
        e.preventDefault()
        Axios.post("http://localhost:30014/addVolunteeringOffer", {userId: user.userId, request: request, details: details, deadline: deadline, location: location, applicationProccess: applicationProccess}).then((response)=>{
            setOpen(false)
            setVolunteeringOffers((volunteeringOffers)=>{return [...volunteeringOffers, {volunteerOfferId: response.data.volunteerOfferId, userId: user.userId, request: request, details: details, deadline: deadline, formattedAddress: location.formattedAddress, coordinates: location.coordinates, volunteerOfferId: response.data.volunteerOfferId, applicationProccess: applicationProccess}]})
        });
    }

    return(
        <>
            <form className="basicSlide" onSubmit={addVolunteeringOffer}>
                <h4>Volunteering request</h4>
                <input onChange={(e)=>{setRequest(e.target.value)}} required type="text" placeholder="Request"/>
                <textarea onChange={(e)=>{setDetails(e.target.value)}} required type="text" placeholder="Description, requirements, # of hours, other details"></textarea>
                <br/>
                <textarea onChange={(e)=>{setApplicationProccess(e.target.value)}} required type="text" placeholder="Application process, links to apply, contact information"></textarea>
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
                    placeholder = "Enter event address"
                />

                <label>Deadline:</label>
                <input onChange={(e)=>{setDeadline(e.target.value)}} required type="datetime-local"/>
                <br/>

                <button type="submit" className="lightButton">Request</button>
            </form>
        </>
    )
}

export default AddVolunteeringOffer;