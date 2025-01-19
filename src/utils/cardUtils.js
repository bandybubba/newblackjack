/**
 * Utility file for deck creation, shuffling, and calculating hand values.
 */
export function createDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = [
      { rank: 'A', value: 11 },
      { rank: '2', value: 2 },
      { rank: '3', value: 3 },
      { rank: '4', value: 4 },
      { rank: '5', value: 5 },
      { rank: '6', value: 6 },
      { rank: '7', value: 7 },
      { rank: '8', value: 8 },
      { rank: '9', value: 9 },
      { rank: '10', value: 10 },
      { rank: 'J', value: 10 },
      { rank: 'Q', value: 10 },
      { rank: 'K', value: 10 }
    ];
  
    const deck = [];
    for (let suit of suits) {
      for (let r of ranks) {
        deck.push({
          suit: suit,
          rank: r.rank,
          value: r.value
        });
      }
    }
    return deck;
  }
  
  export function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }
  
  /**
   * calculateHandValue - sums up card values, handling Aces as 11 or 1 if necessary.
   */
  export function calculateHandValue(hand) {
    let total = 0;
    let aceCount = 0;
  
    for (let card of hand) {
      total += card.value;
      if (card.rank === 'A') {
        aceCount++;
      }
    }
  
    // Reduce Aces from 11 to 1 while total > 21
    while (total > 21 && aceCount > 0) {
      total -= 10;
      aceCount--;
    }
  
    return total;
  }
  