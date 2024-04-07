import {useState, useContext, useEffect} from "react";
import Axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { Context } from "../context.js";
import Popup from 'reactjs-popup';
import AddScholarshipOffer from "./addScholarshipOffer.js";

function ScholarshipOffer(){
    
    Axios.defaults.withCredentials = true;
    let navigate = useNavigate()
    const {setUser,  user} = useContext(Context);
    const [scholarshipOffers, setScholarshipOffers] = useState([])
    const [open, setOpen] = useState()

    useEffect(()=>{
        if(user){
            Axios.post("http://localhost:30014/getUserScholarshipsOffers", {userId: user.userId}).then((response)=>{
                setScholarshipOffers(response.data.scholarshipOffers);
            });
        }
    }, [])


    const deleteScholarshipOffer = (scholarshipOfferId, index)=>{
        Axios.post("http://localhost:30014/deleteScholarshipOffer", {scholarshipOfferId: scholarshipOfferId}).then((response)=>{
            let temp = [...scholarshipOffers]
            temp.splice(index, 1)
            setScholarshipOffers(temp)
        });
    }

    return(
        <>
            <h3>Scholarships you are offering:</h3>

            <div className="flexx">
                {scholarshipOffers.map((val, index)=>{
                    return(
                        <>
                            <div className="rectangularSlide">
                                <h4>${val.offer}</h4>
                                <p>{val.details}</p>
                                <p>{val.applicationProccess}</p>
                                <p>Deadline: <input className="date" type="datetime-local" disabled value={val.deadline.substring(0, 16)}/> </p>
                                <button onClick={()=>{deleteScholarshipOffer(val.scholarshipOfferId, index)}} className="lightButton">Delete</button>
                            </div>
                        </>
                    )
                })}

            </div>

            {scholarshipOffers.length == 0 && <p className="inform">No scholarships offered.</p>}

            <Popup open={open} closeOnDocumentClick = {false} trigger={<button>Offer scholarship</button>}>
                <AddScholarshipOffer setOpen = {setOpen} setScholarshipOffers = {setScholarshipOffers}/>
            </Popup>
            
        </>
    )
}

export default ScholarshipOffer;