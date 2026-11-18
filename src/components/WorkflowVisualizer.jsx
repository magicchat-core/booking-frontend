'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * WorkflowVisualizer
 *
 * Renders a horizontal, left→right branch diagram of an API chain.
 * Pure SVG + inline styles — no external layout library, no styled-jsx.
 *
 * Props:
 *   data  — { title, subtitle, nodes[], edges[], start, end_label }
 *
 * Layout model:
 *   - Nodes are placed on a grid: column index = shortest distance from `start`,
 *     row index = position within the column (branches fan out up/down).
 *   - Wired edges  → solid arrow with a status chip + label.
 *   - Ghost edges  → dashed grey arrow ending in a ⚠ stub (no next node).
 *   - End edges    → solid arrow ending in a ✓ end-cap.
 *
 * Animation model:
 *   - `mode = 'idle' | 'playing' | 'done'`
 *   - Autoplay walks nodes in topological order along wired edges.
 *   - At a `manual: true` node, pause `MANUAL_PAUSE_MS` then continue.
 *   - Click any node to jump; click empty area to reset.
 */
const COL_W      = 280;   // horizontal spacing between node columns
const NODE_W     = 220;   // node card width
const NODE_H     = 132;   // node card height
const ROW_H      = 190;   // vertical spacing between rows
const PAD_X      = 40;
const PAD_Y      = 48;

const STEP_MS         = 1600; // dwell on each node during autoplay
const MANUAL_PAUSE_MS = 3000; // dwell on a `manual: true` node

const METHOD_STYLE = {
  GET:    { fg: '#166534', bg: '#dcfce7', border: '#bbf7d0' },
  POST:   { fg: '#1e40af', bg: '#dbeafe', border: '#bfdbfe' },
  PATCH:  { fg: '#92400e', bg: '#fef3c7', border: '#fde68a' },
  PUT:    { fg: '#92400e', bg: '#fef3c7', border: '#fde68a' },
  DELETE: { fg: '#991b1b', bg: '#fee2e2', border: '#fecaca' },
};

// ---- layout ----------------------------------------------------------------

function buildLayout(data) {
  const nodes = data.nodes || [];
  const edges = data.edges || [];
  const byId  = Object.fromEntries(nodes.map((n) => [n.id, n]));

  // BFS column index from `start` along wired edges only.
  const col = Object.fromEntries(nodes.map((n) => [n.id, 0]));
  const visited = new Set([data.start]);
  const queue = [data.start];
  while (queue.length) {
    const cur = queue.shift();
    for (const e of edges) {
      if (e.kind !== 'wired' || e.from !== cur || !e.to || visited.has(e.to)) continue;
      col[e.to] = Math.max(col[e.to], col[cur] + 1);
      visited.add(e.to);
      queue.push(e.to);
    }
  }

  // Row index: within each column, place nodes top-to-bottom.
  // For branches from a single parent, we want the "happy path" to sit on
  // the middle row and ghost stubs to sit below. Simple heuristic: sort
  // each column by whether the node is a ghost target (ghosts last).
  const byCol = {};
  for (const n of nodes) (byCol[col[n.id]] ||= []).push(n);

  const pos = {};
  for (const [cStr, list] of Object.entries(byCol)) {
    const c = Number(cStr);
    list.forEach((n, i) => {
      pos[n.id] = {
        x: PAD_X + c * COL_W,
        y: PAD_Y + i * ROW_H,
        col: c,
        row: i,
      };
    });
  }

  // Ghost edges terminate in a stub just to the right of their source.
  // We give each ghost a synthetic position offset by +1 row below its source.
  const ghostStubs = edges
    .filter((e) => e.kind === 'ghost')
    .map((e, i) => {
      const src = pos[e.from];
      return {
        ...e,
        stubId: `ghost-${e.from}-${e.status}`,
        x: src.x + COL_W - 40,
        y: src.y + NODE_H + 34 + i * 0, // stack ghosts under their source
      };
    });

  const endCaps = edges
    .filter((e) => e.kind === 'end')
    .map((e) => {
      const src = pos[e.from];
      return { ...e, x: src.x + COL_W - 30, y: src.y + NODE_H / 2 };
    });

  const width  = PAD_X * 2 + (Object.keys(byCol).length) * COL_W + 60;
  const height = Math.max(
    PAD_Y * 2 + ROW_H * Math.max(1, ...Object.values(byCol).map((l) => l.length)),
    PAD_Y * 2 + NODE_H + ghostStubs.length * 60 + 40,
  );

  return { nodes, edges, byId, pos, ghostStubs, endCaps, width, height, col };
}

// ---- path helpers ----------------------------------------------------------

function edgePath(from, to) {
  // Horizontal S-curve between two node cards.
  const x1 = from.x + NODE_W;
  const y1 = from.y + NODE_H / 2;
  const x2 = to.x;
  const y2 = to.y + NODE_H / 2;
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
}

function ghostPath(from, stub) {
  const x1 = from.x + NODE_W;
  const y1 = from.y + NODE_H - 18;
  const x2 = stub.x;
  const y2 = stub.y;
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
}

// ---- component -------------------------------------------------------------

export default function WorkflowVisualizer({ data }) {
  const layout = useMemo(() => buildLayout(data), [data]);

  const [mode, setMode]           = useState('idle');     // idle | playing | done
  const [activeId, setActiveId]   = useState(null);
  const [visitedIds, setVisited]  = useState(() => new Set());
  const [hoverNode, setHoverNode] = useState(null);
  const timerRef                  = useRef(null);

  const stopTimer = () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  };

  const reset = () => {
    stopTimer();
    setMode('idle');
    setActiveId(null);
    setVisited(new Set());
  };

  const nextHop = (fromId) => {
    // Follow the first wired edge out of fromId.
    const e = layout.edges.find((e) => e.kind === 'wired' && e.from === fromId);
    return e?.to ?? null;
  };

  const advance = (fromId) => {
    const to = nextHop(fromId);
    if (!to) { setMode('done'); setActiveId(null); return; }

    setVisited((prev) => new Set(prev).add(to));
    setActiveId(to);
    const node = layout.byId[to];
    const dwell = node?.manual ? MANUAL_PAUSE_MS : STEP_MS;
    timerRef.current = setTimeout(() => advance(to), dwell);
  };

  const play = () => {
    stopTimer();
    setMode('playing');
    setVisited(new Set([data.start]));
    setActiveId(data.start);
    const first = layout.byId[data.start];
    const dwell = first?.manual ? MANUAL_PAUSE_MS : STEP_MS;
    timerRef.current = setTimeout(() => advance(data.start), dwell);
  };

  const jumpTo = (id) => {
    stopTimer();
    setMode('playing');
    setActiveId(id);
    setVisited((prev) => new Set(prev).add(id));
    const node = layout.byId[id];
    const dwell = node?.manual ? MANUAL_PAUSE_MS : STEP_MS;
    timerRef.current = setTimeout(() => advance(id), dwell);
  };

  useEffect(() => () => stopTimer(), []);

  const status = mode === 'idle'    ? 'Ready'
               : mode === 'playing' ? 'Running…'
               : 'Completed';

  return (
    <div style={{
      background: '#0a0f1c',
      border: '1px solid #1e293b',
      borderRadius: 14,
      padding: '20px 22px',
      color: '#e2e8f0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Header + controls */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', gap: 16, marginBottom: 14, flexWrap: 'wrap',
      }}>
        <div>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: '#64748b', marginBottom: 4,
          }}>
            Interactive Architecture
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', lineHeight: 1.25 }}>
            {data.title}
          </div>
          {data.subtitle && (
            <div style={{
              fontSize: 12, color: '#94a3b8', marginTop: 3,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            }}>
              {data.subtitle}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: '#94a3b8',
          }}>
            {status}
          </span>
          {mode === 'idle' || mode === 'done' ? (
            <button onClick={play} style={{
              padding: '8px 16px', borderRadius: 8, border: 'none',
              background: '#3b82f6', color: '#fff', fontWeight: 600,
              fontSize: 13, cursor: 'pointer',
            }}>
              {mode === 'done' ? '↺ Replay' : '▶ Start run'}
            </button>
          ) : (
            <button onClick={reset} style={{
              padding: '8px 16px', borderRadius: 8, border: '1px solid #334155',
              background: 'transparent', color: '#e2e8f0', fontWeight: 600,
              fontSize: 13, cursor: 'pointer',
            }}>
              ⏹ Stop
            </button>
          )}
        </div>
      </div>

      {/* Diagram */}
      <div style={{ overflowX: 'auto', overflowY: 'hidden', paddingBottom: 4 }}>
        <svg
          width={layout.width}
          height={layout.height}
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          style={{ display: 'block', minWidth: '100%' }}
          onClick={(e) => { if (e.target === e.currentTarget) reset(); }}
        >
          <defs>
            <marker id="arrow-wired" viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
            </marker>
            <marker id="arrow-ghost" viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
            </marker>
            <marker id="arrow-end" viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
            </marker>
          </defs>

          {/* Edges first so node cards paint on top */}
          {layout.edges.map((e, i) => {
            const from = layout.pos[e.from];
            if (!from) return null;

            // Wired → solid arrow between nodes
            if (e.kind === 'wired') {
              const to = layout.pos[e.to];
              if (!to) return null;
              const d = edgePath(from, to);
              const isHot = visitedIds.has(e.from) && visitedIds.has(e.to);
              return (
                <g key={`e-${i}`}>
                  <path d={d} fill="none"
                    stroke={isHot ? '#3b82f6' : '#1e3a8a'}
                    strokeWidth={isHot ? 2.5 : 1.8}
                    markerEnd="url(#arrow-wired)"
                    style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
                  />
                  <EdgeLabel x={from.x + NODE_W + (COL_W - NODE_W) / 2}
                             y={from.y + NODE_H / 2 - 10}
                             status={e.status} label={e.label} tone="wired" />
                </g>
              );
            }

            // Ghost → dashed stub, no target
            if (e.kind === 'ghost') {
              const stub = layout.ghostStubs.find((g) => g.stubId === `ghost-${e.from}-${e.status}`);
              if (!stub) return null;
              return (
                <g key={`e-${i}`}>
                  <path d={ghostPath(from, stub)} fill="none"
                    stroke="#475569" strokeWidth={1.5}
                    strokeDasharray="5 4"
                    markerEnd="url(#arrow-ghost)" />
                  <GhostStub stub={stub} status={e.status} label={e.label} />
                </g>
              );
            }

            // End → solid arrow to a ✓ end-cap
            if (e.kind === 'end') {
              const cap = layout.endCaps.find((c) => c.from === e.from && c.status === e.status);
              if (!cap) return null;
              const x1 = from.x + NODE_W;
              const y1 = from.y + NODE_H / 2;
              const d = `M ${x1} ${y1} L ${cap.x} ${cap.y}`;
              const isHot = visitedIds.has(e.from);
              return (
                <g key={`e-${i}`}>
                  <path d={d} fill="none"
                    stroke={isHot ? '#10b981' : '#14532d'}
                    strokeWidth={isHot ? 2.5 : 1.8}
                    markerEnd="url(#arrow-end)"
                    style={{ transition: 'stroke 0.3s' }} />
                  <EdgeLabel x={(x1 + cap.x) / 2} y={y1 - 10}
                             status={e.status} label={e.label} tone="end" />
                  <circle cx={cap.x + 6} cy={cap.y} r={10}
                    fill={isHot ? '#10b981' : '#0f172a'}
                    stroke="#10b981" strokeWidth={1.5}
                    style={{ transition: 'fill 0.3s' }} />
                  <text x={cap.x + 6} y={cap.y + 4}
                    textAnchor="middle" fontSize={11} fontWeight={700}
                    fill={isHot ? '#0f172a' : '#10b981'}>
                    ✓
                  </text>
                </g>
              );
            }
            return null;
          })}

          {/* Nodes */}
          {layout.nodes.map((n) => {
            const p = layout.pos[n.id];
            if (!p) return null;
            const isActive  = activeId === n.id;
            const isVisited = visitedIds.has(n.id);
            return (
              <g key={n.id}
                 style={{ cursor: 'pointer' }}
                 onClick={(ev) => { ev.stopPropagation(); jumpTo(n.id); }}
                 onMouseEnter={() => setHoverNode(n.id)}
                 onMouseLeave={() => setHoverNode(null)}>
                <NodeCard
                  node={n} x={p.x} y={p.y}
                  active={isActive} visited={isVisited}
                />
                {hoverNode === n.id && n.resp_snippet && (
                  <NodeTooltip x={p.x} y={p.y + NODE_H + 8} text={n.resp_snippet} />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex', gap: 18, flexWrap: 'wrap',
        marginTop: 14, fontSize: 11.5, color: '#94a3b8',
      }}>
        <LegendItem color="#3b82f6" label="Wired branch" solid />
        <LegendItem color="#475569" label="UI template exists · no branch configured" dashed />
        <LegendItem color="#10b981" label="Terminal outcome" solid />
        <LegendItem color="#f59e0b" label="Human-in-the-loop pause" />
      </div>

      {/* Plain style tag — styled-jsx is not available under Vite / App Router */}
      <style>{`
        @keyframes wfPulse {
          0%   { transform: scale(1);   opacity: 0.9; }
          100% { transform: scale(1.6); opacity: 0;   }
        }
      `}</style>
    </div>
  );
}

// ---- sub-components --------------------------------------------------------

function NodeCard({ node, x, y, active, visited }) {
  const m = METHOD_STYLE[node.method] || METHOD_STYLE.GET;
  const borderColor = active   ? '#3b82f6'
                    : node.manual ? '#f59e0b'
                    : visited ? '#1e40af'
                    : '#334155';
  const bg = active ? '#1e293b' : '#0f172a';

  return (
    <g>
      {active && (
        <rect x={x - 3} y={y - 3} width={NODE_W + 6} height={NODE_H + 6}
          rx={13} fill="none" stroke="#3b82f6" strokeWidth={2}
          opacity={0.4}
          style={{ transformOrigin: `${x + NODE_W / 2}px ${y + NODE_H / 2}px`,
                   animation: 'wfPulse 1.4s ease-out infinite' }} />
      )}
      <rect x={x} y={y} width={NODE_W} height={NODE_H} rx={10}
        fill={bg} stroke={borderColor} strokeWidth={active ? 2 : 1.4}
        style={{ transition: 'stroke 0.25s, fill 0.25s' }} />

      {/* user_label */}
      <text x={x + 14} y={y + 24} fontSize={13.5} fontWeight={700} fill="#f8fafc">
        {truncate(node.user_label, 26)}
      </text>

      {/* method + path */}
      <rect x={x + 14} y={y + 36} width={52} height={18} rx={4}
        fill={m.bg} stroke={m.border} strokeWidth={1} />
      <text x={x + 14 + 26} y={y + 48} textAnchor="middle"
        fontSize={10} fontWeight={700} fill={m.fg}
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">
        {node.method}
      </text>
      <text x={x + 74} y={y + 49} fontSize={11} fill="#cbd5e1"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">
        {truncate(node.path, 22)}
      </text>

      {/* manual badge */}
      {node.manual && (
        <g>
          <rect x={x + NODE_W - 74} y={y + 10} width={62} height={18} rx={9}
            fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" strokeWidth={1} />
          <text x={x + NODE_W - 43} y={y + 23} textAnchor="middle"
            fontSize={10} fontWeight={700} fill="#f59e0b">
            ⏸ human
          </text>
        </g>
      )}

      {/* outputs */}
      <text x={x + 14} y={y + 76} fontSize={9.5} fontWeight={700}
        fill="#64748b" letterSpacing="0.05em">
        OUTPUTS
      </text>
      {node.outputs.map((code, i) => (
        <g key={code}>
          <rect x={x + 14 + i * 52} y={y + 84} width={46} height={18} rx={4}
            fill="#1e293b" stroke="#334155" strokeWidth={1} />
          <text x={x + 14 + i * 52 + 23} y={y + 97} textAnchor="middle"
            fontSize={10} fontWeight={600} fill="#cbd5e1"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">
            {code}
          </text>
        </g>
      ))}

      {/* visited checkmark */}
      {visited && !active && (
        <g>
          <circle cx={x + NODE_W - 14} cy={y + NODE_H - 14} r={9}
            fill="#10b981" opacity={0.9} />
          <text x={x + NODE_W - 14} y={y + NODE_H - 10} textAnchor="middle"
            fontSize={10} fontWeight={700} fill="#0f172a">✓</text>
        </g>
      )}
    </g>
  );
}

function NodeTooltip({ x, y, text }) {
  const lines = text.split('\n');
  const w = 240;
  const h = 14 + lines.length * 14;
  return (
    <g pointerEvents="none">
      <rect x={x} y={y} width={w} height={h} rx={6}
        fill="#020617" stroke="#334155" strokeWidth={1} opacity={0.97} />
      {lines.map((line, i) => (
        <text key={i} x={x + 10} y={y + 16 + i * 14} fontSize={10.5}
          fill="#94a3b8"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">
          {line}
        </text>
      ))}
    </g>
  );
}

function EdgeLabel({ x, y, status, label, tone }) {
  const color = tone === 'end' ? '#10b981' : '#3b82f6';
  return (
    <g>
      <rect x={x - 52} y={y - 11} width={104} height={26} rx={6}
        fill="#0a0f1c" stroke={color} strokeWidth={1} opacity={0.95} />
      <text x={x - 44} y={y + 4} fontSize={10} fontWeight={700}
        fill={color}
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">
        {status}
      </text>
      <text x={x - 22} y={y + 4} fontSize={10.5} fill="#cbd5e1">
        {label}
      </text>
    </g>
  );
}

function GhostStub({ stub, status, label }) {
  return (
    <g>
      <rect x={stub.x - 4} y={stub.y - 16} width={120} height={32} rx={6}
        fill="#0a0f1c" stroke="#475569" strokeWidth={1}
        strokeDasharray="4 3" opacity={0.95} />
      <text x={stub.x + 4} y={stub.y - 2} fontSize={10} fontWeight={700}
        fill="#94a3b8"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">
        {status}
      </text>
      <text x={stub.x + 4} y={stub.y + 10} fontSize={9.5} fill="#64748b">
        ⚠ {label} · no branch
      </text>
    </g>
  );
}

function LegendItem({ color, label, solid, dashed }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <svg width="22" height="10">
        <line x1="0" y1="5" x2="22" y2="5"
          stroke={color} strokeWidth={2}
          strokeDasharray={dashed ? '4 3' : '0'} />
      </svg>
      {label}
    </span>
  );
}

function truncate(s, n) {
  if (!s) return '';
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}