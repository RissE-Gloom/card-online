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
import type { Card, GameMode } from '@/types/game'
import { subscribeToGameSession } from '@/services/gameSession'

const route = useRoute()
const gameStore = useGameStore()

const isLoading = ref(true)
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
  
  gameStore.initGame(sid, gameMode, aiMode)
}
</script>

<template>
  <main v-if="!isLoading" class="game-view">
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
          @select-attack-card="handleSelectAttackCard"
        />
      </div>
    </div>

    <!-- Низ: рука игрока -->
    <div class="player-section">
      <PlayerHand 
        :cards="myHand" 
        :is-own="true"
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
}

.opponent-section {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
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
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
}

.deck-area {
  flex-shrink: 0;
}

.play-area-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 1000px;
}

.player-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
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
}

.info-badge {
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
}
</style>
