import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import cookie from "cookie-session";
import { UserInfo } from "./types"

//you probably dont need any enviroment variables, but if you do this will setup the .env file automatically
//in this example, i have the port in the .env
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const users: Array<UserInfo> = [
    {name: "userA", username: "userA"},
    {name: "userB", username: "userB"}
]

//this means that anything that is put in the static folder will be sent as-is
app.use(express.static('static'))
//this sets us the cookie session for us. the keys is used to secure the data so i just put random text in there, it doesn't really matter
app.use(cookie({
    name: 'session',
    keys: ['put random', 'values in', 'this array'],
}))
//this lets you use the request.body
app.use(express.json())

//this app.get sets endpoints to the webpage, basically paths you can type into the browser after the url
app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "/views/index.html")); 
    //this is the easiest way to just send a webpage. 
    //if you want something more powerful, look up "express render"
    //you can also just put them in your static folder too
});

//login page
app.get("/login", (req: Request, res: Response) => {
    //if the user is logged in, the server will redirect you to the homepage
    //otherwise it will send you the page to log in
    if (req.session?.user) {
        res.redirect("/")
    } else {
        res.sendFile(path.join(__dirname, "/views/login.html"));
    }
});

//logout page
app.get("/logout", (req: Request, res: Response) => {
    //if the user isnt logged in, the server will redirect you to the homepage
    //otherwise it will send you the page to log out
    if (req.session?.user) {
        res.sendFile(path.join(__dirname, "/views/logout.html"));
    } else {
        res.redirect("/")
    }
});

//sample page 1
app.get("/page-1", (req: Request, res: Response) => {
    //if the user is userA, then we serve them page1.dev.html
    //otherwise we serve them page1.html
    if (req.session?.user?.username == "userA") {
        res.sendFile(path.join(__dirname, "/views/page1.dev.html"));
    } else {
        res.sendFile(path.join(__dirname, "/views/page1.html"));
    }
})

//sample page 2
app.get("/page-2", (req: Request, res: Response) => {
    //if the user is userA, then we serve them page2.dev.html
    //otherwise we give them an error
    //this behavior can change to be "404 - Page not Found" or redirecting back to the homepage based on preference
    //its more to show you that you can kinda do whatever you want here
    if (req.session?.user?.username == "userA") {
        res.sendFile(path.join(__dirname, "/views/page2.dev.html"));
    } else {
        res.status(401).end("Unauthorized");
    }
})


//this endpoint is not for sending a webpage, rather it sends JSON. if you look at code for the home page (in home-page.js)
//it calls this endpoint when you press the button to check the user
app.get("/user-info", (req: Request, res: Response) => {
    //this checks if the user is logged in. if it is, it returns their user information. if not it returns Not Logged in
    let user: UserInfo = req.session?.user ? {name: req.session.user.name, username: req.session.user.username} : {username: "Not Logged In!"}
    res.json(user);
});

//this is the function that actually logs in the user
//anything with post is usually a request from the webpage, not a request *for* a webpage
app.post("/login-user", (req: Request, res: Response) => {
    //this is where you would authenticate the user
    //but here im just checking what string is "user" in the body
    if (req.body?.user) {
        if (req.body.user == "userA") {
            //now im setting the sessions user to the proper value
            if (req.session) {
                req.session.user = {name: "userA", username: "userA"};
            } else {
                req.session = {user: {name: "userA", username: "userA"}};
            }
            res.json({name: "userA", username: "userA"}); // this response doesn't rlly matter, cause if the response is 200, the webpage will redirect
        }
        else if (req.body.user == "userB") {
            if (req.session) {
                req.session.user = {name: "userB", username: "userB"};
            } else {
                req.session = {user: {name: "userB", username: "userB"}};
            }
            res.json({name: "userB", username: "userB"});
        } else {
            //input checking
            res.status(400).end("Invalid Input");
        }
    } else {
        res.status(400).end("No Body")
    }
});

//to logout a user, you can just delete their session
app.post("/logout-user", (req: Request, res: Response) => {
    req.session = null;
    res.redirect("/");
})

//this just starts the server. if you need to run anything when the server is being starting, you can throw it into this function
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});