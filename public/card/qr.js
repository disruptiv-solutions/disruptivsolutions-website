(() => {
  'use strict';
  const mount = document.getElementById('phone-qr');
  try {
    const url = new URL(window.__CARD_URL__);
    if (url.protocol !== 'https:') throw new Error('Card address unavailable');
    const qr = window.qrcode(0, 'M');
    qr.addData(url.href);
    qr.make();
    mount.innerHTML = qr.createSvgTag({ cellSize: 8, margin: 32, scalable: true });
    const svg = mount.querySelector('svg');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Scan to open Ian McDonald’s links');
  } catch {
    const message = document.createElement('p');
    message.textContent = 'The QR code could not load. Use Open my links below.';
    mount.appendChild(message);
  }
  if (window.isSecureContext && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/card/sw.js', { scope: '/card' }).catch(() => {});
    });
  }
})();
