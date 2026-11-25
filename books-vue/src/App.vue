<script setup>
import { RouterLink, RouterView } from "vue-router";
import { useBooksStore } from "./stores/books.js";

const store = useBooksStore();
</script>

<template>
  <div class="app-shell">
    <header class="site-header">
      <div class="container header-inner">
        <RouterLink class="brand-link" :to="{ name: 'home' }">
          <span class="brand-icon" aria-hidden="true">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
          </span>
          <span>
            <strong class="site-title">BookShelf</strong>
            <span class="site-subtitle">Сучасний каталог книг</span>
          </span>
        </RouterLink>

        <nav class="header-nav" aria-label="Основна навігація">
          <RouterLink class="nav-link" :to="{ name: 'home' }">
            Каталог
          </RouterLink>
          <p class="favorites-badge" aria-live="polite">
            <span aria-hidden="true">♥</span>
            Обране: <strong>{{ store.favoriteCount }}</strong>
          </p>
        </nav>
      </div>
    </header>

    <main class="page-main">
      <div class="container">
        <RouterView />
      </div>
    </main>

    <footer class="site-footer">
      <div class="container footer-inner">
        <p class="footer-text">
          &copy; 2026 BookShelf — Каталог книг та персональна добірка читання.
        </p>
        <p class="footer-source">
          Дані каталогу: Open Library Search API
        </p>
      </div>
    </footer>
  </div>
</template>
