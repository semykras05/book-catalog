# Лабораторна робота №2

## Тема, мета та опис проєкту

**Тема:** Стилізація веб-сторінки засобами CSS[span_4](start_span)[span_4](end_span). Підключення каскадних таблиць стилів і базове оформлення HTML-сторінки наскрізного навчального проєкту[span_5](start_span)[span_5](end_span).

**Мета:** Навчитися підключати зовнішній CSS-файл, добирати селектори, застосовувати каскад та успадкування, використовувати модель коробки і CSS-змінні, оформлювати типографіку, навігацію, кнопки та картки контенту[span_6](start_span)[span_6](end_span).

**Опис проєкту:** Наскрізний вебзастосунок **BookShelf — «Каталог книг»** для пошуку видань, ознайомлення з новинками, категоріями та формування персонального списку читання[span_7](start_span)[span_7](end_span). У лабораторній роботі №2 реалізовано базове оформлення сторінки засобами CSS без JavaScript[span_8](start_span)[span_8](end_span).

## Реалізовані зміни

- Створено та підключено зовнішній файл стилів `css/styles.css` у `<head>`[span_9](start_span)[span_9](end_span).
- Додано змістовні класи до основних частин сторінки (`site-header`, `main-nav`, `nav-link`, `content-section`, `card`, `card-title`, `button`, `site-footer` тощо) та додано третю картку книги («Дюна»)[span_10](start_span)[span_10](end_span).
- Оголошено CSS-змінні в `:root` (`--color-primary`, `--color-primary-hover`, `--color-text`, `--color-text-muted`, `--color-background`, `--color-surface`, `--color-border`, `--color-focus`, `--radius`, `--space`)[span_11](start_span)[span_11](end_span).
- Застосовано модель коробки (`box-sizing: border-box`, `margin`, `padding`, `border`, `border-radius`), гнучкі зображення та стани `:hover` і `:focus-visible` без `!important`, вбудованих `style`-атрибутів та вимкнення `outline`[span_12](start_span)[span_12](end_span).

## Структура проєкту

```text
book-catalog/
├── css/
│   └── styles.css
├── images/
│   ├── book-1984.jpg
│   ├── book-dune.jpg
│   ├── book-kobzar.jpg
│   ├── lab2-cards.png
│   └── lab2-header.png
├── index.html
└── README.md
