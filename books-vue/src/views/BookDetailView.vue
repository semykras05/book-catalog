<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useBooksStore } from "../stores/books.js";

const route = useRoute();
const store = useBooksStore();
const coverFailed = ref(false);

onMounted(() => {
  store.loadBooks();
});

const book = computed(() =>
  store.books.find((entry) => String(entry.id) === String(route.params.id))
);

watch(
  book,
  (currentBook) => {
    if (currentBook) {
      coverFailed.value = false;
      store.loadBookDescription(currentBook.id);
    }
  },
  { immediate: true }
);

const synopsis = computed(() => {
  if (!book.value) return "";
  return store.descriptions[String(book.value.id)] || book.value.description;
});
</script>

<template>
  <!-- Завантаження при прямому переході за URL -->
  <section
    v-if="store.loading || (!store.hasLoaded && !store.error)"
    class="content-section state-box"
    role="status"
    aria-live="polite"
  >
    <p class="loading-caption">Завантаження інформації про книгу…</p>
  </section>

  <!-- Помилка запиту -->
  <section
    v-else-if="store.error"
    class="content-section state-box state-error"
    role="alert"
  >
    <h2 class="state-title">Не вдалося завантажити сторінку книги</h2>
    <p class="state-text">{{ store.error }}</p>
    <div class="detail-actions">
      <button type="button" class="button" @click="store.retry()">
        Спробувати ще раз
      </button>
      <RouterLink class="button button-secondary" :to="{ name: 'home' }">
        Повернутися до каталогу
      </RouterLink>
    </div>
  </section>

  <!-- Успішно знайдена книга -->
  <article v-else-if="book" class="content-section detail-layout">
    <div class="detail-cover-col">
      <img
        v-if="book.coverLarge && !coverFailed"
        :src="book.coverLarge"
        :alt="`Обкладинка книги ${book.title}`"
        class="detail-cover"
        @error="coverFailed = true"
      />
      <div v-else class="detail-cover-placeholder" aria-hidden="true">
        <span class="placeholder-brand">BookShelf</span>
        <strong class="placeholder-title">{{ book.title }}</strong>
      </div>
    </div>

    <div class="detail-info-col">
      <div class="card-meta-row">
        <span class="card-category">{{ book.categoryLabel }}</span>
        <span v-if="book.year" class="detail-badge">{{ book.year }} р.</span>
        <span v-if="book.rating" class="detail-badge detail-badge-gold">
          ★ {{ book.rating }} / 5
        </span>
      </div>

      <h2 class="detail-title">{{ book.title }}</h2>
      <p class="detail-author">Автор: {{ book.author }}</p>
      <p class="detail-meta">
        Код видання: <code>{{ book.id }}</code> · Видань у каталозі:
        {{ book.editions }}
      </p>

      <p
        v-if="store.descriptionLoading && !(String(book.id) in store.descriptions)"
        class="detail-description"
      >
        Завантаження короткого опису сюжету…
      </p>
      <p v-else class="detail-description">{{ synopsis }}</p>

      <div v-if="book.subjects && book.subjects.length" class="tag-list">
        <span v-for="tag in book.subjects" :key="tag" class="tag-chip">
          {{ tag }}
        </span>
      </div>

      <div class="detail-actions">
        <button
          type="button"
          class="button"
          :class="{ 'is-favorite': store.isFavorite(book.id) }"
          :aria-pressed="store.isFavorite(book.id)"
          @click="store.toggleFavorite(book.id)"
        >
          {{
            store.isFavorite(book.id)
              ? "♥ Прибрати з обраного"
              : "♡ Додати до обраного"
          }}
        </button>

        <RouterLink class="button button-ghost" :to="{ name: 'home' }">
          ← Назад до каталогу
        </RouterLink>
      </div>
    </div>
  </article>

  <!-- Невідомий id показується ЛИШЕ після успішного завантаження -->
  <section v-else class="content-section state-box">
    <h2 class="state-title">Книгу не знайдено</h2>
    <p class="state-text">
      Видання з ідентифікатором «{{ route.params.id }}» відсутнє у поточній
      добірці BookShelf.
    </p>
    <RouterLink class="button" :to="{ name: 'home' }">
      Повернутися до каталогу
    </RouterLink>
  </section>
</template>
