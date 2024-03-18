(function (window) {
  const { config, lib } = window.app;

  const build = (element) => {
    console.log(element);
  };

  const mount = () => {
    const elements = Array.from(document.querySelectorAll('.selector'));

    elements.forEach(build);

    // если нужен обсервер
    // elements.forEach((element) => {
    //   build(element);
    //   lib.setObserver(element, build);
    // });
  };

  document.addEventListener('DOMContentLoaded', mount);
})(window);