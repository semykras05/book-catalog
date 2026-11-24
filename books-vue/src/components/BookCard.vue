<script setup>
import { CATEGORY_LABELS } from "../data/books.js";

defineProps({
  item: {
    type: Object,
    required: true,
  },
  removable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["delete"]);
</script>

<template>
  <article class="book-card">
    <p class="card-category">
      {{ CATEGORY_LABELS[item.category] || item.category }}
    </p>
    <h3 class="card-title">{{ item.title }}</h3>
    <p v-if="item.author" class="card-author">{{ item.author }}</p>
    <p class="card-description">{{ item.description }}</p>
    <button
      v-if="removable"
      type="button"
      class="button button-secondary card-delete-button"
      @click="emit('delete', item.id)"
    >
      Видалити
    </button>
  </article>
</template>
