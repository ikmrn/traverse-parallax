import "./style.css";

// Image slider
const slideBtns = document.querySelectorAll("[data-slideBtn");
const slideContainer = document.querySelector("[data-slideContainer]");
const contactForm = document.getElementById("contact-form");
const contactBtn = document.getElementById("contact-btn");
const contactInput = document.getElementById("email");
const slides = [...document.querySelectorAll("[data-slide")];
let currentIndex = 0;
let isMoving = false;

// btn handle function
function handleSlideBtnClick(e) {
  if (isMoving) return;
  isMoving = true;
  // TODO: see if slider is already moving
  e.currentTarget.id === "prev" ? currentIndex-- : currentIndex++;
  console.log(currentIndex);
  slideContainer.dispatchEvent(new Event("sliderMove"));
}

// remove/add attribute function
const removeDisabledAttribute = (els) =>
  els.forEach((el) => el.removeAttribute("disabled"));
const addDisabledAttribute = (els) =>
  els.forEach((el) => el.setAttribute("disabled", "true"));

//  Event listeners
slideBtns.forEach((btn) => btn.addEventListener("click", handleSlideBtnClick));

slideContainer.addEventListener("sliderMove", () => {
  // 1. translate the container to the right/left
  slideContainer.style.transform = `translateX(-${
    currentIndex * slides[0].clientWidth
  }px)`;
  // 2. remove disabled attribute
  removeDisabledAttribute(slideBtns);
  // 3. reenable disabled attribute if needed
  currentIndex === 0 && addDisabledAttribute([slideBtns[0]]);
});

// transition and event

slideContainer.addEventListener("transitionend", () => (isMoving = false));

// disable image drag
document
  .querySelectorAll("[data-slide] img")
  .forEach((img) => (img.ondragstart = () => false));

// intersection observer
const slideObserver = new IntersectionObserver(callback, { threshold: 0.75 });
slideObserver.observe(slides[slides.length - 1]);

function callback(slide) {
  if (slide[0].isIntersecting) {
    addDisabledAttribute([slideBtns[1]]);
  }
}

// fake sending email to api endpoint
function postEmailToDataBase(email) {
  console.log(`Your email is ${email}`);
  return new Promise((resolve) => setTimeout(resolve, 2000));
}

// Options for submit button
const contactBtnOptions = {
  pending: `
    <svg xmlns="http://www.w3.org/2000/svg" class="animate-spin" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><line x1="128" y1="32" x2="128" y2="64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="224" y1="128" x2="192" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="195.9" y1="195.9" x2="173.3" y2="173.3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="128" y1="224" x2="128" y2="192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="60.1" y1="195.9" x2="82.7" y2="173.3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="32" y1="128" x2="64" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="60.1" y1="60.1" x2="82.7" y2="82.7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line></svg>
    <span class="uppercase tracking-wide animate-pulse">
    Sending...
    </span>
  `,
  success: `
  <span class="uppercase tracking-wide">
    Thank you!
    </span>
    <span class="uppercase tracking-wide">
    ✌️
    </span>`,
};

async function handleFormSubmit(e) {
  e.preventDefault();
  addDisabledAttribute([contactForm, contactBtn]);
  contactBtn.innerHTML = contactBtnOptions.pending;
  const userEmail = contactInput.value;
  contactInput.style.display = "none";
  await postEmailToDataBase(userEmail);
  contactBtn.innerHTML = contactBtnOptions.success;
}

// form submit event listeners

contactForm.addEventListener("submit", handleFormSubmit);

// Fade up observer
function fadeUpObserverCallback(elsToWatch) {
  elsToWatch.forEach((el) => {
    if (el.isIntersecting) {
      el.target.classList.add("faded");
      fadeUpObserver.unobserve(el.target);
      el.target.addEventListener("transitioned", () => {
        el.target.classList.remove("fade-up", "fade");
      });
    }
  });
}

const fadeUpObserverOptions = { threshold: 0.6 };

const fadeUpObserver = new IntersectionObserver(
  fadeUpObserverCallback,
  fadeUpObserverOptions
);
document.querySelectorAll(".fade-up").forEach((item) => {
  fadeUpObserver.observe(item);
});
