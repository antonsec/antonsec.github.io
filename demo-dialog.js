const trigger = document.querySelector(".demo-trigger");
const dialog = document.querySelector("#gesture-demo");
const demo = dialog.querySelector("img");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
let animation;
let opening = false;
let closing = false;

trigger.addEventListener("click", async () => {
  if (opening || dialog.open) return;
  opening = true;
  await demo.decode().catch(() => {});
  opening = false;
  dialog.showModal();
  if (!reducedMotion.matches) {
    animation = dialog.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 240,
      easing: "ease-out",
    });
  }
});

async function closeDemo(event) {
  event.preventDefault();
  if (closing) return;
  closing = true;

  if (!reducedMotion.matches) {
    const opacity = getComputedStyle(dialog).opacity;
    animation?.cancel();
    dialog.classList.add("is-closing");
    animation = dialog.animate([{ opacity }, { opacity: 0 }], {
      duration: 180,
      easing: "ease-in",
      fill: "forwards",
    });
    await animation.finished.catch(() => {});
  }

  dialog.close();
  dialog.classList.remove("is-closing");
  animation?.cancel();
  closing = false;
}

dialog.addEventListener("submit", closeDemo);
dialog.addEventListener("cancel", closeDemo);
