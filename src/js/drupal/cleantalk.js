/* @license GPL-2.0-or-later https://www.drupal.org/licensing/faq */
function ct_protect_external() {
  for (var i = 0; i < document.forms.length; i++)
    if (
      document.forms[i].cleantalk_hidden_action === undefined &&
      document.forms[i].cleantalk_hidden_method === undefined
    )
      if (typeof document.forms[i].action == "string") {
        var action = document.forms[i].action;
        if (
          action.indexOf("activehosted.com") !== -1 ||
          action.indexOf("app.convertkit.com") !== -1 ||
          action.indexOf("go.pardot.com") !== -1 ||
          (document.forms[i].firstChild.classList !== undefined &&
            document.forms[i].firstChild.classList.contains("cb-form-group"))
        ) {
          jQuery(document.forms[i]).before(
            '<i class="cleantalk_placeholder" style="display: none;"></i>',
          );
          var prev = jQuery(document.forms[i]).prev(),
            form_html = document.forms[i].outerHTML,
            form_original = jQuery(document.forms[i]).detach(),
            index = i;
          prev.after(form_html);
          var force_action = document.createElement("input");
          force_action.name = "action";
          force_action.value = "cleantalk_force_ajax_check";
          force_action.type = "hidden";
          document.forms[i].appendChild(force_action);
          document.forms[i].onsubmit = function (event) {
            event.preventDefault();
            var visible_fields = {};
            visible_fields[0] = apbct_collect_visible_fields(this);
            apbct_visible_fields_set_cookie(visible_fields);
            var data = {};
            var elems = event.target.elements;
            elems = Array.prototype.slice.call(elems);
            elems.forEach(function (elem, y) {
              if (elem.name === "") data["input_" + y] = elem.value;
              else data[elem.name] = elem.value;
            });
            jQuery.ajax({
              type: "POST",
              url: "/admin/config/cleantalk/check_spam_external_forms",
              data,
              success: function (result) {
                if (+result.allow !== 0) {
                  var form_new = jQuery(event.target).detach();
                  apbct_replace_inputs_values_from_other_form(
                    form_new,
                    form_original,
                  );
                  prev.after(form_original);
                  var subm_button = jQuery(form_original).find(
                    "button[type=submit]",
                  );
                  if (subm_button.length !== 0) subm_button[0].click();
                  subm_button = jQuery(form_original).find(
                    'button[data-element="submit"]',
                  );
                  if (subm_button.length !== 0) subm_button[0].click();
                } else alert(result.ct_result_comment);
              },
              error: function (jqXHR, textStatus, errorThrown) {
                if (errorThrown) {
                  console.log("APBCT_AJAX_ERROR");
                  console.log(jqXHR);
                  console.log(textStatus);
                  console.log(
                    "Anti-spam by Cleantalk plugin error: " +
                      errorThrown +
                      "Please, contact Cleantalk tech support https://wordpress.org/support/plugin/cleantalk-spam-protect/",
                  );
                }
              },
              timeout: 15000,
            });
          };
        } else {
          if (
            action.indexOf("http://") !== -1 ||
            action.indexOf("https://") !== -1
          ) {
            var tmp = action.split("//");
            tmp = tmp[1].split("/");
            var host = tmp[0].toLowerCase();
            if (host !== location.hostname.toLowerCase()) {
              var ct_action = document.createElement("input");
              ct_action.name = "cleantalk_hidden_action";
              ct_action.value = action;
              ct_action.type = "hidden";
              document.forms[i].appendChild(ct_action);
              var ct_method = document.createElement("input");
              ct_method.name = "cleantalk_hidden_method";
              ct_method.value = document.forms[i].method;
              ct_method.type = "hidden";
              document.forms[i].method = "POST";
              document.forms[i].appendChild(ct_method);
              document.forms[i].action = document.location;
            }
          }
        }
      }
}
function apbct_replace_inputs_values_from_other_form(form_source, form_target) {
  var inputs_source = jQuery(form_source).find(
      "button, input, textarea, select",
    ),
    inputs_target = jQuery(form_target).find("button, input, textarea, select");
  inputs_source.each(function (index, elem_source) {
    var source = jQuery(elem_source);
    inputs_target.each(function (index2, elem_target) {
      var target = jQuery(elem_target);
      if (elem_source.outerHTML === elem_target.outerHTML)
        target.val(source.val());
    });
  });
}
window.onload = function () {
  if (typeof ct_capture_buffer !== "undefined" && ct_capture_buffer) return;
  setTimeout(function () {
    ct_protect_external();
  }, 1500);
};
function ctSetCookie(cookies) {
  let useCookies, useAltCookies;
  if ("undefined" !== typeof ct_use_cookies) useCookies = ct_use_cookies;
  else useCookies = false;
  if ("undefined" !== typeof ct_use_alt_cookies)
    useAltCookies = ct_use_alt_cookies;
  else useAltCookies = false;
  if (useCookies)
    if (useAltCookies && useAltCookies === 1) {
      let xhr = new XMLHttpRequest();
      let json = JSON.stringify(cookies);
      xhr.open("POST", "/admin/config/cleantalk/set_alt_cookies");
      xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
      xhr.send(json);
    } else
      cookies.forEach(function (e) {
        let ctSecure = location.protocol === "https:" ? "; secure" : "";
        document.cookie =
          e.name +
          "=" +
          encodeURIComponent(e.value) +
          "; path=/; expires=0; samesite=lax" +
          ctSecure;
      });
}
var d = new Date(),
  ctTimeMs = new Date().getTime(),
  ctMouseEventTimerFlag = true,
  ctMouseData = "[",
  ctMouseDataCounter = 0,
  ctScrollCollected = false,
  ctEventTokenInterval = null;
ctSetCookie([
  { name: "ct_check_js", value: ct_check_js_val },
  { name: "ct_ps_timestamp", value: Math.floor(new Date().getTime() / 1000) },
  { name: "ct_fkp_timestamp", value: "0" },
  { name: "ct_pointer_data", value: "0" },
  { name: "ct_timezone", value: (d.getTimezoneOffset() / 60) * -1 },
  { name: "apbct_antibot", value: drupal_ac_antibot_cookie_value },
  { name: "ct_has_scrolled", value: false },
]);
var ctMouseReadInterval = setInterval(function () {
  ctMouseEventTimerFlag = true;
}, 150);
var ctMouseWriteDataInterval = setInterval(function () {
  const altSessionsUsed =
    typeof ct_use_alt_cookies !== "undefined" && ct_use_alt_cookies === 1;
  const botDetectorUsed =
    typeof ct_use_bot_detector !== "undefined" && ct_use_bot_detector === 1;
  if (altSessionsUsed || botDetectorUsed) return;
  var ctMouseDataToSend = ctMouseData.slice(0, -1).concat("]");
  ctSetCookie([{ name: "ct_pointer_data", value: ctMouseDataToSend }]);
}, 1200);
function ctMouseStopData() {
  if (typeof window.addEventListener == "function")
    window.removeEventListener("mousemove", ctFunctionMouseMove);
  else window.detachEvent("onmousemove", ctFunctionMouseMove);
  clearInterval(ctMouseReadInterval);
  clearInterval(ctMouseWriteDataInterval);
}
var ctFunctionMouseMove = function output(event) {
  if (ctMouseEventTimerFlag == true) {
    var mouseDate = new Date();
    ctMouseData +=
      "[" +
      Math.round(event.pageY) +
      "," +
      Math.round(event.pageX) +
      "," +
      Math.round(mouseDate.getTime() - ctTimeMs) +
      "],";
    ctMouseDataCounter++;
    ctMouseEventTimerFlag = false;
    if (ctMouseDataCounter >= 100) ctMouseStopData();
  }
};
function ctSetHasScrolled() {
  if (!ctScrollCollected) {
    ctSetCookie([{ name: "ct_has_scrolled", value: true }]);
    ctScrollCollected = true;
  }
}
function ctKeyStopStopListening() {
  if (typeof window.addEventListener == "function") {
    window.removeEventListener("mousedown", ctFunctionFirstKey);
    window.removeEventListener("keydown", ctFunctionFirstKey);
  } else {
    window.detachEvent("mousedown", ctFunctionFirstKey);
    window.detachEvent("keydown", ctFunctionFirstKey);
  }
}
var ctFunctionFirstKey = function output(event) {
  var KeyTimestamp = Math.floor(new Date().getTime() / 1000);
  ctSetCookie([{ name: "ct_fkp_timestamp", value: KeyTimestamp }]);
  ctKeyStopStopListening();
};
if (typeof window.addEventListener == "function") {
  window.addEventListener("mousemove", ctFunctionMouseMove);
  window.addEventListener("mousedown", ctFunctionFirstKey);
  window.addEventListener("keydown", ctFunctionFirstKey);
  window.addEventListener("scroll", ctSetHasScrolled);
} else {
  window.attachEvent("onmousemove", ctFunctionMouseMove);
  window.attachEvent("mousedown", ctFunctionFirstKey);
  window.attachEvent("keydown", ctFunctionFirstKey);
  window.attachEvent("scroll", ctSetHasScrolled);
}
function apbct_collect_visible_fields(form) {
  var inputs = [],
    inputs_visible = "",
    inputs_visible_count = 0,
    inputs_invisible = "",
    inputs_invisible_count = 0,
    inputs_with_duplicate_names = [];
  for (var key in form.elements)
    if (!isNaN(+key)) inputs[key] = form.elements[key];
  inputs = inputs.filter(function (elem) {
    if (inputs_with_duplicate_names.indexOf(elem.getAttribute("name")) !== -1)
      return false;
    if (-1 !== ["radio", "checkbox"].indexOf(elem.getAttribute("type"))) {
      inputs_with_duplicate_names.push(elem.getAttribute("name"));
      return false;
    }
    return true;
  });
  inputs.forEach(function (elem, i, elements) {
    if (
      elem.getAttribute("type") === "submit" ||
      elem.getAttribute("name") === null ||
      elem.getAttribute("name") === "ct_checkjs"
    )
      return;
    if (
      getComputedStyle(elem).display === "none" ||
      getComputedStyle(elem).visibility === "hidden" ||
      getComputedStyle(elem).opacity === "0" ||
      elem.getAttribute("type") === "hidden"
    )
      if (elem.classList.contains("wp-editor-area")) {
        inputs_visible += " " + elem.getAttribute("name");
        inputs_visible_count++;
      } else {
        inputs_invisible += " " + elem.getAttribute("name");
        inputs_invisible_count++;
      }
    else {
      inputs_visible += " " + elem.getAttribute("name");
      inputs_visible_count++;
    }
  });
  inputs_invisible = inputs_invisible.trim();
  inputs_visible = inputs_visible.trim();
  return {
    visible_fields: inputs_visible,
    visible_fields_count: inputs_visible_count,
    invisible_fields: inputs_invisible,
    invisible_fields_count: inputs_invisible_count,
  };
}
function apbct_visible_fields_set_cookie(visible_fields_collection) {
  var collection =
    typeof visible_fields_collection === "object" &&
    visible_fields_collection !== null
      ? visible_fields_collection
      : {};
  ctSetCookie([
    { name: "apbct_visible_fields", value: JSON.stringify(collection) },
  ]);
}
class EventTokenHandler {
  constructor(use_alt_cookies_option) {
    this.token = null;
    this.lsSavedFlagName = "event_token_saved_to_alt_sessions";
    this.lsEVentTokenName = "bot_detector_event_token";
    this.intervalValue = 1500;
    this.init(use_alt_cookies_option);
  }
  init(use_alt_cookies_option) {
    if (
      "undefined" !== typeof use_alt_cookies_option &&
      use_alt_cookies_option
    ) {
      this.setNotSavedFlag();
      this.startListenTokenLS();
    }
  }
  setSavedFlag() {
    localStorage.setItem(this.lsSavedFlagName, "1");
  }
  setNotSavedFlag() {
    localStorage.setItem(this.lsSavedFlagName, "0");
  }
  isSaved() {
    let event_token_saved = localStorage.getItem(this.lsSavedFlagName);
    return (
      event_token_saved !== null &&
      event_token_saved !== undefined &&
      event_token_saved === "1"
    );
  }
  getEventToken() {
    let event_token = localStorage.getItem(this.lsEVentTokenName);
    try {
      event_token = event_token !== null ? JSON.parse(event_token) : false;
    } catch (e) {
      return false;
    }
    event_token = event_token.hasOwnProperty("value")
      ? event_token.value
      : false;
    if (typeof event_token === "string" && event_token.length === 64)
      return event_token;
    return false;
  }
  setEventTokenCookie() {
    if (typeof this.token === "string" && this.token.length === 64)
      ctSetCookie([{ name: "apbct_event_token", value: this.token }]);
  }
  stopListenTokenLS() {
    clearInterval(this.intervalID);
  }
  startListenTokenLS() {
    this.intervalID = setInterval(this.intervalRun, this.intervalValue, this);
  }
  intervalRun(handler) {
    if (!handler.isSaved()) {
      handler.token = handler.getEventToken();
      if (handler.token) {
        handler.setEventTokenCookie();
        handler.setSavedFlag();
        handler.stopListenTokenLS();
      }
    }
  }
}
new EventTokenHandler(ct_use_alt_cookies);
