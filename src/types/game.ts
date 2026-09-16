export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'

export type Rank = '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A'

export type GameMode = 'podkidnoy' | 'perevolnoy'

export interface Card {
  id: string
  suit: Suit
  rank: Rank
  value: number

  customDesign?: {
    imageUrl?: string
  }
}

export interface PlayerState {
  id: string
  hand: Card[]
  isAttacker: boolean
}

export interface GameState {
  sessionId: string
  mode: GameMode

  deck: Card[]
  trump: Card | null

  players: {
    player: PlayerState
    opponent: PlayerState
  }

  attackCards: Card[]
  defendCards: Card[]
  discardPile: Card[]

  currentTurn: 'player' | 'opponent'
  turnState: 'attack' | 'defend'

  originalAttacker: 'player' | 'opponent' | null
  canTransfer: boolean
  hasDefended: boolean
  isFirstRound: boolean

  status: 'waiting' | 'playing' | 'finished'
  winner: 'player' | 'opponent' | 'draw' | null
}