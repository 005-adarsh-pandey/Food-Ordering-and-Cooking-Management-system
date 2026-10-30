import { User, MenuItem, Order, CartItem } from './types';

// Storage keys
const STORAGE_KEYS = {
  USER: 'restaurant_user',
  MENU_ITEMS: 'restaurant_menu_items',
  ORDERS: 'restaurant_orders',
  CART: 'restaurant_cart',
  USERS: 'restaurant_users',
};

const isSessionStorageAvailable = () => {
  if (typeof window === 'undefined') return false;
  try {
    const testKey = '__test_session__';
    window.sessionStorage.setItem(testKey, testKey);
    window.sessionStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

const isLocalStorageAvailable = () => {
  if (typeof window === 'undefined') return false;
  try {
    const testKey = '__test_local__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

// User management (per-tab isolation via sessionStorage, with optional localStorage fallback)
export const getUser = (): User | null => {
  // Check sessionStorage first to isolate tabs
  if (isSessionStorageAvailable()) {
    const sessionUser = window.sessionStorage.getItem(STORAGE_KEYS.USER);
    if (sessionUser) {
      try {
        return JSON.parse(sessionUser);
      } catch (e) {
        // Continue to fallback
      }
    }
  }

  // Fallback to localStorage
  if (isLocalStorageAvailable()) {
    const localUser = window.localStorage.getItem(STORAGE_KEYS.USER);
    if (localUser) {
      try {
        return JSON.parse(localUser);
      } catch (e) {
        return null;
      }
    }
  }

  return null;
};

export const setUser = (user: User, rememberMe: boolean = false): void => {
  // Always save to sessionStorage so this tab has this specific role
  if (isSessionStorageAvailable()) {
    window.sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  // Only persist to localStorage across tabs/restarts if rememberMe was requested
  if (rememberMe && isLocalStorageAvailable()) {
    window.localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }
};

export const removeUser = (): void => {
  if (isSessionStorageAvailable()) {
    window.sessionStorage.removeItem(STORAGE_KEYS.USER);
  }
  if (isLocalStorageAvailable()) {
    window.localStorage.removeItem(STORAGE_KEYS.USER);
  }
};

// Menu items management
export const getMenuItems = (): MenuItem[] => {
  if (!isLocalStorageAvailable()) return [];
  const items = window.localStorage.getItem(STORAGE_KEYS.MENU_ITEMS);
  return items ? JSON.parse(items) : [];
};

export const setMenuItems = (items: MenuItem[]): void => {
  if (!isLocalStorageAvailable()) return;
  window.localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(items));
};

// Orders management
export const getOrders = (): Order[] => {
  if (!isLocalStorageAvailable()) return [];
  const orders = window.localStorage.getItem(STORAGE_KEYS.ORDERS);
  return orders ? JSON.parse(orders) : [];
};

export const setOrders = (orders: Order[]): void => {
  if (!isLocalStorageAvailable()) return;
  window.localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
};

// Cart management (isolated per session so different user roles have their own cart)
export const getCart = (): CartItem[] => {
  if (isSessionStorageAvailable()) {
    const cart = window.sessionStorage.getItem(STORAGE_KEYS.CART);
    if (cart) {
      try {
        return JSON.parse(cart);
      } catch (e) {
        // Fallback
      }
    }
  }
  if (!isLocalStorageAvailable()) return [];
  const cart = window.localStorage.getItem(STORAGE_KEYS.CART);
  return cart ? JSON.parse(cart) : [];
};

export const setCart = (items: CartItem[]): void => {
  if (isSessionStorageAvailable()) {
    window.sessionStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
  }
};

export const clearCart = (): void => {
  if (isSessionStorageAvailable()) {
    window.sessionStorage.removeItem(STORAGE_KEYS.CART);
  }
  if (isLocalStorageAvailable()) {
    window.localStorage.removeItem(STORAGE_KEYS.CART);
  }
};

// Users management
export const getUsers = (): User[] => {
  if (!isLocalStorageAvailable()) return [];
  const users = window.localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

export const setUsers = (users: User[]): void => {
  if (!isLocalStorageAvailable()) return;
  window.localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};