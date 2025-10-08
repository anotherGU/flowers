import React, { createContext, useContext, useReducer } from 'react';

interface Flower {
  image: string;
  title: string;
  price: number;
  id: number;
  discount?: number;
}

interface CartItem extends Flower {
  quantity: number;
}

interface CustomerData {
  name: string;
  surname: string;
  phoneNumber: string;
}

interface CartState {
  cart: CartItem[];
  customerData: CustomerData | null;
  total: number;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: Flower }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CUSTOMER_DATA'; payload: CustomerData }
  | { type: 'CALCULATE_TOTAL' };

const initialState: CartState = {
  cart: [],
  customerData: null,
  total: 0,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, { ...action.payload, quantity: 1 }],
        };
      }

    case 'UPDATE_QUANTITY':
      if (action.payload.quantity < 1) {
        return state;
      }
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload),
      };

    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
        total: 0,
      };

    case 'SET_CUSTOMER_DATA':
      return {
        ...state,
        customerData: action.payload,
      };

    case 'CALCULATE_TOTAL':
      const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return {
        ...state,
        total,
      };

    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addToCart: (flower: Flower) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  setCustomerData: (data: CustomerData) => void;
  calculateTotal: () => void;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (flower: Flower) => {
    dispatch({ type: 'ADD_TO_CART', payload: flower });
    dispatch({ type: 'CALCULATE_TOTAL' });
  };

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    dispatch({ type: 'CALCULATE_TOTAL' });
  };

  const removeFromCart = (id: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    dispatch({ type: 'CALCULATE_TOTAL' });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const setCustomerData = (data: CustomerData) => {
    dispatch({ type: 'SET_CUSTOMER_DATA', payload: data });
  };

  const calculateTotal = () => {
    dispatch({ type: 'CALCULATE_TOTAL' });
  };

  const getTotalPrice = () => {
    return state.cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        setCustomerData,
        calculateTotal,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};