<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'
import PlayerHand from '@/components/PlayerHand.vue'
import PlayArea from '@/components/PlayArea.vue'
import Deck from '@/components/Deck.vue'
import GameControls from '@/components/GameControls.vue'
import GameOverModal from '@/components/GameOverModal.vue'
import MoveHistory from '@/components/MoveHistory.vue'
import GameMenu from '@/components/GameMenu.vue'
import type { Card, GameMode } from '@/types/game'
import { subscribeToGameSession } from '@/services/gameSession'

const route = useRoute()
const gameStore = useGameStore()

const isLoading = ref(true)
const isHistoryOpen = ref(false)
const isMenuOpen = ref(false)
let unsubscribe: (() => void) | null = null

const {
  sessionId,
  mode,
  playerRole,
  trump,
  playerHand,
  opponentHand,
  myHand,
  enemyHand,
  attackCards,
  defendCards,
  deck,
  currentTurn,
  turnState,
  originalAttacker,
  selectedAttackCardIndex,
  pendingCard,
  moveHistory,
  winner,
  isAIMode
} = storeToRefs(gameStore)

onMounted(async () => {
  const sid = route.params.sessionId as string

  console.log('🎮 GameView mounted, loading Firebase session...', sid)

  // Сначала пытаемся забрать роль
  const role = await gameStore.claimRole(sid)

  if (!role) {
    console.warn('❌ В сессии уже два игрока')
    return
  }

  console.log('✅ Role claimed successfully:', role)

  // Потом загружаем или создаём игру
  const loaded = await gameStore.loadGame(sid)

  console.log('🧪 Loaded game state:', {
    loaded,
    playerHand: gameStore.playerHand.length,
    opponentHand: gameStore.opponentHand.length,
    deck: gameStore.deck.length,
    attackCards: gameStore.attackCards.length,
    defendCards: gameStore.defendCards.length,
    trump: gameStore.trump
  })

  // Проверяем что игра валидна (есть карты у игроков)
  const isGameValid = loaded && 
    gameStore.playerHand.length > 0 && 
    gameStore.opponentHand.length > 0

  if (!isGameValid) {
    if (role === 'player') {
      const gameMode = (route.query.mode as GameMode) || 'podkidnoy'
      const aiMode = route.query.ai === 'true'

      console.log('🎮 Creating new game as first player...', {
        sid,
        gameMode,
        aiMode,
        reason: loaded ? 'Game invalid (no cards)' : 'Game not found'
      })

      await gameStore.initGame(sid, gameMode, aiMode)
    } else {
      console.log('⏳ Waiting for first player to create game...')

      let attempts = 0
      let gameLoaded = false

      while (attempts < 5 && !gameLoaded) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        gameLoaded = await gameStore.loadGame(sid)

        const valid = gameLoaded && 
          gameStore.playerHand.length > 0 && 
          gameStore.opponentHand.length > 0

        if (valid) {
          gameLoaded = true
          break
        }

        attempts++
        console.log(`⏳ Attempt ${attempts}: ${gameLoaded ? 'Game loaded but invalid' : 'Still waiting...'}`)
      }

      if (!gameLoaded) {
        console.error('❌ Game not created by first player after 5 attempts')
      }
    }
  } else {
    console.log('✅ Existing game loaded — initialization skipped')
  }

  console.log('🔍 playerRole value in store:', playerRole.value)

  try {
    unsubscribe = subscribeToGameSession(sid, (gameState) => {
      if (!gameState) {
        console.log('⚠️ Firebase returned null gameState')
        return
      }

      console.log('🔥 Firebase game update received')
      console.log('🔍 playerRole BEFORE applyGameState:', playerRole.value)

      gameStore.applyGameState(gameState)
      
      console.log('🔍 playerRole AFTER applyGameState:', playerRole.value)
    })
    
    console.log('🎯 Subscription created, final playerRole:', playerRole.value)
  } catch (error) {
    console.error('❌ Error during subscription:', error)
  } finally {
    isLoading.value = false
  }
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
    unsubscribe = null
  }
})

const handlePlayCard = (card: Card) => {
  gameStore.playCard(card)
}

const handleSelectAttackCard = (index: number) => {
  gameStore.selectAttackCard(index)
}

const handleConfirmDefend = (targetIndex: number) => {
  if (pendingCard.value) {
    gameStore.confirmDefend(pendingCard.value, targetIndex)
  }
}

const handleConfirmTransfer = () => {
  if (pendingCard.value) {
    gameStore.confirmTransfer(pendingCard.value)
  }
}

const handleBeat = () => {
  gameStore.beatCards()
}

const handleTake = () => {
  gameStore.takeCards(gameStore.playerRole ?? 'player')
}

const handleRematch = () => {
  const sid = route.params.sessionId as string
  const gameMode = (route.query.mode as GameMode) || 'podkidnoy'
  const aiMode = route.query.ai === 'true'
  
  // Только игрок с ролью 'player' создаёт реванш
  // Это предотвращает создание двух разных игр
  if (playerRole.value === 'player') {
    console.log('🔄 Player 1 создаёт реванш')
    gameStore.initGame(sid, gameMode, aiMode, true) // forceCreate = true
  } else {
    console.log('⏳ Player 2 ждёт создания реванша...')
    // Opponent просто ждёт обновления от Firebase
    // applyGameState() применит новое состояние автоматически через subscription
  }
}
</script>

<template>
  <main v-if="!isLoading" class="game-view">
    <!-- Иконки в левом верхнем углу -->
    <div class="top-left-controls">
      <button class="control-icon-btn history-btn" @click="isHistoryOpen = true" aria-label="История ходов">
        <span class="control-icon">📜</span>
      </button>
      
      <button class="control-icon-btn menu-btn" @click="isMenuOpen = true" aria-label="Меню">
        <span class="control-icon">⚙️</span>
      </button>
    </div>
    
    <!-- Верх: рука противника -->
    <div class="opponent-section">
      <PlayerHand :cards="enemyHand" :is-own="false" />
    </div>

    <!-- Центр: колода и игровое поле -->
    <div class="center-section">
      <div class="deck-area">
        <Deck 
          :remaining-cards="deck.length" 
          :trump-card="trump"
        />
      </div>
      
      <div class="play-area-wrapper">
        <PlayArea 
          :attack-cards="attackCards" 
          :defend-cards="defendCards"
          :selected-attack-card-index="selectedAttackCardIndex"
          :can-select-attack-card="turnState === 'defend' && currentTurn === (playerRole ?? 'player')"
          :pending-card="pendingCard"
          @select-attack-card="handleSelectAttackCard"
          @confirm-defend="handleConfirmDefend"
          @confirm-transfer="handleConfirmTransfer"
        />
      </div>
    </div>

    <!-- Низ: рука игрока -->
    <div class="player-section">
      <PlayerHand 
        :cards="myHand" 
        :is-own="true"
        :pending-card="pendingCard"
        @play-card="handlePlayCard"
      />
      <GameControls 
        :current-turn="currentTurn"
        :turn-state="turnState"
        :player-role="playerRole"
        :original-attacker="originalAttacker"
        @beat="handleBeat"
        @take="handleTake"
      />
    </div>

    <!-- Информация о игре -->
    <div class="game-info">
      <div class="info-badge">Сессия: {{ sessionId }}</div>
      <div class="info-badge">
        Роль: {{ playerRole === 'player' ? 'Игрок 1' : 'Игрок 2' }}
      </div>
      <div class="info-badge">{{ mode === 'podkidnoy' ? 'Подкидной' : 'Переводной' }}</div>
      <div v-if="isAIMode" class="info-badge">🤖 Режим против ИИ</div>
      <div class="info-badge">
        {{
          currentTurn === (playerRole ?? 'player')
            ? 'Ваш ход'
            : 'Ход противника'
        }}
        ({{ turnState === 'attack' ? 'Атака' : 'Защита' }})
      </div>
    </div>

    <!-- Модальное окно результата -->
    <GameOverModal :winner="winner" :player-role="playerRole" @rematch="handleRematch" />
    
    <!-- История ходов -->
    <MoveHistory 
      :is-open="isHistoryOpen" 
      :history="moveHistory"
      @close="isHistoryOpen = false"
    />
    
    <!-- Меню игры -->
    <GameMenu 
      :is-open="isMenuOpen"
      @close="isMenuOpen = false"
    />
  </main>
</template>

<style scoped lang="scss">
.game-view {
  min-height: 100vh;
  background-image: url('@/assets/bg.webp');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 0.25rem 0.5rem;
  gap: 0.5rem;
  justify-content: center;
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ЛАНДШАФТ (основной режим для игры)
  @media (max-width: 932px) and (orientation: landscape) {
    padding: 0.15rem 0.25rem;
    gap: 0.2rem;
    min-height: 100vh;
    max-height: 100vh;
    overflow: hidden;
  }
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ПОРТРЕТ
  @media (max-width: 768px) and (orientation: portrait) {
    padding: 0.1rem 0.2rem 0.05rem 0.2rem; // Уменьшен нижний padding
    gap: 0.1rem; // Уменьшен gap между секциями
    min-height: 100vh;
    max-height: 100vh;
    overflow: hidden; // Запрет прокрутки
    justify-content: space-between; // Равномерное распределение
  }
}

.opponent-section {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ЛАНДШАФТ
  @media (max-width: 932px) and (orientation: landscape) {
    max-width: 100%;
  }
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ПОРТРЕТ
  @media (max-width: 768px) and (orientation: portrait) {
    flex-shrink: 0; // Не сжимаем секцию оппонента
  }
}

.center-section {
  flex: 1;
  display: flex;
  gap: 3rem;
  align-items: center;
  justify-content: center;
  padding: 0 1.5rem;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
  max-height: 250px;
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ЛАНДШАФТ (основной режим для игры)
  @media (max-width: 932px) and (orientation: landscape) {
    gap: 0.5rem;
    padding: 0 0.25rem;
    max-height: 120px;
    flex-direction: row;
  }
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ПОРТРЕТ
  @media (max-width: 768px) and (orientation: portrait) {
    flex-direction: column;
    gap: 0.2rem;
    padding: 0 0.1rem;
    max-height: none;
    flex: 1; // Занимаем доступное пространство
    min-height: 0; // Позволяем сжиматься
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
}

.deck-area {
  flex-shrink: 0;
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ
  @media (max-width: 932px) and (orientation: landscape) {
    transform: scale(0.7);
  }
  
  @media (max-width: 768px) and (orientation: portrait) {
    transform: scale(0.6);
  }
}

.play-area-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 1000px;
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ
  @media (max-width: 932px) and (orientation: landscape) {
    max-width: 100%;
  }
}

.player-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ
  @media (max-width: 932px) and (orientation: landscape) {
    max-width: 100%;
  }
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ПОРТРЕТ
  @media (max-width: 768px) and (orientation: portrait) {
    flex-shrink: 0; // Не сжимаем секцию игрока
    min-height: 0; // Позволяем уменьшаться
  }
}

.game-info {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
  z-index: 100;
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ЛАНДШАФТ
  @media (max-width: 932px) and (orientation: landscape) {
    top: 0.3rem;
    right: 0.3rem;
    gap: 0.2rem;
  }
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ПОРТРЕТ
  @media (max-width: 768px) and (orientation: portrait) {
    top: 0.25rem;
    right: 0.25rem;
    gap: 0.15rem;
  }
}

.top-left-controls {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  gap: 1rem;
  z-index: 100;
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ЛАНДШАФТ
  @media (max-width: 932px) and (orientation: landscape) {
    top: 0.3rem;
    left: 0.3rem;
    gap: 0.4rem;
  }
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ПОРТРЕТ
  @media (max-width: 768px) and (orientation: portrait) {
    top: 0.25rem;
    left: 0.25rem;
    gap: 0.3rem;
  }
}

.control-icon-btn {
  width: 60px;
  height: 60px;
  border: none;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 215, 0, 0.1) 100%);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 215, 0, 0.3);
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ЛАНДШАФТ
  @media (max-width: 932px) and (orientation: landscape) {
    width: 40px;
    height: 40px;
    border-width: 1.5px;
  }
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ПОРТРЕТ
  @media (max-width: 768px) and (orientation: portrait) {
    width: 35px;
    height: 35px;
    border-width: 1px;
  }
  
  &:hover {
    transform: scale(1.1) rotate(5deg);
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.3) 0%, rgba(255, 215, 0, 0.2) 100%);
    box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &.history-btn:hover {
    .control-icon {
      animation: none;
      transform: translateY(-2px);
    }
  }
  
  &.menu-btn {
    .control-icon {
      animation: rotate 4s linear infinite;
    }
    
    &:hover .control-icon {
      animation-duration: 1s;
    }
  }
}

.control-icon {
  font-size: 2rem;
  display: block;
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ЛАНДШАФТ
  @media (max-width: 932px) and (orientation: landscape) {
    font-size: 1.3rem;
  }
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ПОРТРЕТ
  @media (max-width: 768px) and (orientation: portrait) {
    font-size: 1.1rem;
  }
}

.history-btn .control-icon {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.info-badge {
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ЛАНДШАФТ
  @media (max-width: 932px) and (orientation: landscape) {
    padding: 0.25rem 0.5rem;
    font-size: 0.6rem;
    border-radius: 12px;
  }
  
  // 📱 МОБИЛЬНАЯ ВЕРСИЯ - ПОРТРЕТ
  @media (max-width: 768px) and (orientation: portrait) {
    padding: 0.2rem 0.4rem;
    font-size: 0.55rem;
    border-radius: 10px;
  }
}
</style>
