// Importing database and functions from firebase and module js file
import dataBase from "./database.mjs";
import {set, get, ref, onValue, remove} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"
var refDB = ref(dataBase);

// detecting if user exists
const adminLoginButton = document.querySelector('#adminLoginButton');
const adminUsername = document.querySelector('#adminUsername')
const adminPassword = document.querySelector('#adminPassword')

function detectUser(valueFromPrompt, passwordFromPrompt){
    if(valueFromPrompt.trim() && passwordFromPrompt.trim()){
        var defValue = 0;
        get(ref(dataBase, 'users/admins/')).then(result => {
            if(result.exists()){
                for(let key in result.val()){
                    if(result.val()[key].name == valueFromPrompt.trim() && result.val()[key].password == passwordFromPrompt){
                        defValue++;
                    }
                }

            if(defValue == 0){
                alert('User is not defined')
            }else{
                document.querySelector('#mainContentForAdmin').innerHTML = `
                <div id="adminMainPanel">
                <!-- Logo side for admin -->
                <div id="adminLogo">
                    <a id="aadmin" href="">
                        <img 
                        src="./assets/images/adminPanel/adminUserLogo.png" 
                        alt="adminUser"
                        title="adminUser">
                        <p>
                            Admin
                        </p>
                    </a>

                    <a id="hamburger" href="#">
                        <img  src="./assets/images/adminPanel/hamburger.png" alt="hamburger" title="hambur">
                    </a>
                </div>
                
                <div id="adminMainPanelElements">
                    <!-- Book adding section from API -->
                    <div id="addBookSection">
                        <h3>
                            Add book
                        </h3>
                        <label for="valueFromAPI">
                            Search book
                        </label>
                        <div id="searchElements">
                            <input 
                            type="text" 
                            name="valueFromAPI" 
                            id="valueFromAPI"
                            placeholder="Add name of book">
                            
                            <button id="valueFromAPIButton">
                                <img src="./assets/images/adminPanel/searchIcon.png" alt="">
                            </button>
                            
                        </div>
                        <!-- Div with search results -->
                        <div id="relatedSearches"></div>
                        <!-- Div with search results -->
                        
                    </div>
                    <!-- end of book adding section from API -->

                    <!-- Setting Books Initials -->
                    <div id="bookFormSection">
                        <label id="mainLabel" for="bookNameInput">
                            Book form
                        </label>

                        <div class="bookFormCard">
                            <div>
                                <label for="bookNameInput">
                                    Book Name
                                </label>
                                <input type="text" id="bookNameInput" placeholder="Add name of Book">
                            </div>

                            <div>
                                <label for="authorNameInput">
                                    Author Name
                                </label>
                                <input type="text" id="authorNameInput" placeholder="Add name of Author">
                            </div>

                            <div>
                                <label for="bookImageUrlInput">
                                    Book Image Url
                                </label>
                                <input type="text" id="bookImageUrlInput" placeholder="Add path to Image of Book">
                            </div>

                            <div id="descriptionBlock">
                                <label for="bookDescription">
                                    Description
                                </label>
                                <textarea 
                                type="text" 
                                id="bookDescription" 
                                placeholder="Add description to book"
                                ></textarea>
                            </div>

                            <div>
                                <label for="bookReleaseDate">
                                    Date Release
                                </label>
                                <input type="text" id="bookReleaseDate" placeholder="Add release date">
                            </div>

                            <div id="typeadding">
                                <!-- Adding new type of -->
                                <div id="typeAddingBlock">
                                    <span>
                                        +
                                    </span>
                                    <form id="typeAddingInfo">
                                        <input id="newTypeInfo" type="text" placeholder="Add new type">
                                        <button id="newTypeInfoButton">
                                            add
                                        </button>
                                    </form>
                                </div>
                                <!-- Adding new type of -->


                                <label for="bookTypeInput">
                                    Book Type
                                </label>
                                
                                <select type="text" id="bookTypeInput" placeholder="Add Type of book">
                                </select>


                            </div>

                            <button id="addBookButton">
                                Add
                            </button>
                        </div>
                    </div>
                    <!-- Setting Books Initials -->

                    <!-- Avout Store Section -->
                    
                    <div id="aboutStoreSection">
                        <h4>
                            About Store
                        </h4>

                        <form id="aboutStoreForm">
                            <div>
                                <label for="titleAboutStore">
                                    Title
                                </label>
                                <input type="text" name="titleAboutStore" id="titleAboutStore" placeholder="Add Title">
                            </div>

                            <div>
                                <label for="aboutImageURL">
                                    Page Image URL
                                </label>
                                <input type="text" name="aboutImageURL" id="aboutImageURL" placeholder="Add image's URL">
                            </div>

                            <div>
                                <label for="aboutDescription">
                                    Description
                                </label>
                                <textarea type="text" name="aboutDescription" id="aboutDescription" placeholder="Write Description"></textarea>
                            </div>

                            <button id="sendAboutForm">
                                Add About Info
                            </button>
                        </form>
                    </div>

                    <!-- About store SEction -->



                    <!-- Join Us Info Section -->
                    
                    <div id="joinUsSection">
                        <h4>
                            Join Us
                        </h4>

                        <table id="joinUsMainTable">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Full Name</th>
                                    <th>Mail Address</th>
                                </tr>
                            </thead>

                            <tbody id="joinUsTableBody">
                                
                            </tbody>
                        </table>
                    </div>

                    <!-- Join Us Info Section -->


                    <!-- Books section -->

                    <div id="BooksSection">
                        <h4>
                            Books
                        </h4>

                        <table id="BooksMainTable">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Title</th>
                                    <th >Image</th>
                                    <th class="tableDescription">Description</th>
                                    <th>Category</th>
                                    <th>Author</th>
                                    <th>Remove</th>
                                </tr>
                            </thead>

                            <tbody id="BooksTableBody">
                                
                            </tbody>
                        </table>
                    </div>

                    <!-- Books section -->


                    <!-- Contact us section -->

                    <div id="contactUsSection">
                        <h4>
                            Contact Us
                        </h4>

                        <table id="contactUsMainTable">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Address</th>
                                    <th>Phone</th>
                                    <th>Note</th>
                                    <th>Remove</th>
                                </tr>
                            </thead>

                            <tbody id="contactUsTableBody">
                                
                            </tbody>
                        </table>
                    </div>

                    <!-- Contact us section -->

                    <!-- About Us Section -->

                    <div id="aboutUsFromFirebaseSection">
                        <h4>
                            About Us Elements
                        </h4>

                        <table id="AboutUsMainTable">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Image URL</th>
                                    <th>Image</th>
                                    <th>Remove</th>
                                </tr>
                            </thead>

                            <tbody id="aboutUsTableBody">
                                
                            </tbody>
                        </table>
                    </div>


                    <!-- Online Users -->

                    <div id="onlineUsers">
                        <h4>
                            Online Users
                        </h4>

                        <table id="onlineUsersMainTable">
                            <thead>
                                <tr>
                                    <th>All users</th>
                                    <th>Online users</th>
                                </tr>
                            </thead>

                            <tbody id="onlineUsersBody">
                                
                            </tbody>
                        </table>
                    </div>

                    <!-- Online Users -->

                    <!-- Chatting with user -->

                    <div id="chat">
                        <h4>
                            Chat
                        </h4>

                        <div id="chatMain">
                            <div id="messagesFromUser"></div>
                            
                            <div id="sendMEssagePrompt">
                                <input type="text" id="messageContext">
                                <button id="sendAdminMessage">Send</button>
                            </div>
                        </div>
                    </div>

                    <!-- Chat -->

                    
                </div>
            </div>

            
                `
                document.querySelector('#navigationSide').innerHTML += `

                <div id="closeNavigation">
                    X
                </div>



                <a class="anchors" href="#addBookSection">
                <img 
                src="./assets/images/adminPanel/booksSmall.png" 
                alt="anchorHome"
                title="anchorHome"
                id="anchorHome"
                >
                    
                    <p>
                        Home
                    </p>
            </a>

            <a class="anchors" href="#BooksSection">
                <img 
                src="./assets/images/adminPanel/booksSmall.png" 
                alt="anchorHome"
                title="anchorHome"
                id="anchorHome"
                >
                    
                    <p>
                        Books
                    </p>
            </a>

            <a class="anchors" href="#aboutStoreSection">
                <img 
                src="./assets/images/adminPanel/booksSmall.png" 
                alt="anchorHome"
                title="anchorHome"
                id="anchorHome"
                >
                    
                    <p>
                        About
                    </p>
            </a>

            <a class="anchors" href="#joinUsSection">
                <img 
                src="./assets/images/adminPanel/booksSmall.png" 
                alt="anchorHome"
                title="anchorHome"
                id="anchorHome"
                >
                    
                    <p>
                        Join Us
                    </p>
            </a>

            <a class="anchors" href="#contactUsSection">
                <img 
                src="./assets/images/adminPanel/booksSmall.png" 
                alt="anchorHome"
                title="anchorHome"
                id="anchorHome"
                >
                    
                    <p>
                        Contact
                    </p>
            </a>

            <a class="anchors" href="">
                <img 
                src="./assets/images/adminPanel/booksSmall.png" 
                alt="anchorHome"
                title="anchorHome"
                id="anchorHome"
                >
                    
                    <p>
                        Logout
                    </p>
            </a>
                `


                const elementOfScript = document.createElement('script')
                elementOfScript.setAttribute('src', './assets/javascripts/secondAdmin.js')
                elementOfScript.setAttribute('type', 'module')
                document.querySelector('body').append(elementOfScript)
                defValue = 0;
                defValue = 0;
            }
            }
        })
    }
}

adminLoginButton.addEventListener('click', function(e){
    e.preventDefault();
    detectUser(adminUsername.value, adminPassword.value)
    adminUsername.value = ""
    adminPassword.value = ""
})

window.addEventListener('keyup', function(e){
    e.preventDefault();
    if(e.key == 'Enter' && adminUsername.value && adminPassword.value ){
        detectUser(adminUsername.value, adminPassword.value)
        adminUsername.value = ""
        adminPassword.value = ""
    }
})
// end of detecting admins




