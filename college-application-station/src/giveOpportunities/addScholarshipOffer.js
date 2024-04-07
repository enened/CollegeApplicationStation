import {useState, useContext, useEffect} from "react";
import Axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { Context } from "../context.js";

function AddScholarshipOffer({setOpen, setScholarshipOffers}){
    Axios.defaults.withCredentials = true;
    let navigate = useNavigate()
    const {setUser,  user} = useContext(Context);
    const [offer, setOffer] = useState()
    const [details, setDetails] = useState()
    const [deadline, setDeadline] = useState()
    const [applicationProccess, setApplicationProccess] = useState()

    const addScholarshipOffer = (e)=>{
        e.preventDefault()
        Axios.post("http://localhost:30014/addScholarshipOffer", {userId: user.userId, offer: offer, details: details, deadline: deadline, applicationProccess: applicationProccess}).then((response)=>{
            setOpen(false)
            setScholarshipOffers((volunteeringOffers)=>{return [...volunteeringOffers, {scholarshipOfferId: response.data.scholarshipOfferId, userId: user.userId, offer: offer, details: details, deadline: deadline,  applicationProccess: applicationProccess}]})
        });
    }

    return(
        <>
            <form className="basicSlide" onSubmit={addScholarshipOffer}>
                <h4>Scholarship offer</h4>
                <input onChange={(e)=>{setOffer(e.target.value)}} min={1} step={.01} required type="number" placeholder="Dollar amount"/>
                <textarea onChange={(e)=>{setDetails(e.target.value)}} required type="text" placeholder="Description, requirements, other details"></textarea>
                <br/>
                <textarea onChange={(e)=>{setApplicationProccess(e.target.value)}} required type="text" placeholder="Application process, links to apply, contact information"></textarea>
                <br/>

                <label>Deadline:</label>
                <input onChange={(e)=>{setDeadline(e.target.value)}} required type="datetime-local"/>
                <br/>

                <button type="submit" className="lightButton">offer</button>
            </form>
        </>
    )
}

export default AddScholarshipOffer;