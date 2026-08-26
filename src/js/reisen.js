// «Reisen» — forsidens scrollfortelling. Progressiv forbedring:
// uten dette scriptet (eller med redusert bevegelse) viser siden kun det
// statiske innholdet, som er komplett. Ingen lagring, ingen nettverkskall,
// ingen innhold i scriptet — all tekst kommer fra innholdsfilen via malene.
(function () {
  'use strict';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var spor = document.getElementById('spor');
  if (!spor) return;
  document.body.classList.add('js-aktiv');

  var scene = document.getElementById('scene');
  var verden = document.getElementById('verden');
  var svg = document.getElementById('linjer');
  var grunn = document.getElementById('grunn');
  var tegnet = document.getElementById('tegnet');
  var prikk = document.getElementById('prikk');
  var prikk2 = document.getElementById('prikk2');
  var topp = document.getElementById('reise-topp');
  var hvitt = document.getElementById('hvitt');
  var fyll = document.getElementById('fremfyll');
  var intro = document.getElementById('intro');
  var utro = document.getElementById('utro');
  var rail = document.getElementById('rail');
  var prolog = document.getElementById('prolog');
  var pfig = prolog ? document.getElementById('pfig') : null;
  var ptekst = prolog ? document.getElementById('ptekst') : null;
  var phint = prolog ? document.getElementById('phint') : null;
  var pdekke = prolog ? document.getElementById('pdekke') : null;

  var kort = Array.prototype.slice.call(verden.querySelectorAll('.h-st'));
  var antall = kort.length;
  if (antall === 0) return;

  var YFRAK = [0.56, 0.62, 0.55, 0.6, 0.56];
  var iw, ih, W, maxT, X = [], Y = [], L = 0;
  var noder = [], spokelser = [], knapper = [];

  if (pfig) {
    pfig.querySelectorAll('.p-anno').forEach(function (a) {
      a.style.left = a.dataset.x + '%';
      a.style.top = a.dataset.y + '%';
    });
  }

  spor.style.height = 380 + antall * 60 + 'vh';

  function bygg() {
    iw = innerWidth;
    ih = innerHeight;
    X = kort.map(function (_, i) { return iw * (1.35 + i * 0.92); });
    Y = kort.map(function (_, i) { return YFRAK[i % YFRAK.length] * ih; });
    W = X[antall - 1] + iw * 1.15;
    maxT = W - iw;
    utro.style.left = W - iw + 'px';
    utro.style.width = iw + 'px';
    verden.style.width = W + 'px';
    svg.setAttribute('width', W);
    svg.setAttribute('height', ih);
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + ih);

    noder.forEach(function (n) { n.remove(); });
    spokelser.forEach(function (g) { g.remove(); });
    noder = [];
    spokelser = [];

    var d = 'M ' + iw * 0.32 + ' ' + 0.72 * ih;
    var forX = iw * 0.32;
    var forY = 0.72 * ih;
    function seg(x, y, vri) {
      var mx = (forX + x) / 2;
      d += ' C ' + mx + ' ' + (forY + (vri || 0)) + ', ' + mx + ' ' + (y - (vri || 0)) + ', ' + x + ' ' + y;
      forX = x;
      forY = y;
    }
    if (antall === 5) {
      seg(X[0], Y[0]);
      seg((X[0] + X[1]) / 2, (Y[0] + Y[1]) / 2 + 0.1 * ih, 40);
      seg(X[1] - iw * 0.16, Y[1] - 0.06 * ih, -30);
      seg(X[1], Y[1]);
      seg((X[1] + X[2]) / 2, Y[1] - 0.08 * ih, -35);
      seg(X[2], Y[2]);
      seg(X[3], Y[3]);
      seg(X[4], Y[4]);
    } else {
      kort.forEach(function (_, i) { seg(X[i], Y[i], i % 2 ? -30 : 30); });
    }
    seg(W - iw * 0.3, 0.34 * ih);
    grunn.setAttribute('d', d);
    tegnet.setAttribute('d', d);
    L = tegnet.getTotalLength();
    tegnet.setAttribute('stroke-dasharray', L);
    tegnet.setAttribute('stroke-dashoffset', L);

    var mg = document.getElementById('mstre');
    while (mg.firstChild) mg.removeChild(mg.firstChild);
    for (var mk = 1; mk < 46; mk += 1) {
      var mp = tegnet.getPointAtLength((L * mk) / 46);
      var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('r', '2.5');
      c.setAttribute('cx', mp.x);
      c.setAttribute('cy', mp.y);
      c.setAttribute('class', 'm-prikk');
      mg.appendChild(c);
    }

    kort.forEach(function (k, i) {
      var nd = document.createElement('span');
      nd.className = 'h-node';
      nd.textContent = k.dataset.nummer;
      nd.style.left = X[i] + 'px';
      nd.style.top = Y[i] + 'px';
      verden.appendChild(nd);
      noder.push(nd);

      var g = document.createElement('span');
      g.className = 'h-ghost';
      g.textContent = k.dataset.sone;
      g.style.left = X[i] - iw * 0.4 + 'px';
      verden.appendChild(g);
      spokelser.push(g);

      k.style.left = X[i] + 'px';
      if (i % 2 === 0) {
        k.style.bottom = ih - Y[i] + 72 + 'px';
        k.style.top = 'auto';
      } else {
        k.style.top = Y[i] + 96 + 'px';
        k.style.bottom = 'auto';
      }
    });
  }

  while (rail.firstChild) rail.removeChild(rail.firstChild);
  knapper = [];
  kort.forEach(function (k, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = k.dataset.nummer;
    b.setAttribute('aria-label', rail.dataset.til + ' ' + k.dataset.nummer);
    b.tabIndex = -1; // hele scenen er aria-skjult; tastatur bruker det statiske innholdet
    rail.appendChild(b);
    knapper.push(b);
    b.addEventListener('click', function () {
      var pm = (X[i] - iw * 0.5) / maxT;
      scrollTo({ top: spor.offsetTop + pm * (spor.offsetHeight - ih), behavior: 'smooth' });
    });
  });

  function ramp(v, a, b) {
    return Math.min(1, Math.max(0, (v - a) / (b - a)));
  }

  var sist = -1;
  var psist = -1;

  function tegnProlog() {
    if (!prolog) return;
    var r = prolog.getBoundingClientRect();
    var ih2 = innerHeight;
    var pp = Math.min(1, Math.max(0, -r.top / (r.height - ih2)));
    if (pp === psist) return;
    psist = pp;
    var e = pp * pp;
    var sk = 1 + e * 84;
    pfig.style.transformOrigin = '51% 42%';
    pfig.style.transform = 'scale(' + sk.toFixed(2) + ')';
    pfig.querySelector('img').style.opacity = (0.95 - 0.5 * ramp(pp, 0.6, 0.9)).toFixed(2);
    var tO = 1 - ramp(pp, 0.04, 0.16);
    ptekst.style.opacity = tO;
    ptekst.style.transform = 'translateY(' + (-18 * (1 - tO)).toFixed(1) + 'px)';
    phint.style.opacity = tO;
    var annoer = pfig.querySelectorAll('.p-anno');
    for (var ai = 0; ai < annoer.length; ai += 1) {
      var inn = ramp(pp, 0.05 + ai * 0.035, 0.11 + ai * 0.035);
      var ut = 1 - ramp(pp, 0.3, 0.38);
      annoer[ai].style.opacity = Math.min(inn, ut).toFixed(2);
    }
    pdekke.style.opacity = ramp(pp, 0.55, 0.85);
    if (r.bottom > ih2 * 0.5) topp.classList.remove('k-lys');
  }

  function tegn() {
    tegnProlog();
    var r = spor.getBoundingClientRect();
    var p = Math.min(1, Math.max(0, -r.top / (r.height - ih)));
    if (p === sist) return;
    sist = p;
    var tx = p * maxT;
    verden.style.transform = 'translateX(' + -tx + 'px)';
    var kamX = tx + iw * 0.5;
    var pc = Math.min(1, kamX / (W - iw * 0.3));
    tegnet.setAttribute('stroke-dashoffset', String(L * (1 - pc)));
    var pt = tegnet.getPointAtLength(L * pc);
    prikk.setAttribute('cx', pt.x);
    prikk.setAttribute('cy', pt.y);
    var pt2 = tegnet.getPointAtLength(L * Math.max(0, pc - 0.004));
    prikk2.setAttribute('cx', pt2.x);
    prikk2.setAttribute('cy', pt2.y);
    intro.style.opacity = 1 - ramp(p, 0.02, 0.09);
    var akt = -1;
    kort.forEach(function (k, i) {
      var v = Math.abs(kamX - X[i]) < iw * 0.34;
      k.classList.toggle('vis', v);
      noder[i].classList.toggle('aktiv', v);
      if (v) akt = i;
      var gx = X[i] - iw * 0.4;
      spokelser[i].style.opacity = ((1 - Math.min(1, Math.abs(kamX - gx) / (iw * 0.55))) * 0.16).toFixed(3);
    });
    utro.style.opacity = ramp(p, 0.86, 0.93) * (1 - ramp(p, 0.955, 0.985));
    knapper.forEach(function (b, i) {
      b.classList.toggle('aktiv', i === akt);
    });
    var hv = ramp(p, 0.9, 0.97);
    hvitt.style.opacity = hv;
    var prologFerdig = !prolog || prolog.getBoundingClientRect().bottom <= ih * 0.5;
    if (prologFerdig) topp.classList.toggle('k-lys', hv > 0.5);
    fyll.style.transform = 'scaleX(' + p + ')';
  }

  function alt() {
    bygg();
    sist = -1;
    psist = -1;
    tegn();
  }

  addEventListener('scroll', function () {
    psist = -1;
    tegn();
    requestAnimationFrame(function () {
      psist = -1;
      tegn();
    });
  }, { passive: true });
  addEventListener('resize', alt);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      sist = -1;
      tegn();
    });
  }
  alt();
})();
