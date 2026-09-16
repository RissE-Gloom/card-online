<script setup lang="ts">
interface Props {
  currentTurn?: 'player' | 'opponent'
  turnState?: 'attack' | 'defend'
  playerRole?: 'player' | 'opponent' | null
  originalAttacker?: 'player' | 'opponent' | null
}

interface Emits {
  (e: 'beat'): void
  (e: 'take'): void
}

const props = withDefaults(defineProps<Props>(), {
  currentTurn: 'player',
  turnState: 'attack',
  playerRole: null,
  originalAttacker: null
})
const emit = defineEmits<Emits>()

// Я ли атакующий?
const isAttacker = () => {
  const myRole = props.playerRole ?? 'player'
  // Если есть originalAttacker - он начал атаку
  // Если нет - смотрим кто сейчас в режиме attack
  if (props.originalAttacker) {
    return props.originalAttacker === myRole
  }
  return props.turnState === 'attack' && props.currentTurn === myRole
}

// Я ли защищающийся?
const isDefender = () => {
  const myRole = props.playerRole ?? 'player'
  return props.turnState === 'defend' && props.currentTurn === myRole
}
</script>

<template>
  <div class="game-controls">
    <!-- Бито: доступно только когда я атакующий и ход в режиме attack -->
    <button 
      class="control-btn beat" 
      @click="emit('beat')"
      :disabled="!isAttacker() || turnState !== 'attack'"
    >
      <span class="icon">✓</span>
      Бито
    </button>
    
    <!-- Взять: доступно только когда я защищаюсь -->
    <button 
      class="control-btn take" 
      @click="emit('take')"
      :disabled="!isDefender()"
    >
      <span class="icon">↓</span>
      Взять
    </button>
  </div>
</template>

<style scoped lang="scss">
.game-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding: 0.5rem 0;
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
    
    &:hover {
      transform: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
  }
  
  .icon {
    font-size: 1.25rem;
  }
  
  &.beat {
    background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
    color: white;
    
    &:hover {
      background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
    }
  }
  
  &.take {
    background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
    color: white;
    
    &:hover {
      background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
    }
  }
}
</style>
