/* global React */
const { useState: useStateK, useEffect: useEffectK, useRef: useRefK, useMemo: useMemoK } = React;

// ============== SAMPLE DATA ==============
const TAGS = {
  design:  { label: "Diseño",   cls: "tag--amber" },
  research:{ label: "Research", cls: "tag--blue"  },
  urgent:  { label: "Urgente",  cls: "tag--red"   },
  mobile:  { label: "Móvil",    cls: "tag--purple"},
  backend: { label: "Backend",  cls: "tag--green" },
  copy:    { label: "Copy",     cls: "tag--blue"  },
  bug:     { label: "Bug",      cls: "tag--red"   },
  growth:  { label: "Growth",   cls: "tag--purple"},
};

const PEOPLE = ["Alex Romero", "María Jiménez", "Sofía Kane", "Diego Vega", "Lia Park", "Tomás Ruiz"];

const seedCards = () => ([
  // todo
  { id: "k-101", col: "todo",  title: "Auditar el componente de calendario", desc: "Revisar consistencia de tokens y comportamiento responsive en mobile.", tags: ["design"],          assignees: ["Alex Romero"], due: "2026-05-12", priority: "med", subtasks: { done: 0, total: 4 }, comments: 2 },
  { id: "k-102", col: "todo",  title: "Entrevistar a 5 usuarios pro",         desc: "Sesiones de 30 min sobre el flujo de onboarding nuevo.",          tags: ["research"],        assignees: ["Sofía Kane"],  due: "2026-05-15", priority: "low", subtasks: { done: 1, total: 5 }, comments: 0 },
  { id: "k-103", col: "todo",  title: "Estimaciones para Sprint 24",          desc: "Pasar por el backlog con el equipo de eng.",                         tags: ["backend"],         assignees: ["Diego Vega", "Tomás Ruiz"], due: "2026-05-18", priority: "med", subtasks: { done: 0, total: 0 }, comments: 1 },
  { id: "k-104", col: "todo",  title: "Renombrar 'Tablero' → 'Board' en EN",  desc: "i18n: revisar copys en archivo es-ES y en-US.",                       tags: ["copy"],            assignees: ["Lia Park"],    due: null,        priority: "low", subtasks: { done: 0, total: 0 }, comments: 0 },

  // doing
  { id: "k-201", col: "doing", title: "Onboarding nuevo: rediseño completo",  desc: "Pasar del flow modal a un wizard de 4 pasos con preview en vivo.",   tags: ["urgent","mobile"], assignees: ["María Jiménez", "Sofía Kane"], due: "2026-05-09", priority: "high", subtasks: { done: 3, total: 5 }, comments: 8 },
  { id: "k-202", col: "doing", title: "Rate limit del API público",           desc: "Implementar token bucket por workspace.",                            tags: ["backend"],         assignees: ["Diego Vega"], due: "2026-05-14", priority: "med", subtasks: { done: 2, total: 4 }, comments: 3 },
  { id: "k-203", col: "doing", title: "Drag & drop con animación smooth",     desc: "Reemplazar dnd-kit con implementación custom basada en FLIP.",        tags: ["design"],          assignees: ["Alex Romero"], due: "2026-05-11", priority: "med", subtasks: { done: 1, total: 3 }, comments: 1 },

  // done
  { id: "k-301", col: "done",  title: "Migrar tema oscuro a tokens",          desc: "",  tags: ["design"],          assignees: ["Alex Romero"],  due: "2026-04-28", priority: "med", subtasks: { done: 6, total: 6 }, comments: 4 },
  { id: "k-302", col: "done",  title: "Configurar dominio personalizado",     desc: "",  tags: ["backend"],         assignees: ["Diego Vega"],   due: "2026-04-25", priority: "low", subtasks: { done: 2, total: 2 }, comments: 0 },
  { id: "k-303", col: "done",  title: "Fix: scroll horizontal en Safari",     desc: "",  tags: ["bug"],             assignees: ["Tomás Ruiz"],   due: "2026-04-22", priority: "high", subtasks: { done: 1, total: 1 }, comments: 2 },
]);

const seedCols = () => ([
  { id: "todo",  name: "Por hacer",   color: "#9a9286" },
  { id: "doing", name: "En progreso", color: "#d97757" },
  { id: "done",  name: "Hecho",       color: "#3b6e4f" },
]);

// ============== UTILS ==============
const formatDue = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  const now = new Date("2026-05-08");
  const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
  let label;
  if (diff < 0) label = `Hace ${-diff}d`;
  else if (diff === 0) label = "Hoy";
  else if (diff === 1) label = "Mañana";
  else if (diff < 7) label = `En ${diff}d`;
  else label = d.toLocaleDateString("es", { day: "numeric", month: "short" });
  const cls = diff < 0 ? "due--late" : diff <= 2 ? "due--soon" : "";
  return { label, cls };
};

const PRIO = {
  high: { label: "Alta",  color: "#c25e58" },
  med:  { label: "Media", color: "#b07f2b" },
  low:  { label: "Baja",  color: "#9a9286" },
};

// ============== CARD ==============
function Card({ card, onOpen, onDragStart, onDragEnd, dragging }) {
  const due = formatDue(card.due);
  return (
    <div
      className={`card ${dragging ? "card--dragging" : ""}`}
      draggable
      onDragStart={(e) => onDragStart(e, card.id)}
      onDragEnd={onDragEnd}
      onClick={onOpen}
    >
      {card.tags?.length > 0 && (
        <div className="card__tags">
          {card.tags.map(t => (
            <span key={t} className={`tag ${TAGS[t]?.cls || ""}`}>
              <span className="tag-dot" />{TAGS[t]?.label || t}
            </span>
          ))}
        </div>
      )}
      <div className="card__title">{card.title}</div>
      {card.desc && <div className="card__desc">{card.desc}</div>}
      <div className="card__foot">
        <div className="card__meta">
          {card.priority === "high" && (
            <span className="priority-flag" style={{ color: PRIO.high.color }} title="Prioridad alta">⚑</span>
          )}
          {due && <span className={`due ${due.cls}`}><Icon name="cal" className="icon icon--sm" />{due.label}</span>}
          {card.subtasks?.total > 0 && (
            <span className="subtask-chip">
              <Icon name="check" className="icon icon--sm" />
              {card.subtasks.done}/{card.subtasks.total}
            </span>
          )}
          {card.comments > 0 && (
            <span className="subtask-chip"><Icon name="msg" className="icon icon--sm" />{card.comments}</span>
          )}
        </div>
        <div className="avatar-stack">
          {card.assignees.slice(0, 3).map(name => <Avatar key={name} name={name} size="avatar--xs" />)}
          {card.assignees.length > 3 && <div className="avatar avatar--xs avatar--more">+{card.assignees.length - 3}</div>}
        </div>
      </div>
    </div>
  );
}

// ============== ADD CARD INLINE ==============
function AddCardInline({ onAdd, onCancel }) {
  const [title, setTitle] = useStateK("");
  const ref = useRefK(null);
  useEffectK(() => { ref.current?.focus(); }, []);
  return (
    <div className="add-card-form">
      <textarea
        ref={ref}
        placeholder="Título de la tarjeta…"
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (title.trim()) onAdd(title.trim()); }
          if (e.key === "Escape") onCancel();
        }}
      />
      <div className="add-card-form__row">
        <button className="btn btn--sm" onClick={() => title.trim() && onAdd(title.trim())}>Crear tarjeta</button>
        <button className="btn btn--quiet btn--sm" onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}

// ============== COLUMN ==============
function Column({ col, cards, onAddCard, onRenameCol, onCardOpen, onCardDragStart, onCardDragEnd, dragOverCol, dragCardId, onColDragOver, onColDrop }) {
  const [adding, setAdding] = useStateK(false);
  const [name, setName] = useStateK(col.name);
  useEffectK(() => setName(col.name), [col.name]);

  return (
    <div
      className={`col ${dragOverCol === col.id ? "col--drag-over" : ""}`}
      onDragOver={(e) => { e.preventDefault(); onColDragOver(col.id); }}
      onDrop={(e) => { e.preventDefault(); onColDrop(col.id); }}
    >
      <div className="col__head">
        <span className="col__dot" style={{ background: col.color }} />
        <input
          className="col__name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => onRenameCol(col.id, name)}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
        />
        <span className="col__count">{cards.length}</span>
        <span className="col__add" title="Añadir tarjeta" onClick={() => setAdding(true)}><Icon name="plus" className="icon icon--sm" /></span>
        <span className="col__menu"><Icon name="dots" className="icon icon--sm" /></span>
      </div>
      <div className="col__list">
        {cards.map(c => (
          <Card
            key={c.id}
            card={c}
            onOpen={() => onCardOpen(c.id)}
            onDragStart={onCardDragStart}
            onDragEnd={onCardDragEnd}
            dragging={dragCardId === c.id}
          />
        ))}
        {adding ? (
          <AddCardInline onAdd={(t) => { onAddCard(col.id, t); setAdding(false); }} onCancel={() => setAdding(false)} />
        ) : null}
      </div>
      {!adding && (
        <button className="col__add-card" onClick={() => setAdding(true)}>
          <Icon name="plus" className="icon icon--sm" /> Añadir tarjeta
        </button>
      )}
    </div>
  );
}

// ============== DETAIL PANEL ==============
function DetailPanel({ card, cols, onClose, onUpdate }) {
  const [title, setTitle] = useStateK(card.title);
  const [desc, setDesc] = useStateK(card.desc || "Añade una descripción más detallada…");
  useEffectK(() => { setTitle(card.title); setDesc(card.desc || ""); }, [card.id]);

  const due = formatDue(card.due);
  const colName = cols.find(c => c.id === card.col)?.name || card.col;
  const colColor = cols.find(c => c.id === card.col)?.color;

  return (
    <div className="detail-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="detail">
        <div className="detail__head">
          <span className="detail__id">{card.id.toUpperCase()}</span>
          <span style={{ color: "var(--fg-subtle)" }}>·</span>
          <div className="detail__crumbs">
            <span>Lanzamiento Q3</span>
            <Icon name="chevronR" className="icon icon--sm" />
            <span>{colName}</span>
          </div>
          <div className="detail__head-actions">
            <span className="topbar__action"><Icon name="expand" className="icon icon--sm" /></span>
            <span className="topbar__action"><Icon name="dots" className="icon icon--sm" /></span>
            <span className="topbar__action" onClick={onClose}><Icon name="x" className="icon icon--sm" /></span>
          </div>
        </div>

        <div className="detail__body">
          <div className="detail__main">
            <textarea
              className="detail__title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => onUpdate({ title })}
              rows={1}
            />

            <div className="detail__section">
              <div className="detail__label">Descripción</div>
              <textarea
                className="detail__desc"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                onBlur={() => onUpdate({ desc })}
              />
            </div>

            <div className="detail__section">
              <div className="detail__label">Subtareas {card.subtasks?.total > 0 && `(${card.subtasks.done}/${card.subtasks.total})`}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { t: "Estructurar componentes en figma", done: true },
                  { t: "Validar con 3 usuarios", done: true },
                  { t: "Implementar en código", done: card.subtasks?.done >= 3 },
                  { t: "Code review con María", done: false },
                  { t: "QA + handoff", done: false },
                ].slice(0, card.subtasks?.total || 0).map((s, i) => (
                  <label key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 8px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>
                    <input type="checkbox" defaultChecked={s.done} style={{ accentColor: "var(--fg)" }} />
                    <span style={{ textDecoration: s.done ? "line-through" : "none", color: s.done ? "var(--fg-muted)" : "var(--fg)" }}>{s.t}</span>
                  </label>
                ))}
                <button className="btn btn--quiet btn--sm" style={{ alignSelf: "flex-start", marginTop: 4 }}>
                  <Icon name="plus" className="icon icon--sm" /> Agregar subtarea
                </button>
              </div>
            </div>

            <div className="detail__section">
              <div className="detail__label">Actividad</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="activity-item">
                  <Avatar name="María Jiménez" size="avatar--xs" />
                  <div><strong>María</strong> movió esta tarjeta a <strong>{colName}</strong> · hace 2h</div>
                </div>
                <div className="activity-item">
                  <Avatar name="Alex Romero" size="avatar--xs" />
                  <div><strong>Alex</strong> añadió la etiqueta <strong>Urgente</strong> · hace 4h</div>
                </div>
                <div className="activity-item">
                  <Avatar name="Sofía Kane" size="avatar--xs" />
                  <div><strong>Sofía</strong> escribió un comentario · ayer
                    <div style={{ marginTop: 6, padding: 10, background: "var(--bg-sunken)", borderRadius: 8, color: "var(--fg)" }}>
                      Validé con tres usuarios y la nueva estructura funciona mucho mejor. ¿Pasamos al código mañana?
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "flex-start" }}>
                <Avatar name="Alex Romero" size="avatar--xs" />
                <textarea className="textarea input" placeholder="Escribe un comentario…" rows={2} style={{ resize: "vertical" }} />
              </div>
            </div>
          </div>

          <aside className="detail__sidebar">
            <div className="detail-meta-row">
              <div className="detail-meta-row__label">Estado</div>
              <div className="detail-meta-row__val">
                <span className="col__dot" style={{ background: colColor, width: 8, height: 8 }} />
                {colName}
                <Icon name="chevron" className="icon icon--sm" />
              </div>
            </div>

            <div className="detail-meta-row">
              <div className="detail-meta-row__label">Asignados</div>
              <div className="detail-meta-row__val" style={{ flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
                {card.assignees.map(name => (
                  <span key={name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Avatar name={name} size="avatar--xs" />
                    <span>{name}</span>
                  </span>
                ))}
                <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--fg-muted)", fontSize: 12 }}>
                  <Icon name="plus" className="icon icon--sm" /> Añadir
                </span>
              </div>
            </div>

            <div className="detail-meta-row">
              <div className="detail-meta-row__label">Fecha límite</div>
              <div className="detail-meta-row__val">
                <Icon name="cal" className="icon icon--sm" />
                {due ? <span className={`due ${due.cls}`} style={{ fontSize: 13 }}>{due.label}</span> : <span style={{ color: "var(--fg-muted)" }}>Sin fecha</span>}
              </div>
            </div>

            <div className="detail-meta-row">
              <div className="detail-meta-row__label">Etiquetas</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {card.tags.map(t => (
                  <span key={t} className={`tag ${TAGS[t]?.cls || ""}`}>
                    <span className="tag-dot" />{TAGS[t]?.label || t}
                  </span>
                ))}
                <span className="tag" style={{ background: "transparent", border: "1px dashed var(--border-strong)", color: "var(--fg-muted)" }}>+ Añadir</span>
              </div>
            </div>

            <div className="detail-meta-row">
              <div className="detail-meta-row__label">Prioridad</div>
              <div className="detail-meta-row__val">
                <span style={{ color: PRIO[card.priority].color }}>⚑</span>
                {PRIO[card.priority].label}
              </div>
            </div>

            <div className="detail-meta-row">
              <div className="detail-meta-row__label">Creado</div>
              <div style={{ fontSize: 12, color: "var(--fg-muted)", padding: "4px 0" }}>
                3 mayo 2026 por <strong style={{ color: "var(--fg)" }}>Alex</strong>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// ============== KANBAN APP ==============
function KanbanApp({ workspace, project }) {
  const [cols, setCols] = useStateK(seedCols());
  const [cards, setCards] = useStateK(seedCards());
  const [openCardId, setOpenCardId] = useStateK(null);
  const [dragCardId, setDragCardId] = useStateK(null);
  const [dragOverCol, setDragOverCol] = useStateK(null);
  const [filter, setFilter] = useStateK("");
  const [filterMine, setFilterMine] = useStateK(false);
  const [activeBoard, setActiveBoard] = useStateK("Lanzamiento Q3");
  const [activeProject, setActiveProject] = useStateK("Lanzamiento Q3");
  const [expandedProject, setExpandedProject] = useStateK("Producto");
  const [starred, setStarred] = useStateK(true);
  const [toast, setToast] = useStateK(null);

  useEffectK(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 1800);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const filteredCards = useMemoK(() => {
    return cards.filter(c => {
      if (filter && !`${c.title} ${c.desc}`.toLowerCase().includes(filter.toLowerCase())) return false;
      if (filterMine && !c.assignees.includes("Alex Romero")) return false;
      return true;
    });
  }, [cards, filter, filterMine]);

  const onCardDragStart = (e, id) => { setDragCardId(id); e.dataTransfer.effectAllowed = "move"; };
  const onCardDragEnd = () => { setDragCardId(null); setDragOverCol(null); };
  const onColDragOver = (colId) => setDragOverCol(colId);
  const onColDrop = (colId) => {
    if (!dragCardId) return;
    setCards(prev => prev.map(c => c.id === dragCardId ? { ...c, col: colId } : c));
    setDragCardId(null); setDragOverCol(null);
    setToast("Tarjeta movida");
  };

  const onAddCard = (colId, title) => {
    const id = `k-${Date.now()}`;
    setCards(prev => [...prev, { id, col: colId, title, desc: "", tags: [], assignees: ["Alex Romero"], due: null, priority: "low", subtasks: { done: 0, total: 0 }, comments: 0 }]);
    setToast("Tarjeta creada");
  };

  const onRenameCol = (colId, name) => setCols(prev => prev.map(c => c.id === colId ? { ...c, name } : c));
  const onAddCol = () => setCols(prev => [...prev, { id: `c${Date.now()}`, name: "Nueva columna", color: "#9a9286" }]);
  const onUpdate = (patch) => setCards(prev => prev.map(c => c.id === openCardId ? { ...c, ...patch } : c));

  const openCard = cards.find(c => c.id === openCardId);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar__top">
          <div className="workspace-switcher">
            <div className="workspace-switcher__avatar" style={{ background: workspace.icon.bg }}>{workspace.icon.ch}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="workspace-switcher__name">{workspace.name}</div>
              <div className="workspace-switcher__plan">PRO · 6 miembros</div>
            </div>
            <Icon name="chevron" className="icon icon--sm workspace-switcher__chev" />
          </div>
        </div>
        <div className="sidebar__search">
          <div className="search-input">
            <Icon name="search" className="icon icon--sm" />
            <span>Buscar todo…</span>
            <span className="search-input__kbd">⌘K</span>
          </div>
        </div>
        <div className="sidebar__nav">
          <div className="sidebar__group">
            <div className="sidebar-item">
              <Icon name="inbox" className="sidebar-item__icon" />
              <span>Bandeja</span>
              <span className="sidebar-item__count">3</span>
            </div>
            <div className="sidebar-item">
              <Icon name="user" className="sidebar-item__icon" />
              <span>Mis tareas</span>
              <span className="sidebar-item__count">7</span>
            </div>
            <div className="sidebar-item">
              <Icon name="cal" className="sidebar-item__icon" />
              <span>Hoy</span>
              <span className="sidebar-item__count">2</span>
            </div>
          </div>

          <div className="sidebar__group">
            <div className="sidebar__group-head">
              <span>Favoritos</span>
            </div>
            <div className="sidebar-item sidebar-item--active">
              <Icon name="star" className="sidebar-item__icon" />
              <span>{activeBoard}</span>
            </div>
          </div>

          <div className="sidebar__group">
            <div className="sidebar__group-head">
              <span>Proyectos</span>
              <span className="sidebar__group-add"><Icon name="plus" className="icon icon--sm" /></span>
            </div>
            {[
              { name: "Producto", boards: ["Lanzamiento Q3", "Roadmap 2026", "Bugs"] },
              { name: "Diseño",   boards: ["Sistema de diseño", "Site web v3"] },
              { name: "Marketing",boards: ["Calendario editorial", "Campañas"] },
            ].map(p => (
              <React.Fragment key={p.name}>
                <div className="sidebar-item" onClick={() => setExpandedProject(expandedProject === p.name ? null : p.name)}>
                  <span className="sidebar-item__caret">
                    <Icon name={expandedProject === p.name ? "chevron" : "chevronR"} className="icon icon--sm" />
                  </span>
                  <Icon name="folder" className="sidebar-item__icon" />
                  <span>{p.name}</span>
                  <span className="sidebar-item__count">{p.boards.length}</span>
                </div>
                {expandedProject === p.name && (
                  <div className="sidebar-sub">
                    {p.boards.map(b => (
                      <div
                        key={b}
                        className={`sidebar-item ${activeBoard === b ? "sidebar-item--active" : ""}`}
                        onClick={() => { setActiveBoard(b); setActiveProject(p.name); }}
                      >
                        <Icon name="board" className="sidebar-item__icon" />
                        <span>{b}</span>
                      </div>
                    ))}
                    <div className="sidebar-item" style={{ color: "var(--fg-muted)" }}>
                      <Icon name="plus" className="sidebar-item__icon" />
                      <span>Nuevo tablero</span>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="sidebar__bottom">
          <div className="user-pill__avatar">AR</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="user-pill__name">Alex Romero</div>
            <div className="user-pill__email">alex@kandex.app</div>
          </div>
          <span className="user-pill__settings"><Icon name="settings" className="icon icon--sm" /></span>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div className="crumbs">
            <span>{workspace.name}</span>
            <span className="crumbs__sep">/</span>
            <span>{activeProject}</span>
            <span className="crumbs__sep">/</span>
            <span className="crumbs__leaf">{activeBoard}</span>
          </div>
          <div className="topbar__spacer" />
          <span className="topbar__action" title="Notificaciones"><Icon name="bell" className="icon icon--sm" /></span>
          <span className="topbar__action" title="Ajustes"><Icon name="settings" className="icon icon--sm" /></span>
        </div>

        <div className="toolbar">
          <h1>{activeBoard}</h1>
          <span className={`toolbar__star ${starred ? "toolbar__star--on" : ""}`} onClick={() => setStarred(s => !s)}>
            <Icon name="star" className="icon icon--sm" />
          </span>
          <span className="toolbar__pill">
            <Icon name="layers" className="icon icon--sm" />
            {cards.length} tarjetas
          </span>

          <div style={{ flex: 1 }} />

          <div className="search-bar">
            <Icon name="search" className="icon icon--sm" />
            <input placeholder="Filtrar tarjetas…" value={filter} onChange={(e) => setFilter(e.target.value)} />
            {filter && <span style={{ cursor: "pointer", color: "var(--fg-muted)" }} onClick={() => setFilter("")}><Icon name="x" className="icon icon--sm" /></span>}
          </div>

          <button
            className={`filter-chip ${filterMine ? "filter-chip--active" : ""}`}
            onClick={() => setFilterMine(s => !s)}
          >
            <Avatar name="Alex Romero" size="avatar--xs" />
            <span>Solo mías</span>
            {filterMine && <span className="filter-chip__close" onClick={(e) => { e.stopPropagation(); setFilterMine(false); }}>×</span>}
          </button>

          <button className="filter-chip"><Icon name="filter" className="icon icon--sm" /> Filtrar</button>
          <button className="filter-chip"><Icon name="sort" className="icon icon--sm" /> Agrupar</button>

          <div className="toolbar__sep" />

          <div className="avatar-stack" title="Miembros del tablero">
            {PEOPLE.slice(0, 4).map(p => <Avatar key={p} name={p} size="avatar--sm" />)}
            <div className="avatar avatar--sm avatar--more">+2</div>
          </div>

          <button className="btn btn--sm">
            <Icon name="plus" className="icon icon--sm" />
            Invitar
          </button>
        </div>

        <div className="board-scroll">
          <div className="board">
            {cols.map(col => (
              <Column
                key={col.id}
                col={col}
                cards={filteredCards.filter(c => c.col === col.id)}
                onAddCard={onAddCard}
                onRenameCol={onRenameCol}
                onCardOpen={setOpenCardId}
                onCardDragStart={onCardDragStart}
                onCardDragEnd={onCardDragEnd}
                dragOverCol={dragOverCol}
                dragCardId={dragCardId}
                onColDragOver={onColDragOver}
                onColDrop={onColDrop}
              />
            ))}
            <button className="add-col" onClick={onAddCol}>
              <Icon name="plus" className="icon icon--sm" /> Añadir columna
            </button>
          </div>
        </div>
      </main>

      {openCard && (
        <DetailPanel card={openCard} cols={cols} onClose={() => setOpenCardId(null)} onUpdate={onUpdate} />
      )}

      {toast && <div className="ghost-toast">{toast}</div>}
    </div>
  );
}

window.KanbanApp = KanbanApp;
