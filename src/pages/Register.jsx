import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/api";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleRegister(event) {
        event.preventDefault();
        setError("");

        if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
            setError("Заполните все поля");
            return;
        }

        if (password !== confirmPassword) {
            setError("Пароли не совпадают");
            return;
        }

        if (password.length < 6) {
            setError("Пароль должен содержать минимум 6 символов");
            return;
        }

        try {
            setLoading(true);
            const data = await registerUser(email, password);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="login-section">
            <h2>Регистрация</h2>

            <form className="login-form" onSubmit={handleRegister}>
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

                <label htmlFor="confirmPassword">Повторите пароль</label>
                <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Повторите пароль"
                    disabled={loading}
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Загрузка..." : "Зарегистрироваться"}
                </button>
            </form>

            <p style={{marginTop: '15px'}}>
                Уже есть аккаунт? <Link to="/login">Войти</Link>
            </p>
        </section>
    );
}

export default Register;