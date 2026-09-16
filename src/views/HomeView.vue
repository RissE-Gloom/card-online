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
    <div class="rpg-modal-wrapper">
      
      <!-- Угловые медальоны -->
      <div class="corner-ornament corner-top-left" title="Свет">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d5ab65" stroke-width="1.6">
          <circle cx="12" cy="12" r="4.5" fill="#584024" stroke="#f1cb7c" stroke-width="1.5"/>
          <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.93 4.93l1.8 1.8M17.27 17.27l1.8 1.8M4.93 19.07l1.8-1.8M17.27 6.73l1.8-1.8" stroke-linecap="round"/>
        </svg>
      </div>

      <div class="corner-ornament corner-top-right" title="Магия">
        <div class="gem-emerald"></div>
      </div>

      <div class="corner-ornament corner-bottom-left">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ba9252" stroke-width="1.6">
          <circle cx="12" cy="12" r="4" fill="#3c2a17" stroke="#e0ba72" stroke-width="1.5"/>
          <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.5 1.5M17.3 17.3l1.5 1.5M5.2 18.8l1.5-1.5M17.3 6.7l1.5-1.5" stroke-linecap="round"/>
        </svg>
      </div>

      <div class="corner-ornament corner-bottom-right" title="Ночь">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#3f2e1b" stroke="#deb46a" stroke-width="1.8" stroke-linejoin="round"/>
          <circle cx="7" cy="8" r="0.8" fill="#ffe199"/>
          <circle cx="10" cy="5" r="0.8" fill="#ffe199"/>
        </svg>
      </div>

      <!-- Основной блок модального окна -->
      <div class="rpg-modal">
        
        <!-- Заголовок -->
        <header class="modal-header">
          <h1 class="modal-title">Дурак Онлайн</h1>
          <p class="modal-subtitle">Выберите режим игры</p>
        </header>

        <!-- Выбор режима игры -->
        <div class="mode-cards-grid">
          
          <!-- Карточка 1: Подкидной -->
          <div 
            :class="['mode-card', { active: selectedMode === 'podkidnoy' }]"
            @click="selectedMode = 'podkidnoy'"
          >
            <div class="mode-icon-wrapper">🎯</div>
            <div class="mode-title">Подкидной</div>
            <div class="mode-desc">Классический режим</div>
          </div>

          <!-- Карточка 2: Переводной -->
          <div 
            :class="['mode-card', { active: selectedMode === 'perevolnoy' }]"
            @click="selectedMode = 'perevolnoy'"
          >
            <div class="mode-icon-wrapper">🔄</div>
            <div class="mode-title">Переводной</div>
            <div class="mode-desc">С переводом карт</div>
          </div>

        </div>

        <!-- Кнопка «Создать игру» -->
        <button type="button" class="create-game-btn" @click="createGame">
          <span class="btn-label">🎴 Создать игру</span>
        </button>

      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.home {
  min-height: 100vh;
  background-image: url('@/assets/bg_main.webp');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #dfd2c0;
}

.rpg-modal-wrapper {
  position: relative;
  width: 100%;
  max-width: 580px;
  filter: drop-shadow(0 15px 35px rgba(0, 0, 0, 0.85));
}

/* Внешняя литая рамка с многослойным металлическим бордюром */
.rpg-modal {
  position: relative;
  background: radial-gradient(circle at 50% 25%, #443725 0%, #292015 55%, #18120b 100%);
  border-radius: 14px;
  padding: 38px 32px 34px;
  box-shadow: 
    inset 0 0 0 1px rgba(240, 206, 128, 0.35),
    inset 0 0 0 3px rgba(25, 17, 9, 0.9),
    inset 0 0 0 4px rgba(189, 149, 78, 0.5),
    inset 0 0 25px rgba(0, 0, 0, 0.85),
    0 0 0 2px #181109,
    0 0 0 5px #4f3b20,
    0 0 0 7px #23190d,
    0 0 0 9px #5d4627,
    0 18px 45px rgba(0, 0, 0, 0.9);
  overflow: visible;
}

/* Тонкая гравированная внутренняя фаска */
.rpg-modal::before {
  content: '';
  position: absolute;
  inset: 6px;
  border: 1px solid rgba(220, 185, 115, 0.2);
  border-radius: 9px;
  pointer-events: none;
  box-shadow: inset 0 1px 1px rgba(255, 235, 170, 0.25), inset 0 -1px 2px rgba(0, 0, 0, 0.8);
}

/* Угловые медальоны */
.corner-ornament {
  position: absolute;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 35%, #4a3824 0%, #20170e 75%, #100b06 100%);
  border: 2px solid #6b5333;
  box-shadow: 
    0 0 0 2px #1a120a,
    inset 0 0 10px rgba(0,0,0,0.9),
    inset 0 2px 3px rgba(255, 225, 145, 0.4),
    0 4px 10px rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.corner-top-left {
  top: -16px;
  left: -16px;
}

.corner-top-right {
  top: -16px;
  right: -16px;
}

.corner-bottom-left {
  bottom: -16px;
  left: -16px;
}

.corner-bottom-right {
  bottom: -16px;
  right: -16px;
}

/* Медальон с зеленым кристаллом */
.gem-emerald {
  width: 20px;
  height: 30px;
  background: linear-gradient(135deg, #7bffb4 0%, #15bb66 45%, #0d6d39 100%);
  clip-path: polygon(50% 0%, 100% 30%, 100% 70%, 50% 100%, 0% 70%, 0% 30%);
  box-shadow: 0 0 14px #26e681, inset 0 0 5px #ffffff;
  filter: drop-shadow(0 0 6px rgba(46, 238, 139, 0.65));
  animation: pulse-gem 3.5s ease-in-out infinite alternate;
}

@keyframes pulse-gem {
  0% { filter: drop-shadow(0 0 4px rgba(46, 238, 139, 0.4)); opacity: 0.9; }
  100% { filter: drop-shadow(0 0 10px rgba(46, 238, 139, 0.9)); opacity: 1; }
}

.modal-header {
  text-align: center;
  margin-bottom: 28px;
}

/* Золотой объемный заголовок с тиснением */
.modal-title {
  font-family: 'Cinzel', serif;
  font-size: 38px;
  font-weight: 700;
  letter-spacing: 0.5px;
  background: linear-gradient(180deg, #fff7cb 0%, #ffd981 30%, #bf9244 65%, #6e4e1f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 3px 2px rgba(0, 0, 0, 0.95)) drop-shadow(0 -1px 1px rgba(255, 239, 175, 0.4));
  margin-bottom: 6px;
}

.modal-subtitle {
  font-size: 15px;
  font-weight: 500;
  color: #9f896b;
  letter-spacing: 0.3px;
  text-shadow: 0 2px 3px rgba(0, 0, 0, 0.9);
}

.mode-cards-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

/* Карточки игровых режимов */
.mode-card {
  position: relative;
  background: linear-gradient(180deg, #2b2116 0%, #1c150e 100%);
  border-radius: 12px;
  padding: 24px 16px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  border: 1px solid #4a3b27;
  box-shadow: 
    inset 0 1px 1px rgba(247, 218, 150, 0.3),
    inset 0 -2px 5px rgba(0, 0, 0, 0.7),
    0 6px 14px rgba(0, 0, 0, 0.6);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  outline: none;
}

/* Двойной внутренний контур карточки */
.mode-card::before {
  content: '';
  position: absolute;
  inset: 4px;
  border-radius: 8px;
  border: 1px solid rgba(175, 140, 85, 0.22);
  pointer-events: none;
  transition: border-color 0.2s ease;
}

.mode-card:hover {
  background: linear-gradient(180deg, #372a1c 0%, #221a11 100%);
  border-color: #7d623d;
  transform: translateY(-2px);
  box-shadow: 
    inset 0 1px 2px rgba(255, 235, 170, 0.5),
    inset 0 -2px 6px rgba(0, 0, 0, 0.8),
    0 10px 20px rgba(0, 0, 0, 0.7);
}

.mode-card:hover::before {
  border-color: rgba(235, 195, 120, 0.45);
}

.mode-card:active,
.mode-card.active {
  transform: translateY(1px);
  background: #19120b;
  border-color: #b08d4e;
  box-shadow: 
    inset 0 2px 6px rgba(0,0,0,0.9),
    0 0 12px rgba(184, 142, 69, 0.35);
}

.mode-card.active::before {
  border-color: rgba(224, 185, 110, 0.65);
}

.mode-icon-wrapper {
  font-size: 3rem;
  margin-bottom: 14px;
}

.mode-title {
  font-size: 17px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 5px;
  letter-spacing: 0.2px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
}

.mode-desc {
  font-size: 13px;
  color: #9f8c77;
  font-weight: 400;
}

/* Главная кнопка действия */
.create-game-btn {
  width: 100%;
  height: 54px;
  background: linear-gradient(180deg, #2c2115 0%, #1c150e 100%);
  border: 1px solid #58442a;
  border-radius: 10px;
  box-shadow: 
    inset 0 1px 1px rgba(240, 206, 128, 0.35),
    inset 0 -2px 4px rgba(0, 0, 0, 0.8),
    0 4px 10px rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  outline: none;
}

.create-game-btn::before {
  content: '';
  position: absolute;
  inset: 3px;
  border: 1px solid rgba(199, 157, 92, 0.25);
  border-radius: 7px;
  pointer-events: none;
  transition: border-color 0.2s ease;
}

.create-game-btn:hover {
  background: linear-gradient(180deg, #382a1b 0%, #241b12 100%);
  border-color: #8c6a3b;
  box-shadow: 
    inset 0 1px 2px rgba(255, 235, 170, 0.55),
    inset 0 -2px 5px rgba(0, 0, 0, 0.9),
    0 6px 14px rgba(0, 0, 0, 0.8);
}

.create-game-btn:hover::before {
  border-color: rgba(240, 206, 128, 0.5);
}

.create-game-btn:active {
  transform: translateY(1px);
  background: #18110b;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.9);
}

.btn-label {
  font-size: 19px;
  font-weight: 700;
  color: #e5bd71;
  text-shadow: 0 2px 3px rgba(0, 0, 0, 0.9);
  letter-spacing: 0.3px;
}

@media (max-width: 500px) {
  .rpg-modal {
    padding: 30px 18px 24px;
  }
  .modal-title {
    font-size: 28px;
  }
  .mode-cards-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .corner-ornament {
    width: 44px;
    height: 44px;
  }
}
</style>
