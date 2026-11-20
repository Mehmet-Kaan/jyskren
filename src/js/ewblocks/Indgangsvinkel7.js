(function ($) {
  "use strict";
  function ewParallax() {
    var simpleParallaxDefaultSettings = { scale: 1.5 };
    $(".Indgangsvinkel7 .js-parallax").each(function (index, img) {
      var _orientation =
          typeof $(img).data("orientation") !== "undefined"
            ? $(img).data("orientation")
            : "down",
        _scale =
          typeof $(img).data("scale") !== "undefined"
            ? $(img).data("scale")
            : 1.5;
      var checkLoaded = setInterval(function () {
        if ($(img).hasClass("b-loaded")) {
          clearInterval(checkLoaded);
          $(img)
            .parents(".media")
            .wrap(
              '<div class="js-parallaxWrap" style="width: 100%; height: 100%; min-height: 0;"></div>',
            );
          var _options = {
            customWrapper: ".js-parallaxWrap",
            orientation: _orientation,
            scale: _scale,
          };
          new simpleParallax(
            img,
            $.extend({}, simpleParallaxDefaultSettings, _options),
          );
        }
      });
    });
  }
  $(document).ready(function () {
    ewParallax();
  });
})(jQuery);
