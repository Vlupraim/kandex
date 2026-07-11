/* global React, ReactDOM, LoginPage, OnboardingPage, KanbanApp, TweaksPanel, useTweaks, TweakSection, TweakRadio */
const { useState: useStateApp, useEffect: useEffectApp } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "stage": "auto"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [stage, setStage] = useStateApp("login"); // 'login' | 'onboarding' | 'app'
  const [workspace, setWorkspace] = useStateApp({ name: "Estudio Romero", icon: { ch: "K", bg: "#d97757" } });
  const [signupMode, setSignupMode] = useStateApp(false);

  // theme
  useEffectApp(() => {
    document.documentElement.setAttribute("data-theme", tweaks.theme === "dark" ? "dark" : "light");
  }, [tweaks.theme]);

  // tweak-controlled stage override (so reviewers can jump)
  useEffectApp(() => {
    if (tweaks.stage && tweaks.stage !== "auto") setStage(tweaks.stage);
  }, [tweaks.stage]);

  return (
    <div className="app">
      {stage === "login" && (
        <LoginPage
          mode={signupMode ? "signup" : "signin"}
          onSwitchSignup={() => setSignupMode(s => !s)}
          onSignIn={() => setStage(signupMode ? "onboarding" : "app")}
        />
      )}
      {stage === "onboarding" && (
        <OnboardingPage onComplete={(data) => {
          setWorkspace({ name: data.wsName, icon: data.wsIcon });
          setStage("app");
        }} />
      )}
      {stage === "app" && (
        <KanbanApp workspace={workspace} />
      )}

      {/* Stage rail (always visible, lets reviewer jump between flows) */}
      <div className="proto-rail" role="navigation" aria-label="Navegación de prototipo">
        <button
          className={`proto-rail__btn ${stage === "login" ? "proto-rail__btn--active" : ""}`}
          onClick={() => { setStage("login"); setSignupMode(false); }}
        >Login</button>
        <button
          className={`proto-rail__btn ${stage === "login" && signupMode ? "proto-rail__btn--active" : ""}`}
          onClick={() => { setStage("login"); setSignupMode(true); }}
        >Sign up</button>
        <button
          className={`proto-rail__btn ${stage === "onboarding" ? "proto-rail__btn--active" : ""}`}
          onClick={() => setStage("onboarding")}
        >Onboarding</button>
        <button
          className={`proto-rail__btn ${stage === "app" ? "proto-rail__btn--active" : ""}`}
          onClick={() => setStage("app")}
        >Tablero</button>
        <span className="proto-rail__sep" />
        <button
          className="proto-rail__btn"
          onClick={() => setTweak("theme", tweaks.theme === "dark" ? "light" : "dark")}
        >{tweaks.theme === "dark" ? "☼ Claro" : "☾ Oscuro"}</button>
      </div>

      <TweaksPanel title="Tweaks" defaultOpen={false}>
        <TweakSection title="Tema">
          <TweakRadio
            label="Modo"
            value={tweaks.theme}
            onChange={(v) => setTweak("theme", v)}
            options={[{ value: "light", label: "Claro" }, { value: "dark", label: "Oscuro" }]}
          />
        </TweakSection>
        <TweakSection title="Pantalla">
          <TweakRadio
            label="Etapa"
            value={tweaks.stage}
            onChange={(v) => setTweak("stage", v)}
            options={[
              { value: "login", label: "Login" },
              { value: "onboarding", label: "Onboard" },
              { value: "app", label: "Tablero" },
            ]}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
