import dataBase from "../javascripts/database.mjs  ";
import {
  ref,
  set,
  get,
  onValue,
  query,
  orderByChild,
  equalTo,
  remove,
  push,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

const swiper_all = new Swiper(".swiper.swiper_catalog", {
  // Optional parameters
  slidesPerView: 5,
  direction: "horizontal",
  loop: true,
  // Navigation arrows
  navigation: {
    nextEl: ".all_swiper-button-next",
    prevEl: ".all_swiper-button-prev",
  },

  autoplay: {
    delay: 2000,
  },
  breakpoints: {
    // when window width is >= 320px
    320: {
      slidesPerView: 1.5,
      spaceBetween: 20,
    },
    // when window width is >= 480px
    480: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    // when window width is >= 640px
    767: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    1200: {
      slidesPerView: 5,
      spaceBetween: 20,
    },
  },
});


// firebase for all books

onValue(ref(dataBase, "books"),async data => {
  if(data.exists()){
    document.querySelector('#all_swiper_books').innerHTML = ""
    for(let keys in data.val()){
        document.querySelector('#all_swiper_books').innerHTML += `
        <div class="swiper-slide">
          <div class="catalog_swiper_card">
          ${await setNewLabel(data.val()[keys].title)}
          <img class="swiper_img" src="${data.val()[keys].imageURL}" alt="">
          <h3 class="swiper_book">${data.val()[keys].title}</h3>
          <button class="swiper_btn">Read More</button>
          </div>
        </div> `
        
        swiper_all.update()
    }
  }
})


// Show All Categories from Firebase
function getCategories(){
  onValue(ref(dataBase, 'bookTypes/'), result => {
    if(result.exists()){
      document.querySelector('#catalog_categories').innerHTML = ''
      for(let key in result.val()){
        document.querySelector('#catalog_categories').innerHTML += `
          <li>
            <button class="showThisCategory" id="${result.val()[key]}">${result.val()[key]}</button>
          </li>
        `
        document.querySelectorAll('.showThisCategory').forEach(function(item){
          item.addEventListener('click', function(e){
            window.scroll(0, 600)
            showSelectedCategory(`${this.id}`)
          })
        })
      }
    }
  })
}
getCategories()


// ++++++++++++++++++++++++++++Swiper for new books ++++++++++++++++++++++++++++


const new_release_swiper = new Swiper(".swiper.new_swiper_catalog", {
  // Optional parameters
  slidesPerView: 5,
  direction: "horizontal",
  loop: true,
  // Navigation arrows
  navigation: {
    nextEl: ".new_swiper-button-next",
    prevEl: ".new_swiper-button-prev",
  },

  autoplay: {
    delay: 2000,
  },
  breakpoints: {
    // when window width is >= 320px
    320: {
      slidesPerView: 1.5,
      spaceBetween: 20,
    },
    // when window width is >= 480px
    480: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    // when window width is >= 640px
    767: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    1200: {
      slidesPerView: 5,
      spaceBetween: 20,
    },
  },
});
var period = 0;

async function setNewLabel(bookName){
  await get(ref(dataBase, `books/${bookName}`)).then(result => {
    if(result.exists()){
      var addedTime = result.val().dateRelease
      var currentTime = new Date()
      period = currentTime.getTime() - addedTime
    }
  })
  if(period > 2629800000){
    return ""
  }else{
    return '<span>New</span>'
  }
}

// Adding new releases
onValue(ref(dataBase, "books/"),async data => {
  if(data.exists()){

    document.querySelector('#new_swiper_books').innerHTML = ""
    

    for(let keys in data.val()){
        if(await setNewLabel(data.val()[keys].title) != ""){
          document.querySelector('#new_swiper_books').innerHTML += `
          <div class="swiper-slide">
            <div class="catalog_swiper_card">
            <span>New</span>
            <img class="swiper_img" src="${data.val()[keys].imageURL}" alt="">
            <h3 class="swiper_book">${data.val()[keys].title}</h3>
            <button class="swiper_btn">Read More</button>
            </div>
          </div> `
          new_release_swiper.update();
          updateReadMoreButtons()
        }
        
    }
  }
})


// Categories swiper
const selected_release_swiper = new Swiper(".swiper.selected_swiper_catalog", {
  // Optional parameters
  slidesPerView: 5,
  direction: "horizontal",
  loop: true,
  // Navigation arrows
  navigation: {
    nextEl: ".selected_swiper-button-next",
    prevEl: ".selected_swiper-button-prev",
  },

  autoplay: {
    delay: 2000,
  },
  breakpoints: {
    // when window width is >= 320px
    320: {
      slidesPerView: 1.5,
      spaceBetween: 20,
    },
    // when window width is >= 480px
    480: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    // when window width is >= 640px
    767: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    1200: {
      slidesPerView: 5,
      spaceBetween: 20,
    },
  },
});


function showBestSellers(){
  onValue(ref(dataBase, 'books/'),async result => {
    if(result.exists()){
      document.querySelector('#selected_swiper_books').innerHTML = ""
      for(let key in result.val()){
        if(result.val()[key].counter >= 10){
            document.querySelector('#selected_swiper_books').innerHTML += `
            <div class="swiper-slide">
              <div class="catalog_swiper_card">
              ${await setNewLabel(result.val()[key].title)}
              <img class="swiper_img" src="${result.val()[key].imageURL}" alt="">
              <h3 class="swiper_book">${result.val()[key].title}</h3>
              <button class="swiper_btn">Read More</button>
              </div>
            </div>
            `
          selected_release_swiper.update()
          updateReadMoreButtons()
        }
      }
    }
  })
}



function showSelectedCategory(categoryName){
  onValue(ref(dataBase, `bookTypes/${categoryName}`),data => {
    if(data.exists()){
      document.querySelector('#category_swiper').innerHTML = `
          <h2 class="catalog_title">${data.val()}</h2>
        `
      onValue(ref(dataBase, 'books/'),async result => {
        if(result.exists()){
          document.querySelector('#selected_swiper_books').innerHTML = ""
          for(let key in result.val()){
            if(result.val()[key].category == categoryName){
                document.querySelector('#selected_swiper_books').innerHTML += `
                <div class="swiper-slide">
                  <div class="catalog_swiper_card">
                  ${await setNewLabel(result.val()[key].title)}
                  <img class="swiper_img" src="${result.val()[key].imageURL}" alt="">
                  <h3 class="swiper_book">${result.val()[key].title}</h3>
                  <button class="swiper_btn">Read More</button>
                  </div>
                </div> 
                `
              
              selected_release_swiper.update()
              updateReadMoreButtons()
            }
          }
        }
      })
    }
  })
}

onValue(ref(dataBase, 'books/'),result => {
  if(result.exists()){
    updateReadMoreButtons()
  }
})

showBestSellers()

// Sending name of book to read more page

async function updateReadMoreButtons(){
  document.querySelectorAll('.swiper_btn')
  .forEach(function(item) {
    item.addEventListener('click', function(){
      var selectedBook = item.parentNode.querySelector('.swiper_book').innerHTML;
      get(ref(dataBase, `books/${selectedBook}/`)).then(async data => {
        if(data.exists()){
          var counter = parseInt(data.val().counter);
          await set(ref(dataBase, `books/${selectedBook}/counter`), (counter + 1))
        }
      })
      
      window.location.href = '/bookstore/assets/pages/readmore.html?selectedBook=' + encodeURIComponent(selectedBook);
    })
  })
}

// Getting infor from category in index page

window.addEventListener('load', function(){
  var searchParams = new URLSearchParams(window.location.search);
  var selectedBook = searchParams.get('selectedCategory');
  
  get(ref(dataBase, `bookTypes/`)).then(data => {
      if(data.exists()){
          for(let key in data.val()){

              if(data.val()[key] == selectedBook){
                showSelectedCategory(data.val()[key])
                  
              }
          }
      }
  })

})