# Workout Scheduling App - Frontend

Telegram Mini App для планирования и создания групповых тренировок.

## 🚀 Быстрый старт

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка для production
npm run build
```

## 🏗️ Архитектура проекта

### Технологический стек
- **React 19** - UI библиотека
- **TypeScript** - типизация
- **Vite** - сборщик и dev сервер
- **Tailwind CSS v4** - стилизация
- **Radix UI** - доступные UI компоненты
- **Lucide React** - иконки
- **Sonner** - уведомления

### Структура приложения

```
src/
├── components/
│   ├── BottomNavigation.tsx      # Нижняя навигация
│   ├── ScheduleScreen.tsx        # Экран всех тренировок
│   ├── MyScheduleScreen.tsx      # Мое расписание
│   ├── CreateEventScreen.tsx     # Создание тренировки
│   ├── ProfileScreen.tsx         # Профиль пользователя
│   ├── PaymentScreen.tsx         # Экран оплаты
│   ├── NotificationsScreen.tsx   # Уведомления
│   └── ui/                       # Переиспользуемые UI компоненты
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── input.tsx
│       └── ...
├── styles/
│   └── globals.css               # Глобальные стили и Tailwind
├── App.tsx                       # Главный компонент с роутингом
└── main.tsx                      # Точка входа

```

### Основные экраны

1. **Все тренировки** (`ScheduleScreen`) - просмотр и запись на тренировки
2. **Мое расписание** (`MyScheduleScreen`) - управление записями и созданными тренировками
3. **Создать тренировку** (`CreateEventScreen`) - форма создания новой тренировки
4. **Профиль** (`ProfileScreen`) - информация и статистика пользователя
5. **Оплата** (`PaymentScreen`) - процесс оплаты тренировки

### Управление состоянием

Используется локальное состояние React (`useState`) в главном компоненте `App.tsx`:
- `events` - список тренировок
- `joinedEventIds` - ID записанных тренировок
- `createdEventIds` - ID созданных тренировок
- `userProfile` - данные профиля пользователя
- `notifications` - список уведомлений

### Дизайн система

- **Glass-morphism** эффекты для карточек
- **Градиентные** фоны и элементы
- **Адаптивная** верстка для мобильных устройств
- **Темная/светлая** тема (через CSS переменные)
