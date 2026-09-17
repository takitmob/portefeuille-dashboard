/* ============================================================
   Portefeuille Dashboard — application
   Zéro dépendance. Lit window.DASH_DATA (data.js), rend en SVG maisson.
   Les fonctions pures (objet DASH) sont testables en Node sans DOM.
   ============================================================ */
(function () {
  'use strict';

  /* ================= Fonctions pures (testables) ================= */
  var DASH = {};

  /* --- Assainissement --- */
  DASH.esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };
  DASH.asStr = function (v, d) { return typeof v === 'string' && v.length > 0 ? v : (d || ''); };
  DASH.asNum = function (v, d, min, max) {
    if (v == null || v === '') return d;
    var n = Number(v);
    if (!isFinite(n)) return d;
    if (typeof min === 'number') n = Math.max(n, min);
    if (typeof max === 'number') n = Math.min(n, max);
    return n;
  };
  DASH.pourcent = function (v) { return Math.round(DASH.asNum(v, 0, 0, 100)); };

  /* --- Dates --- */
  var MOIS_FR = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  DASH.dateISO = function (d) {
    return d.getUTCFullYear() + '-' +
      String(d.getUTCMonth() + 1).padStart(2, '0') + '-' +
      String(d.getUTCDate()).padStart(2, '0');
  };
  DASH.parseISO = function (iso) {
    var p = String(iso).split('-');
    return new Date(Date.UTC(+p[0], (+p[1] || 1) - 1, +p[2] || 1));
  };
  DASH.dateFr = function (iso) {
    if (!iso) return '—';
    var d = DASH.parseISO(iso);
    return d.getUTCDate() + ' ' + MOIS_FR[d.getUTCMonth()] + ' ' + d.getUTCFullYear();
  };
  DASH.dateShort = function (iso) {
    if (!iso) return '—';
    var d = DASH.parseISO(iso);
    return String(d.getUTCDate()).padStart(2, '0') + '/' + String(d.getUTCMonth() + 1).padStart(2, '0');
  };
  DASH.joursEntre = function (isoA, isoB) {
    var a = DASH.parseISO(isoA).getTime();
    var b = DASH.parseISO(isoB).getTime();
    return Math.round((b - a) / 86400000);
  };
  DASH.aujourdhui = function () { return DASH.dateISO(new Date()); };

  /* --- Agrégats --- */
  DASH.moyenneProgression = function (projets) {
    var vals = projets.filter(function (p) { return p.progression != null; })
      .map(function (p) { return DASH.pourcent(p.progression); });
    if (!vals.length) return 0;
    return Math.round(vals.reduce(function (a, b) { return a + b; }, 0) / vals.length);
  };
  DASH.compter = function (projets, champ, valeur) {
    return projets.filter(function (p) { return p[champ] === valeur; }).length;
  };
  DASH.rangPriorite = function (prio) {
    var r = { permanente: 0, haute: 1, moyenne: 2, basse: 3 };
    return r[prio] != null ? r[prio] : 9;
  };
  DASH.rangStatutEtape = function (st) { return st === 'fait' ? 0 : st === 'en cours' ? 1 : 2; };
  DASH.trierProjets = function (projets) {
    return projets.slice().sort(function (a, b) {
      var r = DASH.rangPriorite(a.priorite) - DASH.rangPriorite(b.priorite);
      if (r !== 0) return r;
      return DASH.pourcent(b.progression) - DASH.pourcent(a.progression);
    });
  };
  DASH.toutesTaches = function (projets) {
    var out = [];
    projets.forEach(function (p) {
      (p.taches || []).forEach(function (t) {
        out.push({
          projetId: p.id, projetNom: p.nom, icone: p.icone,
          nom: t.nom, priorite: t.priorite, statut: t.statut,
          rang: DASH.rangPriorite(t.priorite)
        });
      });
    });
    out.sort(function (a, b) {
      var r = a.rang - b.rang; if (r !== 0) return r;
      return a.projetNom.localeCompare(b.projetNom, 'fr');
    });
    return out;
  };

  /* --- Icônes SVG inline (24x24, stroke) --- */
  var ICONES = {
    message: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.4 0-2.7-.3-3.9-.9L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5z"/></svg>',
    compass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></svg>',
    dumbbell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 6.5v11M17.5 6.5v11M3 9v6M21 9v6M6.5 12h11"/></svg>',
    building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M2 21h20"/><path d="M8 7h2M8 11h2M8 15h2M13 7h2M13 11h2M13 15h2"/></svg>',
    rocket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15c-3-1-5-4-5-8 3 0 6 1 8 3l2 2c1 1 .5 4-1 5-3 2-6 1-8 0zM7 11c-1 0-2 1-3 2 1 1 2 2 3 2M12 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>',
    sparkles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/></svg>'
  };
  DASH.iconeSVG = function (nom) { return ICONES[nom] || ICONES.book; };

  /* --- Couleurs --- */
  var PALETTE = ['#8A6A3F', '#B4553C', '#5F7A55', '#C08A2D', '#7A5C8C', '#3E6E8C', '#A97E4A', '#6B4E2D', '#9C7A6B', '#4E6E5E'];
  DASH.couleur = function (idx) { return PALETTE[idx % PALETTE.length]; };
  DASH.couleurPrio = function (prio) {
    return { permanente: '#5C4527', haute: '#B4553C', moyenne: '#C08A2D', basse: '#5F7A55' }[prio] || '#A79882';
  };
  DASH.libellePrio = function (prio) {
    return { permanente: 'Permanente', haute: 'Haute', moyenne: 'Moyenne', basse: 'Basse' }[prio] || '—';
  };
  DASH.libelleStatut = function (st) {
    return { fait: 'Fait', 'en cours': 'En cours', 'a venir': 'À venir' }[st] || st || '—';
  };
  DASH.libelleStatutProjet = function (st) {
    return { actif: 'Actif', permanent: 'Permanent', 'en attente': 'En attente', archive: 'Archivé' }[st] || st || '—';
  };

  /* --- Échelle temporelle (Gantt & ligne d'évolution) --- */
  DASH.echelle = function (projets) {
    var ws = projets.filter(function (p) { return p.debut && p.fin; })
      .concat(projets.map(function (p) {
        var fs = (p.etapes || []).filter(function (e) { return e.debut; }).map(function (e) { return e.debut; });
        var fe = (p.etapes || []).filter(function (e) { return e.fin; }).map(function (e) { return e.fin; });
        return { debut: fs[0] || p.debut, fin: fe[fe.length - 1] || p.fin };
      }));
    var debuts = [].concat.apply([], ws.map(function (w) { return w.debut ? [w.debut] : []; }));
    var fins = [].concat.apply([], ws.map(function (w) { return w.fin ? [w.fin] : []; }));
    if (!debuts.length) debuts.push(DASH.aujourdhui());
    if (!fins.length) fins.push(DASH.aujourdhui());
    var min = debuts.slice().sort()[0];
    var max = fins.slice().sort()[fins.length - 1];
    if (DASH.joursEntre(min, max) < 1) max = DASH.dateISO(DASH.parseISO(min).setUTCDate(DASH.parseISO(min).getUTCDate() + 7));
    var n = DASH.joursEntre(min, max);
    var pas, px;
    if (n > 270) { pas = 30; px = 2.4; }
    else if (n > 90) { pas = 7; px = 5.6; }
    else { pas = 1; px = 18; }
    return { min: min, max: max, jours: Math.max(n, 1), pas: pas, px: px, largeur: Math.ceil(n * px) + 40 };
  };

  DASH.ticks = function (ech) {
    var out = [];
    for (var i = 0; i <= ech.jours; i += ech.pas) {
      var d = DASH.parseISO(ech.min);
      d.setUTCDate(d.getUTCDate() + i);
      out.push({ x: i, date: DASH.dateISO(d) });
    }
    return out;
  };

  DASH.ganttLignes = function (projets, ech) {
    return DASH.trierProjets(projets).map(function (p) {
      return {
        id: p.id, nom: p.nom, icone: p.icone, phase: p.phase, priorite: p.priorite, progression: p.progression,
        etapes: (p.etapes || []).map(function (e) {
          var deb = DASH.asStr(e.debut), fin = DASH.asStr(e.fin);
          var x0 = Math.max(0, DASH.joursEntre(ech.min, deb));
          var x1 = Math.min(ech.jours, DASH.joursEntre(ech.min, fin));
          if (x1 < x0) x1 = x0;
          return { nom: e.nom, x0: x0, x1: x1, w: Math.max((x1 - x0) * ech.px, 6), statut: e.statut, debut: deb, fin: fin };
        })
      };
    });
  };

  /* --- Séries d'évolution --- */
  DASH.seriesEvolution = function (projets, ech) {
    var out = [];
    projets.forEach(function (p, idx) {
      var ev = (p.evolution || []).slice().sort(function (a, b) { return a.date.localeCompare(b.date); });
      if (!ev.length) return;
      out.push({
        id: p.id, nom: p.nom, couleur: DASH.couleur(idx),
        pts: ev.map(function (e) {
          return { x: DASH.joursEntre(ech.min, e.date), y: DASH.pourcent(e.valeur) };
        })
      });
    });
    return out;
  };

  DASH.svgLigne = function (pts, w, h, ech) {
    var path = '';
    pts.forEach(function (pt, i) {
      var x = Math.round(4 + (pt.x / ech.jours) * (w - 8));
      var y = Math.round(h - 6 - (pt.y / 100) * (h - 14));
      path += (i === 0 ? 'M' : 'L') + x + ' ' + y + ' ';
    });
    return path;
  };
  DASH.svgPoints = function (pts, w, h, ech) {
    return pts.map(function (pt) {
      var x = Math.round(4 + (pt.x / ech.jours) * (w - 8));
      var y = Math.round(h - 6 - (pt.y / 100) * (h - 14));
      return '<circle cx="' + x + '" cy="' + y + '" r="3" fill="currentColor"/>';
    }).join('');
  };
  DASH.svgPos = function (pt, w, h, ech) {
    return {
      x: Math.round(4 + (pt.x / ech.jours) * (w - 8)),
      y: Math.round(h - 6 - (pt.y / 100) * (h - 14))
    };
  };

  /* --- Donut --- */
  DASH.donutParts = function (projets) {
    var ordre = ['permanente', 'haute', 'moyenne', 'basse'];
    var comptes = {};
    ordre.forEach(function (k) { comptes[k] = 0; });
    projets.forEach(function (p) { if (comptes[p.priorite] != null) comptes[p.priorite]++; });
    var total = projets.length || 1;
    var parts = [];
    var cumul = -Math.PI / 2;
    ordre.forEach(function (k) {
      if (!comptes[k]) return;
      var frac = comptes[k] / total;
      var a0 = cumul, a1 = cumul + frac * Math.PI * 2;
      cumul = a1;
      parts.push({ label: DASH.libellePrio(k), valeur: comptes[k], couleur: DASH.couleurPrio(k), a0: a0, a1: a1 });
    });
    return parts;
  };
  DASH.arcDonut = function (cx, cy, r, a0, a1) {
    var x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    var x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    var large = (a1 - a0) > Math.PI ? 1 : 0;
    return 'M' + cx + ' ' + cy + ' L' + x0.toFixed(1) + ' ' + y0.toFixed(1) +
      ' A' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' Z';
  };

  /* ================= Rendu DOM ================= */
  if (typeof document === 'undefined') { window.DASH = DASH; return; }

  var $ = function (id) { return document.getElementById(id); };
  var data = window.DASH_DATA || { projets: [], meta: {} };
  var projets = (data.projets || []).slice();
  var VIEWS = {
    apercu: { titre: "Vue d'ensemble", sous: 'Synthèse du portefeuille' },
    projets: { titre: 'Projets', sous: 'Cartes détaillées par projet' },
    gantt: { titre: 'Gantt', sous: 'Planning d\u2019exécution par projet' },
    taches: { titre: 'Tâches', sous: 'Liste des tâches en cours' },
    priorites: { titre: 'Priorités', sous: 'Classement et attention recommandée' }
  };

  /* ---------- Navigation ---------- */
  function setupNav() {
    var links = document.querySelectorAll('.nav a[data-view]');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function (e) {
        e.preventDefault();
        var v = this.getAttribute('data-view');
        showView(v);
        closeSidebar();
      });
    }
    $('menuBtn').addEventListener('click', function () {
      $('sidebar').classList.add('open');
      $('overlay').classList.add('show');
    });
    $('overlay').addEventListener('click', closeSidebar);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSidebar(); });
  }
  function showView(v) {
    if (!VIEWS[v]) return;
    var views = document.querySelectorAll('.view');
    for (var i = 0; i < views.length; i++) views[i].classList.remove('active');
    var target = document.getElementById(v);
    if (target) target.classList.add('active');
    var navs = document.querySelectorAll('.nav a[data-view]');
    for (var j = 0; j < navs.length; j++) {
      var act = navs[j].getAttribute('data-view') === v;
      navs[j].classList.toggle('active', act);
      if (act) navs[j].setAttribute('aria-current', 'page'); else navs[j].removeAttribute('aria-current');
    }
    $('pageTitle').textContent = VIEWS[v].titre;
    $('crumb').textContent = VIEWS[v].sous;
    if (v === 'gantt') renderGantt();
    window.scrollTo(0, 0);
  }
  function closeSidebar() {
    $('sidebar').classList.remove('open');
    $('overlay').classList.remove('show');
  }

  /* ---------- KPIs ---------- */
  function renderKPIs() {
    var actifs = DASH.compter(projets, 'statut', 'actif');
    var moy = DASH.moyenneProgression(projets);
    var prochaine = prochaineEcheance() || { date: '—', label: 'Aucune échéance planifiée' };
    var kpis = [
      { label: 'Projets', val: String(projets.length), sub: projets.length + ' au portefeuille' },
      { label: 'Actifs', val: String(actifs), sub: DASH.compter(projets, 'statut', 'permanent') + ' permanent(s)' },
      { label: 'Progression moyenne', val: String(moy), unite: '%', sub: 'sur projets à durée' },
      { label: 'Prochaine échéance', val: prochaine.date, sub: prochaine.label, small: true }
    ];
    $('kpiRow').innerHTML = kpis.map(function (k) {
      return '<div class="card kpi accent">' +
        '<div class="k-label">' + DASH.esc(k.label) + '</div>' +
        '<div class="k-val">' + DASH.esc(k.val) + (k.unite ? ' <small>' + k.unite + '</small>' : '') + '</div>' +
        '<div class="k-sub">' + DASH.esc(k.sub) + '</div></div>';
    }).join('');
  }
  function prochaineEcheance() {
    var today = DASH.aujourdhui();
    var items = [];
    projets.forEach(function (p) {
      (p.etapes || []).forEach(function (e) {
        if (e.statut === 'fait' || !e.fin) return;
        items.push({ date: e.fin, label: p.nom + ' · ' + e.nom, statut: e.statut });
      });
    });
    items.sort(function (a, b) { return a.date.localeCompare(b.date); });
    for (var i = 0; i < items.length; i++) {
      var d = DASH.joursEntre(today, items[i].date);
      if (d >= 0) return { date: DASH.dateFr(items[i].date), label: items[i].label };
    }
    if (items.length) return { date: DASH.dateFr(items[0].date), label: items[0].label + ' (dépassée)' };
    return null;
  }

  /* ---------- Évolution (line chart) ---------- */
  function renderEvolution() {
    var ech = DASH.echelle(projets);
    var series = DASH.seriesEvolution(projets, ech);
    var W = 560, H = 230, mTop = 10;
    if (!series.length) { $('chartEvolution').innerHTML = '<p style="color:var(--ink-faint)">Aucune donnée d\u2019évolution.</p>'; return; }
    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Évolution de la progression des projets" style="width:100%;height:auto;min-width:340px;">';
    for (var gy = 0; gy <= 100; gy += 25) {
      var yy = Math.round(H - 14 - (gy / 100) * (H - mTop - 14) + 14);
      svg += '<line x1="0" y1="' + yy + '" x2="' + W + '" y2="' + yy + '" stroke="#EFE8DB" stroke-width="1"/>';
      svg += '<text x="2" y="' + (yy - 3) + '" font-size="9" fill="#A79882">' + gy + '%</text>';
    }
    var ticks = DASH.ticks(ech);
    ticks.forEach(function (t, i) {
      if (i % Math.max(1, Math.floor(ticks.length / 5)) !== 0) return;
      var xx = Math.round(4 + (t.x / ech.jours) * (W - 8));
      svg += '<text x="' + xx + '" y="' + (H - 2) + '" font-size="9" fill="#A79882" text-anchor="middle">' + DASH.dateShort(t.date) + '</text>';
    });
    series.forEach(function (s) {
      svg += '<polyline points="' + DASH.svgLigne(s.pts, W, H, ech) + '" fill="none" stroke="' + s.couleur + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">' +
        '<title>' + DASH.esc(s.nom + ' : ' + s.pts[s.pts.length - 1].y + ' %') + '</title></polyline>';
      var last = DASH.svgPos(s.pts[s.pts.length - 1], W, H, ech);
      svg += '<circle cx="' + last.x + '" cy="' + last.y + '" r="3.4" fill="' + s.couleur + '"><title>' + DASH.esc(s.nom + ' : ' + s.pts[s.pts.length - 1].y + ' %') + '</title></circle>';
    });
    svg += '</svg>';
    $('chartEvolution').innerHTML = svg;
    $('legendEvolution').innerHTML = series.map(function (s) {
      return '<span><span class="sw" style="background:' + s.couleur + '"></span>' + DASH.esc(s.nom) + '</span>';
    }).join('');
  }

  /* ---------- Donut priorités ---------- */
  function renderDonut() {
    var parts = DASH.donutParts(projets);
    var R = 74, cx = 90, cy = 90;
    var svg = '<svg viewBox="0 0 180 180" role="img" aria-label="Répartition des priorités" style="width:180px;height:180px;">';
    parts.forEach(function (pt) {
      svg += '<path d="' + DASH.arcDonut(cx, cy, R, pt.a0, pt.a1) + '" fill="' + pt.couleur + '"><title>' +
        DASH.esc(pt.label + ' : ' + pt.valeur) + '</title></path>';
    });
    svg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (R - 26) + '" fill="var(--card)"/>';
    svg += '<text x="' + cx + '" y="' + (cy + 1) + '" text-anchor="middle" font-size="26" font-weight="800" fill="var(--ink)">' + projets.length + '</text>';
    svg += '<text x="' + cx + '" y="' + (cy + 16) + '" text-anchor="middle" font-size="9.5" fill="#A79882">projets</text>';
    svg += '</svg>';
    $('chartDonut').innerHTML = svg;
    $('legendDonut').innerHTML = parts.map(function (pt) {
      return '<span><span class="sw" style="background:' + pt.couleur + '"></span>' + DASH.esc(pt.label + ' · ' + pt.valeur) + '</span>';
    }).join('');
  }

  /* ---------- Barres progression ---------- */
  function renderBars() {
    var tri = DASH.trierProjets(projets);
    $('chartBars').innerHTML = tri.map(function (p) {
      var v = p.progression == null ? '—' : DASH.pourcent(p.progression);
      var val = p.progression == null ? 0 : DASH.pourcent(p.progression);
      return '<div class="bar-row">' +
        '<span class="b-name" title="' + DASH.esc(p.nom) + '">' + DASH.esc(p.nom) + '</span>' +
        '<span class="b-track"><span class="b-fill" style="width:' + val + '%;background:' + DASH.couleurPrio(p.priorite) + '"></span></span>' +
        '<span class="b-val">' + v + (p.progression == null ? '' : ' %') + '</span></div>';
    }).join('');
  }

  /* ---------- Prochaines échéances ---------- */
  function renderDeadlines() {
    var today = DASH.aujourdhui();
    var items = [];
    projets.forEach(function (p) {
      (p.etapes || []).forEach(function (e) {
        if (e.statut === 'fait' || !e.fin) return;
        var d = DASH.joursEntre(today, e.fin);
        items.push({ date: e.fin, delai: d, projet: p.nom, etape: e.nom, statut: e.statut });
      });
    });
    items.sort(function (a, b) { return a.date.localeCompare(b.date); });
    items = items.slice(0, 5);
    if (!items.length) { $('nextDeadlines').innerHTML = '<p style="color:var(--ink-faint)">Aucune échéance planifiée.</p>'; return; }
    $('nextDeadlines').innerHTML = items.map(function (it) {
      var badge;
      if (it.delai < 0) badge = '<span class="st st-faire">En retard</span>';
      else if (it.delai === 0) badge = '<span class="st st-cours">Aujourd\u2019hui</span>';
      else if (it.delai <= 14) badge = '<span class="st st-cours">' + it.delai + ' j</span>';
      else badge = '<span class="st st-fait">' + it.delai + ' j</span>';
      return '<div class="bar-row" style="grid-template-columns:1fr auto;margin-bottom:8px;">' +
        '<div><div style="font-size:12.5px;font-weight:600">' + DASH.esc(it.etape) + '</div>' +
        '<div style="font-size:11px;color:var(--ink-faint)">' + DASH.esc(it.projet) + ' · ' + DASH.dateFr(it.date) + '</div></div>' +
        '<div>' + badge + '</div></div>';
    }).join('');
  }

  /* ---------- Cartes projets ---------- */
  function renderProjets() {
    var tri = DASH.trierProjets(projets);
    $('projSub').textContent = tri.length + ' projets · triés par priorité';
    $('projGrid').innerHTML = tri.map(function (p) {
      var prog = p.progression == null;
      var val = prog ? 0 : DASH.pourcent(p.progression);
      var dates = (p.debut || p.fin)
        ? '<div class="pc-dates">🗓 ' + DASH.dateFr(p.debut) + ' → ' + (p.fin ? DASH.dateFr(p.fin) : '—') + '</div>'
        : '';
      return '<article class="card proj-card">' +
        '<div class="pc-top"><div class="pc-ic">' + DASH.iconeSVG(p.icone) + '</div>' +
        '<div><div class="pc-name">' + DASH.esc(p.nom) + '</div><div class="pc-phase">' + DASH.esc(p.phase) + '</div></div></div>' +
        '<div class="pc-meta">' +
        '<span class="badge stat-' + DASH.esc(p.statut) + '">' + DASH.esc(DASH.libelleStatutProjet(p.statut)) + '</span>' +
        '<span class="badge prio-' + DASH.esc(p.priorite) + '">' + DASH.esc(DASH.libellePrio(p.priorite)) + '</span>' +
        '<span class="badge verdict">' + DASH.esc(p.verdict) + '</span></div>' +
        '<div class="pc-court">' + DASH.esc(p.court) + '</div>' +
        '<div class="pc-prog"><span class="track"><span class="fill" style="width:' + val + '%"></span></span>' +
        '<span class="val">' + (prog ? '∞' : val + ' %') + '</span></div>' +
        '<div class="pc-next">➜ <b>' + DASH.esc(p.prochaineEtape) + '</b></div>' + dates +
        '</article>';
    }).join('');
  }

  /* ---------- Gantt ---------- */
  function renderGantt() {
    var ech = DASH.echelle(projets);
    var lignes = DASH.ganttLignes(projets, ech);
    var ticks = DASH.ticks(ech);
    var today = DASH.aujourdhui();
    var todayX = DASH.joursEntre(ech.min, today);

    var head = '<div class="gantt-head"><div class="g-cell-label">Projet</div><div class="g-timeline" style="width:' + ech.largeur + 'px">';
    ticks.forEach(function (t) {
      head += '<div class="g-gridline" style="left:' + (t.x * ech.px) + 'px"></div>';
    });
    if (todayX >= 0 && todayX <= ech.jours) {
      head += '<div class="g-today" style="left:' + (todayX * ech.px) + 'px"></div>';
      head += '<div class="g-today-label" style="left:' + (todayX * ech.px) + 'px">Aujourd\u2019hui</div>';
    }
    head += '</div></div>';

    var rows = lignes.map(function (l) {
      var label = '<div class="g-cell-label"><span>' + DASH.esc(l.nom) + '</span><span class="g-sub">' +
        DASH.esc(l.phase + ' · ' + DASH.libellePrio(l.priorite)) + '</span></div>';
      var lane = '<div class="g-lane" style="width:' + ech.largeur + 'px">';
      l.etapes.forEach(function (e) {
        lane += '<div class="g-task et-' + DASH.esc(e.statut) + '" style="left:' + (e.x0 * ech.px) + 'px;width:' + e.w + 'px" title="' +
          DASH.esc(e.nom + ' · ' + DASH.dateFr(e.debut) + ' → ' + DASH.dateFr(e.fin)) + '"><span>' + DASH.esc(e.nom) + '</span></div>';
      });
      lane += '</div>';
      return '<div class="gantt-row">' + label + '<div class="g-timeline">' + lane + '</div></div>';
    }).join('');

    $('ganttBox').innerHTML = '<div class="gantt">' + head + rows + '</div>';
  }

  /* ---------- Tâches ---------- */
  function renderTaches() {
    var ts = DASH.toutesTaches(projets);
    var enCours = ts.filter(function (t) { return t.statut !== 'fait'; }).length;
    $('tachesSub').textContent = ts.length + ' tâches (' + enCours + ' à faire ou en cours)';
    if (!ts.length) { $('tachesBody').innerHTML = '<tr><td colspan="4">Aucune tâche.</td></tr>'; return; }
    $('tachesBody').innerHTML = ts.map(function (t) {
      return '<tr>' +
        '<td class="t-proj">' + DASH.esc(t.projetNom) + '</td>' +
        '<td class="t-nom">' + DASH.esc(t.nom) + '</td>' +
        '<td><span class="badge prio-' + DASH.esc(t.priorite) + '">' + DASH.esc(DASH.libellePrio(t.priorite)) + '</span></td>' +
        '<td><span class="st st-' + DASH.esc(t.statut) + '">' + DASH.esc(DASH.libelleStatut(t.statut)) + '</span></td>' +
        '</tr>';
    }).join('');
  }

  /* ---------- Priorités ---------- */
  function renderPriorites() {
    var ordre = ['permanente', 'haute', 'moyenne', 'basse'];
    var html = '';
    ordre.forEach(function (k) {
      var ps = projets.filter(function (p) { return p.priorite === k; });
      if (!ps.length) return;
      var tasks = DASH.toutesTaches(projets).filter(function (t) { return t.priorite === k && t.statut !== 'fait'; });
      var noms = ps.map(function (p) { return DASH.esc(p.nom); }).join(' · ');
      html += '<div class="card prio-item prio-' + k + '-box">' +
        '<div class="p-label" style="color:' + DASH.couleurPrio(k) + '">' + DASH.libellePrio(k) + '</div>' +
        '<div class="p-tasks"><b>' + noms + '</b><br>' + tasks.length + ' tâche(s) en cours ou à faire</div>' +
        '<div class="p-count">' + ps.length + '</div></div>';
    });
    $('prioList').innerHTML = html;

    var tri = DASH.trierProjets(projets);
    $('prioRank').innerHTML = tri.map(function (p, i) {
      var v = p.progression == null ? '∞' : DASH.pourcent(p.progression) + ' %';
      return '<div class="bar-row" style="grid-template-columns:26px 150px 1fr 44px;">' +
        '<span style="font-weight:800;color:var(--ink-faint)">' + (i + 1) + '</span>' +
        '<span class="b-name">' + DASH.esc(p.nom) + '</span>' +
        '<span class="b-track"><span class="b-fill" style="width:' + (p.progression == null ? 100 : DASH.pourcent(p.progression)) + '%;background:' + DASH.couleurPrio(p.priorite) + '"></span></span>' +
        '<span class="b-val">' + v + '</span></div>';
    }).join('');
  }

  /* ---------- Init ---------- */
  function init() {
    $('topDateTxt').textContent = DASH.dateFr(DASH.aujourdhui());
    $('vers').textContent = (data.meta && data.meta.version) + ' · maj ' + ((data.meta && data.meta.misAJour) || '—');
    $('footNote').textContent = (data.meta && data.meta.titre) + ' — ' + ((data.meta && data.meta.note) || '');
    $('footSource').textContent = 'https://github.com/takitmob/portefeuille-dashboard (privé)';
    setupNav();
    renderKPIs();
    renderEvolution();
    renderDonut();
    renderBars();
    renderDeadlines();
    renderProjets();
    renderTaches();
    renderPriorites();
    renderGantt();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.DASH = DASH;
})();