import {useState, useContext, useEffect} from "react";
import Axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { Context } from "../context.js";

function ViewScholarshipOpportunitites(){
    Axios.defaults.withCredentials = true;
    let navigate = useNavigate()
    const {user} = useContext(Context);
    const [scholarshipOffers, setScholarshipOffers] = useState([])

    useEffect(()=>{
        if(user){
            Axios.post("http://localhost:30014/getScholarshipOffers").then((response)=>{
                setScholarshipOffers(response.data.scholarshipOffers);
                
            });
        }
    }, [])

    return(
        <>
            <h2>Scholarship opportunities:</h2>
            <div className="flexx">
                {scholarshipOffers.map((val, index)=>{
                    return(
                        <>
                            <div className="rectangularSlide">
                                <h4>${val.offer}</h4>
                                <p>{val.details}</p>
                                <p>{val.applicationProccess}</p>
                                <p>Deadline: <input className="date" type="datetime-local" disabled value={val.deadline.substring(0, 16)}/> </p>
                            </div>
                        </>
                    )
                })}
            </div>

            {scholarshipOffers.length == 0 && <p className="inform">No opportunities available</p>}

        </>
    )   
}

export default ViewScholarshipOpportunitites;