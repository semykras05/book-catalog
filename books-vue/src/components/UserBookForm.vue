<script setup>
import { ref } from "vue";
import { CATEGORY_OPTIONS } from "../data/books.js";

const emit = defineEmits(["add"]);

const title = ref("");
const category = ref("");
const description = ref("");
const errorMessage = ref("");
const titleInput = ref(null);

function submitForm() {
  const cleanTitle = title.value.trim();
  const cleanDescription = description.value.trim();

  if (
    cleanTitle.length < 3 ||
    cleanTitle.length > 80 ||
    cleanDescription.length < 10 ||
    cleanDescription.length > 500 ||
    !category.value
  ) {
    errorMessage.value =
      "Перевірте назву (3–80 символів), категорію та опис (10–500 символів).";
    titleInput.value?.focus();
    return;
  }

  errorMessage.value = "";
  emit("add", {
    id: `user-${crypto.randomUUID()}`,
    title: cleanTitle,
    category: category.value,
    description: cleanDescription,
  });

  title.value = "";
  category.value = "";
  description.value = "";
  titleInput.value?.focus();
}
</script>

<template>
  <form class="request-form" novalidate @submit.prevent="submitForm">
    <div class="form-field">
      <label class="form-label" for="user-title">Назва книги</label>
      <input
        id="user-title"
        ref="titleInput"
        v-model="title"
        class="form-control"
        type="text"
        required
        minlength="3"
        maxlength="80"
        placeholder="Наприклад: Місто"
      />
    </div>

    <div class="form-field">
      <label class="form-label" for="user-category">Категорія</label>
      <select
        id="user-category"
        v-model="category"
        class="form-control"
        required
      >
        <option value="">Оберіть категорію</option>
        <option
          v-for="option in CATEGORY_OPTIONS"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </div>

    <div class="form-field">
      <label class="form-label" for="user-description">Опис або нотатка</label>
      <textarea
        id="user-description"
        v-model="description"
        class="form-control"
        rows="4"
        required
        minlength="10"
        maxlength="500"
        placeholder="Опишіть враження або причину додати книгу (від 10 символів)..."
      ></textarea>
    </div>

    <p v-if="errorMessage" class="form-error" role="alert">
      {{ errorMessage }}
    </p>

    <div class="form-actions">
      <button type="submit" class="button">Додати нотатку</button>
    </div>
  </form>
</template>
