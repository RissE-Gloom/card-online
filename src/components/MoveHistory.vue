<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Card } from '@/types/game'

interface MoveEvent {
  id: string
  timestamp: number
  player: 'player' | 'opponent'
  playerName: string
  type: 'attack' | 'defend' | 'transfer' | 'take' | 'beat'
  cards: Card[]
  description: string
}

interface Props {
  isOpen: boolean
  history: MoveEvent[]
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Блокировка скролла body при открытии
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    document.body.classList.add('modal-open')
  } else {
    document.body.classList.remove('modal-open')
  }
})

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

const getCardDisplay = (card: Card) => {
  const suitSymbols: Record<string, string> = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠'
  }
  return `${card.rank}${suitSymbols[card.suit]}`
}

const getEventIcon = (type: string) => {
  switch (type) {
    case 'attack': return '⚔️'
    case 'defend': return '🛡️'
    case 'transfer': return '🔄'
    case 'take': return '↓'
    case 'beat': return '✓'
    default: return '•'
  }
}

const getEventColor = (type: string) => {
  switch (type) {
    case 'attack': return 'event-attack'
    case 'defend': return 'event-defend'
    case 'transfer': return 'event-transfer'
    case 'take': return 'event-take'
    case 'beat': return 'event-beat'
    default: return ''
  }
}
</script>

<template>
  <Transition name="drawer">
    <div v-if="isOpen" class="move-history-overlay" @click="emit('close')">
      <!-- Панель шторки -->
      <div class="move-history-drawer" @click.stop>
        <!-- Заголовок -->
        <div class="drawer-header">
          <h2 class="drawer-title">
            <span class="title-icon">📜</span>
            История ходов
          </h2>
          <button class="close-btn" @click="emit('close')" aria-label="Закрыть">
            ✕
          </button>
        </div>

        <!-- Список ходов -->
        <div class="drawer-content">
          <div v-if="history.length === 0" class="empty-state">
            <span class="empty-icon">🎴</span>
            <p>История ходов пуста</p>
            <p class="empty-hint">Начните игру, и здесь появится история</p>
          </div>

          <div v-else class="events-list">
            <div 
              v-for="event in history" 
              :key="event.id"
              :class="['event-item', getEventColor(event.type)]"
            >
              <div class="event-time">{{ formatTime(event.timestamp) }}</div>
              <div class="event-body">
                <div class="event-icon">{{ getEventIcon(event.type) }}</div>
                <div class="event-details">
                  <div class="event-player">{{ event.playerName }}</div>
                  <div class="event-description">{{ event.description }}</div>
                  <div v-if="event.cards.length > 0" class="event-cards">
                    <span 
                      v-for="card in event.cards" 
                      :key="card.id"
                      class="card-chip"
                    >
                      {{ getCardDisplay(card) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.move-history-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  padding-top: 0;
}

.move-history-drawer {
  width: 100%;
  max-width: 600px;
  max-height: 70vh;
  background: linear-gradient(180deg, rgba(20, 20, 30, 0.98) 0%, rgba(10, 10, 20, 0.98) 100%);
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(255, 215, 0, 0.2);
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 215, 0, 0.05);
}

.drawer-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.title-icon {
  font-size: 1.75rem;
}

.close-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1.5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
}

.drawer-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;

  /* Кастомный скроллбар */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 215, 0, 0.3);
    border-radius: 4px;

    &:hover {
      background: rgba(255, 215, 0, 0.5);
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.3;
  }

  p {
    margin: 0.5rem 0;
    font-size: 1.1rem;
  }

  .empty-hint {
    font-size: 0.9rem;
    opacity: 0.7;
  }
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.event-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem;
  border-left: 4px solid rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateX(4px);
  }

  &.event-attack {
    border-left-color: #ef4444;
  }

  &.event-defend {
    border-left-color: #10b981;
  }

  &.event-transfer {
    border-left-color: #3b82f6;
  }

  &.event-take {
    border-left-color: #f59e0b;
  }

  &.event-beat {
    border-left-color: #8b5cf6;
  }
}

.event-time {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 0.5rem;
}

.event-body {
  display: flex;
  gap: 1rem;
}

.event-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.event-details {
  flex: 1;
}

.event-player {
  font-weight: 600;
  color: #ffd700;
  margin-bottom: 0.25rem;
}

.event-description {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
}

.event-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.card-chip {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 6px;
  color: #ffd700;
  font-weight: 600;
  font-size: 0.9rem;
}

/* Анимация шторки */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;

  .move-history-drawer {
    transition: transform 0.3s ease;
  }
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;

  .move-history-drawer {
    transform: translateY(-100%);
  }
}

.drawer-enter-to,
.drawer-leave-from {
  opacity: 1;

  .move-history-drawer {
    transform: translateY(0);
  }
}
</style>
