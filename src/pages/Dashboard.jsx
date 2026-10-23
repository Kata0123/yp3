import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    function handleLogout() {
        localStorage.removeItem("user");
        navigate("/login");
    }

    if (!user) {
        return (
            <section className="dashboard" style={{ textAlign: 'center', padding: '40px' }}>
                <h2>Личный кабинет</h2>
                <p>Вы не авторизованы. Пожалуйста, войдите в аккаунт.</p>
                <Link to="/login" style={{ display: 'inline-block', marginTop: '20px', padding: '10px 20px', background: 'var(--button)', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
                    Пройти вход
                </Link>
            </section>
        );
    }

    const roleName = user.role_id === 1 ? "Администратор" : "Клиент";

    return (
        <section className="dashboard">
            <h2>Личный кабинет</h2>

            <div style={{ background: 'var(--bg)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '20px' }}>
                <h3 style={{ marginTop: 0 }}>Данные учетной записи</h3>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Роль:</strong> {roleName}</p>
                <p><strong>Персональная скидка:</strong> {user.discount}%</p>
            </div>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <Link to="/" style={{ color: 'var(--button)' }}>Перейти в каталог</Link>
                <button
                    onClick={handleLogout}
                    style={{ background: '#d93649', padding: '8px 16px', fontSize: '14px' }}
                >
                    Выйти
                </button>
            </div>
        </section>
    );
}

export default Dashboard;