(function ($) {
  "use strict";
  $(document).ready(function () {
    $(".Topslider1").each(function (index, element) {
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
    $("#Topslider1-" + drupalSettings.Topslider1.uid)
      .hammer()
      .on("swipeleft", function () {
        $(this).carousel("next");
      });
    $("#Topslider1-" + drupalSettings.Topslider1.uid)
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
(function ($) {
  "use strict";
  var width = -1;
  $(document).ready(function () {
    if ($("#ew-webform-with-optional-on-left-1-rev4 .fb-page").length > 0) {
      if (
        window.matchMedia("(max-width: 575px)").matches &&
        $("#ew-webform-with-optional-on-left-1-rev4 .fb-page").hasClass(
          "hide-on-xs",
        )
      )
        $("#ew-webform-with-optional-on-left-1-rev4 .fb-page").remove();
      else {
        resizeIframeToParent(false);
        var returnedFunction = debounce(function () {
          resizeIframeToParent(true);
        }, 250);
        window.addEventListener("resize", returnedFunction);
      }
      function resizeIframeToParent(reload) {
        var new_width = Math.round(
          $("#ew-webform-with-optional-on-left-1-rev4 .fb-page")
            .parent()
            .width(),
        );
        var new_height = Math.round(
          $("#ew-webform-with-optional-on-left-1-rev4 .fb-page")
            .parent()
            .height(),
        );
        $("#ew-webform-with-optional-on-left-1-rev4 .fb-page").css(
          "width",
          new_width,
        );
        $("#ew-webform-with-optional-on-left-1-rev4 .fb-page").css(
          "height",
          new_height,
        );
        $(".fb-page")
          .attr("data-width", Math.round(new_width))
          .attr("data-height", Math.round(new_height));
        if (reload)
          if ($(".fb-page iframe").attr("src")) {
            $(".fb-page").removeClass(
              "fb_iframe_widget fb_iframe_widget_fluid",
            );
            FB.XFBML.parse();
          }
        width = new_width;
      }
    }
  });
  function debounce(func, wait, immediate) {
    var timeout;
    return function executedFunction() {
      var context = this;
      var args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
})(jQuery);
