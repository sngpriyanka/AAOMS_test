import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!(token && user));
  }, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (err) {
        console.error('Failed to load cart from localStorage:', err);
      }
    }
  }, []);

  // Load/sync cart from backend when user is authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadCartFromBackend = async () => {
      try {
        setIsLoadingCart(true);
        const response = await api.get('/cart');
        
        if (response.data.success && response.data.data?.items) {
          // Get current localStorage for fallback images
          const savedCart = localStorage.getItem('cart');
          const localCartMap = savedCart ? JSON.parse(savedCart).reduce((map, item) => {
            map[`${item.id}_${item.size}`] = item;
            return map;
          }, {}) : {};

          // Convert backend cart format to local format
          const backendItems = response.data.data.items;
          const localCartItems = backendItems.map(item => {
            const key = `${item.productId}_${item.size}`;
            const localItem = localCartMap[key];
            
            return {
              id: item.productId,
              name: item.name || localItem?.name || 'Product',
              price: item.price || 0,
              size: item.size || '',
              color: item.color || 'Default',
              quantity: item.quantity || 1,
              image: item.image || localItem?.image || ''
            };
          });
          
          setCartItems(localCartItems);
          localStorage.setItem('cart', JSON.stringify(localCartItems));
        }
      } catch (error) {
        console.error('Failed to load cart from backend:', error);
        // Keep existing localStorage cart if backend fails
      } finally {
        setIsLoadingCart(false);
      }
    };

    loadCartFromBackend();
  }, [isAuthenticated]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync cart to backend whenever items change (if user is authenticated)
  const syncCartToBackend = useCallback(async (items = cartItems) => {
    if (!isAuthenticated || items.length === 0) return;

    try {
      // Clear backend cart first
      await api.delete('/cart').catch(() => {
        // Ignore error if cart is empty
      });

      // Add all items to backend cart
      for (const item of items) {
        await api.post('/cart/add', {
          productId: item.id,
          quantity: item.quantity,
          size: item.size || '',
          color: item.color || 'Default',
          price: item.price,
          name: item.name,
          image: item.image
        }).catch(err => {
          console.error('Failed to sync cart item to backend:', err);
        });
      }
    } catch (error) {
      console.error('Failed to sync cart to backend:', error);
    }
  }, [isAuthenticated, cartItems]);

  const addToCart = (product, size, quantity = 1, color = null) => {
    setCartItems(prevItems => {
      // Check if item with same size and color already exists
      const existingItem = prevItems.find(
        item => item.id === product.id && item.size === size && item.color === (color || product.colors?.[0]?.name)
      );

      let newItems;
      if (existingItem) {
        // Update quantity if item exists
        newItems = prevItems.map(item =>
          item.id === product.id && item.size === size && item.color === (color || product.colors?.[0]?.name)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item to cart
        newItems = [
          ...prevItems,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            size: size,
            color: color || (product.colors?.[0]?.name || 'Default'),
            quantity: quantity,
            image: product.images?.[0] || product.image
          }
        ];
      }

      // Sync to backend if authenticated
      if (isAuthenticated) {
        syncCartToBackend(newItems);
      }

      return newItems;
    });
  };

  const removeFromCart = (id, size = '') => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => !(item.id === id && item.size === size));
      
      // Sync to backend if authenticated
      if (isAuthenticated) {
        syncCartToBackend(newItems);
      }

      return newItems;
    });
  };

  const updateQuantity = (id, quantity, size = '') => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }
    setCartItems(prevItems => {
      const newItems = prevItems.map(item =>
        item.id === id && item.size === size ? { ...item, quantity } : item
      );

      // Sync to backend if authenticated
      if (isAuthenticated) {
        syncCartToBackend(newItems);
      }

      return newItems;
    });
  };

  const clearCart = async () => {
    setCartItems([]);
    
    // Clear backend cart if authenticated
    if (isAuthenticated) {
      try {
        await api.delete('/cart');
      } catch (error) {
        console.error('Failed to clear cart on backend:', error);
      }
    }
  };

  const getCartCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const isItemInCart = (productId, size) => {
    return cartItems.some(item => item.id === productId && item.size === size);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    getCartTotal,
    isItemInCart,
    isLoadingCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
