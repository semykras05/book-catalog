<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { CATEGORY_LABELS } from "../data/books.js";
import { useBooksStore } from "../stores/books.js";

defineProps({
  item: {
    type: Object,
    required: true,
  },
  showDetails: {
    type: Boolean,
    default: true,
  },
  showFavorite: {
    type: Boolean,
    default: true,
  },
  showCover: {
    type: Boolean,
    default: true,
  },
  removable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["delete"]);
const store = useBooksStore();
const coverFailed = ref(false);
</script>

<template>
  <article class="book-card" :class="{ 'book-card-compact': !showCover }">
    <div v-if="showCover" class="card-cover-wrap">
      <img
        v-if="item.cover && !coverFailed"
        :src="item.cover"
        :alt="`Обкладинка книги ${item.title}`"
        class="card-cover"
        loading="lazy"
        @error="coverFailed = true"
      />
      <div v-else class="card-cover-placeholder" aria-hidden="true">
        <span class="placeholder-brand">BookShelf</span>
        <strong class="placeholder-title">{{ item.title }}</strong>
      </div>

      <span v-if="item.rating" class="rating-pill" title="Середній рейтинг">
        ★ {{ item.rating }}
      </span>
    </div>

    <div class="card-body">
      <div class="card-meta-row">
        <span class="card-category">
          {{ item.categoryLabel || CATEGORY_LABELS[item.category] || item.category }}
        </span>
        <span v-if="item.year" class="card-year">{{ item.year }}</span>
      </div>

      <h3 class="card-title">{{ item.title }}</h3>
      <p v-if="item.author" class="card-author">{{ item.author }}</p>
      <p class="card-description">{{ item.description }}</p>

      <div class="card-actions">
        <RouterLink
          v-if="showDetails"
          class="button"
          :to="{ name: 'detail', params: { id: item.id } }"
        >
          Докладніше
        </RouterLink>

        <button
          v-if="showFavorite"
          type="button"
          class="button button-secondary"
          :class="{ 'is-favorite': store.isFavorite(item.id) }"
          :aria-pressed="store.isFavorite(item.id)"
          @click="store.toggleFavorite(item.id)"
        >
          {{
            store.isFavorite(item.id) ? "♥ В обраному" : "♡ До обраного"
          }}
        </button>

        <button
          v-if="removable"
          type="button"
          class="button button-danger-outline"
          @click="emit('delete', item.id)"
        >
          Видалити
        </button>
      </div>
    </div>
  </article>
</template>
