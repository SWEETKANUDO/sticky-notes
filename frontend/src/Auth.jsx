import { useState } from "react";
import './Auth.css'

function Auth({ onLogin }) {
    const [isSignup, setIsSignup] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        const endpoint = isSignup ? "signup" : "login";

        try {
            const response = await fetch(
                `http://localhost:3000/api/auth/${endpoint}`,
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
                return;
            }

            onLogin(data.token, data.user);
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h1>Sticky Notes</h1>

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

                <button type="submit">
                    {isSignup ? "Sign Up" : "Login"}
                </button>

                {error && <p role="status">{error}</p>}

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
                    >
                        {isSignup ? "Login" : "Sign Up"}
                    </button>
                </p>
            </form>
        </div>
    );
}

export default Auth;