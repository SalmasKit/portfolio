const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
let lang = (() => { try { return localStorage.getItem('portfolio_lang') || 'en' } catch (e) { return 'en' } })(), filter = 'all';
const T = k => { const v = translations[lang] && translations[lang][k]; return v || (k in FB ? FB[k] : k) };

let cf = 'all';

const SOL = {
    targetalent: ['proj_targetalent_sol'],
    cdg: ['proj_cdg_capital_sol'],
    sanad: ['proj_miathon_sol'],
    afriqai: ['proj_afriqai_sol'],
    chatbot: ['proj_chatbot_sol'],
    jira: ['proj1_sol', 'proj_jira_sol'],
    stockify: ['stockify_sol'],
    soukify: ['proj3_sol'],
    quiz: ['proj_quiz_sol'],
    vision: ['proj4_sol', 'proj_vision_sol'],
    querypix: ['proj5_sol', 'proj_querypix_sol'],
    amee: ['proj_amee_sol'],
    shifaa: ['proj6_sol', 'proj_shifaa_sol'],
    bayt: ['proj7_sol', 'proj_bayt_sol']
};

const CAT_ICON = { web: 'fa-globe', ai: 'fa-brain', mobile: 'fa-mobile-screen', desktop: 'fa-desktop' };

const PROJ_ICONS = {
    targetalent: 'fa-users-viewfinder',
    cdg: 'fa-chart-line',
    sanad: 'fa-robot',
    afriqai: 'fa-comments-dollar',
    chatbot: 'fa-headset',
    jira: 'fa-list-check',
    stockify: 'fa-boxes-stacked',
    soukify: 'fa-bag-shopping',
    quiz: 'fa-graduation-cap',
    vision: 'fa-eye',
    querypix: 'fa-image',
    amee: 'fa-calendar-check',
    shifaa: 'fa-hospital',
    bayt: 'fa-book-bookmark'
};

const getSol = id => {
    const keys = SOL[id] || [];
    for (const k of keys) {
        const s = T(k);
        if (s && s !== k) return s;
    }
    return '';
};

function renderProjects() {
    const L = PROJECTS.filter(p => filter === 'all' || p[1] === filter);
    const grid = $('#grid');
    if (!grid) return;
    grid.className = 'stack pgrid-stack';
    grid.innerHTML = L.map(p => {
        const id = p[0];
        const cat = p[1];
        const icon = PROJ_ICONS[id] || CAT_ICON[cat] || 'fa-code';
        return `<div class="sk" data-open="${id}">
            <div class="ic"><i class="fas ${icon}"></i></div>
            <h4>${T(p[3][0])}</h4>
            <div class="pills">
                ${p[4].map(t => `<span>${t}</span>`).join('')}
            </div>
        </div>`;
    }).join('');
    enhance('#grid .sk');
}

function renderCerts() {
    $('#certList').innerHTML = CERTS.filter(c => cf === 'all' || c[6] === cf).map(c => `<a class="cert" href="#" data-pdf="${encodeURI('assets/docs/Certifs/' + c[3])}" data-t="${c[0]}"><i class="${c[4]}"></i><span><b>${T(c[0])}</b><small>${c[1]} · ${c[2]}</small><em>${T(c[0].replace('_title', '_desc'))}</em><small class="id">ID: ${c[5]}</small></span></a>`).join('');
}
function renderStatic() {
    $('#stack').innerHTML = STACK.map(s => `<div class="row"><h4>${T(s[0])}</h4><div class="pills">${s[1].map(i => `<span>${i[0] === '@' ? T(i.slice(1)) : i}</span>`).join('')}</div></div>`).join('');
    renderCerts();
}
/* modal */
function openModal(h) { $('#mbody').innerHTML = h; $('#modal').classList.add('open'); document.body.style.overflow = 'hidden'; $('.sheet').scrollTop = 0 }
function closeModal() { $('#modal').classList.remove('open'); $('#mbody').innerHTML = ''; document.body.style.overflow = '' }
function openProject(id) {
    const p = PROJECTS.find(x => x[0] === id);
    if (!p) return;
    const d = DET[id] || {}, t = translations[lang] || {}, g = k => t[d.k + k] || (FB && FB[d.k + k]);
    const vision = g('_vision'), feats = g('_features'), bi = g('_blueprint_intro'), bit = g('_blueprint_items');
    const sol = getSol(id);
    const isMobile = p[1] === 'mobile';

    let media;
    if (d.v) {
        const videoContent = `<video src="${A}${d.v}" controls autoplay loop muted playsinline></video>`;
        media = isMobile ? `<div class="mobile-frame">${videoContent}</div>` : `<div class="dmedia-video-wrap">${videoContent}</div>`;
    } else if (d.i && d.i.length) {
        media = `<div class="strip">${d.i.map(f => `<img src="${A}${d.b}/${f}" alt="" loading="lazy">`).join('')}</div>`;
    } else if (p[2]) {
        media = `<img src="${p[2]}" alt="${T(p[3][0])}">`;
    } else {
        media = `<div class="dmedia-placeholder"><i class="fas ${PROJ_ICONS[id] || 'fa-laptop-code'}"></i><span>${T('proj_coming_soon')}</span></div>`;
    }

    const item = x => `<div class="feat"><b>${x.title}</b><span>${x.text}</span></div>`;
    openModal(`<div class="detail"><div class="dmedia">${media}</div><div class="dtext">
   <h2>${T(p[3][0])}</h2><div class="tags">${p[4].map(x => `<span>${x}</span>`).join('')}</div>
   <div class="cs-block">
     <p class="dp"><b>${T('proj_challenge')}</b> ${T(p[3][1])}</p>
     ${sol ? `<p class="dp"><b>${T('proj_solution')}</b> ${sol}</p>` : ''}
   </div>
   ${vision ? `<h3 class="sub">${T('proj_vision_title')}</h3><p class="dp">${vision}</p>` : ''}
   ${feats && Array.isArray(feats) ? `<h3 class="sub">${T('proj_features_title')}</h3>${feats.map(item).join('')}` : ''}
   ${bit && Array.isArray(bit) ? `<h3 class="sub">${T('proj_blueprint_title')}</h3>${bi ? `<p class="dp">${bi}</p>` : ''}${bit.map(item).join('')}` : ''}
   ${p[5] ? `<a class="btn" href="${p[5]}" target="_blank" rel="noopener"><i class="fab fa-${gh(p[5])}"></i> ${T('proj_source')}</a>` : ''}
  </div></div>`);
}
function gallery(type) {
    const E = "assets/images/Events/", img = u => `<img src="${u}" alt="" loading="lazy">`;
    const G = {
        n8n: ['gallery_n8n_title', 'gallery_n8n_desc', ['assets/images/workflows/Workflow1.png', 'assets/images/workflows/workflow2.png'].map(img).join('')],
        events: ['gallery_events_title', 'gallery_events_desc', `<div class="g2">${["MIATHON'03.png", "SEMIA'04.jpg", "SEMIA'03.jpg", "TechConnect2.png", "TechConnect.png", "AtelierIdeation.jpg", "JourneeInformatique(e4).png"].map(f => img(E + f)).join('')}</div>`],
        cert: ['gallery_cert_title', 'gallery_cert_desc', ['mdso.pdf', 'mdso2.pdf'].map(f => `<iframe src="assets/docs/Certifs/${f}" title="${f}"></iframe>`).join('')]
    }[type];
    openModal(`<div class="gal"><h2>${T(G[0])}</h2><p>${T(G[1])}</p>${G[2]}</div>`);
}
function pdf(url, tk) { openModal(`<div class="gal"><h2>${T(tk)}</h2><iframe src="${url}" title="PDF"></iframe><div><a class="btn p" href="${url}" download><i class="fas fa-download"></i> ${T('resume_download')}</a></div></div>`) }
function openResumeModal() {
    const enFile = 'assets/docs/Resumes/Resume_SalmaBARRAK_FullStack.pdf';
    const frFile = 'assets/docs/Resumes/CV_SalmaBARRAK_FullStack.pdf';
    openModal(`<div class="resume-pick">
        <h2 class="resume-pick-title"><i class="fas fa-file-pdf"></i> ${T('resume_pick_title') || 'Choose a Version'}</h2>
        <p class="resume-pick-sub">${T('resume_pick_sub') || 'Select the language version you\'d like to view.'}</p>
        <div class="resume-pick-cards">
            <button class="resume-lang-card" data-resume="${enFile}">
                <span class="rlc-flag">EN</span>
                <span class="rlc-lang">${T('resume_pick_en') || 'English'}</span>
                <span class="rlc-label">${T('resume_pick_en_label') || 'Resume'}</span>
                <span class="rlc-filename">Resume_SalmaBARRAK_FullStack.pdf</span>
            </button>
            <button class="resume-lang-card" data-resume="${frFile}">
                <span class="rlc-flag">FR</span>
                <span class="rlc-lang">${T('resume_pick_fr') || 'Fran\u00e7ais'}</span>
                <span class="rlc-label">${T('resume_pick_fr_label') || 'Curriculum Vitae'}</span>
                <span class="rlc-filename">CV_SalmaBARRAK_FullStack.pdf</span>
            </button>
        </div>
    </div>`);
}
document.addEventListener('click', e => {
    if (e.target.id === 'modal' || e.target.closest('.x')) return closeModal();
    if (e.target.closest('.card a, .pcard a, .btn-pcard-src')) return;
    const g = e.target.closest('[data-g]'), f = e.target.closest('[data-pdf]'), o = e.target.closest('[data-open]'), r = e.target.closest('[data-resume]');
    if (g) { e.preventDefault(); gallery(g.dataset.g) }
    else if (f) { e.preventDefault(); pdf(f.dataset.pdf, f.dataset.t) }
    else if (o) { e.preventDefault(); openProject(o.dataset.open) }
    else if (r) { e.preventDefault(); closeModal(); setTimeout(() => pdf(r.dataset.resume, 'resume_title'), 180); }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal() });
$('#cfilters').addEventListener('click', e => {
    const b = e.target.closest('.chip'); if (!b) return;
    $$('#cfilters .chip').forEach(c => c.classList.toggle('on', c === b)); cf = b.dataset.cf; renderCerts()
});
function applyLang(l) {
    lang = l; try { localStorage.setItem('portfolio_lang', l) } catch (e) { }
    document.documentElement.lang = l;
    $$('[data-i18n]').forEach(el => {
        const v = (translations[l] || {})[el.dataset.i18n] || FB[el.dataset.i18n]; if (!v) return;
        ('placeholder' in el && el.tagName !== 'BUTTON') ? el.placeholder = v : el.innerHTML = v
    });
    $$('[data-lang]').forEach(b => b.classList.toggle('on', b.dataset.lang === l));
    $('#resume').href = (translations[l] || {}).resume_file || $('#resume').href;
    renderStatic(); renderProjects(); if (typeof renderFeatured === 'function') renderFeatured(); revealAll();
    
    // Update terminal intro text
    const introLine = document.querySelector('.cli-line.intro');
    if (introLine) {
        introLine.textContent = translations[l].cli_intro;
    }
}
/* typed role line */
const roles = () => lang === 'fr' ? ['Développeuse full-stack', 'Passionnée par l\'IA', 'Étudiante à l\'ENSA Oujda'] : ['Full-stack developer', 'AI enthusiast', 'Software engineering student @ ENSA Oujda'];
/* card tilt (pointer devices only) */
function tilt() {
    if (!matchMedia('(hover:hover)').matches) return;
    $$('.card').forEach(c => {
        c.onmousemove = e => {
            const b = c.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5;
            c.style.transform = `perspective(800px) rotateX(${-y * 5}deg) rotateY(${x * 6}deg) translateY(-4px)`
        };
        c.onmouseleave = () => c.style.transform = ''
    })
}
/* scroll reveal + progress + nav highlight */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: .12 });
function revealAll() { $$('.rv:not(.in)').forEach(el => io.observe(el)) }
addEventListener('scroll', () => {
    const h = document.documentElement;
    $('#progress').style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%'
}, { passive: true });
const spy = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) $$('.links a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id)) }), { rootMargin: '-45% 0px -50% 0px' });
$$('main section').forEach(s => spy.observe(s));
/* controls */
$('#filters').addEventListener('click', e => {
    const b = e.target.closest('.chip'); if (!b) return;
    $$('.chip').forEach(c => c.classList.toggle('on', c === b)); filter = b.dataset.f; renderProjects()
});
$$('[data-lang]').forEach(b => b.onclick = () => applyLang(b.dataset.lang));
const setTheme = l => { document.body.classList.toggle('dark', !l); $('#theme').innerHTML = `<i class="fas fa-${l ? 'moon' : 'sun'}"></i>`; try { localStorage.setItem('portfolio-theme', l ? 'light' : 'dark') } catch (e) { } };
try { setTheme(localStorage.getItem('portfolio-theme') !== 'dark') } catch (e) { setTheme(true) }
$('#theme').onclick = () => setTheme(document.body.classList.contains('dark'));
/* contact form (EmailJS) */
$('#form').addEventListener('submit', e => {
    e.preventDefault();
    const btn = $('#send'), st = $('#status'); btn.disabled = true; st.textContent = T('form_sending');
    emailjs.send('service_6g691o8', 'template_d1yl0jh', { name: $('#from_name').value, email: $('#from_email').value, message: $('#message').value, title: $('#from_name').value }, 'e5T8GntvgC38wx6su')
        .then(() => { st.textContent = T('form_success'); e.target.reset() })
        .catch(() => { st.style.color = '#ef4444'; st.textContent = lang === 'fr' ? 'Échec de l\'envoi. Réessayez ou écrivez par email.' : 'Could not send. Try again or use the email link.' })
        .finally(() => btn.disabled = false)
});
/* ===== redesign layer ===== */
const X = {
    en: {
        nav_about: 'About',
        nav_skills: 'Skills',
        h1: 'I design and build <b class=gr>reliable backends</b> and AI-powered products.',
        h_lead: 'Passionate about clean architecture and turning ideas into modern full-stack applications using Java, Python, and today’s web technologies.',
        sec_work: 'Selected work',
        sub_work: 'Everything I have built, grouped by type. Open any project for the full case study.',
        sec_more: 'More projects',
        sec_about: 'About me',
        f_study: 'Education',
        v_study: 'Engineering degree, AI option, ENSA Oujda',
        f_loc: 'Based in',
        v_loc: 'Morocco',
        f_lang: 'Languages',
        v_lang: 'Arabic, French, English',
        f_open: 'Open to',
        v_open: 'PFE internship from January 2027',
        cta_title: "Let's build <b class=gr>something together.</b>",
        view_case: 'View case study'
    },

    fr: {
        nav_about: 'À propos',
        nav_skills: 'Compétences',
        h1: 'Je conçois et développe des <b class=gr>backends fiables</b> et des produits basés sur l\'IA.',
        h_lead: 'Passionnée par les architectures propres et la transformation d’idées en applications modernes full-stack avec Java, Python et les technologies web actuelles.',
        sec_work: 'Projets sélectionnés',
        sub_work: 'Tout ce que j\'ai construit, classé par type. Ouvrez un projet pour l\'étude de cas complète.',
        sec_more: 'Autres projets',
        sec_about: 'À propos de moi',
        f_study: 'Formation',
        v_study: 'Ingénieur, option IA, ENSA Oujda',
        f_loc: 'Localisation',
        v_loc: 'Maroc',
        f_lang: 'Langues',
        v_lang: 'Arabe, français, anglais',
        f_open: 'Disponible pour',
        v_open: 'Stage PFE dès janvier 2027',
        cta_title: 'Construisons <b class=gr>quelque chose ensemble.</b>',
        view_case: 'Voir l\'étude de cas'
    }
};
for (const l in X) Object.assign(translations[l] = translations[l] || {}, X[l]);
Object.assign(FB, X.en);
const X2 = { en: { sub_tech: 'The languages, frameworks and tools I use to build and ship software.', sub_certs: 'Verified courses and credentials, each with its PDF certificate.' }, fr: { sub_tech: 'Les langages, frameworks et outils que j\'utilise pour concevoir et livrer des logiciels.', sub_certs: 'Formations et certifications validées, avec leur certificat PDF.' } };
for (const l in X2) Object.assign(translations[l], X2[l]); Object.assign(FB, X2.en);
const FEAT = [['cdg', 'proj_cdg_capital_sol'], ['afriqai', 'proj_afriqai_sol'], ['chatbot', 'proj_chatbot_sol'], ['sanad', 'proj_miathon_sol']];
const ICONS = ['fa-code', 'fa-layer-group', 'fa-database', 'fa-brain', 'fa-server', 'fa-screwdriver-wrench', 'fa-diagram-project', 'fa-users', 'fa-language'];
const gh = u => u.includes('gitlab') ? 'gitlab' : 'github';
function enhance(sel) { $$(sel).forEach((el, i) => { el.classList.add('rv'); el.style.setProperty('--d', (i % 3) * .08 + 's') }); revealAll() }

let counted = false;
function renderMetrics() { $('#metrics').innerHTML = ['stat_projects', 'stat_techs', 'stat_certs', 'stat_intern'].map(k => { const t = T(k), m = t.match(/^(\d+)(\+?)\s*(.*)$/) || [, '', '', t]; return `<div class="mt"><b data-n="${m[1]}" data-s="${m[2] || ''}">${m[1]}${m[2] || ''}</b><span>${m[3]}</span></div>` }).join('') }
function countMetrics() { $$('#metrics b').forEach(b => { const n = +b.dataset.n; if (!n) return; let st = null; const step = ts => { st = st || ts; const k = Math.min((ts - st) / 1400, 1); b.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))) + b.dataset.s; if (k < 1) requestAnimationFrame(step) }; requestAnimationFrame(step) }) }
new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting && !counted) { counted = true; countMetrics(); o.disconnect() } }), { threshold: .6 }).observe($('#metrics'));
renderStatic = function () {
    $('#stack').innerHTML = STACK.map((s, i) => `<div class="sk"><div class="ic"><i class="fas ${ICONS[i]}"></i></div><h4>${T(s[0])}</h4><div class="pills">${s[1].map(x => `<span>${x[0] === '@' ? T(x.slice(1)) : x}</span>`).join('')}</div></div>`).join('');
    renderCerts(); renderMetrics(); renderFeatured();
    $('#stack').classList.remove('rv'); enhance('#stack .sk'); enhance('#certList .cert'); enhance('#feat .fp'); if (window.updCap) updCap()
};
/* ===== category sections ===== */
Object.assign(FB, { revolving_text: 'BUILD • AUTOMATE • LEARN • DEPLOY • SOLVE • INNOVATE • BUILD • AUTOMATE • LEARN •', filter_web: 'Web Apps', filter_ai: 'AI & ML', filter_mobile: 'Mobile', filter_desktop: 'Desktop' });

/* scroll effects: nav shadow, back-to-top, hero parallax, timeline progress */
{
    let busy = false; const nav = $('nav'), tp = $('#top'), mk = $('#mock');
    const on = () => {
        busy = false; const h = innerHeight, y = scrollY; nav.classList.toggle('scrolled', y > 10); tp.classList.toggle('show', y > 700); document.body.classList.toggle('has-back-to-top', y > 700); if (y < h) mk.style.translate = `0 ${-y * .07}px`;
        $$('.tl').forEach(t => { const b = t.getBoundingClientRect(); t.style.setProperty('--fill', Math.max(0, Math.min(1, (h * .65 - b.top) / b.height))) })
    };
    addEventListener('scroll', () => { if (!busy) { busy = true; requestAnimationFrame(on) } }, { passive: true }); on(); tp.onclick = () => scrollTo({ top: 0, behavior: 'smooth' })
}
{ const tio = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('on', e.isIntersecting)), { rootMargin: '-30% 0px -30% 0px' }); $$('.tl article').forEach(a => tio.observe(a)) }
/* ===== work-first: stacked case studies + hover-preview index ===== */
Object.assign(translations.en, { sec_all: 'All projects', sub_work: 'Six case studies with the real product running. Scroll to explore, or open one for the full story.' });
Object.assign(translations.fr, { sec_all: 'Tous les projets', sub_work: 'Six études de cas avec le produit en fonctionnement. Faites défiler pour explorer, ou ouvrez-en une.' });
Object.assign(FB, { sec_all: 'All projects', sub_work: 'Six case studies with the real product running. Scroll to explore, or open one for the full story.', stockify_sol: 'Symfony 7 and Doctrine power a sub-second analytics pipeline.', proj3_sol: 'Android SDK and Firebase, structured with the MVVM pattern.' });
Object.assign(translations.en, { sec_journey: 'My journey', sub_journey: 'Where I have worked, studied and given back.' });
Object.assign(translations.fr, { sec_journey: 'Mon parcours', sub_journey: 'Là où j\'ai travaillé, étudié et contribué.' });
Object.assign(FB, { sec_journey: 'My journey', sub_journey: 'Where I have worked, studied and given back.' });
const still = matchMedia('(prefers-reduced-motion:reduce)').matches;
const vio = new IntersectionObserver(es => es.forEach(e => { const v = e.target; if (e.isIntersecting) { if (!v.src) v.src = v.dataset.src; v.play().catch(() => { }) } else v.pause() }), { threshold: .35 });
renderFeatured = function () {
    const featured = PROJECTS.slice(0, 6);
    $('#stk').innerHTML = featured.map((p, i) => {
        const id = p[0], d = DET[id] || {}, t = T(p[3][0]), sk = getSol(id);
        const media = d.v && !still
            ? `<video muted loop playsinline preload="none" poster="${p[2] || ''}" data-src="${A}${d.v}"></video>`
            : (p[2]
                ? `<img src="${p[2]}" alt="${t}" loading="lazy">`
                : `<div class="dmedia-placeholder"><i class="fas ${PROJ_ICONS[id] || 'fa-laptop-code'}"></i><span>${t}</span></div>`);
        return `<article class="stk" style="--i:${i}">
    <div class="stk-media" data-open="${id}"><div class="bar"><i></i><i></i><i></i><span>${t}</span></div><div class="shot">${media}</div></div>
    <div class="stk-info"><div class="meta"><span class="num">0${i + 1}</span><span class="cat">${T('filter_' + p[1])}</span></div><h3>${t}</h3>
     <p><b>${T('proj_challenge')}</b> ${T(p[3][1])}</p><p><b>${T('proj_solution')}</b> ${sk}</p>
     <div class="tags">${p[4].map(x => `<span>${x}</span>`).join('')}</div>
     <div class="fbtns"><button class="btn p" data-open="${id}">${T('view_case')}</button>${p[5] ? `<a class="src" href="${p[5]}" target="_blank" rel="noopener"><i class="fab fa-${gh(p[5])}"></i> ${T('proj_source')}</a>` : ''}</div></div></article>`;
    }).join('');
    $$('#stk video').forEach(v => vio.observe(v));
};

/* stack depth effect + parallax inside the frames */
{
    let b = false; const fx = () => {
        b = false; if (matchMedia('(max-width:900px)').matches) return; const c = $$('.stk');
        c.forEach((el, i) => {
            const r = el.getBoundingClientRect(), n = c[i + 1]; el.style.setProperty('--py', Math.max(-36, Math.min(36, (r.top + r.height / 2 - innerHeight / 2) * -.05)) + 'px');
            if (n) { const d = n.getBoundingClientRect().top - (parseFloat(getComputedStyle(el).top) || 0) - 24, p = Math.max(0, Math.min(1, 1 - d / (innerHeight * .5))); el.style.scale = 1 - p * .055; el.style.filter = `brightness(${1 - p * .12})` }
        })
    };
    addEventListener('scroll', () => { if (!b) { b = true; requestAnimationFrame(fx) } }, { passive: true }); addEventListener('resize', fx)
}

/* ===== Terminal/CLI Functionality ===== */
function initTerminal() {
    const cliInput = document.getElementById('cli-input');
    const cliOutput = document.getElementById('cli-output');
    const cliOverlay = document.getElementById('cli-overlay');
    const cliFab = document.getElementById('cli-fab');

    if (!cliInput || !cliOutput || !cliOverlay || !cliFab) return;

    // Set initial intro text
    const introLine = document.querySelector('.cli-line.intro');
    if (introLine) {
        introLine.textContent = translations[document.documentElement.lang || 'en'].cli_intro;
    }

    let currentSnakeGame = null;

    function toggleCLI(clearContent = false) {
        const isVisible = cliOverlay.classList.contains('active');
        cliOverlay.classList.toggle('active');
        
        if (!isVisible) {
            cliInput.focus();
            document.body.style.overflow = 'hidden';
        } else {
            if (currentSnakeGame) currentSnakeGame.stop(false);
            document.body.style.overflow = '';
            if (clearContent) {
                cliOutput.innerHTML = '';
                cliInput.value = '';
            }
        }
    }

    function toggleMaximize() {
        const modal = document.querySelector('.cli-modal');
        if (!modal) return;
        modal.classList.toggle('maximized');
    }

    cliFab.addEventListener('click', () => toggleCLI(false));

    // Attach to Windows-style buttons
    const winBtns = document.querySelectorAll('.win-btn');
    winBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            if (action === 'minimize') toggleCLI(false);
            else if (action === 'maximize') toggleMaximize();
            else if (action === 'close') toggleCLI(true);
        });
    });

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function renderBarcaCard(lang) {
        const c = translations[lang] || translations.en;
        const note = c.cli_barca_note || "Salma's all-time favorite club! Força Barça! 💙❤️";
        return `
<div class="cli-barca-card">
  <div class="cli-barca-media">
    <img src="assets/images/barca.jpg" alt="FC Barcelona" class="cli-barca-img" loading="eager">
  </div>
  <div class="cli-barca-title">FC BARCELONA</div>
  <div class="cli-barca-tagline">« MÉS QUE UN CLUB »</div>
  <div class="cli-barca-stats">
    🏆 <b>5×</b> Champions League &nbsp;•&nbsp; 🏆 <b>29×</b> La Liga &nbsp;•&nbsp; 🏆 <b>32×</b> Copa del Rey &nbsp;•&nbsp; 🏆 <b>3×</b> Club World Cup
  </div>
  <div class="cli-barca-quote">
    ⚽ <i>"Tot el camp, és un clam, som la gent blaugrana, tant se val d'on venim, si del sud o del nord, ara estem d'acord, estem d'acord, una bandera ens agermana!"</i>
  </div>
  <div class="cli-barca-badge-footer">
    💙❤️ <b>${note}</b>
  </div>
</div>`;
    }

    const commands = {
        help: () => {
            const lang = document.documentElement.lang || 'en';
            const c = translations[lang] || translations.en;
            return `${c.cli_help_title}<br><br>` +
                `  <span class="cli-cmd">whoami</span>        ${c.cli_help_whoami}<br>` +
                `  <span class="cli-cmd">status</span>        ${c.cli_help_status}<br>` +
                `  <span class="cli-cmd">skills</span>        ${c.cli_help_skills}<br>` +
                `  <span class="cli-cmd">projects</span>      ${c.cli_help_projects}<br>` +
                `  <span class="cli-cmd">ls</span>            ${c.cli_help_ls}<br>` +
                `  <span class="cli-cmd">contact</span>       ${c.cli_help_contact}<br>` +
                `  <span class="cli-cmd">clear</span>         ${c.cli_help_clear}<br>` +
                `  <span class="cli-cmd">exit</span>          ${c.cli_help_exit}<br><br>` +
                `<b>${c.cli_help_fun_title || 'Interactive Commands:'}</b><br><br>` +
                `  <span class="cli-cmd">fav &lt;club&gt;</span>       ${c.cli_help_fav || 'Best football club'}<br>` +
                `  <span class="cli-cmd">joke</span>             ${c.cli_help_joke || 'Tell a developer joke'}<br>` +
                `  <span class="cli-cmd">hack</span>             ${c.cli_help_hack || 'Hollywood hacking simulator'}<br>` +
                `  <span class="cli-cmd">neofetch</span>         ${c.cli_help_neofetch || 'Developer system specs'}<br>` +
                `  <span class="cli-cmd">coffee</span>           ${c.cli_help_coffee || 'Order fresh coffee'}<br>` +
                `  <span class="cli-cmd">weather</span>          ${c.cli_help_weather || 'Dev environment forecast'}<br>` +
                `  <span class="cli-cmd">sudo</span>             ${c.cli_help_sudo || 'Admin privilege attempt'}<br>` +
                `  <span class="cli-cmd">ping</span>             ${c.cli_help_ping || 'Ping the portfolio server'}<br>` +
                `  <span class="cli-cmd">snake</span>            ${c.cli_help_snake || 'Play retro Snake game 🐍'}`;
        },
        whoami: () => translations[document.documentElement.lang || 'en'].cli_whoami,
        status: () => translations[document.documentElement.lang || 'en'].cli_status,
        skills: () => translations[document.documentElement.lang || 'en'].cli_skills,
        projects: () => {
            const lang = document.documentElement.lang || 'en';
            const c = translations[lang] || translations.en;
            
            const projects = [
                { key: 'proj_targetalent_title' },
                { key: 'proj1_title' },
                { key: 'proj_chatbot_title' },
                { key: 'stockify_title' },
                { key: 'proj_soukify_title' },
                { key: 'proj_quiz_title' },
                { key: 'proj4_title' },
                { key: 'proj_miathon_title' },
                { key: 'proj_cdg_capital_title' }
            ];
            
            return `Notable work:<br><br>` +
                projects.map(p => `  • ${c[p.key] || p.key}`).join('<br>');
        },
        ls: (arg) => {
            const lang = document.documentElement.lang || 'en';
            const c = translations[lang] || translations.en;
            
            const aliases = {
                'cdg': 'cdg_capital',
                'financial': 'cdg_capital',
                'terminal': 'cdg_capital',
                'sanad': 'miathon',
                'robot': 'miathon',
                'jira': 'jira',
                'chatbot': 'chatbot',
                'mso': 'chatbot',
                'stockify': 'stockify',
                'soukify': 'soukify',
                'quiz': 'quiz',
                'vision': 'vision',
                'querypix': 'querypix',
                'amee': 'amee',
                'shifaa': 'shifaa',
                'bayt': 'bayt',
                'targetalent': 'targetalent',
                'target': 'targetalent',
                'portfolio': 'portfolio'
            };
            
            if (!arg) {
                const projects = [
                    { alias: 'targetalent', key: 'proj_targetalent_title' },
                    { alias: 'jira', key: 'proj1_title' },
                    { alias: 'chatbot', key: 'proj_chatbot_title' },
                    { alias: 'stockify', key: 'stockify_title' },
                    { alias: 'soukify', key: 'proj_soukify_title' },
                    { alias: 'quiz', key: 'proj_quiz_title' },
                    { alias: 'vision', key: 'proj4_title' },
                    { alias: 'sanad', key: 'proj_miathon_title' },
                    { alias: 'cdg', key: 'proj_cdg_capital_title' }
                ];
                
                return `${c.cli_help_title}<br><br>` +
                    `Available projects (use <span class="cli-cmd">ls &lt;alias&gt;</span>):<br><br>` +
                    projects.map(p => `  <span class="cli-cmd">${p.alias}</span>    ${c[p.key] || p.key}`).join('<br>');
            }
            
            const projectKey = `cli_ls_${aliases[arg.toLowerCase()] || arg.toLowerCase()}`;
            return c[projectKey] || c.cli_not_found.replace('{cmd}', escapeHtml(arg));
        },
        contact: () => translations[document.documentElement.lang || 'en'].cli_contact,
        clear: () => { 
            if (currentSnakeGame) currentSnakeGame.stop(false);
            cliOutput.innerHTML = ''; 
            return ''; 
        },
        exit: () => { 
            if (currentSnakeGame) currentSnakeGame.stop(false);
            toggleCLI(); 
            return translations[document.documentElement.lang || 'en'].cli_exit; 
        },
        
        // Interactive Commands
        fav: (arg) => {
            const lang = document.documentElement.lang || 'en';
            const c = translations[lang] || translations.en;
            if (!arg) return c.cli_barca_hint;
            
            const cleanArg = arg.replace(/^club\s+/, '').trim().toLowerCase();
            if (!cleanArg) return c.cli_barca_hint;
            
            if (cleanArg === 'barcelona' || cleanArg === 'barca' || cleanArg === 'barça' || cleanArg === 'fc barcelona' || cleanArg === 'fcb') {
                return renderBarcaCard(lang);
            }
            return (c.cli_barca_other || "Club not found.").replace('{club}', escapeHtml(cleanArg));
        },
        club: (arg) => {
            const lang = document.documentElement.lang || 'en';
            const c = translations[lang] || translations.en;
            if (!arg) return c.cli_barca_hint;
            
            const cleanArg = arg.trim().toLowerCase();
            if (cleanArg === 'barcelona' || cleanArg === 'barca' || cleanArg === 'barça' || cleanArg === 'fc barcelona' || cleanArg === 'fcb') {
                return renderBarcaCard(lang);
            }
            return (c.cli_barca_other || "Club not found.").replace('{club}', escapeHtml(cleanArg));
        },
        joke: () => {
            const lang = document.documentElement.lang || 'en';
            const c = translations[lang] || translations.en;
            const jokes = c.cli_jokes || [
                "Why do programmers prefer dark mode? Because light attracts bugs. 🐛",
                "There are 10 types of people: those who understand binary and those who don't. 💻"
            ];
            const randomIndex = Math.floor(Math.random() * jokes.length);
            return `😄 <b>${lang === 'fr' ? 'Blague de Développeur' : 'Developer Joke'} :</b><br>${jokes[randomIndex]}`;
        },
        hack: () => (translations[document.documentElement.lang || 'en'] || translations.en).cli_hack_msg,
        sudo: () => (translations[document.documentElement.lang || 'en'] || translations.en).cli_sudo_msg,
        coffee: () => {
            const lang = document.documentElement.lang || 'en';
            const isFr = lang === 'fr';
            const id = 'coffee-' + Math.random().toString(36).substring(2, 9);
            const brewingText = isFr ? "Infusion de l'espresso en cours..." : "Brewing fresh espresso...";
            const readyText = isFr 
                ? "☕ Votre espresso bien chaud est prêt ! (Caféine : 100% | Vitesse : +300%) Bon code ! ✨" 
                : "☕ Fresh hot espresso is served! (Caffeine: 100% | Compilation : +300%) Enjoy coding! ✨";

            setTimeout(() => {
                const widget = document.getElementById(id);
                if (!widget) return;
                const percentEl = widget.querySelector('.cli-coffee-percent');
                const msgEl = widget.querySelector('.cli-coffee-msg');
                let count = 0;
                const interval = setInterval(() => {
                    count += 5;
                    if (percentEl) percentEl.textContent = count + '%';
                    if (count >= 100) {
                        clearInterval(interval);
                        if (msgEl) {
                            msgEl.innerHTML = readyText;
                            msgEl.style.color = 'var(--accent)';
                        }
                        const cliBody = document.getElementById('cli-body');
                        if (cliBody) cliBody.scrollTop = cliBody.scrollHeight;
                    }
                }, 115);
            }, 60);

            return `
<div class="cli-coffee-widget" id="${id}">
  <div class="cli-coffee-visual">
    <div class="cli-steam-container">
      <span class="cli-steam steam-1"></span>
      <span class="cli-steam steam-2"></span>
      <span class="cli-steam steam-3"></span>
    </div>
    <div class="cli-cup-wrapper">
      <div class="cli-cup">
        <div class="cli-coffee-fill">
          <div class="cli-coffee-cream"></div>
        </div>
      </div>
      <div class="cli-cup-handle"></div>
    </div>
    <div class="cli-cup-saucer"></div>
  </div>
  <div class="cli-coffee-details">
    <div class="cli-coffee-msg">${brewingText}</div>
    <div class="cli-coffee-meter">
      <div class="cli-coffee-meter-bar"></div>
    </div>
    <div class="cli-coffee-percent">0%</div>
  </div>
</div>`;
        },
        weather: () => (translations[document.documentElement.lang || 'en'] || translations.en).cli_weather_msg,
        ping: () => (translations[document.documentElement.lang || 'en'] || translations.en).cli_ping_msg,
        neofetch: () => {
            const lang = document.documentElement.lang || 'en';
            const isFr = lang === 'fr';
            return `
<div class="cli-neofetch">
<pre class="cli-neofetch-logo">
   _____       __                 
  / ___/____ _/ /___ ___  ____ _
  \\__ \\/ __ \`/ / __ \`__ \\/ __ \`/
 ___/ / /_/ / / / / / / / /_/ / 
/____/\\__,_/_/_/ /_/ /_/\\__,_/  
</pre>
<div class="cli-neofetch-info">
  <span style="color:var(--accent); font-weight:bold;">salma@portfolio-os</span><br>
  <span>-------------------</span><br>
  <b>OS:</b> SalmaOS v2.5 (ENSA Oujda Eng. Edition) 🚀<br>
  <b>Role:</b> Software & AI Engineering Student 👩‍💻<br>
  <b>Stack:</b> Java, Spring Boot, Python, FastAPI, React<br>
  <b>Database:</b> PostgreSQL, MySQL, pgvector, SQLite<br>
  <b>Tools:</b> Docker, Git, n8n, LangGraph, Linux<br>
  <b>Fav Club:</b> <span style="color:#facc15; font-weight:bold;">FC BARCELONA</span> 🔵🔴<br>
  <b>Uptime:</b> 24/7 (Fueled by curiosity & coffee ☕)<br>
  <b>Status:</b> ${isFr ? 'À la recherche d\'un stage PFE (Janv 2027) 🎯' : 'Seeking 6-month PFE Internship (Jan 2027) 🎯'}
</div>
</div>`;
        },
        snake: () => startSnakeGame(),
        game: () => startSnakeGame()
    };

    function startSnakeGame() {
        if (currentSnakeGame) {
            currentSnakeGame.stop(false);
        }

        const lang = document.documentElement.lang || 'en';
        const isFr = lang === 'fr';
        const gameId = 'snake-' + Math.random().toString(36).substring(2, 9);
        const savedHigh = parseInt(localStorage.getItem('cli_snake_highscore') || '0', 10);

        setTimeout(() => {
            initSnakeInstance(gameId, isFr);
        }, 50);

        return `
<div class="cli-snake-wrap" id="${gameId}">
  <div class="cli-snake-header">
    <div class="cli-snake-title">🐍 DEV SNAKE RETRO</div>
    <div class="cli-snake-scores">
      <span>SCORE: <b class="cli-snake-score">0</b></span>
      <span>BEST: <b class="cli-snake-high">${savedHigh}</b></span>
    </div>
    <button class="cli-snake-btn-exit" type="button" title="Exit Game">[X] ${isFr ? 'Quitter' : 'Exit'}</button>
  </div>
  <div class="cli-snake-stage">
    <canvas id="${gameId}-canvas" width="320" height="240"></canvas>
    <div class="cli-snake-overlay hidden">
      <div class="cli-snake-gameover-title">GAME OVER</div>
      <div class="cli-snake-gameover-desc">${isFr ? 'Score final' : 'Final Score'} : <b class="cli-snake-final-score">0</b></div>
      <button class="cli-snake-btn-restart" type="button">▶ ${isFr ? 'Rejouer (Espace)' : 'Play Again (Space)'}</button>
    </div>
  </div>
  <div class="cli-snake-controls-hint">
    🎮 ${isFr ? 'Flèches / ZQSD pour diriger • Espace: Rejouer • Esc/Q: Quitter' : 'Arrow Keys / WASD to move • Space: Replay • Esc/Q: Quit'}
  </div>
  <div class="cli-snake-dpad">
    <button class="cli-dpad-btn" type="button" data-dir="up">▲</button>
    <div class="cli-snake-dpad-row">
      <button class="cli-dpad-btn" type="button" data-dir="left">◀</button>
      <button class="cli-dpad-btn" type="button" data-dir="down">▼</button>
      <button class="cli-dpad-btn" type="button" data-dir="right">▶</button>
    </div>
  </div>
</div>`;
    }

    function drawRoundRect(c, x, y, w, h, r) {
        if (typeof c.roundRect === 'function') {
            c.roundRect(x, y, w, h, r);
        } else {
            c.rect(x, y, w, h);
        }
    }

    function initSnakeInstance(gameId, isFr) {
        const wrap = document.getElementById(gameId);
        if (!wrap) return;
        const canvas = document.getElementById(gameId + '-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const scoreEl = wrap.querySelector('.cli-snake-score');
        const highEl = wrap.querySelector('.cli-snake-high');
        const overlay = wrap.querySelector('.cli-snake-overlay');
        const finalScoreEl = wrap.querySelector('.cli-snake-final-score');
        const restartBtn = wrap.querySelector('.cli-snake-btn-restart');
        const exitBtn = wrap.querySelector('.cli-snake-btn-exit');

        const cols = 20;
        const rows = 15;
        const cellSize = 16;

        let snake = [
            { x: 6, y: 7 },
            { x: 5, y: 7 },
            { x: 4, y: 7 }
        ];
        let dir = { x: 1, y: 0 };
        let nextDir = { x: 1, y: 0 };
        let food = { x: 14, y: 7 };
        let score = 0;
        let highScore = parseInt(localStorage.getItem('cli_snake_highscore') || '0', 10);
        let speed = 110;
        let timer = null;
        let isOver = false;

        function spawnFood() {
            let valid = false;
            let newFood = { x: 0, y: 0 };
            while (!valid) {
                newFood.x = Math.floor(Math.random() * cols);
                newFood.y = Math.floor(Math.random() * rows);
                valid = !snake.some(seg => seg.x === newFood.x && seg.y === newFood.y);
            }
            return newFood;
        }

        function draw() {
            ctx.fillStyle = '#080c10';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Subtle grid
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
            ctx.lineWidth = 1;
            for (let x = 0; x <= canvas.width; x += cellSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            for (let y = 0; y <= canvas.height; y += cellSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            // Food (Glowing Apple / Bug)
            const fx = food.x * cellSize + cellSize / 2;
            const fy = food.y * cellSize + cellSize / 2;
            const r = cellSize / 2 - 2;

            ctx.shadowBlur = 8;
            ctx.shadowColor = '#ef4444';
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(fx, fy, r, 0, Math.PI * 2);
            ctx.fill();

            // Leaf
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#4ade80';
            ctx.beginPath();
            ctx.arc(fx + 2, fy - r + 1, 2.5, 0, Math.PI * 2);
            ctx.fill();

            // Snake
            snake.forEach((seg, i) => {
                const sx = seg.x * cellSize;
                const sy = seg.y * cellSize;
                if (i === 0) {
                    // Head
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = '#4ade80';
                    ctx.fillStyle = '#4ade80';
                    ctx.beginPath();
                    drawRoundRect(ctx, sx + 1, sy + 1, cellSize - 2, cellSize - 2, 4);
                    ctx.fill();

                    // Eyes
                    ctx.shadowBlur = 0;
                    ctx.fillStyle = '#052e16';
                    let ex1 = sx + 4, ey1 = sy + 4, ex2 = sx + 10, ey2 = sy + 4;
                    if (dir.x === 1) { ex1 = sx + 11; ey1 = sy + 4; ex2 = sx + 11; ey2 = sy + 10; }
                    else if (dir.x === -1) { ex1 = sx + 4; ey1 = sy + 4; ex2 = sx + 4; ey2 = sy + 10; }
                    else if (dir.y === 1) { ex1 = sx + 4; ey1 = sy + 11; ex2 = sx + 10; ey2 = sy + 11; }
                    else if (dir.y === -1) { ex1 = sx + 4; ey1 = sy + 4; ex2 = sx + 10; ey2 = sy + 4; }

                    ctx.beginPath();
                    ctx.arc(ex1, ey1, 1.5, 0, Math.PI * 2);
                    ctx.arc(ex2, ey2, 1.5, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // Body
                    ctx.shadowBlur = 4;
                    ctx.shadowColor = 'rgba(34, 197, 94, 0.4)';
                    ctx.fillStyle = i % 2 === 0 ? '#22c55e' : '#16a34a';
                    ctx.beginPath();
                    drawRoundRect(ctx, sx + 2, sy + 2, cellSize - 4, cellSize - 4, 3);
                    ctx.fill();
                }
            });
            ctx.shadowBlur = 0;
        }

        function tick() {
            if (isOver) return;

            dir = nextDir;
            const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

            // Wall collision
            if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
                gameOver();
                return;
            }

            // Self collision
            if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
                gameOver();
                return;
            }

            snake.unshift(head);

            // Food collision
            if (head.x === food.x && head.y === food.y) {
                score += 10;
                scoreEl.textContent = score;
                if (score > highScore) {
                    highScore = score;
                    highEl.textContent = highScore;
                    try { localStorage.setItem('cli_snake_highscore', highScore); } catch (e) {}
                }
                food = spawnFood();
                if (speed > 60) {
                    speed = Math.max(60, speed - 2);
                    clearInterval(timer);
                    timer = setInterval(tick, speed);
                }
            } else {
                snake.pop();
            }

            draw();
        }

        function gameOver() {
            isOver = true;
            clearInterval(timer);
            finalScoreEl.textContent = score;
            overlay.classList.remove('hidden');
        }

        function reset() {
            isOver = false;
            snake = [
                { x: 6, y: 7 },
                { x: 5, y: 7 },
                { x: 4, y: 7 }
            ];
            dir = { x: 1, y: 0 };
            nextDir = { x: 1, y: 0 };
            score = 0;
            speed = 110;
            scoreEl.textContent = score;
            food = spawnFood();
            overlay.classList.add('hidden');
            clearInterval(timer);
            draw();
            timer = setInterval(tick, speed);
        }

        function onKeyDown(e) {
            const k = e.key;
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(k)) {
                e.preventDefault();
            }

            if (k === 'ArrowUp' || k === 'w' || k === 'W' || k === 'z' || k === 'Z') {
                if (dir.y === 0) nextDir = { x: 0, y: -1 };
            } else if (k === 'ArrowDown' || k === 's' || k === 'S') {
                if (dir.y === 0) nextDir = { x: 0, y: 1 };
            } else if (k === 'ArrowLeft' || k === 'a' || k === 'A') {
                if (dir.x === 0) nextDir = { x: -1, y: 0 };
            } else if (k === 'ArrowRight' || k === 'd' || k === 'D') {
                if (dir.x === 0) nextDir = { x: 1, y: 0 };
            } else if (k === ' ' && isOver) {
                reset();
            } else if (k === 'Escape' || k === 'q' || k === 'Q') {
                stopGame(true);
            }
        }

        function stopGame(appendOutput = true) {
            clearInterval(timer);
            window.removeEventListener('keydown', onKeyDown);
            currentSnakeGame = null;

            if (appendOutput) {
                const outLine = document.createElement('div');
                outLine.className = 'cli-line';
                outLine.innerHTML = `🐍 <i>${isFr ? 'Partie terminée ! Score final :' : 'Game finished! Final score:'} <b>${score}</b></i>`;
                cliOutput.appendChild(outLine);
                const cliInputEl = document.getElementById('cli-input');
                if (cliInputEl) cliInputEl.focus();
                const cliBody = document.getElementById('cli-body');
                if (cliBody) cliBody.scrollTop = cliBody.scrollHeight;
            }
        }

        window.addEventListener('keydown', onKeyDown);
        restartBtn.addEventListener('click', reset);
        exitBtn.addEventListener('click', () => stopGame(true));

        // Touch buttons
        wrap.querySelectorAll('.cli-dpad-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const d = btn.dataset.dir;
                if (d === 'up' && dir.y === 0) nextDir = { x: 0, y: -1 };
                else if (d === 'down' && dir.y === 0) nextDir = { x: 0, y: 1 };
                else if (d === 'left' && dir.x === 0) nextDir = { x: -1, y: 0 };
                else if (d === 'right' && dir.x === 0) nextDir = { x: 1, y: 0 };
            });
        });

        draw();
        timer = setInterval(tick, speed);

        currentSnakeGame = {
            stop: stopGame
        };

        const cliBody = document.getElementById('cli-body');
        if (cliBody) cliBody.scrollTop = cliBody.scrollHeight;
    }

    cliInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const rawInput = cliInput.value.trim();
            if (!rawInput) return;

            const line = document.createElement('div');
            line.className = 'cli-line user';
            line.innerHTML = `<span class="cli-prompt">PS C:\\Users\\Salma&gt;</span> ${escapeHtml(rawInput)}`;
            cliOutput.appendChild(line);

            const parts = rawInput.split(/\s+/);
            const cmd = parts[0].toLowerCase();
            const rest = parts.slice(1).join(' ').trim().toLowerCase();

            let response = "";
            const lang = document.documentElement.lang || 'en';
            const c = translations[lang] || translations.en;

            if (commands[cmd]) {
                response = commands[cmd](rest);
            } else {
                response = c.cli_not_found.replace('{cmd}', escapeHtml(cmd));
            }

            if (response) {
                const outLine = document.createElement('div');
                outLine.className = 'cli-line';
                outLine.innerHTML = response.replace(/\\n/g, '<br>');
                cliOutput.appendChild(outLine);
            }

            cliInput.value = '';
            const cliBody = document.getElementById('cli-body');
            if (cliBody) cliBody.scrollTop = cliBody.scrollHeight;
        }
    });

}

applyLang(lang);

// Initialize terminal after everything is loaded
setTimeout(initTerminal, 100);
