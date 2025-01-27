const express = require('express');
const app = express();
const PORT = 3000;

// Middleware for parsing JSON
app.use(express.json());

// Serve static files from the public directory
app.use(express.static('public'));

// API routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Welcome Chelsea Fans' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Team data
app.get('/api/team', (req, res) => {
    res.json([
        {
            name: 'Raheem Sterling',
            position: 'Forward',
            nationality: 'England',
            image: '/images/sterling.jpg'
        },
        {
            name: 'Thiago Silva',
            position: 'Defender',
            nationality: 'Brazil',
            image: '/images/thiago.jpg'
        },
        {
            name: 'Enzo Fernández',
            position: 'Midfielder',
            nationality: 'Argentina',
            image: '/images/enzo.jpg'
        },
        {
            name: 'Reece James',
            position: 'Defender',
            nationality: 'England',
            image: '/images/james.jpg'
        }
    ]);
});

// Fixtures
app.get('/api/fixtures', (req, res) => {
    res.json([
        { homeTeam: 'Chelsea', awayTeam: 'Liverpool', date: '2025-02-01', location: 'Stamford Bridge' },
        { homeTeam: 'Manchester City', awayTeam: 'Chelsea', date: '2025-02-08', location: 'Etihad Stadium' },
    ]);
});

app.get('/api/gallery', (req, res) => {
    res.json([
        { url: '/images/goal.jpg', description: 'Chelsea scoring a goal' },
        { url: '/images/fans.jpg', description: 'Chelsea fans cheering' },
        { url: '/images/stadium.jpg', description: 'Stamford Bridge stadium' },
    ]);
});


