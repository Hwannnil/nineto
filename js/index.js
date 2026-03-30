const API_URL = "https://script.google.com/macros/s/AKfycbxeA_cfq0pd9XOm_L_CImU8UwHMaWNcYkrJupSMJ_RlDHthBCzzzp9CVzru-11sRYCcew/exec";

let socialrings = [];
let schedules = [];

async function loadConfig() {
  try {
    const response = await fetch(`${API_URL}?type=config`);
    const data = await response.json();

    if (!data.ok) {
      alert("데이터를 불러오지 못했습니다.");
      return;
    }

    socialrings = data.socialrings || [];
    schedules = data.schedule || [];

    renderSocialrings(socialrings);
    renderCount(data.socialring_count || socialrings.length);
  } catch (error) {
    console.error(error);
    alert("서버 연결에 실패했습니다.");
  }
}

function renderCount(count) {
  const countEl = document.getElementById("socialring-count");
  countEl.textContent = `소셜링 ${count}개`;
}

function renderSocialrings(items) {
  const listEl = document.getElementById("socialring-list");

  listEl.innerHTML = items.map(item => `
    <button
      type="button"
      class="socialring socialring-button"
      data-socialring-id="${item["소셜링ID"] || ""}"
    >
      <img
        class="socialring-img"
        src="${item["이미지"] || ""}"
        alt="${item["소셜링명"] || ""}"
      />
      <div class="socialring-text">
        <h2>${item["소셜링명"] || ""}</h2>
        <p>${item["설명"] || ""}</p>
      </div>
    </button>
  `).join("");

  bindSocialringEvents();
}

function bindSocialringEvents() {
  const buttons = document.querySelectorAll(".socialring-button");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const socialringId = button.dataset.socialringId;
      const socialring = socialrings.find(
        item => String(item["소셜링ID"]) === String(socialringId)
      );

      openScheduleModal(socialring);
    });
  });
}

function openScheduleModal(socialring) {
  if (!socialring) return;

  const modal = document.getElementById("schedule-modal");
  const titleEl = document.getElementById("modal-socialring-title");
  const descEl = document.getElementById("modal-socialring-desc");
  const scheduleListEl = document.getElementById("schedule-list");
  const emptyEl = document.getElementById("empty-message");

  titleEl.textContent = socialring["소셜링명"] || "";
  descEl.textContent = socialring["설명"] || "";

  const filteredSchedules = schedules.filter(item =>
    String(item["소셜링ID"]).trim() === String(socialring["소셜링ID"]).trim()
  );

  if (filteredSchedules.length === 0) {
    scheduleListEl.innerHTML = "";
    emptyEl.classList.remove("hidden");
  } else {
    emptyEl.classList.add("hidden");
    scheduleListEl.innerHTML = filteredSchedules.map(item => `
      <button
        type="button"
        class="schedule-item"
        data-socialring-id="${socialring["소셜링ID"] || ""}"
        data-socialring-name="${socialring["소셜링명"] || ""}"
        data-schedule-id="${item["시간ID"] || ""}"
        data-schedule-label="${item["시간명"] || ""}"
      >
        ${item["시간명"] || ""}
      </button>
    `).join("");

    bindScheduleEvents();
  }

  modal.classList.remove("hidden");
  document.body.classList.add("modal-open");
}

function bindScheduleEvents() {
  const scheduleButtons = document.querySelectorAll(".schedule-item");

  scheduleButtons.forEach(button => {
    button.addEventListener("click", () => {
      const socialringId = button.dataset.socialringId;
      const socialringName = button.dataset.socialringName;
      const scheduleId = button.dataset.scheduleId;
      const scheduleLabel = button.dataset.scheduleLabel;

      const targetUrl =
        `./pages/step1.html?socialring_id=${encodeURIComponent(socialringId)}` +
        `&socialring_name=${encodeURIComponent(socialringName)}` +
        `&schedule_id=${encodeURIComponent(scheduleId)}` +
        `&schedule_label=${encodeURIComponent(scheduleLabel)}`;

      location.href = targetUrl;
    });
  });
}

function closeModal() {
  const modal = document.getElementById("schedule-modal");
  modal.classList.add("hidden");
  document.body.classList.remove("modal-open");
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal-overlay").addEventListener("click", closeModal);

  loadConfig();
});