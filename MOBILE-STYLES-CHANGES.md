# 📱 Документация по мобильным стилям

## Общая информация
Добавлены адаптивные стили для мобильных устройств с поддержкой двух ориентаций:
- **Ландшафтная** (горизонтальная) - основной режим для игры на смартфоне
- **Портретная** (вертикальная) - дополнительный режим

## Медиа-запросы
```scss
// Ландшафтная ориентация (основная для игры)
@media (max-width: 932px) and (orientation: landscape)

// Портретная ориентация
@media (max-width: 768px) and (orientation: portrait)
```

---

## 📄 Файл: `Card.vue`
**Путь:** `c:\Users\Образец1\Documents\card online\app\src\components\Card.vue`

### Что изменено:

#### 1. Размеры карт (строки ~76-118)
```scss
&.small {
  width: 75px;
  height: 105px;
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ПОРТРЕТ
  @media (max-width: 768px) and (orientation: portrait) {
    width: 50px;
    height: 70px;
  }
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ЛАНДШАФТ
  @media (max-width: 932px) and (orientation: landscape) {
    width: 55px;
    height: 77px;
  }
}

&.medium {
  width: 111px;
  height: 193px;
  
  // Мобильные размеры...
}

&.large {
  width: 111px;
  height: 193px;
  
  // Мобильные размеры...
}
```

#### 2. Размеры текста карт (строки ~138-165)
- `.rank` - ранг карты (6, 7, 8, и т.д.)
- `.suit` - символ масти (♥, ♦, ♣, ♠)
- `.suit-large` - большой символ в центре карты

**Пример:**
```scss
.rank {
  font-size: 18px; // ПК
  
  @media (max-width: 932px) and (orientation: landscape) {
    font-size: 12px; // Мобиль ландшафт
  }
  
  @media (max-width: 768px) and (orientation: portrait) {
    font-size: 11px; // Мобиль портрет
  }
}
```

---

## 📄 Файл: `PlayerHand.vue`
**Путь:** `c:\Users\Образец1\Documents\card online\app\src\components\PlayerHand.vue`

### Что изменено:

#### 1. Контейнер карт (строки ~79-103)
```scss
.cards-container {
  gap: 0.5rem; // ПК
  height: 220px;
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ЛАНДШАФТ
  @media (max-width: 932px) and (orientation: landscape) {
    gap: 0.2rem;
    height: 110px; // Уменьшена высота
  }
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ПОРТРЕТ
  @media (max-width: 768px) and (orientation: portrait) {
    gap: 0.15rem;
    height: 100px;
    flex-wrap: wrap; // Карты могут переноситься
  }
}
```

#### 2. Анимация карт при hover и pending (строки ~105-137)
```scss
.card-wrapper {
  &.interactive {
    &:hover {
      margin-bottom: 15px; // ПК
      
      @media (max-width: 932px) and (orientation: landscape) {
        margin-bottom: 8px; // Мобиль ландшафт
      }
    }
  }
  
  &.pending {
    margin-bottom: 30px; // ПК
    
    @media (max-width: 932px) and (orientation: landscape) {
      margin-bottom: 15px; // Мобиль ландшафт
    }
  }
}
```

#### 3. Счетчик карт (строки ~150-167)
```scss
.card-count {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  
  @media (max-width: 932px) and (orientation: landscape) {
    padding: 0.3rem 0.6rem;
    font-size: 0.7rem;
  }
}
```

---

## 📄 Файл: `PlayArea.vue`
**Путь:** `c:\Users\Образец1\Documents\card online\app\src\components\PlayArea.vue`

### Что изменено:

#### 1. Основной контейнер игрового поля (строки ~131-153)
```scss
.play-area {
  min-height: 150px;
  max-height: 200px;
  padding: 1rem;
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ЛАНДШАФТ
  @media (max-width: 932px) and (orientation: landscape) {
    min-height: 80px;
    max-height: 120px;
    padding: 0.3rem;
  }
}
```

#### 2. Сетка карт (строки ~168-195)
```scss
.cards-grid {
  gap: 1.5rem; // ПК
  
  @media (max-width: 932px) and (orientation: landscape) {
    gap: 0.5rem; // Мобиль
  }
}

.card-slot {
  gap: 0.5rem; // ПК
  
  @media (max-width: 932px) and (orientation: landscape) {
    gap: 0.2rem; // Мобиль
  }
}
```

#### 3. Размеры обёрток карт (строки ~197-218)
```scss
.card-wrapper {
  width: 110px;
  height: 177px;
  
  @media (max-width: 932px) and (orientation: landscape) {
    width: 70px;
    height: 98px;
  }
}
```

#### 4. Слот для защиты (зелёный слот "Защитить") (строки ~252-286)
```scss
.defend-slot {
  bottom: -50px;
  width: 100px;
  height: 40px;
  
  @media (max-width: 932px) and (orientation: landscape) {
    bottom: -30px;
    width: 65px;
    height: 25px;
    font-size: 0.65rem;
  }
}
```

#### 5. Слот для перевода (синий слот 🔄) (строки ~288-345)
```scss
.transfer-slot {
  width: 110px;
  height: 177px;
  
  @media (max-width: 932px) and (orientation: landscape) {
    width: 70px;
    height: 98px;
  }
}

.transfer-icon {
  font-size: 2.5rem;
  
  @media (max-width: 932px) and (orientation: landscape) {
    font-size: 1.5rem;
  }
}

.slot-label {
  font-size: 13px;
  
  @media (max-width: 932px) and (orientation: landscape) {
    font-size: 9px;
  }
}
```

#### 6. Позиционирование защитных карт (строки ~363-390)
```scss
.defend-wrapper {
  margin-top: -130px; // ПК
  
  @media (max-width: 932px) and (orientation: landscape) {
    margin-top: -75px; // Мобиль
  }
}

.defend-card {
  top: 20px;
  left: 20px;
  
  @media (max-width: 932px) and (orientation: landscape) {
    top: 12px;
    left: 12px;
  }
}
```

---

## 📄 Файл: `GameView.vue`
**Путь:** `c:\Users\Образец1\Documents\card online\app\src\views\GameView.vue`

### Что изменено:

#### 1. Основной контейнер игры (строки ~273-293)
```scss
.game-view {
  padding: 0.25rem 0.5rem;
  gap: 0.5rem;
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ЛАНДШАФТ
  @media (max-width: 932px) and (orientation: landscape) {
    padding: 0.15rem 0.25rem;
    gap: 0.2rem;
    min-height: 100vh;
    max-height: 100vh;
    overflow: hidden; // Запрет прокрутки
  }
}
```

#### 2. Центральная секция (колода + игровое поле) (строки ~302-344)
```scss
.center-section {
  gap: 3rem; // ПК
  padding: 0 1.5rem;
  max-height: 250px;
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ЛАНДШАФТ
  @media (max-width: 932px) and (orientation: landscape) {
    gap: 0.5rem;
    padding: 0 0.25rem;
    max-height: 120px;
    flex-direction: row; // Колода и поле в ряд
  }
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ПОРТРЕТ
  @media (max-width: 768px) and (orientation: portrait) {
    flex-direction: column;
    gap: 0.3rem;
    max-height: none;
  }
}

.deck-area {
  // Уменьшаем колоду
  @media (max-width: 932px) and (orientation: landscape) {
    transform: scale(0.7);
  }
}
```

#### 3. Информационные бейджи (строки ~361-381)
```scss
.game-info {
  top: 1rem;
  right: 1rem;
  gap: 0.5rem;
  
  @media (max-width: 932px) and (orientation: landscape) {
    top: 0.3rem;
    right: 0.3rem;
    gap: 0.2rem;
  }
}

.info-badge {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  
  @media (max-width: 932px) and (orientation: landscape) {
    padding: 0.25rem 0.5rem;
    font-size: 0.6rem;
  }
}
```

#### 4. Иконки управления (история, меню) (строки ~383-445)
```scss
.top-left-controls {
  top: 1rem;
  left: 1rem;
  gap: 1rem;
  
  @media (max-width: 932px) and (orientation: landscape) {
    top: 0.3rem;
    left: 0.3rem;
    gap: 0.4rem;
  }
}

.control-icon-btn {
  width: 60px;
  height: 60px;
  
  @media (max-width: 932px) and (orientation: landscape) {
    width: 40px;
    height: 40px;
  }
}

.control-icon {
  font-size: 2rem;
  
  @media (max-width: 932px) and (orientation: landscape) {
    font-size: 1.3rem;
  }
}
```

---

## 📄 Файл: `GameControls.vue`
**Путь:** `c:\Users\Образец1\Documents\card online\app\src\components\GameControls.vue`

### Что изменено:

#### 1. Кнопки "Бито" и "Взять" (строки ~34-107)
```scss
.game-controls {
  gap: 1rem;
  padding: 0.5rem 0;
  
  @media (max-width: 932px) and (orientation: landscape) {
    gap: 0.4rem;
    padding: 0.2rem 0;
  }
}

.control-btn {
  gap: 0.5rem;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  
  @media (max-width: 932px) and (orientation: landscape) {
    gap: 0.3rem;
    padding: 0.4rem 1rem;
    font-size: 0.7rem;
  }
}

.icon {
  font-size: 1.25rem;
  
  @media (max-width: 932px) and (orientation: landscape) {
    font-size: 0.9rem;
  }
}
```

---

## 🎯 Итоговые изменения

### Все файлы с изменениями:
1. ✅ `Card.vue` - размеры карт и текста
2. ✅ `PlayerHand.vue` - контейнер карт, анимации, счетчик
3. ✅ `PlayArea.vue` - игровое поле, слоты защиты/перевода
4. ✅ `GameView.vue` - главный экран, позиционирование элементов
5. ✅ `GameControls.vue` - кнопки управления

### Комментарии в коде:
Все изменения помечены комментариями:
```scss
// 📱 МОБИЛЬНАЯ ВЕРСИЯ - ЛАНДШАФТ
@media (max-width: 932px) and (orientation: landscape) {
  // ...стили...
}

// 📱 МОБИЛЬНАЯ ВЕРСИЯ - ПОРТРЕТ
@media (max-width: 768px) and (orientation: portrait) {
  // ...стили...
}
```

### Основные принципы адаптации:
1. **Карты** уменьшены до ~60-70% от оригинала
2. **Отступы** уменьшены в 2-3 раза
3. **Шрифты** уменьшены на 30-40%
4. **Элементы управления** компактнее
5. **Игровое поле** оптимизировано под маленький экран

### Рекомендации по тестированию:
1. Тестировать в Chrome DevTools с device emulation
2. Проверить на реальных устройствах (iPhone, Android)
3. Попробовать обе ориентации (портрет/ландшафт)
4. Убедиться что всё умещается на экране без прокрутки

---

## 📝 Как редактировать

Если нужно изменить размеры для мобильной версии:

1. Найти файл из списка выше
2. Найти нужный элемент по классу (например `.card`, `.control-btn`)
3. Найти медиа-запрос с комментарием `// 📱 МОБИЛЬНАЯ ВЕРСИЯ`
4. Изменить значения (px, rem, %)

**Пример:**
```scss
.card {
  width: 111px; // ПК
  
  @media (max-width: 932px) and (orientation: landscape) {
    width: 70px; // ⬅️ Здесь меняй размер для мобили
  }
}
```
