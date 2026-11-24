<script setup>
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { CATEGORY_LABELS } from "../data/books.js";
import { useBooksStore } from "../stores/books.js";

const route = useRoute();
const store = useBooksStore();

const book = computed(() =>
  store.books.find((entry) => String(entry.id) === String(route.params.id))
);
</script>

<template>
  <article v-if="book" class="content-section detail-card">
    <p class="card-category">
      {{ CATEGORY_LABELS[book.category] || book.category }}
    </p>
    <h2 class="detail-title">{{ book.title }}</h2>
    <p v-if="book.author" class="detail-author">Автор: {{ book.author }}</p>
    <p class="detail-meta">Ідентифікатор видання: #{{ book.id }}</p>
    <p class="detail-description">{{ book.description }}</p>

    <div class="detail-actions">
      <button
        type="button"
        class="button"
        :class="{ 'is-favorite': store.isFavorite(book.id) }"
        :aria-pressed="store.isFavorite(book.id)"
        @click="store.toggleFavorite(book.id)"
      >
        {{
          store.isFavorite(book.id) ? "Прибрати з обраного" : "До обраного"
        }}
      </button>

      <RouterLink class="button button-secondary" :to="{ name: 'home' }">
        Повернутися до каталогу
      </RouterLink>
    </div>
  </article>

  <section v-else class="content-section">
    <h2 class="section-title">Книгу не знайдено</h2>
    <p class="section-text">
      Видання з ідентифікатором «{{ route.params.id }}» відсутнє в каталозі
      BookShelf.
    </p>
    <RouterLink class="button" :to="{ name: 'home' }">
      Повернутися до каталогу
    </RouterLink>
  </section>
</template>
