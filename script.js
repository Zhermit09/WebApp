//@ts-check
"use strict";
window.onload = () => urlElementsCheck();
let token;
let header;

let scope = "https://www.googleapis.com/auth/classroom.coursework.me.readonly&" +
    "https://www.googleapis.com/auth/classroom.coursework.students.readonly&";

let assignments;
let coursesData;

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
    courseFetch().then(() => displayAssignments());
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
    coursesData = [];
    try {
        const response = await fetch('https://classroom.googleapis.com/v1/courses', {
            method: 'GET',
            headers: header
        });
        coursesData = await response.json();
        console.log(coursesData);
    } catch (error) {
        console.error(error);
    }
    await assigmentFetch();
}

let BATCH;

async function assigmentFetch() {
    let class_id = "";
    BATCH = [];
    const {courses} = coursesData
    try {
        courses.forEach((courseSp) => {
            class_id = courseSp.id.toString();
            BATCH.push(fetch(`https://classroom.googleapis.com/v1/courses/${class_id}/courseWork`, {
                method: 'GET',
                headers: header
            }).then((res) => res.json()))
        })
        assignments = await Promise.all(BATCH);
        assignments.forEach((ass, index) => {
            if (Object.keys(assignments[index]).length === 0) {
                assignments.splice(index, 1)
            }
        })
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
    try {
        assignments.forEach((courseWorks) => {
            const {courseWork} = courseWorks;
            courseWork.forEach((workData) => {
                if (workData['dueDate'] !== undefined) {
                    assigment_id = workData['id']
                    class_id = workData['courseId']
                    assBatch.push(fetch(`https://classroom.googleapis.com/v1/courses/${class_id}/courseWork/${assigment_id}/studentSubmissions`, {
                        method: 'GET',
                        headers: header
                    }).then((res) => res.json()))
                }
            })


        })
    } catch (error) {
        console.error(error);
    }
    submissions = await Promise.all(assBatch);
    console.log(submissions)
    createObj()
}

let ObjArr = [];

function createObj() {


    ObjArr[0] = {
        Title: assignments[0]['courseWork'][0]['title'],
        Link: assignments[0]['courseWork'][0]['alternateLink'],
        CourseID: assignments[0]['courseWork'][0]['courseId'],
        DueDate: assignments[0]['courseWork'][0]['dueDate'],
        DueTime: assignments[0]['courseWork'][0]['dueTime'],
        AssigmentID: assignments[0]['courseWork'][0]['id'],
        Late: submissions[0]['studentSubmissions'][0]['late'],
        State: submissions[0]['studentSubmissions'][0]['state']

    }
    console.log("yeet____________________\n");
    console.log(ObjArr[0])
}

//---------------------------------------------------------------------------------------------
const date = new Date();
document.querySelector('.list .header div #date').innerHTML = date.toDateString()

function calendar() {
    if (date.getMonth() === new Date().getMonth()) date.setDate(new Date().getDate())

    const calMonth = document.querySelector(".date h1");
    const calFullDate = document.querySelector(".date p");
    const calDays = document.querySelector('.days');

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
        days += `<div class="otherDate">${k}</div>`;
        calDays.innerHTML = days;
    }
    for (let i = 1; i <= monthLDay.getDate(); i++) {
        if (i === date.getDate() && date.getMonth() === new Date().getMonth() && new Date().getFullYear() === date.getFullYear()) {
            days += `<div class="today">${i}</div>`;
        } else if (i === date.getDate() && date.getMonth() === new Date().getMonth()) {
            days += `<div class="otherToday">${i}</div>`;
        } else {

            days += `<div class="nDay" class="2x">${i}</div>`;
            calDays.innerHTML = days;

        }
    }

    if (lMonthLDay.getDay() + monthLDay.getDate() < 35) nextDate += 7;
    for (let j = 1; j <= nextDate; j++) {
        days += `<div class="otherDate">${j}</div>`;
        calDays.innerHTML = days;
    }
    colorChange();
}

function colorChange() {
    const daysBorder = document.querySelectorAll(".days div")
    const element = [
        document.querySelector(".header h1"),
        document.querySelector(".header p"),
        document.querySelector(".next"),
        document.querySelector(".prev")]

    switch (date.getMonth()) {
        case 11:
        case 0:
        case 1:
            for (let i = 0; i < element.length; i++) {
                element[i].classList.add("winter");
                element[i].classList.remove("autumn");
                element[i].classList.remove("spring");
                element[i].classList.remove("summer");
            }
            daysBorder.forEach((div) =>{
                div.style.borderImage = "linear-gradient(to bottom,#0339fa, #03fafa, #0339fa,#1e1e1d 98%) 1";
            })
            break;
        case 2:
        case 3:
        case 4:
            for (let i = 0; i < element.length; i++) {
                element[i].classList.add("spring");
                element[i].classList.remove("autumn");
                element[i].classList.remove("summer");
                element[i].classList.remove("winter");
            }
            daysBorder.forEach((div) =>{
                div.style.borderImage = "linear-gradient(to bottom,#ff9900, #ffe400, #FF9900FF,#1e1e1d 98%) 1";
            })
            break;
        case 5:
        case 6:
        case 7:
            for (let i = 0; i < element.length; i++) {
                element[i].classList.add("summer");
                element[i].classList.remove("spring");
                element[i].classList.remove("autumn");
                element[i].classList.remove("winter");
            }
            daysBorder.forEach((div) =>{
                div.style.borderImage = "linear-gradient(to bottom,#095038, #03fa66, #095038,#1e1e1d 98%) 1";
            })
            break;
        case 8:
        case 9:
        case 10:
            for (let i = 0; i < element.length; i++) {
                element[i].classList.add("autumn");
                element[i].classList.remove("spring");
                element[i].classList.remove("winter");
                element[i].classList.remove("summer");
            }
            daysBorder.forEach((div) =>{
                div.style.borderImage = "linear-gradient(to bottom,#ff2600, #ffa12f 20%, #ff2600 80%,#1e1e1d 98%) 1";
            })
            break;
    }
}

document.querySelector(".prev")
    .addEventListener("click", () => {
        date.setMonth(date.getMonth() - 1)
        if (date.getMonth() !== new Date().getMonth()) date.setDate(1)
        calendar()
    })
document.querySelector(".next")
    .addEventListener("click", () => {
        date.setMonth(date.getMonth() + 1)
        if (date.getMonth() !== new Date().getMonth()) {
            date.setDate(1)
        }
        calendar()
    })

document.querySelector('.days').addEventListener("mouseover", (hover) => {
    if (hover.target.innerHTML.length <= 2 && hover.target.innerHTML >= 1) {
        let targetDate = date
        targetDate.setDate(parseInt(hover.target.innerHTML))
        document.querySelector(".date p").innerHTML = targetDate.toDateString()
        hover.target.addEventListener("mouseleave", () => {
            if (date.getMonth() === new Date().getMonth()) date.setDate(new Date().getDate())
            else {
                date.setDate(1)
            }
            document.querySelector(".date p").innerHTML = date.toDateString();
        })
    }
})

const counter = document.querySelector('.list .header div #counter')
counter.innerHTML = "Total: "
//---------------------------------------------------------------------------------------------
function displayAssignments() {
    document.querySelector('.list .header div #date').innerHTML = date.toDateString()
    const assList = document.querySelector('.assContainer #assigmentList')
    let temp = ""


    assignments.forEach((courseWorks) => {
        const {courseWork} = courseWorks;
        courseWork.forEach((workData) => {
            temp += `<li class="assigment">${workData['title']}</li>`
            assList.innerHTML = temp;
        })
    })
     counter.innerHTML = "Total: " + assList.childElementCount;
    if (assList.childElementCount <= 1) {
        console.log("almost empty!")
    }
}