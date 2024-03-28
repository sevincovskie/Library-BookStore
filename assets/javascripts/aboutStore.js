// Importing database and functions from firebase and module js file
import dataBase from "./database.mjs";
import {set, get, ref, onValue, remove} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"
var refDB = ref(dataBase);

window.addEventListener('load', function(){
    onValue(ref(dataBase, "aboutUs/"), result => {
        if(result.exists()){
            document.querySelector('#mainSEction').innerHTML = `
            
            <div id="leftSide">
                <h1>
                    ${result.val().title}
                </h1>
                <p>
                    ${result.val().description}
                </p>
            </div>

            <div id="rightSide">
                <img src="${result.val().imageURL}" alt="">
            </div>
            
            `
        }
    })
})

