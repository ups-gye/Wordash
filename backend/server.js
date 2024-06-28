const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');

// Configurar la conexión a MongoDB
mongoose.connect('mongodb+srv://wordash:Camaro.12@cluster0.gbmoqo3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 5000;

// Middleware para servir archivos estáticos desde el frontend
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Modelo de Mongoose para guardar el progreso de los usuarios
const ProgressSchema = new mongoose.Schema({
  username: String,
  score: Number,
});
const Progress = mongoose.model('Progress', ProgressSchema);

// Rutas de API
app.get('/api/progress/:username', async (req, res) => {
  const { username } = req.params;
  const progress = await Progress.findOne({ username });
  res.json(progress);
});

app.post('/api/progress', express.json(), async (req, res) => {
  const { username, score } = req.body;
  let progress = await Progress.findOne({ username });
  if (progress) {
    progress.score = score;
  } else {
    progress = new Progress({ username, score });
  }
  await progress.save();
  res.json(progress);
});

// Rutas para manejar la comunicación en tiempo real con Socket.io
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinGame', (data) => {
    // Unirse a la sala de juego
    socket.join(data.room);
    io.to(data.room).emit('newPlayer', { player: data.player });
  });

  socket.on('selectOption', (data) => {
    io.to(data.room).emit('playerSelection', { player: data.player, option: data.option });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Ruta para manejar todas las demás solicitudes y devolver el archivo index.html del frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
