<script setup>
import BookCard from "./BookCard.vue";

defineProps({
  items: {
    type: Array,
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
  <div class="book-grid">
    <BookCard
      v-for="item in items"
      :key="item.id"
      :item="item"
      :removable="removable"
      @delete="emit('delete', $event)"
    />
  </div>
</template>
