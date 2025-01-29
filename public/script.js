// Script for Chelsea FC Website

document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/fixtures')
    .then((response) => response.json())
    .then((data) => {
      fixtures = data;
      renderFixtures();
    })
    .catch((error) => console.error('Error fetching fixtures:', error));

  function renderFixtures() {
    const fixturesContent = document.getElementById('fixtures-content');
    fixturesContent.innerHTML = '';

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

    if (fixtures.length < 6) {
      createAddFixtureBox(fixturesContent);
    }
  }

  function createAddFixtureBox(container) {
    const addFixtureBox = document.createElement('div');
    addFixtureBox.className = 'fixture dashed-box';
    addFixtureBox.innerHTML = `<span class="add-symbol">+</span>`;
    addFixtureBox.addEventListener('click', showFixtureForm);
    container.appendChild(addFixtureBox);
  }

  function showFixtureForm(event) {
    event.stopPropagation(); // Prevent bubbling up
    const box = event.currentTarget;

    // Prevent re-adding the form if it's already open
    if (box.querySelector('form')) {
        return;
    }

    box.classList.remove('dashed-box');
    box.classList.add('fixture');
    box.innerHTML = `
      <form id="add-fixture-form">
        <input type="text" name="homeTeam" placeholder="Home Team" required />
        <input type="text" name="awayTeam" placeholder="Away Team" required />
        <input type="date" name="date" required />
        <input type="text" name="location" placeholder="Location" required />
        <button type="submit">Add Fixture</button>
      </form>
    `;

    const form = box.querySelector('#add-fixture-form');
    form.addEventListener('submit', handleFixtureSubmission);
}

function handleFixtureSubmission(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const homeTeam = formData.get('homeTeam').trim();
  const awayTeam = formData.get('awayTeam').trim();
  const date = formData.get('date').trim();
  const location = formData.get('location').trim();

  let valid = true;

  const fields = event.target.querySelectorAll('input');

  // Reset previous errors
  fields.forEach((field) => {
    field.style.borderColor = '';
  });

  // Check for empty fields
  if (!homeTeam || !awayTeam || !date || !location) {
    fields.forEach((field) => {
      if (field.value.trim() === '') {
        field.style.borderColor = 'red';
      }
    });
    valid = false;
  }

  // Ensure "Chelsea" is in one of the teams (case insensitive)
  if (homeTeam.toLowerCase() !== 'chelsea' && awayTeam.toLowerCase() !== 'chelsea') {
    alert('One of the teams must be Chelsea!');
    valid = false;
  }

  // Prevent submission if invalid
  if (!valid) {
    return;
  }

  // If valid, proceed with fixture creation
  const newFixture = { homeTeam, awayTeam, date, location };

  fetch('/api/fixtures', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newFixture),
  })
    .then((response) => response.json())
    .then((data) => {
      fixtures.push(data.fixture);
      renderFixtures(); // Update UI
    })
    .catch((error) => console.error('Error adding fixture:', error));
}

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

  fetch('/api/gallery')
        .then(response => response.json())
        .then(images => {
            const galleryContent = document.getElementById('gallery-content');
            galleryContent.innerHTML = ''; // Clear previous content

            images.forEach(image => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                galleryItem.innerHTML = `
                    <img src="${image.url}" alt="${image.description}">
                    <p>${image.description}</p>
                `;
                galleryContent.appendChild(galleryItem);
            });
        })
        .catch(error => console.error('Error fetching gallery:', error));
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
     <form id="edit-player-form">
      <label>
        Name:
        <input type="text" name="name" value="${player.name}" maxlength="30" required>
      </label>
      <label>
        Position:
        <input type="text" name="position" value="${player.position}" maxlength="20" required>
      </label>
      <label>
        Nationality:
        <input type="text" name="nationality" value="${player.nationality}" maxlength="20" required>
      </label>
      <button type="submit">Save</button>
    </form>
  `;

  const form = container.querySelector('form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const updatedPlayer = {
      name: formData.get('name'),
      position: formData.get('position'),
      nationality: formData.get('nationality'),
    };

    let valid = true;
    const fields = form.querySelectorAll('input');

    fields.forEach((field) => {
      const value = field.value.trim();
      const maxLength = parseInt(field.getAttribute('maxlength'));
      if (value.length === 0 || value.length > maxLength) {
        valid = false;
        field.style.borderColor = 'red';
      } else {
        field.style.borderColor = ''; // Reset border if valid
      }
    });

    if(!valid){
      return;
    }


    fetch(`/api/team/${player.id}`, {
      method: 'POST',
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

        // Update the player card dynamically
        playerCard.querySelector('h3').textContent = updatedPlayer.name;
        playerCard.querySelector('p:nth-of-type(1)').textContent = `Position: ${updatedPlayer.position}`;
        playerCard.querySelector('p:nth-of-type(2)').textContent = `Nationality: ${updatedPlayer.nationality}`;

        // Close the form
        container.style.display = 'none';
      })
      .catch((error) => {
        console.error('Error updating player:', error);
      });
  });
}


function renderFixtures() {
  const fixturesContent = document.getElementById('fixtures-content');
  fixturesContent.innerHTML = ''; // Clear previous content before rendering

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

  // Ensure the "Add Fixture" box always appears
  createAddFixtureBox(fixturesContent);
}


function showFixtureForm(event) {
  event.stopPropagation(); // Prevent accidental re-renders

  const box = event.currentTarget;
  box.classList.remove('dashed-box');
  box.classList.add('fixture');
  box.innerHTML = `
    <form id="add-fixture-form">
      <input type="text" name="homeTeam" placeholder="Home Team" required />
      <input type="text" name="awayTeam" placeholder="Away Team" required />
      <input type="date" name="date" required />
      <input type="text" name="location" placeholder="Location" required />
      <button type="submit">Add Fixture</button>
    </form>
  `;

  // Attach form submission event
  const form = box.querySelector('#add-fixture-form');
  form.addEventListener('submit', handleFixtureSubmission);
}

function handleFixtureSubmission(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const newFixture = {
    homeTeam: formData.get('homeTeam'),
    awayTeam: formData.get('awayTeam'),
    date: formData.get('date'),
    location: formData.get('location'),
  };

  let valid = true;
  const fields = event.target.querySelectorAll('input');

  // Check if any field is empty
  fields.forEach((field) => {
    if (field.value.trim() === '') {
      valid = false;
      field.style.borderColor = 'red';
    } else {
      field.style.borderColor = ''; // Reset border color if valid
    }
  });

  // Check if "Chelsea" is one of the teams
  if (newFixture.homeTeam.toLowerCase() !== 'chelsea' && newFixture.awayTeam.toLowerCase() !== 'chelsea') {
    alert('One of the teams must be Chelsea!');
    valid = false;
  }

  if (!valid) {
    return;
  }

  fetch('/api/fixtures', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newFixture),
  })
    .then((response) => response.json())
    .then((data) => {
      fixtures.push(data.fixture); // Add new fixture to global array
      renderFixtures(); // Re-render fixtures to update UI
    })
    .catch((error) => console.error('Error adding fixture:', error));
}


// Initial fetch and rendering of fixtures
fetch('/api/fixtures')
  .then((response) => response.json())
  .then((data) => {
    fixtures = data;
    renderFixtures(fixtures);
  })
  .catch((error) => console.error('Error fetching fixtures:', error));

  