import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function DealerHand() {
  const { dealerHand } = useContext(GameContext);

  return (
    <div style={{ border: '1px solid gray', padding: '1rem', marginBottom: '1rem' }}>
      <h3>Dealer Hand</h3>
      {dealerHand.length === 0 ? (
        <p>No cards yet</p>
      ) : (
        <div>
          {dealerHand.map((card, index) => (
            <span key={index} style={{ marginRight: '1rem' }}>
              {card.rank}{card.suit}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default DealerHand;
