import React, { useState } from "react";

export default function App() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      setMsg(`Usuario creado: ${data.email}`);
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Registro</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>Nombre</label><br />
          <input name="name" value={form.name} onChange={onChange} required />
        </div>
        <div>
          <label>Email</label><br />
          <input type="email" name="email" value={form.email} onChange={onChange} required />
        </div>
        <div>
          <label>Contraseña</label><br />
          <input type="password" name="password" value={form.password} onChange={onChange} required />
        </div>
        <button type="submit" style={{ marginTop: 12 }}>Crear cuenta</button>
      </form>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}

      <hr />
      <a href="http://localhost:3000/api/users" target="_blank" rel="noreferrer">Ver usuarios (JSON)</a>
    </div>
  );
}
