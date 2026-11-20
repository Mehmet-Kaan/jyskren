(function ($) {
  "use strict";
  function ewParallax() {
    var simpleParallaxDefaultSettings = { scale: 1.5 };
    $(".Indgangsvinkel8rev2 .js-parallax").each(function (index, img) {
      var _orientation =
          typeof $(img).data("orientation") !== "undefined"
            ? $(img).data("orientation")
            : "down",
        _scale =
          typeof $(img).data("scale") !== "undefined"
            ? $(img).data("scale")
            : 1.5;
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
    });
  }
  $(document).ready(function () {
    ewParallax();
  });
})(jQuery);
(function ($) {
  "use strict";
  var width = -1;
  $(document).ready(function () {
    if ($(".Indgangsvinkel8rev2 .fb-page").length > 0) {
      resizeIframeToParent(false);
      var returnedFunction = debounce(function () {
        resizeIframeToParent(true);
      }, 250);
      window.addEventListener("resize", returnedFunction);
      function resizeIframeToParent(reload) {
        var new_width = Math.round(
          $(".Indgangsvinkel8rev2 .fb-page").parent().width(),
        );
        var new_height = Math.round(
          $(".Indgangsvinkel8rev2 .fb-page").parent().height(),
        );
        $(".Indgangsvinkel8rev2 .fb-page").css("width", new_width);
        $(".Indgangsvinkel8rev2 .fb-page").css("height", new_height);
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
