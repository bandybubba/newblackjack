import React, { createContext, useState, useEffect } from 'react';
import {
  createDeck,
  shuffleDeck,
  calculateHandValue
} from '../utils/cardUtils';

export const GameContext = createContext();

export function GameContextProvider({ children }) {
  const [balance, setBalance] = useState(1000);
  const [currentBet, setCurrentBet] = useState(0);

  const [deck, setDeck] = useState([]);
  const [playerHands, setPlayerHands] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);

  /**
   * gameStatus can be:
   *  - 'idle'       => can place bets
   *  - 'playerTurn' => after dealing (or no immediate blackjack)
   *  - 'dealerTurn' => after player stands or doubles
   *  - 'idle' again after round ends
   */
  const [gameStatus, setGameStatus] = useState('idle');
  const [statusMessage, setStatusMessage] = useState('');

  /**********************************************************
   * Betting Functions
   **********************************************************/
  function placeBet(amount) {
    if (gameStatus !== 'idle') {
      console.log('Cannot place a bet while a round is in progress.');
      return;
    }
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      setCurrentBet(prev => prev + amount);
    } else {
      console.log('Not enough balance to place that bet.');
    }
  }

  function clearBet() {
    if (gameStatus !== 'idle') {
      console.log('Cannot clear bet during a round.');
      return;
    }
    setBalance(prev => prev + currentBet);
    setCurrentBet(0);
  }

  /**********************************************************
   * dealCards
   * - Creates a new deck & shuffles
   * - Clears old hands
   * - Deals 2 cards to player, 2 to dealer
   **********************************************************/
  function dealCards() {
    if (currentBet === 0) {
      console.log('No bet placed. Cannot deal.');
      return;
    }
    if (gameStatus !== 'idle') {
      console.log('Round in progress. Cannot deal again.');
      return;
    }

    let freshDeck = createDeck();
    freshDeck = shuffleDeck(freshDeck);

    setPlayerHands([]);
    setDealerHand([]);

    const playerFirstHand = [freshDeck.pop(), freshDeck.pop()];
    const newDealerHand = [freshDeck.pop(), freshDeck.pop()];

    setDeck(freshDeck);
    setPlayerHands([playerFirstHand]);
    setDealerHand(newDealerHand);

    setGameStatus('playerTurn');
    setStatusMessage('Dealt cards. Checking for blackjack...');
  }

  /**********************************************************
   * Immediate Blackjack Check
   **********************************************************/
  useEffect(() => {
    if (
      gameStatus === 'playerTurn' &&
      playerHands.length > 0 &&
      dealerHand.length === 2
    ) {
      checkImmediateBlackjack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStatus, playerHands, dealerHand]);

  function checkImmediateBlackjack() {
    const playerHand = playerHands[0] || [];
    const dealerVal = calculateHandValue(dealerHand);
    const playerVal = calculateHandValue(playerHand);

    const isPlayerBJ = playerVal === 21 && playerHand.length === 2;
    const isDealerBJ = dealerVal === 21 && dealerHand.length === 2;

    if (isPlayerBJ || isDealerBJ) {
      if (isPlayerBJ && isDealerBJ) {
        setStatusMessage('Push! Both have Blackjack.');
        setBalance(prev => prev + currentBet);
      } else if (isPlayerBJ) {
        setStatusMessage('Blackjack! You win 3:2 payout!');
        const blackjackPayout = currentBet + Math.floor(currentBet * 1.5);
        setBalance(prev => prev + blackjackPayout);
      } else if (isDealerBJ) {
        setStatusMessage('Dealer has Blackjack! You lose.');
      }
      setCurrentBet(0);
      setGameStatus('idle');
    } else {
      setStatusMessage('Your turn! Hit, Stand, or Double.');
    }
  }

  /**********************************************************
   * Player Actions: HIT, STAND, DOUBLE
   **********************************************************/
  function playerHit() {
    if (gameStatus !== 'playerTurn') {
      console.log('Cannot HIT if not your turn.');
      return;
    }
    if (playerHands.length === 0) {
      console.log('No player hands exist!');
      return;
    }

    const newDeck = [...deck];
    const newCard = newDeck.pop();

    const updatedHands = [...playerHands];
    updatedHands[0] = [...updatedHands[0], newCard];

    setDeck(newDeck);
    setPlayerHands(updatedHands);

    const newValue = calculateHandValue(updatedHands[0]);
    if (newValue > 21) {
      setStatusMessage(`You busted with ${newValue}! Dealer wins.`);
      setCurrentBet(0);
      setGameStatus('idle');
    } else {
      setStatusMessage(`You have ${newValue}. Hit, Stand, or Double?`);
    }
  }

  function playerStand() {
    if (gameStatus !== 'playerTurn') {
      console.log('Cannot STAND if not your turn.');
      return;
    }
    setStatusMessage("You stand. Dealer's turn...");
    setGameStatus('dealerTurn');
  }

  /**
   * playerDoubleDown - doubles currentBet (if balance allows),
   * draws exactly 1 card, then stands.
   */
  function playerDoubleDown() {
    if (gameStatus !== 'playerTurn') {
      console.log('Cannot DOUBLE if not your turn.');
      return;
    }
    // Check if player can afford to double
    if (balance < currentBet) {
      setStatusMessage('Not enough balance to Double.');
      return;
    }

    // Deduct an additional bet from balance
    setBalance(prev => prev - currentBet);
    // Now the total bet is effectively currentBet * 2
    setCurrentBet(prev => prev * 2);

    // Draw exactly 1 card
    const newDeck = [...deck];
    const newCard = newDeck.pop();

    const updatedHands = [...playerHands];
    updatedHands[0] = [...updatedHands[0], newCard];

    setDeck(newDeck);
    setPlayerHands(updatedHands);

    const newValue = calculateHandValue(updatedHands[0]);
    if (newValue > 21) {
      // Busted
      setStatusMessage(`You busted on Double with ${newValue}! Dealer wins.`);
      setCurrentBet(0);
      setGameStatus('idle');
    } else {
      // If not busted, we force a stand
      setStatusMessage(`You have ${newValue} after Double. Dealer's turn...`);
      setGameStatus('dealerTurn');
    }
  }

  /**********************************************************
   * Dealer Turn
   **********************************************************/
  useEffect(() => {
    if (gameStatus === 'dealerTurn') {
      dealerPlay();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStatus]);

  function dealerPlay() {
    let newDealerHand = [...dealerHand];
    let newDeck = [...deck];

    let dealerVal = calculateHandValue(newDealerHand);

    while (dealerVal < 17 && newDeck.length > 0) {
      const card = newDeck.pop();
      newDealerHand.push(card);
      dealerVal = calculateHandValue(newDealerHand);
    }

    setDeck(newDeck);
    setDealerHand(newDealerHand);

    // Compare final
    const playerHand = playerHands[0] || [];
    const playerVal = calculateHandValue(playerHand);

    if (dealerVal > 21) {
      setStatusMessage(`Dealer busts with ${dealerVal}! You win.`);
      // Win => double your bet
      setBalance(prev => prev + currentBet * 2);
    } else {
      if (dealerVal > playerVal) {
        setStatusMessage(`Dealer has ${dealerVal}, you have ${playerVal}. You lose.`);
      } else if (dealerVal < playerVal) {
        setStatusMessage(`Dealer has ${dealerVal}, you have ${playerVal}. You win!`);
        setBalance(prev => prev + currentBet * 2);
      } else {
        setStatusMessage(`Dealer also has ${dealerVal}. It's a push!`);
        setBalance(prev => prev + currentBet);
      }
    }

    setCurrentBet(0);
    setGameStatus('idle');
  }

  const contextValue = {
    balance,
    currentBet,
    playerHands,
    dealerHand,
    gameStatus,
    statusMessage,

    placeBet,
    clearBet,
    dealCards,

    // Player actions
    playerHit,
    playerStand,
    playerDoubleDown
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
}
