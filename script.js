/* DON'T LIKE YOUR MOM — v0.1, fully static GitHub Pages game. */
(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const SCREENS = { welcome: $('welcomeScreen'), game: $('gameScreen'), result: $('resultScreen') };
  const ui = {
    start: $('startButton'), retry: $('retryButton'), share: $('shareButton'),
    card: $('swipeCard'), cardArea: $('cardArea'), profileImage: $('profileImage'),
    profileName: $('profileName'), profileBio: $('profileBio'), profileCity: $('profileCity'),
    likeStamp: $('likeStamp'), nopeStamp: $('nopeStamp'),
    nope: $('nopeButton'), like: $('likeButton'),
    timer: $('timerValue'), timerFill: $('timerFill'), score: $('scoreValue'), best: $('bestValue'),
    stagePill: $('stagePill'), stageName: $('stageName'), combo: $('comboChip'),
    resultEmoji: $('resultEmoji'), resultEyebrow: $('resultEyebrow'),
    resultTitle: $('resultTitle'), resultSubtitle: $('resultSubtitle'),
    finalScore: $('finalScore'), finalTime: $('finalTime'), finalAvoided: $('finalAvoided'),
    evidencePanel: $('evidencePanel'), evidenceImage: $('evidenceImage'),
    evidenceSpot: $('evidenceSpot'), evidenceIdentity: $('evidenceIdentity'),
    evidenceReason: $('evidenceReason'), recordMessage: $('recordMessage')
  };
  const DURATION = 30_000;
  const LEVELS = [
    { at: 0, title: '媽媽直接現身', momChance: .20 },
    { at: 8, title: '媽媽混入背景', momChance: .25 },
    { at: 17, title: '小心鏡子與相框', momChance: .31 },
    { at: 27, title: '名字也會藏 MOM', momChance: .37 }
  ];
  const NAMES = [
    'Jessie','Alex','Yuki','Ryan','Mia','Leo','Ariel','Kevin','Nina','Evan',
    'Tina','Marcus','Olivia','Jay','Claire','Ethan','Amber','Kai','Emma','Lucas',
    'Ruby','Jason','Naomi','Ben','Zoe','Daniel','Lily','Max','Nora','Peter',
    'Sophie','Noah','Alice','Oscar','Hana','Tom','Emily','Felix','Chloe','Andy',
    'Bella','Chris','Ivy','Robin','Jade','Theo','Luna','Eric','Grace','Henry',
    'Daisy','Sam','Vicky','Allen','Annie','Sean','Eva','Jack','Lucy',
    'Rita','Owen','Rose','Finn','Wendy'
  ];
  const BIOS = [
    '喜歡咖啡、電影，還有散步。','週末想去海邊發呆。','可以一起吃宵夜嗎？',
    '我有一隻很黏人的貓。','旅行的意義是找到好吃的。','新手登山客，缺個旅伴。',
    '最愛下雨天聽音樂。','一起探索城市的小角落。','想找人一起看恐怖片！',
    '每天都要喝一杯拿鐵。','最近開始學做甜點。','有沒有推薦的漫畫？',
    '交友第一天，請多指教。','喜歡小動物和慢慢的生活。','一起去逛夜市吧！',
    '我會煮義大利麵，真的。','希望遇到幽默的人。','想挑戰人生第一場馬拉松。',
    '海邊夕陽真的很療癒。','想找人一起練英文。'
  ];
  const CITIES = ['台北','高雄','台中','台南','桃園','新竹','嘉義','花蓮','宜蘭','基隆'];
  const MOM_NAMES = ['Momoko','MOM_1998','OnlyMom','MommyLove','MommaMia','SuperMOM','MOM_IS_HERE','Mommy_Queen'];
  const MOM_BIOS = ['週末都和 MOM 一起做甜點。','我的暱稱就是 MOM，你猜為什麼？','#MOM #Coffee #Love','喜歡旅行、貓咪、還有 MOM。'];
  const ART = window.ART_DATA;
  if (!ART) {
    console.error('Art data failed to load. Check that art-data.js is uploaded.');
    $('welcomeTitle').textContent = '素材未載入，請重新整理';
    ui.start.disabled = true;
    return;
  }

  let best = readBest();
  let active = false;
  let locked = false;
  let ended = false;
  let score = 0;
  let avoided = 0;
  let skipped = 0;
  let combo = 0;
  let shown = 0;
  let firstMomAt = 4;
  let current = null;
  let endAt = 0;
  let startAt = 0;
  let frame = null;
  let pendingTransition = null;
  let lastOutcome = null;
  const bags = {};
  let dragging = null;
  let momPending = false;

  function readBest() {
    try { return Number(localStorage.getItem('dlym_best_v1')) || 0; }
    catch { return 0; }
  }
  function saveBest(value) {
    try { localStorage.setItem('dlym_best_v1', String(value)); } catch { /* private browsing */ }
  }
  function random(array) { return array[Math.floor(Math.random() * array.length)]; }
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  function pull(type) {
    if (!bags[type] || !bags[type].length) bags[type] = shuffle(ART[type].slice());
    return bags[type].pop();
  }
  function makeProfile(art) {
    const idx = ((art.persona || 1) - 1) % 64;
    return {
      image: `./assets/profiles/${art.file}`,
      name: NAMES[idx],
      age: idx % 12 === 0 ? 49 + idx % 8 : 22 + (idx * 7) % 19,
      bio: BIOS[(idx * 7 + 3) % BIOS.length],
      city: CITIES[(idx * 3) % CITIES.length],
      isMom: false,
      trapType: null,
      spot: null,
      reason: ''
    };
  }
  function level() {
    let idx = 0;
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (score >= LEVELS[i].at) { idx = i; break; }
    }
    return idx;
  }
  function nextProfile() {
    shown++;
    const lvl = level();
    let isMom = false;
    let trapType = 'direct';
    if (shown < firstMomAt) isMom = false;
    else if (shown === firstMomAt) isMom = true;
    else isMom = Math.random() < LEVELS[lvl].momChance;

    if (!isMom) return makeProfile(pull('normal'));
    if (lvl === 0) trapType = 'direct';
    else if (lvl === 1) trapType = Math.random() < .16 ? 'direct' : 'background';
    else if (lvl === 2) trapType = random(['background','background','frame','mirror']);
    else trapType = random(['background','frame','mirror','name','name','name','bio']);

    if (trapType === 'name' || trapType === 'bio') {
      const base = makeProfile(pull('normal'));
      if (trapType === 'name') base.name = random(MOM_NAMES);
      else base.bio = random(MOM_BIOS);
      return { ...base, isMom: true, trapType, reason: trapType === 'name' ? '名字裡就寫著 MOM！' : '自我介紹裡藏著 MOM！' };
    }
    const art = pull(trapType);
    if (trapType === 'direct') return {
      image: `./assets/profiles/${art.file}`, name: 'MOM', age: 56,
      bio: '寶貝，媽媽看見你囉。', city: '就在你家附近',
      isMom: true, trapType, spot: art.spot, reason: art.reason
    };
    return { ...makeProfile(art), isMom: true, trapType, spot: art.spot, reason: art.reason };
  }

  function showScreen(name) {
    for (const [key, element] of Object.entries(SCREENS)) element.classList.toggle('hidden', key !== name);
    window.scrollTo(0, 0);
  }
  function syncHUD() {
    ui.score.textContent = score;
    ui.best.textContent = best;
    const lvl = level();
    ui.stagePill.textContent = `LEVEL ${lvl + 1}`;
    ui.stageName.textContent = LEVELS[lvl].title;
    ui.combo.textContent = combo >= 3 ? `🔥 ${combo} COMBO` : '';
  }
  function setCard(person) {
    current = person;
    ui.profileImage.src = person.image;
    ui.profileImage.alt = `${person.name} 的虛構交友人物插畫`;
    ui.profileName.replaceChildren(document.createTextNode(person.name + ' '));
    const age = document.createElement('span');
    age.textContent = person.age;
    ui.profileName.appendChild(age);
    ui.profileBio.textContent = person.bio;
    ui.profileCity.textContent = person.city;
    ui.card.setAttribute('aria-label', `${person.name}，${person.age} 歲，${person.bio}；左滑略過，右滑喜歡`);
    clearDrag();
  }
  function clearDrag() {
    ui.card.classList.remove('dragging','animating');
    ui.card.style.transform = '';
    ui.card.style.opacity = '1';
    ui.likeStamp.style.opacity = '0';
    ui.nopeStamp.style.opacity = '0';
    dragging = null;
  }
  function startGame() {
    if (pendingTransition) { clearTimeout(pendingTransition); pendingTransition = null; }
    if (frame) cancelAnimationFrame(frame);
    Object.keys(bags).forEach(key => delete bags[key]);
    score = 0; avoided = 0; skipped = 0; combo = 0; shown = 0;
    firstMomAt = 3 + Math.floor(Math.random() * 3);
    active = true; ended = false; locked = false; momPending = false;
    ui.share.textContent = '分享我的戰績 ↗';
    ui.timer.classList.remove('danger');
    startAt = performance.now();
    endAt = startAt + DURATION;
    ui.timer.textContent = '30.0';
    ui.timerFill.style.width = '100%';
    syncHUD();
    showScreen('game');
    setCard(nextProfile());
    frame = requestAnimationFrame(tick);
  }
  function tick(now) {
    if (!active || ended) return;
    const ms = Math.max(0, endAt - now);
    ui.timer.textContent = (ms / 1000).toFixed(1);
    ui.timerFill.style.width = (ms / DURATION * 100).toFixed(2) + '%';
    if (ms <= 5000) ui.timer.classList.add('danger');
    if (ms <= 0) { if (!momPending) endGame(false); return; }
    frame = requestAnimationFrame(tick);
  }
  function swipe(which) {
    if (!active || locked || ended) return;
    if (performance.now() >= endAt) { endGame(false); return; }
    locked = true;
    const person = current;
    if (which === 'like' && person.isMom) {
      momPending = true;
      ui.likeStamp.style.opacity = '1';
      ui.card.classList.add('animating');
      ui.card.style.transform = 'translate3d(120%, -6px, 0) rotate(21deg)';
      pendingTransition = setTimeout(() => {
        pendingTransition = null;
        endGame(true, person);
      }, 240);
      return;
    }
    if (which === 'like') { score++; combo++; }
    else if (person.isMom) { avoided++; combo++; }
    else { skipped++; combo = 0; }
    if (navigator.vibrate) navigator.vibrate(which === 'like' ? 12 : 7);
    const direction = which === 'like' ? 1 : -1;
    ui.card.classList.add('animating');
    ui.card.classList.remove('dragging');
    ui.card.style.transform = `translate3d(${direction * 135}%, -10px, 0) rotate(${direction * 23}deg)`;
    ui.card.style.opacity = '0';
    ui.likeStamp.style.opacity = direction === 1 ? '1' : '0';
    ui.nopeStamp.style.opacity = direction === -1 ? '1' : '0';
    syncHUD();
    pendingTransition = setTimeout(() => {
      pendingTransition = null;
      if (!active) return;
      setCard(nextProfile());
      locked = false;
    }, 225);
  }
  function endGame(likedMom, culprit = null) {
    if (!active || ended) return;
    ended = true; active = false; locked = true;
    if (frame) cancelAnimationFrame(frame);
    if (pendingTransition) { clearTimeout(pendingTransition); pendingTransition = null; }
    const elapsed = Math.min(DURATION, performance.now() - startAt);
    const survived = !likedMom;
    const isNewRecord = survived && score > best;
    if (isNewRecord) { best = score; saveBest(best); }
    ui.resultEmoji.textContent = likedMom ? '💔' : '🏆';
    ui.resultEyebrow.textContent = likedMom ? 'MOM ALERT · GAME OVER' : 'MISSION COMPLETED';
    ui.resultTitle.innerHTML = likedMom ? 'YOU LIKED<br>YOUR MOM.' : 'YOU SURVIVED<br>YOUR MOM.';
    ui.resultSubtitle.textContent = likedMom ? "BRO. THAT'S YOUR MOM." : '30 秒內，你成功避開所有媽媽。';
    ui.finalScore.textContent = score;
    ui.finalTime.textContent = (elapsed / 1000).toFixed(1) + 's';
    ui.finalAvoided.textContent = avoided;
    ui.recordMessage.classList.toggle('hidden', !isNewRecord);
    ui.evidencePanel.classList.toggle('hidden', !likedMom);
    lastOutcome = { likedMom, score, avoided, elapsed };
    if (likedMom && culprit) {
      ui.evidenceImage.src = culprit.image;
      ui.evidenceImage.alt = `${culprit.name}，剛剛沒發現的媽媽陷阱`;
      ui.evidenceReason.textContent = '↳ ' + culprit.reason;
      ui.evidenceIdentity.replaceChildren();
      const lead = document.createTextNode(`${culprit.name}，${culprit.age} 歲`);
      const label = document.createElement('span');
      ui.evidenceIdentity.appendChild(lead);
      if (culprit.trapType === 'name' || culprit.trapType === 'bio') {
        const marked = document.createElement('mark');
        marked.textContent = culprit.trapType === 'name' ? ' ← 名字有 MOM！' : '自介：「' + culprit.bio + '」';
        ui.evidenceIdentity.appendChild(document.createTextNode(' '));
        ui.evidenceIdentity.appendChild(marked);
      }
      ui.evidenceSpot.className = 'evidence-spot hidden';
      if (culprit.spot) {
        ui.evidenceSpot.classList.remove('hidden');
        ui.evidenceSpot.classList.add(culprit.trapType === 'direct' ? 'spot-direct' : 'spot-small');
        ui.evidenceSpot.style.left = culprit.spot.x + '%';
        ui.evidenceSpot.style.top = culprit.spot.y + '%';
      }
    }
    showScreen('result');
  }

  // Pointer events work with fingers, mice and digital pens.
  ui.card.addEventListener('pointerdown', event => {
    if (!active || locked || ended || (event.pointerType === 'mouse' && event.button !== 0)) return;
    dragging = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
    ui.card.setPointerCapture(event.pointerId);
    ui.card.classList.add('dragging');
    ui.card.classList.remove('animating');
  });
  ui.card.addEventListener('pointermove', event => {
    if (!dragging || event.pointerId !== dragging.pointerId || !active) return;
    const dx = event.clientX - dragging.x;
    const dy = event.clientY - dragging.y;
    ui.card.style.transform = `translate3d(${dx}px, ${Math.min(50,Math.max(-50,dy*.28))}px,0) rotate(${Math.min(18,Math.max(-18,dx*.06))}deg)`;
    ui.likeStamp.style.opacity = String(Math.max(0, Math.min(1, dx / 110)));
    ui.nopeStamp.style.opacity = String(Math.max(0, Math.min(1, -dx / 110)));
  });
  ui.card.addEventListener('pointerup', event => {
    if (!dragging || event.pointerId !== dragging.pointerId) return;
    const dx = event.clientX - dragging.x;
    dragging = null;
    try { ui.card.releasePointerCapture(event.pointerId); } catch { /* no-op */ }
    ui.card.classList.remove('dragging');
    if (dx > 68) swipe('like');
    else if (dx < -68) swipe('nope');
    else {
      ui.card.classList.add('animating');
      ui.card.style.transform = '';
      ui.likeStamp.style.opacity = '0';
      ui.nopeStamp.style.opacity = '0';
      setTimeout(() => { if (active && !locked) ui.card.classList.remove('animating'); }, 240);
    }
  });
  ui.card.addEventListener('pointercancel', () => {
    if (!active || locked) return;
    clearDrag();
  });

  ui.nope.addEventListener('click', () => swipe('nope'));
  ui.like.addEventListener('click', () => swipe('like'));
  ui.start.addEventListener('click', startGame);
  ui.retry.addEventListener('click', startGame);
  document.addEventListener('keydown', e => {
    if (!active || e.repeat) return;
    if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') { e.preventDefault(); swipe('nope'); }
    if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') { e.preventDefault(); swipe('like'); }
  });
  document.addEventListener('visibilitychange', () => {
    if (active && !document.hidden && performance.now() >= endAt) endGame(false);
  });
  ui.share.addEventListener('click', async () => {
    if (!lastOutcome) return;
    const message = lastOutcome.likedMom
      ? `💔 DON'T LIKE YOUR MOM！我在 ${lastOutcome.elapsed / 1000 < 30 ? (lastOutcome.elapsed / 1000).toFixed(1) : '30.0'} 秒內 LIKE 了 ${lastOutcome.score} 個人，結果把媽媽滑成喜歡了！你敢挑戰嗎？`
      : `🏆 DON'T LIKE YOUR MOM！我在 30 秒內成功 LIKE ${lastOutcome.score} 個人，避開了 ${lastOutcome.avoided} 次媽媽！你能破我的紀錄嗎？`;
    const text = message + '\n' + window.location.href.split('#')[0];
    if (navigator.share) {
      try { await navigator.share({ title: "DON'T LIKE YOUR MOM", text }); return; }
      catch (err) { if (err && err.name === 'AbortError') return; }
    }
    let copied = false;
    try { await navigator.clipboard.writeText(text); copied = true; }
    catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed'; textarea.style.top = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      try { copied = document.execCommand('copy'); } catch { /* fallback */ }
      textarea.remove();
    }
    if (copied) {
      ui.share.textContent = '✓ 戰績已複製';
      setTimeout(() => { ui.share.textContent = '分享我的戰績 ↗'; }, 1800);
    } else ui.share.textContent = '無法複製，請手動分享網址';
  });
  ui.best.textContent = best;
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }
})();
