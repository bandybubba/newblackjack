import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { calculateHandValue } from '../utils/cardUtils';

function PlayerHands() {
  const {
    playerHands,
    playerBets,
    currentHandIndex
  } = useContext(GameContext);

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
      {playerHands.map((hand, handIndex) => {
        const bet = playerBets[handIndex] || 0;
        const handValue = calculateHandValue(hand);
        const isActive = (handIndex === currentHandIndex);

        return (
          <div
            key={handIndex}
            style={{
              marginBottom: '1rem',
              border: isActive ? '2px solid yellow' : '1px solid gray',
              padding: '0.5rem'
            }}
          >
            <strong>Hand {handIndex + 1}</strong> 
            <span style={{ marginLeft: '1rem' }}>Bet: {bet}</span>
            <div style={{ marginTop: '0.5rem' }}>
              {hand.map((card, cardIdx) => (
                <span key={cardIdx} style={{ marginRight: '0.5rem' }}>
                  {card.rank}{card.suit}
                </span>
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
