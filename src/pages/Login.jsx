import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleLogin(event) {
        event.preventDefault();
        setError("");

        if (!email.trim() || !password.trim()) {
            setError("Заполните email и пароль");
            return;
        }

        try {
            setLoading(true);
            const data = await loginUser(email, password);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="login-section">
            <h2>Вход в аккаунт</h2>

            <form className="login-form" onSubmit={handleLogin}>
                {error && <div className="error-message" style={{color: 'red'}}>{error}</div>}

                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Введите email"
                    disabled={loading}
                />

                <label htmlFor="password">Пароль</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Введите пароль"
                    disabled={loading}
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Загрузка..." : "Войти"}
                </button>
            </form>
        </section>
    );
}

export default Login;