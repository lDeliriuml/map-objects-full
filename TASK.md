# Тестовое задание: Middle Frontend / Fullstack

## Мини-приложение: «Карта объектов и событий»

- **Формат результата:** ссылка на Git-репозиторий

Нужно сделать небольшое web-приложение с интерактивной картой, списком объектов и backend API.  
Задание проверяет необходимые навыки: TypeScript, карту, UI-состояние, API, Docker и базовую архитектуру приложения.

---

## Стек

### Обязательно

- TypeScript
- Vite
- MapLibre GL
- Git
- README с инструкцией запуска

### Frontend (на выбор)

- Vue 3 + Composition API
- React

### Backend (на выбор)

- Node.js: Express / Fastify / NestJS
- Python: FastAPI

### Хранение данных

- PostgreSQL (желательно)
- SQLite (допустимо)
- in-memory storage (допустим только как временное решение, если это явно описано в README)

---

## Сущности

### MapObject

```ts
type MapObject = {
  id: string;
  title: string;
  type: 'vehicle' | 'person' | 'sensor';
  status: 'active' | 'warning' | 'offline';
  coordinates: [number, number]; // [lng, lat]
  createdAt: string;
  updatedAt: string;
};
```

---

## Frontend: что нужно реализовать

- [ ] Отображение карты на MapLibre GL
- [ ] Отображение объектов на карте
- [ ] Разные цвета или иконки для разных `type` / `status`
- [ ] Боковая панель со списком объектов
- [ ] Клик по объекту на карте открывает карточку объекта
- [ ] Клик по объекту в списке центрирует карту на нём
- [ ] Добавление объекта через клик по карте или кнопку «Добавить»
- [ ] Редактирование `title`, `type`, `status`
- [ ] Удаление объекта
- [ ] Фильтр по `type` и `status`
- [ ] Обработка `loading` / `empty` / `error` states
- [ ] Базовая адаптивность интерфейса

---

## Backend API: что нужно реализовать

### Роуты

- `GET /objects`
- `POST /objects`
- `PATCH /objects/:id`
- `DELETE /objects/:id`

### Требования к backend

- Валидация входных данных
- Корректные HTTP-статусы
- Обработка ошибок
- Разделение роутов, схем/типов и логики хранения
- CORS для локального frontend

---

## Дополнительная сущность: события

### MapEvent

```ts
type MapEvent = {
  id: string;
  objectId: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  createdAt: string;
};
```

### API

- `GET /events`

События создаются автоматически:

- при создании объекта
- при изменении статуса объекта
- при удалении объекта

### UI

- Панель последних событий
- `critical`-события должны визуально выделяться

---

## TypeScript: требования

Ожидается не просто «код на TS», а осознанное использование типизации.

Нужно показать:

- Явные типы доменных сущностей: `MapObject`, `MapEvent`, DTO для API
- Разделение frontend model и backend DTO, если они отличаются
- Union types для `type`, `status`, `severity`
- Type guards или runtime validation для данных, приходящих из API
- Типизированный API-client на frontend
- Отсутствие `any` без необходимости
- Аккуратная типизация состояния, props, emits/callbacks
- Обработка nullable/optional значений без отключения strict checks
- Желательно включить `strict: true` в `tsconfig`

### Будет плюсом

- `zod` / `valibot` / `io-ts` / `class-validator` или аналоги
- Переиспользование схем валидации для типов
- Exhaustive checks для union types
- Небольшие unit tests для pure-функций: фильтрация объектов, форматирование событий, validation helpers

---

## Docker

Нужно приложить `docker-compose.yml`.

Приложение должно запускаться командой:

```bash
docker compose up --build
```

Если Docker не полностью готов, нужно честно описать это в README и дать рабочую альтернативную инструкцию запуска.

---

## README

В README должно быть:

- Как запустить проект
- Какие технологии выбраны и почему
- Структура проекта
- Какие trade-offs приняты
- Что не успели сделать
- Скриншоты UI
- Примеры API-запросов или ссылка на Swagger/OpenAPI, если есть

---

## Что оцениваем

- Рабочее приложение
- Качество архитектуры
- Чистоту TypeScript
- Умение работать с MapLibre
- Понятный UX
- Корректное API
- Валидацию и обработку ошибок
- Docker / локальный запуск
- Аккуратность кода и README
- Способность самостоятельно принимать разумные технические решения

---

## Что не требуется

Не нужно делать:

- авторизацию
- сложные роли и права
- real-time WebSocket
- production CI/CD
- сложный дизайн
- pixel-perfect UI

---

## Что отправить

- Ссылку на Git-репозиторий
- Краткое описание решения
- Инструкцию запуска
- Скриншоты интерфейса
- Список известных ограничений

---
