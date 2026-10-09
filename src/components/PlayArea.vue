<script setup lang="ts">
import Card from './Card.vue'
import type { Card as CardType } from '@/types/game'

interface Props {
  attackCards: CardType[]
  defendCards: CardType[]
  selectedAttackCardIndex?: number | null
  canSelectAttackCard?: boolean
  pendingCard?: CardType | null
}

withDefaults(defineProps<Props>(), {
  selectedAttackCardIndex: null,
  canSelectAttackCard: false,
  pendingCard: null
})

const emit = defineEmits<{
  selectAttackCard: [index: number]
  confirmDefend: [targetIndex: number]
  confirmTransfer: []
}>()

const handleAttackCardClick = (index: number) => {
  emit('confirmDefend', index)
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
            'clickable': pendingCard && !defendCards[index]
          }"
          @click="pendingCard && !defendCards[index] && emit('confirmDefend', index)"
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
        
        <!-- Слот для выбора: защитить эту карту -->
        <div 
          v-if="pendingCard && !defendCards[index]"
          class="defend-slot"
          :class="{ 'selected': selectedAttackCardIndex === index }"
          @click="emit('confirmDefend', index)"
        >
          <span class="slot-label">Защитить</span>
        </div>
      </div>
      
      <!-- Слот для перевода (справа от всех карт) -->
      <div v-if="pendingCard" class="card-slot transfer-slot">
        <div 
          class="transfer-area"
          @click="emit('confirmTransfer')"
        >
          <div class="transfer-icon">🔄</div>
          <span class="slot-label">Перевести</span>
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
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ЛАНДШАФТ (основной режим для игры)
  @media (max-width: 932px) and (orientation: landscape) {
    min-height: 80px;
    max-height: 120px;
    padding: 0.3rem;
  }
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ПОРТРЕТ
  @media (max-width: 768px) and (orientation: portrait) {
    min-height: 70px;
    max-height: 100px;
    padding: 0.25rem;
  }
}

.empty-message {
  color: rgba(255, 255, 255, 0.5);
  font-size: 1rem;
  font-weight: 500;
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ЛАНДШАФТ
  @media (max-width: 932px) and (orientation: landscape) {
    font-size: 0.7rem;
  }
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ПОРТРЕТ
  @media (max-width: 768px) and (orientation: portrait) {
    font-size: 0.65rem;
  }
}

.cards-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
  align-items: flex-start;
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ЛАНДШАФТ
  @media (max-width: 932px) and (orientation: landscape) {
    gap: 0.5rem;
  }
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ПОРТРЕТ
  @media (max-width: 768px) and (orientation: portrait) {
    gap: 0.4rem;
  }
}

.card-slot {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ЛАНДШАФТ
  @media (max-width: 932px) and (orientation: landscape) {
    gap: 0.2rem;
  }
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ПОРТРЕТ
  @media (max-width: 768px) and (orientation: portrait) {
    gap: 0.15rem;
  }
}

.card-wrapper {
  width: 110px;
  height: 177px;
  position: relative;
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ЛАНДШАФТ (основной режим для игры)
  @media (max-width: 932px) and (orientation: landscape) {
    width: 70px;
    height: 98px;
  }
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ПОРТРЕТ
  @media (max-width: 768px) and (orientation: portrait) {
    width: 65px;
    height: 91px;
  }
  
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

/* Слот для защиты */
.defend-slot {
  position: absolute;
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 40px;
  background: rgba(16, 185, 129, 0.2);
  border: 2px dashed #10b981;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  animation: pulse 2s infinite;
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ЛАНДШАФТ
  @media (max-width: 932px) and (orientation: landscape) {
    bottom: -30px;
    width: 65px;
    height: 25px;
    font-size: 0.65rem;
  }
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ПОРТРЕТ
  @media (max-width: 768px) and (orientation: portrait) {
    bottom: -28px;
    width: 60px;
    height: 22px;
    font-size: 0.6rem;
  }
  
  &:hover {
    background: rgba(16, 185, 129, 0.3);
    border-color: #34d399;
    transform: translateX(-50%) translateY(-2px);
  }
  
  &.selected {
    border-color: gold;
    background: rgba(255, 215, 0, 0.2);
  }
}

/* Слот для перевода */
.transfer-slot {
  position: relative;
  width: 110px;
  height: 177px;
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ЛАНДШАФТ
  @media (max-width: 932px) and (orientation: landscape) {
    width: 70px;
    height: 98px;
  }
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ПОРТРЕТ
  @media (max-width: 768px) and (orientation: portrait) {
    width: 65px;
    height: 91px;
  }
  
  @media (min-width: 1920px) {
    width: 140px;
    height: 196px;
  }
}

.transfer-area {
  width: 100%;
  height: 100%;
  background: rgba(59, 130, 246, 0.15);
  border: 3px dashed #3b82f6;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  animation: pulse 2s infinite;
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ЛАНДШАФТ
  @media (max-width: 932px) and (orientation: landscape) {
    gap: 4px;
    border-width: 2px;
  }
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ПОРТРЕТ
  @media (max-width: 768px) and (orientation: portrait) {
    gap: 3px;
    border-width: 2px;
  }
  
  &:hover {
    background: rgba(59, 130, 246, 0.25);
    border-color: #60a5fa;
    transform: translateY(-5px) scale(1.05);
  }
}

.transfer-icon {
  font-size: 2.5rem;
  filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.8));
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ЛАНДШАФТ
  @media (max-width: 932px) and (orientation: landscape) {
    font-size: 1.5rem;
  }
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ПОРТРЕТ
  @media (max-width: 768px) and (orientation: portrait) {
    font-size: 1.3rem;
  }
}

.slot-label {
  font-size: 13px;
  font-weight: 600;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  letter-spacing: 0.5px;
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ЛАНДШАФТ
  @media (max-width: 932px) and (orientation: landscape) {
    font-size: 9px;
    letter-spacing: 0.3px;
  }
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ПОРТРЕТ
  @media (max-width: 768px) and (orientation: portrait) {
    font-size: 8px;
    letter-spacing: 0.2px;
  }
}

.attack-card {
  position: absolute;
  top: 0;
  left: 0;
}

.defend-wrapper {
  margin-top: -130px;
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ЛАНДШАФТ
  @media (max-width: 932px) and (orientation: landscape) {
    margin-top: -75px;
  }
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ПОРТРЕТ
  @media (max-width: 768px) and (orientation: portrait) {
    margin-top: -70px;
  }
  
  @media (min-width: 1920px) {
    margin-top: -165px;
  }
}

.defend-card {
  position: absolute;
  top: 20px;
  left: 20px;
  transform: rotate(8deg);
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ЛАНДШАФТ
  @media (max-width: 932px) and (orientation: landscape) {
    top: 12px;
    left: 12px;
  }
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ПОРТРЕТ
  @media (max-width: 768px) and (orientation: portrait) {
    top: 10px;
    left: 10px;
  }
}
</style>
