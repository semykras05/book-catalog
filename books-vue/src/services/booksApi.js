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

const SUBJECT_TRANSLATIONS = {
  fiction: "художня проза",
  fantasy: "фентезі",
  "science fiction": "наукова фантастика",
  romance: "романтика",
  "love stories": "історії кохання",
  love: "кохання",
  mystery: "детектив",
  thriller: "трилер",
  horror: "готика та жахи",
  classic: "класика",
  classics: "світова класика",
  adventure: "пригоди",
  history: "історія",
  historical: "історична проза",
  drama: "драма",
  magic: "магія",
  dystopia: "антиутопія",
  monsters: "містика",
  scientists: "наука",
  humor: "гумор",
  "young adult": "підліткова проза",
  children: "дитяча література",
  family: "сімейна сага",
  friendship: "дружба",
  war: "воєнна проза",
  "time travel": "подорожі в часі",
};

function detectCategory(subjects) {
  const joined = subjects.join(" ").toLowerCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((word) => joined.includes(word))) {
      return { value: rule.value, label: rule.label };
    }
  }
  return { value: "fiction", label: "Художня література" };
}

function translateSubjects(rawSubjects) {
  const result = [];
  for (const item of rawSubjects) {
    if (typeof item !== "string") continue;
    const lower = item.toLowerCase();
    for (const [en, uk] of Object.entries(SUBJECT_TRANSLATIONS)) {
      if (lower.includes(en) && !result.includes(uk)) {
        result.push(uk);
      }
    }
    if (result.length >= 4) break;
  }
  return result.length > 0 ? result : ["художня проза", "світова література"];
}

function buildUkrainianDescription(categoryLabel, author, subjects, year) {
  const topics = subjects.slice(0, 3).join(", ");
  const period = year
    ? year < 1950
      ? "Визнаний твір світової літературної спадщини"
      : "Популярне видання сучасної літератури"
    : "Відомий твір";

  return `${period} у жанрі «${categoryLabel}» від ${author}. Ключові мотиви твору: ${topics}.`;
}

function normalizeBook(raw) {
  const cleanId = String(raw.key || "").replace(/^\/works\//, "").trim();
  const authors =
    Array.isArray(raw.author_name) && raw.author_name.length > 0
      ? raw.author_name.slice(0, 2).join(", ")
      : "Автор невідомий";

  const rawSubjects = Array.isArray(raw.subject) ? raw.subject : [];
  const { value: category, label: categoryLabel } = detectCategory(rawSubjects);
  const subjects = translateSubjects(rawSubjects);

  const year = raw.first_publish_year ? Number(raw.first_publish_year) : null;
  const editions = Number(raw.edition_count || 1);
  const rating =
    typeof raw.ratings_average === "number"
      ? Number(raw.ratings_average.toFixed(1))
      : null;

  const description = buildUkrainianDescription(
    categoryLabel,
    authors,
    subjects,
    year
  );

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

export async function fetchBookDescription() {
  return "";
}
