// File: src/components/PlayerHands.js

import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { calculateHandValue } from '../utils/cardUtils';
import Card from './Card'; // <-- import our new Card component

function PlayerHands() {
  const {
    playerHands,
    playerBets,
    currentHandIndex
  } = useContext(GameContext);

  if (playerHands.length === 0) {
    return (
      <div className="panel">
        <h3>Player</h3>
        <p>No cards yet</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <h3>Player</h3>
      {playerHands.map((hand, handIndex) => {
        const bet = playerBets[handIndex] || 0;
        const handValue = calculateHandValue(hand);
        const isActive = (handIndex === currentHandIndex);

        return (
          <div key={handIndex} style={{ marginBottom: '1rem' }}>
            <strong>Hand {handIndex + 1}</strong>
            {isActive && <span style={{ marginLeft: '1rem', color: 'yellow' }}>ACTIVE</span>}
            <span style={{ marginLeft: '1rem' }}>Bet: {bet}</span>
            <div style={{ marginTop: '0.5rem' }}>
              {hand.map((card, cardIdx) => (
                <Card
                  key={cardIdx}
                  rank={card.rank}
                  suit={card.suit}
                  hidden={false} 
                  // Player's cards usually aren't hidden, 
                  // but you can pass 'card.hidden' if your logic needs it
                />
              ))}
            </div>
            <div>Value: {handValue}</div>
          </div>
        );
      })}
    </div>
  );
}

export default PlayerHands;
