const express = require('express');
const app = express();
const PORT = 3000;

const path = require('path');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Welcome Chelsea Fans' });
});

let players = [
  { id: 1, name: 'Cole Palmer', position: 'Forward', nationality: 'England', image: '/images/palmer.jpg' },
  { id: 2, name: 'Nicolas Jackson', position: 'Forward', nationality: 'Senegal', image: '/images/jackson.jpg' },
  { id: 3, name: 'Enzo Fernández', position: 'Midfielder', nationality: 'Argentina', image: '/images/enzo.jpg' },
  { id: 4, name: 'Reece James', position: 'Defender', nationality: 'England', image: '/images/james.jpg' },
  { id : 5, name: 'Noni Madueke', position: 'Forward', nationality: 'England', image: '/images/noni.jpg'}
];

app.get('/api/team', (req, res) => {
  res.json(players);
});

app.post('/api/team/:id', (req, res) => {
  const { id } = req.params;
  const { name, position, nationality } = req.body;

  const playerIndex = players.findIndex((player) => player.id === parseInt(id));
  if (playerIndex === -1) {
    return res.status(404).json({ message: 'Player not found' });
  }

  players[playerIndex] = {
    ...players[playerIndex],
    name: name || players[playerIndex].name,
    position: position || players[playerIndex].position,
    nationality: nationality || players[playerIndex].nationality,
  };

  res.json({ message: 'Player updated successfully!', player: players[playerIndex] });
});

app.get('/api/fixtures', (req, res) => {
  res.json([
    { homeTeam: 'Chelsea', awayTeam: 'Liverpool', date: '2025-02-01', location: 'Stamford Bridge'},
    { homeTeam: 'Manchester City', awayTeam: 'Chelsea', date: '25/01/2025', location: 'Etihad Stadium'},
  ]);
});

app.get('/api/gallery', (req, res) => {
  res.json([
    { url: '/images/goal.jpg', description: 'Chelsea scoring a goal' },
    { url: '/images/fans.jpg', description: 'Chelsea fans cheering' },
    { url: '/images/stadium.jpg', description: 'Stamford Bridge stadium' },
  ]);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
