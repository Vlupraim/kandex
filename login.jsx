/* global React */
const { useState: useStateLogin } = React;

function LoginPage({ onSignIn, onSwitchSignup, mode = "signin" }) {
  const [email, setEmail] = useStateLogin("alex@kandex.app");
  const [pwd, setPwd] = useStateLogin("••••••••••");
  const [show, setShow] = useStateLogin(false);
  const isSignup = mode === "signup";

  return (
    <div className="login">
      <section className="login__form-side">
        <div className="login__brand">
          <div className="login__brand-mark">K</div>
          <span>Kandex</span>
        </div>

        <div className="login__form-wrap">
          <div className="login__eyebrow">{isSignup ? "Crea tu cuenta" : "Bienvenido de vuelta"}</div>
          <h1>{isSignup ? "Empieza a organizar" : "Ingresa a tu espacio"}</h1>
          <p className="login__sub">
            {isSignup
              ? "30 días gratis. Sin tarjeta. Cancela cuando quieras."
              : "Tus tableros, tus proyectos, tu equipo — todo en un solo lugar."}
          </p>

          <form onSubmit={(e) => { e.preventDefault(); onSignIn(); }}>
            {isSignup && (
              <div className="field">
                <label className="field__label">Nombre completo</label>
                <input className="input input--lg" defaultValue="Alex Romero" />
              </div>
            )}
            <div className="field">
              <label className="field__label">Correo electrónico</label>
              <input
                className="input input--lg"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="field">
              <div className="field__row">
                <label className="field__label">Contraseña</label>
                {!isSignup && <a className="field__hint-link">¿Olvidaste tu contraseña?</a>}
              </div>
              <div style={{ position: "relative" }}>
                <input
                  className="input input--lg"
                  type={show ? "text" : "password"}
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  style={{ paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShow(s => !s)}
                  style={{
                    position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                    background: "transparent", border: 0, cursor: "pointer", color: "var(--fg-muted)",
                    padding: 6, borderRadius: 6
                  }}>
                  <Icon name={show ? "eyeOff" : "eye"} />
                </button>
              </div>
            </div>

            <button className="btn btn--block btn--lg" style={{ marginTop: 8 }} type="submit">
              {isSignup ? "Crear cuenta" : "Entrar a Kandex"}
              <Icon name="arrowR" className="icon icon--sm" />
            </button>

            <div className="divider">o continuar con</div>

            <div className="oauth-row">
              <button type="button" className="btn btn--ghost">
                <Icon name="google" />
                Google
              </button>
              <button type="button" className="btn btn--ghost">
                <Icon name="github" />
                GitHub
              </button>
            </div>
          </form>

          <p className="login__sub" style={{ marginTop: 24, marginBottom: 0, fontSize: 13 }}>
            {isSignup ? (
              <>¿Ya tienes una cuenta? <a onClick={onSwitchSignup} style={{ color: "var(--fg)", cursor: "pointer", fontWeight: 500 }}>Inicia sesión</a></>
            ) : (
              <>¿Aún no tienes cuenta? <a onClick={onSwitchSignup} style={{ color: "var(--fg)", cursor: "pointer", fontWeight: 500 }}>Crea una gratis</a></>
            )}
          </p>
        </div>

        <div className="login__foot">
          <span>© 2026 Kandex Labs</span>
          <div style={{ display: "flex", gap: 16 }}>
            <a>Privacidad</a>
            <a>Términos</a>
            <a>Estado</a>
          </div>
        </div>
      </section>

      <aside className="login__art">
        <div className="art-grid-bg" />
        <div className="art-stage">
          <div className="art-board">
            <div className="art-col">
              <div className="art-col__head"><span>Por hacer</span><span className="art-col__count">4</span></div>
              <div className="art-card">
                <div className="row" style={{ gap: 4 }}>
                  <span className="tag tag--amber"><span className="tag-dot"/>Diseño</span>
                </div>
                <div className="art-card__title">Auditar el componente de calendario</div>
                <div className="art-card__row">
                  <div className="art-card__meta">📅 12 may</div>
                  <div className="art-card__avatars">
                    <div style={{ background: "#d97757" }}>AR</div>
                  </div>
                </div>
              </div>
              <div className="art-card">
                <div className="row" style={{ gap: 4 }}>
                  <span className="tag tag--blue"><span className="tag-dot"/>Research</span>
                </div>
                <div className="art-card__title">Entrevistar a 5 usuarios pro</div>
              </div>
              <div className="art-card" style={{ height: 32 }} />
            </div>

            <div className="art-col">
              <div className="art-col__head"><span>En progreso</span><span className="art-col__count">2</span></div>
              <div className="art-card" style={{ borderColor: "var(--accent)", boxShadow: "0 0 0 3px var(--accent-soft)" }}>
                <div className="row" style={{ gap: 4 }}>
                  <span className="tag tag--red"><span className="tag-dot"/>Urgente</span>
                  <span className="tag tag--purple"><span className="tag-dot"/>Móvil</span>
                </div>
                <div className="art-card__title">Onboarding nuevo: rediseño completo</div>
                <div className="art-card__row">
                  <div className="art-card__meta">⚑ Alta · 3/5</div>
                  <div className="art-card__avatars">
                    <div style={{ background: "#3b6e4f" }}>MJ</div>
                    <div style={{ background: "#7a5ba0" }}>SK</div>
                  </div>
                </div>
              </div>
              <div className="art-card">
                <div className="row" style={{ gap: 4 }}>
                  <span className="tag tag--green"><span className="tag-dot"/>Backend</span>
                </div>
                <div className="art-card__title">Rate limit del API público</div>
              </div>
            </div>

            <div className="art-col">
              <div className="art-col__head"><span>Hecho</span><span className="art-col__count">7</span></div>
              <div className="art-card" style={{ opacity: .7 }}>
                <div className="art-card__title" style={{ textDecoration: "line-through", color: "var(--fg-muted)" }}>
                  Migrar tema oscuro a tokens
                </div>
              </div>
              <div className="art-card" style={{ opacity: .7 }}>
                <div className="art-card__title" style={{ textDecoration: "line-through", color: "var(--fg-muted)" }}>
                  Configurar dominio personalizado
                </div>
              </div>
              <div className="art-card" style={{ opacity: .5, height: 28 }} />
            </div>
          </div>
        </div>

        <div className="art-quote">
          <span className="art-quote__bar" />
          <span>Trabajo enfocado, sin las pestañas de siempre.</span>
        </div>
      </aside>
    </div>
  );
}

window.LoginPage = LoginPage;
