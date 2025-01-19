import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function StatusMessage() {
  const { statusMessage } = useContext(GameContext);

  return (
    <div style={{ border: '1px solid gray', padding: '1rem' }}>
      <h3>Status Message</h3>
      <p>{statusMessage || 'No current status...'}</p>
    </div>
  );
}

export default StatusMessage;
