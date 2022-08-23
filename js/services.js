let buttons = document.querySelectorAll('.offer-item-button')
let minus = document.querySelectorAll('.minus')
let offerItem = document.querySelectorAll('.offer-item')
for(let i = 0; i<buttons.length; i++){
 buttons[i].addEventListener('click', () => {
    minus[i].classList.toggle('active')
  if (minus[i].classList.contains('active')){
    offerItem[i].style.maxHeight = '370px'
  }else{
   offerItem[i].style.maxHeight = '55px'
  }
 })
}
//слайдер 

var swiper = new Swiper('.services-slider', {
  speed: 1200,
  autoplay: {
    delay: 5000
  },
  spaceBetween: 30,
  loop: true,
  autoHeight: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true
  }
});