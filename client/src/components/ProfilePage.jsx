import React from "react";
import { useState } from "react";
import { KeyRound, Trash2, UserRound } from "lucide-react";
import { AuthPrompt } from "./AuthPrompt.jsx";
import "./AuthPage.css";
import "./ProfilePage.css";

export function ProfilePage({ user, logout, changePassword, deleteAccount }) {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");

  if (!user) return <AuthPrompt />;

  async function submitPassword(e) {
    e.preventDefault();
    const result = await changePassword(form);
    setMessage(result);
    if (result) setForm({ currentPassword: "", newPassword: "" });
  }

  return (
    <section className="panel profile">
      <UserRound size={42} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p>{user.points} reward points</p>
      {message && <div className="success">{message}</div>}
      <form className="profile-form" onSubmit={submitPassword}>
        <h3><KeyRound size={18} /> Change Password</h3>
        <label>
          Current password
          <input
            required
            type="password"
            value={form.currentPassword}
            onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
          />
        </label>
        <label>
          New password
          <input
            required
            minLength="6"
            type="password"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          />
        </label>
        <button className="primary">Change Password</button>
      </form>
      <button
        className="danger"
        onClick={() => {
          if (window.confirm("Delete your account and all bookings?")) deleteAccount();
        }}
      >
        <Trash2 size={18} /> Delete Account
      </button>
      <button className="secondary" onClick={logout}>Logout</button>
    </section>
  );
}
