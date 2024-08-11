// utils.js
export function animateValue(id, start, end, duration) {
  const element = document.getElementById(id);
  const startTime = performance.now();

  function updateValue(timestamp) {
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const currentValue = Math.floor(progress * (end - start) + start);
    element.innerText = currentValue.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(updateValue);
    }
  }

  requestAnimationFrame(updateValue);
}
