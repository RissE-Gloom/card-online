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
    
    // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ПОРТРЕТ
    @media (max-width: 768px) and (orientation: portrait) {
      width: 65px;
      height: 91px;
    }
    
    // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ЛАНДШАФТ
    @media (max-width: 932px) and (orientation: landscape) {
      width: 70px;
      height: 98px;
    }
  }
  
  &.large {
    width: 111px;
    height: 193px;
    
    // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ПОРТРЕТ
    @media (max-width: 768px) and (orientation: portrait) {
      width: 65px;
      height: 91px;
    }
    
    // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ЛАНДШАФТ (основной режим для игры)
    @media (max-width: 932px) and (orientation: landscape) {
      width: 70px;
      height: 98px;
    }
    
    @media (min-width: 1920px) {
      width: 140px;
      height: 233px;
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
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ
  @media (max-width: 932px) and (orientation: landscape) {
    font-size: 12px;
  }
  
  @media (max-width: 768px) and (orientation: portrait) {
    font-size: 11px;
  }
}

.suit {
  font-size: 16px;
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ
  @media (max-width: 932px) and (orientation: landscape) {
    font-size: 11px;
  }
  
  @media (max-width: 768px) and (orientation: portrait) {
    font-size: 10px;
  }
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
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ
  @media (max-width: 932px) and (orientation: landscape) {
    font-size: 35px;
  }
  
  @media (max-width: 768px) and (orientation: portrait) {
    font-size: 32px;
  }
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
    
    // 📱 МОБИЛЬНАЯ ВЕРСИЯ
    @media (max-width: 932px) and (orientation: landscape) {
      font-size: 10px;
    }
    
    @media (max-width: 768px) and (orientation: portrait) {
      font-size: 9px;
    }
  }
  
  .suit {
    font-size: 12px;
    
    // 📱 МОБИЛЬНАЯ ВЕРСИЯ
    @media (max-width: 932px) and (orientation: landscape) {
      font-size: 9px;
    }
    
    @media (max-width: 768px) and (orientation: portrait) {
      font-size: 8px;
    }
  }
  
  .suit-large {
    font-size: 40px;
    
    // 📱 МОБИЛЬНАЯ ВЕРСИЯ
    @media (max-width: 932px) and (orientation: landscape) {
      font-size: 28px;
    }
    
    @media (max-width: 768px) and (orientation: portrait) {
      font-size: 25px;
    }
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
