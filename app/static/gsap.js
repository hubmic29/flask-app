gsap.registerPlugin(SplitText);

const mainHeadline = document.querySelectorAll(".shopping-text, .important-text, .todo-text");
const tagline = document.querySelector(".tagline");

const splitHeadline = new SplitText(mainHeadline, { type: "chars, words" });
const splitTagline = new SplitText(tagline, { type: "words" });

const tl = gsap.timeline({ defaults: { ease: "power2.out" } });


tl.from(splitHeadline.chars, {
  y: 100,
  rotationX: 90,
  opacity: 0,
  transformOrigin: "center top",
  perspective: 700,
  duration: 0.6,
  stagger: 0.03,
})

.from(splitTagline.words, {
  x: 40,
  opacity: 0,
  duration: 0.2,
  stagger: 0.1,
}, "-=0.2")

// Input + Add button
.from(".center-list input, .center-list .add-button", {
  y: 50,
  opacity: 0,
  duration: 0.2,
  stagger: 0.2,
}, "-=0.3");


gsap.from(".column-box", {
  y: 50,
  opacity: 0,
  duration: 1.2,
  stagger: 0.2,
  ease: "power3.out"
});

