import React, { useState, useEffect } from "react";
import "./flippedcard.css";

const initialCards = [
  { id: 1, value: "कुत्ता", match: "🐕", type: "text" },
  { id: 2, value: "बिल्ली", match: "🐈", type: "text" },
  { id: 3, value: "हाथी", match: "🐘", type: "text" },
  { id: 7, value: "शेर", match: "🦁", type: "text" },
  { id: 9, value: "गाय", match: "🐄", type: "text" },
  { id: 12, value: "घोड़ा", match: "🐎", type: "text" },
  { id: 4, value: "🐕", match: "कुत्ता", type: "emoji" },
  { id: 5, value: "🐈", match: "बिल्ली", type: "emoji" },
  { id: 6, value: "🐘", match: "हाथी", type: "emoji" },
  { id: 8, value: "🦁", match: "शेर", type: "emoji" },
  { id: 10, value: "🐄", match: "गाय", type: "emoji" },
  { id: 11, value: "🐓", match: "मुर्गा", type: "emoji" },
];

function FlippedCard() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [wrongPair, setWrongPair] = useState([]);

  useEffect(() => {
    // Shuffle and duplicate cards
    const shuffledCards = initialCards
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setCards(shuffledCards);
  }, []);

  const handleFlip = (card) => {
    if (disabled) return;

    setFlippedCards((prev) => [...prev, card]);

    if (flippedCards.length === 1) {
      setDisabled(true);

      // Check for match
      const firstCard = flippedCards[0];
      const secondCard = card;

      if (
        firstCard.value === secondCard.match ||
        firstCard.match === secondCard.value
      ) {
        setCards((prev) =>
          prev.map((c) =>
            c.value === firstCard.value || c.value === secondCard.value
              ? { ...c, matched: true }
              : c
          )
        );
        resetTurn();
      } else {
        // No match: Show red animation and flip back
        setWrongPair([firstCard, secondCard]);
        setTimeout(() => {
          setWrongPair([]);
          resetTurn();
        }, 1000);
      }
    }
  };

  const resetTurn = () => {
    setFlippedCards([]);
    setDisabled(false);
  };

  const isCardWrong = (card) => {
    return wrongPair.includes(card);
  };

  return (
       <div className="flipped-card-container">
      <div className="game-board">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`card 
              ${flippedCards.includes(card) || card.matched ? "flipped" : ""} 
              ${card.matched ? "matched" : ""}
              ${isCardWrong(card) ? "wrong" : ""}`}
            onClick={() =>
              !flippedCards.includes(card) && !card.matched && handleFlip(card)
            }
          >
            <div className="front" data-type={card.type}>
              {card.value}
            </div>
            <div className="back"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FlippedCard;