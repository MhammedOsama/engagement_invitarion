/* =========
  Edit your invitation data from here
========= */

const INVITATION = {
  brideName: "Menna Allah",
  groomName: "Mostafa",
  eventDateISO: "2026-07-21T19:00:00+03:00",
  eventDateText: "21 July 2026",
  eventTimeText: "07:00 PM",
  venue: "Grand Palace",
  address: "Grand Palace",
  mapLink: "https://maps.google.com/?q=Grand%20Palace",
  whatsappNumber: "201009465981",
  hashtag: "#Mostafa_Menna_Allah_Engagement"
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

/* Preloader */
window.addEventListener("load", () => {
  setTimeout(() => {
    $("#preloader").classList.add("hide");
  }, 650);
});

/* Fill editable text */
function hydrateContent() {
  $("#eventDateText").textContent = INVITATION.eventDateText;
  $("#eventTimeText").textContent = INVITATION.eventTimeText;
  $("#venueText").textContent = INVITATION.venue;
  $("#addressText").textContent = INVITATION.address;
  $("#mapBtn").href = INVITATION.mapLink;
}
hydrateContent();

/* Countdown */
function updateCountdown() {
  const target = new Date(INVITATION.eventDateISO).getTime();
  const now = Date.now();
  const distance = target - now;

  if (distance <= 0) {
    $("#countdown").innerHTML = `<div class="event-live"><strong>Today</strong><span>Our celebration has begun</span></div>`;
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  $("#days").textContent = String(days).padStart(2, "0");
  $("#hours").textContent = String(hours).padStart(2, "0");
  $("#minutes").textContent = String(minutes).padStart(2, "0");
  $("#seconds").textContent = String(seconds).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* Reveal on scroll */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });

$$(".reveal").forEach((el) => observer.observe(el));

/* Topbar effect */
window.addEventListener("scroll", () => {
  const topbar = $("#topbar");
  if (window.scrollY > 40) topbar.classList.add("scrolled");
  else topbar.classList.remove("scrolled");
});

/* Music toggle */
const music = $("#bgMusic");
const musicBtn = $("#musicBtn");

musicBtn.addEventListener("click", async () => {
  try {
    if (music.paused) {
      await music.play();
      musicBtn.classList.add("playing");
    } else {
      music.pause();
      musicBtn.classList.remove("playing");
    }
  } catch (error) {
    alert("Please add the music file inside the assets folder.");
  }
});

/* Gallery Lightbox */
const lightbox = $("#lightbox");
const lightboxImg = $("#lightboxImg");

$$(".photo-card").forEach((card) => {
  card.addEventListener("click", () => {
    if (card.classList.contains("missing-img")) return;
    lightboxImg.src = card.dataset.img;
    lightbox.classList.add("show");
    document.body.classList.add("no-scroll");
  });
});

$("#closeLightbox").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

function closeLightbox() {
  lightbox.classList.remove("show");
  document.body.classList.remove("no-scroll");
}

/* Copy address */
$("#copyAddressBtn").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(INVITATION.address);
    $("#copyAddressBtn").textContent = "Copied ✓";
    setTimeout(() => ($("#copyAddressBtn").textContent = "Copy Address"), 1500);
  } catch {
    alert(INVITATION.address);
  }
});

/* RSVP to WhatsApp */
$("#rsvpForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const name = $("#guestName").value.trim();
  const count = $("#guestCount").value;
  const note = $("#guestNote").value.trim();

  const message = `Hello, I am ${name}
I will attend the engagement of ${INVITATION.groomName} and ${INVITATION.brideName}
Guests count: ${count}
${note ? "My message: " + note : ""}`;

  const url = `https://wa.me/${INVITATION.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
});

/* Add to calendar - downloads .ics */
$("#calendarBtn").addEventListener("click", () => {
  const start = new Date(INVITATION.eventDateISO);
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);

  const formatICS = (date) =>
    date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `SUMMARY:Engagement - ${INVITATION.groomName} & ${INVITATION.brideName}`,
    `DTSTART:${formatICS(start)}`,
    `DTEND:${formatICS(end)}`,
    `LOCATION:${INVITATION.address}`,
    `DESCRIPTION:Engagement invitation for ${INVITATION.groomName} and ${INVITATION.brideName}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "engagement-invitation.ics";
  link.click();
  URL.revokeObjectURL(link.href);
});

/* Floating hearts */
function createFloatItem() {
  const item = document.createElement("span");
  const icons = ["♡", "✦", "❀", "♥"];
  item.className = "float-item";
  item.textContent = icons[Math.floor(Math.random() * icons.length)];
  item.style.left = Math.random() * 100 + "vw";
  item.style.fontSize = Math.random() * 14 + 14 + "px";
  item.style.color = Math.random() > 0.5 ? "rgba(196,154,90,.72)" : "rgba(216,166,166,.78)";
  item.style.animationDuration = Math.random() * 4 + 6 + "s";
  item.style.transform = `rotate(${Math.random() * 180}deg)`;

  $("#floatLayer").appendChild(item);

  setTimeout(() => item.remove(), 10500);
}
setInterval(createFloatItem, 700);

/* Cursor glow desktop */
const glow = $("#cursorGlow");
window.addEventListener("mousemove", (event) => {
  glow.style.opacity = "1";
  glow.style.left = event.clientX + "px";
  glow.style.top = event.clientY + "px";
});
