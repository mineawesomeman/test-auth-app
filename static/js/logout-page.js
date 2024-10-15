window.onload = function() {
    document.getElementById("logout").onclick = logout;
    //alert("script loaded")
}

//calls the endpoint on the server to login the user
async function logout() {
    await fetch("/logout-user", {
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST",
    }).then(() => window.location.replace("/"));
}