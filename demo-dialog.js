const trigger = document.querySelector(".demo-trigger");
const dialog = document.querySelector("#gesture-demo");
const demo = dialog.querySelector("img");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
let animation;
const status = dialog.querySelector(".demo-status");
let closing = false;

trigger.addEventListener("click", () => {
  if (dialog.open) return;
  dialog.showModal();
  if (!reducedMotion.matches) {
    animation = dialog.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 240,
      easing: "ease-out",
    });
  }
  if (!demo.hasAttribute("src")) {
    status.textContent = "Loading demo…";
    demo.src = demo.dataset.src;
    demo.decode().then(() => {
      demo.hidden = false;
      status.textContent = "";
    }).catch(() => {
      demo.removeAttribute("src");
      status.textContent = "The demo couldn’t load. Close this window and try again.";
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

const terminal = document.querySelector(".terminal-screen");
terminal.addEventListener("click", () => {
  if (matchMedia("(hover: none)").matches) {
    terminal.classList.remove("is-playing");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => terminal.classList.add("is-playing"));
    });
  }
});
