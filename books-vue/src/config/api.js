export const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://openlibrary.org/search.json?q=subject:fiction&limit=20&fields=key,title,author_name,first_publish_year,cover_i,subject,edition_count,ratings_average";
