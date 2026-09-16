<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  winner: 'player' | 'opponent' | 'draw' | null
  playerRole: 'player' | 'opponent' | null
}>()

const emit = defineEmits<{
  rematch: []
}>()

const router = useRouter()

const isVisible = computed(() => props.winner !== null)

// Определяем победил ли текущий игрок
const didIWin = computed(() => {
  if (props.winner === 'draw') return null
  const myRole = props.playerRole ?? 'player'
  return props.winner === myRole
})

const title = computed(() => {
  if (props.winner === 'draw') return 'Ничья!'
  if (didIWin.value === true) return 'Вы выиграли! 🎉'
  if (didIWin.value === false) return 'Вы проиграли 😢'
  return 'Игра окончена'
})

const message = computed(() => {
  if (props.winner === 'draw') return 'У обоих игроков закончились карты одновременно'
  if (didIWin.value === true) return 'Поздравляем с победой!'
  if (didIWin.value === false) return 'В следующий раз повезёт больше'
  return ''
})

const goHome = () => {
  router.push('/')
}

const handleRematch = () => {
  emit('rematch')
}
</script>

<template>
  <Transition name="modal">
    <div v-if="isVisible" class="modal-overlay" @click.self="goHome">
      <div class="modal-content">
        <h2 class="modal-title">{{ title }}</h2>
        <p class="modal-message">{{ message }}</p>
        
        <div class="modal-actions">
          <button class="btn btn-primary" @click="handleRematch">
            🔄 Реванш
          </button>
          <button class="btn btn-secondary" @click="goHome">
            🏠 На главную
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  padding: 3rem 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  text-align: center;
  animation: slideUp 0.3s ease-out;
}

.modal-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.modal-message {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 2.5rem 0;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 1rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 180px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
}

.btn-primary {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  
  &:hover {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
  }
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .modal-content {
    padding: 2rem 1.5rem;
  }
  
  .modal-title {
    font-size: 2rem;
  }
  
  .modal-message {
    font-size: 1.125rem;
  }
  
  .btn {
    min-width: 140px;
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
  }
}
</style>
