// App.js
import React from 'react';
import BetControls from './components/BetControls';
import DealerHand from './components/DealerHand';
import PlayerHands from './components/PlayerHands';
import ActionButtons from './components/ActionButtons';
import StatusMessage from './components/StatusMessage';


// REMOVED old inline styling from the return
// ADDED className="blackjack-table" for the new layout
function App() {
  return (
    <div className="blackjack-table">
      {/* 
        The main container that displays:
         - table background
         - table overlay 
         - all child components 
      */}
      <div className="table-background" />
      <div className="table-overlay" />

      {/* 
        Below are your existing components in the same order,
        but no inline border/padding. We rely on CSS.
      */}
      <BetControls />
      <DealerHand />
      <PlayerHands />
      <ActionButtons />
      <StatusMessage />
    </div>
  );
}

export default App;
