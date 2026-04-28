import { useState } from "react";
import { EMAIL_PATTERN } from "../utils/format.js";
import "./AuthPage.css";

export function AuthPage({ submitAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "demo@cinema.com", password: "123456" });

  function switchMode(nextMode) {
    setMode(nextMode);
    setForm(
      nextMode === "login"
        ? { name: "", email: "demo@cinema.com", password: "123456" }
        : { name: "", email: "", password: "" }
    );
  }

  return (
    <section className="auth-card">
      <div className="tabs">
        <button type="button" className={mode === "login" ? "active" : ""} onClick={() => switchMode("login")}>Login</button>
        <button type="button" className={mode === "signup" ? "active" : ""} onClick={() => switchMode("signup")}>Sign up</button>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); submitAuth(mode, form); }}>
        {mode === "signup" && (
          <label>Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        )}
        <label>
          Email
          <input
            required
            type="email"
            pattern={EMAIL_PATTERN}
            title="Use a valid email like name@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
        <label>
          Password
          <input
            required
            minLength={6}
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>
        <button className="primary">{mode === "login" ? "Login" : "Create account"}</button>
      </form>
    </section>
  );
}
