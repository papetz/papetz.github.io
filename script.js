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

// expose pubic helpers
window.loadPost = loadPost;

// handle browser navigation events (back/forward)
window.addEventListener('popstate', event => {
  if (event.state && event.state.type === 'post') {
    loadPost(event.state.file);
  }
});

// Load a post markdown into #main-content (SPA-friendly)
function loadPost(file) {
  if (!file) {
    return;
  }
  const container = document.getElementById("main-content");
  if (!container) {
    // not on a page that supports dynamic loading; just navigate
    window.location.href = "post.html#" + file;
    return;
  }

  // replace content with spinner/placeholder
  container.innerHTML = `<section><div id="content">Loading...</div></section>`;
  fetch("posts/" + file + ".md")
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}: Could not load post`);
      return res.text();
    })
    .then(text => {
      container.querySelector("#content").innerHTML = marked.parse(text);
      renderMathInElement(container);
      window.scrollTo(0, 0);
      document.title = file.replace(/-/g, " ") + " – Paul | Research";
    })
    .catch(err => {
      container.querySelector("#content").innerHTML = "<p>Error loading post: " + err.message + "</p>";
      console.error(err);
    });
}

// intercept internal link clicks for SPA-style navigation
document.addEventListener('click', e => {
  const anchor = e.target.closest('a');
  if (!anchor) return;
  const href = anchor.getAttribute('href');
  if (!href || href.startsWith('http') || href.startsWith('mailto:')) return;

  // post link
  if (href.startsWith('post.html')) {
    const hash = href.split('#')[1];
    if (hash) {
      e.preventDefault();
      loadPost(hash);
      history.pushState({ type: 'post', file: hash }, '', href);
    }
  }
});

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

window.addEventListener("scroll", () => {
  if (window.scrollY > 10) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});

// on initial load, handle hash/post if present
window.addEventListener('load', () => {
  const hash = window.location.hash.slice(1);
  if (hash) {
    // either a direct post link or section
    if (window.location.pathname.endsWith('post.html')) {
      loadPost(hash);
    } else if (hash.startsWith('post=')) {
      loadPost(hash.split('=')[1]);
    } else {
      // scroll to section on same page
      const target = document.querySelector('#' + hash);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
  }
});