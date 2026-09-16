<script setup lang="ts">
import { computed } from 'vue'
import Card from './Card.vue'
import type { Card as CardType } from '@/types/game'

interface Props {
  cards: CardType[]
  isOwn?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isOwn: false
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
</script>

<template>
  <div :class="['player-hand', { own: isOwn }]">
    <div class="cards-container">
      <div
        v-for="(card, index) in displayCards"
        :key="card.id"
        :class="['card-wrapper', { interactive: isOwn }]"
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
}

.cards-container {
  display: flex;
  gap: 0.5rem;
  height: 220px;
  width: 100%;
  align-items: flex-end;
  justify-content: center;
  
  @media (min-width: 1920px) {
    height: 250px;
  }
}

.card-wrapper {
  transition: transform 0.2s ease, margin-bottom 0.2s ease;
  
  &.interactive {
    cursor: pointer;
    
    &:hover {
      margin-bottom: 15px;
      z-index: 100 !important;
    }
  }
}

.card-count {
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}
</style>
