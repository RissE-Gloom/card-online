<script setup lang="ts">
import type { Card } from '@/types/game'

interface Props {
  card?: Card
  faceDown?: boolean
  size?: 'small' | 'medium' | 'large'
}

withDefaults(defineProps<Props>(), {
  faceDown: false,
  size: 'medium'
})

const getSuitSymbol = (suit: string) => {
  const symbols = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠'
  }
  return symbols[suit as keyof typeof symbols] || ''
}

const getSuitColor = (suit: string) => {
  return suit === 'hearts' || suit === 'diamonds' ? '#e53e3e' : '#1a202c'
}
</script>

<template>
  <div :class="['card', size, { 'face-down': faceDown }]">
    <div v-if="!faceDown && card" class="card-face">
      <!-- Кастомная картинка карты (если есть) -->
      <img 
        v-if="card.customDesign?.imageUrl" 
        :src="card.customDesign.imageUrl" 
        class="custom-card-image"
        alt="Card"
      />
      
      <!-- Стандартное отображение (если нет кастомной картинки) -->
      <template v-else>
        <div class="card-corner top-left">
          <div class="rank">{{ card.rank }}</div>
          <div class="suit" :style="{ color: getSuitColor(card.suit) }">
            {{ getSuitSymbol(card.suit) }}
          </div>
        </div>
        
        <div class="card-center">
          <div class="suit-large" :style="{ color: getSuitColor(card.suit) }">
            {{ getSuitSymbol(card.suit) }}
          </div>
        </div>
        
        <div class="card-corner bottom-right">
          <div class="rank">{{ card.rank }}</div>
          <div class="suit" :style="{ color: getSuitColor(card.suit) }">
            {{ getSuitSymbol(card.suit) }}
          </div>
        </div>
      </template>
    </div>
    
    <div v-else class="card-back">
      <img src="@/assets/cards/r.webp" class="card-back-image" alt="Card back" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  position: relative;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
  
  &.small {
    width: 75px;
    height: 105px;
  }
  
  &.medium {
    width: 111px;
    height: 193px;
  }
  
  &.large {
    width: 111px;
    height: 193px;
    
    @media (min-width: 1920px) {
      width: 140px;
      height: 196px;
    }
  }
}

.card-face {
  width: 100%;
  height: 100%;
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: white;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.custom-card-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.card-corner {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1;
  
  &.bottom-right {
    align-self: flex-end;
    transform: rotate(180deg);
  }
}

.rank {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 2px;
}

.suit {
  font-size: 16px;
}

.card-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.suit-large {
  font-size: 56px;
  opacity: 0.2;
}

.card-back {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.card-back-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.small {
  .rank {
    font-size: 14px;
  }
  
  .suit {
    font-size: 12px;
  }
  
  .suit-large {
    font-size: 40px;
  }
}

.large {
  .rank {
    font-size: 18px;
    
    @media (min-width: 1920px) {
      font-size: 24px;
    }
  }
  
  .suit {
    font-size: 16px;
    
    @media (min-width: 1920px) {
      font-size: 22px;
    }
  }
  
  .suit-large {
    font-size: 56px;
    
    @media (min-width: 1920px) {
      font-size: 80px;
    }
  }
}
</style>
