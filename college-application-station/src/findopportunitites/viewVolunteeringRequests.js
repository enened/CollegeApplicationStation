import {useState, useContext, useEffect} from "react";
import Axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { Context } from "../context.js";
import * as geolib from 'geolib';

function ViewVolunteeringRequests(){
    Axios.defaults.withCredentials = true;
    let navigate = useNavigate()
    const {setUser,  user} = useContext(Context);
    const [volunteeringOffers, setVolunteeringOffers] = useState([])


    function quickSortByDistance(array) {
        if (array.length <= 1) {
          return array;
        }
      
        let distance = geolib.getDistance({latitude: parseInt(user.coordinates.slice(0, user.coordinates.indexOf(","))), longitude: parseInt(user.coordinates.slice(user.coordinates.indexOf(",") + 1, user.coordinates.length))}, {
            latitude: parseInt(array[0].coordinates.slice(0, array[0].coordinates.indexOf(","))), 
            longitude: parseInt(array[0].coordinates.slice(array[0].coordinates.indexOf(",") + 1, array[0].coordinates.length + 1))
        })

        var pivot = distance;
        
        var left = []; 
        var right = [];
      
        for (var i = 1; i < array.length; i++) {

            let distance = geolib.getDistance({latitude: parseInt(user.coordinates.slice(0, user.coordinates.indexOf(","))), longitude: parseInt(user.coordinates.slice(user.coordinates.indexOf(",") + 1, user.coordinates.length))}, {
                latitude: parseInt(array[i].coordinates.slice(0, array[i].coordinates.indexOf(","))), 
                longitude: parseInt(array[i].coordinates.slice(array[i].coordinates.indexOf(",") + 1, array[i].coordinates.length + 1))
            })

            distance < pivot ? left.push(array[i]) : right.push(array[i]);
        }
      
        return quickSortByDistance(left).concat(array[0], quickSortByDistance(right));
    };

    useEffect(()=>{
        if(user){
            Axios.post("http://localhost:30014/getVolunteeringRequests").then((response)=>{
                console.log(quickSortByDistance(response.data.volunteeringOffers))
                setVolunteeringOffers(quickSortByDistance(response.data.volunteeringOffers));
            });
        }
    }, [])

    return(
        <>
            <h2>Volunteering opportunities:</h2>
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
                            </div>
                        </>
                    )
                })}
            </div>

            {volunteeringOffers.length == 0 && <p className="inform">No opportunities available</p>}
        </>
    )   
}

export default ViewVolunteeringRequests;