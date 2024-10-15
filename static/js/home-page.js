//this is kind of jank, i think you can do this with an event but i am too lazy to look up how
window.onload = function() {
    document.getElementById("check-login").onclick = checkLogin;
    //alert("script loaded")
}

//this is what runs when you click the check login button
async function checkLogin() {
    const resp = await fetch("/user-info").then(a => a.json()); //gets the info from the user-info endpoint
    document.getElementById("check-login-output").innerHTML = resp.username; //updates the output with the gotten username
}