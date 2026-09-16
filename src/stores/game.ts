import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Card, GameMode, GameState } from '@/types/game'
import {
  generateDeck,
  shuffleDeck,
  determineTrump,
  dealCards,
  determineFirstTurn,
  getValidDefenseCards,
  findMinCard,
  drawCards,
  checkWinner,
  sortHandBySuit
} from '@/utils/gameLogic'
import {
  createGameSessionIfAbsent,
  subscribeToGameSession,
  claimPlayerRole
} from '@/services/gameSession'
import {
  getGameSession,
  updateGameSession
} from '@/services/gameSession'

export const useGameStore = defineStore('game', () => {
  const sessionId = ref<string>('')
  const mode = ref<GameMode>('podkidnoy')
  const playerRole = ref<'player' | 'opponent' | null>(null)
  const connectionId = ref(getConnectionId())
  const deck = ref<Card[]>([])
  const trump = ref<Card | null>(null)
  const playerHand = ref<Card[]>([])
  const opponentHand = ref<Card[]>([])
  const attackCards = ref<Card[]>([]) // Карты атаки
  const defendCards = ref<Card[]>([]) // Карты защиты
  const discardPile = ref<Card[]>([])
  const currentTurn = ref<'player' | 'opponent'>('player')
  const turnState = ref<'attack' | 'defend'>('attack')
  const originalAttacker = ref<'player' | 'opponent' | null>(null) // Кто начал текущую атаку
  const canTransfer = ref(false) // Можно ли переводить (только в переводном дураке)
  const hasDefended = ref(false) // Начал ли защитник отбиваться
  const isFirstRound = ref(true) // Первый кон игры (переводить нельзя)
  const status = ref<'waiting' | 'playing' | 'finished'>('waiting')
  const winner = ref<'player' | 'opponent' | 'draw' | null>(null)
  const isAIMode = ref(false)

  const myHand = computed(() => {
    return playerRole.value === 'opponent'
      ? opponentHand.value
      : playerHand.value
  })

  const enemyHand = computed(() => {
    return playerRole.value === 'opponent'
      ? playerHand.value
      : opponentHand.value
  })

  function getConnectionId(): string {
  const storageKey = 'durak_connection_id'
  const savedId = sessionStorage.getItem(storageKey)

  if (savedId) {
    return savedId
  }

  const newId = crypto.randomUUID()
  sessionStorage.setItem(storageKey, newId)

  return newId
}

  const whoIsDefending = computed(() => {
    // Защитник - это тот на кого переключили ход в режим defend
    // Если currentTurn = opponent и turnState = defend -> защищается opponent
    // Если currentTurn = player и turnState = defend -> защищается player
    if (turnState.value === 'defend') {
      return currentTurn.value
    }
    // В режиме attack - атакующий это currentTurn
    return null
  })
  const validDefenseCards = computed(() => {
    if (turnState.value !== 'defend') return []
    
    // Нужно крыть последнюю некрытую карту атаки
    const uncoveredIndex = defendCards.value.length
    if (uncoveredIndex >= attackCards.value.length) return []
    
    const cardToDefend = attackCards.value[uncoveredIndex]
    return getValidDefenseCards(
      cardToDefend,
      currentTurn.value === 'player' ? playerHand.value : opponentHand.value,
      trump.value!.suit
    )
  })

  function getGameState(): GameState {
  return {
    sessionId: sessionId.value,
    mode: mode.value,

    deck: deck.value,
    trump: trump.value,

    players: {
      player: {
        id: 'player',
        hand: playerHand.value,
        isAttacker:
          currentTurn.value === 'player' &&
          turnState.value === 'attack'
      },
      opponent: {
        id: 'opponent',
        hand: opponentHand.value,
        isAttacker:
          currentTurn.value === 'opponent' &&
          turnState.value === 'attack'
      }
    },

    attackCards: attackCards.value,
    defendCards: defendCards.value,
    discardPile: discardPile.value,

    currentTurn: currentTurn.value,
    turnState: turnState.value,

    originalAttacker: originalAttacker.value,
    canTransfer: canTransfer.value,
    hasDefended: hasDefended.value,
    isFirstRound: isFirstRound.value,

    status: status.value,
    winner: winner.value
  }
}

function applyGameState(gameState: GameState) {
  console.log('📥 applyGameState called:', {
    attackCards: gameState.attackCards?.length ?? 0,
    defendCards: gameState.defendCards?.length ?? 0,
    currentTurn: gameState.currentTurn,
    turnState: gameState.turnState,
    playerHand: gameState.players?.player?.hand?.length ?? 0,
    opponentHand: gameState.players?.opponent?.hand?.length ?? 0
  })

  sessionId.value = gameState.sessionId
  mode.value = gameState.mode
  deck.value = gameState.deck ?? []
  trump.value = gameState.trump ?? null

  playerHand.value = gameState.players?.player?.hand ?? []
  opponentHand.value = gameState.players?.opponent?.hand ?? []

  attackCards.value = gameState.attackCards ?? []
  defendCards.value = gameState.defendCards ?? []
  discardPile.value = gameState.discardPile ?? []

  currentTurn.value = gameState.currentTurn ?? 'player'
  turnState.value = gameState.turnState ?? 'attack'

  originalAttacker.value = gameState.originalAttacker ?? null
  canTransfer.value = gameState.canTransfer ?? false
  hasDefended.value = gameState.hasDefended ?? false
  isFirstRound.value = gameState.isFirstRound ?? true

  status.value = gameState.status ?? 'waiting'
  winner.value = gameState.winner ?? null
  
  console.log('✅ applyGameState done:', {
    attackCardsNow: attackCards.value.length,
    defendCardsNow: defendCards.value.length
  })
}

async function saveGameState() {
  if (!sessionId.value) return

  try {
    const state = getGameState()
    console.log('💾 Saving game state:', {
      sessionId: sessionId.value,
      attackCards: state.attackCards.length,
      defendCards: state.defendCards.length,
      currentTurn: state.currentTurn,
      turnState: state.turnState
    })
    await updateGameSession(sessionId.value, state)
    console.log('✅ Game state saved successfully')
  } catch (error) {
    console.error('❌ Ошибка обновления игры в Firebase:', error)
  }
}

async function claimRole(sid: string) {
  console.log('🔑 Claiming role with connectionId:', connectionId.value)
  
  const role = await claimPlayerRole(sid, connectionId.value)

  playerRole.value = role

  if (role) {
    console.log('✅ Роль назначена:', role, '(player = Игрок 1, opponent = Игрок 2)')
  } else {
    console.warn('❌ Не удалось получить роль: оба места заняты')
  }

  return role
}

async function loadGame(sid: string) {
  const gameState = await getGameSession(sid)

  if (
    !gameState ||
    !gameState.players ||
    !gameState.deck ||
    !gameState.trump
  ) {
    console.log('❌ Firebase game state is missing or incomplete:', sid)
    return false
  }

  console.log('✅ Firebase game state found:', sid, gameState)

  applyGameState(gameState)

  return true
}

  function initGame(sid: string, gameMode: GameMode, aiMode = false) {
    console.log('🎮 initGame started:', { sid, gameMode, aiMode })
    
    sessionId.value = sid
    mode.value = gameMode
    isAIMode.value = aiMode
    
    const newDeck = shuffleDeck(generateDeck())
    trump.value = determineTrump(newDeck)
    
    const { playerHand: ph, opponentHand: oh, remainingDeck } = dealCards(newDeck)
    playerHand.value = sortHandBySuit(ph)
    opponentHand.value = sortHandBySuit(oh)
    deck.value = remainingDeck
    
    const firstTurn = determineFirstTurn(ph, oh, trump.value.suit)
    currentTurn.value = firstTurn
    turnState.value = 'attack'
    originalAttacker.value = null
    canTransfer.value = false
    hasDefended.value = false
    isFirstRound.value = true
    
    status.value = 'playing'
    winner.value = null
    attackCards.value = []
    defendCards.value = []
    discardPile.value = []

    console.log('🎮 Game initialized locally:', {
      playerHandSize: playerHand.value.length,
      opponentHandSize: opponentHand.value.length,
      deckSize: deck.value.length,
      trump: trump.value?.id,
      firstTurn
    })

    if (aiMode && firstTurn === 'opponent') {
      setTimeout(() => aiTurn(), 1000)
    }

    const stateToSave = getGameState()
    console.log('💾 Saving initial state to Firebase:', stateToSave)

    createGameSessionIfAbsent(sid, stateToSave)
      .then((created) => {
        if (created) {
          console.log('✅ Game created in Firebase:', sid)
        } else {
          console.log('ℹ️ Session already existed:', sid)
        }
      })
      .catch((error) => {
        console.error('❌ Failed to create game in Firebase:', error)
      })
  }

  function playCard(card: Card) {
    const mySide = playerRole.value ?? 'player'
    const myHandRef = mySide === 'player' ? playerHand : opponentHand

    console.log('🎴 playCard called:', {
      card: card.id,
      mySide,
      currentTurn: currentTurn.value,
      turnState: turnState.value,
      attackCards: attackCards.value.length,
      defendCards: defendCards.value.length,
      originalAttacker: originalAttacker.value
    })

    if (currentTurn.value !== mySide) {
      console.log('❌ NOT MY TURN:', { currentTurn: currentTurn.value, mySide })
      return
    }

    if (turnState.value === 'attack') {
      // АТАКА ИГРОКА (подкидывание)
      
      // Сохраняем кто начал атаку (первая карта атаки)
      if (attackCards.value.length === 0) {
        originalAttacker.value = mySide
      }
      
      // Проверка: подкидывать можно только если защитник крыл предыдущие карты
      if (attackCards.value.length > 0 && defendCards.value.length < attackCards.value.length) {
        console.log('Нельзя подкидывать пока не все карты покрыты!')
        return
      }
      
      // Проверка рангов при подкидывании
      if (attackCards.value.length > 0) {
        const ranksOnTable = new Set([
          ...attackCards.value.map(c => c.rank),
          ...defendCards.value.map(c => c.rank)
        ])
        if (!ranksOnTable.has(card.rank)) {
          console.log('Можно подкидывать только карты тех же рангов!')
          return
        }
      }
      
      myHandRef.value = myHandRef.value.filter(c => c.id !== card.id)
      attackCards.value.push(card)
      
      // Переход к защите
      currentTurn.value = mySide === 'player' ? 'opponent' : 'player'
      turnState.value = 'defend'
      hasDefended.value = false // Сброс флага защиты
      
      // В переводном дураке можно переводить всегда (проверка на первый кон будет в условии)
      if (mode.value === 'perevolnoy') {
        canTransfer.value = true
      }

      if (isAIMode.value) {
        setTimeout(() => aiTurn(), 1000)
      }

      saveGameState()
    } else if (turnState.value === 'defend') {
      // ЗАЩИТА ИГРОКА
      
      console.log('=== ЗАЩИТА ИГРОКА ===')
      console.log('mode:', mode.value)
      console.log('canTransfer:', canTransfer.value)
      console.log('hasDefended:', hasDefended.value)
      console.log('isFirstRound:', isFirstRound.value)
      console.log('attackCards:', attackCards.value.length)
      
      // В переводном: если есть карта того же ранга и не начал отбиваться - можно перевести
      // Первый кон переводить нельзя!
      if (mode.value === 'perevolnoy' && canTransfer.value && !hasDefended.value && !isFirstRound.value) {
        const lastAttackCard = attackCards.value[attackCards.value.length - 1]
        console.log('Проверка перевода для карты:', card.rank, 'vs', lastAttackCard.rank)
        if (card.rank === lastAttackCard.rank) {
          // ПЕРЕВОД!
          myHandRef.value = myHandRef.value.filter(c => c.id !== card.id)
          attackCards.value.push(card)
          
          console.log('Игрок переводит!')
          canTransfer.value = false
          
          // Ход переходит обратно к изначальному атакующему для защиты
          if (originalAttacker.value === mySide) {
            // Я атаковал -> противник перевёл -> ход возвращается мне для защиты
            currentTurn.value = mySide
            turnState.value = 'defend'
          } else {
            // Противник атаковал -> я перевёл -> ход к противнику для защиты
            currentTurn.value = mySide === 'player' ? 'opponent' : 'player'
            turnState.value = 'defend'
            
            if (isAIMode.value) {
              setTimeout(() => aiTurn(), 1000)
            }

            saveGameState()
          }
          return
        }
      }
      
      // Обычная защита
      const validCards = validDefenseCards.value
      if (!validCards.find(c => c.id === card.id)) {
        console.log('Нельзя крыть этой картой!')
        return
      }

      myHandRef.value = myHandRef.value.filter(c => c.id !== card.id)
      defendCards.value.push(card)
      hasDefended.value = true // Начал отбиваться
      canTransfer.value = false // Больше нельзя переводить
      
      // Если все карты покрыты - переход к атакующему для подкидывания
      if (defendCards.value.length === attackCards.value.length) {
        currentTurn.value = originalAttacker.value! // Возврат хода к атакующему
        turnState.value = 'attack'
      }
      saveGameState()
    }
  }

  function aiTurn() {
    if (!isAIMode.value || currentTurn.value !== 'opponent') return

    if (turnState.value === 'attack') {
      // ИИ АТАКУЕТ ИЛИ ПОДКИДЫВАЕТ
      
      // Сохраняем кто начал атаку (первая карта атаки)
      if (attackCards.value.length === 0) {
        originalAttacker.value = 'opponent'
      }
      
      // Проверка: можно ли подкидывать (все карты должны быть покрыты)
      if (attackCards.value.length > 0 && defendCards.value.length < attackCards.value.length) {
        console.log('ИИ ждет пока покроют')
        return
      }
      
      let cardToPlay: Card | null = null
      
      if (attackCards.value.length === 0) {
        // Первая атака
        cardToPlay = findMinCard(opponentHand.value, trump.value!.suit)
      } else {
        // Подкидывание - только ранги что на столе
        const ranksOnTable = new Set([
          ...attackCards.value.map(c => c.rank),
          ...defendCards.value.map(c => c.rank)
        ])
        const validCards = opponentHand.value.filter(c => ranksOnTable.has(c.rank))
        
        if (validCards.length > 0) {
          cardToPlay = findMinCard(validCards, trump.value!.suit)
        } else {
          // Нет карт для подкидывания - автоматически "бито"
          console.log('ИИ не может подкинуть - бито')
          setTimeout(() => beatCards(), 1500)
          return
        }
      }
      
      if (cardToPlay) {
        opponentHand.value = opponentHand.value.filter(c => c.id !== cardToPlay.id)
        attackCards.value.push(cardToPlay)
        
        currentTurn.value = 'player'
        turnState.value = 'defend'
        hasDefended.value = false
        
        // В переводном дураке можно переводить всегда
        if (mode.value === 'perevolnoy') {
          canTransfer.value = true
        }
        saveGameState()
      }
    } else if (turnState.value === 'defend') {
      // ИИ ЗАЩИЩАЕТСЯ
      
      // В переводном: если есть карта того же ранга и не начал отбиваться - можно перевести
      // Первый кон переводить нельзя!
      if (mode.value === 'perevolnoy' && canTransfer.value && !hasDefended.value && !isFirstRound.value) {
        const lastAttackCard = attackCards.value[attackCards.value.length - 1]
        const transferCard = opponentHand.value.find(c => c.rank === lastAttackCard.rank)
        
        if (transferCard) {
          // ПЕРЕВОД!
          console.log('ИИ переводит!')
          opponentHand.value = opponentHand.value.filter(c => c.id !== transferCard.id)
          attackCards.value.push(transferCard)
          canTransfer.value = false
          
          // Ход переходит обратно к изначальному атакующему для защиты
          if (originalAttacker.value === 'opponent') {
            // ИИ атаковал -> игрок перевёл -> ход возвращается ИИ для защиты
            currentTurn.value = 'opponent'
            turnState.value = 'defend'
            
            setTimeout(() => aiTurn(), 1000)
          } else {
            // Игрок атаковал -> ИИ перевёл -> ход к игроку для защиты
            currentTurn.value = 'player'
            turnState.value = 'defend'
          }

          saveGameState()
          return
        }
      }
      
      // Обычная защита
      const validCards = validDefenseCards.value

      if (validCards.length > 0) {
        const defenseCard = validCards[0]
        opponentHand.value = opponentHand.value.filter(c => c.id !== defenseCard.id)
        defendCards.value.push(defenseCard)
        hasDefended.value = true
        canTransfer.value = false

        // Если все покрыто - ХОД ПЕРЕХОДИТ К АТАКУЮЩЕМУ (игроку)
        // Игрок должен нажать "Бито" или подкинуть
        if (defendCards.value.length === attackCards.value.length) {
          currentTurn.value = 'player'
          turnState.value = 'attack'
          // НЕ вызываем aiTurn() - ждём решения игрока!
        }
        saveGameState()
      } else {
        // Не может защититься - берет карты
        console.log('ИИ не может защититься - берет')
        takeCards('opponent')
      }
    }
  }

  function beatCards() {
    if (attackCards.value.length === 0) return
    if (defendCards.value.length !== attackCards.value.length) {
      console.log('Не все карты покрыты!')
      return
    }

    // Используем originalAttacker чтобы определить кто начал атаку
    const wasPlayerAttacking = originalAttacker.value === 'player'
    
    discardPile.value.push(...attackCards.value, ...defendCards.value)
    attackCards.value = []
    defendCards.value = []
    originalAttacker.value = null // Сбрасываем
    canTransfer.value = false
    hasDefended.value = false
    isFirstRound.value = false // После первого "бито" - больше не первый кон

    refillHands()

    const gameWinner = checkWinner(playerHand.value, opponentHand.value, deck.value.length)
    if (gameWinner) {
      status.value = 'finished'
      winner.value = gameWinner
      console.log('Победитель:', gameWinner)
      saveGameState()
      return
    }

    // ПРАВИЛО ДУРАКА: Кто отбился - тот атакует
    // Если игрок атаковал → ИИ отбился → ИИ теперь атакует
    // Если ИИ атаковал → Игрок отбился → Игрок теперь атакует
    if (wasPlayerAttacking) {
      // Игрок атаковал, ИИ отбился → ИИ атакует
      currentTurn.value = 'opponent'
      turnState.value = 'attack'
      if (isAIMode.value) {
        setTimeout(() => aiTurn(), 1000)
      }
    } else {
      // ИИ атаковал, игрок отбился → Игрок атакует
      currentTurn.value = 'player'
      turnState.value = 'attack'
    }
    saveGameState()
  }

  function takeCards(who: 'player' | 'opponent') {
    const cards = [...attackCards.value, ...defendCards.value]
    attackCards.value = []
    defendCards.value = []
    canTransfer.value = false
    hasDefended.value = false
    isFirstRound.value = false // После взятия карт - больше не первый кон

    if (who === 'player') {
      playerHand.value.push(...cards)
      // ПРАВИЛО: Кто взял карты - тот НЕ атакует, ход переходит к противнику
      currentTurn.value = 'opponent'
    } else {
      opponentHand.value.push(...cards)
      // ИИ взял карты - ход переходит к игроку
      currentTurn.value = 'player'
    }

    turnState.value = 'attack'
    refillHands()

    const gameWinner = checkWinner(playerHand.value, opponentHand.value, deck.value.length)
    if (gameWinner) {
      status.value = 'finished'
      winner.value = gameWinner
      console.log('Победитель:', gameWinner)
      saveGameState()
      return
    }

    // Если ход перешёл к ИИ - он атакует
    if (isAIMode.value && currentTurn.value === 'opponent') {
      setTimeout(() => aiTurn(), 1000)
    }
    saveGameState()
  }

  function refillHands() {
    if (currentTurn.value === 'player') {
      const { newHand: ph, remainingDeck: rd1 } = drawCards(playerHand.value, deck.value)
      playerHand.value = sortHandBySuit(ph)
      deck.value = rd1

      const { newHand: oh, remainingDeck: rd2 } = drawCards(opponentHand.value, deck.value)
      opponentHand.value = sortHandBySuit(oh)
      deck.value = rd2
    } else {
      const { newHand: oh, remainingDeck: rd1 } = drawCards(opponentHand.value, deck.value)
      opponentHand.value = sortHandBySuit(oh)
      deck.value = rd1

      const { newHand: ph, remainingDeck: rd2 } = drawCards(playerHand.value, deck.value)
      playerHand.value = sortHandBySuit(ph)
      deck.value = rd2
    }
  }

  return {
    sessionId,
    mode,
    playerRole,
    deck,
    trump,
    playerHand,
    opponentHand,
    myHand,
    enemyHand,
    attackCards,
    defendCards,
    discardPile,
    currentTurn,
    turnState,
    originalAttacker,
    status,
    winner,
    isAIMode,
    whoIsDefending,
    validDefenseCards,
    initGame,
    playCard,
    beatCards,
    takeCards,
    loadGame,
    applyGameState,
    saveGameState,
    claimRole,
    connectionId
  }
})
