import {useState, useContext, useEffect} from "react";
import Axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { Context } from "../context.js";
import Activities from "./activites.js";
import Awards from "./awards.js";
import AIAnalysis from "./aiAnalysis.js";
import Grade from "./grade.js";

function CollegeApplication(){
    Axios.defaults.withCredentials = true;
    let navigate = useNavigate()
    const {setUser,  user} = useContext(Context);
    const [page, setPage] = useState("activities")


    return(
        <>
            <h2>College application</h2>

            {/* tabs to move through pages */}
            <button className={page == "activities" ? "activeTab" : "unactiveTab"} onClick={()=>{setPage("activities")}}>Activities</button>
            <button className={page == "awards" ? "activeTab" : "unactiveTab"} onClick={()=>{setPage("awards")}}>Awards/Honors</button>
            <button className={page == "Grades" ? "activeTab" : "unactiveTab"} onClick={()=>{setPage("Grades")}}>Grades</button>
            <button className={page == "AI analysis" ? "activeTab" : "unactiveTab"} onClick={()=>{setPage("AI analysis")}}>AI analysis</button>

            {page == "activities" && <Activities/>}
            {page == "awards" && <Awards/>}
            {page == "Grades" && <Grade/>}
            {page == "AI analysis" && <AIAnalysis/>}
            
        </>
    )   
}

export default CollegeApplication;