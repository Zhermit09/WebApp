//@ts-check
"use strict";
window.onload = () => urlElementsCheck();
let token;
let header;

let scope = "https://www.googleapis.com/auth/classroom.coursework.me.readonly&" +
    "https://www.googleapis.com/auth/classroom.coursework.students.readonly&";

let assignments;
let DATA;

function urlElementsCheck() {
    token = JSON.parse(sessionStorage.getItem("Token"));
    if (token === null) {
        sessionStorage.setItem("Token", JSON.stringify(new URLSearchParams(window.location.hash).get('access_token')));
        token = JSON.parse(sessionStorage.getItem("Token"));
        if (token === null) {
            console.log("You don't have the token")
            OAuth20();
        }
    } else {
        console.log("You have the token");
    }
    location.hash = "";
}

function OAuth20() {
    window.location.replace("https://accounts.google.com/o/oauth2/v2/auth?" +
        `scope=${scope}` +
        "include_granted_scopes=true&" +
        "response_type=token&" +
        "state=state_parameter_passthrough_value&" +
        "redirect_uri=http://localhost:63342/WebApp/index.html&" +
        "client_id=82346440292-hlpvrpvqk6epjgqkk93566mdd6mtqocp.apps.googleusercontent.com");
}


async function Fetch() {
    token = JSON.parse(sessionStorage.getItem("Token"));
    header = new Headers();
    header.append('Authorization', `Bearer ${token}`);
    DATA = [];
    try {
        const response = await fetch('https://classroom.googleapis.com/v1/courses', {
            method: 'GET',
            headers: header
        });
        DATA = await response.json();
        console.log(DATA);
    } catch (error) {
        console.error(error);
    }
    await assigmFetch();
}

let BATCH;


async function assigmFetch() {
    let class_id = "";
    BATCH = [];
    const {courses} = DATA
    try {
        courses.forEach((assignment) => {
            class_id = assignment.id.toString();
            BATCH.push(fetch(`https://classroom.googleapis.com/v1/courses/${class_id}/courseWork`, {
                method: 'GET',
                headers: header
            }).then((res) => res.json()))
        })
        assignments = await Promise.all(BATCH);
    } catch (error) {
        console.error(error);
    }
    console.log(assignments)
    await submFetch();
}

let assBatch;
let submissions;

async function submFetch() {
    assBatch = [];

    let assigment_id;
    let class_id;

    assignments.forEach((ass) => {
        const {courseWork} = ass;
        for (const index in courseWork)
            if (courseWork[index].dueDate !== undefined) {

                assigment_id = courseWork[index].id
                class_id = courseWork[index].courseId

                assBatch.push(fetch(`https://classroom.googleapis.com/v1/courses/${class_id}/courseWork/${assigment_id}/studentSubmissions`, {
                    method: 'GET',
                    headers: header
                }).then((res) => res.json()))
                //               .then((data) => console.log(data)))
            }
    })
    submissions = await Promise.all(assBatch);
    console.log(submissions)

}

