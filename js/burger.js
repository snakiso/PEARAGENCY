let hamburger = document.querySelector('.menu-open')
let nav = document.querySelector('.nav-mobile')

hamburger.addEventListener('click', () => {
 hamburger.classList.toggle('active')
 nav.classList.toggle('active')
})

var $containers = $('[data-animation]:not([data-animation-child]), [data-animation-container]');
$containers.scrollAnimations();