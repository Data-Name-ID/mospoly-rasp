# Расписание Мосполитех

Удобный сервис для просмотра расписания занятий Московского Политеха.

## Возможности

- Просмотр расписания на **сегодня** и на **всю неделю**
- **Фильтрация по датам** — показываются только актуальные пары
- Фильтры по типу занятия, предмету, формату (онлайн/очно), преподавателю
- **Тёмная и светлая тема** (+ системная)
- **PWA** — установка на телефон, оффлайн-кэширование
- Кликабельные ссылки на вебинары и онлайн-курсы
- Подсветка текущей пары и баннер "следующая пара через..."
- Сохранение настроек в localStorage

## Стек

- React 18 + TypeScript
- Vite
- Tailwind CSS v4
- Zustand (state management + persist)
- vite-plugin-pwa

## Запуск

```bash
yarn install
yarn dev
```

## Сборка

```bash
yarn build
```

## Деплой на Vercel

Проект готов к деплою на Vercel:
- `api/schedule.ts` — serverless function, работает как CORS-прокси к `rasp.dmami.ru`
- `vercel.json` — настроены rewrites

```bash
npx vercel
```

## API

Расписание загружается из `https://rasp.dmami.ru/site/group?group={group}&session=0`.
В dev-режиме используется Vite proxy, в production — Vercel serverless function.
