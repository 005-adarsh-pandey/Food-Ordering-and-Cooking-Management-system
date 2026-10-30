'use client';

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { MenuItem } from '@/lib/types';
import { getMenuItems, setMenuItems } from '@/lib/localStorage';
import { generateId, getCurrentDateTime } from '@/lib/utils';
import { initializeMenuItems } from '@/lib/data-init';

interface MenuContextType {
  menuItems: MenuItem[];
  categories: string[];
  addMenuItem: (item: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  getMenuItemById: (id: string) => MenuItem | undefined;
  getMenuItemsByCategory: (category: string) => MenuItem[];
  refreshMenuItems: () => Promise<void>;
}

const MenuContext = createContext<MenuContextType>({
  menuItems: [],
  categories: [],
  addMenuItem: async () => {},
  updateMenuItem: async () => {},
  deleteMenuItem: async () => {},
  getMenuItemById: () => undefined,
  getMenuItemsByCategory: () => [],
  refreshMenuItems: async () => {},
});

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItemsState] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const updateCategoriesFromItems = (items: MenuItem[]) => {
    const uniqueCategories = Array.from(new Set(items.map((item) => item.category)));
    setCategories(uniqueCategories);
  };

  const fetchMenuItems = useCallback(async () => {
    try {
      const res = await fetch('/api/menu');
      if (res.ok) {
        const data: MenuItem[] = await res.json();
        setMenuItemsState(data);
        setMenuItems(data);
        updateCategoriesFromItems(data);
        return;
      }
    } catch (e) {
      // Fallback
    }

    const items = getMenuItems();
    if (items.length > 0) {
      setMenuItemsState(items);
      updateCategoriesFromItems(items);
    }
  }, []);

  useEffect(() => {
    initializeMenuItems();
    const items = getMenuItems();
    if (items.length > 0) {
      setMenuItemsState(items);
      updateCategoriesFromItems(items);
    }

    fetchMenuItems();
  }, [fetchMenuItems]);

  const addMenuItem = async (itemData: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: MenuItem = {
      ...itemData,
      id: generateId(),
      createdAt: getCurrentDateTime(),
      updatedAt: getCurrentDateTime(),
    };

    const updatedItems = [...menuItems, newItem];
    setMenuItemsState(updatedItems);
    setMenuItems(updatedItems);
    updateCategoriesFromItems(updatedItems);

    try {
      await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
    } catch (e) {
      console.warn('Failed to sync new menu item with server:', e);
    }
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    const updatedItems = menuItems.map((item) =>
      item.id === id ? { ...item, ...updates, updatedAt: getCurrentDateTime() } : item
    );

    setMenuItemsState(updatedItems);
    setMenuItems(updatedItems);
    updateCategoriesFromItems(updatedItems);

    try {
      await fetch('/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
    } catch (e) {
      console.warn('Failed to sync updated menu item with server:', e);
    }
  };

  const deleteMenuItem = async (id: string) => {
    const updatedItems = menuItems.filter((item) => item.id !== id);
    setMenuItemsState(updatedItems);
    setMenuItems(updatedItems);
    updateCategoriesFromItems(updatedItems);

    try {
      await fetch(`/api/menu?id=${id}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn('Failed to delete menu item on server:', e);
    }
  };

  const getMenuItemById = (id: string) => {
    return menuItems.find((item) => item.id === id);
  };

  const getMenuItemsByCategory = (category: string) => {
    return menuItems.filter((item) => item.category === category);
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        categories,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        getMenuItemById,
        getMenuItemsByCategory,
        refreshMenuItems: fetchMenuItems,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => useContext(MenuContext);