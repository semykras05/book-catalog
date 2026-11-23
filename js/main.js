// 1. Показати більше / Приховати у блоці «Про сервіс»
const toggleButton = document.querySelector(".details-toggle");
const detailsBlock = document.querySelector("#extra-details");

if (toggleButton && detailsBlock) {
  toggleButton.addEventListener("click", () => {
    const isHidden = detailsBlock.classList.toggle("is-hidden");
    toggleButton.textContent = isHidden ? "Показати більше" : "Приховати";
    toggleButton.setAttribute("aria-expanded", String(!isHidden));
  });
}

// 2. Додати в обране / В обраному на картці книги «1984»
const favoriteButton = document.querySelector(".favorite-button");
const featuredCard = document.querySelector("#featured-book-card");

if (favoriteButton && featuredCard) {
  favoriteButton.addEventListener("click", () => {
    const isActive = favoriteButton.classList.toggle("is-active");
    featuredCard.classList.toggle("is-active", isActive);
    favoriteButton.textContent = isActive ? "В обраному" : "Додати в обране";
    favoriteButton.setAttribute("aria-pressed", String(isActive));
  });
}

// 3. Лічильник місячної цілі читання (межі від 1 до 12)
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

    const isMin = currentGoal <= MIN_GOAL;
    const isMax = currentGoal >= MAX_GOAL;

    decrementButton.classList.toggle("is-disabled", isMin);
    incrementButton.classList.toggle("is-disabled", isMax);
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
