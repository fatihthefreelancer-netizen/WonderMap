import { useRef, useState, useEffect, useMemo } from 'react';
import type { WorldDTO, LessonDTO, DecorationKind, DecorationDTO } from '@wondermap/shared';
import { WORLD_W, WORLD_H } from '../../lib/constants';
import { themeFor } from '../../lib/theme';
import { WorldTerrain } from '../../components/map/WorldTerrain';
import { ArtDefs } from '../../components/map/art/ArtDefs';
import { hashSeed } from '../../lib/shapes';
import { Decoration } from '../../components/map/decorations';
import { Button } from '../../components/ui/Button';
import { adminService } from '../../lib/services';

const PALETTE: DecorationKind[] = [
  'tree', 'pine', 'bush', 'rock', 'flower', 'grass', 'mountain', 'building', 'castle', 'lamp', 'bridge', 'cloud',
];

interface Props {
  world: WorldDTO;
  lessons: LessonDTO[];
  onSaved: () => void;
}

type DragItem =
  | { type: 'lesson'; id: string }
  | { type: 'deco'; id: string }
  | null;

/**
 * Visual scene editor: drag lesson nodes and decorations to reposition, add new
 * decorations from the palette, delete, then persist coordinates to the server.
 */
export function MapEditor({ world, lessons, onSaved }: Props) {
  const palette = themeFor(world.theme);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0.42);
  const [decos, setDecos] = useState<DecorationDTO[]>(world.decorations);
  const [nodes, setNodes] = useState(lessons.map((l) => ({ id: l.id, x: l.x, y: l.y, type: l.type, order: l.order })));
  const [brush, setBrush] = useState<DecorationKind>('tree');
  const [dragging, setDragging] = useState<DragItem>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setDecos(world.decorations);
    setNodes(lessons.map((l) => ({ id: l.id, x: l.x, y: l.y, type: l.type, order: l.order })));
    setDirty(false);
  }, [world, lessons]);

  const toWorld = (clientX: number, clientY: number) => {
    const rect = stageRef.current!.getBoundingClientRect();
    return { x: (clientX - rect.left) / scale, y: (clientY - rect.top) / scale };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const { x, y } = toWorld(e.clientX, e.clientY);
    const cx = Math.max(0, Math.min(WORLD_W, x));
    const cy = Math.max(0, Math.min(WORLD_H, y));
    if (dragging.type === 'lesson') {
      setNodes((prev) => prev.map((n) => (n.id === dragging.id ? { ...n, x: cx, y: cy } : n)));
    } else {
      setDecos((prev) => prev.map((d) => (d.id === dragging.id ? { ...d, x: cx, y: cy } : d)));
    }
    setDirty(true);
  };

  const addDeco = (e: React.PointerEvent) => {
    if (dragging) return;
    if ((e.target as HTMLElement).dataset.item) return; // clicked an existing item
    const { x, y } = toWorld(e.clientX, e.clientY);
    setDecos((prev) => [
      ...prev,
      { id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, kind: brush, x, y, scale: 1, flip: false },
    ]);
    setDirty(true);
  };

  const removeDeco = (id: string) => {
    setDecos((prev) => prev.filter((d) => d.id !== id));
    setDirty(true);
  };

  async function save() {
    setSaving(true);
    try {
      await adminService.saveScene(world.id, {
        decorations: decos.map(({ kind, x, y, scale: s, flip }) => ({ kind, x, y, scale: s, flip })),
        paths: world.paths.map(({ from, to, control }) => ({ from, to, control })),
      });
      await adminService.moveLessons(nodes.map((n) => ({ id: n.id, x: Math.round(n.x), y: Math.round(n.y) })));
      setDirty(false);
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  const grounded = useMemo(() => [...decos].sort((a, b) => a.y - b.y), [decos]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-sm font-bold text-slate-600">Brush:</span>
        {PALETTE.map((k) => (
          <button
            key={k}
            onClick={() => setBrush(k)}
            className={`rounded-xl px-2 py-1 text-xs font-bold capitalize shadow-soft ring-2 ${
              brush === k ? 'ring-sky-deep bg-white' : 'ring-transparent bg-slate-100'
            }`}
          >
            {k}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500">Zoom</label>
          <input
            type="range"
            min={0.25}
            max={0.7}
            step={0.01}
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            className="wm-range w-28"
          />
          <Button size="sm" variant="secondary" onClick={save} disabled={saving || !dirty}>
            {saving ? 'Saving…' : dirty ? 'Save Scene' : 'Saved'}
          </Button>
        </div>
      </div>

      <p className="mb-2 text-xs font-semibold text-slate-500">
        Click empty ground to place a <b className="capitalize">{brush}</b>. Drag nodes/decorations to move.
        Right-click a decoration to delete.
      </p>

      <div className="overflow-auto rounded-2xl border-2 border-sky-soft bg-sky-soft/30" style={{ maxHeight: '62vh' }}>
        <div
          ref={stageRef}
          onPointerMove={onPointerMove}
          onPointerUp={() => setDragging(null)}
          onPointerLeave={() => setDragging(null)}
          onPointerDown={addDeco}
          className="relative"
          style={{
            width: WORLD_W * scale,
            height: WORLD_H * scale,
            background: `linear-gradient(180deg, ${palette.sky[0]}, ${palette.sky[1]})`,
          }}
        >
          <div className="absolute left-0 top-0 origin-top-left" style={{ width: WORLD_W, height: WORLD_H, transform: `scale(${scale})` }}>
            {/* the scenery art paints from these shared gradients */}
            <ArtDefs />
            <WorldTerrain palette={palette} />

            {grounded.map((d) => (
              <div
                key={d.id}
                data-item="deco"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setDragging({ type: 'deco', id: d.id });
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  removeDeco(d.id);
                }}
                className="absolute cursor-move"
                style={{ left: d.x, top: d.y, transform: `translate(-50%, -100%) scale(${d.scale ?? 1})` }}
              >
                <Decoration kind={d.kind} seed={hashSeed(d.id)} />
              </div>
            ))}

            {nodes.map((n) => (
              <div
                key={n.id}
                data-item="lesson"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setDragging({ type: 'lesson', id: n.id });
                }}
                className="absolute grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 cursor-move place-items-center rounded-full bg-white font-display text-lg font-extrabold text-[#1f3a5f] shadow-node ring-4 ring-sky-deep"
                style={{ left: n.x, top: n.y }}
              >
                {n.type === 'lesson' ? n.order + 1 : n.type[0].toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
