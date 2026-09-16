<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

type GameMode = 'podkidnoy' | 'perevolnoy'

const router = useRouter()
const selectedMode = ref<GameMode>('podkidnoy')

const createGame = () => {
  // Временно: генерируем локальный ID сессии
  const sessionId = Math.random().toString(36).substring(2, 9)
  router.push(`/game/${sessionId}?mode=${selectedMode.value}`)
}
</script>

<template>
  <main class="home">
    <div class="container">
      <div class="card">
        <h1 class="title">Дурак Онлайн</h1>
        <p class="subtitle">Выберите режим игры</p>

        <div class="mode-selector">
          <button
            :class="['mode-btn', { active: selectedMode === 'podkidnoy' }]"
            @click="selectedMode = 'podkidnoy'"
          >
            <div class="mode-icon">🎯</div>
            <div class="mode-title">Подкидной</div>
            <div class="mode-desc">Классический режим</div>
          </button>

          <button
            :class="['mode-btn', { active: selectedMode === 'perevolnoy' }]"
            @click="selectedMode = 'perevolnoy'"
          >
            <div class="mode-icon">🔄</div>
            <div class="mode-title">Переводной</div>
            <div class="mode-desc">С переводом карт</div>
          </button>
        </div>

        <button class="create-btn" @click="createGame">
          <span class="btn-icon">🎴</span>
          Создать игру
        </button>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.home {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.container {
  width: 100%;
  max-width: 500px;
}

.card {
  background: white;
  border-radius: 24px;
  padding: 3rem 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
}

.subtitle {
  font-size: 1rem;
  color: #718096;
  margin: 0 0 2rem 0;
}

.mode-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.mode-btn {
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    border-color: #cbd5e0;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: #667eea;
    color: white;

    .mode-desc {
      color: rgba(255, 255, 255, 0.9);
    }
  }
}

.mode-icon {
  font-size: 2rem;
  margin-bottom: 0.25rem;
}

.mode-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
}

.mode-desc {
  font-size: 0.875rem;
  color: #718096;
  margin: 0;
}

.create-btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
  }

  &:active {
    transform: translateY(0);
  }
}

.btn-icon {
  font-size: 1.5rem;
}

@media (max-width: 640px) {
  .card {
    padding: 2rem 1.5rem;
  }

  .title {
    font-size: 2rem;
  }

  .mode-selector {
    grid-template-columns: 1fr;
  }
}
</style>
