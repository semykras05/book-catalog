import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import BookDetailView from "../views/BookDetailView.vue";
import NotFoundView from "../views/NotFoundView.vue";

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", redirect: "/books" },
    { path: "/books", name: "home", component: HomeView },
    { path: "/book/:id", name: "detail", component: BookDetailView },
    { path: "/:pathMatch(.*)*", name: "not-found", component: NotFoundView },
  ],
});
