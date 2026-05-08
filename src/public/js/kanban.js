document.addEventListener('DOMContentLoaded', () => {
  const cols = document.querySelectorAll('.col');
  if (!cols.length) return;

  let dragId = null;

  document.querySelectorAll('.card[draggable]').forEach(card => {
    card.addEventListener('dragstart', () => {
      dragId = card.dataset.id;
      card.classList.add('card--dragging');
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('card--dragging');
      dragId = null;
      cols.forEach(c => c.classList.remove('col--drag-over'));
    });
  });

  cols.forEach(col => {
    col.addEventListener('dragover', e => {
      e.preventDefault();
      cols.forEach(c => c.classList.remove('col--drag-over'));
      col.classList.add('col--drag-over');
    });
    col.addEventListener('dragleave', e => {
      if (!col.contains(e.relatedTarget)) col.classList.remove('col--drag-over');
    });
    col.addEventListener('drop', e => {
      e.preventDefault();
      col.classList.remove('col--drag-over');
      if (!dragId) return;

      const estado = col.dataset.estado;
      const card   = document.querySelector(`.card[data-id="${dragId}"]`);
      if (!card) return;

      fetch('/tareas/update-position', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: dragId, estado, posicion: col.querySelectorAll('.card').length }),
      })
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            const list = col.querySelector('.col__list');
            list.insertBefore(card, list.querySelector('.col__empty'));
            col.querySelector('.col__count').textContent = list.querySelectorAll('.card').length;
          }
        })
        .catch(console.error);
    });
  });
});
