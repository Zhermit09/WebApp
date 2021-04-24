//@ts-check
"use strict";
window.onload = () => urlElementsCheck();
let token;

function urlElementsCheck() {
    token = JSON.parse(sessionStorage.getItem("Token"));
    if (token === null) {
        sessionStorage.setItem("Token", JSON.stringify(new URLSearchParams(window.location.hash).get('access_token')));
        if (token === null) {
            console.log("You don't have the token")
            OAuth20();
        }
    } else {
        console.log("You have the token");
    }
   // location.hash = "";
}

function OAuth20() {
    window.location.replace("https://accounts.google.com/o/oauth2/v2/auth?" +
        "scope=https://www.googleapis.com/auth/classroom.coursework.me.readonly&" +
        "include_granted_scopes=true&" +
        "response_type=token&" +
        "state=state_parameter_passthrough_value&" +
        "redirect_uri=http://localhost:63342/WebApp/index.html&" +
        "client_id=82346440292-hlpvrpvqk6epjgqkk93566mdd6mtqocp.apps.googleusercontent.com");
}

let DATA;

async function Fetch() {

    if (DATA === undefined) console.log("Empty");
    token = JSON.parse(sessionStorage.getItem("Token"));
    let h = new Headers();
    h.append('Authorization', `Bearer ${token}`);

    let req = new Request('https://classroom.googleapis.com/v1/courses/129933204397/courseWork', {
        method: 'GET',
        headers: h
    })
    try {

        const response = await fetch(req);
        const t = await response.json();
        DATA = t;
        if (DATA !== null) console.log("Fetched");
        console.log(DATA);
    } catch (error) {
        console.error(error);
    }
}

function Log() {

    OAuth20();
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