(function ($, Drupal) {
  "use strict";
  var $menu = $(".Menu2rev2 .js-menu"),
    windowWidth = window.innerWidth,
    WindowHeight = window.innerHeight,
    root = document.documentElement,
    menumediasize = parseInt(
      getComputedStyle(root)
        .getPropertyValue("--menu-media-min-width")
        .replace("px", ""),
    ),
    storeHeightsClass = ".header";
  if ($menu.length) {
    var menuOnHoverTimeout = $menu.data("hovertimeout") || 0,
      menuTimer;
    if ($(".js-sidebar").hasClass("primary__navbar-main--behind"))
      $("body").addClass("sidebar-behind");
    $(window)
      .on("resize", function () {
        windowWidth = window.innerWidth;
        WindowHeight = window.innerHeight;
        storeHeights(storeHeightsClass);
      })
      .trigger("resize");
    $(
      ".menu__dropdown .menu__item > a.menu__link > .toggle, .menu__dropdown .menu__item > span.menu__link",
    ).on("click", function (event) {
      event.preventDefault();
      var $element = $(this);
      if (windowWidth < menumediasize) toggleMenuDropdown($element);
    });
    Drupal.behaviors.setActiveClassesMenu2rev2 = {
      attach: function (context) {
        if (context === document) {
          var nav = $(".Menu2rev2", context);
          var aTag = $('a[href="' + context.location.pathname + '"]', nav);
          aTag.addClass("menu__link--current");
          if (aTag.closest(".menu__item").hasClass("menu__item--1"))
            aTag.closest(".menu__item").addClass("menu__item--1--active");
          aTag.parents(".menu__dropdown").addClass("menu__dropdown--active");
          aTag.parents(".menu__item").addClass("menu__item--active");
        }
      },
    };
    function toggleMenuDropdown($element) {
      var $menuItem = $element.closest(".menu__item");
      var menuItemIsActive =
        $menuItem.hasClass("menu__item--active") ||
        $menuItem.hasClass("menu__item--selected")
          ? true
          : false;
      if (menuItemIsActive && !$menuItem.hasClass("menu__item--1--active"))
        closeMenuDropdown($menuItem);
      else openMenuDropdown($menuItem);
    }
    function openMenuDropdown($menuItem) {
      var $menuDropdown = $menuItem.find("> .menu__dropdown");
      var dropdownMenuHeight = $menuDropdown.outerHeight(true);
      var callbackFunction = function () {
        $menuDropdown.attr("style", "");
      };
      closeAllMenuDropdowns($menuItem);
      $menuItem
        .removeClass("menu__item--1--active")
        .addClass("menu__item--active");
      $menuDropdown
        .addClass("menu__dropdown--active")
        .css({ opacity: 0.1, height: 0, top: -20 });
      $menuDropdown.animate(
        {
          opacity: 1,
          height: dropdownMenuHeight,
          top: 0,
          easing: "easeOutSine",
        },
        350,
        callbackFunction,
      );
    }
    function closeMenuDropdown($menuItem) {
      var $menuDropdown = $menuItem.find("> .menu__dropdown");
      var callbackFunction = function () {
        $menuDropdown
          .removeClass("menu__dropdown--active")
          .attr("style", "")
          .find(".menu__dropdown--active")
          .removeClass("menu__dropdown--active")
          .attr("style", "");
        $menuItem
          .removeClass("menu__item--1--active")
          .removeClass("menu__item--active")
          .find(".menu__item--active")
          .removeClass("menu__item--active");
      };
      $menuDropdown.animate(
        { height: 0, opacity: 0.1, easing: "easeOutSine" },
        350,
        callbackFunction,
      );
    }
    function closeAllMenuDropdowns($menuItem) {
      $menuItem.siblings(".menu__item--active").each(function () {
        var $element = $(this);
        closeMenuDropdown($element);
      });
    }
    function toggleSidebar($element) {
      var $body = $("body");
      var attribute = $element.attr("data-sidebar-toggle");
      if (attribute != "left" && attribute != "right") return false;
      if (attribute == "left" && $body.hasClass("sidebar-right-open"))
        $body.removeClass("sidebar-right-open");
      if (attribute == "right" && $body.hasClass("sidebar-left-open"))
        $body.removeClass("sidebar-left-open");
      $body.toggleClass("sidebar-" + attribute + "-open");
      $body.toggleClass("sidebar-open");
      $(".primary__navbar-action-toggle, .menu__head-toggle").toggleClass(
        "is-active",
      );
    }
    $(".Menu2rev2 [data-sidebar-toggle]").on("click", function (event) {
      event.preventDefault();
      var $element = $(this);
      if (windowWidth < menumediasize) toggleSidebar($element);
    });
    window.addEventListener(
      "pageshow",
      function (evt) {
        if ($("body").hasClass("sidebar-open")) {
          var $element = $(".Menu2rev2 .primary__navbar-action-toggle");
          toggleSidebar($element);
        }
      },
      false,
    );
    $(".Menu2rev2 .primary__navbar-main").click(function (e) {
      if (this == e.target)
        if (e.offsetX > e.target.offsetLeft) {
        } else {
          e.preventDefault();
          var $element = $("[data-sidebar-toggle]");
          if (windowWidth < menumediasize) toggleSidebar($element);
        }
    });
    function storeHeights(elementClass) {
      storeHeightsClass = elementClass;
      var menuHeight = $menu.closest(storeHeightsClass).outerHeight();
      root.style.setProperty("--menu-height", menuHeight + "px");
      root.style.setProperty("--window-height", WindowHeight + "px");
      root.style.setProperty(
        "--window-height-ex-menu-height",
        WindowHeight - menuHeight + "px",
      );
    }
    var slowHover = {
      leave: function (_this) {
        var $this = $(_this);
        $this.find(".menu__item--hover").removeClass("menu__item--hover");
      },
      timer: {
        start: function (_this) {
          menuTimer = setTimeout(function () {
            slowHover.leave(_this);
          }, menuOnHoverTimeout);
        },
        clear: function () {
          clearTimeout(menuTimer);
        },
      },
      enter: function (_this, event) {
        var $this = $(_this);
        if (event.type == "mouseenter") {
          slowHover.timer.clear();
          if ($(event.target).is(".menu__item--1 > .menu__link")) {
            $this = $(event.target);
            $this.closest(".menu__item--1").addClass("menu__item--hover");
            slowHover.timer.clear();
          }
        }
        if (event.type == "mouseleave") slowHover.timer.start(_this);
        $(_this)
          .find(".menu__item")
          .mouseenter(function (e) {
            $(this)
              .closest(".menu__list--1")
              .find(".menu__item--1")
              .removeClass("menu__item--hover");
            $(this).closest(".menu__item--1").addClass("menu__item--hover");
          });
      },
    };
    if (menuOnHoverTimeout > 0)
      $(".menu__dropdown--1").hover(function (event) {
        if (windowWidth > menumediasize) slowHover.enter(this, event);
      });
    $(document).ready(function () {
      var $sticky = $(".js-sticky");
      if ($sticky.length) {
        var stickyTop = $sticky.offset().top,
          stickyHeight = $sticky.outerHeight(),
          stickyIsHeader = $sticky.hasClass("header"),
          stickyIsPrimary = $sticky.hasClass("primary");
        if (!$(".js-sticky-wrap").length)
          if (stickyIsHeader) {
            $sticky.wrap(
              '<div class="js-sticky-wrap js-sticky-wrap--header" style="height:' +
                stickyHeight +
                'px; position:relative; z-index: initial;"></div>',
            );
            $(window).scroll(function () {
              var windowTop = $(this).scrollTop();
              if (
                $("body").hasClass("logged-in") &&
                $("body").hasClass("toolbar-fixed")
              ) {
                var toBeOrNotToBeLoggedInTop =
                  $("body").hasClass("toolbar-horizontal") &&
                  $("body").hasClass("toolbar-tray-open")
                    ? 79
                    : 39;
                if (windowTop > 0) {
                  $sticky
                    .css({ position: "fixed", top: toBeOrNotToBeLoggedInTop })
                    .addClass("js-sticky--stuck");
                  storeHeights(".js-sticky--stuck");
                } else {
                  $sticky
                    .css({ position: "", top: "" })
                    .removeClass("js-sticky--stuck");
                  storeHeights(".js-sticky-wrap");
                }
              } else if (windowTop > stickyTop) {
                $sticky
                  .css({ position: "fixed", top: 0 })
                  .addClass("js-sticky--stuck");
                storeHeights(".js-sticky--stuck");
              } else {
                $sticky
                  .css({ position: "", top: "" })
                  .removeClass("js-sticky--stuck");
                storeHeights(".js-sticky-wrap");
              }
            });
          } else {
            $sticky.wrap(
              '<div class="js-sticky-wrap js-sticky-wrap--primary" style="height:' +
                stickyHeight +
                'px; position:relative; z-index: initial;"><div class="js-sticky-wrap-inner" style="z-index: initial; width: 100%;"></div></div>',
            );
            $(window).scroll(function () {
              var windowTop = $(this).scrollTop();
              if (
                $("body").hasClass("logged-in") &&
                $("body").hasClass("toolbar-fixed")
              ) {
                var toBeOrNotToBeLoggedInTop =
                  $("body").hasClass("toolbar-horizontal") &&
                  $("body").hasClass("toolbar-tray-open")
                    ? 79
                    : 39;
                if (windowTop > stickyTop - toBeOrNotToBeLoggedInTop) {
                  $sticky
                    .closest(".js-sticky-wrap-inner")
                    .css({ position: "fixed", top: toBeOrNotToBeLoggedInTop })
                    .addClass("js-sticky-wrap-inner--stuck");
                  $sticky.addClass("js-sticky--stuck");
                  storeHeights(".js-sticky--stuck");
                } else {
                  $sticky
                    .closest(".js-sticky-wrap-inner")
                    .css({ position: "", top: "" })
                    .removeClass("js-sticky-wrap-inner--stuck");
                  $sticky.removeClass("js-sticky--stuck");
                  storeHeights(".header");
                }
              } else if (windowTop > stickyTop) {
                $sticky
                  .closest(".js-sticky-wrap-inner")
                  .css({ position: "fixed", top: 0 })
                  .addClass("js-sticky-wrap-inner--stuck");
                $sticky.addClass("js-sticky--stuck");
                storeHeights(".js-sticky--stuck");
              } else {
                $sticky
                  .closest(".js-sticky-wrap-inner")
                  .css({ position: "", top: "" })
                  .removeClass("js-sticky-wrap-inner--stuck");
                $sticky.removeClass("js-sticky--stuck");
                storeHeights(".header");
              }
            });
          }
      }
      var $pullMinions = $(".js-pull-minions"),
        pullMinionsHeight = $pullMinions.outerHeight();
      if ($pullMinions.length)
        if ($pullMinions.hasClass("js-sticky"))
          $pullMinions
            .closest(".js-sticky-wrap")
            .css({ "margin-bottom": "-" + pullMinionsHeight + "px" });
        else
          $pullMinions.css({ "margin-bottom": "-" + pullMinionsHeight + "px" });
    });
  }
})(jQuery, Drupal);
