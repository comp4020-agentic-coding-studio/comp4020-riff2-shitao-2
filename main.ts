const nav = document.querySelector<HTMLElement>('nav[aria-label="Primary"]');
if (nav) {
  nav.dataset.ready = "true";
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function typeOut(code: HTMLElement, text: string) {
  code.textContent = "";
  code.classList.add("typing");
  let shown = 0;
  const interval = window.setInterval(() => {
    shown += 1;
    code.textContent = text.slice(0, shown);
    if (shown >= text.length) {
      window.clearInterval(interval);
      code.classList.remove("typing");
    }
  }, 18);
}

const codeBlocks = document.querySelectorAll<HTMLElement>(".code-block");

codeBlocks.forEach((block) => {
  const code = block.querySelector<HTMLElement>("pre code");
  const button = block.querySelector<HTMLButtonElement>(".copy-code");
  if (!code || !button) return;

  const fullText = code.textContent ?? "";

  if (reduceMotion) {
    code.textContent = fullText;
  } else {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          typeOut(code, fullText);
          obs.unobserve(entry.target);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(block);
  }

  button.addEventListener("click", () => {
    navigator.clipboard
      .writeText(fullText)
      .then(() => {
        button.textContent = "Copied!";
        button.classList.add("copied");
      })
      .catch(() => {
        button.textContent = "Copy failed";
      })
      .finally(() => {
        window.setTimeout(() => {
          button.textContent = "Copy";
          button.classList.remove("copied");
        }, 1500);
      });
  });
});
