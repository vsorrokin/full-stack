import Vue from 'vue';

const settings = {
  offset: 10
};

let inside = false;

function setTransform(el, x = 0, y = 0, scale = 1) {
  el.style.cssText = `transform: perspective(1200px) rotateX(${x}deg) rotateY(${y}deg) scale3d(${scale}, ${scale}, ${scale})`;
}

Vue.directive('perspective', {
  inserted(el) {
    const w = el.offsetWidth;
    const h = el.offsetHeight;

    const DOMBase = el.querySelector('.image-wrap');
    const DOMShadow = el.querySelector('.shadow-wrap');

    el.addEventListener('mousemove', event => {
      const y = settings.offset - (event.offsetX / w) * (settings.offset * 2);
      const x = (event.offsetY / h) * (settings.offset * 2) - settings.offset;

      setTransform(DOMBase, x, y, inside ? 1.05 : 1);
      setTransform(DOMShadow, x/2, y/2, inside ? 0.95 : 1);
    });

    el.addEventListener('mouseleave', event => {
      inside = false;

      setTransform(DOMBase);
      setTransform(DOMShadow);
    });

    el.addEventListener('mouseenter', event => {
      inside = true;
    });
  }
})
