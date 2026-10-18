import { useState } from "react";

type Props = { onEnter: () => void };

export default function Login({ onEnter }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setMessage("Enter an email and password to preview the sign-in flow, or explore as a guest.");
      return;
    }
    setMessage("This prototype has no live account service yet. Opening the demo newsroom instead.");
    window.setTimeout(onEnter, 650);
  };

  return (
    <main className="login-shell">
      <div className="login-topline"><span>INDEPENDENT NEWS CONCEPT</span><span>EDITION 001</span></div>
      <section className="login-layout">
        <div className="login-brand-panel">
          <div className="login-logo"><span>THE DAILY</span><strong>DROP<span>.</span></strong></div>
          <div className="login-kicker"><i /> THE WORLD, IN FOCUS</div>
          <h1>The important stories.<br/><em>Without the noise.</em></h1>
          <p>A sharper view of what matters — from breaking developments to the stories everyone is debating.</p>
          <div className="login-preview">
            <div className="login-preview-image" />
            <div><small>YOUR DAILY BRIEFING</small><b>Get informed. Stay curious.</b><span>World · Culture · Technology · Business</span></div>
          </div>
        </div>
        <div className="login-card">
          <div className="login-card-mark">DD<span>.</span></div>
          <p className="login-eyebrow">WELCOME TO THE NEWSROOM</p>
          <h2>Good to see you.</h2>
          <p className="login-subtitle">Sign in to continue to The Daily Drop.</p>
          <form onSubmit={submit}>
            <label>Email address<input type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} /></label>
            <label>Password<span className="login-password-wrap"><input type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} /><button type="button" onClick={() => setShowPassword(v => !v)}>{showPassword ? "Hide" : "Show"}</button></span></label>
            {message && <p className="login-message" role="status">{message}</p>}
            <button className="login-submit" type="submit">Sign in <span>↗</span></button>
          </form>
          <div className="login-or"><span /> OR <span /></div>
          <button className="login-guest" onClick={onEnter}>Explore the newsroom as a guest <span>→</span></button>
          <p className="login-footnote">Prototype preview · Sign-in is illustrative only. No account is created and credentials are not sent to a server.</p>
        </div>
      </section>
      <footer className="login-footer"><span>THE DAILY DROP<span className="login-red">.</span></span><span>NEWS · CONTEXT · CLARITY</span></footer>
    </main>
  );
}
