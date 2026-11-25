import { defineStore } from "pinia";
import { fetchBooks } from "../services/booksApi.js";

export const useBooksStore = defineStore("books", {
  state: () => ({
    books: [],
    favoriteIds: [],
    userItems: [],
    loading: false,
    error: "",
    hasLoaded: false,
  }),
  getters: {
    favoriteCount: (state) => state.favoriteIds.length,
    isFavorite: (state) => (id) =>
      state.favoriteIds.some((itemId) => String(itemId) === String(id)),
    categories: (state) => {
      const map = new Map();
      for (const book of state.books) {
        if (!map.has(book.category)) {
          map.set(book.category, book.categoryLabel || book.category);
        }
      }
      return Array.from(map, ([value, label]) => ({ value, label }));
    },
  },
  actions: {
    async loadBooks(force = false) {
      if (this.loading) return;
      if (this.hasLoaded && !force) return;

      this.loading = true;
      this.error = "";

      try {
        const loadedBooks = await fetchBooks();
        this.books = loadedBooks;
        this.hasLoaded = true;

        const validIds = new Set(loadedBooks.map((item) => String(item.id)));
        this.favoriteIds = this.favoriteIds.filter((id) =>
          validIds.has(String(id))
        );
      } catch (error) {
        this.books = [];
        this.hasLoaded = false;
        this.error =
          "Не вдалося завантажити каталог книг. Перевірте інтернет-з’єднання або повторіть запит.";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    retry() {
      return this.loadBooks(true);
    },
    toggleFavorite(id) {
      const exists = this.favoriteIds.some(
        (itemId) => String(itemId) === String(id)
      );
      this.favoriteIds = exists
        ? this.favoriteIds.filter((itemId) => String(itemId) !== String(id))
        : [...this.favoriteIds, id];
    },
    addUserItem(item) {
      this.userItems = [...this.userItems, item];
    },
    deleteUserItem(id) {
      this.userItems = this.userItems.filter((item) => item.id !== id);
    },
  },
});
