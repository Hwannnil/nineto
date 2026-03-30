const API_URL =
  "https://script.google.com/macros/s/AKfycbx6bMb3DVBq0LfSH7MZwfnm4vrdtniYpxMVVUBXUNbHX9NRnoxh4Zwm-2fUBZaqkM2e3A/exec";

const pages = document.querySelectorAll(".page");
let currentPage = 0;

let selectedGender = "";
let paymentConfirmed = "";
let noticeConfirmed = "";
let privacyAgreed = "";

const params = new URLSearchParams(window.location.search);
const selectedSocialringId = params.get("socialring_id") || "";
const selectedSocialringName = params.get("socialring_name") || "";
const selectedScheduleId = params.get("schedule_id") || "";
const selectedScheduleLabel = params.get("schedule_label") || "";
const noticeCheckBtn = document.getElementById("noticeCheckBtn");
const noticeModal = document.getElementById("noticeModal");
const noticeModalClose = document.getElementById("noticeModalClose");
const noticeModalX = document.getElementById("noticeModalX");
const noticeConfirmBtn = document.getElementById("noticeConfirmBtn");

function showPage(index) {
  pages.forEach((page, i) => {
    page.classList.remove("active", "prev");
    if (i < index) page.classList.add("prev");
    if (i === index) page.classList.add("active");
  });
  currentPage = index;
}

function bindPageMoveEvents() {
  document.querySelectorAll(".next-step").forEach((btn) => {
    btn.addEventListener("click", () => {
      const nextIndex = Number(btn.dataset.next);
      showPage(nextIndex);
    });
  });

  document.querySelectorAll(".prev-step").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (currentPage > 0) showPage(currentPage - 1);
    });
  });
}

function bindChoiceEvents() {
  document.querySelectorAll(".gender-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".gender-item").forEach((item) => {
        item.classList.remove("selected");
      });
      btn.classList.add("selected");
      selectedGender = btn.dataset.gender || "";
    });
  });

  document.querySelectorAll(".payment-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".payment-item").forEach((item) => {
        item.classList.remove("selected");
      });
      btn.classList.add("selected");
      paymentConfirmed = btn.dataset.value || "";
    });
  });

  document.querySelectorAll(".notice-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".notice-item").forEach((item) => {
        item.classList.remove("selected");
      });
      btn.classList.add("selected");
      noticeConfirmed = btn.dataset.value || "";
    });
  });

  document.querySelectorAll(".agree-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".agree-item").forEach((item) => {
        item.classList.remove("selected");
      });
      btn.classList.add("selected");
      privacyAgreed = btn.dataset.value || "";
    });
  });
}

function openNoticeModal() {
  noticeModal.classList.add("open");
  noticeModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeNoticeModal() {
  noticeModal.classList.remove("open");
  noticeModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

if (noticeCheckBtn) {
  noticeCheckBtn.addEventListener("click", () => {
    openNoticeModal();
  });
}

if (noticeModalClose) {
  noticeModalClose.addEventListener("click", closeNoticeModal);
}

if (noticeModalX) {
  noticeModalX.addEventListener("click", closeNoticeModal);
}

if (noticeConfirmBtn) {
  noticeConfirmBtn.addEventListener("click", () => {
    noticeCheckBtn.classList.add("confirmed", "selected");
    noticeCheckBtn.setAttribute("data-confirmed", "true");
    closeNoticeModal();
  });
}

function bindSubmitEvent() {
  const submitBtn = document.getElementById("submitBtn");
  if (!submitBtn) return;

  submitBtn.addEventListener("click", async () => {
    const payload = {
      socialring_id: selectedSocialringId,
      socialring_name: selectedSocialringName,
      schedule_id: selectedScheduleId,
      schedule_label: selectedScheduleLabel,

      nickname: document.getElementById("nicknameInput")?.value.trim() || "",
      gender: selectedGender,
      age: document.getElementById("ageInput")?.value.trim() || "",
      job: document.getElementById("jobInput")?.value.trim() || "",
      charm: document.getElementById("charmInput")?.value.trim() || "",
      phone: document.getElementById("phoneInput")?.value.trim() || "",
      instagram: document.getElementById("instagramInput")?.value.trim() || "",

      deposit_confirm: paymentConfirmed,
      refund_bank: document.getElementById("bankNameInput")?.value.trim() || "",
      refund_account: document.getElementById("accountNumberInput")?.value.trim() || "",
      refund_holder: document.getElementById("accountHolderInput")?.value.trim() || "",

      notice_confirm: noticeConfirmed,
      privacy_agree: privacyAgreed
    };

    if (!payload.schedule_id) {
      alert("참여 시간이 선택되지 않았습니다. 메인 화면에서 다시 선택해주세요.");
      return;
    }
    if (!payload.nickname) {
      alert("닉네임을 입력해주세요.");
      return;
    }
    if (!payload.gender) {
      alert("성별을 선택해주세요.");
      return;
    }
    if (!payload.age) {
      alert("나이를 입력해주세요.");
      return;
    }
    if (!payload.job) {
      alert("직업을 입력해주세요.");
      return;
    }
    if (!payload.charm) {
      alert("나만의 매력을 입력해주세요.");
      return;
    }
    if (!payload.phone) {
      alert("전화번호를 입력해주세요.");
      return;
    }
    if (!payload.deposit_confirm) {
      alert("입금 안내 확인을 선택해주세요.");
      return;
    }
    if (!payload.refund_bank || !payload.refund_account || !payload.refund_holder) {
      alert("환불계좌 정보를 모두 입력해주세요.");
      return;
    }
    if (!payload.notice_confirm) {
      alert("공지사항 확인을 선택해주세요.");
      return;
    }
    if (!payload.privacy_agree) {
      alert("개인정보 수집 및 이용 동의가 필요합니다.");
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (result.ok) {
        alert("신청이 완료되었습니다.");
        location.href = "../index.html";
      } else {
        alert("전송 중 오류가 발생했습니다: " + (result.message || result.detail || ""));
      }
    } catch (error) {
      console.error(error);
      alert("전송 중 오류가 발생했습니다.");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  bindPageMoveEvents();
  bindChoiceEvents();
  bindSubmitEvent();
  showPage(0);
});