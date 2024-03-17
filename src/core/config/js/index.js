(function (window) {
  if (!window.app) {
    window.app = {};
  }

  const breakpoints = {
    xxl: 1919,
    xl: 1439,
    lg: 1279,
    md: 991,
    sm: 575,
  };

  const events = {}; // кастомные события

  window.app.config = {
    events,
    breakpoints,
    // ...
  };
})(window);