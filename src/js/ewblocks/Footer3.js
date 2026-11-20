(function ($) {
  "use strict";
  var $footerFixedCopyright = $(".js-footer--fixed-copyright");
  if ($footerFixedCopyright.length) {
    var $copyright = $(".copyright").first(),
      $body = $("body");
    $(window)
      .on("resize", function () {
        var copyrightHeight = $copyright.outerHeight(true);
        if ($(window).height() > copyrightHeight) {
          $body.css({ "margin-bottom": copyrightHeight });
          $copyright.css({ "z-index": "-1", position: "fixed" });
        } else {
          $body.css({ "margin-bottom": "0" });
          $copyright.css({ "z-index": "0", position: "relative" });
        }
      })
      .trigger("resize");
  }
  function mapOversize() {
    $(".footer .map").each(function (index, element) {
      var $map = $(element),
        $footer = $map.closest(".footer"),
        $top = $footer.find(".top"),
        $lastBox = $footer.find(".primary__box").last(),
        $secondary = $footer.find(".secondary");
      var iframe = $("iframe", $map);
      if (iframe.parent("p").length) iframe.unwrap();
      $map
        .get(0)
        .style.setProperty(
          "--map-footer-full-height",
          ($footer.length ? $footer.outerHeight(true) : 0) + "px",
        );
      $map
        .get(0)
        .style.setProperty(
          "--map-footer-top-height",
          ($top.length ? $top.outerHeight(true) : 0) + "px",
        );
      $map
        .get(0)
        .style.setProperty(
          "--map-footer-last-box-height",
          ($lastBox.length ? $lastBox.outerHeight(true) : 0) + "px",
        );
      $map
        .get(0)
        .style.setProperty(
          "--map-footer-secondary-height",
          ($secondary.length ? $secondary.outerHeight(true) : 0) + "px",
        );
    });
  }
  function popOverflow() {
    $(".footer.footer--overflow-pop .primary__box--pop").each(
      function (index, element) {
        var $popOverflow = $(element),
          $footer = $popOverflow.closest(".footer"),
          $secondary = $footer.find(".secondary");
        $popOverflow
          .get(0)
          .style.setProperty(
            "--footer-secondary-height",
            ($secondary.length ? $secondary.outerHeight(true) : 0) + "px",
          );
      },
    );
  }
  function fitGallery() {
    $(".Footer3 .gallery").each(function (index, object) {
      let gallery = $(object);
      let rows = gallery.data("rows");
      let columns = gallery.css("grid-template-columns").split(" ").length;
      let amountToShow = rows * columns;
      $(".gallery__item", gallery).each(function (itemIndex, itemObject) {
        if (itemIndex < amountToShow) $(itemObject).show();
        else $(itemObject).hide();
      });
    });
  }
  $(window)
    .on("resize", function () {
      mapOversize();
      popOverflow();
      fitGallery();
    })
    .trigger("resize");
  $(window).on("load", function () {
    mapOversize();
    popOverflow();
    fitGallery();
  });
})(jQuery);
