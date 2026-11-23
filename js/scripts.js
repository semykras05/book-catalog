const categoryLabels = {
  fiction: "Художня література",
  scifi: "Фантастика та фентезі",
  it: "Програмування та ІТ",
  nonfiction: "Саморозвиток та історія",
};

const books = [
  {
    id: 1,
    title: "1984",
    author: "Джордж Орвелл",
    category: "fiction",
    description:
      "Класичний роман-антиутопія про тоталітарне суспільство, контроль над інформацією та боротьбу за свободу думки.",
    image: "images/book-1984.jpg",
  },
  {
    id: 2,
    title: "Кобзар",
    author: "Тарас Шевченко",
    category: "fiction",
    description:
      "Збірка поетичних творів, що стала фундаментом нової української літератури та національної культури.",
    image: "images/book-kobzar.jpg",
  },
  {
    id: 3,
    title: "Дюна",
    author: "Френк Герберт",
    category: "scifi",
    description:
      "Культова науково-фантастична сага про пустельну планету Арракіс, боротьбу великих домів та пошук власного призначення.",
    image: "images/book-dune.jpg",
  },
  {
    id: 4,
    title: "Фундація",
    author: "Айзек Азімов",
    category: "scifi",
    description:
      "Історія про вченого-психоісторика, який передбачає занепад Галактичної Імперії та створює план збереження знань.",
    image: "images/book-dune.jpg",
  },
  {
    id: 5,
    title: "Чистий код",
    author: "Роберт Мартін",
    category: "it",
    description:
      "Практичний посібник зі створення зрозумілого, підтримуваного програмного коду та принципів рефакторингу.",
    image: "images/book-1984.jpg",
  },
  {
    id: 6,
    title: "Грокаємо алгоритми",
    author: "Адітья Бхаргава",
    category: "it",
    description:
      "Ілюстрований вступ до алгоритмів і структур даних із простими поясненнями пошуку, сортування та графів.",
    image: "images/book-kobzar.jpg",
  },
  {
    id: 7,
    title: "Атомні звички",
    author: "Джеймс Клір",
    category: "nonfiction",
    description:
      "Покрокова методика формування корисних щоденних звичок і позбавлення від шкідливих через невеликі системні зміни.",
    image: "images/book-1984.jpg",
  },
  {
    id: 8,
    title: "Sapiens: Людина розумна",
    author: "Ювал Ной Харарі",
    category: "nonfiction",
    description:
      "Масштабний огляд історії людства від первісних племен до сучасної наукової та технологічної революції.",
    image: "images/book-kobzar.jpg",
  },
];

const bookGrid = document.querySelector("#book-grid");
const searchInput = document.querySelector("#book-search");
const categorySelect = document.querySelector("#category-filter");
const resultsCount = document.querySelector("#results-count");
const emptyMessage = document.querySelector("#empty-message");

function createBookCard(book) {
  const categoryName = categoryLabels[book.category] || book.category;

  return `
    <article class="card" data-id="${book.id}">
      <img
        class="card-image"
        src="${book.image}"
        alt="Обкладинка книги ${book.title}"
      />
      <p class="card-category">${categoryName}</p>
      <h3 class="card-title">${book.title}</h3>
      <p class="card-author">${book.author}</p>
      <p class="card-description">${book.description}</p>
    </article>
  `;
}

function renderBooks(booksToRender) {
  bookGrid.innerHTML = booksToRender.map(createBookCard).join("");
  resultsCount.textContent = `Знайдено: ${booksToRender.length}`;
  emptyMessage.hidden = booksToRender.length !== 0;
}

if (bookGrid && resultsCount && emptyMessage) {
  renderBooks(books);
}