var swiper = new Swiper('.reviews-slider', {
 speed: 1200,
 autoplay: {
  delay: 5000
 },
 spaceBetween: 30,
 loop: true,
 pagination: {
  el: '.swiper-pagination',
  clickable: true
 }
});

var scene = document.getElementById('scene');
var parallaxInstance = new Parallax(scene, {
 relativeInput: true
});
parallaxInstance.friction(0.2, 0.2)