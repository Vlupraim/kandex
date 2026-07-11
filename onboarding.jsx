/* global React */
const { useState: useStateOnb } = React;

const ICON_OPTIONS = [
  { ch: "K", bg: "#d97757" },
  { ch: "◆", bg: "#3b6e4f" },
  { ch: "◇", bg: "#3a6e9c" },
  { ch: "▲", bg: "#7a5ba0" },
  { ch: "●", bg: "#1a1a1a" },
  { ch: "✦", bg: "#b07f2b" },
];

const TEMPLATES = [
  { id: "blank", icon: "✦", title: "En blanco", desc: "Empieza desde cero. Tres columnas vacías." },
  { id: "product", icon: "◆", title: "Roadmap de producto", desc: "Backlog, en sprint, en QA, lanzado." },
  { id: "design", icon: "◇", title: "Sprint de diseño", desc: "Briefs, en exploración, en review, listo." },
  { id: "marketing", icon: "▲", title: "Calendario editorial", desc: "Ideas, en redacción, programado, publicado." },
];

const DEFAULT_COLS = [
  { id: "todo", name: "Por hacer", color: "#9a9286" },
  { id: "doing", name: "En progreso", color: "#d97757" },
  { id: "done", name: "Hecho", color: "#3b6e4f" },
];

function OnboardingPage({ onComplete }) {
  const [step, setStep] = useStateOnb(0);
  const [wsName, setWsName] = useStateOnb("Estudio Romero");
  const [wsIcon, setWsIcon] = useStateOnb(0);
  const [invites, setInvites] = useStateOnb([
    { email: "maria@estudio.co", role: "Editor" },
    { email: "sk@estudio.co", role: "Editor" },
  ]);
  const [newInvite, setNewInvite] = useStateOnb("");
  const [projectName, setProjectName] = useStateOnb("Lanzamiento Q3");
  const [template, setTemplate] = useStateOnb("product");
  const [cols, setCols] = useStateOnb(DEFAULT_COLS);

  const steps = [
    { title: "Crea tu workspace", sub: "Tu espacio principal" },
    { title: "Invita a tu equipo", sub: "Opcional, lo puedes hacer luego" },
    { title: "Tu primer proyecto", sub: "Elige una plantilla" },
    { title: "Configura el tablero", sub: "Define tus columnas" },
  ];

  const next = () => step < 3 ? setStep(step + 1) : onComplete({ wsName, wsIcon: ICON_OPTIONS[wsIcon], projectName, cols });
  const back = () => setStep(Math.max(0, step - 1));

  const addInvite = () => {
    if (newInvite.trim()) {
      setInvites([...invites, { email: newInvite.trim(), role: "Editor" }]);
      setNewInvite("");
    }
  };

  const updateCol = (i, patch) => setCols(cols.map((c, idx) => idx === i ? { ...c, ...patch } : c));
  const removeCol = (i) => setCols(cols.filter((_, idx) => idx !== i));
  const addCol = () => setCols([...cols, { id: `c${Date.now()}`, name: "Nueva columna", color: "#9a9286" }]);

  return (
    <div className="onb">
      <aside className="onb__nav">
        <div className="onb__brand">
          <div className="login__brand-mark">K</div>
          <span>Kandex</span>
        </div>
        <div className="onb__steps">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`onb__step ${step === i ? "onb__step--active" : ""} ${step > i ? "onb__step--done" : ""}`}
              onClick={() => setStep(i)}
            >
              <div className="onb__step-num">
                {step > i ? <Icon name="check" className="icon icon--sm" /> : i + 1}
              </div>
              <div className="onb__step-body">
                <div className="onb__step-title">{s.title}</div>
                <div className="onb__step-sub">{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "auto", fontSize: 11, color: "var(--fg-muted)", lineHeight: 1.5 }}>
          ¿Necesitas ayuda?<br />
          <a style={{ color: "var(--fg)", cursor: "pointer" }}>Ver guía rápida →</a>
        </div>
      </aside>

      <div className="onb__main">
        <div className="onb__progress">
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: ".08em" }}>
            Paso {step + 1} de {steps.length}
          </span>
          <div className="onb__progress-track">
            <div className="onb__progress-fill" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
          </div>
          <span style={{ fontSize: 11, color: "var(--fg-muted)" }}>~2 min</span>
        </div>

        <div className="onb__main-inner">
          {step === 0 && (
            <>
              <h2>Cuéntanos sobre tu equipo</h2>
              <p className="onb__sub">Tu workspace es donde viven todos tus proyectos y tableros.</p>

              <div className="field">
                <label className="field__label">Nombre del workspace</label>
                <input className="input input--lg" value={wsName} onChange={e => setWsName(e.target.value)} />
              </div>
              <div className="field">
                <label className="field__label">Ícono</label>
                <div className="workspace-icon-row">
                  {ICON_OPTIONS.map((o, i) => (
                    <div
                      key={i}
                      className={`workspace-icon ${wsIcon === i ? "workspace-icon--selected" : ""}`}
                      style={{ background: o.bg, color: "white" }}
                      onClick={() => setWsIcon(i)}
                    >{o.ch}</div>
                  ))}
                </div>
              </div>
              <div className="field">
                <label className="field__label">URL del workspace</label>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: "var(--fg-muted)", fontFamily: "var(--font-mono)", fontSize: 13 }}>kandex.app/</span>
                  <input className="input" value={wsName.toLowerCase().replace(/\s+/g, "-")} readOnly style={{ flex: 1 }} />
                </div>
              </div>

              <div className="onb__cta-row">
                <span style={{ fontSize: 12, color: "var(--fg-muted)" }}>Podrás cambiar esto después en ajustes.</span>
                <button className="btn btn--lg" onClick={next}>
                  Continuar <Icon name="arrowR" className="icon icon--sm" />
                </button>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2>Invita a tu equipo</h2>
              <p className="onb__sub">Trabaja con quien quieras. Puedes saltarte este paso.</p>

              <div className="field">
                <label className="field__label">Correos electrónicos</label>
                <div className="invite-row">
                  <input
                    className="input"
                    placeholder="nombre@empresa.com"
                    value={newInvite}
                    onChange={e => setNewInvite(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addInvite())}
                  />
                  <select className="input select">
                    <option>Editor</option>
                    <option>Admin</option>
                    <option>Lector</option>
                  </select>
                </div>
                <button className="btn btn--ghost btn--sm" style={{ alignSelf: "flex-start" }} onClick={addInvite}>
                  <Icon name="plus" className="icon icon--sm" /> Agregar
                </button>
              </div>

              {invites.length > 0 && (
                <>
                  <label className="field__label" style={{ marginBottom: 8 }}>Pendientes ({invites.length})</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                    {invites.map((inv, i) => (
                      <span key={i} className="invite-chip">
                        <Avatar name={inv.email} size="avatar--xs" />
                        {inv.email}
                        <span className="invite-chip__role">{inv.role}</span>
                        <span className="invite-chip__x" onClick={() => setInvites(invites.filter((_, idx) => idx !== i))}>
                          <Icon name="x" className="icon icon--sm" />
                        </span>
                      </span>
                    ))}
                  </div>
                </>
              )}

              <div className="onb__cta-row">
                <button className="btn btn--quiet" onClick={next}>Saltar este paso</button>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn--ghost btn--lg" onClick={back}>Atrás</button>
                  <button className="btn btn--lg" onClick={next}>
                    Enviar invitaciones <Icon name="arrowR" className="icon icon--sm" />
                  </button>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2>Tu primer proyecto</h2>
              <p className="onb__sub">Elige una plantilla para empezar más rápido.</p>

              <div className="field">
                <label className="field__label">Nombre del proyecto</label>
                <input className="input input--lg" value={projectName} onChange={e => setProjectName(e.target.value)} />
              </div>

              <label className="field__label" style={{ marginBottom: 10, display: "block" }}>Plantilla</label>
              <div className="template-grid">
                {TEMPLATES.map(t => (
                  <div
                    key={t.id}
                    className={`template-card ${template === t.id ? "template-card--selected" : ""}`}
                    onClick={() => setTemplate(t.id)}
                  >
                    <div className="template-card__icon">{t.icon}</div>
                    <div className="template-card__title">{t.title}</div>
                    <div className="template-card__desc">{t.desc}</div>
                  </div>
                ))}
              </div>

              <div className="onb__cta-row">
                <button className="btn btn--ghost btn--lg" onClick={back}>Atrás</button>
                <button className="btn btn--lg" onClick={next}>
                  Continuar <Icon name="arrowR" className="icon icon--sm" />
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2>Configura tu tablero</h2>
              <p className="onb__sub">Personaliza las columnas. Podrás cambiarlas en cualquier momento.</p>

              <label className="field__label" style={{ marginBottom: 10, display: "block" }}>Columnas</label>
              <div className="column-builder">
                {cols.map((c, i) => (
                  <div key={c.id} className="column-builder__row">
                    <div className="row" style={{ gap: 8 }}>
                      <span className="column-builder__handle"><Icon name="drag" className="icon icon--sm" /></span>
                      <span className="column-builder__dot" style={{ background: c.color }} />
                    </div>
                    <input
                      className="column-builder__name"
                      value={c.name}
                      onChange={e => updateCol(i, { name: e.target.value })}
                    />
                    <span className="column-builder__x" onClick={() => removeCol(i)}>
                      <Icon name="x" className="icon icon--sm" />
                    </span>
                  </div>
                ))}
                <button className="btn btn--ghost btn--sm" onClick={addCol} style={{ alignSelf: "flex-start" }}>
                  <Icon name="plus" className="icon icon--sm" /> Agregar columna
                </button>
              </div>

              <div className="onb__cta-row">
                <button className="btn btn--ghost btn--lg" onClick={back}>Atrás</button>
                <button className="btn btn--lg btn--accent" onClick={next}>
                  Crear tablero y entrar <Icon name="arrowR" className="icon icon--sm" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

window.OnboardingPage = OnboardingPage;
