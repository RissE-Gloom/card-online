# Гайд по замене карт на кастомные картинки

## Структура файлов

Все картинки карт должны быть в формате **WebP** и находиться в папке:
```
src/assets/cards/
```

## Именование файлов

Имена файлов должны быть в формате: `{масть}-{ранг}.webp`

### Масти (suit):
- `hearts` - червы (♥)
- `diamonds` - бубны (♦)
- `clubs` - трефы (♣)
- `spades` - пики (♠)

### Ранги (rank):
- `6`, `7`, `8`, `9`, `10` - числовые карты
- `J` - валет
- `Q` - дама
- `K` - король
- `A` - туз

### Примеры имён файлов:
```
hearts-6.webp    → 6♥
hearts-J.webp    → Валет червей
diamonds-A.webp  → Туз бубен
clubs-K.webp     → Король треф
spades-10.webp   → 10♠
```

## Полный список всех 36 карт

В папке `src/assets/cards/` должны быть следующие файлы:

### Червы (Hearts):
- hearts-6.webp
- hearts-7.webp
- hearts-8.webp
- hearts-9.webp
- hearts-10.webp
- hearts-J.webp
- hearts-Q.webp
- hearts-K.webp
- hearts-A.webp

### Бубны (Diamonds):
- diamonds-6.webp
- diamonds-7.webp
- diamonds-8.webp
- diamonds-9.webp
- diamonds-10.webp
- diamonds-J.webp
- diamonds-Q.webp
- diamonds-K.webp
- diamonds-A.webp

### Трефы (Clubs):
- clubs-6.webp
- clubs-7.webp
- clubs-8.webp
- clubs-9.webp
- clubs-10.webp
- clubs-J.webp
- clubs-Q.webp
- clubs-K.webp
- clubs-A.webp

### Пики (Spades):
- spades-6.webp
- spades-7.webp
- spades-8.webp
- spades-9.webp
- spades-10.webp
- spades-J.webp
- spades-Q.webp
- spades-K.webp
- spades-A.webp

## Как применить кастомные карты

### Шаг 1: Создать папку для карт
```bash
mkdir src/assets/cards
```

### Шаг 2: Положить все webp файлы в эту папку
Поместите 36 файлов с правильными именами в `src/assets/cards/`

### Шаг 3: Обновить функцию генерации колоды
Открыть файл `src/utils/gameLogic.ts` и изменить функцию `generateDeck()`:

```typescript
export function generateDeck(): Card[] {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']
  const ranks: Rank[] = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
  const values: Record<Rank, number> = {
    '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'J': 11, 'Q': 12, 'K': 13, 'A': 14
  }

  const deck: Card[] = []

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({
        id: `${suit}-${rank}`,
        suit,
        rank,
        value: values[rank],
        customDesign: {
          imageUrl: `/src/assets/cards/${suit}-${rank}.webp`
        }
      })
    }
  }

  return deck
}
```

### Шаг 4: Перезапустить dev сервер
```bash
npm run dev
```

## Требования к картинкам

- **Формат**: WebP
- **Рекомендуемый размер**: 280x392 пикселя (соотношение 5:7)
- **Ориентация**: Вертикальная
- **Качество**: Среднее-высокое (для оптимизации размера файла)

## Быстрая команда для создания структуры

```bash
# Windows (PowerShell)
mkdir src\assets\cards

# Список всех необходимых файлов для справки:
# hearts-6.webp, hearts-7.webp, hearts-8.webp, hearts-9.webp, hearts-10.webp, hearts-J.webp, hearts-Q.webp, hearts-K.webp, hearts-A.webp
# diamonds-6.webp, diamonds-7.webp, diamonds-8.webp, diamonds-9.webp, diamonds-10.webp, diamonds-J.webp, diamonds-Q.webp, diamonds-K.webp, diamonds-A.webp
# clubs-6.webp, clubs-7.webp, clubs-8.webp, clubs-9.webp, clubs-10.webp, clubs-J.webp, clubs-Q.webp, clubs-K.webp, clubs-A.webp
# spades-6.webp, spades-7.webp, spades-8.webp, spades-9.webp, spades-10.webp, spades-J.webp, spades-Q.webp, spades-K.webp, spades-A.webp
```

## Отключение кастомных карт

Если хочешь вернуться к стандартному отображению, просто удали блок `customDesign` из функции `generateDeck()`:

```typescript
deck.push({
  id: `${suit}-${rank}`,
  suit,
  rank,
  value: values[rank]
  // customDesign убран - будет стандартное отображение
})
```

## Проверка

После добавления картинок:
1. Открой игру в браузере
2. Если карты отображаются как стандартные символы - проверь:
   - Правильность имён файлов (строго как в гайде)
   - Путь к файлам в `generateDeck()`
   - Перезапущен ли dev сервер

## Fallback

Если картинка карты не найдена или не загрузилась, автоматически отобразится стандартная карта с символами.
