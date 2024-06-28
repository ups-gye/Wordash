import React from 'react';
import './Game.css';

const Game = ({ word, options, socket }) => {
  const handleOptionClick = (option) => {
    socket.emit('selectOption', { room: 'default', player: 'Player1', option });
  };

  return (
    <div className="game">
      <h2>{word}</h2>
      <div className="options">
        {options.map((option, index) => (
          <button key={index} onClick={() => handleOptionClick(option)}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Game;
