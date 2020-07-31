const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", (req,res)=>{
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req,res) => {

    const firstname = req.body.fname;
    const lastname = req.body.lname;
    const email = req.body.email;

    const data = {
        members : [
            {
                email_address: email,
                status : "subscribed",
                merge_fields : {
                    FNAME: firstname,
                    LNAME: lastname,
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us17.api.mailchimp.com/3.0/lists/f4d68a248e";

    const options = {
        method: "POST",
        auth: "nart:d4f09acea5a701be81a326544c53f392-us17"
    };

    const request = https.request(url, options,(response) =>{
       
       if(response.statusCode === 200) {
           res.sendFile(__dirname + "/sucess.html");
       } else {
           res.sendFile(__dirname + "/failure.html");
       }
        response.on("data", (data)=>{
            console.log(JSON.parse(data));
        });

    });

    request.write(jsonData);
    request.end();

    console.log(firstname, lastname, email);

});

app.post("/failure", (req,res)=> {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000;")
});

//API KEY :: d4f09acea5a701be81a326544c53f392-us17
// audience id :: f4d68a248e