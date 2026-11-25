<script setup>
import BookCard from "./BookCard.vue";

defineProps({
  items: {
    type: Array,
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
</script>

<template>
  <div class="book-grid">
    <BookCard
      v-for="item in items"
      :key="item.id"
      :item="item"
      :show-details="showDetails"
      :show-favorite="showFavorite"
      :removable="removable"
      @delete="emit('delete', $event)"
    />
  </div>
</template>
