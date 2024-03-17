(function (window) {
  if (!window.app) {
    window.app = {};
  }

  const setObserver = (element, handleObserve, manualConfig = {}) => {
    const config = {
      childList: true,
      ...manualConfig,
    };

    const observer = new MutationObserver(() => handleObserve(element));

    observer.observe(element, config);
  };

  const findAncestorsByClassName = (el, className, stopElement = null) => {
    let ancestorEls = [];
    let currentParent = el.parentElement;

    if (!currentParent) {
      return ancestorEls;
    }

    while (currentParent !== null && currentParent !== stopElement) {
      if (currentParent.classList.contains(className)) {
        ancestorEls = [...ancestorEls, currentParent];
      }

      currentParent = currentParent.parentElement;
    }

    return ancestorEls;
  };

  const findAncestorByClassName = (el, className) => {
    let ancestorEl = el.parentElement;

    while (!ancestorEl.classList.contains(className)) {
      ancestorEl = ancestorEl.parentElement;

      if (!ancestorEl) {
        return null;
      }
    }

    return ancestorEl;
  };

  const buildComponentLogger = (componentName) => {
    return (text, context = '', data = null) => {
      const msg = context ? `${componentName}:${context}:${text}` : `${componentName}:${text}`;
      console.debug(msg);

      if (data) {
        console.dir(data);
      }
    };
  };

  const debounce = (callee, timeoutMs) => {
    return function perform(...args) {
      let previousCall = this.lastCall;
      this.lastCall = Date.now();

      if (previousCall && this.lastCall - previousCall <= timeoutMs) {
        clearTimeout(this.lastCallTimer);
      }

      this.lastCallTimer = setTimeout(() => callee(...args), timeoutMs);
    };
  };

  const throttle = (callee, timeout) => {
    let timer = null

    return function perform(...args) {
      if (timer) return

      timer = setTimeout(() => {
        callee(...args)

        clearTimeout(timer)
        timer = null
      }, timeout);
    };
  };

  window.app.lib = {
    setObserver,
    findAncestorsByClassName,
    findAncestorByClassName,
    buildComponentLogger,
    debounce,
    throttle,
  };
})(window);