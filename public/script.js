// Script for Chelsea FC Website

document.addEventListener('DOMContentLoaded', () => {
    
  //fetch fixtures
  fetch('/api/fixtures')
  .then((response) => response.json())
  .then((fixtures) => {
    const fixturesContent = document.getElementById('fixtures-content');

    if (fixtures.length === 0) {
      fixturesContent.innerHTML = '<p>No upcoming fixtures.</p>';
      return;
    }

    fixtures.forEach((fixture) => {
      const fixtureBox = document.createElement('div');
      fixtureBox.className = 'fixture';
      fixtureBox.innerHTML = `
        <h3>${fixture.homeTeam} vs. ${fixture.awayTeam}</h3>
        <p>Date: ${fixture.date}</p>
        <p>Location: ${fixture.location}</p>
      `;
      fixturesContent.appendChild(fixtureBox);
    });
  })
  .catch((error) => {
    console.error('Error fetching fixtures:', error);
  });

  // Fetch and display gallery items
  fetch('/api/gallery')
  .then((response) => response.json())
  .then((galleryItems) => {
    const galleryContent = document.getElementById('gallery-content');

    if (galleryItems.length === 0) {
      galleryContent.innerHTML = '<p>No images available.</p>';
      return;
    }

    galleryItems.forEach((item) => {
      const galleryBox = document.createElement('div');
      galleryBox.className = 'gallery-item';
      galleryBox.innerHTML = `
        <img src="${item.url}" alt="${item.description}">
        <p>${item.description}</p>
      `;
      galleryContent.appendChild(galleryBox);
    });
  })
  .catch((error) => {
    console.error('Error fetching gallery items:', error);
  });
  
  // Fetch and display players
  fetch('/api/team')
    .then((response) => response.json())
    .then((players) => {
      console.log(players);
      const teamContent = document.getElementById('team-content');

      // If no players, display a message
      if (players.length === 0) {
        teamContent.innerHTML = '<p>No players found.</p>';
        return;
      }

      // Render player cards
      fetch('/api/team')
    .then((response) => response.json())
    .then((players) => {
      const teamContent = document.getElementById('team-content');

      // If no players, display a message
      if (players.length === 0) {
        teamContent.innerHTML = '<p>No players found.</p>';
        return;
      }

      players.forEach((player) => {
        createPlayerCard(player, teamContent);
      });
    })
    .catch((error) => {
      console.error('Error fetching players:', error);
    });
  });
});

function createPlayerCard(player, container) {
  const playerCard = document.createElement('div');
  playerCard.className = 'player';
  playerCard.innerHTML = `
    <img src="${player.image}" alt="${player.name}" class="player-image">
    <h3>${player.name}</h3>
    <p>Position: ${player.position}</p>
    <p>Nationality: ${player.nationality}</p>
    <button class="edit-btn" data-id="${player.id}">Edit</button>
    <div class="edit-form" style="display: none;"></div>
  `;
  container.appendChild(playerCard);

  // Add event listener for the edit button
  const editButton = playerCard.querySelector('.edit-btn');
  const editFormContainer = playerCard.querySelector('.edit-form');
  editButton.addEventListener('click', () => {
    showEditForm(player, editFormContainer, playerCard);
  });
}

function showEditForm(player, container, playerCard) {
  container.style.display = 'block';
  container.innerHTML = `
    <form>
      <label>
        Name:
        <input type="text" name="name" value="${player.name}">
      </label>
      <label>
        Position:
        <input type="text" name="position" value="${player.position}">
      </label>
      <label>
        Nationality:
        <input type="text" name="nationality" value="${player.nationality}">
      </label>
      <button type="submit">Save</button>
    </form>
  `;

  // Add submit event listener
  const form = container.querySelector('form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const updatedPlayer = {
      name: formData.get('name'),
      position: formData.get('position'),
      nationality: formData.get('nationality'),
    };

    // Send updated data to the server
    fetch(`/api/team/${player.id}`, {
      method: 'POST', // Use POST for updating
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedPlayer),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update player data');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.message);

        // Update the player card with new data
        playerCard.querySelector('h3').textContent = updatedPlayer.name;
        playerCard.querySelector('p:nth-of-type(1)').textContent = `Position: ${updatedPlayer.position}`;
        playerCard.querySelector('p:nth-of-type(2)').textContent = `Nationality: ${updatedPlayer.nationality}`;
        container.style.display = 'none'; // Hide the form
      })
      .catch((error) => {
        console.error('Error updating player:', error);
      });
  });
}

