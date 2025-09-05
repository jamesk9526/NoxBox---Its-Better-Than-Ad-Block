"use strict";
const app = document.getElementById('app');
function applyBlurEffect() {
    const mediaElements = document.querySelectorAll('img, video');
    mediaElements.forEach(element => {
        element.style.filter = 'blur(8px)';
    });
}
function init() {
    applyBlurEffect();
}
document.addEventListener('DOMContentLoaded', init);
