const inrFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

function formatINR(value) {
  return inrFormatter.format(Number(value) || 0);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("is-visible"), 3600);
}

function handleOrderClick(title, price) {
  showToast(`Request received for "${title}" (₹${formatINR(price)}). We'll follow up by email shortly.`);
}

/* ---------------- Reels tier card ---------------- */
function renderReelsCard(slot, accent) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.accent = accent;

  card.innerHTML = `
    <div class="media-stage" data-ratio="9:16">
      <span class="stage-tag">4K · 9:16</span>
      <span class="price-badge"><sup>₹</sup>${formatINR(slot.price)}</span>
      <video src="${slot.video}" controls preload="metadata" playsinline></video>
    </div>
    <div class="card-body">
      <div class="tier-kicker">${slot.subCategory || ""} Tier</div>
      <h3>${slot.title}</h3>
      <p class="tagline">${slot.tagline || ""}</p>
      <ul class="feature-list">
        ${(slot.features || []).map((f) => `<li>${f}</li>`).join("")}
      </ul>
      <button class="btn btn-order${accent === "gold" ? " is-gold" : ""}" type="button">
        Order Now — ₹${formatINR(slot.price)}
      </button>
    </div>
  `;

  card.querySelector(".btn-order").addEventListener("click", () => {
    handleOrderClick(slot.title, slot.price);
  });

  return card;
}

/* ---------------- Wide feature card (YouTube / Shoot+Edit) ---------------- */
function renderFeatureCard(slot, accent) {
  const card = document.createElement("article");
  card.className = "card feature-card";
  card.dataset.accent = accent;

  card.innerHTML = `
    <div class="media-stage" data-ratio="16:9">
      <span class="stage-tag">4K · 16:9</span>
      <span class="price-badge"><sup>₹</sup>${formatINR(slot.price)}</span>
      <video src="${slot.video}" controls preload="metadata" playsinline></video>
    </div>
    <div class="card-body">
      <div class="tier-kicker">${slot.mainCategory === "YouTube" ? "YouTube Editing" : "Shoot + Edit"}</div>
      <h3>${slot.title}</h3>
      <p class="tagline">${slot.tagline || ""}</p>
      <ul class="feature-list">
        ${(slot.features || []).map((f) => `<li>${f}</li>`).join("")}
      </ul>
      <div class="price-row">
        <span class="amount"><sup>₹</sup>${formatINR(slot.price)}</span>
        <span class="per">/ project</span>
      </div>
      <button class="btn btn-order" type="button">Order Now</button>
    </div>
  `;

  card.querySelector(".btn-order").addEventListener("click", () => {
    handleOrderClick(slot.title, slot.price);
  });

  return card;
}

async function fetchMedia() {
  return mediaData;
}

async function renderAll() {
  const reelsGrid = document.getElementById("reels-grid");
  const youtubeMount = document.getElementById("youtube-card");
  const shootEditMount = document.getElementById("shootedit-card");

  try {
    const media = await fetchMedia();

    reelsGrid.innerHTML = "";
    reelsGrid.appendChild(renderReelsCard(media["reels-basic"], "teal"));
    reelsGrid.appendChild(renderReelsCard(media["reels-medium"], "orange"));
    reelsGrid.appendChild(renderReelsCard(media["reels-premium"], "gold"));

    youtubeMount.innerHTML = "";
    youtubeMount.appendChild(renderFeatureCard(media["youtube"], "teal"));

    shootEditMount.innerHTML = "";
    shootEditMount.appendChild(renderFeatureCard(media["shootedit"], "orange"));
  } catch (err) {
    console.error(err);
    showToast("Could not load live pricing — showing the page may need a refresh.");
  }
}

document.getElementById("year").textContent = new Date().getFullYear();
renderAll();
