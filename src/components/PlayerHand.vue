<script setup lang="ts">
import { computed } from 'vue'
import Card from './Card.vue'
import type { Card as CardType } from '@/types/game'

interface Props {
  cards: CardType[]
  isOwn?: boolean
  pendingCard?: CardType | null
}

const props = withDefaults(defineProps<Props>(), {
  isOwn: false,
  pendingCard: null
})

interface Emits {
  (e: 'playCard', card: CardType): void
}

const emit = defineEmits<Emits>()

const displayCards = computed(() => {
  return props.cards
})

const handleCardClick = (card: CardType) => {
  if (props.isOwn) {
    emit('playCard', card)
  }
}

const isPending = (card: CardType) => {
  return props.pendingCard?.id === card.id
}
</script>

<template>
  <div :class="['player-hand', { own: isOwn }]">
    <div class="cards-container" :class="{ 'many-cards': displayCards.length > 5 }">
      <div
        v-for="(card, index) in displayCards"
        :key="card.id"
        :class="['card-wrapper', { 
          interactive: isOwn,
          pending: isPending(card)
        }]"
        :style="{ 
          transform: `rotate(${(index - displayCards.length / 2) * 2}deg)`,
          zIndex: index
        }"
        @click="handleCardClick(card)"
      >
        <Card
          :card="isOwn ? card : undefined"
          :face-down="!isOwn"
          size="large"
        />
      </div>
    </div>
    
    <div v-if="!isOwn && cards.length > 0" class="card-count">
      {{ cards.length }} {{ cards.length === 1 ? 'карта' : cards.length < 5 ? 'карты' : 'карт' }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.player-hand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ЛАНДШАФТ
  @media (max-width: 932px) and (orientation: landscape) {
    gap: 0.1rem;
    max-width: 100%;
  }
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ПОРТРЕТ
  @media (max-width: 768px) and (orientation: portrait) {
    gap: 0.05rem; // Минимальный gap
    max-width: 100%;
    min-height: 0; // Позволяем сжиматься
  }
}

.cards-container {
  display: flex;
  gap: 0.5rem;
  height: 220px;
  width: 100%;
  align-items: flex-end;
  justify-content: center;
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ЛАНДШАФТ (основной режим для игры)
  @media (max-width: 932px) and (orientation: landscape) {
    gap: 0.2rem;
    height: 110px;
  }
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ПОРТРЕТ
  @media (max-width: 768px) and (orientation: portrait) {
    gap: 0.15rem;
    height: 70px; // Уменьшена высота чтобы карты не уходили за экран
    flex-wrap: nowrap; // Не переносим карты на новую строку
  }
  
  @media (min-width: 1920px) {
    height: 250px;
  }
  
  // 🃏 МНОГО КАРТ (>5) - накладываем друг на друга
  &.many-cards {
    .card-wrapper {
      margin-left: -45px; // Накладываем карты друг на друга
      
      &:first-child {
        margin-left: 0; // Первая карта без отступа
      }
      
      // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ЛАНДШАФТ
      @media (max-width: 932px) and (orientation: landscape) {
        margin-left: -30px;
      }
      
      // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ПОРТРЕТ
      @media (max-width: 768px) and (orientation: portrait) {
        margin-left: -28px;
      }
      
      // На больших экранах можно меньше накладывать
      @media (min-width: 1920px) {
        margin-left: -50px;
      }
    }
  }
}

.card-wrapper {
  transition: transform 0.2s ease, margin-bottom 0.2s ease;
  flex-shrink: 0; // Не сжимаем карты
  
  &.interactive {
    cursor: pointer;
    
    &:hover {
      margin-bottom: 15px;
      z-index: 100 !important;
      
      // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ЛАНДШАФТ
      @media (max-width: 932px) and (orientation: landscape) {
        margin-bottom: 8px;
      }
      
      // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ПОРТРЕТ
      @media (max-width: 768px) and (orientation: portrait) {
        margin-bottom: 6px;
      }
    }
  }
  
  &.pending {
    margin-bottom: 30px;
    z-index: 100 !important;
    filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.9));
    animation: pendingPulse 1.5s infinite;
    
    // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ЛАНДШАФТ
    @media (max-width: 932px) and (orientation: landscape) {
      margin-bottom: 15px;
    }
    
    // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ПОРТРЕТ
    @media (max-width: 768px) and (orientation: portrait) {
      margin-bottom: 12px;
    }
  }
}

@keyframes pendingPulse {
  0%, 100% {
    filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.9));
  }
  50% {
    filter: drop-shadow(0 0 30px rgba(255, 215, 0, 1));
  }
}

.card-count {
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ЛАНДШАФТ
  @media (max-width: 932px) and (orientation: landscape) {
    padding: 0.3rem 0.6rem;
    font-size: 0.7rem;
  }
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ПОРТРЕТ
  @media (max-width: 768px) and (orientation: portrait) {
    padding: 0.25rem 0.5rem;
    font-size: 0.65rem;
  }
}
</style>
