import { useState } from "react";
import { signup } from "../services/auth";

export default function Signup({ goToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      await signup(email, password);
      // Firebase auth listener will show Dashboard
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>

      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />

      <button onClick={handleSignup}>Create Account</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={goToLogin}>Back to Login</button>
    </div>
  );
}
