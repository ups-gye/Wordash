import React from 'react';
import './Scoreboard.css';

const Scoreboard = ({ players }) => {
  return (
    <div className="scoreboard">
      {players.map((player, index) => (
        <div key={index} className="player">
          <h3>{player.name}</h3>
          <p>Score: {player.score}</p>
        </div>
      ))}
    </div>
  );
};

export default Scoreboard;
