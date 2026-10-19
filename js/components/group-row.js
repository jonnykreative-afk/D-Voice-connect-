export function renderGroupRow(group) {
  const row = document.createElement('button');
  row.className = 'group-row';
  row.type = 'button';
  row.dataset.groupId = group.id;

  const href = group.whatsapp || group.external;
  const isWhatsApp = Boolean(group.whatsapp);
  const destLabel = isWhatsApp ? 'WhatsApp group' : 'External site';
  row.setAttribute('aria-label', `Open ${group.name} — ${destLabel}`);

  const initials = group.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  row.innerHTML = `
    <div class="group-avatar" aria-hidden="true">${initials}</div>
    <div class="group-body">
      <div class="group-name">${group.name}</div>
      ${group.description ? `<div class="group-desc">${group.description}</div>` : ''}
    </div>
    <span class="group-go" aria-hidden="true">
      ${isWhatsApp
        ? '<i class="ri-whatsapp-line dest-whatsapp"></i>'
        : '<i class="ri-external-link-line"></i>'}
      <i class="ri-arrow-right-s-line dest-chevron"></i>
    </span>
  `;

  row.addEventListener('click', () => {
    window.open(href, '_blank', 'noopener,noreferrer');
  });

  return row;
}