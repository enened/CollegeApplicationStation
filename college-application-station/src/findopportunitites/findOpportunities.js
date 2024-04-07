import {useState, useContext, useEffect} from "react";
import Axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { Context } from "../context.js";
import checkLoggedIn from "../checkLoggedIn.js";
import ViewVolunteeringRequests from "./viewVolunteeringRequests.js";
import ViewScholarshipOpportunitites from "./viewScholarshipOpportunities.js";
import CollegeApplication from "./collegeApplication.js";

function FindOpportunities(){
    Axios.defaults.withCredentials = true;
    let navigate = useNavigate()
    const {setUser,  user} = useContext(Context);
    const [page, setPage] = useState("collegeApplication")
    const [menuOpen, setMenuOpen] = useState()

    useEffect(()=>{
        if(!user){
            checkLoggedIn(setUser).then((user)=>{
                if(user){
                    setUser(user)
                    if (!user.school){
                        navigate("/giveOpportunities")
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

            <div style={{"float":"left"}}>
                <div onClick={()=>{setMenuOpen(!menuOpen)}}>
                    <div className="menuBar"></div>
                    <div className="menuBar"></div>
                    <div className="menuBar"></div>
                </div>
          
                <div className={menuOpen ? "menu" : "noDisplay"}>
                <p className={page == "collegeApplication" ? "activeMenuOption" : "unactiveMenuOption"} onClick={()=>{setPage("collegeApplication")}}>College application</p>
                    <p className={page == "volunteering" ? "activeMenuOption" : "unactiveMenuOption"} onClick={()=>{setPage("volunteering")}}>Volunteering opportunities</p>
                    <p className={page == "scholarships" ? "activeMenuOption" : "unactiveMenuOption"} onClick={()=>{setPage("scholarships")}}>Scholarship opportunities</p>
                </div>
            </div>
            {page == "collegeApplication" && <CollegeApplication />}
            {page == "volunteering" && <ViewVolunteeringRequests />}
            {page == "scholarships" && <ViewScholarshipOpportunitites />}
        </>
    )   
}

export default FindOpportunities;