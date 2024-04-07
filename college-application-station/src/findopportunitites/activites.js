import {useState, useContext, useEffect} from "react";
import Axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { Context } from "../context.js";
import Select from 'react-select'
import Popup from 'reactjs-popup';

function Activities(){
    Axios.defaults.withCredentials = true;
    let navigate = useNavigate()
    const {setUser,  user} = useContext(Context);
    const [activities, setActivities] = useState([])
    const [activityType, setActivityType] = useState()
    const [details, setDetails] = useState()
    const [position, setPosition] = useState()
    const [organization, setOrganization] = useState()
    const [gradeLevel, setGradeLevel] = useState()
    const [hours, setHours] = useState()
    const [weeks, setWeeks] = useState()
    const [open, setOpen] = useState()

    useEffect(()=>{
        if(user){
            Axios.post("http://localhost:30014/getStudentActitivites", {userId: user.userId}).then((response)=>{
                setActivities(response.data.activities);
            });
        }
    }, [])

    const addActivity = (e)=>{
        e.preventDefault()
        Axios.post("http://localhost:30014/addActivities", {userId: user.userId, position: position, details: details, organization: organization,  activityType: activityType, gradeLevel: gradeLevel, hours: hours, weeks:weeks}).then((response)=>{
            setOpen(false)
            setActivities((activities)=>{return [...activities, {userId: user.userId, activityId: response.data.activityId, position: position, details: details, organization: organization,  activityType: activityType, gradeLevel: response.data.gradeLevel, hours: hours, weeks:weeks}]})
        });
    }

    const deleteActivity = (activityId, index)=>{
        Axios.post("http://localhost:30014/deleteActivites", {activityId: activityId}).then((response)=>{
            let temp = [...activities]
            temp.splice(index, 1)
            setActivities(temp)
        });
    }

    const updateHours = (newHours, activityId, index)=>{
        Axios.post("http://localhost:30014/updateHours", {activityId: activityId, newHours:newHours}).then((response)=>{
            let temp = [...activities]
            temp[index].hours = newHours
            setActivities(temp)
        });
    }

    const updateWeeks = (newWeeks, activityId, index)=>{
        Axios.post("http://localhost:30014/updateWeeks", {activityId: activityId, newWeeks: newWeeks}).then((response)=>{
            let temp = [...activities]
            temp[index].weeks = newWeeks
            setActivities(temp)
        });
    }



    return(
        <>
            <h3>Your activities:</h3>

            <div className="flexx">
                {activities.map((val, index)=>{
                    
                    return(
                        <>
                            <div className="rectangularSlide">
                                <h3>{val.activityType}</h3>
                                <p>Position: {val.position}</p>
                                {val.organization && <p>Organization: {val.organization}</p>}
                                <p>{val.details}</p>
                                <p>{val.gradeLevel.substring(0, val.gradeLevel.length - 2)}</p>
                                <p>Hours per week: <input className="small" type="number" placeholder="hours" onChange={(e)=>updateHours(e.target.value, val.activityId, index)} value = {val.hours}/></p>
                                <p>Weeks per year: <input className="small" type="number" placeholder="weeks" onChange={(e)=>updateWeeks(e.target.value, val.activityId, index)} value = {val.weeks}/> </p>
                                <button onClick={()=>deleteActivity(val.activityId, index)} className="lightButton">Delete</button>
                            </div>
                        </>
                    )
                })}

            </div>

            {activities.length == 0 && <p className="inform">No activities added.</p>}

            <Popup open={open} closeOnDocumentClick = {false} trigger={<button>Add activity</button>}>
               <>
                    <form className="basicSlide" onSubmit={addActivity}>
                        <h4>Activity</h4>

                        <Select required onChange={(e)=>{setActivityType(e.value)}} placeholder = "Type of activity" className="dropdown" options={
                            [
                                {value: "Club", label: "Club"},
                                {value: "Art/Music", label: "Art/Music"},
                                {value: "Sports", label: "Sports"},
                                {value: "Volunteering", label: "Volunteering"},
                                {value: "Work", label: "Work"},
                                {value: "Other activities", label: "Other activities"},
                            ]
                        }/>                        
                        
                        <input onChange={(e)=>{setPosition(e.target.value)}} required type="text" placeholder="Position/Leadership position"/>
                        <br/>

                        <input onChange={(e)=>{setOrganization(e.target.value)}} type="text" placeholder="Organization (optional)"/>
                        <br/>

                        <textarea onChange={(e)=>{setDetails(e.target.value)}} required type="text" placeholder="Description, accomplishments, other details"></textarea>
                        <br/>

                        <Select required isMulti onChange={(e)=>{setGradeLevel(e)}} placeholder = "Grade level" className="dropdown" options={
                            [
                                {value: "9th", label: "9th"},
                                {value: "10th", label: "10th"},
                                {value: "11th", label: "11th"},
                                {value: "12th", label: "12th"},
                            ]
                        }/>    

                        <input onChange={(e)=>{setHours(e.target.value)}} required type="number" placeholder="Hours spent per week"/>
                        <br/>   

                        <input onChange={(e)=>{setWeeks(e.target.value)}} required type="number" placeholder="Weeks spent per year"/>
                        <br/>   

                        <button type="submit" className="lightButton">Add</button>

                    </form>
               </>
            </Popup>
            
        </>
    )
}

export default Activities;