import dataBase from "./database.mjs"
import {ref, set, get, push, onValue} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"


var nameOfUser = localStorage.getItem('bookstoreUser')
if(nameOfUser){
    get(ref(dataBase, `users/joinedUsers/${nameOfUser}`)).then(result=>{
        if(result.exists()){
            document.querySelector('#joinUsName').innerHTML = `
                    <p>
                        ${result.val().name}
                    </p>
                    <div id="hamburger" class="hamburger">
                        <span class="span_ham"></span>
                        <span class="span_ham"></span>
                        <span class="span_ham"></span>
                    </div>
            `
        }
    })
}