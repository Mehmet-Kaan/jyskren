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
