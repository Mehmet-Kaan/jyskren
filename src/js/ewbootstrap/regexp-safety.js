(function ($) {
  if (!$) return;
  const originalTest = RegExp.prototype.test;
  RegExp.prototype.test = function (arg) {
    if (arg !== null && typeof arg === "object")
      try {
        return originalTest.call(this, String(arg));
      } catch (e) {
        return originalTest.call(this, "");
      }
    return originalTest.call(this, arg);
  };
})(window.jQuery);
