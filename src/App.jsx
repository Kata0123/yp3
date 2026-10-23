import { useEffect } from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import { useCart } from "./context/CartContext";
import { useTheme } from "./context/ThemeContext";
import Catalog from "./pages/Catalog";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

function App() {
  const { cart } = useCart();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleStorageChange = () => {
      window.location.reload();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
      <div className={`app ${theme}`}>
        <header className="header">
          <h1>Shop</h1>

          <nav>
            <NavLink to="/" end>
              Каталог
            </NavLink>

            <NavLink to="/cart">
              Корзина ({totalCount})
            </NavLink>

            <NavLink to="/login">
              Вход
            </NavLink>

            <NavLink to="/register">
              Регистрация
            </NavLink>

            <NavLink to="/dashboard">
              Кабинет
            </NavLink>
          </nav>

          <button onClick={toggleTheme}>
            {theme === "light" ? "Тёмная тема" : "Светлая тема"}
          </button>
        </header>

        <main className="container">
          <Routes>
            <Route path="/" element={<Catalog />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
  );
}

export default App;