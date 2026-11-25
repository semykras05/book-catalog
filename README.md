# Лабораторна робота №11

## Тема, мета та джерело даних

**Тема:** Завантаження даних із зовнішнього API у Vue 3 та Pinia. Інтеграція Vue-застосунку з REST API, нормалізація відповіді та керування станами асинхронного запиту.

**Мета:** Навчитися завантажувати дані через `fetch` у Pinia action, перевіряти `response.ok` і структуру JSON, відображати стани `loading`, `error`, `empty` та `success`, повторювати невдалий запит і зберігати маршрутизацію та спільний стан із лабораторної №10.

**Обраний відкритий API:**
- **Назва:** Open Library Search API
- **Документація:** https://openlibrary.org/developers/api
- **Endpoint:** `https://openlibrary.org/search.json?q=subject:fiction&limit=12&fields=key,title,author_name,first_publish_year,cover_i,subject,edition_count,ratings_average`
- **Авторизація та CORS:** публічний HTTPS endpoint без API-ключа, повертає JSON, підтримує CORS для браузерних запитів.
- **Обмеження API:** рекомендовано уникати надмірних частих запитів, використовувати параметр `limit` і `fields` для зменшення обсягу відповіді; для окремих записів обкладинка (`cover_i`) або рейтинг (`ratings_average`) можуть бути відсутні — це враховано на етапі нормалізації.

## Команди встановлення та запуску

```bash
cd books-vue
npm install
npm run dev
npm run build
