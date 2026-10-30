'use client';

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { Order } from '@/lib/types';
import { getOrders, setOrders } from '@/lib/localStorage';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { generateId, getCurrentDateTime } from '@/lib/utils';
import { initializeSampleOrders } from '@/lib/data-init';

interface OrderContextType {
  orders: Order[];
  placeOrder: (customerName: string) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  getUserOrders: () => Order[];
  getOrderById: (id: string) => Order | undefined;
  refreshOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType>({
  orders: [],
  placeOrder: async () => {
    throw new Error('OrderContext not initialized');
  },
  updateOrderStatus: async () => {},
  getUserOrders: () => [],
  getOrderById: () => undefined,
  refreshOrders: async () => {},
});

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrdersState] = useState<Order[]>([]);
  const { user } = useAuth();
  const { items, getTotalPrice, clearCartItems } = useCart();

  const fetchOrdersFromApi = useCallback(async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data: Order[] = await res.json();
        setOrdersState(data);
        setOrders(data);
        return;
      }
    } catch (e) {
      // Ignore network errors during background polling
    }

    // Fallback to local cache
    const saved = getOrders();
    if (saved && saved.length > 0) {
      setOrdersState(saved);
    }
  }, []);

  useEffect(() => {
    initializeSampleOrders();
    const savedOrders = getOrders();
    if (savedOrders.length > 0) {
      setOrdersState(savedOrders);
    }

    // Initial fetch from server storage
    fetchOrdersFromApi();

    // Auto-polling every 3 seconds for real-time demo across tabs and browsers
    const interval = setInterval(() => {
      fetchOrdersFromApi();
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchOrdersFromApi]);

  const placeOrder = async (customerName: string): Promise<Order> => {
    if (items.length === 0) {
      throw new Error('Cannot place an empty order');
    }

    const newOrder: Order = {
      id: generateId(),
      userId: user?.id || 'guest',
      customerName: customerName || user?.name || 'Guest',
      items: [...items],
      status: 'pending',
      totalAmount: getTotalPrice(),
      createdAt: getCurrentDateTime(),
      updatedAt: getCurrentDateTime(),
    };

    // Optimistic update
    const updatedOrders = [newOrder, ...orders];
    setOrdersState(updatedOrders);
    setOrders(updatedOrders);
    clearCartItems();

    // Sync to local server file storage
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
      if (res.ok) {
        const created: Order = await res.json();
        setOrdersState((prev) => prev.map((o) => (o.id === newOrder.id ? created : o)));
        return created;
      }
    } catch (e) {
      console.warn('Failed to post order to /api/orders, saved in local cache:', e);
    }

    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<void> => {
    // Optimistic update
    const updatedOrders = orders.map((order) =>
      order.id === orderId
        ? { ...order, status, updatedAt: getCurrentDateTime() }
        : order
    );
    setOrdersState(updatedOrders);
    setOrders(updatedOrders);

    // Sync to local server file storage
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (e) {
      console.warn(`Failed to update order status on server:`, e);
    }
  };

  const getUserOrders = () => {
    if (!user) return [];
    return orders.filter((order) => order.userId === user.id);
  };

  const getOrderById = (id: string) => {
    return orders.find((order) => order.id === id);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        updateOrderStatus,
        getUserOrders,
        getOrderById,
        refreshOrders: fetchOrdersFromApi,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);