import {useState, useContext, useEffect} from "react";
import Axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { Context } from "../context.js";
import checkLoggedIn from "../checkLoggedIn.js";
import VolunteeringOffer from "./volunteeringOffer.js";
import ScholarshipOffer from "./scholarshipOffer.js";

function GiveOpportunities(){
    Axios.defaults.withCredentials = true;
    let navigate = useNavigate()
    const {setUser,  user} = useContext(Context);
    const [page, setPage] = useState("volunteering")

    useEffect(()=>{
        if(!user){
            checkLoggedIn(setUser).then((user)=>{
                if(user){
                    setUser(user)
                    if (user.school){
                        navigate("/findOpportunities")
                    }        
                }
                else{
                    navigate("/")
                }
            })
        }
    }, [])



    return(
        <>
            <button className={page == "volunteering" ? "activeTab" : "unactiveTab"} onClick={()=>{setPage("volunteering")}}>Volunteering</button>
            <button className={page == "scholarships" ? "activeTab" : "unactiveTab"} onClick={()=>{setPage("scholarships")}}>Scholarships</button>

            {page == "volunteering" && <VolunteeringOffer/>}
            {page == "scholarships" && <ScholarshipOffer/>}
        </>
    )
}

export default GiveOpportunities;