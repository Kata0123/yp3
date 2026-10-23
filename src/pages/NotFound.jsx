
import { Link } from "react-router-dom";

function NotFound() {
    return (
        <section className="not-found">
            <h2>404 — Страница не найдена</h2>
            <p>Такой страницы не существует.</p>
            <Link to="/">Вернуться в каталог</Link>
        </section>
    );
}

export default NotFound;
