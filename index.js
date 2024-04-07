const express = require("express");
const app = express();
var mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser')
const bcrypt = require("bcrypt");
const saltRounds = 10;
const session = require("express-session");
const cookieParser = require('cookie-parser');
const axios = require("axios")

// configure chatGPT API
const OpenAI  = require('openai');
const openai = new OpenAI({apiKey: "",});

// database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'college_application_station'
});

app.listen(30014, ()=> {console.log(`Server started on port 30014`)});
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser());
app.use(express.json())
app.use(cors({origin: ["http://localhost:3000"], methods: ["GET", "POST"], credentials: true}))
app.use(session({key: "userLogin", secret: "dfrhkiu8W3F3DF4DFF66FD534tiu43v 74ndgvkjmc pa,d;ad;74ajmi7w012uLKNfdf74HFB3590SNDGgR7SIHl~ANE", resave: false, saveUninitialized: false, cookie: {expires: (60*60*24*60)}}, ))

// sign out by removing session
app.post("/signOut",  (req, res) => {
    req.session.user = null
    res.send("ok")
})
  
// retrieve login session
app.get("/login",  (req, res) => {
  res.send({user: req.session.user})
})

// sign up for an account
app.post("/signUp",  (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const school = req.body.school;
    const location = req.body.location;

    // check whether username already exists
    db.query("select userId from login where binary username = ?", [username], (err, result)=>{
        if (err){console.log(err)}
    
        if (result.length == 0){
    
            // encrypt password
            bcrypt.hash(password, saltRounds, (err, hash)=>{
    
                if (err){console.log(err)}
        
                // add encrypted password to database
                db.query("insert into login(username, password, firstName, lastName, school, formattedAddress, coordinates) values(?, ?, ?, ?, ?, ?, ?)", [username, hash, firstName, lastName, school, location.formattedAddress, location.coordinates], (err, result)=>{
        
                    if (err){console.log(err)}
        
                    // create session for user and send userId
                    req.session.user = {userId: result.insertId, username: username};
                    res.send({user: {userId: result.insertId, username: username, firstName: firstName, lastName: lastName, formattedAddress: location.formattedAddress, formattedAddress: location.coordinates, school:school}})
                })
    
            })
        }
        else{
            res.send("username in use")
        }
    })
})
  
// login
app.post("/login",  (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query(`select * from login where binary username = ?`, [username, password], (err, result) => {
        if (err){console.log(err)}

        if (result.length > 0){

            bcrypt.compare(password, result[0].password, (err, response)=>{
                if (err){console.log(err)}

                if (response){
                    req.session.user = result[0];
                    res.send({user: result[0]})
                }

                else{
                    res.send("Wrong combo")
                }
            })
        }

        else{
            res.send("Wrong combo")
        }
    })
})

// get volunteer requests made by users
app.post("/getUserVolunteeringOffers",  (req, res) => {
    const userId = req.body.userId;

    db.query(`select * from volunteering_offers where userId = ?`, [userId], (err, result) => {
        if (err){console.log(err)}

        else{
            res.send({volunteeringOffers: result})
        }
    })
})

// get user scholarship offers
app.post("/getUserScholarshipsOffers",  (req, res) => {
    const userId = req.body.userId;

    db.query(`select * from scholarship_offers where userId = ?`, [userId], (err, result) => {
        if (err){console.log(err)}

        else{
            res.send({scholarshipOffers: result})
        }
    })
})

// add volunteering request to database
app.post("/addVolunteeringOffer",  (req, res) => {
    const userId = req.body.userId;
    const request = req.body.request;
    const details = req.body.details;
    const deadline = req.body.deadline;
    const location = req.body.location;
    const applicationProccess = req.body.applicationProccess;
    db.query(`insert into volunteering_offers (userId, request, details, deadline, formattedAddress, coordinates, applicationProccess) values(?, ?, ?, ?, ?, ?, ?)`, [userId, request, details, deadline, location.formattedAddress, location.coordinates, applicationProccess], (err, result) => {
        if (err){console.log(err)}

        else{
            res.send({volunteerOfferId: result.insertId})
        }
    })
})

// add scholarship offer to database
app.post("/addScholarshipOffer",  (req, res) => {
    const userId = req.body.userId;
    const offer = req.body.offer;
    const details = req.body.details;
    const deadline = req.body.deadline;
    const applicationProccess = req.body.applicationProccess;

    db.query(`insert into scholarship_offers (userId, offer, details, deadline, applicationProccess) values(?, ?, ?, ?, ?)`, [userId, offer, details, deadline, applicationProccess], (err, result) => {
        if (err){console.log(err)}

        else{
            res.send({scholarshipOfferId: result.insertId})
        }
    })
})

// get all volunteer requests
app.post("/getVolunteeringRequests",  (req, res) => {

    db.query(`select * from volunteering_offers`, (err, result) => {
        if (err){console.log(err)}

        else{
            res.send({volunteeringOffers: result})
        }
    })
})

// get all scholarship offers
app.post("/getScholarshipOffers",  (req, res) => {

    db.query(`select * from scholarship_offers`, (err, result) => {
        if (err){console.log(err)}

        else{
            res.send({scholarshipOffers: result})
        }
    })
})

// get student users actvities recorded
app.post("/getStudentActitivites",  (req, res) => {
    const userId = req.body.userId;

    db.query(`select * from activities where userId = ?`, [userId], (err, result) => {
        if (err){console.log(err)}

        else{
            res.send({activities: result})
        }
    })
})

// get student users awards recorded
app.post("/getStudentAwards",  (req, res) => {
    const userId = req.body.userId;

    db.query(`select * from awards where userId = ?`, [userId], (err, result) => {
        if (err){console.log(err)}

        else{
            res.send({awards: result})
        }
    })
})

// add user activities to database
app.post("/addActivities",  (req, res) => {
    const userId = req.body.userId;
    const position = req.body.position;
    const details = req.body.details;
    const organization = req.body.organization;
    const activityType = req.body.activityType;
    let gradeLevel = req.body.gradeLevel;
    const hours = req.body.hours;
    const weeks = req.body.weeks;
    let final = ""

    gradeLevel.forEach(gradelevel => {
        final += gradelevel.value + ", "
    });

    db.query(`insert into activities (userId, position, details, organization, activityType, gradeLevel, hours, weeks) values(?, ?, ?, ?, ?, ?, ?, ?)`, [userId, position, details, organization, activityType, final, hours, weeks], (err, result) => {
        if (err){console.log(err)}

        else{
            res.send({activityId: result.insertId, gradeLevel: final})
        }
    })
})

// add user awards to database
app.post("/addAwards",  (req, res) => {
    const userId = req.body.userId;
    const details = req.body.details;
    const title = req.body.title;
    const levelOfRecognition = req.body.levelOfRecognition;
    let gradeLevel = req.body.gradeLevel;
    let final = ""

    gradeLevel.forEach(gradelevel => {
        final += gradelevel.value + ", "
    });

    db.query(`insert into awards (userId, title, details,  gradeLevel, levelOfRecognition) values(?, ?, ?, ?, ?)`, [userId, title, details, final, levelOfRecognition], (err, result) => {
        if (err){console.log(err)}

        else{
            res.send({awardId: result.insertId, gradeLevel: final})
        }
    })
})

// delete volunteering request from database
app.post("/deleteVolunteerOffer",  (req, res) => {
    const volunteerOfferId = req.body.volunteerOfferId;

    db.query(`delete from volunteering_offers where volunteerOfferId = ?`, [volunteerOfferId], (err, result) => {
        if (err){console.log(err)}

        else{
            res.send("ok")
        }
    })
})

// delete scholarship offer from database
app.post("/deleteScholarshipOffer",  (req, res) => {
    const scholarshipOfferId = req.body.scholarshipOfferId;

    db.query(`delete from scholarship_offers where scholarshipOfferId = ?`, [scholarshipOfferId], (err, result) => {
        if (err){console.log(err)}

        else{
            res.send("ok")
        }
    })
})

// delete user activities from database
app.post("/deleteActivites",  (req, res) => {
    const activityId = req.body.activityId;

    db.query(`delete from activities where activityId = ?`, [activityId], (err, result) => {
        if (err){console.log(err)}

        else{
            res.send("ok")
        }
    })
})

// delete user awards from database
app.post("/deleteAwards",  (req, res) => {
    const awardId = req.body.awardId;

    db.query(`delete from awards where awardId = ?`, [awardId], (err, result) => {
        if (err){console.log(err)}

        else{
            res.send("ok")
        }
    })
})

// get AI analysis for student application
app.post("/getAIAnalysis", (req, res)=>{
    const query = req.body.query;
    const userId = req.body.userId;

    db.query(`select * from activities where userId = ?`, [userId], (err, activities) => {
        if (err){console.log(err)}
        
        else{
            db.query(`select * from awards where userId = ?`, [userId], async (err, awards) => {
                if (err){console.log(err)}
        
                else{
                    let activityInfo = ""
                    for (let index = 0; index < activities.length; index++) {
                        activityInfo += "| activity type: " + activities[index].activityType + "| position: " + activities[index].position + "| details: " + activities[index].details +
                        "| organization: " + activities[index].organization + "| grade level: " + activities[index].gradeLevel + "| hours in a year: " + activities[index].hours + "| weeks in a year: " + activities[index].weeks + "||" 
                    }

                    let awardInfo = ""
                    for (let index = 0; index < awards.length; index++) {
                        awardInfo += "| title: " + awards[index].title + "| details: " + awards[index].details +
                        "| level of recognition: " + awards[index].levelOfRecognition + "| grade level: " + awards[index].gradeLevel + "|" 
                    }

                    const advice = await openai.chat.completions.create({
                        model: "gpt-3.5-turbo",
                        messages: [{role: "system", content: `Given some information about a high school student's college application, answer their query. This is their activities: |` + activityInfo + " and this is their awards: |" + awardInfo}, 
                        {role: "user", content: query}],
                    });          
                    
                    res.send({advice: advice.choices[0].message.content});
                }
            })
        }
    })

})

// edit hours for activities
app.post("/updateHours",  (req, res) => {
    const activityId = req.body.activityId;
    const newHours = req.body.newHours;

    db.query(`update activities set hours = ? where activityId = ?`, [newHours, activityId], (err, result) => {
        if (err){console.log(err)}

        else{
            res.send("ok")
        }
    })
})

// edit weeks for activities
app.post("/updateWeeks",  (req, res) => {
    const activityId = req.body.activityId;
    const newWeeks = req.body.newWeeks;

    db.query(`update activities set weeks = ? where activityId = ?`, [newWeeks, activityId], (err, result) => {
        if (err){console.log(err)}

        else{
            res.send("ok")
        }
    })
})

// get HAC grade info
app.post("/getHACinfo",  (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    axios.get(`https://homeaccesscenterapi.vercel.app/api/transcript?link=https://lis-hac.eschoolplus.powerschool.com/&user=${username}&pass=${password}`).then((response)=>{
        if(response.data.error){
            res.send("wrong combo")
        }
        else{
            res.send(response.data)
        }
    });
})


