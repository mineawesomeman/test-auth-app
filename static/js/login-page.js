window.onload = function() {
    document.getElementById("userA-login").onclick = () => login("userA");
    document.getElementById("userB-login").onclick = () => login("userB");
    //alert("script loaded")
}

//calls the endpoint on the server to login the user
async function login(user) {
    const body = {
        user
    }

    await fetch("/login-user", {
        headers: {
            "Content-Type": "application/json" //fun fact! you need this or else express will ignore it lmao
        },
        method: "POST",
        body: JSON.stringify(body)
    }).then((res) => {
        if (res.ok) {
            window.location.replace("/");
        } else {
            alert("unable to login");
        }
    });
}