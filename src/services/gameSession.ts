import { ref, set, get, onValue, update, runTransaction } from 'firebase/database'
import { db } from '@/firebase'
import type { GameState } from '@/types/game'

export async function createGameSession(
  sessionId: string,
  gameState: GameState
) {
  const sessionRef = ref(db, `sessions/${sessionId}`)

  // Используем update вместо set, чтобы не перезаписать connections
  await update(sessionRef, gameState as any)
}

export async function createGameSessionIfAbsent(
  sessionId: string,
  gameState: GameState
): Promise<boolean> {
  const sessionRef = ref(db, `sessions/${sessionId}`)

  const result = await runTransaction(sessionRef, (currentData) => {
    if (currentData?.players) {
      return
    }

    return {
      ...(currentData ?? {}),
      ...gameState
    }
  })

  return result.committed
}

export async function getGameSession(
  sessionId: string
): Promise<GameState | null> {
  const sessionRef = ref(db, `sessions/${sessionId}`)

  console.log('🔍 getGameSession called for:', sessionId)
  const snapshot = await get(sessionRef)

  if (!snapshot.exists()) {
    console.log('❌ Snapshot does not exist')
    return null
  }

  const data = snapshot.val() as GameState
  console.log('✅ Snapshot data:', {
    hasPlayers: !!data.players,
    playerHandSize: data.players?.player?.hand?.length ?? 0,
    opponentHandSize: data.players?.opponent?.hand?.length ?? 0,
    hasTrump: !!data.trump,
    hasDeck: !!data.deck,
    deckSize: data.deck?.length ?? 0,
    currentTurn: data.currentTurn,
    turnState: data.turnState,
    attackCards: data.attackCards?.length ?? 0,
    defendCards: data.defendCards?.length ?? 0
  })

  return data
}

export function subscribeToGameSession(
  sessionId: string,
  callback: (gameState: GameState | null) => void
) {
  const sessionRef = ref(db, `sessions/${sessionId}`)

  return onValue(sessionRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback(null)
      return
    }

    callback(snapshot.val() as GameState)
  })
}

export async function updateGameSession(
  sessionId: string,
  changes: Partial<GameState>
) {
  const sessionRef = ref(db, `sessions/${sessionId}`)

  await update(sessionRef, changes)
}

export async function claimPlayerRole(
  sessionId: string,
  connectionId: string
): Promise<'player' | 'opponent' | null> {
  console.log('🔑 claimPlayerRole called:', { sessionId, connectionId })
  
  const connectionsRef = ref(db, `sessions/${sessionId}/connections`)
  
  let assignedRole: 'player' | 'opponent' | null = null

  const result = await runTransaction(connectionsRef, (connections) => {
    console.log('📦 Transaction - current connections:', connections)
    
    if (!connections) {
      assignedRole = 'player'
      console.log('✨ No connections - assigning PLAYER')
      return {
        player: connectionId
      }
    }

    if (connections.player === connectionId) {
      assignedRole = 'player'
      console.log('✅ Already connected as PLAYER')
      return connections
    }

    if (connections.opponent === connectionId) {
      assignedRole = 'opponent'
      console.log('✅ Already connected as OPPONENT')
      return connections
    }

    if (!connections.player) {
      assignedRole = 'player'
      console.log('✨ Player slot empty - assigning PLAYER')
      connections.player = connectionId
      return connections
    }

    if (!connections.opponent) {
      assignedRole = 'opponent'
      console.log('✨ Opponent slot empty - assigning OPPONENT')
      connections.opponent = connectionId
      return connections
    }

    // Оба места заняты
    assignedRole = null
    console.log('❌ Both slots occupied')
    return
  })

  console.log('📊 Transaction result:', { committed: result.committed, assignedRole })

  if (!result.committed) {
    return null
  }

  return assignedRole
}