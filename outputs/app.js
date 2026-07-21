(() => {
  'use strict';

  const dataset = window.NEOLABS_DATA;
  if (!dataset || !Array.isArray(dataset.labs)) {
    document.body.textContent = 'The shared neolab dataset could not be loaded.';
    return;
  }

  function compareLabsByFormation(a, b) {
    const aYear = Number.isFinite(a.formation?.year) ? a.formation.year : -Infinity;
    const bYear = Number.isFinite(b.formation?.year) ? b.formation.year : -Infinity;
    return bYear - aYear || a.name.localeCompare(b.name);
  }

  const allLabs = dataset.labs.slice().sort(compareLabsByFormation);
  const labById = new Map(allLabs.map(lab => [lab.id, lab]));
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
    if (target.includes('space.html') && page === 'space') {
      const current = new URLSearchParams(window.location.search);
      ['x', 'y'].forEach(key => {
        if (current.has(key)) params.set(key, current.get(key));
      });
    }
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

  function initIndex() {
    const ids = allLabs.map(lab => lab.id);
    const focusId = readFocus(ids);
    writeFocus(focusId, { updateUrl: false });
    updateViewLinks(ids, focusId);
  }

  const architectureMetrics = Object.fromEntries(Object.entries(dataset.schema?.analysisAxes || {}).map(([key, metric]) => [key, {
    label: metric.label,
    low: metric.low,
    high: metric.high,
    description: metric.hoverText
  }]));
  function initArchitecture() {
    const ids = readSelection();
    const labs = selectedLabs(ids);
    updateViewLinks(ids);
    const svg = document.querySelector('.architecture-svg');
    const stage = document.querySelector('#architecture-stage');
    const detail = document.querySelector('#architecture-detail');
    const detailClose = document.querySelector('#architecture-detail-close');
    const axisSelects = { x: null, y: null };
    const axisTooltip = createDelayedTooltip();
    const starLegend = document.querySelector('.star-legend');
    const initialFocus = readFocus(ids);
    let selectedId = labs.some(lab => lab.id === initialFocus) ? initialFocus : labs[0].id;
    let axisConfig = { x: 'readiness', y: 'capability' };
    let width = 0;
    let height = 0;
    let detailOpen = false;
    let detailMode = 'closed';
    let pinnedId = null;
    let hoverStarId = null;
    let detailHovered = false;
    let hoverCloseTimer = null;
    let animationFrame = null;
    let clusterFrame = null;
    let activeClusters = new Map();
    let detailFrame = null;
    let currentPositions = new Map();
    const starGroups = new Map();
    const starRadii = new Map();
    let axisLabels = null;
    let clusterIndicators = null;
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const legacyViews = {
      market: { x: 'readiness', y: 'capability' },
      learning: { x: 'adaptivity', y: 'dataEfficiency' },
      resources: { x: 'dataEfficiency', y: 'computeEfficiency' }
    };
    const metricKeys = Object.keys(architectureMetrics);
    axisConfig = readArchitectureAxes();
    if (new URLSearchParams(window.location.search).has('view')) writeArchitectureAxes(axisConfig);
    const financing = new Map(labs.map(lab => [lab.id, fundingSummary(lab)]));
    const maxRaised = Math.max(1, ...[...financing.values()].map(item => item.totalRaised));
    const maxValuation = Math.max(1, ...[...financing.values()].map(item => item.latestValuation));

    function bindAxisSelect(axis, select) {
      axisSelects[axis] = select;
      metricKeys.forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = architectureMetrics[key].label;
        select.appendChild(option);
      });
      select.value = axisConfig[axis];
      select.addEventListener('change', () => {
        const nextConfig = normalizeAxisConfig({
          ...axisConfig,
          [axis]: select.value
        }, axis);
        syncAxisSelects(nextConfig);
        if (nextConfig.x === axisConfig.x && nextConfig.y === axisConfig.y) return;
        transitionAxes(nextConfig);
      });
    }

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
      if (event.target === svg) closeDetail();
    });
    window.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || !detailOpen) return;
      closeDetail();
    });

    function normalizeAxisConfig(config, changedAxis = 'x') {
      const fallback = { x: 'readiness', y: 'capability' };
      const next = {
        x: metricKeys.includes(config.x) ? config.x : fallback.x,
        y: metricKeys.includes(config.y) ? config.y : fallback.y
      };
      if (next.x !== next.y) return next;
      const axisToChange = changedAxis === 'x' ? 'y' : 'x';
      next[axisToChange] = metricKeys.find(key => key !== next[changedAxis]) || fallback[axisToChange];
      return next;
    }

    function readArchitectureAxes() {
      const params = new URLSearchParams(window.location.search);
      const legacyView = params.get('view');
      const legacyConfig = legacyViews[legacyView] || {};
      return normalizeAxisConfig({
        x: params.get('x') || legacyConfig.x || 'readiness',
        y: params.get('y') || legacyConfig.y || 'capability'
      });
    }

    function writeArchitectureAxes(nextConfig) {
      const params = new URLSearchParams(window.location.search);
      params.delete('view');
      params.set('x', nextConfig.x);
      params.set('y', nextConfig.y);
      const query = params.toString();
      const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
      window.history.replaceState(null, '', nextUrl);
    }

    function syncAxisSelects(nextConfig) {
      Object.entries(axisSelects).forEach(([axis, select]) => {
        if (!select) return;
        select.value = nextConfig[axis];
        select.removeAttribute('title');
        [...select.options].forEach(option => {
          option.disabled = option.value === nextConfig[axis === 'x' ? 'y' : 'x'];
        });
      });
    }

    function axisSelectControl(axis, attrs) {
      const foreignObject = svgEl('foreignObject', {
        ...attrs,
        class: `axis-select-foreign axis-select-foreign-${axis}`
      });
      const label = document.createElement('label');
      label.className = `axis-select-control axis-select-control-${axis}`;
      const select = document.createElement('select');
      select.className = 'axis-select';
      select.dataset.axisSelect = axis;
      select.setAttribute('aria-label', axis === 'x' ? 'X axis metric' : 'Y axis metric');
      label.appendChild(select);
      foreignObject.appendChild(label);
      bindAxisSelect(axis, select);
      axisTooltip.bind(foreignObject, () => architectureMetrics[axisConfig[axis]].description);
      axisTooltip.bind(select, () => architectureMetrics[axisConfig[axis]].description);
      return foreignObject;
    }

    function hash(text) {
      let value = 2166136261;
      for (let index = 0; index < text.length; index += 1) {
        value ^= text.charCodeAt(index);
        value = Math.imul(value, 16777619);
      }
      return value >>> 0;
    }

    function stellarColor(year) {
      const years = labs.map(lab => lab.formation?.year).filter(Number.isFinite);
      const newest = Math.max(...years);
      const oldest = Math.min(...years);
      const progress = newest === oldest ? 0 : Math.max(0, Math.min(1, (newest - year) / (newest - oldest)));
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

    function axialPlotBounds() {
      return width < 680
        ? { left: 104, right: 58, top: 78, bottom: 112 }
        : { left: 126, right: 88, top: 86, bottom: 118 };
    }

    function axialPositions(config) {
      const positions = new Map();
      const bounds = axialPlotBounds();
      const plotWidth = Math.max(1, width - bounds.left - bounds.right);
      const plotHeight = Math.max(1, height - bounds.top - bounds.bottom);
      labs.forEach(lab => {
        positions.set(lab.id, {
          x: bounds.left + (analysisScore(lab, config.x) / 3) * plotWidth,
          y: height - bounds.bottom - (analysisScore(lab, config.y) / 3) * plotHeight
        });
      });
      return positions;
    }

    function clusterFor(id) {
      const lab = labById.get(id);
      const xScore = analysisScore(lab, axisConfig.x);
      const yScore = analysisScore(lab, axisConfig.y);
      const key = `${axisConfig.x}:${axisConfig.y}:${xScore}|${yScore}`;
      const idsAtPoint = labs
        .filter(peer => analysisScore(peer, axisConfig.x) === xScore && analysisScore(peer, axisConfig.y) === yScore)
        .map(peer => peer.id)
        .sort((a, b) => a.localeCompare(b));
      return idsAtPoint.length > 1 ? { key, ids: idsAtPoint } : null;
    }

    function clustersForCurrentAxes() {
      const clusters = new Map();
      labs.forEach(lab => {
        const cluster = clusterFor(lab.id);
        if (cluster) clusters.set(cluster.key, cluster);
      });
      return [...clusters.values()];
    }

    function createClusterState(cluster, now) {
      const base = axialPositions(axisConfig).get(cluster.ids[0]);
      const collisionRadius = Math.max(...cluster.ids.map(peerId => starRadii.get(peerId) || 16));
      const spacing = collisionRadius * 2 + 8;
      const orbitRadius = Math.max(28, spacing / (2 * Math.sin(Math.PI / cluster.ids.length)));
      const margin = orbitRadius + collisionRadius + 10;
      const center = {
        x: Math.max(margin, Math.min(width - margin, base.x)),
        y: Math.max(margin, Math.min(height - margin, base.y))
      };
      const particles = new Map();
      cluster.ids.forEach((peerId, index) => {
        const angle = index * Math.PI * 2 / cluster.ids.length + (hash(cluster.key) % 360) * Math.PI / 180;
        const current = currentPositions.get(peerId) || base;
        const initialRadius = Math.max(0.5, Math.hypot(current.x - center.x, current.y - center.y));
        particles.set(peerId, {
          x: current.x + Math.cos(angle) * 0.5,
          y: current.y + Math.sin(angle) * 0.5,
          vx: -Math.sin(angle) * initialRadius * 0.14,
          vy: Math.cos(angle) * initialRadius * 0.14,
          angle,
          radius: starRadii.get(peerId) || collisionRadius,
          mass: 0.7 + (starRadii.get(peerId) || collisionRadius) / 24
        });
        starGroups.get(peerId)?.classList.add('is-cluster-member');
      });
      return {
        ...cluster,
        base,
        center,
        particles,
        orbitRadius,
        started: now,
        last: now,
        frozen: false,
        phase: 'expanding'
      };
    }

    function updateClusterFreezeState() {
      activeClusters.forEach(cluster => {
        cluster.frozen = detailOpen && cluster.ids.includes(selectedId);
        cluster.indicator?.classList.toggle('is-frozen', cluster.frozen);
      });
    }

    function renderClusterIndicators() {
      if (!clusterIndicators) return;
      clusterIndicators.replaceChildren();
      activeClusters.forEach(cluster => {
        const orbit = svgEl('g', { class: `cluster-orbit${cluster.frozen ? ' is-frozen' : ''}`, 'aria-hidden': 'true' });
        orbit.appendChild(svgEl('circle', { cx: cluster.center.x, cy: cluster.center.y, r: cluster.orbitRadius, class: 'cluster-orbit-ring' }));
        orbit.appendChild(svgEl('circle', { cx: cluster.center.x, cy: cluster.center.y, r: cluster.orbitRadius, class: 'cluster-orbit-sweep' }));
        cluster.indicator = orbit;
        clusterIndicators.appendChild(orbit);
      });
    }

    function startClusterMotion() {
      stopClusterMotion(false);
      const clusters = clustersForCurrentAxes();
      if (!clusters.length || stage.classList.contains('is-transitioning')) return;
      const now = performance.now();
      activeClusters = new Map(clusters.map(cluster => [cluster.key, createClusterState(cluster, now)]));
      updateClusterFreezeState();
      renderClusterIndicators();

      if (reducedMotion) {
        activeClusters.forEach(cluster => {
          cluster.ids.forEach(peerId => {
            const particle = cluster.particles.get(peerId);
            const position = {
              x: cluster.center.x + Math.cos(particle.angle) * cluster.orbitRadius,
              y: cluster.center.y + Math.sin(particle.angle) * cluster.orbitRadius
            };
            currentPositions.set(peerId, position);
            starGroups.get(peerId)?.setAttribute('transform', `translate(${position.x} ${position.y})`);
          });
          cluster.phase = 'orbiting';
        });
        return;
      }
      clusterFrame = window.requestAnimationFrame(stepClusterMotion);
    }

    function stepClusterMotion(now) {
      if (!activeClusters.size) return;
      activeClusters.forEach(activeCluster => {
        stepSingleCluster(activeCluster, now);
      });
      if (detailOpen) positionDetail();
      clusterFrame = window.requestAnimationFrame(stepClusterMotion);
    }

    function stepSingleCluster(activeCluster, now) {
      if (activeCluster.frozen) {
        activeCluster.last = now;
        return;
      }
      const dt = Math.min(0.032, Math.max(0.008, (now - activeCluster.last) / 1000));
      activeCluster.last = now;
      const elapsed = now - activeCluster.started;
      const expansion = Math.min(1, elapsed / 820);
      const easedExpansion = 1 - Math.pow(1 - expansion, 3);
      const desiredRadius = activeCluster.orbitRadius * easedExpansion;
      const centerProgress = easedExpansion;
      const dynamicCenter = {
        x: activeCluster.base.x + (activeCluster.center.x - activeCluster.base.x) * centerProgress,
        y: activeCluster.base.y + (activeCluster.center.y - activeCluster.base.y) * centerProgress
      };
      const particles = [...activeCluster.particles.values()];
      const accelerations = particles.map(() => ({ x: 0, y: 0 }));
      const angularSpeed = 0.13;

      particles.forEach((particle, index) => {
        const dx = particle.x - dynamicCenter.x;
        const dy = particle.y - dynamicCenter.y;
        const radius = Math.max(0.001, Math.hypot(dx, dy));
        const radialX = dx / radius;
        const radialY = dy / radius;
        const radialVelocity = particle.vx * radialX + particle.vy * radialY;
        const tangentVelocity = particle.vx * -radialY + particle.vy * radialX;
        const radialAcceleration = (desiredRadius - radius) * 9 - radialVelocity * 4;
        const tangentAcceleration = (angularSpeed * desiredRadius - tangentVelocity) * 1.8;
        accelerations[index].x += radialX * radialAcceleration - radialY * tangentAcceleration;
        accelerations[index].y += radialY * radialAcceleration + radialX * tangentAcceleration;
      });

      for (let a = 0; a < particles.length; a += 1) {
        for (let b = a + 1; b < particles.length; b += 1) {
          const dx = particles[b].x - particles[a].x;
          const dy = particles[b].y - particles[a].y;
          const distanceSquared = dx * dx + dy * dy + 144;
          const distance = Math.sqrt(distanceSquared);
          const gravity = 900 / distanceSquared;
          accelerations[a].x += dx / distance * gravity * particles[b].mass;
          accelerations[a].y += dy / distance * gravity * particles[b].mass;
          accelerations[b].x -= dx / distance * gravity * particles[a].mass;
          accelerations[b].y -= dy / distance * gravity * particles[a].mass;
        }
      }

      particles.forEach((particle, index) => {
        particle.vx += accelerations[index].x * dt;
        particle.vy += accelerations[index].y * dt;
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
      });

      for (let iteration = 0; iteration < 8; iteration += 1) {
        for (let a = 0; a < particles.length; a += 1) {
          for (let b = a + 1; b < particles.length; b += 1) {
            const dx = particles[b].x - particles[a].x;
            const dy = particles[b].y - particles[a].y;
            const distance = Math.max(0.001, Math.hypot(dx, dy));
            const minimum = (particles[a].radius + particles[b].radius + 6) * easedExpansion;
            if (distance >= minimum) continue;
            const correction = (minimum - distance) / 2;
            const nx = dx / distance;
            const ny = dy / distance;
            particles[a].x -= nx * correction;
            particles[a].y -= ny * correction;
            particles[b].x += nx * correction;
            particles[b].y += ny * correction;
          }
        }
      }

      activeCluster.ids.forEach(id => {
        const particle = activeCluster.particles.get(id);
        const position = { x: particle.x, y: particle.y };
        currentPositions.set(id, position);
        starGroups.get(id)?.setAttribute('transform', `translate(${position.x} ${position.y})`);
      });
      if (expansion >= 1) activeCluster.phase = 'orbiting';
    }

    function stopClusterMotion(resetToBase) {
      if (clusterFrame) window.cancelAnimationFrame(clusterFrame);
      clusterFrame = null;
      activeClusters.forEach(activeCluster => {
        activeCluster.ids.forEach(id => {
          starGroups.get(id)?.classList.remove('is-cluster-member');
          if (!resetToBase) return;
          currentPositions.set(id, { ...activeCluster.base });
          starGroups.get(id)?.setAttribute('transform', `translate(${activeCluster.base.x} ${activeCluster.base.y})`);
        });
      });
      activeClusters = new Map();
      if (clusterIndicators) clusterIndicators.replaceChildren();
    }

    function positionsFor(config) {
      return axialPositions(config);
    }

    function setAxisLabels(config) {
      axisLabels.classList.add('is-visible');
      starLegend.hidden = false;
      syncAxisSelects(config);
    }

    function buildScene() {
      stopClusterMotion(false);
      width = Math.max(320, Math.round(stage.getBoundingClientRect().width || 1000));
      height = width < 700 ? 560 : Math.max(580, Math.min(740, window.innerHeight * 0.68));
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      svg.setAttribute('height', height);
      svg.setAttribute('aria-label', 'All neolabs shown as a drifting architecture constellation');
      svg.replaceChildren();
      starGroups.clear();
      starRadii.clear();
      axisSelects.x = null;
      axisSelects.y = null;

      const defs = svgEl('defs');
      const gas = svgEl('filter', { id: 'star-gas', x: '-100%', y: '-100%', width: '300%', height: '300%' });
      gas.appendChild(svgEl('feGaussianBlur', { stdDeviation: 2.4 }));
      const glow = svgEl('filter', { id: 'star-glow', x: '-100%', y: '-100%', width: '300%', height: '300%' });
      glow.appendChild(svgEl('feGaussianBlur', { stdDeviation: 4.5, result: 'blur' }));
      const merge = svgEl('feMerge');
      merge.append(svgEl('feMergeNode', { in: 'blur' }), svgEl('feMergeNode', { in: 'SourceGraphic' }));
      glow.appendChild(merge);
      defs.append(gas, glow);
      svg.appendChild(defs);

      const initialPositions = positionsFor(axisConfig);
      const backgroundStars = svgEl('g', { class: 'background-stars', 'aria-hidden': 'true' });
      for (let index = 0; index < 84; index += 1) {
        let x; let y; let attempts = 0;
        do {
          x = Math.random() * width;
          y = Math.random() * height;
          attempts += 1;
        } while (attempts < 6 && [...initialPositions.values()].some(position => Math.hypot(position.x - x, position.y - y) < 42));
        backgroundStars.appendChild(svgEl('circle', {
          cx: x,
          cy: y,
          r: 0.3 + Math.random() * 0.75,
          opacity: 0.07 + Math.random() * 0.2,
          class: 'background-star'
        }));
      }
      svg.appendChild(backgroundStars);

      clusterIndicators = svgEl('g', { class: 'cluster-orbits', 'aria-hidden': 'true' });
      svg.appendChild(clusterIndicators);

      axisLabels = svgEl('g', { class: 'axis-endpoints' });

      const xAxis = svgEl('g', { class: 'axis-guide axis-guide-x' });
      axisTooltip.bind(xAxis, () => architectureMetrics[axisConfig.x].description);
      xAxis.appendChild(axisSelectControl('x', { x: width / 2 - 110, y: height - 79, width: 220, height: 42 }));
      xAxis.appendChild(svgEl('path', { d: `M ${width / 2 - 110} ${height - 40.5} L ${width / 2 + 110} ${height - 43.5} L ${width / 2 + 110} ${height - 34.5} L ${width / 2 - 110} ${height - 37.5} Z`, class: 'axis-ramp' }));
      xAxis.appendChild(svgEl('text', { x: width / 2 - 120, y: height - 32, 'text-anchor': 'end', class: 'axis-endpoint' }));
      xAxis.lastChild.textContent = '0 · None / NA';
      xAxis.appendChild(svgEl('text', { x: width / 2 + 120, y: height - 32, 'text-anchor': 'start', class: 'axis-endpoint' }));
      xAxis.lastChild.textContent = '3 · High';
      axisLabels.appendChild(xAxis);

      const yAxis = svgEl('g', { class: 'axis-guide axis-guide-y', transform: `translate(55 ${height / 2}) rotate(-90)` });
      axisTooltip.bind(yAxis, () => architectureMetrics[axisConfig.y].description);
      yAxis.appendChild(axisSelectControl('y', { x: -110, y: -54, width: 220, height: 42 }));
      yAxis.appendChild(svgEl('path', { d: 'M -110 -1.5 L 110 -4.5 L 110 4.5 L -110 1.5 Z', class: 'axis-ramp' }));
      yAxis.appendChild(svgEl('text', { x: -120, y: 13, 'text-anchor': 'end', class: 'axis-endpoint' }));
      yAxis.lastChild.textContent = '0 · None / NA';
      yAxis.appendChild(svgEl('text', { x: 120, y: 13, 'text-anchor': 'start', class: 'axis-endpoint' }));
      yAxis.lastChild.textContent = '3 · High';
      axisLabels.appendChild(yAxis);
      svg.appendChild(axisLabels);

      labs.forEach((lab, index) => {
        const funding = financing.get(lab.id);
        const radius = 4.5 + 9.5 * Math.sqrt(funding.totalRaised / maxRaised);
        const haloRadius = radius + 5 + 20 * Math.sqrt(funding.latestValuation / maxValuation);
        const confidence = disclosureScore(lab);
        starRadii.set(lab.id, haloRadius + 3);
        const outer = svgEl('g', {
          class: `star-point confidence-${confidence}${lab.id === selectedId ? ' is-selected' : ''}`,
          'data-lab': lab.id,
          style: `--star-color:${stellarColor(lab.formation?.year || 2026)};--drift-x:${((hash(lab.id) % 13) - 6)}px;--drift-y:${((hash(`${lab.id}-y`) % 13) - 6)}px;--drift-duration:${7 + index % 5}s;--drift-delay:${-(index % 7)}s`
        });
        const drift = svgEl('g', { class: 'star-drift' });
        drift.appendChild(svgEl('circle', { r: haloRadius, class: 'star-halo' }));
        drift.appendChild(svgEl('circle', { r: radius, class: 'star-core' }));
        drift.appendChild(svgEl('circle', { r: radius + 5, class: 'star-selection-ring' }));
        const label = svgEl('text', { x: 0, y: -(radius + 12), 'text-anchor': 'middle', class: 'star-label' });
        label.textContent = lab.name;
        drift.appendChild(label);
        outer.appendChild(drift);
        const starTitle = svgEl('title');
        starTitle.textContent = `${lab.name}; formed ${lab.formation?.year || 'unknown'}; raised ${formatUsd(funding.totalRaised)}; latest valuation ${formatUsd(funding.latestValuation)}; ${disclosureLabel(lab).toLowerCase()} disclosure confidence`;
        outer.appendChild(starTitle);
        outer.addEventListener('click', event => {
          event.stopPropagation();
          pinLab(lab.id);
        });
        outer.addEventListener('pointerenter', () => {
          previewLab(lab.id);
        });
        outer.addEventListener('pointerleave', () => {
          if (hoverStarId !== lab.id) return;
          hoverStarId = null;
          scheduleHoverClose();
        });
        starGroups.set(lab.id, outer);
        svg.appendChild(outer);
      });

      currentPositions = initialPositions;
      currentPositions.forEach((position, id) => starGroups.get(id).setAttribute('transform', `translate(${position.x} ${position.y})`));
      stage.dataset.view = 'axes';
      setAxisLabels(axisConfig);
      startClusterMotion();
      if (detailOpen) window.requestAnimationFrame(positionDetail);
    }

    function transitionAxes(nextConfig) {
      stopClusterMotion(false);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      const start = new Map([...currentPositions].map(([id, position]) => [id, { ...position }]));
      const target = positionsFor(nextConfig);
      const started = performance.now();
      const duration = reducedMotion ? 0 : 980;
      axisConfig = nextConfig;
      writeArchitectureAxes(nextConfig);
      updateViewLinks(ids, selectedId);
      stage.dataset.view = 'axes';
      stage.classList.add('is-transitioning');
      setAxisLabels(nextConfig);
      const ease = value => 1 - Math.pow(1 - value, 4);
      const step = now => {
        const progress = duration ? Math.min(1, (now - started) / duration) : 1;
        const eased = ease(progress);
        const arc = Math.sin(progress * Math.PI);
        labs.forEach(lab => {
          const from = start.get(lab.id);
          const to = target.get(lab.id);
          const direction = hash(lab.id) % 2 ? 1 : -1;
          const position = {
            x: from.x + (to.x - from.x) * eased + direction * arc * Math.min(34, width * 0.025),
            y: from.y + (to.y - from.y) * eased - arc * 18
          };
          currentPositions.set(lab.id, position);
          starGroups.get(lab.id).setAttribute('transform', `translate(${position.x} ${position.y})`);
        });
        if (detailOpen) positionDetail();
        if (progress < 1) animationFrame = window.requestAnimationFrame(step);
        else {
          currentPositions = target;
          stage.classList.remove('is-transitioning');
          animationFrame = null;
          startClusterMotion();
          if (detailOpen) positionDetail();
        }
      };
      animationFrame = window.requestAnimationFrame(step);
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
        } else {
          closeDetail();
        }
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

    function selectLab(id) {
      selectedId = id;
      setActiveLab(id);
      starGroups.forEach((group, labId) => group.classList.toggle('is-selected', labId === id));
      const lab = labById.get(id);
      query('#architecture-confidence').textContent = `${disclosureLabel(lab)} disclosure confidence`;
      query('#architecture-name').textContent = lab.name;
      query('#architecture-note').textContent = lab.note;
      const website = query('#architecture-website');
      website.href = lab.website;
      website.setAttribute('aria-label', `Visit ${lab.name} website`);
      renderCitations(query('#architecture-citations'), insightIdsForLab(lab));
      const profile = query('#architecture-profile');
      profile.replaceChildren();
      const funding = financing.get(lab.id);
      [
        ['Formed', String(lab.formation?.year || 'Unknown')],
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
      const fundingTimeline = query('#architecture-funding');
      fundingTimeline.replaceChildren();
      const fundingHeading = document.createElement('strong');
      fundingHeading.className = 'funding-heading';
      fundingHeading.textContent = 'Funding progression';
      fundingTimeline.appendChild(fundingHeading);
      const fundingList = document.createElement('div');
      fundingList.className = 'funding-list';
      [...(lab.fundingHistory || [])].sort((a, b) => a.date.localeCompare(b.date)).forEach(event => {
        const row = document.createElement('div');
        row.className = 'funding-event';
        const date = document.createElement('span');
        date.className = 'funding-date';
        date.textContent = event.date.slice(0, 4);
        const round = document.createElement('span');
        round.className = 'funding-round';
        round.textContent = event.round;
        const amount = document.createElement('strong');
        amount.textContent = formatUsd(event.amountRaisedUsd);
        const valuation = document.createElement('span');
        valuation.className = 'funding-valuation';
        valuation.textContent = event.valuationUsd ? `${formatUsd(event.valuationUsd)} valuation` : 'valuation undisclosed';
        row.append(date, round, amount, valuation);
        fundingList.appendChild(row);
      });
      fundingTimeline.appendChild(fundingList);
      Object.keys(architectureMetrics).forEach(key => {
        const metric = document.createElement('div');
        metric.className = 'star-metric';
        const label = document.createElement('span');
        label.textContent = architectureMetrics[key].label;
        const value = document.createElement('strong');
        value.textContent = `${analysisScore(lab, key)}/3`;
        value.title = analysisScoreLabel(lab, key);
        metric.setAttribute('aria-label', `${architectureMetrics[key].label}: ${analysisScoreLabel(lab, key)}`);
        metric.append(label, value);
        profile.appendChild(metric);
      });
      detail.hidden = false;
      detailOpen = true;
      updateClusterFreezeState();
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
      detail.style.left = `${Math.max(12, Math.min(stageRect.width - detailRect.width - 12, left))}px`;
      detail.style.top = `${Math.max(12, Math.min(stageRect.height - detailRect.height - 12, pointY - detailRect.height * 0.36))}px`;
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
      updateClusterFreezeState();
      if (detailFrame) window.cancelAnimationFrame(detailFrame);
      detailFrame = null;
    }

    const onResize = debounce(() => buildScene(), 120);
    window.addEventListener('resize', onResize);
    buildScene();
  }

  function initRadar() {
    const ids = readSelection();
    const labs = selectedLabs(ids);
    updateViewLinks(ids);
    const svg = query('#radar-svg');
    const tableBody = query('#radar-lab-table-body');
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
    let chartMode = 'radar';
    let selectedAxisIndex = 0;

    function colorFor(lab) { return colors[labs.findIndex(item => item.id === lab.id) % colors.length]; }
    function activateLab(id) {
      selectedId = id;
      setActiveLab(selectedId);
      updateSelection();
      updateAria();
    }
    function activateAxis(index) {
      selectedAxisIndex = index;
      chartMode = 'rank';
      buildChart();
      updateAria();
    }
    function activateLabAxis(id, index) {
      selectedId = id;
      setActiveLab(selectedId);
      activateAxis(index);
    }
    function showRadar() {
      chartMode = 'radar';
      buildChart();
      updateAria();
    }

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
      name.textContent = lab.name;
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
      linkName.textContent = lab.name;
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

      const peopleCell = document.createElement('td');
      peopleCell.dataset.label = 'Key people';
      const peopleList = document.createElement('ul');
      peopleList.className = 'radar-people';
      lab.keyPeople.forEach(person => {
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
        experience.textContent = person.pastExperiences.join(' · ');
        item.append(heading, experience);
        peopleList.appendChild(item);
      });
      peopleCell.appendChild(peopleList);
      row.appendChild(peopleCell);

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
    function truncatedLabel(value, maxLength) {
      return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;
    }
    function rankLabsForAxis(axis) {
      return labs.slice().sort((a, b) => {
        const scoreDelta = analysisScore(b, axis.key) - analysisScore(a, axis.key);
        return scoreDelta || compareLabsByFormation(a, b);
      });
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
        'aria-label': `Rank labs by ${axis.label}`
      });
      label.appendChild(svgEl('rect', { x: -labelWidth / 2, y: -labelHeight / 2, width: labelWidth, height: labelHeight, rx: 8, class: 'radar-axis-label-bg' }));
      const text = svgEl('text', { x: 0, y: 4, 'text-anchor': 'middle', class: 'radar-axis-label-text' });
      text.textContent = axis.label;
      label.appendChild(text);
      axisTooltip.bind(label, axis.description);
      label.addEventListener('click', event => {
        event.stopPropagation();
        activateAxis(index);
      });
      layer.appendChild(label);
    }
    function addAxisVertex(index, axis, point, layer) {
      const vertex = svgEl('g', {
        transform: `translate(${point.x} ${point.y})`,
        class: 'radar-axis-vertex',
        role: 'button',
        'aria-label': `Rank labs by ${axis.label}`
      });
      vertex.appendChild(svgEl('circle', { cx: 0, cy: 0, r: 15, class: 'radar-axis-vertex-hit' }));
      vertex.appendChild(svgEl('circle', { cx: 0, cy: 0, r: 3.5, class: 'radar-axis-vertex-dot' }));
      axisTooltip.bind(vertex, axis.description);
      vertex.addEventListener('click', event => {
        event.stopPropagation();
        activateAxis(index);
      });
      layer.appendChild(vertex);
    }

    function buildChart() {
      const width = Math.max(300, Math.round(svg.getBoundingClientRect().width || 720));
      const height = chartMode === 'rank' ? Math.max(width < 440 ? 390 : 420, 104 + labs.length * 26) : (width < 440 ? 360 : 420);
      geometry = { width, height, cx: width / 2, cy: height / 2 + 8, radius: Math.min(width < 440 ? width * .3 : width * .34, height * .35, 175) };
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      svg.setAttribute('height', height);
      svg.replaceChildren();
      if (chartMode === 'rank') {
        buildRankChart(width, height);
        return;
      }
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
            'aria-label': `Rank labs by ${axis.label}; ${lab.name} score ${score}`
          });
          vertex.style.setProperty('--radar-color', colorFor(lab));
          axisTooltip.bind(vertex, axis.description);
          vertex.addEventListener('click', event => {
            event.stopPropagation();
            activateLabAxis(lab.id, index);
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

    function buildRankChart(width, height) {
      const axis = axes[selectedAxisIndex] || axes[0];
      const rankedLabs = rankLabsForAxis(axis);
      const margin = width < 440 ? 10 : 14;
      const top = 58;
      const headerHeight = 28;
      const rowHeight = 24;
      const labColumnWidth = width < 440 ? 88 : 134;
      const scoreColumnWidth = Math.max(24, (width - margin * 2 - labColumnWidth) / axes.length);
      const tableWidth = labColumnWidth + scoreColumnWidth * axes.length;
      const heading = svgEl('text', { x: margin + labColumnWidth, y: 24, class: 'radar-rank-heading' });
      heading.textContent = `${axis.label} rank order`;
      svg.appendChild(heading);
      const subheading = svgEl('text', { x: margin + labColumnWidth, y: 43, class: 'radar-rank-subheading' });
      subheading.textContent = 'Rows sorted by highlighted axis';
      svg.appendChild(subheading);

      const back = svgEl('g', { transform: `translate(${margin + 28} 28)`, class: 'radar-rank-back', role: 'button', 'aria-label': 'Return to radar profile view' });
      const backTitle = svgEl('title');
      backTitle.textContent = 'Return to radar profile view';
      back.appendChild(backTitle);
      back.appendChild(svgEl('rect', { x: -28, y: -14, width: 56, height: 28, rx: 8, class: 'radar-rank-back-bg' }));
      const backText = svgEl('text', { x: 0, y: 4, 'text-anchor': 'middle', class: 'radar-rank-back-text' });
      backText.textContent = 'Radar';
      back.appendChild(backText);
      back.addEventListener('click', event => {
        event.stopPropagation();
        showRadar();
      });
      svg.appendChild(back);

      svg.appendChild(svgEl('rect', { x: margin, y: top, width: tableWidth, height: headerHeight + rankedLabs.length * rowHeight, rx: 8, class: 'radar-rank-table-bg' }));
      svg.appendChild(svgEl('rect', { x: margin + labColumnWidth + selectedAxisIndex * scoreColumnWidth, y: top, width: scoreColumnWidth, height: headerHeight + rankedLabs.length * rowHeight, class: 'radar-rank-selected-column' }));
      svg.appendChild(svgEl('line', { x1: margin, y1: top + headerHeight, x2: margin + tableWidth, y2: top + headerHeight, class: 'radar-rank-grid-line' }));
      axes.forEach((metric, index) => {
        const x = margin + labColumnWidth + index * scoreColumnWidth;
        if (index > 0) svg.appendChild(svgEl('line', { x1: x, y1: top, x2: x, y2: top + headerHeight + rankedLabs.length * rowHeight, class: 'radar-rank-grid-line' }));
        const header = svgEl('g', {
          transform: `translate(${x} ${top})`,
          class: `radar-rank-column-header${index === selectedAxisIndex ? ' is-selected-axis' : ''}`,
          role: 'button',
          'aria-label': `Sort rank table by ${metric.label}`
        });
        axisTooltip.bind(header, metric.description);
        header.appendChild(svgEl('rect', { x: 0, y: 0, width: scoreColumnWidth, height: headerHeight, class: 'radar-rank-header-hit' }));
        const text = svgEl('text', { x: scoreColumnWidth / 2, y: 18, 'text-anchor': 'middle', class: 'radar-rank-header-text' });
        text.textContent = width < 440 ? metric.label.slice(0, 1) : metric.label.split(/\s+/).map(word => word[0]).join('');
        header.appendChild(text);
        header.addEventListener('click', event => {
          event.stopPropagation();
          selectedAxisIndex = index;
          buildChart();
          updateAria();
        });
        svg.appendChild(header);
      });

      rankedLabs.forEach((lab, rowIndex) => {
        const y = top + headerHeight + rowIndex * rowHeight;
        const row = svgEl('g', {
          transform: `translate(${margin} ${y})`,
          class: `radar-rank-row${lab.id === selectedId ? ' is-selected' : ''}`,
          'data-lab': lab.id,
          'aria-label': `${lab.name}; ${axis.label} ${analysisScoreLabel(lab, axis.key)}`
        });
        row.style.setProperty('--radar-color', colorFor(lab));
        row.appendChild(svgEl('rect', { x: 0, y: 0, width: tableWidth, height: rowHeight, class: 'radar-rank-row-bg' }));
        const swatch = svgEl('circle', { cx: 9, cy: rowHeight / 2, r: 3.4, class: 'radar-rank-row-swatch' });
        row.appendChild(swatch);
        const label = svgEl('text', { x: 18, y: rowHeight / 2 + 4, class: 'radar-rank-label' });
        label.textContent = truncatedLabel(width < 440 ? lab.code : lab.name, width < 440 ? 8 : 18);
        row.appendChild(label);
        axes.forEach((metric, colIndex) => {
          const x = labColumnWidth + colIndex * scoreColumnWidth;
          const cell = svgEl('g', {
            transform: `translate(${x} 0)`,
            class: `radar-rank-cell${colIndex === selectedAxisIndex ? ' is-selected-axis' : ''}`,
            'aria-label': `${metric.label}: ${analysisScoreLabel(lab, metric.key)}`
          });
          axisTooltip.bind(cell, metric.description);
          cell.appendChild(svgEl('rect', { x: 0, y: 0, width: scoreColumnWidth, height: rowHeight, class: 'radar-rank-cell-hit' }));
          const scoreText = svgEl('text', { x: scoreColumnWidth / 2, y: rowHeight / 2 + 4, 'text-anchor': 'middle', class: 'radar-rank-cell-text' });
          scoreText.textContent = String(analysisScore(lab, metric.key));
          cell.appendChild(scoreText);
          cell.addEventListener('click', event => {
            event.stopPropagation();
            selectedAxisIndex = colIndex;
            activateLab(lab.id);
            buildChart();
            updateAria();
          });
          row.appendChild(cell);
        });
        row.addEventListener('click', () => {
          activateLab(lab.id);
        });
        svg.appendChild(row);
      });
      updateSelection();
    }

    function updateSelection() {
      svg.querySelectorAll('.radar-lab-profile').forEach(profile => {
        profile.classList.toggle('is-selected', profile.dataset.lab === selectedId);
      });
      svg.querySelectorAll('.radar-profile-vertex').forEach(vertex => {
        vertex.classList.toggle('is-selected', vertex.dataset.lab === selectedId);
      });
      svg.querySelectorAll('.radar-rank-row').forEach(row => {
        row.classList.toggle('is-selected', row.dataset.lab === selectedId);
      });
      tableBody.querySelectorAll('tr').forEach(row => {
        const isSelected = row.dataset.lab === selectedId;
        row.classList.toggle('is-selected', isSelected);
        row.querySelector('button').setAttribute('aria-pressed', String(isSelected));
      });
      query('#radar-selected-swatch').style.setProperty('--radar-color', colorFor(labById.get(selectedId)));
      query('#radar-selected-label').textContent = labById.get(selectedId).name;
    }

    function updateAria() {
      const lab = labById.get(selectedId);
      const axis = axes[selectedAxisIndex] || axes[0];
      svg.setAttribute('aria-label', chartMode === 'rank'
        ? `${axis.label} rank order for all ${labs.length} neolabs; highlighted profile: ${lab.name}`
        : `Six-axis radar profiles for all ${labs.length} neolabs; highlighted profile: ${lab.name}`);
    }

    const onResize = debounce(buildChart);
    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', event => {
      if (event.key === 'Escape' && chartMode === 'rank') showRadar();
    });
    buildChart();
    updateAria();
  }

  function initTechWeb() {
    const ids = readSelection();
    const labs = selectedLabs(ids);
    updateViewLinks(ids);
    const svg = document.querySelector('#web-svg');
    const select = document.querySelector('#web-focus');
    const showUnmappedToggle = document.querySelector('#web-show-unmapped');
    const graph = window.TECH_WEB_DATA;
    if (!graph || !Array.isArray(graph.nodes) || !Array.isArray(graph.edges)) {
      document.body.textContent = 'The tech-web graph data could not be loaded.';
      return;
    }
    const layers = graph.layers;
    const nodes = graph.nodes.map(node => ({ ...node }));
    const edges = graph.edges.map((edge, index) => ({ id: `e${index}`, source: edge[0], target: edge[1], type: edge[2] || 'forward' }));
    const nodeById = new Map(nodes.map(node => [node.id, node]));
    const forwardEdges = edges.filter(edge => edge.type === 'forward');
    let positions = new Map();
    let showUnmapped = Boolean(showUnmappedToggle?.checked);
    const initialFocus = readFocus(ids);
    let focus = { type: 'lab', id: labs.some(lab => lab.id === initialFocus) ? initialFocus : labs[0].id };

    function futuresForLab(lab) {
      const path = new Set(lab.path);
      return [...new Set(forwardEdges.filter(edge => path.has(edge.source) && nodeById.get(edge.target).layer === 'future').map(edge => edge.target))];
    }
    function labUsesNode(lab, nodeId) { return lab.path.includes(nodeId) || futuresForLab(lab).includes(nodeId); }
    nodes.forEach(node => { node.count = labs.filter(lab => labUsesNode(lab, node.id)).length; });
    function visibleNodes() {
      return showUnmapped ? nodes : nodes.filter(node => node.count > 0);
    }
    function visibleNodeIds() {
      return new Set(visibleNodes().map(node => node.id));
    }

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Select a lab to trace…';
    placeholder.disabled = true;
    select.appendChild(placeholder);
    const labGroup = document.createElement('optgroup');
    labGroup.label = 'All labs';
    labs.slice().sort(compareLabsByFormation).forEach(lab => {
      const option = document.createElement('option');
      option.value = lab.id;
      option.textContent = lab.name;
      option.selected = lab.id === focus.id;
      labGroup.appendChild(option);
    });
    select.appendChild(labGroup);
    select.addEventListener('change', () => {
      if (!select.value) return;
      focus = { type: 'lab', id: select.value };
      setActiveLab(focus.id);
      render();
    });
    showUnmappedToggle?.addEventListener('change', () => {
      showUnmapped = showUnmappedToggle.checked;
      render();
    });

    function activeState(target = focus) {
      const activeNodes = new Set();
      const activeEdges = new Set();
      if (target.type === 'lab') {
        const lab = labById.get(target.id);
        lab.path.forEach(id => activeNodes.add(id));
        futuresForLab(lab).forEach(id => activeNodes.add(id));
        edges.forEach(edge => {
          const bothMapped = lab.path.includes(edge.source) && lab.path.includes(edge.target);
          const directFuture = lab.path.includes(edge.source) && activeNodes.has(edge.target) && nodeById.get(edge.target).layer === 'future';
          const feedback = edge.type === 'feedback' && lab.path.includes(edge.source) && lab.path.includes(edge.target);
          if (bothMapped || directFuture || feedback) activeEdges.add(edge.id);
        });
        return { activeNodes, activeEdges, focusNode: null };
      }
      activeNodes.add(target.id);
      const walk = (start, direction) => {
        const queue = [start];
        while (queue.length) {
          const current = queue.shift();
          forwardEdges.forEach(edge => {
            const next = direction === 'down' && edge.source === current ? edge.target : direction === 'up' && edge.target === current ? edge.source : null;
            if (next && !activeNodes.has(next)) { activeNodes.add(next); queue.push(next); }
          });
        }
      };
      walk(target.id, 'up');
      walk(target.id, 'down');
      edges.forEach(edge => { if (activeNodes.has(edge.source) && activeNodes.has(edge.target)) activeEdges.add(edge.id); });
      return { activeNodes, activeEdges, focusNode: target.id };
    }

    function layout(width) {
      const nodeH = 46;
      const padding = 16;
      const gap = width >= 720 ? 6 : 10;
      const headers = [];
      positions = new Map();
      let cursorY = 20;
      layers.forEach(layer => {
        const members = visibleNodes().filter(node => node.layer === layer.id);
        if (!members.length) return;
        const columns = Math.min(width >= 720 ? members.length : width >= 520 ? 4 : 2, members.length);
        const rows = Math.ceil(members.length / columns);
        headers.push({ layer, x: padding, y: cursorY });
        if (width >= 720) {
          const available = width - padding * 2 - gap * (members.length - 1);
          const specs = members.map(node => ({
            node,
            desired: Math.min(128, Math.max(76, node.label.length * 5.2 + 18)),
            minimum: 64
          }));
          const desiredTotal = specs.reduce((sum, spec) => sum + spec.desired, 0);
          const minimumTotal = specs.reduce((sum, spec) => sum + spec.minimum, 0);
          const ratio = desiredTotal > available ? Math.max(0, Math.min(1, (available - minimumTotal) / Math.max(1, desiredTotal - minimumTotal))) : 1;
          const minimumScale = minimumTotal > available ? available / minimumTotal : 1;
          const widths = specs.map(spec => minimumScale < 1 ? spec.minimum * minimumScale : spec.minimum + (spec.desired - spec.minimum) * ratio);
          const used = widths.reduce((sum, value) => sum + value, 0);
          let cursorX = padding + Math.max(0, (available - used) / 2);
          specs.forEach((spec, index) => {
            const nodeW = widths[index];
            positions.set(spec.node.id, { x: cursorX + nodeW / 2, y: cursorY + 28 + nodeH / 2, w: nodeW, h: nodeH, compact: false, singleLine: false });
            cursorX += nodeW + gap;
          });
        } else {
          const nodeW = (width - padding * 2 - gap * (columns - 1)) / columns;
          members.forEach((node, index) => {
            const column = index % columns;
            const row = Math.floor(index / columns);
            positions.set(node.id, { x: padding + nodeW / 2 + column * (nodeW + gap), y: cursorY + 28 + nodeH / 2 + row * (nodeH + gap), w: nodeW, h: nodeH, compact: false, singleLine: false });
          });
        }
        cursorY += 28 + rows * (nodeH + gap) + 30;
      });
      return { width, height: cursorY - 8, headers };
    }

    function edgePath(edge, info) {
      const source = positions.get(edge.source);
      const target = positions.get(edge.target);
      if (edge.type === 'feedback') return `M ${source.x + source.w / 2} ${source.y} C ${info.width - 6} ${source.y}, ${info.width - 6} ${target.y}, ${target.x + target.w / 2} ${target.y}`;
      const sy = source.y + source.h / 2;
      const ty = target.y - target.h / 2;
      const middle = (sy + ty) / 2;
      return `M ${source.x} ${sy} C ${source.x} ${middle}, ${target.x} ${middle}, ${target.x} ${ty}`;
    }

    function wrapLabel(label, width) {
      const maxChars = Math.max(7, Math.floor((width - 18) / 6.2));
      if (label.length <= maxChars) return [label];
      const lines = [''];
      const words = label.trim().split(/\s+/);
      let truncated = false;
      words.forEach(word => {
        if (truncated) return;
        const index = lines.length - 1;
        const candidate = lines[index] ? `${lines[index]} ${word}` : word;
        if (candidate.length <= maxChars || !lines[index]) {
          lines[index] = candidate;
          return;
        }
        if (lines.length < 2) {
          lines.push(word);
          return;
        }
        const ellipsis = `${lines[index]}…`;
        lines[index] = ellipsis.length <= maxChars ? ellipsis : lines[index];
        truncated = true;
      });
      return lines.filter(Boolean);
    }

    function applyVisualState(state) {
      svg.querySelectorAll('[data-edge]').forEach(path => {
        const active = state.activeEdges.has(path.dataset.edge);
        path.classList.toggle('is-active', active);
        path.setAttribute('marker-end', `url(#${active ? 'web-arrow-active' : 'web-arrow-neutral'})`);
      });
      svg.querySelectorAll('[data-node]').forEach(group => {
        const id = group.dataset.node;
        group.classList.toggle('is-active', state.activeNodes.has(id));
        group.classList.toggle('is-focus', state.focusNode === id);
      });
    }

    function previewNode(nodeId) {
      const target = { type: 'tech', id: nodeId };
      applyVisualState(activeState(target));
      updateDetail(target);
    }

    function restoreFocus() {
      applyVisualState(activeState());
      updateDetail();
    }

    function render() {
      const width = Math.max(300, Math.round(svg.getBoundingClientRect().width || 720));
      const state = activeState();
      const info = layout(width);
      svg.setAttribute('viewBox', `0 0 ${info.width} ${info.height}`);
      svg.setAttribute('height', info.height);
      svg.replaceChildren();
      const title = svgEl('title');
      title.textContent = 'Technology dependency web for selected general-intelligence neolabs';
      svg.appendChild(title);
      const defs = svgEl('defs');
      [['web-arrow-neutral', 'var(--muted)'], ['web-arrow-active', 'var(--primary)']].forEach(([id, fill]) => {
        const marker = svgEl('marker', { id, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 5, markerHeight: 5, orient: 'auto-start-reverse' });
        marker.appendChild(svgEl('path', { d: 'M 0 0 L 10 5 L 0 10 z', fill }));
        defs.appendChild(marker);
      });
      svg.appendChild(defs);
      const drawableNodeIds = visibleNodeIds();
      edges.filter(edge => drawableNodeIds.has(edge.source) && drawableNodeIds.has(edge.target)).forEach(edge => {
        const active = state.activeEdges.has(edge.id);
        svg.appendChild(svgEl('path', { d: edgePath(edge, info), class: `web-edge${edge.type === 'feedback' ? ' feedback' : ''}${active ? ' is-active' : ''}`, 'data-edge': edge.id, 'marker-end': `url(#${active ? 'web-arrow-active' : 'web-arrow-neutral'})` }));
      });
      info.headers.forEach(header => {
        const text = svgEl('text', { x: header.x, y: header.y, 'text-anchor': 'start', class: 'web-layer-label' });
        text.textContent = header.layer.label;
        svg.appendChild(text);
        svg.appendChild(svgEl('line', { x1: header.x, y1: header.y + 8, x2: info.width - 12, y2: header.y + 8, class: 'web-layer-rule' }));
      });
      visibleNodes().forEach(node => {
        const pos = positions.get(node.id);
        const layer = layers.find(item => item.id === node.layer);
        const group = svgEl('g', { class: `web-node${state.activeNodes.has(node.id) ? ' is-active' : ''}${state.focusNode === node.id ? ' is-focus' : ''}${pos.compact ? ' is-compact' : ''}`, 'data-node': node.id, transform: `translate(${pos.x} ${pos.y})`, style: `--node-color:${layer.color}`, 'aria-hidden': 'true' });
        group.appendChild(svgEl('rect', { x: -pos.w / 2, y: -pos.h / 2, width: pos.w, height: pos.h, rx: 8, class: 'web-node-rect' }));
        const lines = wrapLabel(node.label, pos.w);
        const label = svgEl('text', { x: 0, y: lines.length === 1 ? 4 : -3, 'text-anchor': 'middle', class: 'web-node-label' });
        lines.slice(0, 2).forEach((line, index) => {
          const span = svgEl('tspan', { x: 0, dy: index === 0 ? 0 : '1.1em' });
          span.textContent = line;
          label.appendChild(span);
        });
        group.appendChild(label);
        const count = svgEl('text', { x: pos.w / 2 - 7, y: -pos.h / 2 + 13, 'text-anchor': 'end', class: 'web-node-count' });
        count.textContent = node.count;
        group.appendChild(count);
        group.addEventListener('click', () => {
          focus = { type: 'tech', id: node.id };
          select.value = '';
          render();
        });
        group.addEventListener('mouseenter', () => previewNode(node.id));
        group.addEventListener('mouseleave', restoreFocus);
        svg.appendChild(group);
      });
      updateDetail();
    }

    function renderDetailLinks(container, items, type) {
      container.replaceChildren();
      if (!items.length) {
        const empty = document.createElement('span');
        empty.className = 'web-detail-empty';
        empty.textContent = 'None mapped';
        container.appendChild(empty);
        return;
      }
      items.forEach((item, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'web-detail-link';
        button.textContent = item.name || item.label;
        button.addEventListener('click', () => {
          focus = { type, id: item.id };
          select.value = type === 'lab' ? item.id : '';
          if (type === 'lab') setActiveLab(item.id);
          render();
        });
        container.appendChild(button);
        if (index < items.length - 1) container.appendChild(document.createTextNode(', '));
      });
    }

    function updateDetail(target = focus) {
      const title = document.querySelector('#web-detail-title');
      const explanationTarget = document.querySelector('#web-detail-explanation');
      const labsTarget = document.querySelector('#web-detail-labs');
      const upstreamTarget = document.querySelector('#web-detail-upstream');
      const downstreamTarget = document.querySelector('#web-detail-downstream');
      const citationsTarget = document.querySelector('#web-detail-citations');
      let relevantLabs;
      let upstream;
      let downstream;
      if (target.type === 'lab') {
        const lab = labById.get(target.id);
        title.textContent = lab.name;
        explanationTarget.textContent = 'Select a node in the web to inspect what that technical commitment or implication represents.';
        relevantLabs = [lab];
        upstream = lab.path.map(id => nodeById.get(id)).filter(Boolean);
        downstream = futuresForLab(lab).map(id => nodeById.get(id)).filter(Boolean);
        svg.setAttribute('aria-label', `Technology dependency path for ${lab.name}`);
      } else {
        const node = nodeById.get(target.id);
        title.textContent = node.label;
        explanationTarget.textContent = node.explanation;
        relevantLabs = labs.filter(lab => labUsesNode(lab, node.id));
        upstream = edges.filter(edge => edge.target === node.id).map(edge => nodeById.get(edge.source)).filter(Boolean);
        downstream = edges.filter(edge => edge.source === node.id).map(edge => nodeById.get(edge.target)).filter(Boolean);
        svg.setAttribute('aria-label', `Upstream and downstream dependencies for ${node.label}`);
      }
      renderDetailLinks(labsTarget, relevantLabs, 'lab');
      renderDetailLinks(upstreamTarget, [...new Map(upstream.map(node => [node.id, node])).values()], 'tech');
      renderDetailLinks(downstreamTarget, [...new Map(downstream.map(node => [node.id, node])).values()], 'tech');
      renderCitations(citationsTarget, relevantLabs.flatMap(insightIdsForLab), 'Lab sources');
    }

    const onResize = debounce(render);
    window.addEventListener('resize', onResize);
    render();
  }

  stripDeprecatedSelectionParam();
  renderLastUpdated();

  if (page === 'index') initIndex();
  else if (page === 'space') initArchitecture();
  else if (page === 'radar') initRadar();
  else if (page === 'tech-web') initTechWeb();
})();
