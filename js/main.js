(function () {
  'use strict';

  var root = document.documentElement;
  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  function debounce(fn, wait) {
    var t;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, wait);
    };
  }

  /* ----------------------------------------------------------
     Mobile nav toggle + sticky-nav shadow
     ---------------------------------------------------------- */
  var nav = document.querySelector('.site-nav');
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && links.classList.contains('is-open')) {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (nav) {
    var onScroll = function () {
      if (window.scrollY > 4) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ----------------------------------------------------------
     Measure sticky bar heights into CSS vars (anchor offsets)
     ---------------------------------------------------------- */
  function setOffsets() {
    if (nav) root.style.setProperty('--nav-h', nav.offsetHeight + 'px');
    var tb = document.querySelector('.research-toolbar');
    if (tb) root.style.setProperty('--toolbar-h', tb.offsetHeight + 'px');
  }
  setOffsets();
  window.addEventListener('resize', debounce(setOffsets, 150));
  window.addEventListener('load', setOffsets);

  /* ----------------------------------------------------------
     Research page: chip counts, year options, filter + search,
     scroll-spy, copy citation / BibTeX
     ---------------------------------------------------------- */
  var toolbar = document.querySelector('.research-toolbar');
  if (toolbar) {
    var items = Array.prototype.slice.call(document.querySelectorAll('.research-item'));

    // Chip counts
    var chips = document.querySelectorAll('.chip-count[data-count-for]');
    Array.prototype.forEach.call(chips, function (span) {
      var type = span.getAttribute('data-count-for');
      var n = document.querySelectorAll('.research-item[data-type="' + type + '"]').length;
      span.textContent = '(' + n + ')';
    });

    // Year filter options
    var yearSel = document.getElementById('year-filter');
    var years = [];
    items.forEach(function (it) {
      var y = it.getAttribute('data-year');
      if (y && years.indexOf(y) === -1) years.push(y);
    });
    years.sort(function (a, b) { return Number(b) - Number(a); });
    if (yearSel) {
      years.forEach(function (y) {
        var o = document.createElement('option');
        o.value = y;
        o.textContent = y;
        yearSel.appendChild(o);
      });
    }

    var search = document.getElementById('research-search');
    var typeSel = document.getElementById('type-filter');
    var clearBtn = document.getElementById('clear-filters');
    var noResults = document.getElementById('no-results');

    function syncYearHeads() {
      var lists = document.querySelectorAll('.research-list');
      Array.prototype.forEach.call(lists, function (list) {
        var head = null;
        var headHasVisible = false;
        Array.prototype.forEach.call(list.children, function (child) {
          if (child.classList.contains('year-head')) {
            if (head) head.classList.toggle('is-hidden', !headHasVisible);
            head = child;
            headHasVisible = false;
          } else if (child.classList.contains('research-item')) {
            if (!child.classList.contains('is-hidden')) headHasVisible = true;
          }
        });
        if (head) head.classList.toggle('is-hidden', !headHasVisible);
      });
    }

    function applyFilters() {
      var term = (search ? search.value : '').trim().toLowerCase();
      var t = typeSel ? typeSel.value : '';
      var y = yearSel ? yearSel.value : '';
      var anyVisible = false;

      items.forEach(function (it) {
        var ok = (!t || it.getAttribute('data-type') === t) &&
                 (!y || it.getAttribute('data-year') === y) &&
                 (!term || it.textContent.toLowerCase().indexOf(term) !== -1);
        it.classList.toggle('is-hidden', !ok);
        if (ok) anyVisible = true;
      });

      // Hide whole sections that have no visible items
      var secs = document.querySelectorAll('.research-section[data-section]');
      Array.prototype.forEach.call(secs, function (sec) {
        var vis = sec.querySelectorAll('.research-item:not(.is-hidden)').length;
        sec.classList.toggle('is-hidden', vis === 0);
      });

      syncYearHeads();

      if (noResults) noResults.hidden = anyVisible;
      var active = !!(term || t || y);
      if (clearBtn) clearBtn.hidden = !active;
    }

    function clearAll() {
      if (search) search.value = '';
      if (typeSel) typeSel.value = '';
      if (yearSel) yearSel.value = '';
      applyFilters();
    }

    if (search) search.addEventListener('input', applyFilters);
    if (typeSel) typeSel.addEventListener('change', applyFilters);
    if (yearSel) yearSel.addEventListener('change', applyFilters);
    if (clearBtn) clearBtn.addEventListener('click', clearAll);
    if (noResults) {
      var nrClear = noResults.querySelector('[data-clear]');
      if (nrClear) nrClear.addEventListener('click', clearAll);
    }

    // Scroll-spy for the section chips
    var jumpLinks = Array.prototype.slice.call(document.querySelectorAll('.jump-link'));
    var sections = jumpLinks.map(function (l) {
      return document.querySelector(l.getAttribute('href'));
    });
    function spy() {
      var navH = parseInt(getComputedStyle(root).getPropertyValue('--nav-h'), 10) || 60;
      var tbH = parseInt(getComputedStyle(root).getPropertyValue('--toolbar-h'), 10) || 64;
      var offset = navH + tbH + 20;
      var activeIdx = 0;
      sections.forEach(function (sec, i) {
        if (!sec || sec.classList.contains('is-hidden')) return;
        if (sec.getBoundingClientRect().top <= offset) activeIdx = i;
      });
      jumpLinks.forEach(function (l, i) {
        l.classList.toggle('is-active', i === activeIdx);
      });
    }
    window.addEventListener('scroll', spy, { passive: true });
    spy();

    // Copy citation / BibTeX
    function citationText(li) {
      var body = li.querySelector('.item-body').cloneNode(true);
      var badges = body.querySelectorAll('.oa-badge');
      Array.prototype.forEach.call(badges, function (b) { b.parentNode.removeChild(b); });
      return body.textContent.replace(/\s+/g, ' ').trim();
    }

    function bibtex(li) {
      var d = li.dataset;
      var authorList = (d.authors || '').split(',').map(function (s) { return s.trim(); })
        .filter(Boolean);
      var authors = authorList.join(' and ');
      var firstLast = (authorList[0] || 'ref').split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
      var firstTitleWord = (d.title || '').split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
      var key = firstLast + (d.year || '') + firstTitleWord;
      var lines = ['@article{' + key + ','];
      if (d.authors) lines.push('  author = {' + authors + '},');
      if (d.title) lines.push('  title = {' + d.title + '},');
      if (d.journal) lines.push('  journal = {' + d.journal + '},');
      if (d.year) lines.push('  year = {' + d.year + '},');
      if (d.volume) lines.push('  volume = {' + d.volume + '},');
      if (d.pages) lines.push('  pages = {' + d.pages + '},');
      if (d.doi) lines.push('  doi = {' + d.doi + '},');
      if (d.url && !d.doi) lines.push('  url = {' + d.url + '},');
      lines.push('}');
      return lines.join('\n');
    }

    function legacyCopy(text, cb) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'absolute';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e) { /* no-op */ }
      document.body.removeChild(ta);
      if (cb) cb();
    }

    function flash(btn) {
      btn.textContent = 'Copied';
      btn.classList.add('copied');
      setTimeout(function () {
        btn.textContent = btn.getAttribute('data-label');
        btn.classList.remove('copied');
      }, 1500);
    }

    function copyText(text, btn) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { flash(btn); })
          .catch(function () { legacyCopy(text, function () { flash(btn); }); });
      } else {
        legacyCopy(text, function () { flash(btn); });
      }
    }

    var citeButtons = document.querySelectorAll('.cite-btn');
    Array.prototype.forEach.call(citeButtons, function (btn) {
      if (!btn.getAttribute('data-label')) btn.setAttribute('data-label', btn.textContent);
      btn.addEventListener('click', function () {
        var li = btn.closest('.research-item');
        if (!li) return;
        var text = btn.getAttribute('data-cite') === 'bibtex' ? bibtex(li) : citationText(li);
        copyText(text, btn);
      });
    });
  }

  /* ----------------------------------------------------------
     People page: clamp long bios, add Read more / less toggle
     (progressive enhancement — full text shows without JS)
     ---------------------------------------------------------- */
  var bios = document.querySelectorAll('.person .bio');
  Array.prototype.forEach.call(bios, function (bio) {
    bio.classList.add('is-clamped');
    // If the clamped bio actually overflows, offer a toggle
    if (bio.scrollHeight - bio.clientHeight > 2) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'bio-toggle';
      btn.textContent = 'Read more';
      btn.setAttribute('aria-expanded', 'false');
      bio.insertAdjacentElement('afterend', btn);
      btn.addEventListener('click', function () {
        var clamped = bio.classList.toggle('is-clamped');
        btn.textContent = clamped ? 'Read more' : 'Read less';
        btn.setAttribute('aria-expanded', clamped ? 'false' : 'true');
      });
    } else {
      bio.classList.remove('is-clamped');
    }
  });

  /* ----------------------------------------------------------
     Home page: animated stat counters
     ---------------------------------------------------------- */
  var statNums = document.querySelectorAll('.stat-num[data-target]');
  if (statNums.length) {
    if (prefersReduced || !hasIO) {
      Array.prototype.forEach.call(statNums, function (el) {
        el.textContent = el.getAttribute('data-target');
      });
    } else {
      var animateStat = function (el) {
        var target = parseInt(el.getAttribute('data-target'), 10) || 0;
        var duration = 1100;
        var start = performance.now();
        var step = function (now) {
          var p = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased);
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = target;
        };
        requestAnimationFrame(step);
      };
      var statIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            animateStat(e.target);
            statIO.unobserve(e.target);
          }
        });
      }, { threshold: 0.4 });
      Array.prototype.forEach.call(statNums, function (el) { statIO.observe(el); });
    }
  }

  /* ----------------------------------------------------------
     Scroll-reveal for cards / people / stats
     ---------------------------------------------------------- */
  if (!prefersReduced && hasIO) {
    var revealEls = document.querySelectorAll('.card, .person, .stat');
    Array.prototype.forEach.call(revealEls, function (el) { el.classList.add('reveal-init'); });
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('reveal-in');
          revealIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    Array.prototype.forEach.call(revealEls, function (el) { revealIO.observe(el); });
  }
})();
