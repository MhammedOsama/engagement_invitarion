/* =========
  Edit your invitation data from here
========= */

const INVITATION = {
  brideName: "Menna Allah",
  groomName: "Mostafa",
  eventDateISO: "2026-07-21T21:00:00+03:00",
  eventDateText: "Tuesday, 21 July 2026",
  eventTimeText: "09:00 PM",
  venue: "Grand Palace",
  address: "Gehan Road, Qewaisna Center",
  governorate: "Menofia Governorate",
  mapLink: "https://maps.app.goo.gl/ivb4TQQzozyVSHh39?g_st=iw",
  hashtag: "#Mostafa_Menna_Allah_Engagement",
};

const SUPABASE_URL = "https://btuqdhchqzqhuwdzhhuk.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_E9Rj1YLPU4KkdhNq6UnHqg_7xZ0tw7-";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
);

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const setText = (selector, value) => {
  const element = $(selector);
  if (element) element.textContent = value;
};

const setHref = (selector, value) => {
  const element = $(selector);
  if (element) element.href = value;
};

/* Preloader */
window.addEventListener("load", () => {
  setTimeout(() => {
    const preloader = $("#preloader");
    if (preloader) preloader.classList.add("hide");
  }, 650);
});

/* Fill editable text */
function hydrateContent() {
  setText("#eventDateText", INVITATION.eventDateText);
  setText("#eventTimeText", INVITATION.eventTimeText);
  setText("#venueText", INVITATION.venue);
  setText("#addressText", INVITATION.address);
  setText("#locationDetailsText", INVITATION.governorate);
  setHref("#mapBtn", INVITATION.mapLink);
}
hydrateContent();

/* Countdown */
function updateCountdown() {
  const countdown = $("#countdown");
  if (!countdown) return;

  const target = new Date(INVITATION.eventDateISO).getTime();
  const now = Date.now();
  const distance = target - now;

  if (distance <= 0) {
    countdown.innerHTML = `<div class="event-live"><strong>Today</strong><span>الفرحة بدأت 🎉</span></div>`;
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  setText("#days", String(days).padStart(2, "0"));
  setText("#hours", String(hours).padStart(2, "0"));
  setText("#minutes", String(minutes).padStart(2, "0"));
  setText("#seconds", String(seconds).padStart(2, "0"));
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* Reveal on scroll */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.12 },
);

$$(".reveal").forEach((el) => observer.observe(el));

/* Topbar effect */
window.addEventListener("scroll", () => {
  const topbar = $("#topbar");
  if (!topbar) return;
  if (window.scrollY > 40) topbar.classList.add("scrolled");
  else topbar.classList.remove("scrolled");
});

/* Music toggle */
const music = $("#bgMusic");
const musicBtn = $("#musicBtn");

if (music && musicBtn) {
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
      alert("حط ملف المزيكا جوه فولدر assets الأول 🎵");
    }
  });
}

/* Gallery Lightbox */
const lightbox = $("#lightbox");
const lightboxImg = $("#lightboxImg");

$$(".photo-card").forEach((card) => {
  card.addEventListener("click", () => {
    if (!lightbox || !lightboxImg) return;
    if (card.classList.contains("missing-img")) return;
    lightboxImg.src = card.dataset.img;
    lightbox.classList.add("show");
    document.body.classList.add("no-scroll");
  });
});

const closeLightboxBtn = $("#closeLightbox");
if (closeLightboxBtn) closeLightboxBtn.addEventListener("click", closeLightbox);
if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove("show");
  document.body.classList.remove("no-scroll");
}

/* Copy location */
const fullLocation = `${INVITATION.venue}, ${INVITATION.address}, ${INVITATION.governorate}`;
const copyAddressBtn = $("#copyAddressBtn");
if (copyAddressBtn) {
  copyAddressBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(
        `${fullLocation} - ${INVITATION.mapLink}`,
      );
      copyAddressBtn.textContent = "Copied ✓";
      setTimeout(() => (copyAddressBtn.textContent = "Copy Location"), 1500);
    } catch {
      alert(`${fullLocation}\n${INVITATION.mapLink}`);
    }
  });
}

/* RSVP to Supabase Database */
const rsvpForm = $("#rsvpForm");

if (rsvpForm) {
  rsvpForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = $("#guestName").value.trim();
    const count = Number($("#guestCount").value);
    const note = $("#guestNote").value.trim();

    const submitBtn = $("#rsvpSubmitBtn");
    const status = $("#rsvpStatus");

    if (name.length < 2) {
      status.textContent = "اكتب اسم صحيح الأول.";
      status.className = "rsvp-status error";
      return;
    }

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      status.textContent = "";
      status.className = "rsvp-status";

      const { error } = await supabaseClient.from("rsvps").insert([
        {
          guest_name: name,
          guest_count: count,
          note: note || null,
        },
      ]);

      if (error) throw error;

      rsvpForm.reset();

      status.textContent = "تم تسجيل حضورك بنجاح، مستنيينك معانا 🎉";

      status.className = "rsvp-status success";
    } catch (error) {
      console.error("RSVP error:", error);

      status.textContent = "حصلت مشكلة أثناء الإرسال، جرّب تاني.";

      status.className = "rsvp-status error";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send RSVP ✨";
    }
  });
}

/* Add to calendar - downloads .ics */
const calendarBtn = $("#calendarBtn");
if (calendarBtn) {
  calendarBtn.addEventListener("click", () => {
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
      `LOCATION:${fullLocation}`,
      `DESCRIPTION:Engagement Party for ${INVITATION.groomName} and ${INVITATION.brideName} | Save the date and see you there ✨ | Location: ${INVITATION.mapLink}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\n");

    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "engagement-invitation.ics";
    link.click();
    URL.revokeObjectURL(link.href);
  });
}

/* Floating hearts */
function createFloatItem() {
  const floatLayer = $("#floatLayer");
  if (!floatLayer) return;

  const item = document.createElement("span");
  const icons = ["♡", "✦", "✨", "♥", "🎉"];
  item.className = "float-item";
  item.textContent = icons[Math.floor(Math.random() * icons.length)];
  item.style.left = Math.random() * 100 + "vw";
  item.style.fontSize = Math.random() * 14 + 14 + "px";
  item.style.color =
    Math.random() > 0.5 ? "rgba(236,72,153,.72)" : "rgba(56,189,248,.78)";
  item.style.animationDuration = Math.random() * 4 + 6 + "s";
  item.style.transform = `rotate(${Math.random() * 180}deg)`;

  floatLayer.appendChild(item);

  setTimeout(() => item.remove(), 10500);
}
setInterval(createFloatItem, 700);

/* Cursor glow desktop */
const glow = $("#cursorGlow");
window.addEventListener("mousemove", (event) => {
  if (!glow) return;
  glow.style.opacity = "1";
  glow.style.left = event.clientX + "px";
  glow.style.top = event.clientY + "px";
});
