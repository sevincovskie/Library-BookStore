import dataBase from "../javascripts/database.mjs  ";
import {
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

document.querySelector('#searchBookButton').addEventListener('click', function(e){
    e.preventDefault();
    var searchBook = document.querySelector('#searchBook');
    if(searchBook.value.trim()){
        get(ref(dataBase, 'books')).then(response => {
            if(response.exists()){
                for(let keys in response.val()){
                    if(response.val()[keys].title.toLowerCase().includes(`${searchBook.value.trim()}`)){
                        document.querySelector('.rightSide').innerHTML = `
                        <div id="bookImageDetails">
                            <img src="${response.val()[keys].imageURL}" alt="">
                        </div>
    
                        <div id="addedInfo">
    
                            <h5 id="titleDetails">
                                ${response.val()[keys].title}
                            </h5>
    
                            <p id="authorDetails">
                                ${response.val()[keys].author}
                            </p>
    
                            <p id="descriptionDetails">
                                ${response.val()[keys].description}
                            </p>
                        </div>
                            
                        `
                        return
                    }else{
                        document.querySelector('.rightSide').innerHTML = `
                            <div id="addedInfo">
                                <p id="titleDetails">Book is not found</p>
                            </div>
                        `
                    }
                }
            }
        })
    }
})