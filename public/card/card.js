(() => {
  "use strict";

  const status = document.getElementById("card-status");
  const dialogStatus = document.getElementById("qr-status");
  const qrDialog = document.getElementById("qr-dialog");
  const qrCode = document.getElementById("qr-code");
  const qrMessage = document.getElementById("qr-message");
  const cardUrlInput = document.getElementById("card-url");
  let renderedQrUrl = "";

  // Set window.__CARD_URL__ before this script, or fill data-card-url / the card-url meta tag.
  function getCardUrl() {
    const configured = window.__CARD_URL__ || document.documentElement.dataset.cardUrl ||
      document.querySelector('meta[name="card-url"]')?.content || window.location.href;
    const url = new URL(String(configured).trim(), window.location.href);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new Error("The card needs a web address before it can be shared.");
    }
    return url.href;
  }

  function setStatus(message, target = status) {
    target.textContent = message;
  }

  function renderQr(url) {
    if (renderedQrUrl === url && qrCode.firstChild) return;
    qrCode.replaceChildren();
    qrMessage.textContent = "";
    if (typeof window.qrcode !== "function") {
      throw new Error("The QR code couldn’t load. You can still use the link below.");
    }
    const qr = window.qrcode(0, "M");
    qr.addData(url);
    qr.make();
    const count = qr.getModuleCount();
    const quietZone = 4;
    const size = count + quietZone * 2;
    const namespace = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(namespace, "svg");
    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "QR code to open Ian McDonald’s card");
    svg.setAttribute("width", "260");
    svg.setAttribute("height", "260");
    const background = document.createElementNS(namespace, "rect");
    background.setAttribute("width", String(size));
    background.setAttribute("height", String(size));
    background.setAttribute("fill", "#ffffff");
    svg.appendChild(background);
    let pathData = "";
    for (let row = 0; row < count; row++) {
      for (let column = 0; column < count; column++) {
        if (qr.isDark(row, column)) {
          pathData += `M${column + quietZone} ${row + quietZone}h1v1h-1z`;
        }
      }
    }
    const modules = document.createElementNS(namespace, "path");
    modules.setAttribute("d", pathData);
    modules.setAttribute("fill", "#171714");
    svg.appendChild(modules);
    qrCode.appendChild(svg);
    renderedQrUrl = url;
  }

  function openQr() {
    setStatus("", dialogStatus);
    try {
      const url = getCardUrl();
      cardUrlInput.value = url;
      try {
        renderQr(url);
      } catch (error) {
        qrMessage.textContent = error.message;
      }
      qrDialog.showModal();
      document.getElementById("close-qr").focus();
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function copyLink(target) {
    try {
      const url = getCardUrl();
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard unavailable");
      }
      await navigator.clipboard.writeText(url);
      setStatus("Card link copied.", target);
      return true;
    } catch {
      if (target === dialogStatus) {
        cardUrlInput.focus();
        cardUrlInput.select();
        setStatus("Couldn’t copy automatically. Touch and hold the link to copy it.", target);
      } else {
        setStatus("Couldn’t copy the link. Open Show QR to use or copy the card link.", target);
      }
      return false;
    }
  }

  document.getElementById("show-qr").addEventListener("click", openQr);
  document.getElementById("close-qr").addEventListener("click", () => qrDialog.close());
  qrDialog.addEventListener("click", (event) => {
    if (event.target !== qrDialog) return;
    const bounds = qrDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom) qrDialog.close();
  });
  qrDialog.addEventListener("close", () => document.getElementById("show-qr").focus());
  document.getElementById("copy-card-link").addEventListener("click", () => copyLink(dialogStatus));
  cardUrlInput.addEventListener("click", () => cardUrlInput.select());

  document.getElementById("share-card").addEventListener("click", async () => {
    setStatus("");
    let url;
    try {
      url = getCardUrl();
    } catch (error) {
      setStatus(error.message);
      return;
    }
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "Ian McDonald · My Card", text: "Connect with Ian McDonald", url });
        setStatus("Card shared.");
        return;
      } catch (error) {
        if (error.name === "AbortError") {
          setStatus("Sharing cancelled.");
          return;
        }
      }
    }
    await copyLink(status);
  });

  document.getElementById("save-contact").addEventListener("click", () => {
    try {
      const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        "N:McDonald;Ian;;;",
        "FN:Ian McDonald",
        "TITLE:Practical AI builder",
        `URL:${getCardUrl()}`,
        "item8.URL:https://www.ianmcdonald.ai/",
        "item8.X-ABLabel:Website",
        "item1.URL:https://calendar.app.google/SBa6dqoKQFCfu5jM6",
        "item1.X-ABLabel:Book a 15-minute call",
        "item2.URL:https://www.disruptiv.solutions/",
        "item2.X-ABLabel:Disruptiv Solutions",
        "item3.URL:https://www.launchbox.space/ianmcdonaldai",
        "item3.X-ABLabel:LaunchBox community",
        "item4.URL:https://www.linkedin.com/in/ianmcdonaldai/",
        "item4.X-ABLabel:LinkedIn",
        "item5.URL:https://www.facebook.com/ianmcdonaldai",
        "item5.X-ABLabel:Facebook",
        "item6.URL:https://www.instagram.com/ian_mcdonald_ai/",
        "item6.X-ABLabel:Instagram",
        "item7.URL:https://www.youtube.com/@IansDisruptivSolutions",
        "item7.X-ABLabel:YouTube",
        "END:VCARD",
        ""
      ];
      const contact = new Blob([lines.join("\r\n")], { type: "text/vcard;charset=utf-8" });
      const fileUrl = URL.createObjectURL(contact);
      const download = document.createElement("a");
      download.href = fileUrl;
      download.download = "Ian-McDonald.vcf";
      document.body.appendChild(download);
      download.click();
      download.remove();
      window.setTimeout(() => URL.revokeObjectURL(fileUrl), 30000);
      setStatus("Contact file prepared. Open Ian-McDonald.vcf to add Ian.");
    } catch {
      setStatus("Couldn’t prepare the contact file. Please try again.");
    }
  });

  if (new URLSearchParams(window.location.search).get('qr') === '1') openQr();
  window.MyCard = Object.freeze({ getUrl: getCardUrl });

  if (window.isSecureContext && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/card/sw.js", { scope: "/card" }).catch(() => {
        // The card remains usable if offline installation is unavailable.
      });
    });
  }
})();
