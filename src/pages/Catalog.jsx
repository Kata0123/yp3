import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getServices, getCategories, addCategory } from "../api/api";

function Catalog() {
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newCatName, setNewCatName] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));

    const loadData = async () => {
        try {
            setLoading(true);
            const [s, c] = await Promise.all([getServices(), getCategories()]);
            setServices(s);
            setCategories(c);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCatName.trim()) return;
        try {
            await addCategory(newCatName, user?.role_id);
            setNewCatName("");
            loadData();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleCategoryToggle = (id) => {
        setSelectedCategories(prev =>
            prev.includes(id) ? prev.filter(catId => catId !== id) : [...prev, id]
        );
    };

    const handleBookNow = (product) => {
        const hasDiscount = product.discount > 0;
        const finalPrice = hasDiscount
            ? product.price - (product.price * product.discount / 100)
            : product.price;

        addToCart({ ...product, price: finalPrice });
        navigate("/cart");
    };

    if (loading) return <div className="loading">Загрузка каталога...</div>;
    if (error) return <div className="error">Ошибка: {error}</div>;

    const filtered = selectedCategories.length === 0
        ? services
        : services.filter(s => selectedCategories.includes(s.category_id));

    return (
        <div className="catalog-layout">
            <aside className="categories-sidebar">
                <h3>Категории</h3>
                <div className="category-list">
                    {categories.map(c => (
                        <label key={c.id} className="category-label">
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(c.id)}
                                onChange={() => handleCategoryToggle(c.id)}
                            />
                            <span>{c.name}</span>
                        </label>
                    ))}
                </div>

                {user?.role_id === 1 && (
                    <form onSubmit={handleAddCategory} className="admin-category-form">
                        <p className="admin-title">Админ-панель</p>
                        <input
                            value={newCatName}
                            onChange={e => setNewCatName(e.target.value)}
                            placeholder="Название категории"
                            className="admin-input"
                        />
                        <button type="submit" className="admin-btn">Добавить</button>
                    </form>
                )}
            </aside>

            <div className="catalog-content">
                <h2>Каталог услуг</h2>
                <div className="products">
                    {filtered.map(product => {
                        const hasDiscount = product.discount > 0;
                        const finalPrice = hasDiscount
                            ? product.price - (product.price * product.discount / 100)
                            : product.price;

                        return (
                            <article className="product-card" key={product.id}>
                                <img className="product-image" src={`/images/${product.id}.png`} alt={product.name} onError={(e) => e.target.src='https://via.placeholder.com/150'} />
                                <h3>{product.name}</h3>
                                <p>{product.description}</p>

                                <div className="price-block">
                                    {hasDiscount ? (
                                        <>
                                            <s className="old-price">{product.price} ₽</s>
                                            <span className="new-price">{finalPrice} ₽</span>
                                            <span className="discount-badge">-{product.discount}%</span>
                                        </>
                                    ) : (
                                        <span className="regular-price">{product.price} ₽</span>
                                    )}
                                </div>

                                <div className="product-actions">
                                    <button onClick={() => addToCart({ ...product, price: finalPrice })}>В корзину</button>
                                    <button className="book-btn" onClick={() => handleBookNow(product)}>Записаться</button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Catalog;