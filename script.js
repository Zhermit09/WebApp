//@ts-check
"use strict";
window.onload = () => calendar();
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
    calendar();
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


async function courseFetch() {
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
    await assigmentFetch();
}

let BATCH;


async function assigmentFetch() {
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
    await statusFetch();
}

let assBatch;
let submissions;

async function statusFetch() {
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

const date = new Date();

function calendar() {
    const calMonth = document.querySelector(".date h1")
    const calFullDate = document.querySelector(".date p")
    const calDays = document.querySelector('.days')

    let days = "";


    const months = [
        "January", "February", "March",
        "April", "May", "June",
        "July", "August", "September",
        "October", "November", "December"
    ]
    const monthLDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const lMonthLDay = new Date(date.getFullYear(), date.getMonth(), 0);
    const prevDate = (lMonthLDay.getDate() - (lMonthLDay.getDay() - 1));
    let nextDate = 7 - monthLDay.getDay();


    calMonth.innerHTML = months[date.getMonth()]
    calFullDate.innerHTML = date.toDateString()
    for (let k = prevDate; k <= lMonthLDay.getDate(); k++) {
        days += `<div class="prev-date">${k}</div>`;
        calDays.innerHTML = days;
    }
    for (let i = 1; i <= monthLDay.getDate(); i++) {
        if (i === date.getDate() && date.getMonth() === new Date().getMonth() && new Date().getFullYear()===date.getFullYear()) {
            days += `<div class="today">${i}</div>`;
        }else if (i === date.getDate() && date.getMonth() === new Date().getMonth()){
            days += `<div class="otherToday">${i}</div>`;
        }
        else {
            days += `<div>${i}</div>`;
            calDays.innerHTML = days;
        }
    }

    if (lMonthLDay.getDay() + monthLDay.getDate() < 35) nextDate += 7;
    for (let j = 1; j <= nextDate; j++) {
        days += `<div class="prev-date">${j}</div>`;
        calDays.innerHTML = days;
    }
}

document.querySelector(".prev")
    .addEventListener("click", () => {
        date.setMonth(date.getMonth() - 1)
        calendar()
    })
document.querySelector(".next")
    .addEventListener("click", () => {
        date.setMonth(date.getMonth() + 1)
        console.log(date.getFullYear())
        calendar()
    })