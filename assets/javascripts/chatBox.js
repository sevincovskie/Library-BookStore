import dataBase from "./database.mjs";
import {set, get, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"

function openForm() {
    get(ref(dataBase, 'joinedUser')).then(result => {
      if(result.exists()){
        if(result.val() == "0"){
          set(ref(dataBase, 'joinedUser'), 1)
          document.getElementById("myForm").style.display = "block";
        }else{
          alert('server is full')
        }
      }
    })
  }
  
function closeForm() {
  set(ref(dataBase, "joinedUser"), "0")
  document.getElementById("myForm").style.display = "none";
}

document.querySelector('.open-button').onclick = openForm
document.querySelector('.cancel').onclick = closeForm

var sendMessageToChat = document.querySelector('#sendMessageToChat')
var messageContent = document.querySelector('#messageContent')




  sendMessageToChat.addEventListener('click',async function(e){
    e.preventDefault();
    if(localStorage.getItem('bookstoreUser')){
      await get(ref(dataBase, 'joinedUser')).then(async data => {
        if(data.exists()){
          if(data.val() == "1" || data.val() == localStorage.getItem('bookstoreUser')){
            if(localStorage.getItem('bookstoreUser') && messageContent.value.trim()){
              await set(ref(dataBase, `joinedUser`), localStorage.getItem('bookstoreUser'))
              var snapshot = push(ref(dataBase, 'chat')).key
              var addingData = {
                message: `${messageContent.value.trim()}`,
                sender: `${localStorage.getItem('bookstoreUser')}`
              }
              await set(ref(dataBase, `chat/${snapshot}/`), addingData)
              document.querySelector('#messageContent').value = ''
            }      
          }
        }
      })
    }else{
      document.querySelector('#join_us_panel').style.display = "flex"
    }
    
    
  })

  window.addEventListener('beforeunload', function(){
    set(ref(dataBase, 'joinedUser'), '0')
    set(ref(dataBase, 'chat'), '0')
  })

  onValue(ref(dataBase, 'chat'),async data => {
    if(data.exists()){
      document.querySelector('#allMessages').innerHTML = " "

      for(let keys in data.val()){
        if(data.val()[keys] == "0"){
          document.querySelector('#allMessages').innerHTML = " "
        }else{
          var nameOFSender = '';
          if(data.val()[keys].sender == "admin"){
            nameOFSender = "Admin"
            document.querySelector('#allMessages').innerHTML += `
              <div class="messsage">${nameOFSender} : ${data.val()[keys].message}</div>
            `
          }else{
            nameOFSender = 'Siz'
            document.querySelector('#allMessages').innerHTML += `
              <div style="align-self:flex-end">${nameOFSender} : ${data.val()[keys].message}</div>
            `
          }
        }
        
      }
    }
  })