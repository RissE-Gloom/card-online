<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const router = useRouter()

// Блокировка скролла body при открытии
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    document.body.classList.add('modal-open')
  } else {
    document.body.classList.remove('modal-open')
  }
})

const handleExitToHome = () => {
  emit('close')
  router.push('/')
}
</script>

<template>
  <Transition name="modal">
    <div v-if="isOpen" class="game-menu-overlay" @click="emit('close')">
      <!-- Модальное окно по центру -->
      <div class="game-menu-modal" @click.stop>
        <!-- Заголовок -->
        <div class="modal-header">
          <h2 class="modal-title">
            <span class="title-icon">⚙️</span>
            Меню
          </h2>
          <button class="close-btn" @click="emit('close')" aria-label="Закрыть">
            ✕
          </button>
        </div>

        <!-- Содержимое -->
        <div class="modal-content">
          <button class="menu-button exit-button" @click="handleExitToHome">
            <span class="button-icon">🏠</span>
            <span class="button-text">Выход на главную</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.game-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.game-menu-modal {
  width: 100%;
  max-width: 400px;
  background: linear-gradient(180deg, rgba(20, 20, 30, 0.98) 0%, rgba(10, 10, 20, 0.98) 100%);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(255, 215, 0, 0.2);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 215, 0, 0.05);
}

.modal-title {
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

  &:active {
    transform: scale(0.95);
  }
}

.modal-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.menu-button {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  border: 2px solid transparent;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
}

.exit-button {
  border-color: rgba(255, 99, 71, 0.3);

  &:hover {
    background: rgba(255, 99, 71, 0.2);
    border-color: rgba(255, 99, 71, 0.5);
  }
}

.button-icon {
  font-size: 1.5rem;
}

.button-text {
  flex: 1;
  text-align: left;
}

/* Анимация модального окна */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;

  .game-menu-modal {
    transition: transform 0.3s ease;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .game-menu-modal {
    transform: scale(0.8);
  }
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;

  .game-menu-modal {
    transform: scale(1);
  }
}
</style>
