(() => {
  const startInput = document.getElementById('startInput');
  const endInput = document.getElementById('endInput');
  const missionInput = document.getElementById('missionInput');
  const setBtn = document.getElementById('setBtn');
  const summaryLine = document.getElementById('summaryLine');
  const fillEl = document.getElementById('fill');
  const progressText = document.getElementById('progressText');
  const values = {
    years: document.querySelector('[data-unit="years"]'),
    months: document.querySelector('[data-unit="months"]'),
    weeks: document.querySelector('[data-unit="weeks"]'),
    days: document.querySelector('[data-unit="days"]'),
    hours: document.querySelector('[data-unit="hours"]'),
    mins: document.querySelector('[data-unit="minutes"]'),
    secs: document.querySelector('[data-unit="seconds"]'),
    ms: document.querySelector('[data-unit="millis"]'),
  };
  const dur = {
    years: document.getElementById('durYears'),
    months: document.getElementById('durMonths'),
    weeks: document.getElementById('durWeeks'),
    days: document.getElementById('durDays'),
    hours: document.getElementById('durHours'),
    mins: document.getElementById('durMins'),
    secs: document.getElementById('durSecs'),
    ms: document.getElementById('durMillis'),
  };
  const KEY = 'phynoraCountdown';
  let startDate = null;
  let targetDate = null;
  let rafId = null;

  function parseDateInput(el) {
    if (!el || !el.value) return null;
    const [y, m, d] = el.value.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  function addDuration(base, add) {
    const dt = new Date(base);
    if (add.years) dt.setFullYear(dt.getFullYear() + add.years);
    if (add.months) dt.setMonth(dt.getMonth() + add.months);
    if (add.weeks) dt.setDate(dt.getDate() + add.weeks * 7);
    if (add.days) dt.setDate(dt.getDate() + add.days);
    if (add.hours) dt.setHours(dt.getHours() + add.hours);
    if (add.mins) dt.setMinutes(dt.getMinutes() + add.mins);
    if (add.secs) dt.setSeconds(dt.getSeconds() + add.secs);
    if (add.ms) dt.setMilliseconds(dt.getMilliseconds() + add.ms);
    return dt;
  }

  function buildTarget() {
    const s = parseDateInput(startInput);
    if (!s) return { ok: false, msg: 'Invalid Start Date' };
    const e = parseDateInput(endInput);
    if (e && e > s) return { ok: true, start: s, target: e };

    const add = {
      years: +dur.years.value || 0,
      months: +dur.months.value || 0,
      weeks: +dur.weeks.value || 0,
      days: +dur.days.value || 0,
      hours: +dur.hours.value || 0,
      mins: +dur.mins.value || 0,
      secs: +dur.secs.value || 0,
      ms: +dur.ms.value || 0,
    };
    const t = addDuration(s, add);
    return { ok: true, start: s, target: t };
  }

  function save() {
    localStorage.setItem(
      KEY,
      JSON.stringify({ start: startDate, target: targetDate, mission: missionInput.value })
    );
  }

  function render() {
    if (!startDate || !targetDate) return;
    const now = new Date();
    const diff = targetDate - now;
    if (diff <= 0) return;

    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    const days = Math.floor((diff / (1000 * 60 * 60 * 24)) % 365);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);
    const ms = Math.floor(diff % 1000);

    values.years.textContent = years;
    values.days.textContent = days;
    values.hours.textContent = hours;
    values.mins.textContent = mins;
    values.secs.textContent = secs;
    values.ms.textContent = String(ms).padStart(3, '0');

    fillEl.style.width = ((now - startDate) / (targetDate - startDate)) * 100 + '%';
    progressText.textContent = `${(((now - startDate) / (targetDate - startDate)) * 100).toFixed(2)}% complete`;

    rafId = requestAnimationFrame(render);
  }

  setBtn.addEventListener('click', () => {
    const built = buildTarget();
    if (!built.ok) return alert(built.msg);
    startDate = built.start;
    targetDate = built.target;
    save();
    render();
  });
})();

