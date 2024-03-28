var sponsorSection = document.querySelector('#sponsorSection');
var sponsors = document.querySelector('#sponsors')
var closeButton = document.querySelector('#closeButton')
var sponsorsList = document.querySelector('#sponsorsList')

sponsorSection.addEventListener('click', function(){
    sponsors.style.transform = "translateX(0px)"
})

closeButton.addEventListener('click', function(){
    sponsors.style.transform = "translateX(390px)"  
})