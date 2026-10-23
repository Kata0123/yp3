import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
    const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();

    const user = JSON.parse(localStorage.getItem("user"));
    const userDiscount = user?.discount || 0;

    const subtotal = cart.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
    );

    const finalTotal = subtotal - (subtotal * userDiscount / 100);

    return (
        <section>
            <h2>Корзина</h2>

            {cart.length === 0 ? (
                <div className="empty-cart">
                    <p>Корзина пока пуста.</p>
                    <Link to="/">Перейти в каталог</Link>
                </div>
            ) : (
                <>
                    <div className="cart-list">
                        {cart.map((product) => (
                            <div className="cart-item" key={product.id}>
                                <div className="cart-item-info">
                                    <h3>{product.name}</h3>
                                    <p>{product.price.toLocaleString("ru-RU")} ₽</p>
                                </div>

                                <div className="quantity-controls">
                                    <button onClick={() => decreaseQuantity(product.id)}>−</button>
                                    <span>{product.quantity}</span>
                                    <button onClick={() => increaseQuantity(product.id)}>+</button>
                                </div>

                                <button
                                    className="delete-button"
                                    onClick={() => removeFromCart(product.id)}
                                >
                                    Удалить
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-total">
                        {userDiscount > 0 && (
                            <p style={{ color: 'green' }}>
                                Ваша персональная скидка: {userDiscount}%
                            </p>
                        )}
                        <h3>
                            Итого: {finalTotal.toLocaleString("ru-RU")} ₽
                        </h3>
                        <Link to="/">Продолжить покупки</Link>
                    </div>
                </>
            )}
        </section>
    );
}

export default Cart;