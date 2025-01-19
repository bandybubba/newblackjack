import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function BetControls() {
  const {
    balance,
    pendingBet,
    placeBet,
    clearBet,
    dealCards,
    gameStatus
  } = useContext(GameContext);

  // Only allow bet/clear/deal if gameStatus is "idle"
  const isIdle = (gameStatus === 'idle');

  return (
    <div style={{ border: '1px solid gray', padding: '1rem', marginBottom: '1rem' }}>
      <h3>Bet Controls</h3>
      <p>Balance: {balance}</p>
      <p>Pending Bet: {pendingBet}</p>

      <button onClick={() => placeBet(10)} disabled={!isIdle}>
        Bet 10
      </button>
      <button onClick={() => placeBet(50)} disabled={!isIdle}>
        Bet 50
      </button>
      <button onClick={() => placeBet(100)} disabled={!isIdle}>
        Bet 100
      </button>

      <button onClick={dealCards} disabled={!isIdle || pendingBet === 0}>
        Deal
      </button>
      <button onClick={clearBet} disabled={!isIdle || pendingBet === 0}>
        Clear Bet
      </button>
    </div>
  );
}

export default BetControls;
