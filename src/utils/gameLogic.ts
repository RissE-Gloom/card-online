import type { Card, Suit, Rank } from '@/types/game'

/**
 * Генерация колоды из 36 карт
 */
export function generateDeck(): Card[] {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']
  const ranks: Rank[] = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
  const values: Record<Rank, number> = {
    '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'J': 11, 'Q': 12, 'K': 13, 'A': 14
  }

  const deck: Card[] = []

  for (const suit of suits) {
    for (const rank of ranks) {
      const cardId = `${suit}-${rank}`
      deck.push({
        id: cardId,
        suit,
        rank,
        value: values[rank],
        customDesign: {
          imageUrl: new URL(`../assets/cards/${cardId}.webp`, import.meta.url).href
        }
      })
    }
  }

  return deck
}

/**
 * Перетасовка колоды (Fisher-Yates)
 */
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck]
  let currentIndex = shuffled.length

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // Swap
    const temp = shuffled[currentIndex]
    shuffled[currentIndex] = shuffled[randomIndex]
    shuffled[randomIndex] = temp
  }

  return shuffled
}

/**
 * Определение козыря (случайная масть)
 */
export function determineTrump(deck: Card[]): Card {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']
  const randomSuit = suits[Math.floor(Math.random() * suits.length)]
  
  // Находим любую карту этой масти в колоде для отображения
  const trumpCard = deck.find(c => c.suit === randomSuit)
  return trumpCard || deck[deck.length - 1]
}

/**
 * Раздача карт игрокам
 */
export function dealCards(deck: Card[], cardsPerPlayer: number = 6): {
  playerHand: Card[]
  opponentHand: Card[]
  remainingDeck: Card[]
} {
  const deckCopy = [...deck]
  const playerHand: Card[] = []
  const opponentHand: Card[] = []

  // Раздаем по карте поочередно
  for (let i = 0; i < cardsPerPlayer; i++) {
    playerHand.push(deckCopy.shift()!)
    opponentHand.push(deckCopy.shift()!)
  }

  return {
    playerHand,
    opponentHand,
    remainingDeck: deckCopy
  }
}

/**
 * Определение кто ходит первым (у кого меньший козырь)
 */
export function determineFirstTurn(
  playerHand: Card[],
  opponentHand: Card[],
  trumpSuit: Suit
): 'player' | 'opponent' {
  const playerTrumps = playerHand
    .filter(c => c.suit === trumpSuit)
    .map(c => c.value)
  
  const opponentTrumps = opponentHand
    .filter(c => c.suit === trumpSuit)
    .map(c => c.value)

  const playerMinTrump = playerTrumps.length > 0 ? Math.min(...playerTrumps) : Infinity
  const opponentMinTrump = opponentTrumps.length > 0 ? Math.min(...opponentTrumps) : Infinity

  // Если у обоих нет козырей, ходит игрок
  if (playerMinTrump === Infinity && opponentMinTrump === Infinity) {
    return 'player'
  }
  
  // Если у одного нет козырей, ходит другой
  if (playerMinTrump === Infinity) return 'opponent'
  if (opponentMinTrump === Infinity) return 'player'

  // У кого меньший козырь, тот ходит
  return playerMinTrump < opponentMinTrump ? 'player' : 'opponent'
}

/**
 * Найти карты, которыми можно крыть атакующую карту
 */
export function getValidDefenseCards(
  attackCard: Card,
  defenderHand: Card[],
  trumpSuit: Suit
): Card[] {
  const validCards: Card[] = []

  for (const card of defenderHand) {
    // 1. Козырь всегда кроет не козырь
    if (attackCard.suit !== trumpSuit && card.suit === trumpSuit) {
      validCards.push(card)
      continue
    }

    // 2. Карта той же масти старше рангом
    if (card.suit === attackCard.suit && card.value > attackCard.value) {
      validCards.push(card)
      continue
    }

    // 3. Козырь кроет козырь если старше
    if (
      attackCard.suit === trumpSuit && 
      card.suit === trumpSuit && 
      card.value > attackCard.value
    ) {
      validCards.push(card)
    }
  }

  // Сортируем: сначала не козыри, потом козыри, по возрастанию значения
  return validCards.sort((a, b) => {
    if (a.suit === trumpSuit && b.suit !== trumpSuit) return 1
    if (a.suit !== trumpSuit && b.suit === trumpSuit) return -1
    return a.value - b.value
  })
}

/**
 * Найти минимальную карту для атаки (предпочтительно не козырь)
 */
export function findMinCard(hand: Card[], trumpSuit: Suit): Card {
  if (hand.length === 1) return hand[0]

  const nonTrumps = hand.filter(c => c.suit !== trumpSuit)
  const trumps = hand.filter(c => c.suit === trumpSuit)

  // Предпочитаем не козыри
  if (nonTrumps.length > 0) {
    return nonTrumps.reduce((min, card) => 
      card.value < min.value ? card : min
    )
  }

  // Если только козыри, берем минимальный
  return trumps.reduce((min, card) => 
    card.value < min.value ? card : min
  )
}

/**
 * Добор карт из колоды до 6 штук
 */
export function drawCards(hand: Card[], deck: Card[], maxCards: number = 6): {
  newHand: Card[]
  remainingDeck: Card[]
} {
  const newHand = [...hand]
  const remainingDeck = [...deck]

  while (newHand.length < maxCards && remainingDeck.length > 0) {
    newHand.push(remainingDeck.shift()!)
  }

  return { newHand, remainingDeck }
}

/**
 * Проверка на победу
 */
export function checkWinner(
  playerHand: Card[],
  opponentHand: Card[],
  deckRemaining: number
): 'player' | 'opponent' | 'draw' | null {
  // Игра продолжается если есть карты в колоде
  if (deckRemaining > 0) return null

  // Игра продолжается если у обоих есть карты
  if (playerHand.length > 0 && opponentHand.length > 0) return null

  // Ничья - у обоих закончились карты
  if (playerHand.length === 0 && opponentHand.length === 0) return 'draw'

  // Проигрывает тот, у кого остались карты
  return playerHand.length > 0 ? 'opponent' : 'player'
}

/**
 * Сортировка карт в руке по масти и рангу
 */
export function sortHandBySuit(hand: Card[]): Card[] {
  const suitOrder: Record<Suit, number> = {
    hearts: 0,
    diamonds: 1,
    clubs: 2,
    spades: 3
  }
  
  return [...hand].sort((a, b) => {
    // Сначала по масти
    if (suitOrder[a.suit] !== suitOrder[b.suit]) {
      return suitOrder[a.suit] - suitOrder[b.suit]
    }
    // Потом по рангу
    return a.value - b.value
  })
}
