import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function DealerHand() {
  const { dealerHand, gameStatus } = useContext(GameContext);

  return (
    <div style={{ border: '1px solid gray', padding: '1rem', marginBottom: '1rem' }}>
      <h3>Dealer Hand</h3>
      {dealerHand.length === 0 ? (
        <p>No cards yet</p>
      ) : (
        <div>
          {dealerHand.map((card, idx) => {
            if (card.hidden && gameStatus === 'playerTurn') {
              // Show placeholder card back
              return (
                <span
                  key={idx}
                  style={{ 
                    display: 'inline-block',
                    width: '40px', height: '60px',
                    backgroundColor: 'darkblue',
                    marginRight: '0.5rem'
                  }}
                >
                  {/* Card Back Image or "??" */}
                </span>
              );
            } else {
              // Show actual card
              return (
                <span key={idx} style={{ marginRight: '0.5rem' }}>
                  {card.rank}{card.suit}
                </span>
              );
            }
          })}
        </div>
      )}
    </div>
  );
}

export default DealerHand;
