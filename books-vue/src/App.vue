<script setup>
import { RouterLink, RouterView } from "vue-router";
import { useBooksStore } from "./stores/books.js";

const store = useBooksStore();
</script>

<template>
  <header class="site-header">
    <div class="container">
      <div class="header-top">
        <div>
          <h1 class="site-title">BookShelf — Каталог книг</h1>
          <p class="site-subtitle">
            Вебзастосунок на Vue 3 із Vue Router та Pinia для перегляду каталогу
            й обраних видань.
          </p>
        </div>

        <p class="favorites-badge" aria-live="polite">
          Обрані книги: <strong>{{ store.favoriteCount }}</strong>
        </p>
      </div>

      <nav aria-label="Основна навігація">
        <ul class="nav-list">
          <li>
            <RouterLink class="nav-link" :to="{ name: 'home' }">
              Каталог
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>

  <main class="page-main">
    <div class="container">
      <RouterView />
    </div>
  </main>

  <footer class="site-footer">
    <div class="container">
      <p class="footer-text">
        &copy; 2026 BookShelf — Навчальний проєкт на Vue 3, Vue Router та Pinia.
      </p>
    </div>
  </footer>
</template>
