<script setup>
import { computed, ref } from "vue";
import { books, CATEGORY_OPTIONS } from "./data/books.js";
import BookList from "./components/BookList.vue";
import UserBookForm from "./components/UserBookForm.vue";

const query = ref("");
const category = ref("all");
const userItems = ref([]);
const userStatus = ref("");

const filteredBooks = computed(() => {
  const text = query.value.trim().toLowerCase();
  return books.filter(
    (item) =>
      (category.value === "all" || item.category === category.value) &&
      `${item.title} ${item.author ?? ""} ${item.description}`
        .toLowerCase()
        .includes(text)
  );
});

function resetFilters() {
  query.value = "";
  category.value = "all";
}

function addUserItem(item) {
  userItems.value = [...userItems.value, item];
  userStatus.value = "Нотатку додано до списку.";
}

function deleteUserItem(id) {
  userItems.value = userItems.value.filter((item) => item.id !== id);
  userStatus.value = "Нотатку видалено зі списку.";
}
</script>

<template>
  <header class="site-header">
    <div class="container">
      <h1 class="site-title">BookShelf — Каталог книг</h1>
      <p class="site-subtitle">
        Вебзастосунок на Vue 3 для пошуку видань та ведення власних книжкових
        нотаток.
      </p>
      <nav aria-label="Основна навігація">
        <ul class="nav-list">
          <li><a class="nav-link" href="#catalog">Каталог</a></li>
          <li><a class="nav-link" href="#user-notes">Мої нотатки</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main class="page-main">
    <div class="container">
      <section id="catalog" class="content-section">
        <h2 class="section-title">Каталог та популярні видання</h2>
        <p class="section-text">
          Шукайте книги за назвою, автором або описом та фільтруйте за
          категорією.
        </p>

        <div class="catalog-controls">
          <div class="control-group">
            <label class="control-label" for="book-search">Пошук</label>
            <input
              id="book-search"
              v-model.trim="query"
              class="control-input"
              type="search"
              placeholder="Введіть назву, автора або опис"
            />
          </div>

          <div class="control-group">
            <label class="control-label" for="category-filter">Категорія</label>
            <select
              id="category-filter"
              v-model="category"
              class="control-input"
            >
              <option value="all">Усі</option>
              <option
                v-for="option in CATEGORY_OPTIONS"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>

          <button
            type="button"
            class="button button-secondary"
            @click="resetFilters"
          >
            Скинути
          </button>
        </div>

        <p class="results-count" aria-live="polite">
          Знайдено: {{ filteredBooks.length }}
        </p>

        <BookList v-if="filteredBooks.length > 0" :items="filteredBooks" />
        <p v-else class="empty-message">Нічого не знайдено.</p>
      </section>

      <section id="user-notes" class="content-section">
        <h2 class="section-title">Мої нотатки про книги</h2>
        <p class="section-text">
          Додавайте власні книжкові нотатки та видаляйте непотрібні записи.
        </p>

        <UserBookForm @add="addUserItem" />

        <p v-if="userStatus" class="user-message" role="status">
          {{ userStatus }}
        </p>

        <h3 class="subsection-title">
          Список власних нотаток ({{ userItems.length }})
        </h3>

        <BookList
          v-if="userItems.length > 0"
          :items="userItems"
          removable
          @delete="deleteUserItem"
        />
        <p v-else class="empty-message">Власних записів поки немає.</p>
      </section>
    </div>
  </main>

  <footer class="site-footer">
    <div class="container">
      <p class="footer-text">
        &copy; 2026 BookShelf — Навчальний проєкт на Vue 3 та Vite.
      </p>
    </div>
  </footer>
</template>
