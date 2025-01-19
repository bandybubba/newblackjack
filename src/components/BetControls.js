import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function BetControls() {
  const {
    balance,
    currentBet,
    placeBet,
    clearBet,
    dealCards,
    gameStatus
  } = useContext(GameContext);

  const isIdle = (gameStatus === 'idle');

  return (
    <div style={{ border: '1px solid gray', padding: '1rem', marginBottom: '1rem' }}>
      <h3>Bet Controls</h3>
      <p>Balance: {balance}</p>
      <p>Current Bet: {currentBet}</p>

      {/* Bet 10 button, disabled if not idle */}
      <button
        onClick={() => placeBet(10)}
        disabled={!isIdle}
      >
        Bet 10
      </button>

      {/* "Deal" is enabled only if we have a non-zero currentBet AND we are idle */}
      <button
        onClick={dealCards}
        disabled={currentBet === 0 || !isIdle}
      >
        Deal
      </button>

      {/* Clear Bet button disabled if not idle */}
      <button
        onClick={clearBet}
        disabled={!isIdle}
      >
        Clear Bet
      </button>
    </div>
  );
}

export default BetControls;
