// ==================================================
// ОБЩАЯ ЛОГИКА САЙТА (работает на всех страницах)
// ==================================================

// контейнер для кнопок в правой части шапки
function hdrActions(){
  const header = document.querySelector('header');
  if(!header) return null;
  let a = header.querySelector('.hdr-actions');
  if(!a){
    a = document.createElement('div');
    a.className = 'hdr-actions';
    header.appendChild(a);
  }
  return a;
}


// ==== МОБИЛЬНОЕ МЕНЮ (бургер) ====
(function initMobileMenu(){
  const header = document.querySelector('header');
  const nav = header && header.querySelector('nav');
  if(!header || !nav) return;

  const burger = document.createElement('button');
  burger.className = 'burger';
  burger.setAttribute('aria-label', 'Меню');
  burger.innerHTML = '<span></span><span></span><span></span>';
  hdrActions().appendChild(burger);

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



// ==== РЕНДЕР ИСТОРИИ (таймлайн) ====
(function renderHistory(){
  const el = document.getElementById('historyTimeline');
  if(!el || typeof HISTORY === 'undefined') return;
  el.innerHTML = HISTORY.map(h => `
    <div class="tl-item">
      <div class="tl-year">${h.year}</div>
      <div class="tl-dot"></div>
      <div class="tl-body">
        <div class="tl-title">${h.title}</div>
        <p class="tl-text">${h.text}</p>
      </div>
    </div>
  `).join('');
})();

// ==== РЕНДЕР ГАЛЕРЕИ + ЛАЙТБОКС ====
(function renderGallery(){
  const grid = document.getElementById('galleryGrid');
  if(!grid || typeof GALLERY === 'undefined') return;

  grid.innerHTML = GALLERY.map((g, i) => `
    <figure class="gal-item" data-i="${i}">
      <img src="${g.img}" alt="${g.caption}" loading="lazy"
           onerror="this.closest('.gal-item').classList.add('gal-missing')">
      <figcaption>${g.caption}</figcaption>
    </figure>
  `).join('');

  // лайтбокс
  let box = null;
  let current = 0;

  function ensureBox(){
    if(box) return box;
    box = document.createElement('div');
    box.className = 'lightbox';
    box.innerHTML = `
      <button class="lb-close" aria-label="Закрити">✕</button>
      <button class="lb-prev" aria-label="Попереднє">‹</button>
      <img class="lb-img" src="" alt="">
      <button class="lb-next" aria-label="Наступне">›</button>
      <div class="lb-caption"></div>`;
    document.body.appendChild(box);

    function close(){
      box.classList.remove('open');
      document.body.style.overflow = '';
    }
    function show(i){
      current = (i + GALLERY.length) % GALLERY.length;
      box.querySelector('.lb-img').src = GALLERY[current].img;
      box.querySelector('.lb-caption').textContent = GALLERY[current].caption;
    }
    box.querySelector('.lb-close').addEventListener('click', close);
    box.querySelector('.lb-prev').addEventListener('click', e => { e.stopPropagation(); show(current - 1); });
    box.querySelector('.lb-next').addEventListener('click', e => { e.stopPropagation(); show(current + 1); });
    box.addEventListener('click', e => { if(e.target === box) close(); });
    document.addEventListener('keydown', e => {
      if(!box.classList.contains('open')) return;
      if(e.key === 'Escape') close();
      if(e.key === 'ArrowLeft') show(current - 1);
      if(e.key === 'ArrowRight') show(current + 1);
    });
    box._show = show;
    return box;
  }

  grid.addEventListener('click', e => {
    const item = e.target.closest('.gal-item');
    if(!item || item.classList.contains('gal-missing')) return;
    const b = ensureBox();
    b._show(parseInt(item.dataset.i));
    b.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
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

// ==== ПОЯВЛЕНИЕ БЛОКОВ ПРИ СКРОЛЛЕ ====
(function initScrollReveal(){
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // группы: дети появляются по очереди (каскадом)
  const staggerGroups = ['.spec-grid', '.chips', '.teacher-grid', '.about-stats', '.info-list'];
  staggerGroups.forEach(sel => {
    document.querySelectorAll(sel).forEach(group => {
      Array.from(group.children).forEach((child, i) => {
        child.classList.add('reveal');
        child.style.transitionDelay = Math.min(i * 0.06, 0.5) + 's';
      });
    });
  });

  // одиночные блоки
  const singles = [
    '.board-heading', '.about-inner', '.director-card', '.apply-inner',
    '.form-panel', '.contacts-inner', '.tabs-bar', '.tab-lede',
    '.staff-table-wrap', '.schedule-table'
  ];
  singles.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => el.classList.add('reveal'));
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// ==== КАРТА В КОНТАКТАХ ====
(function addContactsMap(){
  const contacts = document.querySelector('.contacts-section');
  if(!contacts || contacts.querySelector('.map-wrap')) return;

  const wrap = document.createElement('div');
  wrap.className = 'map-wrap';
  wrap.innerHTML = `
    <iframe
      src="https://www.google.com/maps?q=51.2248908,33.2270324&hl=uk&z=16&output=embed"
      loading="lazy"
      allowfullscreen
      referrerpolicy="no-referrer-when-downgrade"
      title="Карта — ВСП КІПФК СумДУ, вул. М. Немолота, 12, Конотоп"></iframe>
    <a class="map-link" href="https://www.google.com/maps/search/?api=1&query=51.2248908,33.2270324" target="_blank" rel="noopener">
      Відкрити в Google Maps →
    </a>
  `;
  contacts.appendChild(wrap);
})();

// ==== КНОПКА "НАВЕРХ" ====
(function initToTop(){
  const btn = document.createElement('button');
  btn.className = 'to-top';
  btn.setAttribute('aria-label', 'Наверх');
  btn.innerHTML = '↑';
  document.body.appendChild(btn);

  function toggle(){
    btn.classList.toggle('show', window.scrollY > 500);
  }
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ==== НОВОСТИ (index.html) ====
(function renderNews(){
  const container = document.getElementById('newsContainer');
  if(!container || typeof NEWS === 'undefined' || !NEWS.length) return;
  container.innerHTML = NEWS.map(n => {
    const d = new Date(n.date);
    const dateStr = isNaN(d) ? n.date : d.toLocaleDateString('uk-UA', {day:'numeric', month:'long', year:'numeric'});
    return `
      <div class="news-card">
        <div class="news-date">${dateStr}</div>
        <div class="news-body">
          <div class="news-title">${n.title}</div>
          <p class="news-text">${n.text}</p>
        </div>
      </div>`;
  }).join('');
})();

// ==== ТАЙМЕР ДО КОНЦА ПРИЁМА (в баннере "Вступ") ====
(function initCountdown(){
  const banner = document.querySelector('.apply-inner');
  if(!banner || typeof SETTINGS === 'undefined' || !SETTINGS.admissionDeadline) return;

  const deadline = new Date(SETTINGS.admissionDeadline);
  if(isNaN(deadline)) return;

  const box = document.createElement('div');
  box.className = 'countdown';
  box.innerHTML = `
    <div class="countdown-title">${SETTINGS.admissionTitle || 'До завершення прийому документів'}</div>
    <div class="countdown-units">
      <div class="cd-unit"><span class="cd-num" id="cd-d">0</span><span class="cd-label">дн</span></div>
      <div class="cd-unit"><span class="cd-num" id="cd-h">0</span><span class="cd-label">год</span></div>
      <div class="cd-unit"><span class="cd-num" id="cd-m">0</span><span class="cd-label">хв</span></div>
      <div class="cd-unit"><span class="cd-num" id="cd-s">0</span><span class="cd-label">сек</span></div>
    </div>`;
  banner.appendChild(box);

  function tick(){
    const diff = deadline - new Date();
    if(diff <= 0){
      box.innerHTML = '<div class="countdown-title">Прийом документів завершено</div>';
      clearInterval(timer);
      return;
    }
    const s = Math.floor(diff / 1000);
    document.getElementById('cd-d').textContent = Math.floor(s / 86400);
    document.getElementById('cd-h').textContent = Math.floor((s % 86400) / 3600);
    document.getElementById('cd-m').textContent = Math.floor((s % 3600) / 60);
    document.getElementById('cd-s').textContent = s % 60;
  }
  tick();
  const timer = setInterval(tick, 1000);
})();

// ==== ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ ====
(function initTheme(){
  const header = document.querySelector('header');
  if(!header) return;

  const saved = localStorage.getItem('kipt_theme');
  if(saved === 'light') document.body.classList.add('light');

  const btn = document.createElement('button');
  btn.className = 'hdr-btn theme-btn';
  btn.setAttribute('aria-label', 'Тема');
  btn.textContent = document.body.classList.contains('light') ? '🌙' : '☀️';

  const actions = hdrActions();
  actions.insertBefore(btn, actions.querySelector('.burger'));

  btn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light');
    localStorage.setItem('kipt_theme', isLight ? 'light' : 'dark');
    btn.textContent = isLight ? '🌙' : '☀️';
  });
})();

// ==== ПЕРЕКЛЮЧАТЕЛЬ ЯЗЫКА UA/EN ====
const I18N = {
  "Головна": "Home",
  "Спеціальності": "Programs",
  "Довідник": "Handbook",
  "Вступ 2026": "Admission 2026",
  "Контакти": "Contacts",
  "Фахова передвища освіта · 12 спеціальностей": "Professional pre-higher education · 12 programs",
  "Конотопський": "Konotop",
  "індустріально-педагогічний": "Industrial-Pedagogical",
  "фаховий коледж СумДУ": "Applied College of SumDU",
  "Готуємо": "We train",
  "фахових молодших бакалаврів": "applied junior bachelors",
  ", які збирають код і схеми так само впевнено, як і власне майбутнє. Від інженерії програмного забезпечення до електротехніки — тут навчаються ті, хто завтра будує реальні системи.": " who assemble code and circuits as confidently as their own future. From software engineering to electrical engineering — this is where tomorrow's builders of real systems study.",
  "Ступінь": "Degree",
  "фаховий мол. бакалавр": "applied junior bachelor",
  "Спеціальностей": "Programs",
  "Місто": "City",
  "Конотоп": "Konotop",
  "Заклад": "Institution",
  "Наші здобувачі →": "Our students →",
  "Спеціальності коледжу": "College programs",
  "Про коледж": "About the college",
  "Хто ми": "Who we are",
  "Інноваційний багатопрофільний заклад фахової передвищої освіти — відокремлений структурний підрозділ Сумського державного університету. Готує фахових молодших бакалаврів за 12 спеціальностями: від IT та електротехніки до будівництва, фінансів і соціальної роботи.": "An innovative multi-profile institution of professional pre-higher education — a separate structural unit of Sumy State University. It trains applied junior bachelors in 12 programs: from IT and electrical engineering to construction, finance and social work.",
  "спеціальностей": "programs",
  "ступінь: фаховий мол. бакалавр": "degree: applied junior bachelor",
  "відокремлений підрозділ університету": "separate unit of the university",
  "вул. М. Немолота, 12": "12 M. Nemolota St.",
  "Новини та оголошення": "News & announcements",
  "// АКТУАЛЬНЕ": "// LATEST",
  "Слово директора": "Director's word",
  "// КЕРІВНИЦТВО": "// LEADERSHIP",
  "Кращі здобувачі коледжу": "Top students of the college",
  "// 2 КУРС · ДІЮЧА ЗБІРКА": "// 2ND YEAR · ACTIVE BUILD",
  "Детальніше →": "More →",
  "Вступна кампанія 2026": "Admission campaign 2026",
  "Твоє місце в майбутньому вже креслять.": "Your place in the future is already being drafted.",
  "Подати документи": "Apply now",
  "Умови вступу": "Admission terms",
  "Написати приймальній комісії": "Contact the admissions office",
  "// ФАХОВИЙ МОЛОДШИЙ БАКАЛАВР · 12 СПЕЦІАЛЬНОСТЕЙ": "// APPLIED JUNIOR BACHELOR · 12 PROGRAMS",
  "Для випускників 9–11 класів:": "For graduates of grades 9–11:",
  "Для випускників ДПТНЗ (професійна освіта):": "For vocational school graduates (professional education):",
  "Інженерія програмного забезпечення": "Software Engineering",
  "IT · код": "IT · code",
  "Електрична інженерія": "Electrical Engineering",
  "струм · схеми": "current · circuits",
  "Будівництво та цивільна інженерія": "Construction and Civil Engineering",
  "будівництво": "construction",
  "Автомобільний транспорт": "Automobile Transport",
  "транспорт": "transport",
  "Фінанси, банківська справа, страхування та фондовий ринок": "Finance, Banking, Insurance and Stock Market",
  "економіка": "economics",
  "Соціальна робота та консультування": "Social Work and Counseling",
  "соц. сфера": "social sphere",
  "Торгівля": "Trade",
  "бізнес": "business",
  "Професійна освіта. Цифрові технології": "Professional Education. Digital Technologies",
  "Професійна освіта. Електротехніка": "Professional Education. Electrical Engineering",
  "Професійна освіта. Зварювання": "Professional Education. Welding",
  "метал": "metal",
  "Професійна освіта. Будівництво": "Professional Education. Construction",
  "Професійна освіта. Транспорт": "Professional Education. Transport",
  "Довідник для абітурієнтів і студентів": "Handbook for applicants and students",
  "// ОБЕРИ ВКЛАДКУ": "// PICK A TAB",
  "Викладачі": "Teachers",
  "Весь колектив": "Full staff",
  "Стипендія": "Scholarship",
  "Гуртожиток": "Dormitory",
  "Розклад": "Schedule",
  "Студентське життя": "Student life",
  "Гордість коледжу": "College pride",
  "Практика": "Internship",
  "Історія": "History",
  "Галерея": "Gallery",
  "Пара": "Class",
  "Час": "Time",
  "Пн–Пт": "Mon–Fri",
  "Подати заявку на вступ": "Apply for admission",
  "// ФОРМА · ПРИЙМАЛЬНА КОМІСІЯ": "// FORM · ADMISSIONS OFFICE",
  "ПІБ абітурієнта": "Full name",
  "Дата народження": "Date of birth",
  "Телефон": "Phone",
  "Обрана спеціальність": "Chosen program",
  "Оберіть спеціальність": "Choose a program",
  "Освіта на момент вступу": "Education at the time of application",
  "Оберіть варіант": "Choose an option",
  "9 класів": "9 grades",
  "11 класів": "11 grades",
  "Диплом кваліфікованого робітника": "Qualified worker diploma",
  "Інше / ще не визначився(лась)": "Other / undecided",
  "Коментар / питання до приймальної комісії": "Comment / question to the admissions office",
  "необов'язкове поле": "optional field",
  "Даю згоду на обробку персональних даних відповідно до Закону України «Про захист персональних даних» для цілей розгляду заявки на вступ.": "I consent to the processing of my personal data in accordance with the Law of Ukraine \"On Personal Data Protection\" for the purpose of reviewing my application.",
  "Надіслати заявку →": "Send application →",
  "Відповідь приймальної комісії — протягом 1-2 робочих днів": "The admissions office will reply within 1-2 business days",
  "// ПРИЙМАЛЬНА КОМІСІЯ": "// ADMISSIONS OFFICE",
  "Адреса": "Address",
  "Приймальна комісія": "Admissions office",
  "Факс": "Fax",
  "Сайт": "Website",
  "Ел. бібліотека": "E-library",
  "Відкрити в Google Maps →": "Open in Google Maps →",
  "м. Конотоп, вул. М. Немолота, 12, Сумська обл.": "12 M. Nemolota St., Konotop, Sumy region",
  "До завершення прийому документів": "Until the application deadline",
  "Прийом документів завершено": "Application period is over",
  "дн": "d",
  "год": "h",
  "хв": "m",
  "сек": "s",
  "© ВСП «Конотопський індустріально-педагогічний фаховий коледж СумДУ» · м. Конотоп, вул. М. Немолота, 12": "© Konotop Industrial-Pedagogical Applied College of SumDU · 12 M. Nemolota St., Konotop",
  "Прототип · макет не є офіційним сайтом коледжу": "Prototype · this mockup is not the official college website"
};

let i18nNodes = null;

function applyLang(lang){
  if(!i18nNodes){
    i18nNodes = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while(n = walker.nextNode()){
      const t = n.nodeValue.trim();
      if(t && I18N[t]){
        i18nNodes.push([n, n.nodeValue, n.nodeValue.replace(t, I18N[t])]);
      }
    }
    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
      const p = el.getAttribute('placeholder');
      if(I18N[p]) i18nNodes.push([el, p, I18N[p], 'placeholder']);
    });
  }
  i18nNodes.forEach(item => {
    if(item[3] === 'placeholder'){
      item[0].setAttribute('placeholder', lang === 'en' ? item[2] : item[1]);
    } else {
      item[0].nodeValue = lang === 'en' ? item[2] : item[1];
    }
  });
  document.documentElement.lang = lang === 'en' ? 'en' : 'uk';
  localStorage.setItem('kipt_lang', lang);
  const btn = document.querySelector('.lang-btn');
  if(btn) btn.textContent = lang === 'en' ? 'UA' : 'EN';
}

(function initLang(){
  const header = document.querySelector('header');
  if(!header) return;

  const btn = document.createElement('button');
  btn.className = 'hdr-btn lang-btn';
  btn.setAttribute('aria-label', 'Мова / Language');
  btn.textContent = 'EN';

  const actions = hdrActions();
  actions.insertBefore(btn, actions.querySelector('.theme-btn') || actions.querySelector('.burger'));

  btn.addEventListener('click', () => {
    const next = (localStorage.getItem('kipt_lang') === 'en') ? 'ua' : 'en';
    applyLang(next);
  });

  if(localStorage.getItem('kipt_lang') === 'en') applyLang('en');
})();

// ==== ГРУППИРОВКА КНОПОК ШАПКИ (симметричный layout) ====
(function groupHeaderControls(){
  const header = document.querySelector('header');
  if(!header || header.querySelector('.hdr-right')) return;
  const right = document.createElement('div');
  right.className = 'hdr-right';
  const lang = header.querySelector('.lang-btn');
  const theme = header.querySelector('.theme-btn');
  const burger = header.querySelector('.burger');
  [lang, theme, burger].forEach(el => { if(el) right.appendChild(el); });
  header.appendChild(right);
})();

// ==== МОДАЛКА СПЕЦИАЛЬНОСТЕЙ ====
(function initSpecModal(){
  if(typeof SPECIALTIES === 'undefined') return;
  const rows = document.querySelectorAll('.spec-row');
  if(!rows.length) return;

  // создаём модалку один раз
  let specOverlay = null;
  function ensureOverlay(){
    if(specOverlay) return specOverlay;
    specOverlay = document.createElement('div');
    specOverlay.className = 'modal-overlay';
    specOverlay.innerHTML = `
      <div class="modal-card spec-modal-card">
        <button class="modal-close" aria-label="Закрити">✕</button>
        <div class="spec-modal-body">
          <div class="modal-tag">// СПЕЦІАЛЬНІСТЬ</div>
          <h3 class="modal-name" id="specModalName"></h3>
          <div class="spec-badge" id="specModalBadge"></div>
          <p class="modal-block-body" id="specModalDesc" style="margin-bottom:22px;"></p>
          <div class="modal-block">
            <div class="modal-block-label">Чого навчають</div>
            <ul class="modal-achievements" id="specModalLearn"></ul>
          </div>
          <div class="modal-block">
            <div class="modal-block-label">Ким працювати</div>
            <ul class="modal-achievements" id="specModalCareer"></ul>
          </div>
          <a href="vstup.html" class="btn primary" style="margin-top:6px;">Подати заявку →</a>
        </div>
      </div>`;
    document.body.appendChild(specOverlay);

    function close(){
      specOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
    specOverlay.querySelector('.modal-close').addEventListener('click', close);
    specOverlay.addEventListener('click', e => { if(e.target === specOverlay) close(); });
    document.addEventListener('keydown', e => { if(e.key === 'Escape') close(); });
    return specOverlay;
  }

  rows.forEach(row => {
    const nameEl = row.querySelector('.spec-name');
    if(!nameEl) return;
    const key = nameEl.textContent.trim();
    const s = SPECIALTIES[key];
    if(!s) return; // строки без данных (например, рейтинги стипендий) не трогаем

    row.classList.add('spec-clickable');

    row.addEventListener('click', () => {
      const ov = ensureOverlay();
      document.getElementById('specModalName').textContent = key;
      const badge = document.getElementById('specModalBadge');
      if(s.badge){
        badge.textContent = s.badge;
        badge.style.display = 'inline-block';
      } else {
        badge.style.display = 'none';
      }
      document.getElementById('specModalDesc').textContent = s.desc;
      document.getElementById('specModalLearn').innerHTML = s.learn.map(x => `<li>${x}</li>`).join('');
      document.getElementById('specModalCareer').innerHTML = s.career.map(x => `<li>${x}</li>`).join('');
      ov.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });
})();

// ==== АВТОПОДСВЕТКА АКТИВНОЙ СТРАНИЦЫ ====
(function highlightActiveNav(){
  let page = location.pathname.split('/').pop() || 'index.html';
  if(!page.endsWith('.html')) page = 'index.html';
  document.querySelectorAll('header nav a, .mobile-menu a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('#')[0];
    if(href === page) a.classList.add('active');
  });
})();

// ==== ПРОГРЕСС-БАР ЧТЕНИЯ ====
(function initProgressBar(){
  const bar = document.createElement('div');
  bar.className = 'progress-bar';
  document.body.appendChild(bar);

  function update(){
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    bar.style.width = pct + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
})();

// ==== ПОИСК ПО ВСЕМУ САЙТУ ====
(function initSiteSearch(){
  const header = document.querySelector('header');
  if(!header) return;

  // кнопка в шапке
  const btn = document.createElement('button');
  btn.className = 'hdr-btn search-btn';
  btn.setAttribute('aria-label', 'Пошук');
  btn.textContent = '🔍';
  const right = header.querySelector('.hdr-right');
  if(right) right.insertBefore(btn, right.firstChild);
  else header.appendChild(btn);

  // оверлей
  const overlay = document.createElement('div');
  overlay.className = 'search-overlay';
  overlay.innerHTML = `
    <div class="search-box">
      <input type="text" class="search-input" placeholder="Пошук: спеціальності, викладачі, новини...">
      <button class="search-close" aria-label="Закрити">✕</button>
    </div>
    <div class="search-results"></div>`;
  document.body.appendChild(overlay);

  const input = overlay.querySelector('.search-input');
  const resultsEl = overlay.querySelector('.search-results');

  // индекс строится один раз из данных data.js
  let index = null;
  function buildIndex(){
    if(index) return index;
    index = [];
    const add = (cat, title, text, url) => index.push({cat, title, text: text || '', url});

    if(typeof SPECIALTIES !== 'undefined')
      Object.entries(SPECIALTIES).forEach(([name, s]) => add('Спеціальність', name, s.desc, 'specialnosti.html'));
    if(typeof NEWS !== 'undefined')
      NEWS.forEach(n => add('Новина', n.title, n.text, 'index.html#news'));
    if(typeof TEACHERS !== 'undefined')
      TEACHERS.forEach(t => add('Викладач', t.name, t.meta, 'dovidnyk.html#tab-teachers'));
    if(typeof STAFF !== 'undefined')
      STAFF.forEach(p => add('Колектив', p.n, p.c, 'dovidnyk.html#tab-allstaff'));
    if(typeof HISTORY !== 'undefined')
      HISTORY.forEach(h => add('Історія', h.year + ' — ' + h.title, h.text, 'dovidnyk.html#tab-history'));
    if(typeof STUDENTS !== 'undefined')
      Object.values(STUDENTS).forEach(s => add('Здобувач', s.name, s.role, 'index.html#students'));
    if(typeof DIRECTOR !== 'undefined' && DIRECTOR)
      add('Керівництво', DIRECTOR.name, DIRECTOR.title, 'index.html#director');

    // статичные разделы
    add('Розділ', 'Стипендія', 'рейтинги успішності за курсами', 'dovidnyk.html#tab-scholarship');
    add('Розділ', 'Гуртожиток', 'поселення іногородніх здобувачів', 'dovidnyk.html#tab-dorm');
    add('Розділ', 'Розклад', 'структура навчального дня', 'dovidnyk.html#tab-schedule');
    add('Розділ', 'Студентське життя', 'гуртки, самоврядування, волонтерство', 'dovidnyk.html#tab-life');
    add('Розділ', 'Практика', 'бази практик та працевлаштування', 'dovidnyk.html#tab-practice');
    add('Розділ', 'Галерея', 'фотографії коледжу', 'dovidnyk.html#tab-gallery');
    add('Розділ', 'Контакти', 'адреса, телефони, карта', 'kontakty.html');
    add('Розділ', 'Подати заявку на вступ', 'онлайн-форма приймальної комісії', 'vstup.html');
    return index;
  }

  function doSearch(){
    const q = input.value.trim().toLowerCase();
    if(q.length < 2){
      resultsEl.innerHTML = '<div class="search-hint">Введи мінімум 2 символи</div>';
      return;
    }
    const found = buildIndex().filter(item =>
      item.title.toLowerCase().includes(q) || item.text.toLowerCase().includes(q)
    ).slice(0, 20);

    if(!found.length){
      resultsEl.innerHTML = '<div class="search-hint">Нічого не знайдено за запитом «' + input.value + '»</div>';
      return;
    }
    resultsEl.innerHTML = found.map(item => `
      <a class="sr-item" href="${item.url}">
        <span class="sr-cat">${item.cat}</span>
        <span class="sr-title">${item.title}</span>
        <span class="sr-text">${item.text.slice(0, 90)}${item.text.length > 90 ? '…' : ''}</span>
      </a>
    `).join('');
  }

  function open(){
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => input.focus(), 100);
    doSearch();
  }
  function close(){
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', open);
  overlay.querySelector('.search-close').addEventListener('click', close);
  overlay.addEventListener('click', e => { if(e.target === overlay) close(); });
  input.addEventListener('input', doSearch);
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape') close();
    if(e.key === '/' && !overlay.classList.contains('open') &&
       !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){
      e.preventDefault(); open();
    }
  });
})();

// ==== ОТКРЫТИЕ ВКЛАДКИ ПО ХЕШУ (для ссылок из поиска) ====
(function tabDeepLink(){
  if(!location.hash.startsWith('#tab-')) return;
  const name = location.hash.slice(5);
  const panel = document.getElementById('tab-' + name);
  if(!panel) return;
  switchTab(name);
  const hub = document.getElementById('info-hub');
  if(hub) setTimeout(() => hub.scrollIntoView({behavior:'smooth'}), 100);
})();

// ==== ОТКРЫТИЕ ВКЛАДКИ ПО ХЭШУ (#tab-...) ====
(function tabFromHash(){
  function applyHash(){
    if(location.hash && location.hash.startsWith('#tab-')){
      const name = location.hash.slice(5);
      if(document.getElementById('tab-' + name)) switchTab(name);
    }
  }
  window.addEventListener('hashchange', applyHash);
  applyHash();
})();

// ==== ПОИСК ПО ВСЕМУ САЙТУ ====
(function initSiteSearch(){
  const right = document.querySelector('.hdr-right');
  const header = document.querySelector('header');
  if(!header) return;

  // индекс: собираем всё из data.js + статичные разделы
  const index = [];
  function add(cat, title, text, url){
    index.push({ cat, title, text: (text || '').toLowerCase(), tl: title.toLowerCase(), url });
  }

  if(typeof SPECIALTIES !== 'undefined'){
    Object.entries(SPECIALTIES).forEach(([name, s]) => {
      add('Спеціальність', name, s.desc + ' ' + (s.career || []).join(' '), 'specialnosti.html');
    });
  }
  if(typeof NEWS !== 'undefined'){
    NEWS.forEach(n => add('Новина', n.title, n.text, 'index.html#news'));
  }
  if(typeof TEACHERS !== 'undefined'){
    TEACHERS.forEach(t => add('Викладач', t.name, t.meta + ' ' + (t.subjects || []).join(' '), 'dovidnyk.html#tab-teachers'));
  }
  if(typeof STAFF !== 'undefined'){
    STAFF.forEach(p => add('Колектив', p.n, p.c + ' ' + p.g, 'dovidnyk.html#tab-allstaff'));
  }
  if(typeof HISTORY !== 'undefined'){
    HISTORY.forEach(h => add('Історія', h.year + ' — ' + h.title, h.text, 'dovidnyk.html#tab-history'));
  }
  if(typeof GALLERY !== 'undefined'){
    GALLERY.forEach(g => add('Галерея', g.caption, '', 'dovidnyk.html#tab-gallery'));
  }
  if(typeof STUDENTS !== 'undefined'){
    Object.values(STUDENTS).forEach(s => add('Здобувач', s.name, s.role, 'index.html#students'));
  }
  if(typeof DIRECTOR !== 'undefined' && DIRECTOR){
    add('Керівництво', DIRECTOR.name, DIRECTOR.title, 'index.html#director');
  }
  // статичные разделы
  add('Розділ', 'Стипендія', 'рейтинг успішності стипендія', 'dovidnyk.html#tab-scholarship');
  add('Розділ', 'Гуртожиток', 'поселення іногородні', 'dovidnyk.html#tab-dorm');
  add('Розділ', 'Розклад занять', 'пари час навчання', 'dovidnyk.html#tab-schedule');
  add('Розділ', 'Студентське життя', 'гуртки волонтерство самоврядування', 'dovidnyk.html#tab-life');
  add('Розділ', 'Практика', 'бази практик підприємства', 'dovidnyk.html#tab-practice');
  add('Розділ', 'Подати заявку на вступ', 'форма приймальна комісія документи', 'vstup.html');
  add('Розділ', 'Контакти', 'адреса телефон карта', 'kontakty.html');

  // кнопка в шапке
  const btn = document.createElement('button');
  btn.className = 'hdr-btn search-btn';
  btn.setAttribute('aria-label', 'Пошук');
  btn.innerHTML = '🔍';
  if(right) right.insertBefore(btn, right.firstChild);
  else header.appendChild(btn);

  // оверлей поиска
  let overlaySearch = null;
  function ensureSearch(){
    if(overlaySearch) return overlaySearch;
    overlaySearch = document.createElement('div');
    overlaySearch.className = 'search-overlay';
    overlaySearch.innerHTML = `
      <div class="search-box">
        <input type="text" class="search-input" placeholder="Пошук по сайту..." autocomplete="off">
        <button class="search-close" aria-label="Закрити">✕</button>
        <div class="search-results"></div>
      </div>`;
    document.body.appendChild(overlaySearch);

    const input = overlaySearch.querySelector('.search-input');
    const results = overlaySearch.querySelector('.search-results');

    function close(){
      overlaySearch.classList.remove('open');
      document.body.style.overflow = '';
    }
    overlaySearch.querySelector('.search-close').addEventListener('click', close);
    overlaySearch.addEventListener('click', e => { if(e.target === overlaySearch) close(); });
    document.addEventListener('keydown', e => {
      if(e.key === 'Escape' && overlaySearch.classList.contains('open')) close();
    });

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if(q.length < 2){
        results.innerHTML = '<div class="search-hint">Введи мінімум 2 символи</div>';
        return;
      }
      const found = index.filter(item => item.tl.includes(q) || item.text.includes(q)).slice(0, 12);
      if(!found.length){
        results.innerHTML = '<div class="search-hint">Нічого не знайдено за запитом «' + input.value.trim() + '»</div>';
        return;
      }
      results.innerHTML = found.map(item => `
        <a class="search-result" href="${item.url}">
          <span class="sr-cat">${item.cat}</span>
          <span class="sr-title">${item.title}</span>
        </a>`).join('');
    });

    overlaySearch._input = input;
    overlaySearch._results = results;
    return overlaySearch;
  }

  btn.addEventListener('click', () => {
    const ov = ensureSearch();
    ov.classList.add('open');
    document.body.style.overflow = 'hidden';
    ov._results.innerHTML = '<div class="search-hint">Спеціальності, новини, викладачі, розділи…</div>';
    ov._input.value = '';
    setTimeout(() => ov._input.focus(), 60);
  });
})();

// ==== РЕГИСТРАЦИЯ SERVICE WORKER (PWA) ====
if('serviceWorker' in navigator){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(err => console.log('SW registration failed:', err));
  });
}
