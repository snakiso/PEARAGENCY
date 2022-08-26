let hamburger = document.querySelector('.menu-open')
let nav = document.querySelector('.nav-mobile')

hamburger.addEventListener('click', () => {
 hamburger.classList.toggle('active')
 nav.classList.toggle('active')
})

 $(document).mouseup(function (e) { // событие клика по веб-документу
  var div = $(".nav-mobile"); // Элемент, клик по которому не должен приводить к закрытию. 
  if (!div.is(e.target) // если клик был не по нашему блоку
   && div.has(e.target).length === 0) { // и не по его дочерним элементам
   $('.menu-open').removeClass('active');
   $('.nav-mobile').removeClass('active');
  }
 });


var $containers = $('[data-animation]:not([data-animation-child]), [data-animation-container]');
$('[data-animation-start]').scrollAnimations({
 offset: 0.9
});
$containers.scrollAnimations();