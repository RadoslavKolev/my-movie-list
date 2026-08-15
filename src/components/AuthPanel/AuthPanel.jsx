import PropTypes from "prop-types";
import { useState } from "react";
import "./AuthPanel.scss";

function AuthPanel({ onAuthSuccess, onCancel, statusMessage = "" }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const action = mode === "login" ? "signIn" : "signUp";
      const response = await onAuthSuccess({ email, password, action });

      if (response?.error) {
        setError(response.error.message || "Authentication failed.");
      }
    } catch (submitError) {
      setError(submitError.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-badge">MyMovieList</span>
          <h1>{mode === "login" ? "Welcome back" : "Create account"}</h1>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              minLength={6}
              required
            />
          </label>

          {statusMessage && <div className="auth-status">{statusMessage}</div>}
          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Log in" : "Sign up"}
          </button>
        </form>

        <div className="auth-toggle">
          <button type="button" className="auth-flip" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
            {mode === "login" ? "Need an account? Sign up" : "Already have an account? Log in"}
          </button>

          {onCancel && (
            <button type="button" className="auth-cancel" onClick={onCancel}>
              Continue offline
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

AuthPanel.propTypes = {
  onAuthSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  statusMessage: PropTypes.string,
};

export default AuthPanel;
