<script setup>
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
  removable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["delete"]);
const store = useBooksStore();
</script>

<template>
  <article class="book-card">
    <p class="card-category">
      {{ CATEGORY_LABELS[item.category] || item.category }}
    </p>
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
          store.isFavorite(item.id) ? "Прибрати з обраного" : "До обраного"
        }}
      </button>

      <button
        v-if="removable"
        type="button"
        class="button button-secondary"
        @click="emit('delete', item.id)"
      >
        Видалити
      </button>
    </div>
  </article>
</template>
