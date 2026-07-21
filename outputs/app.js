(() => {
  'use strict';

  const dataset = window.NEOLABS_DATA;
  if (!dataset || !Array.isArray(dataset.labs)) {
    document.body.textContent = 'The shared neolab dataset could not be loaded.';
    return;
  }

  function compareLabsByFormation(a, b) {
    const aTime = formationSortKey(a);
    const bTime = formationSortKey(b);
    return aTime.year - bTime.year || aTime.month - bTime.month || a.name.localeCompare(b.name);
  }

  function formationSortKey(lab) {
    const match = String(lab.formation?.time || '').match(/^(\d{4})(?:\.(\d{2}))?$/);
    return match ? { year: Number(match[1]), month: match[2] ? Number(match[2]) : 13 } : { year: -Infinity, month: -Infinity };
  }

  const allLabs = dataset.labs.slice().sort(compareLabsByFormation);
  const labById = new Map(allLabs.map(lab => [lab.id, lab]));
  const shortLabName = lab => lab.shortName || lab.name;
  const focusStorageKey = 'neolab-active-lab-v1';
  const page = document.body.dataset.page;
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const CONFIDENCE_LABELS = ['Limited', 'Moderate', 'High'];

  function query(selector, root = document) {
    return root.querySelector(selector);
  }

  function unique(values) {
    return [...new Set(values)];
  }

  function readSelection() {
    return allLabs.map(lab => lab.id);
  }

  function stripDeprecatedSelectionParam() {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('labs')) return;
    params.delete('labs');
    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
    window.history.replaceState(null, '', nextUrl);
  }

  function readFocus(ids = readSelection()) {
    const params = new URLSearchParams(window.location.search);
    if (params.has('focus') && labById.has(params.get('focus'))) return params.get('focus');
    try {
      const stored = window.localStorage.getItem(focusStorageKey);
      if (stored && labById.has(stored)) return stored;
    } catch (_) {}
    return ids[0] || allLabs[0]?.id;
  }

  function writeFocus(id, { updateUrl = true } = {}) {
    if (!labById.has(id)) return;
    try { window.localStorage.setItem(focusStorageKey, id); } catch (_) {}
    if (!updateUrl) return;
    const params = new URLSearchParams(window.location.search);
    params.set('focus', id);
    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
    window.history.replaceState(null, '', nextUrl);
  }

  function selectionHref(target, ids, focusId = readFocus(ids)) {
    const params = new URLSearchParams();
    if (focusId && labById.has(focusId)) params.set('focus', focusId);
    const query = params.toString();
    return `${target}${query ? `?${query}` : ''}`;
  }

  function updateViewLinks(ids, focusId = readFocus(ids)) {
    document.querySelectorAll('[data-view-link]').forEach(link => {
      link.href = selectionHref(link.dataset.target, ids, focusId);
    });
  }

  function formatVersionDate(value) {
    if (!value) return '';
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function renderLastUpdated() {
    const label = formatVersionDate(dataset.version);
    document.querySelectorAll('[data-last-updated]').forEach(target => {
      target.textContent = label ? `Last updated on ${label}` : '';
      target.hidden = !label;
    });
  }

  function setActiveLab(id) {
    if (!labById.has(id)) return;
    writeFocus(id);
    updateViewLinks(readSelection(), id);
  }

  function selectedLabs(ids = readSelection()) {
    return ids.map(id => labById.get(id)).filter(Boolean);
  }

  function disclosureScore(lab) {
    return lab.disclosureConfidence?.score ?? 1;
  }

  function disclosureLabel(lab) {
    return CONFIDENCE_LABELS[disclosureScore(lab) - 1] || CONFIDENCE_LABELS[0];
  }

  function analysisEntry(lab, key) {
    const entry = lab.scores?.[key];
    if (entry && typeof entry === 'object') return entry;
    return { score: Number.isFinite(entry) ? entry : 0, rationale: '' };
  }

  function analysisScore(lab, key) {
    const score = analysisEntry(lab, key).score;
    return Number.isFinite(score) ? score : 0;
  }

  function analysisRationale(lab, key) {
    return analysisEntry(lab, key).rationale || '';
  }

  function analysisScoreLabel(lab, key) {
    const score = analysisScore(lab, key);
    const rationale = analysisRationale(lab, key);
    return rationale ? `${score}/3: ${rationale}` : `${score}/3`;
  }

  function fundingSummary(lab) {
    const events = lab.fundingHistory || [];
    const totalRaised = events.reduce((sum, event) => sum + (Number.isFinite(event.amountRaisedUsd) ? event.amountRaisedUsd : 0), 0);
    const valuedEvents = events.filter(event => Number.isFinite(event.valuationUsd));
    return {
      totalRaised,
      latestValuation: valuedEvents.length ? valuedEvents[valuedEvents.length - 1].valuationUsd : 0
    };
  }

  function insightIdsForLab(lab) {
    return [
      lab.noteInsightId,
      lab.formation?.insightId,
      lab.disclosureConfidence?.insightId,
      ...(lab.fundingHistory || []).map(event => event.insightId)
    ].filter(Boolean);
  }

  function renderCitations(container, insightIds, label = 'Sources') {
    container.replaceChildren();
    container.classList.add('citation-reveal');
    const sourceIds = unique((dataset.evidenceLinks || [])
      .filter(link => insightIds.includes(link.insightId))
      .map(link => link.sourceId));
    const heading = document.createElement('strong');
    heading.className = 'citation-heading';
    heading.textContent = label;
    container.appendChild(heading);
    const list = document.createElement('div');
    list.className = 'citation-list';
    sourceIds.slice(0, 12).forEach(sourceId => {
      const source = dataset.sources?.[sourceId];
      if (!source?.url) return;
      const link = document.createElement('a');
      link.href = source.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = source.publisher || source.title;
      link.setAttribute('aria-label', `${source.title} — ${source.publisher}`);
      list.appendChild(link);
    });
    if (sourceIds.length > 12) {
      const more = document.createElement('span');
      more.textContent = `+${sourceIds.length - 12} more`;
      list.appendChild(more);
    }
    if (!list.children.length) {
      const empty = document.createElement('span');
      empty.textContent = 'No public sources mapped';
      list.appendChild(empty);
    }
    container.appendChild(list);
  }

  function renderPeopleList(lab) {
    const peopleList = document.createElement('ul');
    peopleList.className = 'radar-people';
    (lab.keyPeople || []).forEach(person => {
      const item = document.createElement('li');
      const heading = document.createElement('div');
      heading.className = 'radar-person-heading';
      const personName = document.createElement('strong');
      personName.className = 'radar-person-full';
      personName.textContent = person.name;
      const lastName = document.createElement('span');
      lastName.className = 'radar-person-last';
      const nameParts = person.name.trim().split(/\s+/);
      lastName.textContent = nameParts[nameParts.length - 1];
      lastName.setAttribute('aria-label', person.name);
      const role = document.createElement('span');
      role.className = 'radar-person-role';
      role.textContent = person.role;
      heading.append(personName, lastName, role);
      const experience = document.createElement('small');
      experience.textContent = (person.pastExperiences || []).join(' · ');
      item.append(heading, experience);
      peopleList.appendChild(item);
    });
    return peopleList;
  }

  function svgEl(tag, attrs = {}) {
    const node = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  }

  function debounce(fn, delay = 80) {
    let timer;
    return (...args) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => fn(...args), delay);
    };
  }

  function createDelayedTooltip() {
    const tooltip = document.createElement('div');
    tooltip.className = 'axis-hover-tooltip';
    tooltip.setAttribute('role', 'tooltip');
    document.body.appendChild(tooltip);
    let timer = null;
    function position(event) {
      tooltip.style.left = `${event.clientX + 14}px`;
      tooltip.style.top = `${event.clientY + 14}px`;
    }
    function hide() {
      window.clearTimeout(timer);
      timer = null;
      tooltip.classList.remove('is-visible');
    }
    function bind(target, textForTarget) {
      target.addEventListener('pointerenter', event => {
        const text = typeof textForTarget === 'function' ? textForTarget() : textForTarget;
        if (!text) return;
        position(event);
        window.clearTimeout(timer);
        timer = window.setTimeout(() => {
          tooltip.textContent = text;
          tooltip.classList.add('is-visible');
          position(event);
        }, 500);
      });
      target.addEventListener('pointermove', position);
      target.addEventListener('pointerleave', hide);
      target.addEventListener('pointerdown', hide);
    }
    return { bind, hide };
  }

  const architectureMetrics = Object.fromEntries(Object.entries(dataset.schema?.analysisAxes || {}).map(([key, metric]) => [key, {
    label: metric.label,
    description: metric.hoverText
  }]));
  function initArchitecture() {
    const ids = readSelection();
    const labs = selectedLabs(ids);
    const svg = query('.architecture-svg');
    const stage = query('#architecture-stage');
    const detail = query('#architecture-detail');
    const detailClose = query('#architecture-detail-close');
    const starLegend = query('.star-legend');
    const spaceHeader = query('body[data-page="space"] .site-header');
    const spaceLastUpdated = query('.space-last-updated');
    const spaceChromeParts = [spaceHeader, starLegend, spaceLastUpdated].filter(Boolean);
    const initialFocus = readFocus(ids);
    const financing = new Map(labs.map(lab => [lab.id, fundingSummary(lab)]));
    const maxRaised = Math.max(1, ...[...financing.values()].map(item => item.totalRaised));
    const maxValuation = Math.max(1, ...[...financing.values()].map(item => item.latestValuation));
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const precisePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const starGroups = new Map();
    const orbitBodies = new Map();
    const nebulaTrails = new Map();
    const orbitTilt = 0.64;
    const perspectiveStrength = 0.16;
    let selectedId = labs.some(lab => lab.id === initialFocus) ? initialFocus : labs[0]?.id;
    let width = 0;
    let height = 0;
    let center = { x: 0, y: 0 };
    let motionFrame = null;
    let lastMotionTime = 0;
    let detailFrame = null;
    let detailOpen = false;
    let detailMode = 'closed';
    let pinnedId = null;
    let hoverStarId = null;
    let detailHovered = false;
    let hoverCloseTimer = null;
    let chromeHideTimer = null;
    let lastPointerY = Number.POSITIVE_INFINITY;

    const params = new URLSearchParams(window.location.search);
    const hadLegacyAxes = ['x', 'y', 'view'].some(key => params.has(key));
    ['x', 'y', 'view'].forEach(key => params.delete(key));
    if (hadLegacyAxes) {
      const cleanQuery = params.toString();
      window.history.replaceState(null, '', `${window.location.pathname}${cleanQuery ? `?${cleanQuery}` : ''}${window.location.hash}`);
    }
    updateViewLinks(ids, selectedId);

    function hash(text) {
      let value = 2166136261;
      for (let index = 0; index < text.length; index += 1) {
        value ^= text.charCodeAt(index);
        value = Math.imul(value, 16777619);
      }
      return value >>> 0;
    }

    function formationTimelineValue(lab) {
      const key = formationSortKey(lab);
      if (!Number.isFinite(key.year)) return NaN;
      const monthIndex = key.month === 13 ? 11.9 : Math.max(0, key.month - 1);
      return key.year + monthIndex / 12;
    }

    function stellarColor(time) {
      const times = labs.map(formationTimelineValue).filter(Number.isFinite);
      const newest = Math.max(...times);
      const oldest = Math.min(...times);
      const progress = newest === oldest ? 0 : Math.max(0, Math.min(1, (newest - time) / (newest - oldest)));
      const stops = progress < 0.5
        ? { from: [151, 207, 255], to: [246, 235, 198], mix: progress * 2 }
        : { from: [246, 235, 198], to: [255, 157, 82], mix: (progress - 0.5) * 2 };
      const rgb = stops.from.map((value, index) => Math.round(value + (stops.to[index] - value) * stops.mix));
      return `rgb(${rgb.join(' ')})`;
    }

    function formatUsd(value) {
      if (!Number.isFinite(value) || value <= 0) return 'Undisclosed';
      if (value >= 1000000000) return `$${(value / 1000000000).toFixed(2).replace(/\.?0+$/, '')}B`;
      return `$${(value / 1000000).toFixed(1).replace(/\.?0+$/, '')}M`;
    }

    function clearChromeHide() {
      if (!chromeHideTimer) return;
      window.clearTimeout(chromeHideTimer);
      chromeHideTimer = null;
    }

    function chromeIsActive() {
      return spaceChromeParts.some(part => part.matches(':hover') || part.contains(document.activeElement));
    }

    function revealChrome() {
      clearChromeHide();
      document.body.classList.add('space-chrome-visible');
    }

    function scheduleChromeHide(delay = 500) {
      if (!precisePointer) return;
      clearChromeHide();
      chromeHideTimer = window.setTimeout(() => {
        chromeHideTimer = null;
        if (lastPointerY <= 110 || chromeIsActive()) return;
        document.body.classList.remove('space-chrome-visible');
      }, delay);
    }

    if (!precisePointer) document.body.classList.add('space-chrome-visible');
    spaceChromeParts.forEach(part => {
      part.addEventListener('pointerenter', revealChrome);
      part.addEventListener('pointerleave', () => scheduleChromeHide(500));
      part.addEventListener('focusin', revealChrome);
      part.addEventListener('focusout', () => scheduleChromeHide(500));
    });
    window.addEventListener('pointermove', event => {
      lastPointerY = event.clientY;
      if (event.clientY <= 110) revealChrome();
      else if (document.body.classList.contains('space-chrome-visible') && !chromeIsActive()) scheduleChromeHide();
    }, { passive: true });
    window.addEventListener('pointerleave', () => {
      lastPointerY = Number.POSITIVE_INFINITY;
      scheduleChromeHide(500);
    });
    window.addEventListener('keydown', event => {
      if (event.key === 'Tab') revealChrome();
      if (event.key === 'Escape' && detailOpen) closeDetail();
    });

    detailClose.addEventListener('click', event => {
      event.stopPropagation();
      closeDetail();
    });
    detail.addEventListener('pointerenter', () => {
      detailHovered = true;
      clearHoverClose();
    });
    detail.addEventListener('pointerleave', () => {
      detailHovered = false;
      scheduleHoverClose();
    });
    stage.addEventListener('click', event => {
      if (!event.target.closest('.star-point') && !event.target.closest('.star-detail')) closeDetail();
    });

    function configureOrbits() {
      orbitBodies.clear();
      const chronological = labs.slice().sort(compareLabsByFormation);
      const finiteTimes = chronological.map(formationTimelineValue).filter(Number.isFinite);
      const oldest = Math.min(...finiteTimes);
      const newest = Math.max(...finiteTimes);
      const maxHaloRadius = Math.max(...labs.map(lab => {
        const funding = financing.get(lab.id);
        const coreRadius = 4.5 + 9.5 * Math.sqrt(funding.totalRaised / maxRaised);
        return coreRadius + 5 + 20 * Math.sqrt(funding.latestValuation / maxValuation);
      }));
      const horizontalLimit = width / 2 - maxHaloRadius - Math.max(24, width * 0.035);
      const verticalClearance = Math.max(86, height * 0.15);
      const verticalLimit = (height / 2 - maxHaloRadius - verticalClearance) / orbitTilt;
      const outerRadius = Math.max(72, Math.min(horizontalLimit, verticalLimit));
      const innerRadius = Math.max(34, Math.min(72, outerRadius * 0.24));
      chronological.forEach((lab, rank) => {
        const time = formationTimelineValue(lab);
        const timeProgress = Number.isFinite(time) && newest !== oldest ? (time - oldest) / (newest - oldest) : 0;
        const rankProgress = chronological.length > 1 ? rank / (chronological.length - 1) : 0;
        const progress = timeProgress * 0.72 + rankProgress * 0.28;
        const radius = innerRadius + progress * (outerRadius - innerRadius);
        orbitBodies.set(lab.id, {
          angle: (hash(`${lab.id}-orbit`) % 3600) / 3600 * Math.PI * 2,
          radius,
          angularSpeed: 0.13 * Math.sqrt(innerRadius / radius),
          formationTime: time
        });
      });
    }

    function positionFor(body) {
      return {
        x: center.x + Math.cos(body.angle) * body.radius,
        y: center.y + Math.sin(body.angle) * body.radius * orbitTilt
      };
    }

    function nebulaWakeGeometry(body, span, phaseOffset, endInset = 0.035, turbulence = 1) {
      const points = [];
      const steps = 28;
      for (let index = 0; index <= steps; index += 1) {
        const progress = index / steps;
        const angle = body.angle - span + (span - endInset) * progress;
        const envelope = Math.sin(progress * Math.PI);
        const wave = progress * Math.PI * 4 + phaseOffset + body.angle * 1.7;
        const radialWobble = Math.sin(wave) * 2.4 * envelope * turbulence;
        const crossWobble = Math.cos(wave * 0.73) * 1.2 * envelope * turbulence;
        const radius = body.radius + radialWobble;
        points.push({
          x: center.x + Math.cos(angle) * radius,
          y: center.y + Math.sin(angle) * radius * orbitTilt + crossWobble
        });
      }
      const start = points[0];
      const end = points[points.length - 1];
      return {
        d: `M ${points.map(point => `${point.x} ${point.y}`).join(' L ')}`,
        start,
        end
      };
    }

    function paintPositions() {
      orbitBodies.forEach((body, id) => {
        const position = positionFor(body);
        const depth = Math.sin(body.angle);
        const perspectiveScale = 1 + depth * perspectiveStrength;
        const group = starGroups.get(id);
        group?.setAttribute('transform', `translate(${position.x} ${position.y}) scale(${perspectiveScale})`);
        if (group) group.style.opacity = String(0.78 + (depth + 1) * 0.11);
        const trails = nebulaTrails.get(id);
        if (trails) {
          const fogGeometry = nebulaWakeGeometry(body, trails.span, trails.phaseOffset);
          const filamentGeometry = nebulaWakeGeometry(body, trails.span * 0.72, trails.phaseOffset + 1.3, 0.055, 0.45);
          trails.fog.setAttribute('d', fogGeometry.d);
          trails.filament.setAttribute('d', filamentGeometry.d);
          trails.gradient.setAttribute('x1', fogGeometry.start.x);
          trails.gradient.setAttribute('y1', fogGeometry.start.y);
          trails.gradient.setAttribute('x2', fogGeometry.end.x);
          trails.gradient.setAttribute('y2', fogGeometry.end.y);
        }
      });
      if (detailOpen) positionDetail();
    }

    function stepMotion(now) {
      const dt = lastMotionTime ? Math.min(0.04, (now - lastMotionTime) / 1000) : 0;
      lastMotionTime = now;
      orbitBodies.forEach((body, id) => {
        if (detailOpen && id === selectedId) return;
        body.angle = (body.angle + body.angularSpeed * dt) % (Math.PI * 2);
      });
      paintPositions();
      motionFrame = window.requestAnimationFrame(stepMotion);
    }

    function stopMotion() {
      if (motionFrame) window.cancelAnimationFrame(motionFrame);
      motionFrame = null;
      lastMotionTime = 0;
    }

    function buildScene() {
      stopMotion();
      width = Math.max(320, Math.round(stage.getBoundingClientRect().width || 1000));
      height = Math.max(320, Math.round(stage.getBoundingClientRect().height || window.innerHeight || 700));
      center = { x: width / 2, y: height / 2 };
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      svg.setAttribute('height', height);
      svg.setAttribute('aria-label', 'All neolabs orbiting one center; older labs are nearer the center and newer labs are nearer the edge');
      svg.replaceChildren();
      starGroups.clear();
      nebulaTrails.clear();

      const defs = svgEl('defs');
      const gas = svgEl('filter', { id: 'star-gas', x: '-100%', y: '-100%', width: '300%', height: '300%' });
      gas.appendChild(svgEl('feGaussianBlur', { stdDeviation: 2.4 }));
      const glow = svgEl('filter', { id: 'star-glow', x: '-100%', y: '-100%', width: '300%', height: '300%' });
      glow.appendChild(svgEl('feGaussianBlur', { stdDeviation: 4.5, result: 'blur' }));
      const merge = svgEl('feMerge');
      merge.append(svgEl('feMergeNode', { in: 'blur' }), svgEl('feMergeNode', { in: 'SourceGraphic' }));
      glow.appendChild(merge);
      const nebulaSoft = svgEl('filter', { id: 'nebula-soft', x: '-40%', y: '-40%', width: '180%', height: '180%' });
      nebulaSoft.appendChild(svgEl('feGaussianBlur', { stdDeviation: 7.5 }));
      const galacticCore = svgEl('radialGradient', { id: 'galactic-core-gradient' });
      galacticCore.append(
        svgEl('stop', { offset: '0%', 'stop-color': 'rgb(229 239 255)', 'stop-opacity': '.24' }),
        svgEl('stop', { offset: '38%', 'stop-color': 'rgb(144 188 255)', 'stop-opacity': '.11' }),
        svgEl('stop', { offset: '100%', 'stop-color': 'rgb(76 98 171)', 'stop-opacity': '0' })
      );
      const orbitDepth = svgEl('linearGradient', {
        id: 'orbit-depth-gradient',
        gradientUnits: 'userSpaceOnUse',
        x1: center.x,
        y1: 0,
        x2: center.x,
        y2: height
      });
      orbitDepth.append(
        svgEl('stop', { offset: '15%', 'stop-color': 'rgb(179 211 255)', 'stop-opacity': '.05' }),
        svgEl('stop', { offset: '50%', 'stop-color': 'rgb(179 211 255)', 'stop-opacity': '.13' }),
        svgEl('stop', { offset: '85%', 'stop-color': 'rgb(196 222 255)', 'stop-opacity': '.28' })
      );
      defs.append(gas, glow, nebulaSoft, galacticCore, orbitDepth);
      svg.appendChild(defs);

      const backgroundFar = svgEl('g', { class: 'background-stars background-stars-far', 'aria-hidden': 'true' });
      const backgroundNear = svgEl('g', { class: 'background-stars background-stars-near', 'aria-hidden': 'true' });
      const backgroundStarCount = Math.max(84, Math.min(180, Math.round(width * height / 12000)));
      for (let index = 0; index < backgroundStarCount; index += 1) {
        const opacity = 0.07 + Math.random() * 0.2;
        const star = svgEl('circle', {
          cx: Math.random() * width,
          cy: Math.random() * height,
          r: 0.3 + Math.random() * (index % 4 === 0 ? 1.05 : 0.65),
          opacity,
          class: `background-star${reducedMotion ? '' : ' is-twinkling'}`,
          style: `--star-opacity:${opacity};--twinkle-duration:${3.5 + Math.random() * 5}s;--twinkle-delay:${-Math.random() * 6}s`
        });
        (index % 4 === 0 ? backgroundNear : backgroundFar).appendChild(star);
      }
      svg.append(backgroundFar, backgroundNear);

      configureOrbits();
      const outerOrbitRadius = Math.max(...[...orbitBodies.values()].map(body => body.radius));
      const galacticLayer = svgEl('g', { class: 'galactic-nebula', 'aria-hidden': 'true' });
      galacticLayer.appendChild(svgEl('ellipse', {
        cx: center.x,
        cy: center.y,
        rx: outerOrbitRadius * 0.48,
        ry: Math.max(18, outerOrbitRadius * 0.14 * orbitTilt),
        transform: `rotate(-12 ${center.x} ${center.y})`,
        class: 'galactic-core-haze'
      }));
      svg.appendChild(galacticLayer);

      const orbitLayer = svgEl('g', { class: 'system-orbits', 'aria-hidden': 'true' });
      orbitBodies.forEach(body => {
        orbitLayer.appendChild(svgEl('ellipse', { cx: center.x, cy: center.y, rx: body.radius, ry: body.radius * orbitTilt, class: 'system-orbit-ring' }));
      });
      orbitLayer.appendChild(svgEl('circle', { cx: center.x, cy: center.y, r: 3, class: 'system-barycenter' }));
      svg.appendChild(orbitLayer);

      const trailLayer = svgEl('g', { class: 'nebula-trails', 'aria-hidden': 'true' });
      labs.forEach(lab => {
        const body = orbitBodies.get(lab.id);
        const color = stellarColor(body.formationTime);
        const gradientId = `trail-gradient-${lab.id}`;
        const gradient = svgEl('linearGradient', { id: gradientId, gradientUnits: 'userSpaceOnUse' });
        gradient.append(
          svgEl('stop', { offset: '0%', 'stop-color': color, 'stop-opacity': '0' }),
          svgEl('stop', { offset: '42%', 'stop-color': color, 'stop-opacity': '.12' }),
          svgEl('stop', { offset: '82%', 'stop-color': color, 'stop-opacity': '.42' }),
          svgEl('stop', { offset: '100%', 'stop-color': color, 'stop-opacity': '.68' })
        );
        defs.appendChild(gradient);
        const fog = svgEl('path', { class: 'star-nebula-trail star-nebula-fog', stroke: `url(#${gradientId})` });
        const filament = svgEl('path', { class: 'star-nebula-trail star-nebula-filament', stroke: `url(#${gradientId})` });
        const span = 0.5 + body.radius / outerOrbitRadius * 0.42;
        const phaseOffset = (hash(`${lab.id}-wake`) % 628) / 100;
        nebulaTrails.set(lab.id, { fog, filament, gradient, span, phaseOffset });
        trailLayer.append(fog, filament);
      });
      svg.appendChild(trailLayer);

      labs.forEach(lab => {
        const funding = financing.get(lab.id);
        const radius = 4.5 + 9.5 * Math.sqrt(funding.totalRaised / maxRaised);
        const haloRadius = radius + 5 + 20 * Math.sqrt(funding.latestValuation / maxValuation);
        const body = orbitBodies.get(lab.id);
        const confidence = disclosureScore(lab);
        const outer = svgEl('g', {
          class: `star-point confidence-${confidence}${lab.id === selectedId ? ' is-selected' : ''}`,
          'data-lab': lab.id,
          style: `--star-color:${stellarColor(body.formationTime)}`
        });
        const starShape = svgEl('g');
        starShape.appendChild(svgEl('circle', { r: haloRadius, class: 'star-halo' }));
        starShape.appendChild(svgEl('circle', { r: radius, class: 'star-core' }));
        starShape.appendChild(svgEl('circle', { r: radius + 5, class: 'star-selection-ring' }));
        const labelOnLeft = Math.cos(body.angle) < 0;
        const label = svgEl('text', {
          x: labelOnLeft ? -(radius + 12) : radius + 12,
          y: -(radius + 8),
          'text-anchor': labelOnLeft ? 'end' : 'start',
          class: 'star-label'
        });
        label.textContent = lab.name;
        starShape.appendChild(label);
        outer.appendChild(starShape);
        const title = svgEl('title');
        title.textContent = `${lab.name}; formed ${lab.formation?.time || 'unknown'}; raised ${formatUsd(funding.totalRaised)}; latest valuation ${formatUsd(funding.latestValuation)}; ${disclosureLabel(lab).toLowerCase()} disclosure confidence`;
        outer.appendChild(title);
        outer.addEventListener('click', event => {
          event.stopPropagation();
          pinLab(lab.id);
        });
        outer.addEventListener('pointerenter', () => previewLab(lab.id));
        outer.addEventListener('pointerleave', () => {
          if (hoverStarId !== lab.id) return;
          hoverStarId = null;
          scheduleHoverClose();
        });
        starGroups.set(lab.id, outer);
        svg.appendChild(outer);
      });

      paintPositions();
      stage.dataset.view = 'orbits';
      if (!reducedMotion) motionFrame = window.requestAnimationFrame(stepMotion);
      if (detailOpen) window.requestAnimationFrame(positionDetail);
    }

    function clearHoverClose() {
      if (!hoverCloseTimer) return;
      window.clearTimeout(hoverCloseTimer);
      hoverCloseTimer = null;
    }

    function scheduleHoverClose() {
      clearHoverClose();
      if (detailMode !== 'hover') return;
      hoverCloseTimer = window.setTimeout(() => {
        hoverCloseTimer = null;
        if (detailMode !== 'hover' || hoverStarId || detailHovered) return;
        if (pinnedId) {
          detailMode = 'pinned';
          selectLab(pinnedId);
        } else closeDetail();
      }, 90);
    }

    function pinLab(id) {
      pinnedId = id;
      hoverStarId = null;
      detailMode = 'pinned';
      clearHoverClose();
      selectLab(id);
    }

    function previewLab(id) {
      hoverStarId = id;
      detailMode = 'hover';
      clearHoverClose();
      selectLab(id);
    }

    function renderMiniRadar(svg, lab) {
      const axes = Object.keys(architectureMetrics);
      const cx = 80;
      const cy = 46;
      const radius = 31;
      const point = (index, value, scale = 1) => {
        const angle = -Math.PI / 2 + index * Math.PI * 2 / axes.length;
        const distance = radius * scale * (value / 3);
        return `${cx + Math.cos(angle) * distance},${cy + Math.sin(angle) * distance}`;
      };
      const polygon = scale => axes.map((_, index) => point(index, 3, scale)).join(' ');
      svg.replaceChildren();
      [1 / 3, 2 / 3, 1].forEach(scale => {
        svg.appendChild(svgEl('polygon', { points: polygon(scale), class: 'mini-radar-grid' }));
      });
      svg.appendChild(svgEl('polygon', {
        points: axes.map((key, index) => point(index, analysisScore(lab, key))).join(' '),
        class: 'mini-radar-profile',
        style: `--mini-lab-color:${stellarColor(formationTimelineValue(lab))}`
      }));
      axes.forEach((key, index) => {
        const angle = -Math.PI / 2 + index * Math.PI * 2 / axes.length;
        svg.appendChild(svgEl('circle', {
          cx: cx + Math.cos(angle) * radius * (analysisScore(lab, key) / 3),
          cy: cy + Math.sin(angle) * radius * (analysisScore(lab, key) / 3),
          r: 1.7,
          class: 'mini-radar-point'
        }));
      });
    }

    function renderMiniTechWeb(svg, lab) {
      const graph = window.TECH_WEB_DATA;
      svg.replaceChildren();
      if (!graph?.labEdges?.[lab.id]) return;
      const layerIndex = new Map(graph.layers.map((layer, index) => [layer.id, index]));
      const nodeById = new Map(graph.nodes.map(node => [node.id, node]));
      const edges = graph.labEdges[lab.id];
      const usedNodes = [...new Set(edges.flat())].map(id => nodeById.get(id)).filter(Boolean);
      const positions = new Map();
      usedNodes.forEach(node => {
        const x = 12 + (layerIndex.get(node.layer) || 0) * 34;
        const sameLayer = usedNodes.filter(peer => peer.layer === node.layer);
        const y = 20 + sameLayer.indexOf(node) * Math.max(8, Math.min(14, 58 / Math.max(1, sameLayer.length - 1 || 1)));
        positions.set(node.id, { x, y: Math.min(76, y) });
      });
      for (let index = 0; index < graph.layers.length; index += 1) {
        const x = 12 + index * 34;
        svg.appendChild(svgEl('line', { x1: x, y1: 12, x2: x, y2: 78, class: 'mini-web-column' }));
      }
      edges.forEach(([from, to]) => {
        const start = positions.get(from);
        const end = positions.get(to);
        if (!start || !end) return;
        svg.appendChild(svgEl('line', { x1: start.x, y1: start.y, x2: end.x, y2: end.y, class: 'mini-web-edge' }));
      });
      usedNodes.forEach(node => {
        const position = positions.get(node.id);
        svg.appendChild(svgEl('circle', { cx: position.x, cy: position.y, r: node.unknown ? 2.1 : 2.8, class: `mini-web-node${node.unknown ? ' is-unknown' : ''}` }));
      });
    }

    function renderDetailMiniViews(lab) {
      const radarLink = query('#architecture-radar-link');
      radarLink.href = selectionHref('radar-profiles.html', ids, lab.id);
      renderMiniRadar(query('.mini-radar-svg'), lab);

      const techWebLink = query('#architecture-tech-web-link');
      techWebLink.href = selectionHref('tech-web.html', ids, lab.id);
      renderMiniTechWeb(query('.mini-tech-web-svg'), lab);
    }

    function renderDetailProfile(lab) {
      const profile = query('#architecture-profile');
      profile.replaceChildren();
      const funding = financing.get(lab.id);
      [
        ['Formation time', String(lab.formation?.time || 'Unknown')],
        ['Known raised', formatUsd(funding.totalRaised)],
        ['Latest valuation', formatUsd(funding.latestValuation)]
      ].forEach(([metricLabel, metricValue]) => {
        const metric = document.createElement('div');
        metric.className = 'star-metric';
        const label = document.createElement('span');
        label.textContent = metricLabel;
        const value = document.createElement('strong');
        value.textContent = metricValue;
        metric.append(label, value);
        profile.appendChild(metric);
      });
    }

    function renderDetailPeople(lab) {
      const people = query('#architecture-people');
      people.replaceChildren();
      const heading = document.createElement('h3');
      heading.textContent = 'Key people & experience';
      people.append(heading, renderPeopleList(lab));
    }

    function renderDetailFunding(lab) {
      const fundingTimeline = query('#architecture-funding');
      fundingTimeline.replaceChildren();
      const fundingTable = document.createElement('table');
      fundingTable.className = 'funding-table';
      fundingTable.innerHTML = '<caption>Funding history</caption><thead><tr><th scope="col">Time</th><th scope="col">Round</th><th scope="col">Raised</th><th scope="col">Valuation</th></tr></thead>';
      const fundingBody = document.createElement('tbody');
      [...(lab.fundingHistory || [])].sort((a, b) => b.date.localeCompare(a.date)).forEach(event => {
        const row = document.createElement('tr');
        const date = document.createElement('td');
        date.textContent = event.date.slice(0, 7).replace('-', '.');
        const round = document.createElement('td');
        round.textContent = event.round;
        const amount = document.createElement('td');
        amount.textContent = formatUsd(event.amountRaisedUsd);
        const valuation = document.createElement('td');
        valuation.textContent = event.valuationUsd ? formatUsd(event.valuationUsd) : 'Undisclosed';
        row.append(date, round, amount, valuation);
        fundingBody.appendChild(row);
      });
      fundingTable.appendChild(fundingBody);
      fundingTimeline.appendChild(fundingTable);
    }

    function selectLab(id) {
      selectedId = id;
      setActiveLab(id);
      starGroups.forEach((group, labId) => group.classList.toggle('is-selected', labId === id));
      const lab = labById.get(id);
      query('#architecture-confidence').textContent = `${disclosureLabel(lab)} disclosure confidence`;
      const nameLink = query('#architecture-name');
      nameLink.textContent = `${lab.name} ↗`;
      nameLink.href = lab.website;
      nameLink.setAttribute('aria-label', `Visit ${lab.name} website`);
      query('#architecture-note').textContent = lab.note;
      renderDetailMiniViews(lab);
      renderDetailProfile(lab);
      renderDetailPeople(lab);
      renderDetailFunding(lab);

      detail.hidden = false;
      detailOpen = true;
      window.requestAnimationFrame(() => {
        positionDetail();
        trackDetail();
      });
    }

    function positionDetail() {
      if (!detailOpen) return;
      const group = starGroups.get(selectedId);
      if (!group) return;
      const stageRect = stage.getBoundingClientRect();
      const pointRect = group.getBoundingClientRect();
      const detailRect = detail.getBoundingClientRect();
      const pointX = pointRect.left - stageRect.left + pointRect.width / 2;
      const pointY = pointRect.top - stageRect.top + pointRect.height / 2;
      const placeRight = pointX + detailRect.width + 36 < stageRect.width;
      const left = placeRight ? pointX + 24 : pointX - detailRect.width - 24;
      const chromeVisible = document.body.classList.contains('space-chrome-visible');
      const headerBottom = chromeVisible ? (spaceHeader?.getBoundingClientRect().bottom || stageRect.top) - stageRect.top + 10 : 12;
      const footerTops = chromeVisible
        ? [starLegend, spaceLastUpdated].filter(Boolean).map(part => part.getBoundingClientRect().top - stageRect.top - 10)
        : [];
      const footerTop = footerTops.length ? Math.min(...footerTops) : stageRect.height - 12;
      const maxTop = Math.max(12, footerTop - detailRect.height);
      const minTop = Math.min(Math.max(12, headerBottom), maxTop);
      detail.style.left = `${Math.max(12, Math.min(stageRect.width - detailRect.width - 12, left))}px`;
      detail.style.top = `${Math.max(minTop, Math.min(maxTop, pointY - detailRect.height * 0.36))}px`;
    }

    function trackDetail() {
      if (detailFrame) window.cancelAnimationFrame(detailFrame);
      const follow = () => {
        if (!detailOpen) return;
        positionDetail();
        detailFrame = window.requestAnimationFrame(follow);
      };
      detailFrame = window.requestAnimationFrame(follow);
    }

    function closeDetail() {
      clearHoverClose();
      detailOpen = false;
      detailMode = 'closed';
      pinnedId = null;
      hoverStarId = null;
      detailHovered = false;
      detail.hidden = true;
      if (detailFrame) window.cancelAnimationFrame(detailFrame);
      detailFrame = null;
    }

    window.addEventListener('resize', debounce(buildScene, 120));
    buildScene();
  }

  function initRadar() {
    const ids = readSelection();
    const labs = selectedLabs(ids);
    updateViewLinks(ids);
    const svg = query('#radar-svg');
    const tableBody = query('#radar-lab-table-body');
    const workspace = query('.radar-workspace');
    const tableWrap = query('.radar-table-wrap');
    const axisTooltip = createDelayedTooltip();
    query('#radar-cohort-label').textContent = `${labs.length} profiles shown`;
    const axes = Object.entries(architectureMetrics).map(([key, metric]) => ({
      key,
      label: metric.label,
      description: metric.description,
      direction: '0 · none / NA → 3 · high'
    }));
    const colors = [
      'var(--series-1)', 'var(--series-2)', 'var(--series-3)', 'var(--series-4)', 'var(--series-5)',
      'color-mix(in srgb, var(--series-1) 70%, var(--series-2))',
      'color-mix(in srgb, var(--series-2) 70%, var(--series-3))',
      'color-mix(in srgb, var(--series-3) 70%, var(--series-4))',
      'color-mix(in srgb, var(--series-4) 70%, var(--series-5))',
      'color-mix(in srgb, var(--series-5) 70%, var(--series-1))',
      'color-mix(in srgb, var(--primary) 55%, var(--series-3))',
      'color-mix(in srgb, var(--series-2) 55%, var(--series-5))',
      'color-mix(in srgb, var(--series-4) 55%, var(--series-1))'
    ];
    const initialFocus = readFocus(ids);
    let selectedId = labs.some(lab => lab.id === initialFocus) ? initialFocus : labs[0].id;
    let geometry;
    let selectedAxisIndex = 0;
    let axisTableExpanded = false;

    function colorFor(lab) { return colors[labs.findIndex(item => item.id === lab.id) % colors.length]; }
    function activateLab(id) {
      selectedId = id;
      setActiveLab(selectedId);
      updateSelection();
      updateAria();
    }
    function expandAxisTable(index, labId = null) {
      if (labId) {
        selectedId = labId;
        setActiveLab(selectedId);
      }
      selectedAxisIndex = index;
      axisTableExpanded = true;
      updateSelection();
      updateAria();
    }
    function collapseAxisTable() {
      axisTableExpanded = false;
      updateAxisTable();
      updateAria();
    }

    const headerRow = tableWrap.querySelector('thead tr');
    axes.forEach((axis, index) => {
      const header = document.createElement('th');
      header.scope = 'col';
      header.className = 'radar-axis-column';
      header.dataset.axis = String(index);
      header.textContent = axis.label;
      headerRow.appendChild(header);
    });

    labs.forEach(lab => {
      const row = document.createElement('tr');
      row.dataset.lab = lab.id;
      row.style.setProperty('--radar-color', colorFor(lab));
      const nameCell = document.createElement('th');
      nameCell.scope = 'row';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'radar-lab-button';
      const swatch = document.createElement('i');
      swatch.className = 'radar-swatch';
      swatch.setAttribute('aria-hidden', 'true');
      const name = document.createElement('span');
      name.textContent = shortLabName(lab);
      button.append(swatch, name);
      button.addEventListener('click', event => {
        event.stopPropagation();
        activateLab(lab.id);
      });
      const website = document.createElement('a');
      website.className = 'radar-name-website';
      website.href = lab.website;
      website.target = '_blank';
      website.rel = 'noopener noreferrer';
      website.setAttribute('aria-label', `Visit ${lab.name} website`);
      const linkSwatch = swatch.cloneNode(true);
      const linkName = document.createElement('span');
      linkName.className = 'radar-name-website-text';
      linkName.textContent = shortLabName(lab);
      website.append(linkSwatch, linkName);
      const arrow = document.createElement('span');
      arrow.className = 'radar-name-website-arrow';
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '↗';
      website.appendChild(arrow);
      nameCell.append(button, website);
      row.appendChild(nameCell);

      const noteCell = document.createElement('td');
      noteCell.className = 'radar-note';
      noteCell.dataset.label = 'Thesis';
      const keywordText = document.createElement('div');
      keywordText.className = 'radar-keywords-text';
      keywordText.textContent = Array.isArray(lab.keywords) && lab.keywords.length ? lab.keywords.join(', ') : lab.note;
      noteCell.appendChild(keywordText);
      const noteText = document.createElement('div');
      noteText.className = 'radar-note-text';
      noteText.textContent = lab.note;
      noteCell.appendChild(noteText);
      const noteCitations = document.createElement('div');
      noteCitations.className = 'radar-citations';
      renderCitations(noteCitations, insightIdsForLab(lab));
      noteCell.appendChild(noteCitations);
      row.appendChild(noteCell);
      axes.forEach((axis, index) => {
        const axisCell = document.createElement('td');
        axisCell.className = 'radar-axis-column';
        axisCell.dataset.axis = String(index);
        axisCell.dataset.label = axis.label;
        const score = document.createElement('strong');
        score.className = 'radar-axis-score';
        score.textContent = `${analysisScore(lab, axis.key)}/3`;
        const rationale = document.createElement('span');
        rationale.className = 'radar-axis-rationale';
        rationale.textContent = analysisRationale(lab, axis.key) || 'No public rationale';
        axisCell.append(score, rationale);
        row.appendChild(axisCell);
      });

      row.addEventListener('click', event => {
        if (!event.target.closest('a')) activateLab(lab.id);
      });
      tableBody.appendChild(row);
    });

    function valuesFor(lab) { return axes.map(axis => analysisScore(lab, axis.key)); }
    function pointFor(index, value, radius = geometry.radius) {
      const angle = -Math.PI / 2 + index * (Math.PI * 2 / axes.length);
      const r = radius * (value / 3);
      return { x: geometry.cx + Math.cos(angle) * r, y: geometry.cy + Math.sin(angle) * r };
    }
    function polygonPoints(values, radius = geometry.radius) {
      return values.map((value, index) => {
        const point = pointFor(index, value, radius);
        return `${point.x},${point.y}`;
      }).join(' ');
    }
    function addAxisLabel(index, axis, width, layer) {
      const labelWidth = Math.max(88, Math.min(148, axis.label.length * 7.2 + 22));
      const labelHeight = 24;
      let x, y;
      if (index === 0) { x = width / 2; y = 20; }
      else if (index === 1) { x = width - labelWidth / 2 - 10; y = geometry.cy - 76; }
      else if (index === 2) { x = width - labelWidth / 2 - 10; y = geometry.cy + 88; }
      else if (index === 3) { x = width / 2; y = geometry.height - 22; }
      else if (index === 4) { x = labelWidth / 2 + 10; y = geometry.cy + 88; }
      else { x = labelWidth / 2 + 10; y = geometry.cy - 76; }
      x = Math.max(labelWidth / 2 + 8, Math.min(width - labelWidth / 2 - 8, x));
      y = Math.max(labelHeight / 2 + 8, Math.min(geometry.height - labelHeight / 2 - 8, y));
      const label = svgEl('g', {
        transform: `translate(${x} ${y})`,
        class: 'radar-axis-label',
        role: 'button',
        'aria-label': `Show all axis scores and rationales; highlight ${axis.label}`
      });
      label.appendChild(svgEl('rect', { x: -labelWidth / 2, y: -labelHeight / 2, width: labelWidth, height: labelHeight, rx: 8, class: 'radar-axis-label-bg' }));
      const text = svgEl('text', { x: 0, y: 4, 'text-anchor': 'middle', class: 'radar-axis-label-text' });
      text.textContent = axis.label;
      label.appendChild(text);
      axisTooltip.bind(label, axis.description);
      label.addEventListener('click', event => {
        event.stopPropagation();
        expandAxisTable(index);
      });
      layer.appendChild(label);
    }
    function addAxisVertex(index, axis, point, layer) {
      const vertex = svgEl('g', {
        transform: `translate(${point.x} ${point.y})`,
        class: 'radar-axis-vertex',
        role: 'button',
        'aria-label': `Show all axis scores and rationales; highlight ${axis.label}`
      });
      vertex.appendChild(svgEl('circle', { cx: 0, cy: 0, r: 15, class: 'radar-axis-vertex-hit' }));
      vertex.appendChild(svgEl('circle', { cx: 0, cy: 0, r: 3.5, class: 'radar-axis-vertex-dot' }));
      axisTooltip.bind(vertex, axis.description);
      vertex.addEventListener('click', event => {
        event.stopPropagation();
        expandAxisTable(index);
      });
      layer.appendChild(vertex);
    }

    function buildChart() {
      const width = Math.max(300, Math.round(svg.getBoundingClientRect().width || 720));
      const height = width < 440 ? 360 : 420;
      geometry = { width, height, cx: width / 2, cy: height / 2 + 8, radius: Math.min(width < 440 ? width * .3 : width * .34, height * .35, 175) };
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      svg.setAttribute('height', height);
      svg.replaceChildren();
      buildRadarChart(width);
    }

    function buildRadarChart(width) {
      for (let score = 1; score <= 3; score += 1) {
        svg.appendChild(svgEl('polygon', { points: axes.map((axis, index) => { const point = pointFor(index, score); return `${point.x},${point.y}`; }).join(' '), class: 'radar-ring' }));
      }
      const labelLayer = svgEl('g', { class: 'radar-axis-labels' });
      const vertexLayer = svgEl('g', { class: 'radar-axis-vertices' });
      axes.forEach((axis, index) => {
        const end = pointFor(index, 3);
        svg.appendChild(svgEl('line', { x1: geometry.cx, y1: geometry.cy, x2: end.x, y2: end.y, class: 'radar-spoke' }));
        addAxisLabel(index, axis, width, labelLayer);
        addAxisVertex(index, axis, end, vertexLayer);
      });
      const profiles = svgEl('g', { id: 'radar-profiles' });
      const profileVertices = svgEl('g', { class: 'radar-profile-vertices' });
      labs.forEach(lab => {
        const labValues = valuesFor(lab);
        const profile = svgEl('polygon', {
          points: polygonPoints(labValues),
          class: `radar-lab-profile${lab.id === selectedId ? ' is-selected' : ''}`,
          'data-lab': lab.id,
          'aria-label': `${lab.name} radar profile`
        });
        profile.style.setProperty('--radar-color', colorFor(lab));
        profile.addEventListener('click', () => {
          activateLab(lab.id);
        });
        profiles.appendChild(profile);
        axes.forEach((axis, index) => {
          const score = labValues[index];
          const point = pointFor(index, score);
          const vertex = svgEl('circle', {
            cx: point.x,
            cy: point.y,
            r: 7,
            class: `radar-profile-vertex${lab.id === selectedId ? ' is-selected' : ''}`,
            'data-lab': lab.id,
            'data-axis': String(index),
            'aria-label': `Show all axis scores and rationales; ${lab.name} ${axis.label} score ${score}`
          });
          vertex.style.setProperty('--radar-color', colorFor(lab));
          axisTooltip.bind(vertex, axis.description);
          vertex.addEventListener('click', event => {
            event.stopPropagation();
            expandAxisTable(index, lab.id);
          });
          profileVertices.appendChild(vertex);
        });
      });
      svg.appendChild(profiles);
      svg.appendChild(profileVertices);
      svg.appendChild(vertexLayer);
      svg.appendChild(labelLayer);
      updateSelection();
    }

    function updateSelection() {
      svg.querySelectorAll('.radar-lab-profile').forEach(profile => {
        profile.classList.toggle('is-selected', profile.dataset.lab === selectedId);
      });
      svg.querySelectorAll('.radar-profile-vertex').forEach(vertex => {
        vertex.classList.toggle('is-selected', vertex.dataset.lab === selectedId);
      });
      tableBody.querySelectorAll('tr').forEach(row => {
        const isSelected = row.dataset.lab === selectedId;
        row.classList.toggle('is-selected', isSelected);
        row.querySelector('button').setAttribute('aria-pressed', String(isSelected));
      });
      query('#radar-selected-swatch').style.setProperty('--radar-color', colorFor(labById.get(selectedId)));
      query('#radar-selected-label').textContent = labById.get(selectedId).name;
      updateAxisTable();
    }

    function updateAxisTable() {
      workspace.classList.toggle('has-axis-table', axisTableExpanded);
      tableWrap.classList.toggle('is-axis-expanded', axisTableExpanded);
      tableWrap.querySelectorAll('.radar-axis-column').forEach(cell => {
        cell.classList.toggle('is-selected-axis', Number(cell.dataset.axis) === selectedAxisIndex);
      });
    }

    function updateAria() {
      const lab = labById.get(selectedId);
      const axis = axes[selectedAxisIndex] || axes[0];
      svg.setAttribute('aria-label', `Six-axis radar profiles for all ${labs.length} neolabs; highlighted profile: ${lab.name}${axisTableExpanded ? `; expanded score and rationale table with ${axis.label} highlighted` : ''}`);
    }

    const onResize = debounce(buildChart);
    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', event => {
      if (event.key === 'Escape' && axisTableExpanded) collapseAxisTable();
    });
    buildChart();
    updateAria();
  }

  function initTechWeb() {
    const ids = readSelection();
    const labs = selectedLabs(ids);
    updateViewLinks(ids);
    const svg = document.querySelector('#web-svg');
    const legend = document.querySelector('#web-legend');
    const panel = document.querySelector('#web-panel');
    const graph = window.TECH_WEB_DATA;
    if (!graph || !Array.isArray(graph.layers) || !Array.isArray(graph.nodes) || !graph.labEdges) {
      document.body.textContent = 'The tech-web graph data could not be loaded.';
      return;
    }
    const layers = graph.layers;
    const nodes = graph.nodes.map(node => ({ ...node }));
    const nodeById = new Map(nodes.map(node => [node.id, node]));
    const allEdges = labs.flatMap(lab => (graph.labEdges[lab.id] || []).map(([sourceId, targetId]) => ({
      lab,
      source: nodeById.get(sourceId),
      target: nodeById.get(targetId)
    })));
    const invalidEdge = allEdges.find(edge => !edge.source || !edge.target);
    if (invalidEdge || labs.some(lab => !(graph.labEdges[lab.id] || []).length)) {
      document.body.textContent = 'A projected lab edge is missing an endpoint.';
      return;
    }

    const colors = [
      'var(--series-1)', 'var(--series-2)', 'var(--series-3)', 'var(--series-4)', 'var(--series-5)',
      'color-mix(in srgb, var(--series-1) 70%, var(--series-2))',
      'color-mix(in srgb, var(--series-2) 70%, var(--series-3))',
      'color-mix(in srgb, var(--series-3) 70%, var(--series-4))',
      'color-mix(in srgb, var(--series-4) 70%, var(--series-5))',
      'color-mix(in srgb, var(--series-5) 70%, var(--series-1))',
      'color-mix(in srgb, var(--primary) 55%, var(--series-3))',
      'color-mix(in srgb, var(--series-2) 55%, var(--series-5))'
    ];
    const colorFor = lab => colors[labs.findIndex(item => item.id === lab.id) % colors.length];
    const COL_WIDTH = 216;
    const COLUMN_GAP = 104;
    const TOP = 116;
    const ROW_GAP = 64;
    const NODE_HEIGHT = 42;
    const SIDE = 34;
    const maxCount = Math.max(...layers.map(layer => nodes.filter(node => node.layer === layer.id).length));
    const nodeGroups = new Map();
    const edgeGroup = svgEl('g');
    const requestedFocus = new URLSearchParams(window.location.search).get('focus');
    let selectedLabId = labs.some(lab => lab.id === requestedFocus) ? requestedFocus : null;
    let selectedNodeId = null;
    let hoveredNodeId = null;

    layers.forEach((layer, layerIndex) => {
      const members = nodes.filter(node => node.layer === layer.id);
      const x = SIDE + layerIndex * (COL_WIDTH + COLUMN_GAP);
      const offset = (maxCount - members.length) * ROW_GAP / 2;
      members.forEach((node, nodeIndex) => {
        node.x = x;
        node.y = TOP + offset + nodeIndex * ROW_GAP;
        node.layerIndex = layerIndex;
      });
    });
    const width = SIDE * 2 + layers.length * COL_WIDTH + (layers.length - 1) * COLUMN_GAP;
    const height = TOP + maxCount * ROW_GAP + 28;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);

    function textLines(value, maxLength = 25) {
      const lines = [];
      let line = '';
      value.split(/\s+/).forEach(word => {
        const next = line ? `${line} ${word}` : word;
        if (next.length > maxLength && line) {
          lines.push(line);
          line = word;
        } else line = next;
      });
      if (line) lines.push(line);
      return lines.slice(0, 2);
    }

    function addText(parent, value, x, y, className, maxLength) {
      const lines = maxLength ? textLines(value, maxLength) : [value];
      const text = svgEl('text', { x, y: lines.length === 1 ? y + 4 : y - 3, class: className });
      lines.forEach((line, index) => {
        const span = svgEl('tspan', { x, dy: index === 0 ? 0 : '1.15em' });
        span.textContent = line;
        text.appendChild(span);
      });
      parent.appendChild(text);
    }

    layers.forEach((layer, index) => {
      const x = SIDE + index * (COL_WIDTH + COLUMN_GAP);
      const number = svgEl('text', { x, y: 30, class: 'web-layer-number-svg' });
      number.textContent = `LAYER ${layer.number}`;
      svg.appendChild(number);
      svg.appendChild(svgEl('line', { x1: x + 64, y1: 26, x2: x + COL_WIDTH, y2: 26, class: 'web-layer-line-svg' }));
      const heading = svgEl('text', { x, y: 51, class: 'web-layer-heading-svg' });
      heading.textContent = layer.id === 'implication' ? 'Implication' : layer.label;
      svg.appendChild(heading);
      const subheading = svgEl('text', { x, y: 70, class: 'web-layer-subheading-svg' });
      subheading.textContent = layer.sublabel || '';
      svg.appendChild(subheading);
    });

    const outgoing = new Map();
    const incoming = new Map();
    allEdges.forEach(edge => {
      if (!outgoing.has(edge.source.id)) outgoing.set(edge.source.id, []);
      if (!incoming.has(edge.target.id)) incoming.set(edge.target.id, []);
      outgoing.get(edge.source.id).push(edge);
      incoming.get(edge.target.id).push(edge);
    });
    function assignPorts(groups, direction) {
      groups.forEach((edges, nodeId) => {
        edges.sort((a, b) => {
          const one = direction === 'out' ? a.target : a.source;
          const two = direction === 'out' ? b.target : b.source;
          return one.y - two.y || a.lab.name.localeCompare(b.lab.name);
        });
        const node = nodeById.get(nodeId);
        const pad = 8;
        edges.forEach((edge, index) => {
          const fraction = edges.length === 1 ? .5 : pad / NODE_HEIGHT + (1 - 2 * pad / NODE_HEIGHT) * index / (edges.length - 1);
          if (direction === 'out') edge.sourceY = node.y + fraction * NODE_HEIGHT;
          else edge.targetY = node.y + fraction * NODE_HEIGHT;
        });
      });
    }
    assignPorts(outgoing, 'out');
    assignPorts(incoming, 'in');

    svg.appendChild(edgeGroup);
    allEdges.forEach(edge => {
      const startX = edge.source.x + COL_WIDTH;
      const endX = edge.target.x;
      const sameLayer = edge.source.layer === edge.target.layer;
      const middle = (endX - startX) * .46;
      const path = svgEl('path', {
        d: sameLayer
          ? `M ${startX} ${edge.source.y + NODE_HEIGHT / 2} C ${startX + 56} ${edge.source.y + NODE_HEIGHT / 2}, ${startX + 56} ${edge.target.y + NODE_HEIGHT / 2}, ${startX} ${edge.target.y + NODE_HEIGHT / 2}`
          : `M ${startX} ${edge.sourceY} C ${startX + middle} ${edge.sourceY}, ${endX - middle} ${edge.targetY}, ${endX} ${edge.targetY}`,
        class: 'web-route-edge is-base',
        stroke: colorFor(edge.lab),
        'data-lab': edge.lab.id
      });
      edge.path = path;
      edgeGroup.appendChild(path);
    });

    layers.forEach(layer => {
      nodes.filter(node => node.layer === layer.id).forEach(node => {
        const group = svgEl('g', {
          class: `web-route-node${node.unknown ? ' is-unknown' : ''}`,
          role: 'button',
          'aria-label': `Trace upstream and downstream routes for ${node.label}`,
          'data-node-id': node.id
        });
        group.appendChild(svgEl('rect', { x: node.x, y: node.y, width: COL_WIDTH, height: NODE_HEIGHT, rx: 8 }));
        addText(group, node.label, node.x + 13, node.y + NODE_HEIGHT / 2, 'web-route-node-label', 27);
        group.addEventListener('mouseenter', () => {
          hoveredNodeId = node.id;
          paint(selectedLabId, node.id, false);
        });
        group.addEventListener('mouseleave', () => {
          hoveredNodeId = null;
          paint(selectedLabId, selectedNodeId, false);
        });
        group.addEventListener('click', () => selectNode(node.id));
        svg.appendChild(group);
        nodeGroups.set(node.id, group);
      });
    });

    function edgesForLab(labId) {
      return allEdges.filter(edge => edge.lab.id === labId);
    }

    function nodeIdsForLab(labId) {
      return new Set(edgesForLab(labId).flatMap(edge => [edge.source.id, edge.target.id]));
    }

    function traceNode(nodeId) {
      const upstream = new Set();
      const downstream = new Set();
      const walk = (startId, routes, visited) => {
        const queue = [startId];
        while (queue.length) {
          const currentId = queue.shift();
          (routes.get(currentId) || []).forEach(edge => {
            const nextId = routes === incoming ? edge.source.id : edge.target.id;
            if (!visited.has(nextId)) {
              visited.add(nextId);
              queue.push(nextId);
            }
          });
        }
      };
      walk(nodeId, incoming, upstream);
      walk(nodeId, outgoing, downstream);
      return { upstream, downstream, connected: new Set([nodeId, ...upstream, ...downstream]) };
    }

    function paint(activeLabId, activeNodeId, animate) {
      const activeNodes = new Set();
      const nodeTrace = activeNodeId ? traceNode(activeNodeId) : null;
      if (nodeTrace) {
        nodeTrace.connected.forEach(nodeId => activeNodes.add(nodeId));
      } else if (activeLabId) {
        nodeIdsForLab(activeLabId).forEach(nodeId => activeNodes.add(nodeId));
      }
      allEdges.forEach(edge => {
        const edgeInTrace = nodeTrace && nodeTrace.connected.has(edge.source.id) && nodeTrace.connected.has(edge.target.id);
        edge.path.setAttribute('class', !activeLabId && !nodeTrace
          ? 'web-route-edge is-base'
          : nodeTrace
            ? edgeInTrace ? `web-route-edge is-lit is-node-route${animate ? ' is-animated' : ''}` : 'web-route-edge is-faded'
            : edge.lab.id === activeLabId
            ? `web-route-edge is-lit${animate ? ' is-animated' : ''}`
            : 'web-route-edge is-faded');
      });
      nodeGroups.forEach((group, nodeId) => {
        const node = nodeById.get(nodeId);
        const isActive = activeNodes.has(nodeId);
        const isSelected = nodeTrace && nodeId === activeNodeId;
        group.setAttribute('class', `web-route-node${node.unknown ? ' is-unknown' : ''}${activeLabId || nodeTrace ? isActive ? ' is-lit' : ' is-dim' : ''}${isSelected ? ' is-selected' : ''}`);
      });
      if (nodeTrace) {
        allEdges.filter(edge => edgeInTrace(edge, nodeTrace)).forEach(edge => edgeGroup.appendChild(edge.path));
      } else if (activeLabId) allEdges.filter(edge => edge.lab.id === activeLabId).forEach(edge => edgeGroup.appendChild(edge.path));
    }

    function edgeInTrace(edge, trace) {
      return trace.connected.has(edge.source.id) && trace.connected.has(edge.target.id);
    }

    function appendPanelHeader(titleText, tagText, color) {
      const row = document.createElement('div');
      row.className = 'web-panel-title-row';
      const swatch = document.createElement('span');
      swatch.className = 'web-panel-swatch';
      swatch.style.setProperty('--lab-color', color || 'var(--primary)');
      const title = document.createElement('h2');
      title.textContent = titleText;
      const tag = document.createElement('span');
      tag.className = 'web-panel-tag';
      tag.textContent = tagText;
      row.append(swatch, title, tag);
      panel.appendChild(row);
    }

    function appendParagraph(text) {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      return paragraph;
    }

    function labsForNode(nodeId) {
      return labs.filter(lab => (graph.labEdges[lab.id] || []).some(([sourceId, targetId]) => sourceId === nodeId || targetId === nodeId));
    }

    function renderPanel() {
      panel.replaceChildren();
      if (selectedNodeId) {
        const node = nodeById.get(selectedNodeId);
        appendPanelHeader(node.label, 'node explainer', 'var(--primary)');
        panel.appendChild(appendParagraph(graph.nodeExplainers?.[node.id] || 'This node marks a projected station in the technology route.'));
        const routeLabs = document.createElement('div');
        routeLabs.className = 'web-node-labs';
        labsForNode(node.id).slice().sort(compareLabsByFormation).forEach(lab => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'web-lab-chip';
          button.dataset.lab = lab.id;
          button.style.setProperty('--lab-color', colorFor(lab));
          button.setAttribute('aria-label', `Trace ${lab.name}`);
          button.setAttribute('aria-pressed', 'false');
          const dot = document.createElement('span');
          dot.className = 'web-lab-chip-dot';
          const label = document.createElement('span');
          label.textContent = shortLabName(lab);
          button.append(dot, label);
          button.addEventListener('click', () => selectLab(lab.id));
          routeLabs.appendChild(button);
        });
        panel.appendChild(routeLabs);
        return;
      }
      if (!selectedLabId) {
        appendPanelHeader('All lines', 'reading the full map', 'var(--primary)');
        const first = appendParagraph('The map narrows as it moves right. Labs spread across many data and architecture choices, but routes converge on a smaller set of deployment surfaces and consequences. Differentiation is concentrated in the first three layers; implications are often shared.');
        const second = appendParagraph('Watch the learning-loop layer. Static pretrain-and-release systems share the field with bets on customization, world-model planning, open-ended evolution, recursive improvement, and test-time search. That is where the most consequential technical divergence sits.');
        const footer = document.createElement('div');
        footer.className = 'web-panel-scores';
        footer.textContent = 'Select a lab to isolate its commentary and sources.';
        panel.append(first, second, footer);
        return;
      }
      const lab = labById.get(selectedLabId);
      appendPanelHeader(lab.name, graph.labMeta?.[lab.id]?.tag || 'projected technology route', colorFor(lab));
      const commentary = [appendParagraph(lab.note)];
      if (graph.labNarratives?.[lab.id]) commentary.push(appendParagraph(graph.labNarratives[lab.id]));
      const sources = document.createElement('div');
      sources.className = 'web-panel-sources';
      renderCitations(sources, insightIdsForLab(lab), 'Sources');
      panel.append(...commentary, sources);
    }

    const allButton = document.createElement('button');
    allButton.type = 'button';
    allButton.className = 'web-lab-chip is-reset';
    allButton.textContent = 'All lines';
    allButton.addEventListener('click', () => selectLab(null));
    legend.appendChild(allButton);
    labs.slice().sort(compareLabsByFormation).forEach(lab => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'web-lab-chip';
      button.dataset.lab = lab.id;
      button.style.setProperty('--lab-color', colorFor(lab));
      const dot = document.createElement('span');
      dot.className = 'web-lab-chip-dot';
      const label = document.createElement('span');
      label.textContent = shortLabName(lab);
      button.setAttribute('aria-label', `Trace ${lab.name}`);
      button.append(dot, label);
      button.addEventListener('click', () => selectLab(selectedLabId === lab.id ? null : lab.id));
      button.addEventListener('mouseenter', () => { if (!selectedLabId) paint(lab.id, false); });
      button.addEventListener('mouseleave', () => { if (!selectedLabId) paint(null, false); });
      legend.appendChild(button);
    });

    function selectLab(labId) {
      selectedLabId = labId;
      selectedNodeId = null;
      hoveredNodeId = null;
      if (labId) setActiveLab(labId);
      else {
        const params = new URLSearchParams(window.location.search);
        params.delete('focus');
        const next = `${window.location.pathname}${params.size ? `?${params}` : ''}${window.location.hash}`;
        window.history.replaceState(null, '', next);
        updateViewLinks(ids, null);
      }
      document.body.classList.toggle('has-web-selection', Boolean(labId));
      legend.querySelectorAll('.web-lab-chip').forEach(button => {
        button.setAttribute('aria-pressed', String(button.dataset.lab === labId || (!labId && button === allButton)));
      });
      paint(labId, null, true);
      renderPanel();
    }

    function selectNode(nodeId) {
      selectedNodeId = selectedNodeId === nodeId ? null : nodeId;
      selectedLabId = null;
      hoveredNodeId = null;
      const params = new URLSearchParams(window.location.search);
      params.delete('focus');
      const next = `${window.location.pathname}${params.size ? `?${params}` : ''}${window.location.hash}`;
      window.history.replaceState(null, '', next);
      updateViewLinks(ids, null);
      document.body.classList.toggle('has-web-selection', Boolean(selectedNodeId));
      legend.querySelectorAll('.web-lab-chip').forEach(button => {
        button.setAttribute('aria-pressed', String(!selectedNodeId && button === allButton));
      });
      paint(null, selectedNodeId, true);
      renderPanel();
    }

    selectLab(selectedLabId);
  }

  stripDeprecatedSelectionParam();
  renderLastUpdated();

  if (page === 'space') initArchitecture();
  else if (page === 'radar') initRadar();
  else if (page === 'tech-web') initTechWeb();
})();
