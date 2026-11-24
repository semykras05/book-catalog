<script setup>
import { computed, ref } from "vue";
import { CATEGORY_OPTIONS } from "../data/books.js";
import { useBooksStore } from "../stores/books.js";
import BookList from "../components/BookList.vue";
import UserBookForm from "../components/UserBookForm.vue";

const store = useBooksStore();

const query = ref("");
const category = ref("all");
const userStatus = ref("");

const filteredBooks = computed(() => {
  const text = query.value.trim().toLowerCase();
  return store.books.filter(
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

function handleAddUserItem(item) {
  store.addUserItem(item);
  userStatus.value = "Нотатку додано до списку.";
}

function handleDeleteUserItem(id) {
  store.deleteUserItem(id);
  userStatus.value = "Нотатку видалено зі списку.";
}
</script>

<template>
  <section id="catalog" class="content-section">
    <h2 class="section-title">Каталог та популярні видання</h2>
    <p class="section-text">
      Шукайте книги за назвою, автором або описом, відкривайте детальну сторінку
      та додавайте видання до обраного.
    </p>

    <div class="catalog-controls">
      <div class="control-group">
        <label class="control-label" for="book-search">Пошук</label>
        <input
          id="book-search"
          v-model.trim="query"
          class="control-input"
          type="search"
          aria-label="Пошук"
          placeholder="Введіть назву, автора або опис"
        />
      </div>

      <div class="control-group">
        <label class="control-label" for="category-filter">Категорія</label>
        <select id="category-filter" v-model="category" class="control-input">
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

    <UserBookForm @add="handleAddUserItem" />

    <p v-if="userStatus" class="user-message" role="status">
      {{ userStatus }}
    </p>

    <h3 class="subsection-title">
      Список власних нотаток ({{ store.userItems.length }})
    </h3>

    <BookList
      v-if="store.userItems.length > 0"
      :items="store.userItems"
      :show-details="false"
      :show-favorite="false"
      removable
      @delete="handleDeleteUserItem"
    />
    <p v-else class="empty-message">Власних записів поки немає.</p>
  </section>
</template>
