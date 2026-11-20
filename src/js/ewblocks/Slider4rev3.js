(function ($) {
  "use strict";
  $(document).ready(function () {
    $(".Slider4rev3").each(function (index, element) {
      if ($(element).data("randomize")) {
        var carouselInner = $(".carousel-inner", element);
        var slides = carouselInner.children("div");
        slides.removeClass("active");
        carouselInner.empty();
        slides = shuffle(slides);
        slides.first().addClass("active");
        carouselInner.append(slides);
      }
    });
    $("#Slider4rev3-" + drupalSettings.Slider4rev3.uid)
      .hammer()
      .on("swipeleft", function () {
        $(this).carousel("next");
      });
    $("#Slider4rev3-" + drupalSettings.Slider4rev3.uid)
      .hammer()
      .on("swiperight", function () {
        $(this).carousel("prev");
      });
    $(".scroll-btn").on("click", function (e) {
      e.preventDefault();
      var hash = this.hash;
      $("html, body").animate(
        { scrollTop: $(hash).offset().top },
        600,
        function () {},
      );
    });
  });
})(jQuery);
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
