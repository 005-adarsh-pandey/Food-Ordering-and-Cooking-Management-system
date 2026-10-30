import fs from 'fs/promises';
import path from 'path';
import { User, MenuItem, Order } from './types';

export interface UserRecord extends User {
  password?: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const MENU_FILE = path.join(DATA_DIR, 'menu.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Ignore error if directory already exists
  }
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  await ensureDataDir();
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (error) {
    await fs.writeFile(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
    return fallback;
  }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

const DEFAULT_USERS: UserRecord[] = [
  {
    id: 'user-admin-1',
    name: 'Admin User',
    username: 'admin',
    email: 'admin@restaurant.com',
    role: 'admin',
    createdAt: new Date().toISOString(),
    password: '2025DEVChallenge',
  },
  {
    id: 'user-chef-1',
    name: 'Chef User',
    username: 'chef',
    email: 'chef@restaurant.com',
    role: 'chef',
    createdAt: new Date().toISOString(),
    password: '2025DEVChallenge',
  },
  {
    id: 'user-customer-1',
    name: 'Customer User',
    username: 'newuser',
    email: 'customer@restaurant.com',
    role: 'customer',
    createdAt: new Date().toISOString(),
    password: '2025DEVChallenge',
  },
];

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    id: 'menu-1',
    name: 'Classic Burger',
    description: 'Juicy beef patty with lettuce, tomato, onion, and special sauce',
    price: 1080,
    category: 'Main Dishes',
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'menu-2',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce with parmesan, croutons and Caesar dressing',
    price: 830,
    category: 'Starters',
    image: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'menu-3',
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, fresh mozzarella, and basil',
    price: 1240,
    category: 'Main Dishes',
    image: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'menu-4',
    name: 'Chocolate Brownie',
    description: 'Warm chocolate brownie served with vanilla ice cream',
    price: 660,
    category: 'Desserts',
    image: 'https://images.pexels.com/photos/45202/brownie-dessert-cake-sweet-45202.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'menu-5',
    name: 'Grilled Salmon',
    description: 'Fresh salmon fillet with lemon herb butter',
    price: 1580,
    category: 'Main Dishes',
    image: 'https://images.pexels.com/photos/3763847/pexels-photo-3763847.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'menu-6',
    name: 'French Fries',
    description: 'Crispy golden fries with sea salt',
    price: 415,
    category: 'Sides',
    image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'menu-7',
    name: 'Cheesecake',
    description: 'Creamy New York style cheesecake',
    price: 580,
    category: 'Desserts',
    image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'menu-8',
    name: 'Chicken Wings',
    description: 'Spicy buffalo wings with blue cheese dip',
    price: 995,
    category: 'Starters',
    image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'menu-9',
    name: 'Butter Chicken',
    description: 'Tender chicken simmered in a rich, gently spiced tomato and butter gravy',
    price: 420,
    category: 'Indian Dishes',
    image: 'https://images.pexels.com/photos/9609844/pexels-photo-9609844.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'menu-10',
    name: 'Paneer Tikka',
    description: 'Char-grilled cubes of marinated paneer with peppers and onion',
    price: 320,
    category: 'Indian Dishes',
    image: 'https://images.pexels.com/photos/9609842/pexels-photo-9609842.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'menu-11',
    name: 'Masala Dosa',
    description: 'Crisp rice-and-lentil crepe filled with spiced potato, served with chutney',
    price: 220,
    category: 'Indian Dishes',
    image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'menu-12',
    name: 'Gulab Jamun',
    description: 'Soft milk-solid dumplings soaked in fragrant cardamom and saffron syrup',
    price: 180,
    category: 'Indian Desserts',
    image: 'https://images.pexels.com/photos/7449105/pexels-photo-7449105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_ORDERS: Order[] = [
  {
    id: 'order-sample-1',
    userId: 'user-customer-1',
    customerName: 'John Smith',
    items: [
      {
        id: 'item-1',
        menuItemId: 'menu-1',
        name: 'Classic Burger',
        price: 1080,
        quantity: 2,
      },
      {
        id: 'item-2',
        menuItemId: 'menu-6',
        name: 'French Fries',
        price: 415,
        quantity: 1,
      },
    ],
    status: 'preparing',
    totalAmount: 2575,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
  {
    id: 'order-sample-2',
    userId: 'user-customer-1',
    customerName: 'Sarah Johnson',
    items: [
      {
        id: 'item-3',
        menuItemId: 'menu-3',
        name: 'Margherita Pizza',
        price: 1240,
        quantity: 1,
      },
    ],
    status: 'pending',
    totalAmount: 1240,
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
];

export async function getServerUsers(): Promise<UserRecord[]> {
  const users = await readJsonFile<UserRecord[]>(USERS_FILE, DEFAULT_USERS);
  if (users.length === 0) {
    await writeJsonFile(USERS_FILE, DEFAULT_USERS);
    return DEFAULT_USERS;
  }
  return users;
}

export async function saveServerUsers(users: UserRecord[]): Promise<void> {
  await writeJsonFile(USERS_FILE, users);
}

export async function getServerMenuItems(): Promise<MenuItem[]> {
  const items = await readJsonFile<MenuItem[]>(MENU_FILE, DEFAULT_MENU_ITEMS);
  if (items.length === 0) {
    await writeJsonFile(MENU_FILE, DEFAULT_MENU_ITEMS);
    return DEFAULT_MENU_ITEMS;
  }
  return items;
}

export async function saveServerMenuItems(items: MenuItem[]): Promise<void> {
  await writeJsonFile(MENU_FILE, items);
}

export async function getServerOrders(): Promise<Order[]> {
  const orders = await readJsonFile<Order[]>(ORDERS_FILE, DEFAULT_ORDERS);
  return orders;
}

export async function saveServerOrders(orders: Order[]): Promise<void> {
  await writeJsonFile(ORDERS_FILE, orders);
}
