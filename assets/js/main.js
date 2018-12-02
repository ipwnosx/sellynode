const header = document.querySelector(".header")
let headerScrolled = false

// Add class to header once scrolled down
window.addEventListener("scroll", () => {
  const top = window.pageYOffset || document.documentElement.scrollTop

  if (headerScrolled && top <= 0) {
    header.classList.remove("scrolled")
    headerScrolled = false
  } else if (!headerScrolled && top > 0) {
    header.classList.add("scrolled")
    headerScrolled = true
  }
})
