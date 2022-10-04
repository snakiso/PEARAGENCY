window.addEventListener('load', () => {
 var grid = document.querySelector('.grid');
 var msnry = new Masonry(grid, {
  // options
  itemSelector: '.grid-item',
  columnWidth: 286,
  gutter: 30,
  resize: true,
 });
})