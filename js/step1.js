const params = new URLSearchParams(window.location.search);

const socialringId = params.get("socialring_id") || "";
const socialringName = params.get("socialring_name") || "";
const socialringDesc = params.get("socialring_desc") || "";
const scheduleId = params.get("schedule_id") || "";
const scheduleLabel = params.get("schedule_label") || "";

document.addEventListener("DOMContentLoaded", () => {
  const titleEl = document.getElementById("socialringTitle");
  const descEl = document.getElementById("socialringDesc");
  const scheduleEl = document.getElementById("scheduleLabel");
  const buttonEl = document.getElementById("applyButton");

  if (titleEl) titleEl.textContent = socialringName || "소셜링 소개";
  if (descEl) descEl.textContent = socialringDesc || "설명이 없습니다.";
  if (scheduleEl) scheduleEl.textContent = scheduleLabel || "";

  if (buttonEl) {
    buttonEl.addEventListener("click", () => {
      location.href =
        `./subscription_main.html?socialring_id=${encodeURIComponent(socialringId)}` +
        `&socialring_name=${encodeURIComponent(socialringName)}` +
        `&schedule_id=${encodeURIComponent(scheduleId)}` +
        `&schedule_label=${encodeURIComponent(scheduleLabel)}`;
    });
  }
});