//@ts-check
"use strict";
window.onload = () => urlElementsCheck();

function urlElementsCheck() {
    try {
        const url = new URL(window.location.href);
        if (url.hash === null || url.hash === "") {
            OAuth20();
        }
    } catch (error) {
        console.error();
    }
}

function OAuth20(){
    window.location.replace("https://accounts.google.com/o/oauth2/v2/auth?" +
        "scope=https://www.googleapis.com/auth/classroom.courses&" +
        "include_granted_scopes=true&" +
        "response_type=token&" +
        "state=state_parameter_passthrough_value&" +
        "redirect_uri=http://localhost:63342/IdeaProjects/WebApp/index.html&" +
        "client_id=82346440292-hlpvrpvqk6epjgqkk93566mdd6mtqocp.apps.googleusercontent.com");
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