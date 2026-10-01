const employees = Array.from({ length: 10 }, (_, index) => ({
  name: `Garcia Employee #${index + 1}`,
  clockedIn: index < 4,
  start: index < 4 ? ['07:18 AM', '07:42 AM', '08:03 AM', '08:17 AM'][index] : '—',
  hours: index < 4 ? [4.4, 3.9, 3.6, 3.4][index] : 0
}));
let language = 'es';
const formatHours = value => `${Math.floor(value)}h ${String(Math.round((value % 1) * 60)).padStart(2, '0')}m`;
function renderTable() {
  document.querySelector('#adminTable').innerHTML = employees.map(employee => `<tr><td><strong>${employee.name}</strong></td><td><span class="status-pill ${employee.clockedIn ? 'in' : 'out'}">${employee.clockedIn ? (language === 'es' ? 'En el reloj' : 'Clocked in') : (language === 'es' ? 'Sin marcar' : 'Not started')}</span></td><td>${employee.start}</td><td>${formatHours(employee.hours)}</td></tr>`).join('');
}
document.querySelector('#adminLogin').addEventListener('submit', event => {
  event.preventDefault();
  document.querySelector('#backendPreview').classList.add('is-open');
  document.querySelector('#backendPreview').scrollIntoView({ behavior: 'smooth', block: 'start' });
});
document.querySelector('#languageToggle').addEventListener('click', () => {
  language = language === 'es' ? 'en' : 'es';
  document.documentElement.lang = language;
  document.querySelectorAll('[data-es][data-en]').forEach(element => { element.textContent = element.dataset[language]; });
  renderTable();
});
renderTable();
