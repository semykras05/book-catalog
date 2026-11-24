<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <section class="content-section">
    <h2 class="section-title">Сторінку не знайдено (404)</h2>
    <p class="section-text">
      Запитувана адреса не існує в каталозі BookShelf. Перевірте посилання або
      поверніться до списку книг.
    </p>
    <RouterLink class="button" :to="{ name: 'home' }">
      Повернутися до каталогу
    </RouterLink>
  </section>
</template>
