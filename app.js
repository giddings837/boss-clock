const employees = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  name: `Garcia Employee #${index + 1}`,
  status: index < 4 ? 'Clocked in' : 'Not started',
  clockedIn: index < 4,
  start: index < 4 ? ['07:18 AM', '07:42 AM', '08:03 AM', '08:17 AM'][index] : '—',
  hours: index < 4 ? [4.4, 3.9, 3.6, 3.4][index] : 0
}));

let selectedId = null;
let language = 'es';
const grid = document.querySelector('#employeeGrid');
const clockButton = document.querySelector('#clockButton');
const actionHint = document.querySelector('#actionHint');

function formatHours(value) {
  const hours = Math.floor(value);
  const minutes = Math.round((value - hours) * 60);
  return `${hours}h ${String(minutes).padStart(2, '0')}m`;
}

function renderEmployees() {
  grid.innerHTML = employees.map(employee => `
    <button class="employee ${employee.clockedIn ? 'on' : ''} ${selectedId === employee.id ? 'selected' : ''}" data-id="${employee.id}" type="button">
      <span class="name">${employee.name}</span>
      <span class="status">${employee.clockedIn ? `● ${employee.start}` : (language === 'es' ? '○ Sin marcar' : '○ Not started')}</span>
    </button>`).join('');
  grid.querySelectorAll('.employee').forEach(button => button.addEventListener('click', () => selectEmployee(Number(button.dataset.id))));
}

function selectEmployee(id) {
  selectedId = id;
  const employee = employees.find(item => item.id === id);
  clockButton.disabled = false;
  clockButton.innerHTML = employee.clockedIn ? (language === 'es' ? 'Marcar salida <span>→</span>' : 'Clock out <span>→</span>') : (language === 'es' ? 'Marcar entrada <span>→</span>' : 'Clock in <span>→</span>');
  actionHint.textContent = language === 'es' ? `${employee.name} está seleccionado.` : `${employee.name} is selected.`;
  renderEmployees();
}

function updateTotals() {
  const active = employees.filter(employee => employee.clockedIn).length;
  const total = employees.reduce((sum, employee) => sum + employee.hours, 0);
  document.querySelector('#crewCount').textContent = active;
  document.querySelector('#crewTotal').textContent = formatHours(total);
  if (selectedId) {
    const selected = employees.find(employee => employee.id === selectedId);
    document.querySelector('#shiftTotal').textContent = formatHours(selected.hours);
  }
}

clockButton.addEventListener('click', () => {
  const employee = employees.find(item => item.id === selectedId);
  if (!employee) return;
  employee.clockedIn = !employee.clockedIn;
  if (employee.clockedIn) {
    employee.start = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    employee.hours = 0;
    actionHint.textContent = language === 'es' ? `${employee.name} marcó entrada. Buen turno.` : `${employee.name} is clocked in. Have a good shift.`;
  } else {
    employee.hours = Math.max(employee.hours, 0.1);
    actionHint.textContent = language === 'es' ? `${employee.name} marcó salida por ahora.` : `${employee.name} is clocked out for now.`;
  }
  renderEmployees();
  updateTotals();
});

document.querySelector('#languageToggle').addEventListener('click', () => {
  language = language === 'es' ? 'en' : 'es';
  document.querySelectorAll('[data-es][data-en]').forEach(element => { element.textContent = element.dataset[language]; });
  document.querySelector('.live-dot').lastChild.textContent = language === 'es' ? ' Tablero en vivo' : ' Live board';
  document.querySelector('#actionHint').textContent = language === 'es' ? 'Selecciona tu nombre para marcar entrada o salida.' : 'Select your name to clock in or out.';
  if (selectedId) selectEmployee(selectedId);
  renderEmployees();
});

document.querySelector('#todayLabel').textContent = new Date().toLocaleDateString('es-US', { weekday: 'long', month: 'long', day: 'numeric' });
setInterval(() => { document.querySelector('#currentTime').textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }, 1000);
renderEmployees();
updateTotals();
