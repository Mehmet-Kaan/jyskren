(function ($) {
  "use strict";
  var defaultSettings = {
    customWrapper: ".js-parallaxWrap",
    orientation: "down",
    scale: 1.5,
  };
  function ewParallax() {
    $(".FacebookAndWebform2.js--parallax").each(function (index, element) {
      var _orientation =
          typeof $(element).data("orientation") !== "undefined"
            ? $(element).data("orientation")
            : "down",
        _scale =
          typeof $(element).data("scale") !== "undefined"
            ? $(element).data("scale")
            : 1.5;
      $(".iSocial__visual-inner .media", element).wrap(
        '<div class="js-parallaxWrap" style="width: 100%; height: 100%; min-height: 0;"></div>',
      );
      var _options = {
        customWrapper: ".js-parallaxWrap",
        orientation: _orientation,
        scale: _scale,
      };
      var checkLoaded = setInterval(function () {
        if ($(".iSocial__visual-inner img", element).hasClass("b-loaded")) {
          clearInterval(checkLoaded);
          $(element)
            .find(".iSocial__visual-inner img")
            .each(function (i, $image) {
              new simpleParallax(
                $image,
                $.extend({}, defaultSettings, _options),
              );
            });
        }
      });
    });
  }
  var resizePrevWidth = [];
  var ewFBiSocial = {
    setupFrame: function (iframe) {
      var container = $(iframe).parent();
      var containerWidth = $(container).width();
      var containerHeight = $(container).outerHeight();
      $(".fb-page")
        .attr("data-width", Math.round(containerWidth))
        .attr("data-height", Math.round(containerHeight));
      if ($(".fb-page iframe").attr("src")) {
        $(".fb-page").removeClass("fb_iframe_widget fb_iframe_widget_fluid");
        FB.XFBML.parse();
      }
    },
    resizeHandler: function (index, prevW, iframe) {
      var curW = $(iframe).parent().outerWidth();
      if (prevW !== curW) {
        ewFBiSocial.setupFrame(iframe);
        resizePrevWidth[index] = curW;
      }
    },
    resizeDebounce: function (func, wait, immediate) {
      var timeout;
      return function () {
        var context = this,
          args = arguments;
        var later = function () {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    },
    clock: function (element) {
      function addZero(i) {
        if (i < 10) i = "0" + i;
        return i;
      }
      function showTime() {
        var d = new Date(),
          h = addZero(d.getHours()),
          m = addZero(d.getMinutes()),
          t = h + "." + m;
        if ($(element).find(".js-iSocialPhoneClock").html() !== t)
          $(element).find(".js-iSocialPhoneClock").html(t);
        setTimeout(showTime, 1000);
      }
      showTime();
    },
  };
  $(document).ready(function () {
    setTimeout(function () {
      ewParallax();
      $(".js-iSocial").each(function (index, element) {
        var iframe = $(element).find(".fb-page");
        ewFBiSocial.clock(element);
        ewFBiSocial.setupFrame(iframe);
        resizePrevWidth[index] = $(iframe).parent().outerWidth();
        $(window).on(
          "resize",
          ewFBiSocial.resizeDebounce(function () {
            ewFBiSocial.resizeHandler(index, resizePrevWidth[index], iframe);
          }, 200),
        );
      });
    }, 1000);
  });
})(jQuery);
