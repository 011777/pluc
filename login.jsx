import { useState } from "react";
import { login } from "../services/auth";

export default function Login({ goToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, password);
      // Firebase auth listener will switch to Dashboard
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />

      <button onClick={handleLogin}>Login</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={goToSignup}>Create account</button>
    </div>
  );
}
