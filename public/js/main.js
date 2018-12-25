const tracksSection = document.querySelector('#tracks');
const tracksTable = document.querySelector('tbody');
const trackRowTemplate = document.querySelector('#track-add-row');

tracksSection.addEventListener('click', e => {
  e.preventDefault();

  if (e.target.id === 'add-track') {
    const newRow = document.importNode(trackRowTemplate.content, true);

    tracksTable.appendChild(newRow);

    const numberOfTracks = tracksTable.querySelectorAll('tr').length;

    document.querySelectorAll('.track-nr')[
      numberOfTracks - 1
    ].textContent = numberOfTracks;
  } else if (e.target.classList.contains('remove-track')) {
    const numberOfTracks = tracksTable.querySelectorAll('tr').length;

    if (numberOfTracks > 1) {
      tracksTable.removeChild(e.target.closest('tr'));
    }

    const trackNumbers = tracks.querySelectorAll('.track-nr');

    for (let i = 0; i < trackNumbers.length; i++) {
      trackNumbers[i].textContent = i + 1;
    }
  }
});
