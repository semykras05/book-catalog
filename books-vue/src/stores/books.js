import { defineStore } from "pinia";
import { books } from "../data/books.js";

export const useBooksStore = defineStore("books", {
  state: () => ({
    books,
    favoriteIds: [],
    userItems: [],
  }),
  getters: {
    favoriteCount: (state) => state.favoriteIds.length,
    isFavorite: (state) => (id) =>
      state.favoriteIds.some((itemId) => String(itemId) === String(id)),
  },
  actions: {
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
