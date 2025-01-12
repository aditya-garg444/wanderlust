const filters = document.querySelector('.filters');
const leftBtn = document.querySelector('.left-btn');
const rightBtn = document.querySelector('.right-btn');
const filterWidth = document.querySelector(".filter").offsetWidth;
const scrollAmount = filterWidth * 12; // Adjust to scroll 2-3 divs at a time
// Scroll left
leftBtn.addEventListener('click', () => {
  filters.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
});
// Scroll right
rightBtn.addEventListener('click', () => {
  filters.scrollBy({ left: scrollAmount, behavior: 'smooth' });
});