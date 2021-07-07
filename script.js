'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector(`.header`);

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener(`click`, openModal));
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//page smooth scrolling
const btnScrollTo = document.querySelector(`.btn--scroll-to`);
const section1 = document.querySelector(`#section--1`);

btnScrollTo.addEventListener(`click`, function (e) {
  e.preventDefault;
  const s1coords = section1.getBoundingClientRect(); //get the coordinates of section1
  console.log(s1coords);
  // window.scrollTo(s1coords.left + pageXOffset, s1coords.top + pageYOffset);
  window.scrollTo({
    left: s1coords.left + pageXOffset,
    top: s1coords.top + pageYOffset,
    behavior: `smooth`,
  });
  // section1.scrollIntoView({ behavior: `smooth` });
});

//page navigation
// document.querySelectorAll(`.nav__link`).forEach(nvL =>
//   nvL.addEventListener(`click`, function (e) {
//     e.preventDefault();
//     const sectionID = this.getAttribute(`href`);
//     console.log(sectionID);
//     document.querySelector(sectionID).scrollIntoView({ behavior: `smooth` });
//   })
// );

//forEach is running "addEventListener" method for every button, we need a better way
document.querySelector(`.nav__links`).addEventListener(`click`, function (e) {
  e.preventDefault();
  // console.log(e.target);
  if (e.target.classList.contains(`nav__link`)) {
    const sectionID = e.target.getAttribute(`href`);
    document.querySelector(sectionID).scrollIntoView({ behavior: `smooth` });
  }
});

//tabbed component
const tabs = document.querySelectorAll(`.operations__tab`);
const tabsContainer = document.querySelector(`.operations__tab-container`);
const contents = document.querySelectorAll(`.operations__content`);

// tabs.forEach(tab =>
//   tab.addEventListener(`click`, function (e) {
//     console.log(`click`);
//   })
// );
tabsContainer.addEventListener(`click`, function (e) {
  const click = e.target.closest(`.operations__tab`);
  if (!click) return; //otherwise console will report null when click OUTSIDE the buttons but INSIDE the container

  //Active the clicked and deactive the not clicked
  tabs.forEach(tab => tab.classList.remove(`operations__tab--active`));
  click.classList.add(`operations__tab--active`);

  //Active and deactive the content tabs according to the clicked button
  contents.forEach(content =>
    content.classList.remove(`operations__content--active`)
  );
  document
    .querySelector(`.operations__content--${click.dataset.tab}`)
    .classList.add(`operations__content--active`);
});

//menu fade animation
const nav = document.querySelector(`.nav`);
nav.addEventListener(`mouseover`, function (e) {
  // const links = e.target.closest(`.nav__links`);
  if (e.target.classList.contains(`nav__link`)) {
    const links = e.target
      .closest(`.nav__links`)
      .querySelectorAll(`.nav__link`);
    links.forEach(link => (link.style.opacity = 0.5));
    e.target.closest(`.nav`).querySelector(`img`).style.opacity = 0.5;
    e.target.style.opacity = 1;
  }
});

nav.addEventListener(`mouseout`, function (e) {
  if (e.target.classList.contains(`nav__link`)) {
    const links = e.target
      .closest(`.nav__links`)
      .querySelectorAll(`.nav__link`);
    links.forEach(link => (link.style.opacity = 1));
    e.target.closest(`.nav`).querySelector(`img`).style.opacity = 1;
    // e.target.style.opacity = 1;
  }
});

//sticky navigation (very LOW efficiency)
// const s1coords = section1.getBoundingClientRect();
// window.addEventListener(`scroll`, function () {
//   if (window.scrollY >= s1coords.top) {
//     nav.classList.add(`sticky`);
//   } else {
//     nav.classList.remove(`sticky`);
//   }
// });

//intersection Observer API
// const obsFunction = function (entries) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
// const obsTrigger = {
//   root: null,
//   threshold: 0.1,
// };
// const obServer = new IntersectionObserver(obsFunction, obsTrigger);
// obServer.observe(section1);

//apply Intersection Observer API to realise Sticky Navigation
const stickyFunction = function (entries) {
  const [entry] = entries; //get the 1st element of the array
  if (entry.isIntersecting) {
    nav.classList.remove(`sticky`);
  } else {
    nav.classList.add(`sticky`);
  }
};
const stickyTrigger = {
  root: null,
  threshold: 0,
  rootMargin: `-90px`,
};
const stickyObserver = new IntersectionObserver(stickyFunction, stickyTrigger);
stickyObserver.observe(header);

//Revealing Elements in Animation
const allSections = document.querySelectorAll(`.section`);
const animFunction = function (entries, observe) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove(`section--hidden`);
  observe.unobserve(entry.target);
};
const animTrigger = {
  root: null,
  threshold: 0.15,
};
const animObserver = new IntersectionObserver(animFunction, animTrigger);
allSections.forEach(section => {
  animObserver.observe(section);
  // section.classList.add(`section--hidden`);
});

//lazy loading imgs
const allLazyImages = document.querySelectorAll(`img[data-src]`);

const lazyFunction = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  //replace img "src" with "data-src"
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener(`load`, function () {
    entry.target.classList.remove(`lazy-img`);
  });
  observer.unobserve(entry.target);
};
const lazyTrigger = {
  root: null,
  threshold: 0.5,
};
const lazyObserver = new IntersectionObserver(lazyFunction, lazyTrigger);
allLazyImages.forEach(lazyImg => {
  lazyObserver.observe(lazyImg);
});

//Slider Component
const allSlides = document.querySelectorAll(`.slide`);
const slider = document.querySelector(`.slider`);
const slideLeftButton = document.querySelector(`.slider__btn--left`);
const slideRightButton = document.querySelector(`.slider__btn--right`);
// slider.style.transform = `scale(0.5)`;
// slider.style.overflow = `visible`;
let currentSlide = 0;
const slideNumber = allSlides.length;
//giving each slide its ORIGINAL position
allSlides.forEach(
  (slide, index) => (slide.style.transform = `translateX(${100 * index}%)`)
);
//slide LEFT function
const slideLEFT = function () {
  if (currentSlide === slideNumber - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  allSlides.forEach(
    (slide, index) =>
      (slide.style.transform = `translateX(${100 * (index - currentSlide)}%)`)
  );
};
//slide RIGHT function
const slideRIGHT = function () {
  if (currentSlide === 0) {
    currentSlide = slideNumber - 1;
  } else {
    currentSlide--;
  }

  allSlides.forEach(
    (slide, index) =>
      (slide.style.transform = `translateX(${100 * (index - currentSlide)}%)`)
  );
};
//left button function
slideLeftButton.addEventListener(`click`, slideLEFT);
//right button function
slideRightButton.addEventListener(`click`, slideRIGHT);
//left/right arrow keys to slide
document.addEventListener(`keydown`, function (e) {
  if (e.key === `ArrowLeft`) {
    slideLEFT();
  }
  if (e.key === `ArrowRight`) {
    slideRIGHT();
  } else {
    return;
  }
});
//DEACTIVATE dots
const allDots = document.querySelectorAll(`.dots__dot`);
const deactiveDots = function () {
  allDots.forEach(dot => dot.classList.remove(`dots__dot--active`));
};
//using dots to control slide
const div_Dots = document.querySelector(`.dots`);
div_Dots.addEventListener(`click`, function (e) {
  // console.log(e.target);
  if (e.target.classList.contains(`dots__dot`)) {
    deactiveDots();
    e.target.classList.add(`dots__dot--active`);
    // console.log(e.target.dataset.slide);
    allSlides.forEach(
      (slide, index) =>
        (slide.style.transform = `translateX(${
          100 * (index - e.target.dataset.slide + 1)
        }%)`)
    );
  } else {
    return;
  }
});
// alert before leaving the page????????
window.addEventListener(`beforeunload`, function (e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = ``;
});

/*
//////////////////////////////////
document.documentElement;

//select by Class
const allSections = document.querySelectorAll(`.section`);

//select by ID
document.getElementById(`section--1`);

//select by Tag Name
const allButtons = document.getElementsByTagName(`button`);

//create & insert elements
const message = document.createElement(`div`);
message.classList.add(`cookie-message`);
// message.textContent = `This is John Xue's first cookie message!`;
message.innerHTML = `This is John Xue's first cookie message! <button class="btn btn-close-cookie">Got it!</button>`;
// header.prepend(message);
header.append(message);
// header.append(message.cloneNode(true));

//delete element
document
  .querySelector(`.btn-close-cookie`)
  .addEventListener(`click`, function () {
    message.remove();
  });

//styles
message.style.backgroundColor = `#37383d`;
message.style.width = `120%`;

//if .style can't get an attribute then use "getComputedStyle()"
// console.log(getComputedStyle(message).height);

//document
document.documentElement.style.setProperty(`--color-primary`, `red`);

//Attributes
const logo = document.querySelector(`.nav__logo`);

//smooth scrolling
const btnScrollTo = document.querySelector(`.btn--scroll-to`);
const section1 = document.querySelector(`#section--1`);
btnScrollTo.addEventListener(`click`, function (e) {
  e.preventDefault;
  const s1coords = section1.getBoundingClientRect(); //get the coordinates of section1
  console.log(s1coords);

  //scrolling
  // window.scrollTo(s1coords.left + pageXOffset, s1coords.top + pageYOffset);
  window.scrollTo({
    left: s1coords.left + pageXOffset,
    top: s1coords.top + pageYOffset,
    behavior: `smooth`,
  });
  // section1.scrollIntoView({ behavior: `smooth` });
});

//find the relative coords of current viewport to the original point
// console.log(pageXOffset, pageYOffset);

//new event listeners
const h1 = document.querySelector(`h1`);

const mouseEnter = function (e) {
  // alert(`You are reading the headline!`);
};

h1.addEventListener(`mouseenter`, mouseEnter); //new way of listening to event

// h1.onmouseenter = e => alert(`You are reading the headline again!`); //old way to react to event

//remove listener after 8secs
setTimeout(() => h1.removeEventListener(`mouseenter`, mouseEnter), 8000);

//create random colour:rgb(255,255,255)
const rdNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const rdColour = () =>
  `rgb(${rdNumber(0, 255)}, ${rdNumber(0, 255)},${rdNumber(0, 255)})`;

console.log(rdColour());

//change BGC of every PARENT ELEMENT, everytime click the "Features" button
document.querySelector(`.nav__link`).addEventListener(`click`, function (e) {
  this.style.backgroundColor = rdColour();
});

document.querySelector(`.nav__links`).addEventListener(`click`, function (e) {
  this.style.backgroundColor = rdColour();
  e.stopPropagation(); //stop any propagation for further parents
});

document.querySelector(`.nav`).addEventListener(`click`, function (e) {
  this.style.backgroundColor = rdColour();
});

//DOM Traversing
const h1 = document.querySelector(`h1`);
console.log(h1.childNodes);
console.log(h1.children);
console.log(h1.firstElementChild);
*/
