//@ts-check
"use strict";
window.onload = () => urlElementsCheck();
let token;

function urlElementsCheck() {

    try {
        const url = new URL(window.location.href);
        if (url.hash === null || url.hash === "") {
            console.log("You don't have the token")
            OAuth20();
        } else {
            console.log("You have the token");
            //maybe later do sessionStorage.setItem()
            token = new URLSearchParams(window.location.hash).get('access_token');
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



async function Fetch() {

    let h = new Headers();
    h.append('Authorization', `Bearer ${token}`);

    let req = new Request('https://classroom.googleapis.com/v1/courses', {
        method: 'GET',
        headers: h
    })
    try {
        const response = await fetch(req);
        const {courses} = await response.json();
        const {0:{enrollmentCode}} = courses;
        return enrollmentCode;
    }catch (error){
        console.error(error);
    }
}
let DATA;
async function Log() {
 DATA = await Fetch();
console.log(DATA);
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