(function ($) {
  "use strict";
  lightbox.option({
    albumLabel: $(".js-gallery").data("lightboxLabel"),
    wrapAround: true,
  });
  $(document).ready(function () {
    var container = $(".Gallery2");
    var paginationMode = $(".pager__items", container).data("paginationMode");
    if (paginationMode == "js") {
      $(".brick", container).removeClass("brick-on-page");
      var perPage = $(".pager__items", container).data("perPage");
      $(".brick", container).slice(0, perPage).addClass("brick-on-page");
    }
    $(".js-gallery .gallery__wall--horizontal").each(function (i, theWall) {
      var $theWall = $(theWall),
        m = $theWall.data("margins"),
        rh = $theWall.data("targetHeight"),
        mr = $theWall.data("maxRows");
      $theWall.justifiedGallery({
        selector: ".brick",
        imgSelector: "> .brick__link > .media > picture > img",
        rowHeight:
          rh !== undefined && rh !== false && rh !== "" ? parseFloat(rh) : 200,
        lastRow: "nojustify",
        margins: m !== undefined && m !== false && m !== "" ? parseFloat(m) : 0,
        border: 0,
        waitThumbnailsLoad: false,
        cssAnimation: true,
        imagesAnimationDuration: 400,
        maxRowsCount:
          mr !== undefined && mr !== false && mr !== "" ? parseFloat(mr) : 0,
        captions: true,
        filter: ".brick-on-page",
      });
      $theWall.imagesLoaded().done(function (instance) {
        $("div.media", container).removeClass("media--loading");
        $(".brick", container).addClass("brick--visible");
      });
    });
    $(".js-gallery .gallery__wall--vertical").each(function (i, theWall) {
      var $theWall = $(theWall).isotope({
        itemSelector: ".brick",
        percentPosition: true,
        filter: ".brick-on-page",
        masonry: {},
      });
      $theWall
        .imagesLoaded()
        .progress(function () {
          $theWall.isotope("layout");
        })
        .done(function (instance) {
          $(instance.elements)
            .find(".brick")
            .each(function (i, e) {
              $(e).addClass("brick--visible");
            });
        });
      let callback = (entries, observer) => {
        $(".js-gallery .gallery__wall--vertical").isotope("layout");
      };
      let observer = new IntersectionObserver(callback, {
        root: null,
        rootMargin: "100px",
        threshold: 0.5,
      });
      observer.observe(document.querySelector(".gallery__wall--vertical"));
      var checkLoaded = setInterval(function () {
        if ($("img", theWall).length == $("img.b-loaded", theWall).length) {
          clearInterval(checkLoaded);
          $(".js-gallery .gallery__wall--vertical").isotope("layout");
          setTimeout(function () {
            $(".js-gallery .gallery__wall--vertical").isotope("layout");
          }, 500);
        }
      }, 100);
    });
    $(".js-gallery .gallery__wall--grid").each(function (i, theWall) {
      var $theWall = $(theWall).isotope({
        itemSelector: ".brick",
        percentPosition: true,
        filter: ".brick-on-page",
      });
      $theWall
        .imagesLoaded()
        .progress(function () {
          $theWall.isotope("layout");
          const params = new URLSearchParams(window.location.search);
          if (params.has("category") && params.get("category") != "*") {
            $theWall.isotope({ filter: ".filter--" + params.get("category") });
            $(".js-filters .btn--active").removeClass("btn--active");
            $(
              '.js-filters button[data-filter=".filter--' +
                params.get("category") +
                '"]',
            ).addClass("btn--active");
            $(".js-filters select").val(".filter--" + params.get("category"));
          }
        })
        .done(function (instance) {
          $(instance.elements)
            .find(".brick")
            .each(function (i, e) {
              $(e).addClass("brick--visible");
            });
        });
    });
    $(".pager__item", container)
      .find("button")
      .click(function () {
        var page = $(this).attr("data-page");
        var paginationMode = $(this)
          .closest(".pager__items")
          .data("paginationMode");
        if (paginationMode == "js") {
          $(".brick", container).removeClass("brick-on-page");
          var perPage = $(this).closest(".pager__items").data("perPage");
          $(".brick", container)
            .slice(perPage * page - perPage, perPage * page)
            .addClass("brick-on-page");
          var theWall = $(this).closest(".js-gallery").find(".gallery__wall");
          if (theWall.hasClass("gallery__wall--horizontal"))
            $(theWall).justifiedGallery({ filter: ".brick-on-page" });
          else {
            if (
              theWall.hasClass("gallery__wall--vertical") ||
              theWall.hasClass("gallery__wall--grid")
            )
              theWall.isotope({ filter: ".brick-on-page" });
          }
          $(".pager__item", container).removeClass("is-active");
          $(this).closest(".pager__item").addClass("is-active");
        } else window.location.href = updateQueryString("page", page);
      });
  });
  var beyondTheBrick = {
    whichTransitionEventEnd: function () {
      var el = document.createElement("fakeelement");
      var transitions = {
        WebkitTransition: "webkitTransitionEnd",
        MozTransition: "transitionend",
        transition: "transitionend",
      };
      for (var t in transitions)
        if (transitions.hasOwnProperty(t) && el.style[t] !== undefined)
          return transitions[t];
    },
    lightboxSettings: {
      show: function (brick) {
        var $a = $(brick).find("a.brick__link"),
          org = $a.attr("data-lightbox-org");
        $a.removeAttr("data-lightbox-org").attr("data-lightbox", org);
      },
      hide: function (brick) {
        var $a = $(brick).find("a.brick__link"),
          org = $a.attr("data-lightbox");
        $a.removeAttr("data-lightbox").attr("data-lightbox-org", org);
      },
      state: function (e, filterValue) {
        var bricks = $(e.currentTarget).children(".brick");
        $(bricks).each(function (index, brick) {
          var filterClass = filterValue.replace(".", "");
          if (!$(brick).hasClass(filterClass) && filterClass != "*")
            beyondTheBrick.lightboxSettings.hide(brick);
          else beyondTheBrick.lightboxSettings.show(brick);
        });
      },
    },
    filtering: function (obj, filterValue) {
      var theWall = $(obj).closest(".js-gallery").find(".gallery__wall");
      if (theWall.hasClass("gallery__wall--horizontal"))
        $(theWall)
          .justifiedGallery({
            filter: filterValue != "*" ? filterValue : false,
          })
          .on("jg.complete", function (event) {
            beyondTheBrick.lightboxSettings.state(event, filterValue);
          });
      else {
        if (
          theWall.hasClass("gallery__wall--vertical") ||
          theWall.hasClass("gallery__wall--grid")
        )
          $(theWall)
            .isotope({ filter: filterValue != "*" ? filterValue : false })
            .on("arrangeComplete", function (event, filteredItems) {
              var iso = $(theWall).data("isotope");
              $(iso.getItemElements()).each(function (i, e) {
                if ($.inArray(e, iso.getFilteredItemElements()))
                  $(e).addClass("brick--filtered");
                else $(e).removeClass("brick--filtered");
              });
              beyondTheBrick.lightboxSettings.state(event, filterValue);
            });
      }
    },
  };
  $(".js-gallery .js-filters").each(function (i, element) {
    var $element = $(element);
    if ($element.hasClass("form-group"))
      $element.on("change", "select", function (event) {
        var filterValue = event.target.value;
        beyondTheBrick.filtering(this, filterValue);
      });
    else
      $element.on("click", "button", function () {
        var filterValue = $(this).attr("data-filter");
        beyondTheBrick.filtering(this, filterValue);
        $element.find(".btn--active").removeClass("btn--active");
        $(this).addClass("btn--active");
      });
  });
  function updateQueryString(key, value, url) {
    if (!url) url = window.location.href;
    var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
      hash;
    if (re.test(url))
      if (typeof value !== "undefined" && value !== null)
        return url.replace(re, "$1" + key + "=" + value + "$2$3");
      else {
        hash = url.split("#");
        url = hash[0].replace(re, "$1$3").replace(/(&|\?)$/, "");
        if (typeof hash[1] !== "undefined" && hash[1] !== null)
          url += "#" + hash[1];
        return url;
      }
    else if (typeof value !== "undefined" && value !== null) {
      var separator = url.indexOf("?") !== -1 ? "&" : "?";
      hash = url.split("#");
      url = hash[0] + separator + key + "=" + value;
      if (typeof hash[1] !== "undefined" && hash[1] !== null)
        url += "#" + hash[1];
      return url;
    } else return url;
  }
})(jQuery);
