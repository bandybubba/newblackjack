import React from 'react';
import BetControls from './components/BetControls';
import ActionButtons from './components/ActionButtons';
import DealerHand from './components/DealerHand';
import PlayerHands from './components/PlayerHands';
import StatusMessage from './components/StatusMessage';

function App() {
  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h1>Blackjack React</h1>
      <BetControls />
      <DealerHand />
      <PlayerHands />
      <ActionButtons />
      <StatusMessage />
    </div>
  );
}

export default App;
