// Importing database and functions from firebase and module js file
import dataBase from "./database.mjs";
import {set, get, ref, onValue, remove, push} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"
var refDB = ref(dataBase);

// Google Books API
const valueFromAPI = document.querySelector('#valueFromAPI')
const valueFromAPIButton = document.querySelector('#valueFromAPIButton')
// divs that will be fullfilled
const bookNameInput = document.querySelector('#bookNameInput')
const authorNameInput = document.querySelector('#authorNameInput')
const bookImageUrlInput = document.querySelector('#bookImageUrlInput')
const bookDescription = document.querySelector('#bookDescription')
const bookReleaseDate = document.querySelector('#bookReleaseDate')
const bookTypeInput = document.querySelector('#bookTypeInput')

valueFromAPIButton.addEventListener('click', function(e){
    if(valueFromAPI.value.trim()){
        searchBooks(valueFromAPI.value.trim())
    }
})

window.addEventListener('keyup', function(e){
    e.preventDefault();
    if(valueFromAPI.value.trim() && e.key != "Backspase"){
        document.querySelector('#relatedSearches').style.display = "flex"
        searchBooks(valueFromAPI.value.trim())
    }

    if(e.key == "Backspace"){
        document.querySelector('#relatedSearches').style.display = "none"
    }
})


function searchBooks(element) {
    var url = `https://www.googleapis.com/books/v1/volumes?q=${element}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.querySelector('#relatedSearches').innerHTML = ""
            for(let i in data.items){
                document.querySelector('#relatedSearches').innerHTML += `
                    <div id="${data.items[i].id}">${data.items[i].volumeInfo.title}</div>
                `
                document.querySelectorAll('#relatedSearches div').forEach(function(item){
                    item.addEventListener('click', function(){
                        console.log(this.id)
                        fetch(`https://www.googleapis.com/books/v1/volumes/${this.id}`)
                            .then(response => response.json())
                            .then(data => {
                                console.log(data)
                                //setting data to propmts
                                try{
                                    bookNameInput.value = `${data.volumeInfo.title}`
                                    authorNameInput.value = `${data.volumeInfo.authors[0]}`
                                    if(data.volumeInfo.imageLinks.medium){
                                        bookImageUrlInput.value = `${data.volumeInfo.imageLinks.medium}`
                                    }
                                    bookDescription.value = `${data.volumeInfo.description}`
                                    bookReleaseDate.value = `${data.volumeInfo.publishedDate}`



                                    document.querySelector('#relatedSearches').style.display = "none"
                                    document.querySelector('#relatedSearches').innerHTML = ""
                                    document.querySelector('#relatedSearches').value = ""
                                    valueFromAPI.value = ""
                                }catch(error){
                                    document.querySelector('#relatedSearches').innerHTML = "Some error occured with book please add manually"
                                }
                                
                            })
                    })
                })
            }
        })
        .catch(error => {
            console.log("Error fetching data:", error);
        });
}




// adding book info to firebase
async function addBookToFireBase(bookName, author, imageURL, descriptionOf, releaseDate, typeOfBook){
    var dateSelector = /\d{1,2}\-\d{1,2}\-\d{4}/
    if(bookName.value.trim() &&
        author.value.trim() &&
        imageURL.value.trim() && 
        descriptionOf.value.trim() && 
        releaseDate.value.trim() &&
        typeOfBook.value &&
        releaseDate.value.match(dateSelector)){
        console.log('getdi')
            try{
                var addedDate = new Date()
                var reqem = addedDate.getTime();
                await set(ref(dataBase, `books/${bookName.value.trim()}/imageURL`), `${imageURL.value}`);
                await set(ref(dataBase, `books/${bookName.value.trim()}/title`), `${bookName.value}`);
                await set(ref(dataBase, `books/${bookName.value.trim()}/author`), `${author.value}`);
                await set(ref(dataBase, `books/${bookName.value.trim()}/description`), `${descriptionOf.value}`);
                await set(ref(dataBase, `books/${bookName.value.trim()}/dateRelease`), reqem);
                await set(ref(dataBase, `books/${bookName.value.trim()}/isShown`), `false`);
                await set(ref(dataBase, `books/${bookName.value.trim()}/category`), `${typeOfBook.value}`);
                await set(ref(dataBase, `books/${bookName.value.trim()}/counter`), 0);
                document.querySelector('#messageModal').innerHTML = `
                    <span>Book was added succesfully</span>
                `
                document.querySelector('#messageModal').style.display = 'flex'
                setTimeout(function(){
                    document.querySelector('#messageModal').style.display = 'none'
                },2000)
            }catch(error){
                console.log(error)
            }
                
            bookNameInput.value = ""
            authorNameInput.value = ""
            bookImageUrlInput.value = ""
            bookDescription.value = ""
            bookReleaseDate.value = ""
        }else{
            alert('please full prompts')
        }
}
document.querySelector('#addBookButton').addEventListener('click', function(e){

    e.preventDefault();
    addBookToFireBase(
        bookNameInput,
        authorNameInput,
        bookImageUrlInput,
        bookDescription,
        bookReleaseDate,
        bookTypeInput
    )
})




// Join us Table

function getJoinedUsers(){
    onValue(ref(dataBase, 'users/joinedUsers'),async result => {
        if(result.exists()){
            var peremennaya = 1;
            document.querySelector("#joinUsTableBody").innerHTML = ""

            for(let keys in result.val()){
                
                await get(ref(dataBase, `users/joinedUsers/${keys}`)).then(data => {
                    document.querySelector("#joinUsTableBody").innerHTML += `
                        <tr>
                            <td>${peremennaya}</td>
                            <td>${data.val().name}</td>
                            <td>${data.val().mailbox}</td>
                        </tr>
                        `
                })

                peremennaya++;
            }

        }
    })
}


// Books Section

function getBookInformation(){
    try{
        onValue(ref(dataBase, 'books/'),async result => {
            if(result.exists()){
                var peremennaya = 1;
                document.querySelector("#BooksTableBody").innerHTML = ""
    
                for(let keys in result.val()){
                    
                    await get(ref(dataBase, `books/${keys}`)).then(data => {
                        document.querySelector("#BooksTableBody").innerHTML += `
                            <tr>
                                <td>${peremennaya}</td>
                                <td class="titleAndImage">${data.val().title}</td>
                                <td><img src="${data.val().imageURL}" style="width: 30px; height:30px"></td>
                                <td class="tableDescription">${data.val().description}</td>
                                <td>${data.val().category}</td>
                                <td>${data.val().author}</td>
                                <td class="removable" id="${data.val().title}"><img src="./assets/images/adminPanel/trash.svg"></td>
                            </tr>
                            `
    
                        document.querySelectorAll('.removable').forEach(function(item){
                            item.addEventListener('click', function(){
                                remove(ref(dataBase, `books/${item.id}`))
                            })
                        })
                    })
    
                    peremennaya++;
                }
    
            }
        })
    }catch (error){
        console.log('some information is not found')
    }
}

// Online users section

function getOnlineUsers(){
    try{
        onValue(ref(dataBase, 'users/joinedUsers'),async result => {
            if(result.exists()){
                var allUsers = 0;
                var onlineUsers = 0;
                for(let key in result.val()){
                    allUsers++;
                    if(result.val()[key].online == true){
                        onlineUsers++;
                    }
                }
                document.querySelector('#onlineUsersBody').innerHTML = ''
                document.querySelector('#onlineUsersBody').innerHTML += `
                <tr>
                    <td>${allUsers}</td>
                    <td>${onlineUsers}</td>
                </tr>
                `
                allUsers = 0;
                onlineUsers = 0
            }
        })
    }catch (error){
        console.log('some information is not found')
    }
}


// Adding new book type
var addingTypeForm = document.querySelector('#typeAddingInfo');
var newTypeInfoButton = document.querySelector('#newTypeInfoButton')

document.querySelector('#typeAddingBlock span').addEventListener('click', function(){
    if(addingTypeForm.style.display == "flex"){
        addingTypeForm.style.display = "none"
    }else{
        addingTypeForm.style.display = "flex"
    }
})

// Click other side for close the form
var clicksToWindowCount = 1;
window.addEventListener('click', function(e){
    if(e.target != addingTypeForm && e.target != addingTypeForm.querySelector('#newTypeInfo') && clicksToWindowCount > 1){
        addingTypeForm.style.display = "none"
        document.querySelector('#relatedSearches').style.display = "none"
        clicksToWindowCount = 0
    }
    clicksToWindowCount++;
})

newTypeInfoButton.addEventListener('click', async function(e){
    e.preventDefault();
    if(document.querySelector('#newTypeInfo').value.trim()){
        await set(ref(dataBase, `bookTypes/${document.querySelector('#newTypeInfo').value.trim()}`), `${document.querySelector('#newTypeInfo').value.trim()}`)
        addingTypeForm.style.display = "none"
    }else{
        alert('please fill the prompt')
    }
})


// take book types from firebase

function typeFromFirebase(){
    onValue(ref(dataBase, 'bookTypes/'), data => {
        document.querySelector('#bookTypeInput').innerHTML = ""
        for(let keys in data.val()){
            document.querySelector('#bookTypeInput').innerHTML += `
                <option>${data.val()[keys]}</option>
            `
        }
    })   
}



// take contact us information  from firebase

function contactUsFromFirebase(){
    onValue(ref(dataBase, 'contactUs/'), data => {
        var peremennaya = 1;
        document.querySelector('#contactUsTableBody').innerHTML = ""
        for(let keys in data.val()){
            document.querySelector('#contactUsTableBody').innerHTML += `
                <tr>
                    <td>${peremennaya}</td>
                    <td>${data.val()[keys].name}</td>
                    <td>${data.val()[keys].email}</td>
                    <td>${data.val()[keys].address}</td>
                    <td>${data.val()[keys].phone}</td>
                    <td>${data.val()[keys].note}</td>
                    <td class="removableContact" id="${data.val()[keys].name}"><img src="./assets/images/adminPanel/trash.svg"></td>
                </tr>
            `

            document.querySelectorAll('.removableContact').forEach(function(item){
                item.addEventListener('click', function(){
                    console.log(item.id)
                    remove(ref(dataBase, `contactUs/${item.id}`))
                })
            })

            peremennaya++;
        }
    })   
}

function aboutUsFromFirebase(){
    onValue(ref(dataBase, 'aboutUs/'), data => {
            var peremennaya = 1;
            document.querySelector('#aboutUsTableBody').innerHTML = ""
            document.querySelector('#aboutUsTableBody').innerHTML += `
                <tr>
                    <td>${peremennaya}</td>
                    <td>${data.val().title}</td>
                    <td>${data.val().description}</td>
                    <td>${data.val().imageURL}</td>
                    <td><img id="aboutUsPagePhoto" src="${data.val().imageURL}"></td>
                    <td class="removableAbout"><img src="./assets/images/adminPanel/trash.svg"></td>
                </tr>
            `

            document.querySelector('.removableAbout').addEventListener('click', function(){
                console.log('silirem')
                remove(ref(dataBase, `aboutUs/`))
            })

            peremennaya++;
        }
    )   
}

    getJoinedUsers()
    getBookInformation()
    typeFromFirebase()
    contactUsFromFirebase()
    aboutUsFromFirebase()
    getOnlineUsers()



document.querySelector('#hamburger').addEventListener('click', function(){
    document.querySelector('#navigationSide').style.transform = "translateX(0px)"
})

// close navigation when phone tab

document.querySelector('#closeNavigation').addEventListener('click', function(){
    document.querySelector('#navigationSide').style.transform = "translateX(-380px)"
})

//sending information about store to firebase

document.querySelector('#sendAboutForm').addEventListener('click', function(e){
    e.preventDefault();
    const titleAboutStore = document.querySelector('#titleAboutStore')
    const aboutImageURL = document.querySelector('#aboutImageURL')
    const aboutDescription = document.querySelector('#aboutDescription')

    if(titleAboutStore.value.trim() &&
        aboutDescription.value.trim()){
            set(ref(dataBase, 'aboutUs/description'),`${aboutDescription.value}`)
            if(aboutImageURL.value.trim()){
                set(ref(dataBase, 'aboutUs/imageURL'),`${aboutImageURL.value.trim()}`)
            }
            set(ref(dataBase, 'aboutUs/title'),`${titleAboutStore.value}`)

            titleAboutStore.value = ""
            aboutImageURL.value = ""
            aboutDescription.value = ""
        }else{
            alert('please fill prompts')
        }
})

// Getting messages from user

onValue(ref(dataBase, 'chat'), async data => {
    if(data.exists()){
        document.querySelector('#messagesFromUser').innerHTML = ""
        for(let keys in data.val()){
            var nameOFSender = '';
            await get(ref(dataBase, `users/joinedUsers/${data.val()[keys].sender}`)).then(result => {
                if(result.exists()){
                    nameOFSender = result.val().name
                    document.querySelector('#messagesFromUser').innerHTML += `
                        <div>${nameOFSender} : ${data.val()[keys].message}</div>
                    `
                }else{
                    nameOFSender = 'admin'
                    document.querySelector('#messagesFromUser').innerHTML += `
                        <div style="align-self: flex-end">${nameOFSender} : ${data.val()[keys].message}</div>
                    `
                }
            })
            
        }
    }
})

document.querySelector('#sendAdminMessage').addEventListener('click', function(){
    if(document.querySelector('#messageContext').value.trim()){
        var messageInfo = {
            sender: "admin",
            message: document.querySelector('#messageContext').value.trim()
        }
        var snapshot = push(ref(dataBase, 'chat')).key
        set(ref(dataBase, `chat/${snapshot}`), messageInfo)
        document.querySelector('#messageContext').value = ""
    }
})