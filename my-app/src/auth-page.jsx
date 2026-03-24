import { useState } from "react";
import HomePage from "./HomePage";
import { signInWithGoogle } from "./firebase";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #0a0a0f; min-height: 100vh; }
  .auth-root { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0a0a0f; position: relative; overflow: hidden; padding: 24px; }
  .bg-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(139,92,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.05) 1px, transparent 1px); background-size: 40px 40px; pointer-events: none; }
  .bg-glow { position: absolute; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%); top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none; }
  .card { width: 100%; max-width: 420px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 40px; backdrop-filter: blur(20px); position: relative; z-index: 1; }
  .tabs { display: flex; background: rgba(255,255,255,0.05); border-radius: 12px; padding: 4px; margin-bottom: 32px; gap: 4px; }
  .tab { flex: 1; padding: 10px; border: none; background: transparent; color: #6b7280; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; border-radius: 9px; cursor: pointer; transition: all 0.2s; }
  .tab.active { background: rgba(139,92,246,0.2); color: #a78bfa; border: 1px solid rgba(139,92,246,0.3); }
  .tab:hover:not(.active) { color: #d1d5db; background: rgba(255,255,255,0.05); }
  .form-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 6px; letter-spacing: -0.3px; }
  .form-subtitle { font-size: 13px; color: #6b7280; margin-bottom: 28px; }
  .form-group { margin-bottom: 16px; }
  .form-label { display: block; font-size: 12px; font-weight: 500; color: #9ca3af; margin-bottom: 7px; letter-spacing: 0.3px; text-transform: uppercase; }
  .form-input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px 16px; color: #ffffff; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: all 0.2s; }
  .form-input::placeholder { color: #4b5563; }
  .form-input:focus { border-color: rgba(139,92,246,0.5); background: rgba(139,92,246,0.05); box-shadow: 0 0 0 3px rgba(139,92,246,0.1); }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .forgot-link { display: block; text-align: right; font-size: 12px; color: #8b5cf6; margin-bottom: 20px; margin-top: -8px; cursor: pointer; }
  .forgot-link:hover { color: #a78bfa; }
  .submit-btn { width: 100%; padding: 13px; background: linear-gradient(135deg, #8b5cf6, #6d28d9); border: none; border-radius: 12px; color: #ffffff; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500; cursor: pointer; transition: all 0.2s; margin-top: 4px; }
  .submit-btn:hover { background: linear-gradient(135deg, #a78bfa, #8b5cf6); transform: translateY(-1px); box-shadow: 0 8px 25px rgba(139,92,246,0.35); }
  .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; }
  .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
  .divider-text { font-size: 12px; color: #4b5563; }
  .oauth-btn { width: 100%; padding: 11px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #d1d5db; font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.2s; }
  .oauth-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); color: #ffffff; }
  .oauth-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .terms { font-size: 11px; color: #4b5563; text-align: center; margin-top: 20px; line-height: 1.6; }
  .terms a { color: #8b5cf6; cursor: pointer; }
  .success-msg { display: flex; align-items: center; gap: 10px; background: rgba(6,182,212,0.08); border: 1px solid rgba(6,182,212,0.2); border-radius: 10px; padding: 12px 16px; margin-bottom: 16px; }
  .success-dot { width: 8px; height: 8px; border-radius: 50%; background: #06b6d4; flex-shrink: 0; }
  .success-text { font-size: 13px; color: #67e8f9; }
  .error-msg { display: flex; align-items: center; gap: 10px; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); border-radius: 10px; padding: 12px 16px; margin-bottom: 16px; }
  .error-dot { width: 8px; height: 8px; border-radius: 50%; background: #ef4444; flex-shrink: 0; }
  .error-text { font-size: 13px; color: #fca5a5; }
`;

export default function AuthPage() {
  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "", firstName: "", lastName: "", confirmPassword: "" });
  const [token, setToken] = useState(() => localStorage.getItem("jwt_token") || "");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const clearMessages = () => { setSuccess(""); setError(""); };

  const handleGoogle = async () => {
    setLoading(true);
    clearMessages();
    try {
      const result = await signInWithGoogle();
      const firebaseToken = await result.user.getIdToken();
      setToken(firebaseToken);
      localStorage.setItem("jwt_token", firebaseToken);
      setSuccess(`Welcome, ${result.user.displayName}!`);
    } catch (err) {
      setError("Google sign-in failed. Try again.");
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) return setError("Please fill in all fields.");
    setLoading(true);
    clearMessages();
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Welcome back!");
        setToken(data.token);
        localStorage.setItem("jwt_token", data.token);
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Network error. Try again.");
    }
    setLoading(false);
  };

  const handleSignup = async () => {
    if (!form.email || !form.password || !form.firstName) return setError("Please fill in all fields.");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    clearMessages();
    try {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Account created successfully!");
        setToken(data.token);
        localStorage.setItem("jwt_token", data.token);
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      setError("Network error. Try again.");
    }
    setLoading(false);
  };

  if (token) {
    return <HomePage />;
  }
  return (
    <>
      <style>{styles}</style>
      <div className="auth-root">
        <div className="bg-grid" />
        <div className="bg-glow" />
        <div className="card">
          <div className="tabs">
            <button className={`tab ${tab === "login" ? "active" : ""}`} onClick={() => { setTab("login"); clearMessages(); }}>Login</button>
            <button className={`tab ${tab === "signup" ? "active" : ""}`} onClick={() => { setTab("signup"); clearMessages(); }}>Sign Up</button>
          </div>

          {success && <div className="success-msg"><div className="success-dot" /><span className="success-text">{success}</span></div>}
          {error && <div className="error-msg"><div className="error-dot" /><span className="error-text">{error}</span></div>}

          {tab === "login" ? (
            <>
              <div className="form-title">Welcome back</div>
              <div className="form-subtitle">Sign in to your account</div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
              </div>
              <a className="forgot-link">Forgot password?</a>
              <button className="submit-btn" onClick={handleLogin} disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
              <div className="divider"><div className="divider-line" /><span className="divider-text">or</span><div className="divider-line" /></div>
              <button className="oauth-btn" onClick={handleGoogle} disabled={loading}>
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </>
          ) : (
            <>
              <div className="form-title">Create an account</div>
              <div className="form-subtitle">Get started for free</div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input className="form-input" name="firstName" placeholder="John" value={form.firstName} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input className="form-input" name="lastName" placeholder="Doe" value={form.lastName} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input className="form-input" name="confirmPassword" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} />
              </div>
              <button className="submit-btn" onClick={handleSignup} disabled={loading} style={{ marginTop: "8px" }}>{loading ? "Creating account..." : "Create Account"}</button>
              <div className="terms">By signing up, you agree to our <a>Terms of Service</a> and <a>Privacy Policy</a></div>
            </>
          )}
        </div>
      </div>
    </>
  );
}