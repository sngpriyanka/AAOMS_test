// pages/Cart/Cart.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FiMinus, FiPlus, FiX, FiShoppingBag } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./Cart.css";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (id, size, change) => {
    const item = cartItems.find(i => i.id === id && i.size === size);
    if (item) {
      const newQty = item.quantity + change;
      if (newQty > 0) {
        updateQuantity(id, newQty, size);
      }
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal >= 2000 ? 0 : 99;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar alwaysSolid />
        <main className="cart-page cart-page--empty">
          <FiShoppingBag className="cart-page__empty-icon" />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/collection" className="cart-page__shop-btn">
            CONTINUE SHOPPING
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar alwaysSolid />
      <main className="cart-page">
        <div className="cart-page__container">
          <h1 className="cart-page__title">YOUR CART</h1>

          <div className="cart-page__content">
            {/* Items */}
            <div className="cart-page__items">
              <div className="cart-page__items-header">
                <span>PRODUCT</span>
                <span>QUANTITY</span>
                <span>TOTAL</span>
              </div>

              {cartItems.map((item) => (
                <div key={item.id} className="cart-page__item">
                  <div className="cart-page__item-product">
                    <Link
                      to={`/product/${item.id}`}
                      className="cart-page__item-image"
                    >
                      <img src={item.image} alt={item.name} />
                    </Link>
                    <div className="cart-page__item-details">
                      <Link
                        to={`/product/${item.id}`}
                        className="cart-page__item-name"
                      >
                        {item.name}
                      </Link>
                      <p className="cart-page__item-variant">
                        {item.size} / {item.color}
                      </p>
                      <p className="cart-page__item-price">
                        Rs.{item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="cart-page__item-quantity">
                    <div className="cart-page__qty-control">
                      <button onClick={() => handleQuantityChange(item.id, item.size, -1)}>
                        <FiMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(item.id, item.size, 1)}>
                        <FiPlus />
                      </button>
                    </div>
                    <button
                      className="cart-page__item-remove"
                      onClick={() => removeFromCart(item.id, item.size)}
                    >
                      <FiX /> Remove
                    </button>
                  </div>

                  <div className="cart-page__item-total">
                    Rs.{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="cart-page__summary">
              <h3>ORDER SUMMARY</h3>

              <div className="cart-page__summary-row">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="cart-page__summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? "FREE" : `Rs. ${shipping}`}</span>
              </div>
              {shipping > 0 && (
                <p className="cart-page__shipping-note">
                  Free shipping on orders Rs.2,000+
                </p>
              )}

              <div className="cart-page__summary-divider"></div>

              <div className="cart-page__summary-row cart-page__summary-total">
                <span>Total</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>

              <Link to="/checkout" className="cart-page__checkout-btn">
                PROCEED TO CHECKOUT
              </Link>

              <Link to="/collection" className="cart-page__continue">
                Continue Shopping
              </Link>

              <p className="cart-page__secure">🔒 Secure Checkout</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Cart;
