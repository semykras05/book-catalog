import { API_URL } from "../config/api.js";

const CATEGORY_RULES = [
  {
    value: "fantasy",
    label: "Фантастика та фентезі",
    keywords: ["fantasy", "science fiction", "sci-fi", "magic", "dystopia"],
  },
  {
    value: "mystery",
    label: "Детектив і трилер",
    keywords: ["mystery", "detective", "thriller", "crime", "horror", "suspense"],
  },
  {
    value: "romance",
    label: "Романтика",
    keywords: ["romance", "love stories", "love"],
  },
  {
    value: "history",
    label: "Історія та пригоди",
    keywords: ["history", "historical", "adventure", "war", "biography"],
  },
  {
    value: "classic",
    label: "Світова класика",
    keywords: ["classic", "classics", "literature", "drama"],
  },
];

function detectCategory(subjects) {
  const joined = subjects.join(" ").toLowerCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((word) => joined.includes(word))) {
      return { value: rule.value, label: rule.label };
    }
  }
  return { value: "fiction", label: "Художня література" };
}

function normalizeBook(raw) {
  const cleanId = String(raw.key || "").replace(/^\/works\//, "").trim();
  const authors =
    Array.isArray(raw.author_name) && raw.author_name.length > 0
      ? raw.author_name.slice(0, 2).join(", ")
      : "Автор невідомий";

  const rawSubjects = Array.isArray(raw.subject) ? raw.subject : [];
  const subjects = rawSubjects
    .filter((entry) => typeof entry === "string" && entry.length <= 36)
    .slice(0, 5);

  const { value: category, label: categoryLabel } = detectCategory(rawSubjects);
  const year = raw.first_publish_year ? Number(raw.first_publish_year) : null;
  const editions = Number(raw.edition_count || 1);
  const rating =
    typeof raw.ratings_average === "number"
      ? Number(raw.ratings_average.toFixed(1))
      : null;

  const summaryParts = [];
  if (year) {
    summaryParts.push(`Перше видання — ${year} р.`);
  }
  summaryParts.push(`Доступно видань у базі: ${editions}.`);
  if (subjects.length > 0) {
    summaryParts.push(`Ключові теми: ${subjects.slice(0, 3).join(", ")}.`);
  }

  return {
    id: cleanId,
    title: String(raw.title || "Без назви").trim(),
    author: authors,
    category,
    categoryLabel,
    description: summaryParts.join(" "),
    year,
    editions,
    rating,
    subjects,
    cover: raw.cover_i
      ? `https://covers.openlibrary.org/b/id/${raw.cover_i}-M.jpg`
      : "",
    coverLarge: raw.cover_i
      ? `https://covers.openlibrary.org/b/id/${raw.cover_i}-L.jpg`
      : "",
    openLibraryUrl: raw.key ? `https://openlibrary.org${raw.key}` : "",
  };
}

export async function fetchBooks(url = API_URL) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const payload = await response.json();

  if (!payload || !Array.isArray(payload.docs)) {
    throw new Error("Некоректна структура відповіді API");
  }

  return payload.docs
    .filter((doc) => doc && doc.key && doc.title)
    .map(normalizeBook);
}
