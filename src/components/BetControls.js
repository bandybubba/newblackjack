// BetControls.js
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

  const isIdle = (gameStatus === 'idle');

  return (
    <div className="panel">
      <h3>Place Your Bet</h3>
      <p className="label-gold">Balance: ${balance}</p>
      <p className="label-gold">Current Bet: ${pendingBet}</p>

      <div style={{ marginBottom: '1rem' }}>
        <button className="dark-btn" onClick={() => placeBet(5)} disabled={!isIdle}>
          $5
        </button>
        <button className="dark-btn" onClick={() => placeBet(10)} disabled={!isIdle}>
          $10
        </button>
        <button className="dark-btn" onClick={() => placeBet(25)} disabled={!isIdle}>
          $25
        </button>
        <button className="dark-btn" onClick={() => placeBet(50)} disabled={!isIdle}>
          $50
        </button>
        <button className="dark-btn" onClick={() => placeBet(100)} disabled={!isIdle}>
          $100
        </button>
      </div>

      <button className="dark-btn" onClick={dealCards} disabled={!isIdle || pendingBet === 0}>
        Confirm Wager
      </button>
      <button className="dark-btn" onClick={clearBet} disabled={!isIdle || pendingBet === 0}>
        Clear Bet
      </button>
    </div>
  );
}

export default BetControls;
