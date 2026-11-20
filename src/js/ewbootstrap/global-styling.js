(function ($) {
  $(".cta-menu-toggle").click(function () {
    $(".cta-flex").toggleClass("active");
    $(".cta-menu-toggle").toggleClass("active");
  });
})(jQuery);
document.addEventListener("DOMContentLoaded", function () {
  function applyCSSToLastTwoRows() {
    const rows = document.querySelectorAll(".views-row");
    if (rows.length >= 8) {
      rows[6].classList.add("last-two");
      rows[7].classList.add("last-two");
    }
  }
  applyCSSToLastTwoRows();
  const observer = new MutationObserver(() => {
    applyCSSToLastTwoRows();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  document.querySelectorAll(".pager__item a").forEach((link) => {
    link.addEventListener("click", () => {
      setTimeout(applyCSSToLastTwoRows, 500);
    });
  });
  window.addEventListener("pageshow", function (event) {
    if (event.persisted) applyCSSToLastTwoRows();
  });
  window.addEventListener("focus", applyCSSToLastTwoRows);
});
function getBackgroundColor(element) {
  let backgroundColor = element.style.backgroundColor;
  if (!backgroundColor || backgroundColor === "rgba(0, 0, 0, 0)")
    backgroundColor = window
      .getComputedStyle(element)
      .getPropertyValue("background-color");
  if (backgroundColor === "rgba(0, 0, 0, 0)") return false;
  return backgroundColor;
}
function isBackgroundDark(bgColor) {
  if (bgColor == "transparent") return;
  console.log(bgColor);
  var rgba = bgColor.match(/\d+/g);
  const r = rgba[0];
  const g = rgba[1];
  const b = rgba[2];
  const luminance =
    (0.2126 * r) / 255 + (0.7152 * g) / 255 + (0.0722 * b) / 255;
  return luminance < 0.5;
}
function searchElementForBackground(element) {
  let backgroundColor = getBackgroundColor(element);
  if (backgroundColor) return backgroundColor;
  else if (element.parentElement)
    return searchElementForBackground(element.parentElement);
  else return undefined;
}
function setLinkColors() {
  const allLinks = document.querySelectorAll(
    '.layout-container a:not([href^="mailto:"]):not([href^="tel:"]):not(.cta):not(.btn)',
  );
  allLinks.forEach((link) => {
    let backgroundColor = searchElementForBackground(link);
    if (backgroundColor)
      if (isBackgroundDark(backgroundColor)) link.classList.add("white_link");
      else link.classList.add("black_link");
  });
}
document.addEventListener("DOMContentLoaded", setLinkColors);
function hasClass(element, className) {
  return (" " + element.className + " ").indexOf(" " + className + " ") > -1;
}
var elements = document.querySelectorAll(".box__visual-inner");
elements.forEach(function (element) {
  if (element.querySelector(".media") !== null) {
    var entryGridItem = element.closest(".entry__grid-item");
    if (entryGridItem) entryGridItem.classList.add("new_class");
  }
});
function removeSpacesFromTelLinks() {
  var telLinks = document.querySelectorAll('a[href^="tel:"]');
  telLinks.forEach(function (link) {
    var href = link.getAttribute("href");
    href = href.replace(/\s/g, "");
    link.setAttribute("href", href);
  });
}
document.addEventListener("DOMContentLoaded", function () {
  removeSpacesFromTelLinks();
});
document.addEventListener("DOMContentLoaded", function () {
  var paragraphs = document.querySelectorAll(".layout-container p");
  paragraphs.forEach(function (p) {
    p.innerHTML = p.innerHTML.replace(/&nbsp;/g, " ");
  });
});
function getBackgroundColor(element) {
  let backgroundColor = element.style.backgroundColor;
  if (!backgroundColor || backgroundColor === "rgba(0, 0, 0, 0)")
    backgroundColor = window
      .getComputedStyle(element)
      .getPropertyValue("background-color");
  if (backgroundColor === "rgba(0, 0, 0, 0)") return false;
  return backgroundColor;
}
function isBackgroundDark(bgColor) {
  var rgba = bgColor.match(/\d+/g);
  const r = rgba[0];
  const g = rgba[1];
  const b = rgba[2];
  const luminance =
    (0.2126 * r) / 255 + (0.7152 * g) / 255 + (0.0722 * b) / 255;
  return luminance < 0.5;
}
function searchElementForBackground(element) {
  let backgroundColor = getBackgroundColor(element);
  if (backgroundColor) return backgroundColor;
  else if (element.parentElement)
    return searchElementForBackground(element.parentElement);
  else return undefined;
}
function setElementColors() {
  const allElements = document.querySelectorAll("h1, h2, .ewh1, .ewh2, p");
  allElements.forEach((element) => {
    let backgroundColor = searchElementForBackground(element);
    if (backgroundColor)
      if (isBackgroundDark(backgroundColor))
        element.classList.add("white_text");
  });
}
document.addEventListener("DOMContentLoaded", setElementColors);
document.addEventListener("DOMContentLoaded", function () {
  const keyword = "indgangsvinkel8";
  document.querySelectorAll("[id]").forEach((element) => {
    if (element.id.includes(keyword)) {
      const wrapper = document.createElement("div");
      wrapper.id = "custom-style-block";
      while (element.firstChild) wrapper.appendChild(element.firstChild);
      element.appendChild(wrapper);
    }
  });
});
