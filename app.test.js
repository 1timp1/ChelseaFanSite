const request = require('supertest');
const app = require('./app'); // Import the Express app
const fs = require('fs');
const path = require('path');

const fixturesFilePath = path.join(__dirname, 'fixtures.json');
const teamFilePath = path.join(__dirname, 'team.json');
const galleryFilePath = path.join(__dirname, 'gallery.json');

describe('API Tests', () => {

  // Ensure test files exist
  beforeAll(() => {
    if (!fs.existsSync(fixturesFilePath)) {
      fs.writeFileSync(fixturesFilePath, '[]');
    }
    if (!fs.existsSync(teamFilePath)) {
      fs.writeFileSync(teamFilePath, '[]');
    }
    if (!fs.existsSync(galleryFilePath)) {
      fs.writeFileSync(galleryFilePath, '[]');
    }
  });

  /** ✅ Test: GET /api/fixtures **/
  test('GET /api/fixtures should return a list of fixtures', async () => {
    const response = await request(app).get('/api/fixtures');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true); // Should return an array
  });

  /** ✅ Test: POST /api/fixtures **/
  test('POST /api/fixtures should add a fixture', async () => {
    const newFixture = {
      homeTeam: "Chelsea",
      awayTeam: "Manchester United",
      date: "2025-04-10",
      location: "Stamford Bridge"
    };

    const response = await request(app)
      .post('/api/fixtures')
      .send(newFixture)
      .set('Accept', 'application/json');

    expect(response.status).toBe(201); // Fixture created successfully
    expect(response.body).toHaveProperty('message', 'Fixture added successfully!');
    expect(response.body.fixture.homeTeam).toBe("Chelsea");
  });

  /** ✅ Test: GET /api/team **/
  test('GET /api/team should return a list of players', async () => {
    const response = await request(app).get('/api/team');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true); // Should return an array
  });

  /** ✅ Test: POST /api/team/:id (Update a Player) **/
  test('POST /api/team/:id should update player info', async () => {
    // First, add a player to update
    const initialPlayers = [
      { id: "1", name: "Reece James", position: "Defender", nationality: "England" }
    ];
    fs.writeFileSync(teamFilePath, JSON.stringify(initialPlayers, null, 2));

    const updatedPlayer = {
      name: "Reece James",
      position: "Captain",
      nationality: "England"
    };

    const response = await request(app)
      .post('/api/team/1') // Update player with ID 1
      .send(updatedPlayer)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Player updated successfully!');
    expect(response.body.player.position).toBe("Captain");
  });

  /** ✅ Test: GET /api/gallery **/
  test('GET /api/gallery should return a list of images', async () => {
    const response = await request(app).get('/api/gallery');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true); // Should return an array
  });

  /** ❌ Error Test: POST /api/fixtures without required fields **/
  test('POST /api/fixtures should fail if required fields are missing', async () => {
    const incompleteFixture = {
      homeTeam: "Chelsea"
    };

    const response = await request(app)
      .post('/api/fixtures')
      .send(incompleteFixture)
      .set('Accept', 'application/json');

    expect(response.status).toBe(400); // Bad Request
    expect(response.body).toHaveProperty('message', 'All fields are required');
  });

  /** ❌ Error Test: POST /api/team/:id for a non-existing player **/
  test('POST /api/team/:id should return 404 if player does not exist', async () => {
    const response = await request(app)
      .post('/api/team/9999') // Non-existent player ID
      .send({ name: "Unknown Player" })
      .set('Accept', 'application/json');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Player not found');
  });
});
