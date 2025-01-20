// DealerHand.js
import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function DealerHand() {
  const { dealerHand } = useContext(GameContext);

  return (
    <div className="panel">
      <h3>Dealer</h3>
      {dealerHand.length === 0 ? (
        <p>No cards yet</p>
      ) : (
        <div>
          {dealerHand.map((card, idx) => (
            <span key={idx} style={{ marginRight: '0.5rem' }}>
              {card.rank}{card.suit}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default DealerHand;
