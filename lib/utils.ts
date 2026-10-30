import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { type User, type Order, type MenuItem, DashboardStats } from './types';
import { getMenuItems, getOrders } from './localStorage';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function getCurrentDateTime(): string {
  return new Date().toISOString();
}

// Check if user has permission for a specific action
export function hasPermission(user: User | null, action: string, resource: string): boolean {
  if (!user) return false;

  // Define permissions by role
  const permissions = {
    admin: {
      menu_item: ['create', 'read', 'update', 'delete'],
      order: ['create', 'read', 'update', 'delete'],
      inventory: ['create', 'read', 'update', 'delete'],
      financial_data: ['read'],
      user: ['create', 'read', 'update', 'delete'],
    },
    chef: {
      menu_item: ['read'],
      order: ['read', 'update'],
      inventory: ['read', 'update'],
      financial_data: [],
      user: [],
    },
    customer: {
      menu_item: ['read'],
      order: ['create', 'read'],
      inventory: [],
      financial_data: [],
      user: [],
    },
  };

  // @ts-ignore - We know these properties exist
  return permissions[user.role]?.[resource]?.includes(action) || false;
}

export function getUserOrders(userId: string): Order[] {
  const orders = getOrders();
  return orders.filter((order) => order.userId === userId);
}

export function calculateDashboardStats(currentUser: User | null, customOrders?: Order[]): DashboardStats {
  const orders = customOrders || getOrders();
  const menuItems = getMenuItems();
  
  // Count how many times each menu item appears in orders
  const itemCounts: Record<string, number> = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
    });
  });
  
  // Convert to array and sort by count (descending)
  const popularItems = Object.entries(itemCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // Filter orders if user is a customer
  const userOrders = currentUser?.role === 'customer' 
    ? orders.filter(order => order.userId === currentUser.id)
    : orders;
  
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  const todayOrders = userOrders.filter(order => 
    new Date(order.createdAt) >= todayStart
  );
  
  const totalRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  
  return {
    totalOrders: todayOrders.length,
    totalRevenue,
    pendingOrders: userOrders.filter(order => order.status === 'pending').length,
    preparingOrders: userOrders.filter(order => order.status === 'preparing').length,
    popularItems,
  };
}

export function getMenuItemById(id: string): MenuItem | undefined {
  const menuItems = getMenuItems();
  return menuItems.find(item => item.id === id);
}