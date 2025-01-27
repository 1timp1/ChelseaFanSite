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
        const teamContent = document.getElementById('team-content');
  
        // If no players, display a message
        if (players.length === 0) {
          teamContent.innerHTML = '<p>No players found.</p>';
          return;
        }
  
        // Render player cards
        players.forEach((player) => {
          const playerCard = document.createElement('div');
          playerCard.className = 'player';
          playerCard.innerHTML = `
            <img src="${player.image}" alt="${player.name}" class="player-image">
            <h3>${player.name}</h3>
            <p>Position: ${player.position}</p>
            <p>Nationality: ${player.nationality}</p>
            <button class="edit-btn" data-id="${player.id}">Edit</button>
          `;
          teamContent.appendChild(playerCard);
        });
      })
      .catch((error) => {
        console.error('Error fetching players:', error);
      });


  
    // Handle Edit Button Clicks
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('edit-btn')) {
        const playerId = e.target.getAttribute('data-id');
  
        // Fetch player details and open edit form
        fetch(`/api/team/${playerId}`)
          .then((response) => response.json())
          .then((player) => {
            openEditForm(player);
          })
          .catch((error) => console.error('Error fetching player details:', error));
      }
    });
  
    function openEditForm(player) {
      // Display a form with the player's details for editing
      const formContainer = document.createElement('div');
      formContainer.className = 'edit-form-container';
      formContainer.innerHTML = `
        <form id="edit-form">
          <label>Name:</label>
          <input type="text" id="edit-name" value="${player.name}">
          <label>Position:</label>
          <input type="text" id="edit-position" value="${player.position}">
          <label>Nationality:</label>
          <input type="text" id="edit-nationality" value="${player.nationality}">
          <button type="submit">Save</button>
          <button type="button" id="cancel-edit">Cancel</button>
        </form>
      `;
  
      document.body.appendChild(formContainer);
  
      // Handle form submission
      document.getElementById('edit-form').addEventListener('submit', (e) => {
        e.preventDefault();
  
        // Collect updated data
        const updatedPlayer = {
          name: document.getElementById('edit-name').value,
          position: document.getElementById('edit-position').value,
          nationality: document.getElementById('edit-nationality').value,
        };
  
        // Send PUT request to update player
        fetch(`/api/team/${player.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedPlayer),
        })
          .then((response) => {
            if (response.ok) {
              alert('Player updated successfully!');
              location.reload(); // Reload to show updated data
            } else {
              alert('Failed to update player.');
            }
          })
          .catch((error) => console.error('Error updating player:', error));
      });
  
      // Handle cancel button
      document.getElementById('cancel-edit').addEventListener('click', () => {
        document.body.removeChild(formContainer);
      });
    }
  });
  