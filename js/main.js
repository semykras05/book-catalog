import { loadItems } from "./api.js";
import { filterItems, renderItems } from "./catalog.js";
import { debounce } from "./utils.js";
import { initUserItems } from "./userItems.js";


// --- Каталог книг (Лабораторна №7) ---
const searchInput = document.querySelector("#book-search");
const categorySelect = document.querySelector("#category-filter");
const grid = document.querySelector("#book-grid");
const resultsCount = document.querySelector("#results-count");
const emptyMessage = document.querySelector("#empty-message");
const statusMessage = document.querySelector("#load-status");
const errorMessage = document.querySelector("#load-error");
const retryButton = document.querySelector("#retry-load");

let items = [];

function updateView() {
  const filtered = filterItems(
    items,
    searchInput.value,
    categorySelect.value
  );
  renderItems(filtered, grid, resultsCount, emptyMessage);
}

async function init() {
  searchInput.disabled = true;
  categorySelect.disabled = true;
  retryButton.disabled = true;
  retryButton.hidden = true;
  errorMessage.hidden = true;
  statusMessage.textContent = "Завантаження…";
  grid.setAttribute("aria-busy", "true");
  grid.replaceChildren();
  resultsCount.textContent = "";
  emptyMessage.hidden = true;

  let loaded = false;

  try {
    items = await loadItems();
    updateView();
    loaded = true;
  } catch (error) {
    items = [];
    errorMessage.textContent =
      "Не вдалося завантажити каталог. Спробуйте ще раз.";
    errorMessage.hidden = false;
    retryButton.hidden = false;
    console.error(error);
  } finally {
    statusMessage.textContent = "";
    grid.setAttribute("aria-busy", "false");
    searchInput.disabled = !loaded;
    categorySelect.disabled = !loaded;
    retryButton.disabled = false;
  }
}

if (
  searchInput &&
  categorySelect &&
  grid &&
  resultsCount &&
  emptyMessage &&
  statusMessage &&
  errorMessage &&
  retryButton
) {
  const debouncedUpdateView = debounce(updateView, 300);

  searchInput.addEventListener("input", debouncedUpdateView);
  categorySelect.addEventListener("change", updateView);
  retryButton.addEventListener("click", init);

  init();
}

// --- Збережені взаємодії з Лабораторної №5 ---
const toggleButton = document.querySelector(".details-toggle");
const detailsBlock = document.querySelector("#extra-details");

if (toggleButton && detailsBlock) {
  toggleButton.addEventListener("click", () => {
    const isHidden = detailsBlock.classList.toggle("is-hidden");
    toggleButton.textContent = isHidden ? "Показати більше" : "Приховати";
    toggleButton.setAttribute("aria-expanded", String(!isHidden));
  });
}

const decrementButton = document.querySelector("#counter-decrement");
const incrementButton = document.querySelector("#counter-increment");
const counterValue = document.querySelector("#counter-value");
const counterStatus = document.querySelector("#counter-status");

if (decrementButton && incrementButton && counterValue && counterStatus) {
  const MIN_GOAL = 1;
  const MAX_GOAL = 12;
  let currentGoal = 3;

  const updateCounterUI = () => {
    counterValue.textContent = String(currentGoal);
    counterStatus.textContent = `Поточна ціль: ${currentGoal} кн. на місяць.`;
    decrementButton.classList.toggle("is-disabled", currentGoal <= MIN_GOAL);
    incrementButton.classList.toggle("is-disabled", currentGoal >= MAX_GOAL);
  };

  decrementButton.addEventListener("click", () => {
    if (currentGoal > MIN_GOAL) {
      currentGoal -= 1;
      updateCounterUI();
    }
  });

  incrementButton.addEventListener("click", () => {
    if (currentGoal < MAX_GOAL) {
      currentGoal += 1;
      updateCounterUI();
    }
  });

  updateCounterUI();
}
// --- Власні нотатки користувача (Лабораторна №8) ---
initUserItems();

