import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function ActionButtons() {
  const {
    gameStatus,
    balance,
    currentBet,
    playerHit,
    playerStand,
    playerDoubleDown
  } = useContext(GameContext);

  const isPlayerTurn = (gameStatus === 'playerTurn');
  // We need at least currentBet in balance to double
  const canDouble = (balance >= currentBet) && isPlayerTurn;

  return (
    <div style={{ border: '1px solid gray', padding: '1rem', marginBottom: '1rem' }}>
      <h3>Action Buttons</h3>
      <button onClick={playerHit} disabled={!isPlayerTurn}>
        Hit
      </button>
      <button onClick={playerStand} disabled={!isPlayerTurn}>
        Stand
      </button>
      <button onClick={playerDoubleDown} disabled={!canDouble}>
        Double
      </button>
      <button disabled>Split</button>
    </div>
  );
}

export default ActionButtons;
