import dataBase from "./database.mjs";
import {set, get, ref, onValue, remove} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"
var refDB = ref(dataBase);

window.addEventListener('load', function(){
    onValue(ref(dataBase, 'bookTypes/'), result => {
        if(result.exists()){
            document.querySelector('.catalog').innerHTML = ""

            for(let key in result.val()){
                document.querySelector('.catalog').innerHTML += `
                <div class="categoryItem" id = "${result.val()[key]}">
                    <span>
                        ${result.val()[key]}
                    </span>
                </div>
                `
            }

            // SEnding to catalog selected category
            document.querySelectorAll('.categoryItem')
                .forEach(function(item) {
                    item.addEventListener('click', function(){
                        var selectedCategory = item.id;
    
                        window.location.href = '/assets/pages/catalogPage.html?selectedCategory=' + encodeURIComponent(selectedCategory);
                    })
                })
        }
    })
})

document.querySelector('#go_to_catalog_button').addEventListener('click', function(){
    window.location = "/assets/pages/catalogPage.html"
})