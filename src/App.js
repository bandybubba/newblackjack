import React from 'react';
import BetControls from './components/BetControls';
import DealerHand from './components/DealerHand';
import PlayerHands from './components/PlayerHands';
import ActionButtons from './components/ActionButtons';
import StatusMessage from './components/StatusMessage';

function App() {
  return (
    <div style={{ maxWidth: '700px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h1>Blackjack with Splitting</h1>
      
      <BetControls />
      <DealerHand />
      <PlayerHands />
      <ActionButtons />
      <StatusMessage />
    </div>
  );
}

export default App;
