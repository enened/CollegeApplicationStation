import {useState, useContext, useEffect} from "react";
import Axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { Context } from "../context.js";
import Select from 'react-select'
import Popup from 'reactjs-popup';

function Awards(){
    Axios.defaults.withCredentials = true;
    let navigate = useNavigate()
    const {user} = useContext(Context);
    const [awards, setAwards] = useState([])
    const [details, setDetails] = useState()
    const [title, setTitle] = useState()
    const [levelOfRecognition, setLevelOfRecognition] = useState()
    const [gradeLevel, setGradeLevel] = useState()
    const [open, setOpen] = useState()

    useEffect(()=>{
        if(user){
            Axios.post("http://localhost:30014/getStudentAwards", {userId: user.userId}).then((response)=>{
                setAwards(response.data.awards);
            });
        }
    }, [])

    const addAward = (e)=>{
        e.preventDefault()
        Axios.post("http://localhost:30014/addAwards", {userId: user.userId, title: title, details: details, levelOfRecognition: levelOfRecognition, gradeLevel: gradeLevel}).then((response)=>{
            setOpen(false)
            setAwards((awards)=>{return [...awards, {awardId: response.data.awardId, userId: user.userId, title: title, details: details, levelOfRecognition: levelOfRecognition, gradeLevel: response.data.gradeLevel}]})
        });
    }

    const deleteAward = (awardId, index)=>{
        Axios.post("http://localhost:30014/deleteAwards", {awardId: awardId}).then((response)=>{
            let temp = [...awards]
            temp.splice(index, 1)
            setAwards(temp)
        });
    }


    return(
        <>
            <h3>Your awards/honors:</h3>

            <div className="flexx">
                {awards.map((val, index)=>{
                    
                    return(
                        <>
                            <div className="rectangularSlide">
                                <h3>{val.title}</h3>
                                <p>Level: {val.levelOfRecognition}</p>
                                <p>Grade(s): {val.gradeLevel.substring(0, val.gradeLevel.length - 2)}</p>
                                <p>{val.details}</p>
                                <button className="lightButton" onClick={()=>deleteAward(val.awardId, index)}>Delete</button>
                            </div>
                        </>
                    )
                })}

            </div>

            {awards.length == 0 && <p className="inform">No awards added.</p>}

            <Popup open={open} closeOnDocumentClick = {false} trigger={<button>Add award</button>}>
               <>
                    <form className="basicSlide" onSubmit={addAward}>

                        <h4>Award/honor</h4>
                        <input onChange={(e)=>{setTitle(e.target.value)}} required type="text" placeholder="Awards title"/>
                        <br/>

                        <textarea onChange={(e)=>{setDetails(e.target.value)}} type="text" placeholder="Description"></textarea>
                        <br/>

                        <Select required isMulti onChange={(e)=>{setGradeLevel(e)}} placeholder = "Grade level" className="dropdown" options={
                            [
                                {value: "9th", label: "9th"},
                                {value: "10th", label: "10th"},
                                {value: "11th", label: "11th"},
                                {value: "12th", label: "12th"},
                            ]
                        }/>    

                        <Select required onChange={(e)=>{setLevelOfRecognition(e.value)}} placeholder = "Level of recognition" className="dropdown" options={
                            [
                                {value: "School", label: "School"},
                                {value: "State/regional", label: "State/regional"},
                                {value: "National", label: "National"},
                                {value: "International", label: "International"},
                            ]
                        }/>     

                        <button type="submit" className="lightButton">Add</button>

                    </form>
               </>
            </Popup>
            
        </>
    )
}

export default Awards;