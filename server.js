const express = require("express"); //Import the express dependecy
const app = express(); //Initiate an express app
const port = 2005; //Save the port


//middleware
app.use(express.static("public")); //anything inside the folder, is available as a static file to the front end
app.use(express.urlencoded({extended: true})); //takes all the data in our form and parses it into an object

// view engine
app.set('view engine', 'ejs');


//routes
// app.get("/index.html", (req,res) => { //get request to the root
//    res.sendFile("index.html", {root:__dirname});  
// });

// app.get("/", (req,res) => {
//     res.redirect(301, "index.html");
// });

app.get("/", (req, res) => res.redirect("/index"));
app.get("/index", (req,res) => res.render("index"));

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});