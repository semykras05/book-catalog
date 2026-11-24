const ALLOWED_CATEGORIES = ["fiction", "scifi", "it", "nonfiction"];

const CATEGORY_LABELS = {
  fiction: "Художня література",
  scifi: "Фантастика та фентезі",
  it: "Програмування та ІТ",
  nonfiction: "Саморозвиток та історія",
};

function createUserCard(item) {
  const card = document.createElement("article");
  card.className = "user-card";

  const category = document.createElement("p");
  category.className = "card-category";
  category.textContent = CATEGORY_LABELS[item.category] || item.category;

  const title = document.createElement("h4");
  title.className = "user-card-title";
  title.textContent = item.title;

  const description = document.createElement("p");
  description.className = "user-card-description";
  description.textContent = item.description;

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "button button-secondary user-delete-button";
  deleteButton.textContent = "Видалити";
  deleteButton.dataset.deleteId = item.id;

  card.append(category, title, description, deleteButton);
  return card;
}

export function initUserItems() {
  const form = document.querySelector("#user-item-form");
  const list = document.querySelector("#user-list");
  const message = document.querySelector("#user-message");
  const empty = document.querySelector("#user-empty");

  if (!form || !list || !message || !empty) {
    return;
  }

  let userItems = [];

  function renderUserItems() {
    const fragment = document.createDocumentFragment();
    userItems.forEach((item) => fragment.append(createUserCard(item)));
    list.replaceChildren(fragment);
    empty.hidden = userItems.length !== 0;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const title = String(data.get("title") ?? "").trim();
    const category = String(data.get("category") ?? "");
    const description = String(data.get("description") ?? "").trim();

    if (
      title.length < 3 ||
      title.length > 80 ||
      description.length < 10 ||
      description.length > 500 ||
      !ALLOWED_CATEGORIES.includes(category)
    ) {
      message.textContent = "Перевірте назву, категорію й опис.";
      form.elements.namedItem("title").focus();
      return;
    }

    const record = {
      id: `user-${crypto.randomUUID()}`,
      title,
      category,
      description,
    };

    userItems = [...userItems, record];
    renderUserItems();
    message.textContent = "Запис додано до списку.";
    form.reset();
    form.elements.namedItem("title").focus();
  });

  list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete-id]");
    if (!button || !list.contains(button)) return;

    const id = button.dataset.deleteId;
    userItems = userItems.filter((item) => item.id !== id);
    renderUserItems();
    message.textContent = "Запис видалено.";
    form.elements.namedItem("title").focus();
  });

  renderUserItems();
}
