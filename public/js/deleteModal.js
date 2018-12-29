const modal = document.querySelector('#delete-modal');
const albumName = modal.querySelector('b');
const manageTable = document.querySelector('table');
const form = document.querySelector('#modal-form');
const cancelDelete = document.querySelector('#cancel');

cancelDelete.addEventListener('click', e => {
  e.preventDefault();

  modal.style.display = 'none';
});

manageTable.addEventListener('click', e => {
  if (e.target.classList.contains('delete-album')) {
    albumName.textContent = e.target.getAttribute('data-title');
    form.action = `/delete/${e.target.getAttribute('data-id')}`;

    modal.style.display = 'block';
  }
});
