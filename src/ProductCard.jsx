import { useState } from 'react';

function ProductCard({ title, price, imageUrl }) {
    const [count, setCount] = useState(0);

    const handleAddToCart = () => {
        setCount(count + 1);
    };

    const handleRemoveFromCart = () => {
        if (count > 0) {
            setCount(count - 1);
        }
    };

    return (
        <div className="product-card">
            <img src={imageUrl} alt={title} className="product-image" />

            <h3 className="product-title">{title}</h3>
            <p className="product-price">Цена: {price} ₽</p>

            <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Добавить в корзину
            </button>

            <button
                className="remove-from-cart-btn"
                onClick={handleRemoveFromCart}
                disabled={count === 0}
            >
                Удалить из корзины
            </button>

            <p className="product-count">В корзине: {count} шт.</p>
        </div>
    );
}

export default ProductCard;