(function () {
  "use strict";

  const STORAGE_KEY = "fittrackr_habits";

  function getHabits() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function setHabits(habits) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }

  function addHabit() {
    const input = document.getElementById("habitName");
    const name = input.value.trim();
    if (!name) return;
    const habits = getHabits();
    habits.push({ id: Date.now(), name, completed: false });
    setHabits(habits);
    input.value = "";
    render();
  }

  function toggleHabit(id) {
    const habits = getHabits().map((h) =>
      h.id === id ? { ...h, completed: !h.completed } : h
    );
    setHabits(habits);
    render();
  }

  function deleteHabit(id) {
    setHabits(getHabits().filter((h) => h.id !== id));
    render();
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function trashSvg() {
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">' +
      '<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>' +
      '<path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>' +
      "</svg>"
    );
  }

  function render() {
    const listEl = document.getElementById("habitList");
    const barEl = document.getElementById("habitProgress");
    const habits = getHabits();
    const total = habits.length;
    const completed = habits.filter((h) => h.completed).length;
    const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

    if (barEl) {
      barEl.style.width = pct + "%";
      barEl.setAttribute("aria-valuenow", String(pct));
      barEl.setAttribute("aria-valuemin", "0");
      barEl.setAttribute("aria-valuemax", "100");
    }

    const labelEl = document.getElementById("habitProgressLabel");
    if (labelEl) {
      labelEl.textContent =
        total === 0 ? "0 / 0" : completed + " / " + total + " completed";
    }

    if (!listEl) return;

    if (habits.length === 0) {
      listEl.innerHTML =
        '<li class="list-group-item ft-text-muted">No habits yet. Add one above.</li>';
      return;
    }

    listEl.innerHTML = habits
      .map((h) => {
        const rowClass =
          "list-group-item ft-flex ft-align-items-center ft-justify-between ft-gap-3" +
          (h.completed ? " habit-completed" : "");
        return (
          '<li class="' +
          rowClass +
          '">' +
          '<div class="form-check ft-m-0 ft-flex ft-align-items-center ft-gap-2 ft-flex-grow-1 ft-min-w-0">' +
          '<input class="form-check-input ft-flex-shrink-0 ft-mt-0" type="checkbox" id="habit-' +
          h.id +
          '" data-toggle-id="' +
          h.id +
          '"' +
          (h.completed ? " checked" : "") +
          " />" +
          '<label class="form-check-label ft-mb-0 ft-flex-grow-1" for="habit-' +
          h.id +
          '">' +
          escapeHtml(String(h.name)) +
          "</label>" +
          "</div>" +
          '<button type="button" class="btn-icon-delete ft-flex-shrink-0" data-delete-id="' +
          h.id +
          '" aria-label="Delete habit">' +
          trashSvg() +
          "</button>" +
          "</li>"
        );
      })
      .join("");

    listEl.querySelectorAll("[data-toggle-id]").forEach((cb) => {
      cb.addEventListener("change", function () {
        const raw = this.getAttribute("data-toggle-id");
        const id = Number(raw);
        if (!Number.isNaN(id)) toggleHabit(id);
      });
    });

    listEl.querySelectorAll("[data-delete-id]").forEach((btn) => {
      btn.addEventListener("click", function () {
        const raw = this.getAttribute("data-delete-id");
        const id = Number(raw);
        if (!Number.isNaN(id)) deleteHabit(id);
      });
    });
  }

  window.addHabit = addHabit;
  window.toggleHabit = toggleHabit;
  window.deleteHabit = deleteHabit;
  window.render = render;

  document.addEventListener("DOMContentLoaded", function () {
    const addBtn = document.getElementById("addHabitBtn");
    const form = document.getElementById("habitForm");

    if (addBtn) addBtn.addEventListener("click", addHabit);
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        addHabit();
      });
    }

    render();
  });
})();
