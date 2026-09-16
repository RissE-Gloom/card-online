<script setup lang="ts">
import Card from './Card.vue'
import type { Card as CardType } from '@/types/game'

interface Props {
  attackCards: CardType[]
  defendCards: CardType[]
  selectedAttackCardIndex?: number | null
  canSelectAttackCard?: boolean
}

withDefaults(defineProps<Props>(), {
  selectedAttackCardIndex: null,
  canSelectAttackCard: false
})

const emit = defineEmits<{
  selectAttackCard: [index: number]
}>()

const handleAttackCardClick = (index: number) => {
  emit('selectAttackCard', index)
}
</script>

<template>
  <div class="play-area">
    <div v-if="attackCards.length === 0" class="empty-message">
      Игровое поле пусто
    </div>
    
    <div v-else class="cards-grid">
      <!-- Каждая атакующая карта с защитной (если есть) -->
      <div 
        v-for="(attackCard, index) in attackCards" 
        :key="attackCard.id"
        class="card-slot"
      >
        <!-- Атакующая карта -->
        <div 
          class="card-wrapper attack-wrapper"
          :class="{ 
            'selected': selectedAttackCardIndex === index,
            'clickable': canSelectAttackCard && !defendCards[index]
          }"
          @click="canSelectAttackCard && !defendCards[index] && handleAttackCardClick(index)"
        >
          <Card :card="attackCard" size="large" class="attack-card" />
        </div>
        
        <!-- Защитная карта (если есть для этого индекса) -->
        <div v-if="defendCards[index]" class="card-wrapper defend-wrapper">
          <Card 
            :card="defendCards[index]" 
            size="large" 
            class="defend-card"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.play-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 150px;
  max-height: 200px;
  padding: 1rem;
}

.empty-message {
  color: rgba(255, 255, 255, 0.5);
  font-size: 1rem;
  font-weight: 500;
}

.cards-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
  align-items: flex-start;
}

.card-slot {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.card-wrapper {
  width: 110px;
  height: 177px;
  position: relative;
  
  @media (min-width: 1920px) {
    width: 140px;
    height: 196px;
  }
}

.attack-wrapper {
  transition: all 0.2s ease;
  
  &.clickable {
    cursor: pointer;
    
    &:hover {
      transform: translateY(-5px);
      filter: brightness(1.1);
    }
  }
  
  &.selected {
    transform: translateY(-10px);
    filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8));
    
    &::after {
      content: '';
      position: absolute;
      inset: -5px;
      border: 3px solid gold;
      border-radius: 12px;
      pointer-events: none;
      animation: pulse 1s infinite;
    }
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.attack-card {
  position: absolute;
  top: 0;
  left: 0;
}

.defend-wrapper {
  margin-top: -130px;
  
  @media (min-width: 1920px) {
    margin-top: -165px;
  }
}

.defend-card {
  position: absolute;
  top: 20px;
  left: 20px;
  transform: rotate(8deg);
}
</style>
