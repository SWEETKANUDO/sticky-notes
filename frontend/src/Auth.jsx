import { useState } from "react";
import './Auth.css'

function Auth({ onLogin }) {
    const [isSignup, setIsSignup] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const endpoint = isSignup ? "signup" : "login";

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/${endpoint}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            if (isSignup) {
                setIsSignup(false);
                setPassword("");
                setError("Signup successful! Please login.");
                setLoading(false);
                return;
            }

            onLogin(data.token, data.user);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-logo">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="48" height="48">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <h1>Sticky Notes</h1>
                </div>

                <p>
                    {isSignup ? "Create your account" : "Welcome back"}
                </p>

                {isSignup && (
                    <input
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                )}

                <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password (minimum 8 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? (
                        <>
                            <span className="auth-spinner"></span>
                            {isSignup ? "Signing Up..." : "Logging in..."}
                        </>
                    ) : (
                        isSignup ? "Sign Up" : "Login"
                    )}
                </button>

                {error && <p role="status" className="error-message">{error}</p>}

                <p>
                    {isSignup
                        ? "Already have an account?"
                        : "Don't have an account?"}

                    <button
                        type="button"
                        onClick={() => {
                            setIsSignup(!isSignup);
                            setError("");
                        }}
                        disabled={loading}
                    >
                        {isSignup ? "Login" : "Sign Up"}
                    </button>
                </p>
            </form>
        </div>
    );
}

export default Auth;