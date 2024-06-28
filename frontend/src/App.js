import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import axios from 'axios';
import './App.css';
import Game from './components/Game';
import Scoreboard from './components/Scoreboard';

const ENDPOINT = "http://localhost:5000";
const socket = socketIOClient(ENDPOINT);

function App() {
  const [players, setPlayers] = useState([]);
  const [word, setWord] = useState("a banana");
  const [options, setOptions] = useState(["cake", "apple", "banana"]);

  useEffect(() => {
    socket.on('newPlayer', (data) => {
      setPlayers((prevPlayers) => [...prevPlayers, data.player]);
    });

    socket.on('playerSelection', (data) => {
      console.log(`${data.player} selected ${data.option}`);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>WorDash</h1>
      </header>
      <Game word={word} options={options} players={players} socket={socket} />
      <Scoreboard players={players} />
    </div>
  );
}

export default App;
