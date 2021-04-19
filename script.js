//@ts-check
"use strict";

console.log("banana");
fetch('https://zhermit09.github.io/raycaster/index.html')
    .then((respose)=> {
        console.log("yes", respose);
        return respose.json();
    })
    .then((data) =>{
        console.log(data)
    })
    .catch((error)=>{
        console.log("network error?", error)
})



// for retriving html
    /*.then(res => res.text())
    .then(function (html){
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, 'text/html');
        console.log(doc)
    })*/