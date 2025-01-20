// File: src/components/DealerHand.js

import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import Card from './Card'; //  <-- IMPORTANT: import our new Card component

function DealerHand() {
  const { dealerHand, gameStatus } = useContext(GameContext);

  return (
    <div className="panel">
      <h3>Dealer</h3>
      {dealerHand.length === 0 ? (
        <p>No cards yet</p>
      ) : (
        <div>
          {dealerHand.map((card, idx) => (
            <Card
              key={idx}
              rank={card.rank}       // e.g. 'A', 'K', '3', etc.
              suit={card.suit}       // e.g. '♠', '♦', etc.
              hidden={card.hidden && gameStatus === 'playerTurn'}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default DealerHand;
