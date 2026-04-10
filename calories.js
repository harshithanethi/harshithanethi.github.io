(function () {
  "use strict";

  const STORAGE_KEY = "fittrackr_calories";

  function getEntries() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function setEntries(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  function addEntry() {
    const foodInput = document.getElementById("foodName");
    const calInput = document.getElementById("calories");
    const food = foodInput.value.trim();
    const calories = parseInt(calInput.value, 10);
    if (!food || Number.isNaN(calories) || calories < 0) return;
    const entries = getEntries();
    entries.push({ id: Date.now(), food, calories });
    setEntries(entries);
    foodInput.value = "";
    calInput.value = "";
    render();
  }

  function deleteEntry(id) {
    setEntries(getEntries().filter((e) => e.id !== id));
    render();
  }

  function clearAll() {
    setEntries([]);
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
    const listEl = document.getElementById("calorieList");
    const totalEl = document.getElementById("totalCalories");
    const entries = getEntries();
    const total = entries.reduce((sum, e) => sum + (Number(e.calories) || 0), 0);

    if (totalEl) totalEl.textContent = String(total);

    if (!listEl) return;

    if (entries.length === 0) {
      listEl.innerHTML =
        '<li class="list-group-item ft-text-muted">No entries yet. Add food above.</li>';
      return;
    }

    listEl.innerHTML = entries
      .map(
        (e) =>
          '<li class="list-group-item ft-flex ft-align-items-center ft-justify-between ft-gap-3">' +
          '<div class="ft-flex ft-flex-column ft-sm-flex-row ft-sm-flex-wrap ft-sm-align-items-baseline ft-gap-1 ft-sm-gap-3 ft-min-w-0">' +
          '<span class="ft-fw-medium ft-text-truncate">' +
          escapeHtml(String(e.food)) +
          "</span>" +
          '<span class="ft-text-muted ft-small ft-text-nowrap">' +
          escapeHtml(String(e.calories)) +
          " kcal</span>" +
          "</div>" +
          '<button type="button" class="btn-icon-delete ft-flex-shrink-0" data-delete-id="' +
          e.id +
          '" aria-label="Delete entry">' +
          trashSvg() +
          "</button>" +
          "</li>"
      )
      .join("");

    listEl.querySelectorAll("[data-delete-id]").forEach((btn) => {
      btn.addEventListener("click", function () {
        const raw = this.getAttribute("data-delete-id");
        const id = Number(raw);
        if (!Number.isNaN(id)) deleteEntry(id);
      });
    });
  }

  window.addEntry = addEntry;
  window.deleteEntry = deleteEntry;
  window.clearAll = clearAll;
  window.render = render;

  document.addEventListener("DOMContentLoaded", function () {
    const addBtn = document.getElementById("addCalorieBtn");
    const form = document.getElementById("calorieForm");
    const clearBtn = document.getElementById("clearAllBtn");

    if (addBtn) addBtn.addEventListener("click", addEntry);
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        addEntry();
      });
    }
    if (clearBtn) clearBtn.addEventListener("click", clearAll);

    render();
  });
})();
