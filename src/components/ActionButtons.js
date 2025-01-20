// File: src/components/ActionButtons.js

import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import './/ActionButtons.css'; // <--- Import the new CSS

function ActionButtons() {
  const {
    gameStatus,
    balance,
    playerHands,
    playerBets,
    currentHandIndex,
    playerHit,
    playerStand,
    playerDoubleDown,
    playerSplit
  } = useContext(GameContext);

  const isPlayerTurn = (gameStatus === 'playerTurn');

  // Calculate canDouble
  let canDouble = false;
  if (isPlayerTurn && playerHands[currentHandIndex]) {
    const bet = playerBets[currentHandIndex] || 0;
    if (balance >= bet) {
      canDouble = true;
    }
  }

  // Calculate canSplit
  let canSplit = false;
  if (isPlayerTurn && playerHands[currentHandIndex]) {
    const hand = playerHands[currentHandIndex];
    if (hand.length === 2) {
      const [c1, c2] = hand;
      const c1Val = c1.rank === 'A' ? 11 : c1.value;
      const c2Val = c2.rank === 'A' ? 11 : c2.value;
      const sameRank = (c1.rank === c2.rank) || (c1Val === 10 && c2Val === 10);

      const betNeeded = playerBets[currentHandIndex];
      if (sameRank && balance >= betNeeded) {
        canSplit = true;
      }
    }
  }

  return (
    <div className="action-buttons">
      <button
        className="round-button"
        onClick={playerHit}
        disabled={!isPlayerTurn}
      >
        Hit
      </button>
      <button
        className="round-button"
        onClick={playerStand}
        disabled={!isPlayerTurn}
      >
        Stand
      </button>
      <button
        className="round-button"
        onClick={playerDoubleDown}
        disabled={!canDouble}
      >
        Double
      </button>
      <button
        className="round-button"
        onClick={playerSplit}
        disabled={!canSplit}
      >
        Split
      </button>
    </div>
  );
}

export default ActionButtons;
