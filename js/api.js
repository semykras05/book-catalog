const ALLOWED_CATEGORIES = new Set(["fiction", "scifi", "it", "nonfiction"]);

function isSafeLocalImagePath(path) {
  return (
    typeof path === "string" &&
    path.startsWith("images/") &&
    !path.includes("..") &&
    !/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(path)
  );
}

function validateItems(data) {
  if (!Array.isArray(data)) {
    throw new Error("Очікується масив об’єктів");
  }

  const seenIds = new Set();

  for (const item of data) {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new Error("Кожний елемент каталогу має бути об’єктом");
    }

    if (!Number.isInteger(item.id) || item.id <= 0) {
      throw new Error("Поле id має бути додатним цілим числом");
    }

    if (seenIds.has(item.id)) {
      throw new Error(`Знайдено дублікат id: ${item.id}`);
    }
    seenIds.add(item.id);

    const textFields = ["title", "author", "category", "description", "image"];
    for (const field of textFields) {
      if (typeof item[field] !== "string" || item[field].trim() === "") {
        throw new Error(`Поле "${field}" має бути непорожнім рядком`);
      }
    }

    if (!ALLOWED_CATEGORIES.has(item.category)) {
      throw new Error(`Неприпустима категорія: ${item.category}`);
    }

    if (!isSafeLocalImagePath(item.image)) {
      throw new Error(`Неприпустимий шлях до зображення: ${item.image}`);
    }
  }
}

export async function loadItems() {
  const url = new URL("../data/items.json", import.meta.url);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();
  validateItems(data);

  return data;
}
