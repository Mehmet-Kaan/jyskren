(function ($) {
  "use strict";
  $(document).ready(function () {
    $(document).scroll(function () {
      checkOffset();
    });
  });
  function checkOffset() {
    var wrapper = $("#ew-cta-2");
    if (wrapper.offset().top + wrapper.height() >= $(document).height()) {
      wrapper.css("position", "absolute");
      wrapper.css("bottom", "unset");
      wrapper.css("left", "unset");
    }
    if (
      $(document).scrollTop() + window.innerHeight <
      wrapper.offset().top - 1
    ) {
      wrapper.css("position", "");
      wrapper.css("bottom", "");
      wrapper.css("left", "");
    }
  }
})(jQuery);
