import {useState, useContext, useEffect} from "react";
import Axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { Context } from "../context.js";

function AIAnalysis(){
    Axios.defaults.withCredentials = true;
    let navigate = useNavigate()
    const {user} = useContext(Context);
    const [advice, setAdvice] = useState("")
    const [query, setQuery] = useState("")
    const [loading, setLoading] = useState(false)
    const [essay, setEssay] = useState()
    const [essayQuery, setEssayQuery] = useState()
    const [essayAdvice, setEssayAdvice] = useState()

    const getAIApplicationAnalysis = ()=>{
        setLoading(true)
        Axios.post("http://localhost:30014/getAIAnalysis", {userId: user.userId, query: query}).then((response)=>{
            setAdvice(response.data.advice);
            setLoading(false)
        });
    }

    const getAIEssayAnalysis = ()=>{
        setLoading(true)
        Axios.post("http://localhost:30014/getAIAnalysis", {userId: user.userId, query: "Analyze the provided essay and take into account this specification: " + essayQuery + ". This is the essay: " + essay}).then((response)=>{
            setEssayAdvice(response.data.advice);
            setLoading(false)
        });
    }

    return(
        <>
            <div className="whiteSlide">
                <h2>AI application analysis:</h2>
                <input onChange={(e)=>{setQuery(e.target.value)}} type="text" placeholder="Ask something about your application"/>
                <button onClick={getAIApplicationAnalysis}>Ask</button>
                {!loading ? <p className="advice">{advice}</p> : <p className="inform">Loading...</p>}
            </div>

            <div className="whiteSlide">
                <h2>AI essay analysis:</h2>
                <textarea style={{"width":"1500px", "height":"500px"}} onChange={(e)=>{setEssay(e.target.value)}} type="text" placeholder="Type your essay here"/>
                <br/>
                <input onChange={(e)=>{setEssayQuery(e.target.value)}} type="text" placeholder="Add any requests or specefications here"/>
                <br/>
                <button onClick={getAIEssayAnalysis}>Analyze</button>
                {!loading ? <p className="advice">{essayAdvice}</p> : <p className="inform">Loading...</p>}
            </div>
        </>
    )   
}

export default AIAnalysis;