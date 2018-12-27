const modal = document.querySelector('#delete-modal');
const albumName = modal.querySelector('b');
const manageTable = document.querySelector('table');
const form = document.querySelector('form');

modal.addEventListener('click', e => {
  if ((e.target.id = 'cancel')) {
    modal.style.display = 'none';
  }
});

manageTable.addEventListener('click', e => {
  if (e.target.classList.contains('delete-album')) {
    albumName.textContent = e.target.getAttribute('data-title');
    form.action = `/delete/${e.target.getAttribute('data-id')}`;

    modal.style.display = 'block';
  }
});
