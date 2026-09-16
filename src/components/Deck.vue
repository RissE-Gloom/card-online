<script setup lang="ts">
import Card from './Card.vue'
import type { Card as CardType } from '@/types/game'

interface Props {
  remainingCards: number
  trumpCard?: CardType | null
}

withDefaults(defineProps<Props>(), {
  trumpCard: null
})

interface Emits {
  (e: 'beat'): void
  (e: 'take'): void
}

const emit = defineEmits<Emits>()
</script>

<template>
  <div class="deck">
    <!-- Информация сверху -->
    <div class="deck-info">
      <div class="card-count">{{ remainingCards }}</div>
      <div v-if="trumpCard" class="trump-label">
        Козырь: 
        <span v-if="trumpCard.suit === 'hearts'" class="suit-icon red">♥</span>
        <span v-else-if="trumpCard.suit === 'diamonds'" class="suit-icon red">♦</span>
        <span v-else-if="trumpCard.suit === 'clubs'" class="suit-icon">♣</span>
        <span v-else class="suit-icon">♠</span>
      </div>
    </div>
    
    <!-- Колода -->
    <div class="deck-stack">
      <!-- Козырная карта под колодой -->
      <div v-if="trumpCard" class="trump-card">
        <Card :card="trumpCard" size="medium" />
      </div>
      
      <!-- Стопка карт -->
      <div v-if="remainingCards > 0" class="deck-cards">
        <Card 
          v-for="i in Math.min(3, remainingCards)" 
          :key="i"
          :face-down="true"
          size="medium"
          :style="{ 
            transform: `translate(${i * 2}px, ${-i * 2}px)`,
            zIndex: i
          }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.deck {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
}

.deck-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;

  @media (min-width: 1920px) {
      position: relative;
      left: -60px;
    }
}

.card-count {
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 700;
  min-width: 45px;
  text-align: center;
}

.trump-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  .suit-icon {
    font-size: 1.1rem;
    font-weight: 700;
    
    &.red {
      color: #ef4444;
    }
  }
}

.deck-stack {
  position: relative;
  width: 110px;
  height: 150px;
  flex-shrink: 0;
}

.trump-card {
  position: absolute;
  left: 50%;
  top: 32%;
  transform: translate(-50%, -50%) rotate(90deg);
  z-index: 0;
  @media (min-width: 1920px) {
      left: -55%;
    }
}

.deck-cards {
  position: absolute;
  left: 50%;
  top: 0%;
  transform: translate(-50%, -50%);
  
  .card {
    position: absolute;
    left: 0;
    top: 0;
  }

  @media (min-width: 1920px) {
      left: -50%;
    }
}
</style>
