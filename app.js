const express = require('express');
const app = express();
const PORT = 3000;
const fs = require('fs');
const path = require('path');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const fixturesFilePath = path.join(__dirname, 'fixtures.json');
let fixtures = [];

if (fs.existsSync(fixturesFilePath)) {
  const data = fs.readFileSync(fixturesFilePath);
  fixtures = JSON.parse(data);
}

const teamFilePath = path.join(__dirname, 'team.json')
let players = [];

if (fs.existsSync(teamFilePath)) {
  const data = fs.readFileSync(teamFilePath);
  players = JSON.parse(data);
}

const galleryFilePath = path.join(__dirname, 'gallery.json')
let gallery = [];

if(fs.existsSync(galleryFilePath)){
  const data = fs.readFileSync(galleryFilePath);
  images = JSON.parse(data);
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

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


  fs.writeFileSync(teamFilePath, JSON.stringify(players, null, 2));

  res.json({ message: 'Player updated successfully!', player: players[playerIndex] });
});

app.get('/api/fixtures', (req, res) => {
  res.json(fixtures);
});

app.post('/api/fixtures', (req, res) => {
  const { homeTeam, awayTeam, date, location } = req.body;

  if (!homeTeam || !awayTeam || !date || !location) {
      return res.status(400).json({ message: 'All fields are required' });
  }

  const newFixture = {
      id: Date.now(), // Use a unique ID
      homeTeam,
      awayTeam,
      date,
      location,
  };

  // Add the new fixture to the array
  fixtures.push(newFixture);

  // Save the updated fixtures to the JSON file
  fs.writeFileSync(fixturesFilePath, JSON.stringify(fixtures, null, 2));

  res.status(201).json({ message: 'Fixture added successfully!', fixture: newFixture });
});

app.get('/api/gallery', (req, res) => {
  res.json(images);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
