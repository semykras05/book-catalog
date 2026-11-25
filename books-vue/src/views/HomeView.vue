<script setup>
import { computed, onMounted, ref } from "vue";
import { useBooksStore } from "../stores/books.js";
import BookList from "../components/BookList.vue";
import UserBookForm from "../components/UserBookForm.vue";

const store = useBooksStore();

const query = ref("");
const category = ref("all");
const onlyFavorites = ref(false);
const userStatus = ref("");

onMounted(() => {
  store.loadBooks();
});

const filteredBooks = computed(() => {
  const text = query.value.trim().toLowerCase();
  return store.books.filter((item) => {
    const matchesCategory =
      category.value === "all" || item.category === category.value;
    const matchesFavorite =
      !onlyFavorites.value || store.isFavorite(item.id);
    const matchesQuery =
      !text ||
      `${item.title} ${item.author ?? ""} ${item.description}`
        .toLowerCase()
        .includes(text);

    return matchesCategory && matchesFavorite && matchesQuery;
  });
});

const hasActiveFilters = computed(
  () => query.value !== "" || category.value !== "all" || onlyFavorites.value
);

function resetFilters() {
  query.value = "";
  category.value = "all";
  onlyFavorites.value = false;
}

function handleAddUserItem(item) {
  store.addUserItem(item);
  userStatus.value = "Нотатку додано до особистого списку.";
}

function handleDeleteUserItem(id) {
  store.deleteUserItem(id);
  userStatus.value = "Нотатку видалено.";
}
</script>

<template>
  <section class="hero-banner">
    <div class="hero-content">
      <p class="hero-kicker">Онлайн-каталог Open Library</p>
      <h2 class="hero-title">Відкрийте найкращі книги світової літератури</h2>
      <p class="hero-text">
        Переглядайте актуальні видання, шукайте за автором чи жанром,
        зберігайте улюблені книги до обраного та ведіть власні читацькі нотатки.
      </p>
    </div>

    <div class="hero-stats" aria-label="Статистика каталогу">
      <div class="stat-tile">
        <span class="stat-value">{{ store.books.length }}</span>
        <span class="stat-label">У каталозі</span>
      </div>
      <div class="stat-tile">
        <span class="stat-value">{{ store.favoriteCount }}</span>
        <span class="stat-label">В обраному</span>
      </div>
      <div class="stat-tile">
        <span class="stat-value">{{ store.userItems.length }}</span>
        <span class="stat-label">Нотаток</span>
      </div>
    </div>
  </section>

  <section id="catalog" class="content-section">
    <div class="section-header">
      <div>
        <h2 class="section-title">Каталог видань</h2>
        <p class="section-text">
          Дані завантажуються в реальному часі з відкритого каталогу Open Library.
        </p>
      </div>

      <button
        type="button"
        class="button button-secondary"
        :disabled="store.loading"
        @click="store.retry()"
      >
        ↻ Оновити каталог
      </button>
    </div>

    <div class="catalog-controls">
      <div class="control-group">
        <label class="control-label" for="book-search">Пошук</label>
        <input
          id="book-search"
          v-model.trim="query"
          class="control-input"
          type="search"
          aria-label="Пошук"
          placeholder="Назва книги, автор або тема…"
        />
      </div>

      <div class="control-group">
        <label class="control-label" for="category-filter">Категорія</label>
        <select id="category-filter" v-model="category" class="control-input">
          <option value="all">Усі категорії</option>
          <option
            v-for="option in store.categories"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <div class="control-actions">
        <button
          type="button"
          class="button button-secondary"
          :class="{ 'is-favorite': onlyFavorites }"
          :aria-pressed="onlyFavorites"
          @click="onlyFavorites = !onlyFavorites"
        >
          {{ onlyFavorites ? "♥ Обрані" : "♡ Лише обрані" }}
        </button>

        <button
          v-if="hasActiveFilters"
          type="button"
          class="button button-ghost"
          @click="resetFilters"
        >
          Скинути
        </button>
      </div>
    </div>

    <!-- Стан 1: Loading -->
    <div
      v-if="store.loading"
      class="loading-block"
      role="status"
      aria-live="polite"
    >
      <p class="loading-caption">Завантаження каталогу книг із Open Library…</p>
      <div class="book-grid" aria-hidden="true">
        <div v-for="n in 6" :key="n" class="skeleton-card">
          <div class="skeleton-cover"></div>
          <div class="skeleton-lines">
            <div class="skeleton-line short"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line medium"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Стан 2: Error -->
    <section
      v-else-if="store.error"
      class="state-box state-error"
      role="alert"
    >
      <h3 class="state-title">Помилка завантаження даних</h3>
      <p class="state-text">{{ store.error }}</p>
      <button type="button" class="button" @click="store.retry()">
        Спробувати ще раз
      </button>
    </section>

    <!-- Стан 3: Empty -->
    <section
      v-else-if="filteredBooks.length === 0"
      class="state-box state-empty"
      role="status"
    >
      <h3 class="state-title">Нічого не знайдено</h3>
      <p class="state-text">
        {{
          store.books.length === 0
            ? "Зовнішній сервіс повернув порожній список книг. Спробуйте повторити запит."
            : "За вашим запитом або обраними фільтрами книг не знайдено."
        }}
      </p>
      <button
        v-if="hasActiveFilters"
        type="button"
        class="button"
        @click="resetFilters"
      >
        Показати всі книги
      </button>
      <button
        v-else
        type="button"
        class="button"
        @click="store.retry()"
      >
        Повторити запит
      </button>
    </section>

    <!-- Стан 4: Success -->
    <template v-else>
      <p class="results-count" aria-live="polite">
        Показано видань: <strong>{{ filteredBooks.length }}</strong> із
        {{ store.books.length }}
      </p>
      <BookList :items="filteredBooks" />
    </template>
  </section>

  <section id="user-notes" class="content-section">
    <h2 class="section-title">Мої читацькі нотатки</h2>
    <p class="section-text">
      Зберігайте власні враження про прочитані книги або додавайте видання до
      списку бажань.
    </p>

    <UserBookForm @add="handleAddUserItem" />

    <p v-if="userStatus" class="user-message" role="status">
      {{ userStatus }}
    </p>

    <h3 class="subsection-title">
      Збережені нотатки ({{ store.userItems.length }})
    </h3>

    <BookList
      v-if="store.userItems.length > 0"
      :items="store.userItems"
      :show-details="false"
      :show-favorite="false"
      :show-cover="false"
      removable
      @delete="handleDeleteUserItem"
    />
    <p v-else class="empty-message">Власних нотаток поки немає.</p>
  </section>
</template>
