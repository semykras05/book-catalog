const CATEGORY_LABELS = {
  fiction: "Художня література",
  scifi: "Фантастика та фентезі",
  it: "Програмування та ІТ",
  nonfiction: "Саморозвиток та історія",
};

export function filterItems(items, query, category) {
  const text = query.trim().toLowerCase();

  return items.filter((item) => {
    const searchable = `${item.title} ${item.author} ${item.description}`.toLowerCase();
    const matchesText = searchable.includes(text);
    const matchesCategory = category === "all" || item.category === category;

    return matchesText && matchesCategory;
  });
}

function createCard(item) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.id = String(item.id);

  const image = document.createElement("img");
  image.className = "card-image";
  image.src = item.image;
  image.alt = `Обкладинка книги «${item.title}», автор — ${item.author}`;

  const category = document.createElement("p");
  category.className = "card-category";
  category.textContent = CATEGORY_LABELS[item.category] || item.category;

  const title = document.createElement("h3");
  title.className = "card-title";
  title.textContent = item.title;

  const author = document.createElement("p");
  author.className = "card-author";
  author.textContent = item.author;

  const description = document.createElement("p");
  description.className = "card-description";
  description.textContent = item.description;

  card.append(image, category, title, author, description);
  return card;
}

export function renderItems(items, grid, count, empty) {
  const fragment = document.createDocumentFragment();
  items.forEach((item) => fragment.append(createCard(item)));

  grid.replaceChildren(fragment);
  count.textContent = `Знайдено: ${items.length}`;
  empty.hidden = items.length !== 0;
}
