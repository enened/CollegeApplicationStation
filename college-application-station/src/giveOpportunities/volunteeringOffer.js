import {useState, useContext, useEffect} from "react";
import Axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { Context } from "../context.js";
import Popup from 'reactjs-popup';
import AddVolunteeringOffer from "./addVolunteeringOffer.js";

function VolunteeringOffer(){
    
    Axios.defaults.withCredentials = true;
    let navigate = useNavigate()
    const {setUser,  user} = useContext(Context);
    const [volunteeringOffers, setVolunteeringOffers] = useState([])
    const [open, setOpen] = useState()

    useEffect(()=>{
        if(user){
            Axios.post("http://localhost:30014/getUserVolunteeringOffers", {userId: user.userId}).then((response)=>{
                setVolunteeringOffers(response.data.volunteeringOffers);
            });
        }
    }, [])


    const deleteVolunteerOffer = (volunteerOfferId, index)=>{
        Axios.post("http://localhost:30014/deleteVolunteerOffer", {volunteerOfferId: volunteerOfferId}).then((response)=>{
            let temp = [...volunteeringOffers]
            temp.splice(index, 1)
            setVolunteeringOffers(temp)
        });
    }

    return(
        <>
            <h3>Your volunteering requests:</h3>

            <div className="flexx">
                {volunteeringOffers.map((val, index)=>{
                    return(
                        <>
                            <div className="rectangularSlide">
                                <h4>{val.request}</h4>
                                <p>{val.details}</p>
                                <p>{val.applicationProccess}</p>
                                <p>Deadline: <input className="date" type="datetime-local" disabled value={val.deadline.substring(0, 16)}/> </p>
                                <p>Address: {val.formattedAddress}</p>
                                <button onClick={()=>{deleteVolunteerOffer(val.volunteerOfferId, index)}} className="lightButton">Delete</button>
                            </div>
                        </>
                    )
                })}
            </div>

            {volunteeringOffers.length == 0 && <p className="inform">No volunteering requests made.</p>}

            <Popup open={open} closeOnDocumentClick = {false} trigger={<button>Make volunteer request</button>}>
                <AddVolunteeringOffer setOpen = {setOpen} setVolunteeringOffers = {setVolunteeringOffers}/>
            </Popup>
            
        </>
    )
}

export default VolunteeringOffer;