// Load navigation from nav.html
async function loadNav() {
  try {
    const response = await fetch("nav.html");
    const navHTML = await response.text();

    const navContainer = document.createElement("div");
    navContainer.innerHTML = navHTML;
    const navElement = navContainer.firstElementChild;

    // hide until fonts have loaded to avoid flash of unstyled text
    navElement.style.visibility = "hidden";
    document.body.insertBefore(navElement, document.body.firstChild);

    // reveal when fonts ready
    document.fonts.ready.then(() => {
      navElement.style.visibility = "";
    }).catch(() => {
      navElement.style.visibility = "";
    });

    attachSmoothScroll();
  } catch (error) {
    console.error("Error loading navigation:", error);
  }
}


async function loadFooter() {
  try {
    const response = await fetch("footer.html");
    const footerHTML = await response.text();
    const footerContainer = document.createElement("div");
    footerContainer.innerHTML = footerHTML;
    const footerElement = footerContainer.firstElementChild;

    // hide until fonts are ready (avoids size jump)
    footerElement.style.visibility = "hidden";
    document.body.appendChild(footerElement);

    document.fonts.ready.then(() => {
      footerElement.style.visibility = "";
    }).catch(() => {
      footerElement.style.visibility = "";
    });
  } catch (error) {
    console.error("Error loading footer:", error);
  }
}

// Load nav if it doesn't already exist in the page
if (!document.querySelector("nav")) {
  loadNav();
}

// Load footer if missing
if (!document.querySelector("footer")) {
  loadFooter();
}

// Smooth scroll
function attachSmoothScroll() {
  document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const href = anchor.getAttribute("href");
      const hashIndex = href.indexOf("#");
      if (hashIndex === -1) return; // no hash, ignore
      const hash = href.slice(hashIndex);

      // determine target path (if any)
      let path = href.slice(0, hashIndex);
      if (path.startsWith("/")) path = path.slice(1);

      // normalize current location and link path
      let current = window.location.pathname.split("/").pop();
      if (!current) current = "index.html";
      if (!path) path = "";

      // if no explicit path and we are not on index, redirect there
      if (!path && current !== "index.html") {
        e.preventDefault();
        window.location.href = "index.html" + hash;
        return;
      }

      // if explicit path differs from current, allow default navigation
      if (path && path !== current) {
        return;
      }

      // same-page hash scrolling
      e.preventDefault();
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

attachSmoothScroll();

// Fade-in animation
const sections = document.querySelectorAll("section");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.1 });

sections.forEach(section => observer.observe(section));

// Navbar shadow on scroll
const nav = document.querySelector("nav");

if (nav) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  });
}