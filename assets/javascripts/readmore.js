import dataBase from "./database.mjs";
import {set, get, ref, onValue,push, remove} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"

window.addEventListener('load', async function(){
    var selectedBook = "";

    var searchParams = new URLSearchParams(window.location.search);
    selectedBook = searchParams.get('selectedBook');
    
    await get(ref(dataBase, `books/`)).then(data => {
        if(data.exists()){
            for(let key in data.val()){

                if(data.val()[key].title == selectedBook){
                    console.log(data.val()[key])
                    document.querySelector('#mainSEction').innerHTML = `
                        <div id="leftSide">
                            <h1>
                                ${data.val()[key].title}
                            </h1>
                            <p class="descriptionText" id="en">
                                ${data.val()[key].description}
                            </p>
                        </div>

                        <div id="rightSide">
                            <img src="${data.val()[key].imageURL}" alt="">
                        </div>
                    `
                }
            }
        }
    })
    showAnonimComments()



    document.querySelector('#goBackButton').addEventListener('click', function(){
        window.location = "/bookstore/assets/pages/catalogPage.html"
    })
    
    
    // comment
    
    let commentForm = document.querySelector(".comment_form")
    let commentTitle = document.querySelector("#commentInput")
    let addComment = document.querySelector("#addComment")
    let commentList = document.querySelector(".comment_list")
    
    addComment.addEventListener('click',async function(e){
        e.preventDefault();    
         if (commentTitle.value.trim()){
            
            if(localStorage.getItem('bookstoreUser') != null || localStorage.getItem('bookstoreUser') != undefined){
    // comment information
                var nameOfSelectedBook = document.querySelector('#leftSide h1').innerHTML;
                var snapshot = push(ref(dataBase, `books/${nameOfSelectedBook.trim()}/comments`)).key
                set(ref(dataBase,`books/${nameOfSelectedBook.trim()}/comments/${snapshot}/comment/`), commentTitle.value)
    
    
    // Sender informtion
                var commentSenderName = ''
                await get(ref(dataBase, `users/joinedUsers/${localStorage.getItem('bookstoreUser')}`)).then(data => {
                    if(data.exists()){
                        console.log(data.val().name)
                        commentSenderName = data.val().name
                        console.log(commentSenderName)
                    }
                })
                set(ref(dataBase,`books/${nameOfSelectedBook.trim()}/comments/${snapshot}/sender/`), commentSenderName)
    // date information
    
                let sendedTime = new Date();
                var tarix = `${sendedTime.getDate()} - ${sendedTime.getMonth() + 1} - ${sendedTime.getFullYear()}`
                set(ref(dataBase,`books/${nameOfSelectedBook.trim()}/comments/${snapshot}/timeADded/`), tarix)
            }else{
                function show(){
                    document.querySelector('#join_us_panel').style.display = "flex";
                }
                show()
            }
            document.querySelector('#commentInput').value = ""
        }
         
    });
    
    // setting comment is done
    
    // show comments
    function showAnonimComments() {
        let commentsBlock = document.querySelector(".comment_box");
        onValue(ref(dataBase,`books/${selectedBook}/comments`),response => {
    
            commentsBlock.innerHTML = ''
    
            for(let keys in response.val()){
                commentsBlock.innerHTML += `
                    <div class="comment">
                        <div class="senderAndTime">
                            <div class="sender">
                                <span>
                                    ${response.val()[keys].sender}
                                </span>
                            </div>
                            <div class="addedTime">
                                <span>
                                    ${response.val()[keys].timeADded}
                                </span>
                            </div>
                        </div>
                        <div class="message">
                            <span>
                                ${response.val()[keys].comment}
                            </span>
                        </div>
                    </div>
                    `
            }
    
        });
    };
    
    
    // translation API
    async function translateDescription(langFrom, langTo, translateThis){
        const url = 'https://text-translator2.p.rapidapi.com/translate';
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': '3bac3f8044mshd0e9722441068afp1b54a0jsnf3a95cffb192',
                'X-RapidAPI-Host': 'text-translator2.p.rapidapi.com'
            },
            body: new URLSearchParams({
                source_language: `${langFrom}`,
                target_language: `${langTo}`,
                text: translateThis
            })
        };
        
            try{
                const response = await fetch(url, options);
                const result = await response.json();
                document.querySelector('.descriptionText').innerHTML = `${result.data.translatedText}`
                document.querySelector('.descriptionText').id = `${langTo}`
            }catch(error){
                console.log('some error')
            }
    }
    
    document.querySelectorAll('.translateButton')
        .forEach(function(item){
            item.addEventListener('click', function(){
                translateDescription(document.querySelector('.descriptionText').id, item.id, document.querySelector('.descriptionText').innerHTML)
            })
        })
    
})
