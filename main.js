// ==================================================
// ОБЩАЯ ЛОГИКА САЙТА (работает на всех страницах)
// ==================================================


// ==== МОБИЛЬНОЕ МЕНЮ (бургер) ====
(function initMobileMenu(){
  const header = document.querySelector('header');
  const nav = header && header.querySelector('nav');
  if(!header || !nav) return;

  const burger = document.createElement('button');
  burger.className = 'burger';
  burger.setAttribute('aria-label', 'Меню');
  burger.innerHTML = '<span></span><span></span><span></span>';
  header.appendChild(burger);

  const menu = document.createElement('div');
  menu.className = 'mobile-menu';
  menu.innerHTML = nav.innerHTML;
  document.body.appendChild(menu);

  function closeMenu(){
    menu.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
})();

// ==== МОДАЛКА СТУДЕНТОВ (index.html) ====
const overlay = document.getElementById('modalOverlay');

function openModal(id){
  if(!overlay || typeof STUDENTS === 'undefined') return;
  const s = STUDENTS[id];
  if(!s) return;

  document.getElementById('modalPhoto').src = s.img;
  document.getElementById('modalPhoto').alt = s.name;
  document.getElementById('modalName').textContent = s.name;
  document.getElementById('modalRole').textContent = s.role;
  document.getElementById('modalSerial').textContent = s.serial;
  document.getElementById('modalProject').textContent = s.project;
  document.getElementById('modalQuote').textContent = s.quote;

  const statsEl = document.getElementById('modalStats');
  statsEl.innerHTML = s.stats.map(([k,v]) =>
    `<div class="mstat"><span>${k}</span><span>${v}</span></div>`
  ).join('');

  const achEl = document.getElementById('modalAchievements');
  achEl.innerHTML = s.achievements.map(a => `<li>${a}</li>`).join('');

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(){
  if(!overlay) return;
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function closeModalOnBackdrop(e){
  if(e.target === overlay) closeModal();
}

document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape') closeModal();
});


// ==== РЕНДЕР КАРТОЧЕК СТУДЕНТОВ (index.html) ====
(function renderChips(){
  const container = document.getElementById('chipsContainer');
  if(!container || typeof STUDENTS === 'undefined') return;
  container.innerHTML = Object.entries(STUDENTS).map(([id, s], i) => `
    <div class="chip" data-index="U-0${i + 1}" onclick="openModal('${id}')">
      <div class="pins"></div>
      <div class="photo-frame">
        <img src="${s.img}" alt="${s.name}">
        <div class="scan"></div>
      </div>
      <div class="chip-name">${s.name}</div>
      <div class="chip-role">${s.role}</div>
      <div class="chip-quote">${s.chipQuote || ''}</div>
      <div class="chip-more">Детальніше →</div>
    </div>
  `).join('');
})();


// ==== РЕНДЕР ДИРЕКТОРА (index.html) ====
(function renderDirector(){
  const container = document.getElementById('directorContainer');
  if(!container || typeof DIRECTOR === 'undefined') return;
  const d = DIRECTOR;
  container.innerHTML = `
    <div class="director-card">
      <div class="director-photo"><img src="${d.img}" alt="${d.name}"></div>
      <div class="director-info">
        <div class="director-name">${d.name}</div>
        <div class="director-title">${d.title}</div>
        <p class="director-message">${d.message}</p>
        <ul class="info-list">
          ${d.facts.map(f => `<li>${f}</li>`).join('')}
        </ul>
        <div class="director-quote">${d.quote}</div>
      </div>
    </div>
  `;
})();

// ==== РЕНДЕР ВИКЛАДАЧЕЙ (dovidnyk.html) ====
(function renderTeachers(){
  const grid = document.getElementById('teacherGrid');
  if(!grid || typeof TEACHERS === 'undefined') return;
  grid.innerHTML = TEACHERS.map(t => `
    <div class="teacher-card">
      <div class="teacher-photo">
        <img src="${t.img}" alt="${t.name}">
      </div>
      <div class="teacher-info">
        <div class="teacher-name">${t.name}</div>
        <div class="teacher-meta">${t.meta}</div>
        <div class="teacher-edu"><span>Освіта:</span> ${t.edu}</div>
        <div class="teacher-quals">${t.quals}</div>
        <div class="subject-tags">
          ${t.subjects.map(s => `<span class="subject-tag">${s}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
})();

// ==== ВКЛАДКИ (dovidnyk.html) ====
function switchTab(name){
  document.querySelectorAll('.tab-panel').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  const panel = document.getElementById('tab-' + name);
  const btn = document.querySelector('.tab-btn[data-tab="' + name + '"]');
  if(panel) panel.classList.add('active');
  if(btn) btn.classList.add('active');
}

// ==== ТАБЛИЦА ВСЕГО КОЛЛЕКТИВА (dovidnyk.html) ====
function renderStaff(list){
  const body = document.getElementById('staffTableBody');
  if(!body || typeof STAFF === 'undefined') return;
  const noResults = document.getElementById('staffNoResults');
  const count = document.getElementById('staffCount');

  count.textContent = list.length + ' / ' + STAFF.length;

  if(list.length === 0){
    body.innerHTML = '';
    noResults.style.display = 'block';
    return;
  }
  noResults.style.display = 'none';

  body.innerHTML = list.map((p, i) => `
    <tr>
      <td class="col-num">${i + 1}</td>
      <td class="col-name">${p.n}</td>
      <td class="col-cat">${p.c}</td>
      <td class="col-edu">${p.e}</td>
      <td class="col-groups">${p.g}</td>
    </tr>
  `).join('');
}

function filterStaff(){
  const input = document.getElementById('staffSearchInput');
  if(!input) return;
  const q = input.value.trim().toLowerCase();
  if(!q){ renderStaff(STAFF); return; }
  renderStaff(STAFF.filter(p => p.n.toLowerCase().includes(q)));
}

if(document.getElementById('staffTableBody') && typeof STAFF !== 'undefined'){
  renderStaff(STAFF);
}

// ==== ФОРМА ЗАЯВКИ -> TELEGRAM (vstup.html) ====
const TG_BOT_TOKEN = '8869445575:AAGVYg5A66uksBCKF2ZifI2STwGymYNdoeA';
const TG_CHAT_ID   = '1416898411';

const applicationForm = document.getElementById('applicationForm');
const formSuccess = document.getElementById('formSuccess');

if(applicationForm){
  const submitBtn = applicationForm.querySelector('button[type="submit"]');
  const formStatus = applicationForm.querySelector('.form-status');

  applicationForm.addEventListener('submit', function(e){
    e.preventDefault();

    const data = new FormData(applicationForm);
    const text =
      '📥 НОВА ЗАЯВКА НА ВСТУП\n' +
      '━━━━━━━━━━━━━━━━━━\n' +
      '👤 ПІБ: ' + (data.get('fio') || '—') + '\n' +
      '🎂 Дата народження: ' + (data.get('birth') || '—') + '\n' +
      '📞 Телефон: ' + (data.get('phone') || '—') + '\n' +
      '✉️ Email: ' + (data.get('email') || '—') + '\n' +
      '🎓 Спеціальність: ' + (data.get('specialty') || '—') + '\n' +
      '📚 Освіта: ' + (data.get('education') || '—') + '\n' +
      '💬 Коментар: ' + (data.get('message') || '—');

    submitBtn.disabled = true;
    formStatus.textContent = 'Надсилаємо...';

    fetch('https://api.telegram.org/bot' + TG_BOT_TOKEN + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TG_CHAT_ID, text: text })
    })
    .then(res => res.json())
    .then(json => {
      if(json.ok){
        applicationForm.style.display = 'none';
        formSuccess.classList.add('active');
      } else {
        formStatus.textContent = 'Помилка надсилання. Спробуйте ще раз або зателефонуйте.';
        submitBtn.disabled = false;
        console.error('Telegram API error:', json);
      }
    })
    .catch(err => {
      formStatus.textContent = 'Помилка мережі. Спробуйте ще раз або зателефонуйте.';
      submitBtn.disabled = false;
      console.error(err);
    });
  });

  window.resetForm = function(){
    applicationForm.reset();
    applicationForm.style.display = 'grid';
    formSuccess.classList.remove('active');
    submitBtn.disabled = false;
    formStatus.textContent = 'Відповідь приймальної комісії — протягом 1-2 робочих днів';
  };
}
