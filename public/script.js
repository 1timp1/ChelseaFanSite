document.addEventListener('DOMContentLoaded', () => {
    // Fetch team data from API
    fetch('/api/team')
    .then((response) => response.json())
    .then((data) => {
        const teamContent = document.getElementById('team-content');
        if (data.length === 0) {
            teamContent.innerHTML = "<p>No players found.</p>";
        } else {
            const playersHTML = data.map(player => `
                <div class="player card shadow-sm p-3 mb-5 bg-white rounded" style="width: 18rem; text-align: center;">
                    <img src="${player.image}" alt="${player.name}" class="card-img-top player-image">
                    <div class="card-body">
                        
                        <p class="card-text">Position: ${player.position}</p>
                        <p class="card-text">Nationality: ${player.nationality}</p>
                    </div>
                </div>
            `).join('');
            teamContent.innerHTML = playersHTML;
        }
    })
    .catch((error) => console.error('Error fetching team data:', error));

    // Fetch fixtures data from API
    fetch('/api/fixtures')
        .then((response) => response.json())
        .then((data) => {
            const fixturesContent = document.getElementById('fixtures-content');
            if (data.length === 0) {
                fixturesContent.innerHTML = "<p>No upcoming fixtures.</p>";
            } else {
                const fixturesHTML = data.map(fixture => `
                    <div class="fixture">
                        <h3>${fixture.homeTeam} vs ${fixture.awayTeam}</h3>
                        <p>Date: ${fixture.date}</p>
                        <p>Location: ${fixture.location}</p>
                    </div>
                `).join('');
                fixturesContent.innerHTML = fixturesHTML;
            }
        })
        .catch((error) => console.error('Error fetching fixtures data:', error));

    // Fetch gallery data from API
    fetch('/api/gallery')
        .then((response) => response.json())
        .then((data) => {
            const galleryContent = document.getElementById('gallery-content');
            if (data.length === 0) {
                galleryContent.innerHTML = "<p>No images available.</p>";
            } else {
                const imagesHTML = data.map(image => `
                    <div class="gallery-item">
                        <img src="${image.url}" alt="${image.description}" />
                        <p>${image.description}</p>
                    </div>
                `).join('');
                galleryContent.innerHTML = imagesHTML;
            }
        })
        .catch((error) => console.error('Error fetching gallery data:', error));
});

document.addEventListener('scroll', () => {
    const sections = Array.from(document.querySelectorAll('section'));
    const navbarLinks = document.querySelectorAll('.navbar a');

    let current = sections.find(
        section => window.scrollY >= section.offsetTop - 100
    );

    navbarLinks.forEach(link => link.classList.remove('active'));
    if (current) {
        document
            .querySelector(`.navbar a[href="#${current.id}"]`)
            ?.classList.add('active');
    }
});


