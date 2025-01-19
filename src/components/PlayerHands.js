import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function PlayerHands() {
  const { playerHands } = useContext(GameContext);

  if (playerHands.length === 0) {
    return (
      <div style={{ border: '1px solid gray', padding: '1rem', marginBottom: '1rem' }}>
        <h3>Player Hands</h3>
        <p>No cards yet</p>
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid gray', padding: '1rem', marginBottom: '1rem' }}>
      <h3>Player Hands</h3>

      {playerHands.map((hand, handIndex) => (
        <div key={handIndex} style={{ marginBottom: '0.5rem' }}>
          <strong>Hand {handIndex + 1}:</strong>
          {hand.map((card, cardIndex) => (
            <span key={cardIndex} style={{ marginLeft: '1rem' }}>
              {card.rank}{card.suit}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export default PlayerHands;
