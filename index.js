document.addEventListener("DOMContentLoaded", () => {
  const burgerIcon = document.querySelector(".burger-icon");
  const rightNav = document.querySelector(".right-nav");

  burgerIcon.addEventListener("click", () => {
    rightNav.classList.toggle("active");
  });

  document.addEventListener("click", (event) => {
    if (!rightNav.contains(event.target) && !burgerIcon.contains(event.target)) {
      rightNav.classList.remove("active");
    }
  });

  // Apply skeleton effect to all non-bold text nodes
  const isTextNode = (node) => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim().length > 0;

  const shouldSkip = (el) => {
    return el.closest("b, strong, h1, h2, h3, h4, h5, h6") !== null;
  };

  const walk = (element) => {
    element.childNodes.forEach((node) => {
      if (isTextNode(node) && !shouldSkip(node.parentElement)) {
        const span = document.createElement("span");
        span.className = "skeleton-text";
        span.style.width = `${Math.max(40, node.nodeValue.length * 6)}px`;
        node.parentElement.replaceChild(span, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        walk(node);
      }
    });
  };

  // walk(document.body);
});
