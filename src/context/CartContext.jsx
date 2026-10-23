import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user ? user.id : "guest";
        setCurrentUserId(userId);

        const STORAGE_KEY = `cart_${userId}`;
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            const parsed = saved ? JSON.parse(saved) : [];
            if (!Array.isArray(parsed)) {
                setCart([]);
                return;
            }
            const merged = parsed.reduce((acc, item) => {
                const existing = acc.find((i) => i.id === item.id);
                if (existing) {
                    existing.quantity += item.quantity ?? 1;
                } else {
                    acc.push({ ...item, quantity: item.quantity ?? 1 });
                }
                return acc;
            }, []);
            setCart(merged);
        } catch {
            setCart([]);
        }
    }, []);

    useEffect(() => {
        if (currentUserId !== null) {
            const STORAGE_KEY = `cart_${currentUserId}`;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        }
    }, [cart, currentUserId]);

    function addToCart(product) {
        setCart((prevCart) => {
            const existing = prevCart.find((item) => item.id === product.id);
            if (existing) {
                return prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    }

    function removeFromCart(id) {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    }

    function increaseQuantity(id) {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    }

    function decreaseQuantity(id) {
        setCart((prevCart) =>
            prevCart
                .map((item) =>
                    item.id === id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    }

    function clearCart() {
        setCart([]);
    }

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                increaseQuantity,
                decreaseQuantity,
                clearCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}