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

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastPeriod = cut.lastIndexOf(".");
  if (lastPeriod > maxLength * 0.45) {
    return cut.slice(0, lastPeriod + 1);
  }
  return `${cut.trim()}…`;
}

function cleanWorkDescription(rawDesc) {
  const text =
    typeof rawDesc === "string"
      ? rawDesc
      : rawDesc && typeof rawDesc.value === "string"
        ? rawDesc.value
        : "";

  if (!text) return "";

  const cleaned = text
    .split(/\r?\n\s*---|\r?\n\s*\[\d+\]:/)[0]
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\[\d+\]/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

  return truncateText(cleaned, 340);
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

  const firstSentence = Array.isArray(raw.first_sentence)
    ? String(raw.first_sentence[0] || "").trim()
    : typeof raw.first_sentence === "string"
      ? raw.first_sentence.trim()
      : "";

  let description = "";
  if (firstSentence) {
    description = `«${truncateText(firstSentence, 150)}»`;
  } else if (subjects.length > 0) {
    description = `Твір у категорії «${categoryLabel}», що розкриває теми: ${subjects.slice(0, 3).join(", ")}.`;
  } else {
    description = `Відоме видання у категорії «${categoryLabel}» від ${authors}.`;
  }

  return {
    id: cleanId,
    title: String(raw.title || "Без назви").trim(),
    author: authors,
    category,
    categoryLabel,
    description,
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

export async function fetchBookDescription(id) {
  const response = await fetch(
    `https://openlibrary.org/works/${encodeURIComponent(id)}.json`
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const payload = await response.json();
  return cleanWorkDescription(payload.description);
}
