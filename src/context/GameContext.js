import React, { createContext, useState, useEffect } from 'react';
import {
  createDeck,
  shuffleDeck,
  calculateHandValue
} from '../utils/cardUtils';

export const GameContext = createContext();

export function GameContextProvider({ children }) {
  /**********************************************************
   * Primary States
   **********************************************************/
  // The player's total balance of chips
  const [balance, setBalance] = useState(1000);

  // The bet the user is accumulating before dealing.
  // Once they click "Deal," it transfers into playerBets[0].
  const [pendingBet, setPendingBet] = useState(0);

  // The current deck in use. Once we run out, we might re-shuffle if needed.
  const [deck, setDeck] = useState([]);

  // Multiple hands and corresponding bets
  // Example: if we have 2 hands from splitting, we might have
  // playerHands = [ [card1, card2], [card3, card4] ]
  // playerBets  = [ betForHand1, betForHand2 ]
  const [playerHands, setPlayerHands] = useState([]);
  const [playerBets, setPlayerBets] = useState([]);

  // Which hand the player is currently acting on
  const [currentHandIndex, setCurrentHandIndex] = useState(0);

  // The dealer's cards
  const [dealerHand, setDealerHand] = useState([]);

  // Game flow state
  // "idle" => can place bets
  // "playerTurn" => we iterate through each hand in sequence
  // "dealerTurn" => the dealer draws
  // Return to "idle" after the round finishes
  const [gameStatus, setGameStatus] = useState('idle');

  // A string that displays the current status or instructions in the UI
  const [statusMessage, setStatusMessage] = useState('');

  // <<< ADDED: A tiny helper to create delays for the dealer’s reveal/draw
  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**********************************************************
   * Betting (pendingBet) Functions
   **********************************************************/

  /**
   * placeBet - called by "Bet" buttons.
   * Deducts from balance, adds to pendingBet (only if gameStatus is idle).
   */
  function placeBet(amount) {
    if (gameStatus !== 'idle') {
      console.log('Cannot place a bet while a round is in progress.');
      return;
    }
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      setPendingBet(prev => prev + amount);
    } else {
      console.log('Not enough balance to place that bet.');
    }
  }

  /**
   * clearBet - returns pendingBet to balance, resets pendingBet to 0
   * Only valid if idle.
   */
  function clearBet() {
    if (gameStatus !== 'idle') {
      console.log('Cannot clear bet during a round.');
      return;
    }
    setBalance(prev => prev + pendingBet);
    setPendingBet(0);
  }

  /**********************************************************
   * dealCards - start a new round
   * Moves pendingBet into playerBets[0], deals 2 cards to player, 2 to dealer
   **********************************************************/
  function dealCards() {
    if (pendingBet === 0) {
      console.log('No bet placed. Cannot deal.');
      return;
    }
    if (gameStatus !== 'idle') {
      console.log('Round in progress. Cannot deal again.');
      return;
    }

    // 1) Create & shuffle a fresh deck
    let freshDeck = createDeck();
    freshDeck = shuffleDeck(freshDeck);

    // 2) Clear previous round data
    setPlayerHands([]);
    setPlayerBets([]);
    setDealerHand([]);
    setCurrentHandIndex(0);

    // 3) Deal 2 cards to player, 2 to dealer
    const playerFirstHand = [freshDeck.pop(), freshDeck.pop()];
    const dealerCard1 = freshDeck.pop();
    const dealerCard2 = { ...freshDeck.pop(), hidden: true };  // mark hidden
    const newDealerHand = [dealerCard1, dealerCard2];

    setDealerHand(newDealerHand);

    // 4) Set the deck
    setDeck(freshDeck);

    // 5) Set the initial hands/bets
    setPlayerHands([playerFirstHand]);
    setPlayerBets([pendingBet]);

    // We zero out pendingBet once it transfers to playerBets
    setPendingBet(0);

    setDealerHand(newDealerHand);

    // 6) Switch to playerTurn
    setGameStatus('playerTurn');
    setStatusMessage('Dealt cards. Checking for blackjack...');
  }

  /**********************************************************
   * Immediate Blackjack Check
   * We run this once we've just dealt (gameStatus = 'playerTurn').
   * If the player or dealer has 21 in the initial 2 cards:
   *   - If both => push
   *   - If only player => 3:2 payout
   *   - If only dealer => lose
   **********************************************************/
  useEffect(() => {
    // We only run this right after the initial deal:
    if (
      gameStatus === 'playerTurn' &&
      playerHands.length === 1 &&
      playerHands[0].length === 2 &&
      dealerHand.length === 2
    ) {
      // Inline the logic from checkImmediateBlackjack here:
      const firstHand = playerHands[0] || [];
      const dealerVal = calculateHandValue(dealerHand);
      const playerVal = calculateHandValue(firstHand);
  
      const isPlayerBJ = (playerVal === 21 && firstHand.length === 2);
      const isDealerBJ = (dealerVal === 21 && dealerHand.length === 2);
  
      if (isPlayerBJ || isDealerBJ) {
        const theBets = [...playerBets];
        const initialBet = theBets[0];
  
        if (isPlayerBJ && isDealerBJ) {
          setStatusMessage('Push! Both have Blackjack.');
          setBalance(prev => prev + initialBet);
        } else if (isPlayerBJ) {
          setStatusMessage('Blackjack! You win 3:2 payout!');
          const blackjackPayout = initialBet + Math.floor(initialBet * 1.5);
          setBalance(prev => prev + blackjackPayout);
        } else if (isDealerBJ) {
          setStatusMessage('Dealer has Blackjack! You lose.');
        }
        theBets[0] = 0;
        setPlayerBets(theBets);
  
        setGameStatus('idle');
      } else {
        setStatusMessage('Your turn! Hit, Stand, or Double?');
      }
    }
  }, [
    gameStatus,
    playerHands,
    dealerHand,
    playerBets,       // must include any states/props used in the logic
    setBalance,
    setPlayerBets,
    setStatusMessage,
    setGameStatus
  ]);
  


  /**********************************************************
   * Player Actions: HIT, STAND, DOUBLE, SPLIT
   **********************************************************/

  /**
   * We apply actions to the currently active hand => playerHands[currentHandIndex]
   */
  function playerHit() {
    if (gameStatus !== 'playerTurn') return;
    if (!playerHands[currentHandIndex]) return;

    const newDeck = [...deck];
    const newCard = newDeck.pop();

    // Insert card into the active hand
    const updatedHands = [...playerHands];
    const updatedHand = [...updatedHands[currentHandIndex], newCard];
    updatedHands[currentHandIndex] = updatedHand;

    setDeck(newDeck);
    setPlayerHands(updatedHands);

    // Check for bust
    const newValue = calculateHandValue(updatedHand);
    if (newValue > 21) {
      setStatusMessage(`Hand ${currentHandIndex + 1} busted with ${newValue}!`);
      // This hand's bet is lost => set it to 0
      const updatedBets = [...playerBets];
      updatedBets[currentHandIndex] = 0;
      setPlayerBets(updatedBets);

      // Move on
      moveToNextHandOrDealer();
    } else {
      setStatusMessage(`Hand ${currentHandIndex + 1} has ${newValue}. Hit, Stand, or Double?`);
    }
  }

  function playerStand() {
    if (gameStatus !== 'playerTurn') return;
    if (!playerHands[currentHandIndex]) return;

    const handVal = calculateHandValue(playerHands[currentHandIndex]);
    setStatusMessage(`Hand ${currentHandIndex + 1} stands at ${handVal}.`);
    moveToNextHandOrDealer();
  }

  function playerDoubleDown() {
    if (gameStatus !== 'playerTurn') return;
    if (!playerHands[currentHandIndex]) return;

    const betNeeded = playerBets[currentHandIndex];
    if (balance < betNeeded) {
      setStatusMessage('Not enough balance to Double Down this hand.');
      return;
    }

    // Deduct betNeeded from balance
    setBalance(prev => prev - betNeeded);

    // Double the bet on this hand
    const updatedBets = [...playerBets];
    updatedBets[currentHandIndex] = updatedBets[currentHandIndex] + betNeeded;
    setPlayerBets(updatedBets);

    // Draw exactly 1 card
    const newDeck = [...deck];
    const newCard = newDeck.pop();

    const updatedHands = [...playerHands];
    const updatedHand = [...updatedHands[currentHandIndex], newCard];
    updatedHands[currentHandIndex] = updatedHand;

    setDeck(newDeck);
    setPlayerHands(updatedHands);

    const newValue = calculateHandValue(updatedHand);
    if (newValue > 21) {
      setStatusMessage(`Hand ${currentHandIndex + 1} busted on Double with ${newValue}!`);
      // Bet lost
      updatedBets[currentHandIndex] = 0;
      setPlayerBets(updatedBets);
      moveToNextHandOrDealer();
    } else {
      setStatusMessage(`Hand ${currentHandIndex + 1} has ${newValue}. Now dealer turn...`);
      // Double => forced stand
      moveToNextHandOrDealer();
    }
  }

  /**
   * playerSplit - if the current hand has 2 cards of the same rank or both 10-value,
   * create a new hand & bet. Then draw 1 new card for each splitted hand.
   */
  function playerSplit() {
    if (gameStatus !== 'playerTurn') {
      setStatusMessage('Cannot split if not your turn.');
      return;
    }

    // <<< ADDED: Check if we already have 6 total hands
    if (playerHands.length >= 6) {
      setStatusMessage('Maximum splits reached (6 total hands).');
      return;
    }

    const currentHand = playerHands[currentHandIndex];
    if (!currentHand || currentHand.length !== 2) {
      setStatusMessage('Can only split a 2-card hand.');
      return;
    }

    // Check if cards are the same rank or both 10-valued
    const [card1, card2] = currentHand;
    const card1Val = (card1.rank === 'A') ? 11 : card1.value;
    const card2Val = (card2.rank === 'A') ? 11 : card2.value;
    const sameRank = (card1.rank === card2.rank) ||
                     (card1Val === 10 && card2Val === 10);

    if (!sameRank) {
      setStatusMessage('Cards are not splittable (must be same rank or both 10-value).');
      return;
    }

    // Check if balance >= the bet for this hand
    const thisHandBet = playerBets[currentHandIndex];
    if (balance < thisHandBet) {
      setStatusMessage('Not enough balance to split this hand.');
      return;
    }

    // Deduct that bet from balance
    setBalance(prev => prev - thisHandBet);

    // Remove second card from the current hand, create a new hand
    const updatedHands = [...playerHands];
    updatedHands[currentHandIndex] = [card1]; // keep first card only

    const newHand = [card2]; // second card becomes the new hand

    // Duplicate the bet
    const updatedBets = [...playerBets];
    updatedBets.push(thisHandBet); // new bet for the new hand

    // Deal one new card to each splitted hand if that's your house rule
    let newDeck = [...deck];
    // Give 1 new card to the current (existing) hand
    updatedHands[currentHandIndex].push(newDeck.pop());
    // Give 1 new card to the new hand
    const newHandIndex = updatedHands.length;
    updatedHands.push(newHand);
    updatedHands[newHandIndex].push(newDeck.pop());

    setDeck(newDeck);
    setPlayerHands(updatedHands);
    setPlayerBets(updatedBets);

    setStatusMessage(`Split performed. Hand ${currentHandIndex + 1} is updated. Finish this hand, then move on.`);
  }

  /**
   * moveToNextHandOrDealer - increments currentHandIndex if more hands remain.
   * Otherwise, go to dealer turn.
   */
  function moveToNextHandOrDealer() {
    const nextIndex = currentHandIndex + 1;

    if (nextIndex < playerHands.length) {
      // We still have more hands to play
      setCurrentHandIndex(nextIndex);
      setStatusMessage(`Now playing Hand ${nextIndex + 1}`);
    } else {
      // No more hands to play => either go to dealer or skip if all bets are lost
      const allBetsZero = playerBets.every(bet => bet === 0);
      if (allBetsZero) {
        // Reveal dealer card but DO NOT let dealer draw
        // We'll do that by simply setting gameStatus to 'idle'
        // after revealing the second card.

        // 1) Reveal the hidden card if it's still hidden:
        const revealedDealerHand = dealerHand.map((card, idx) => {
          if (idx === 1 && card.hidden) {
            return { ...card, hidden: false };
          }
          return card;
        });
        setDealerHand(revealedDealerHand);

        // 2) Announce that the dealer won't draw because all bets are lost
        setStatusMessage("All player hands busted/lost. Dealer's card revealed. Round over.");

        // 3) End the round
        setGameStatus('idle');
      } else {
        // At least one hand is still "live" => dealer does normal turn
        setStatusMessage("All hands played. Dealer's turn...");
        setGameStatus('dealerTurn');
      }
    }
  }

  /**********************************************************
   * Dealer Turn
   * auto-runs whenever gameStatus becomes 'dealerTurn'
   **********************************************************/
  useEffect(() => {
    if (gameStatus === 'dealerTurn') {
      // <<< ADDED: Make it async so we can await delays
      (async () => {
        await dealerPlay();
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStatus]);

  // <<< ADDED: Mark dealerPlay async to allow await
  async function dealerPlay() {
    // First, reveal the hidden card (if any):
    let revealedDealerHand = dealerHand.map((card, idx) => {
      if (idx === 1 && card.hidden) {
        return { ...card, hidden: false };
      }
      return card;
    });

    // <<< ADDED: Update state & pause to simulate "revealing" moment
    setDealerHand(revealedDealerHand);
    setStatusMessage("Dealer reveals the hidden card...");
    await wait(1000);

    // Now check if all bets are zero before drawing
    const allBetsZero = playerBets.every(bet => bet === 0);

    if (allBetsZero) {
      // Skip drawing, just show the second card
      setStatusMessage("All player hands busted. Dealer reveals card but doesn't draw. Round over.");
      setGameStatus('idle');
      return; // **Important**: do not proceed further
    }

    // Otherwise, proceed with normal dealer logic
    let newDeck = [...deck];
    let dealerVal = calculateHandValue(revealedDealerHand);

    // Dealer draws until 17 or bust
    while (dealerVal < 17 && newDeck.length > 0) {
      const card = newDeck.pop();
      revealedDealerHand.push(card);
      dealerVal = calculateHandValue(revealedDealerHand);

      // <<< ADDED: Update & pause each time the dealer draws
      setDeck(newDeck);
      setDealerHand([...revealedDealerHand]);
      setStatusMessage(`Dealer draws a card. Dealer total is now ${dealerVal}.`);
      await wait(1000);
    }

    // Then compare each hand individually
    let finalMessage = '';
    for (let i = 0; i < playerHands.length; i++) {
      const hand = playerHands[i];
      const bet = playerBets[i];
      if (!hand || hand.length === 0) {
        finalMessage += `Hand ${i + 1} is empty?\n`;
        continue;
      }
      if (bet === 0) {
        finalMessage += `Hand ${i + 1} had no live bet (busted).\n`;
        continue;
      }
      const playerVal = calculateHandValue(hand);

      if (dealerVal > 21) {
        finalMessage += `Hand ${i + 1} wins! Dealer busted with ${dealerVal}.\n`;
        setBalance(prev => prev + bet * 2);
      } else {
        if (playerVal > dealerVal) {
          finalMessage += `Hand ${i + 1} beats dealer ${dealerVal} vs ${playerVal}.\n`;
          setBalance(prev => prev + bet * 2);
        } else if (playerVal < dealerVal) {
          finalMessage += `Hand ${i + 1} loses to dealer ${dealerVal} vs ${playerVal}.\n`;
        } else {
          finalMessage += `Hand ${i + 1} pushes with dealer at ${dealerVal}.\n`;
          setBalance(prev => prev + bet);
        }
      }
    }

    // End round
    setPlayerBets(playerBets.map(() => 0)); // zero out all bets
    setStatusMessage(finalMessage.trim() || 'Round over.');
    setGameStatus('idle');
  }

  /**********************************************************
   * Context Value
   **********************************************************/
  const contextValue = {
    balance,
    pendingBet,
    playerHands,
    playerBets,
    currentHandIndex,
    dealerHand,
    gameStatus,
    statusMessage,

    // Bet controls
    placeBet,
    clearBet,
    dealCards,

    // Player actions
    playerHit,
    playerStand,
    playerDoubleDown,
    playerSplit
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
}
