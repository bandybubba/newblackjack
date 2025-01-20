// StatusMessage.js
import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function StatusMessage() {
  const { statusMessage } = useContext(GameContext);

  return (
    <div className="panel mb-1">
      <h3>Status</h3>
      <p>{statusMessage || 'No current status...'}</p>
    </div>
  );
}

export default StatusMessage;
