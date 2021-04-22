//@ts-check
"use strict";
fetch(location.href).then(res => res.json())
    .then((out) => {
        console.log('Checkout this JSON! ', out)
    });

window.onload = () => urlElementsCheck();
let token;

function urlElementsCheck() {

    try {
        const url = new URL(window.location.href);
        if (url.hash === null || url.hash === "") {
            console.log("You don't have the token")
            OAuth20();
        } else {
            console.log("You have the token" + "\n" + url.hash);
            token = url.hash.substring(url.hash.indexOf("&access_token=") + 14,
                url.hash.indexOf("&token_type="));
        }
    } catch (error) {
        console.error();
    }
}

function OAuth20() {
    window.location.replace("https://accounts.google.com/o/oauth2/v2/auth?" +
        "scope=https://www.googleapis.com/auth/classroom.courses&" +
        "include_granted_scopes=true&" +
        "response_type=token&" +
        "state=state_parameter_passthrough_value&" +
        "redirect_uri=http://localhost:63342/WebApp/index.html&" +
        "client_id=82346440292-hlpvrpvqk6epjgqkk93566mdd6mtqocp.apps.googleusercontent.com");
}

function Fetch() {
    let header = new Headers();
    header.append('Authorization', 'access_token' + token);
    let req = new Request("https://classroom.googleapis.com/v1/courses", {
        method: 'GET',
        headers: header
    })
    fetch(req).then((response) => {
        console.log(response.json());
    })
}

/*console.log("banana");
fetch('https://zhermit09.github.io/raycaster/index.html')
    .then((response)=> {
        console.log("yes", response);
        return response.json();
    })
    .then((data) =>{
        console.log(data)
    })
    .catch((error)=>{
        console.log("network error?", error)
})
*/
// for retrieving html
/*.then(res => res.text())
.then(function (html){
    let parser = new DOMParser();
    let doc = parser.parseFromString(html, 'text/html');
    console.log(doc)
})*/