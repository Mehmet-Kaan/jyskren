(function ($) {
  "use strict";
  $(document).ready(function () {
    var $gallery = $(".js-gallery");
    if ($gallery.length) {
      var defaultSettings = {
        customWrapper: ".gallery__visual-inner",
        orientation: "down",
        scale: 1.5,
      };
      $(".gallery--parallax").each(function (index, element) {
        var _orientation =
          typeof $(element).data("orientation") !== "undefined"
            ? $(element).data("orientation")
            : "down";
        var _scale =
          typeof $(element).data("scale") !== "undefined"
            ? $(element).data("scale")
            : 1.5;
        var _options = { orientation: _orientation, scale: _scale };
        var checkLoaded = setInterval(function () {
          if ($("img", element).hasClass("b-loaded")) {
            clearInterval(checkLoaded);
            $(element)
              .find(".gallery__visual img")
              .each(function (i, $image) {
                new simpleParallax(
                  $image,
                  $.extend({}, defaultSettings, _options),
                );
              });
          }
        });
      });
      $(".js-gallery").each(function (index, gallery) {
        var $slider = $(".gallery__slides", gallery);
        if ($slider.length) {
          var autoplay =
            typeof $slider.data("autoplay") !== "undefined"
              ? !!$slider.data("autoplay")
              : true;
          var interval =
            typeof $slider.data("interval") !== "undefined"
              ? $slider.data("interval")
              : 3000;
          var dots =
            typeof $slider.data("dots") !== "undefined"
              ? !!$slider.data("dots")
              : true;
          var arrows =
            typeof $slider.data("arrows") !== "undefined"
              ? !!$slider.data("arrows")
              : true;
          var sm =
            typeof $slider.data("sm") !== "undefined" ? $slider.data("sm") : 1;
          var md =
            typeof $slider.data("md") !== "undefined" ? $slider.data("md") : 2;
          var lg =
            typeof $slider.data("lg") !== "undefined" ? $slider.data("lg") : 3;
          var xl =
            typeof $slider.data("xl") !== "undefined" ? $slider.data("xl") : 4;
          $slider.slick({
            infinite: true,
            speed: 300,
            slidesToShow: xl,
            autoplay,
            autoplaySpeed: interval,
            swipe: false,
            dots,
            arrows,
            prevArrow: $(gallery).find(".gallery__arrow--prev"),
            nextArrow: $(gallery).find(".gallery__arrow--next"),
            appendDots: $(gallery).find(".gallery__footer-dots"),
            responsive: [
              { breakpoint: 1200, settings: { slidesToShow: lg } },
              { breakpoint: 992, settings: { slidesToShow: md, dots: false } },
              {
                breakpoint: 768,
                settings: { slidesToShow: sm, swipe: true, dots: false },
              },
            ],
          });
        }
      });
    }
  });
})(jQuery);
