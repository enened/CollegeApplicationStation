import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import {useState} from "react";
import Login from "./login.js";
import SignUp from "./signUp.js";
import {Context} from "./context.js";
import GiveOpportunities from "./giveOpportunities/giveOpportunities.js"
import Header from './header.js';
import FindOpportunities from './findopportunitites/findOpportunities.js';

function App() {
  const [user, setUser] = useState(null)

  return (
    <Context.Provider value={{user, setUser}}>
      <Router>
          <Header/>
          <Routes>
              <Route exact path="/" element={<Login />}/>
              <Route exact path="/signUp" element={<SignUp />}/>
              {/* <Route exact path="/profile" element={<Profile />}/> */}
              <Route exact path="/giveOpportunities" element={<GiveOpportunities />}/>
              <Route exact path="/findOpportunities" element={<FindOpportunities />}/>
              <Route path="*" element={<Navigate to="/" />}/>
          </Routes>
      </Router>
    </Context.Provider>
  );
}

export default App;
