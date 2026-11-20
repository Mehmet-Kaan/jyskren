(function ($) {
  "use strict";
  $(document).ready(function () {
    var form = $(".failed-recaptcha-v3");
    if (form.length > 0) {
      const yOffset = -150;
      const y =
        form.get(0).getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y });
    }
    AOS.init({ once: true, disable: "mobile" });
  });
})(jQuery);
(function (Drupal, $) {
  Drupal.behaviors.captcha = {
    attach: function () {
      var webformCaptcha = $(".webform-submission-form .captcha");
      if (webformCaptcha.length > 0)
        webformCaptcha.each(function (i) {
          var webformButton = $(webformCaptcha[i])
            .prevAll("#edit-actions")
            .first();
          if (webformButton) {
            webformButton.remove();
            webformButton.insertAfter(webformCaptcha[i]);
          }
        });
    },
  };
})(Drupal, jQuery);
