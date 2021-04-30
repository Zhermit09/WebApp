//@ts-check
"use strict";
window.onload = () => urlElementsCheck();
let token;
let classID = [];


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

    //  /129933204397/courseWork
    let req = new Request('https://classroom.googleapis.com/v1/courses', {
        method: 'GET',
        headers: h
    })
    try {
        const response = await fetch(req);
        DATA = await response.json();
        if (DATA !== null) console.log("Fetched");
        console.log(DATA);
    } catch (error) {
        console.error(error);
    }
}

async function Assignments() {
    let h = new Headers();
    h.append('Authorization', `Bearer ${token}`);

    for (const element in DATA.courses) {
        let clas = DATA.courses[element].id.toString();
        let response = await fetch(`https://classroom.googleapis.com/v1/courses/${clas}/courseWork`,{
            method: 'GET',
            headers: h
        })
        let assigment = await response.json();
        console.log(assigment)
    }
   // console.log(classID)
}
