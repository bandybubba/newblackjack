// File: src/components/Card.js

import React from 'react';

/**
 * Card component to display the appropriate card front image,
 * or a back image if "hidden" is true.
 *
 * @param {string} rank - e.g. 'A', 'K', 'Q', 'J', '10', '2', etc.
 * @param {string} suit - e.g. '♠', '♥', '♦', '♣' (symbols)
 * @param {boolean} hidden - if true, shows the card-back image
 */
function Card({ rank, suit, hidden }) {
  // 1. If hidden => show the back side
  if (hidden) {
    return (
      <img
        src="/assets/cards/card-back.png"
        alt="Card back"
        style={styles.cardImage}
      />
    );
  }

  // 2. Convert rank & suit symbol to file-friendly strings
  const rankName = convertRankToFilename(rank); // e.g. 'a', '10', 'k'
  const suitName = convertSuitSymbolToWord(suit); // e.g. 'spades', 'hearts'

  // 3. Build the final filename, e.g. "a_of_spades.png"
  const fileName = `${rankName}_of_${suitName}.png`; // all lowercase assumed

  // 4. Return the card front image
  return (
    <img
      src={`/assets/cards/${fileName.toLowerCase()}`}
      alt={`${rank} of ${suit}`}
      style={styles.cardImage}
    />
  );
}

/**
 * Helper to map rank like "A", "K", "Q", "J", "10", "2" => "a", "k", "q", "j", "10", "2"
 * Adjust as needed if your filenames differ.
 */
function convertRankToFilename(rank) {
  switch (rank) {
    case 'A':
      return 'a';
    case 'K':
      return 'k';
    case 'Q':
      return 'q';
    case 'J':
      return 'j';
    default:
      // For numbers like "10", "9", "2", etc., we just lower-case them
      return rank.toLowerCase();
  }
}

/**
 * Helper to map suit symbols "♠", "♥", "♦", "♣" => "spades", "hearts", "diamonds", "clubs"
 */
function convertSuitSymbolToWord(symbol) {
  switch (symbol) {
    case '♠':
      return 'spades';
    case '♥':
      return 'hearts';
    case '♦':
      return 'diamonds';
    case '♣':
      return 'clubs';
    default:
      return 'unknown'; // fallback if something is off
  }
}

// Inline style for the card images, adjust size or styling as you like
const styles = {
  cardImage: {
    width: '60px',
    height: '90px',
    borderRadius: '4px',
    marginRight: '4px',
  },
};

export default Card;
