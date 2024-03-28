// Importing database and functions from firebase and module js file
import dataBase from "./database.mjs";
import {set, get, ref, onValue, remove, push} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"
var refDB = ref(dataBase);



window.addEventListener('load', function(){
    get(ref(dataBase, 'users/joinedUsers')).then( data => {
        var nameOfUser = localStorage.getItem('bookstoreUser')
        if(data.exists()){
            for(let key in data.val()){
                if(data.val()[key].snapshot === nameOfUser){
                    set(ref(dataBase, `users/joinedUsers/${nameOfUser}/online`), true)
                }
            }
        }


        
// Hamburger
var links = document.querySelector('#links');
var hamburger = document.querySelector('#hamburger'),
    sectionOne = document.querySelector('.sec_1'),
    image_nav = document.querySelector('#image_nav');




    hamburger.addEventListener('click', function() {
        console.log('salam')
        if(sectionOne.style.marginTop === "200px"){
            sectionOne.style.marginTop = "50px";
        }else{
            sectionOne.style.marginTop = "200px";
        }

        links.classList.toggle('enable');
        

        if(links.classList.contains('enable')){
            image_nav.style.display = "inline-block";
        }else{
            image_nav.style.display = "none";
        }

        console.log(links.classList)

    })
    })
})

window.addEventListener('beforeunload', function(){
    var nameOfUser = localStorage.getItem('bookstoreUser')
    if(nameOfUser){
        set(ref(dataBase, `users/joinedUsers/${nameOfUser}/online`), false)
    }
})

var joinUs                  =           document.querySelector('#join_us'),
    joinUsText              =           document.querySelector("#join_us_p"),
    joinUsPanel             =           document.querySelector('#join_us_panel'),
    joinButton              =           document.querySelector("#join_button");
var fullName                =           document.querySelector('#fullname'),
    email                   =           document.querySelector('#email'),
    exit                    =           document.querySelector('.exit');


    
    function showNone(){
        email.value = "";
        fullName.value = "";
        joinUsPanel.style.display = "none";
    }


    function show(){
        fullName.value = "";
        email.value = "";
        joinUsPanel.style.display = "flex";
    }

    joinUs.onclick = show;
    joinUsText.onclick = show;

    exit.onclick = showNone;




    joinButton.addEventListener('click', async function(e){
        e.preventDefault()
        if(fullName.value.trim() && email.value.trim()){
            var snapshot = push(ref(dataBase)).key;
            localStorage.setItem('bookstoreUser', `${snapshot}`)
            await set(ref(dataBase, `users/joinedUsers/${snapshot}/name`), `${fullName.value.trim()}`)
            await set(ref(dataBase, `users/joinedUsers/${snapshot}/snapshot`), `${snapshot}`)
            await set(ref(dataBase, `users/joinedUsers/${snapshot}/mailbox`), `${email.value.trim()}`)
            await set(ref(dataBase, `users/joinedUsers/${snapshot}/online`), true)
            showNone()
            window.location.reload();
        }
    }) 



    
fullName.style.textTransform = "capitalize";


