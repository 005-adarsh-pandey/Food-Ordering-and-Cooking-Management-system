import { MenuItem, Order } from './types';
import { getMenuItems, setMenuItems, getOrders, setOrders } from './localStorage';
import { generateId, getCurrentDateTime } from './utils';

// Initialize menu items if none exist
export function initializeMenuItems(): void {
  const menuItems = getMenuItems();
  
  if (menuItems.length === 0) {
    const defaultMenuItems: MenuItem[] = [
      {
        id: generateId(),
        name: 'Classic Burger',
        description: 'Juicy beef patty with lettuce, tomato, onion, and special sauce',
        price: 1080,
        category: 'Main Dishes',
        image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        available: true,
        createdAt: getCurrentDateTime(),
        updatedAt: getCurrentDateTime(),
      },
      {
        id: generateId(),
        name: 'Caesar Salad',
        description: 'Crisp romaine lettuce with parmesan, croutons and Caesar dressing',
        price: 830,
        category: 'Starters',
        image: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        available: true,
        createdAt: getCurrentDateTime(),
        updatedAt: getCurrentDateTime(),
      },
      {
        id: generateId(),
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, fresh mozzarella, and basil',
        price: 1240,
        category: 'Main Dishes',
        image: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        available: true,
        createdAt: getCurrentDateTime(),
        updatedAt: getCurrentDateTime(),
      },
      {
        id: generateId(),
        name: 'Chocolate Brownie',
        description: 'Warm chocolate brownie served with vanilla ice cream',
        price: 660,
        category: 'Desserts',
        image: 'https://images.pexels.com/photos/45202/brownie-dessert-cake-sweet-45202.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        available: true,
        createdAt: getCurrentDateTime(),
        updatedAt: getCurrentDateTime(),
      },
      {
        id: generateId(),
        name: 'Grilled Salmon',
        description: 'Fresh salmon fillet with lemon herb butter',
        price: 1580,
        category: 'Main Dishes',
        image: 'https://images.pexels.com/photos/3763847/pexels-photo-3763847.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        available: true,
        createdAt: getCurrentDateTime(),
        updatedAt: getCurrentDateTime(),
      },
      {
        id: generateId(),
        name: 'French Fries',
        description: 'Crispy golden fries with sea salt',
        price: 415,
        category: 'Sides',
        image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        available: true,
        createdAt: getCurrentDateTime(),
        updatedAt: getCurrentDateTime(),
      },
      {
        id: generateId(),
        name: 'Cheesecake',
        description: 'Creamy New York style cheesecake',
        price: 580,
        category: 'Desserts',
        image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        available: true,
        createdAt: getCurrentDateTime(),
        updatedAt: getCurrentDateTime(),
      },
      {
        id: generateId(),
        name: 'Chicken Wings',
        description: 'Spicy buffalo wings with blue cheese dip',
        price: 995,
        category: 'Starters',
        image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        available: true,
        createdAt: getCurrentDateTime(),
        updatedAt: getCurrentDateTime(),
      },
      {
        id: generateId(),
        name: 'Butter Chicken',
        description: 'Tender chicken simmered in a rich, gently spiced tomato and butter gravy',
        price: 420,
        category: 'Indian Dishes',
        image: 'https://images.pexels.com/photos/9609844/pexels-photo-9609844.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        available: true,
        createdAt: getCurrentDateTime(),
        updatedAt: getCurrentDateTime(),
      },
      {
        id: generateId(),
        name: 'Paneer Tikka',
        description: 'Char-grilled cubes of marinated paneer with peppers and onion',
        price: 320,
        category: 'Indian Dishes',
        image: 'https://images.pexels.com/photos/9609842/pexels-photo-9609842.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        available: true,
        createdAt: getCurrentDateTime(),
        updatedAt: getCurrentDateTime(),
      },
      {
        id: generateId(),
        name: 'Masala Dosa',
        description: 'Crisp rice-and-lentil crepe filled with spiced potato, served with chutney',
        price: 220,
        category: 'Indian Dishes',
        image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        available: true,
        createdAt: getCurrentDateTime(),
        updatedAt: getCurrentDateTime(),
      },
      {
        id: generateId(),
        name: 'Gulab Jamun',
        description: 'Soft milk-solid dumplings soaked in fragrant cardamom and saffron syrup',
        price: 180,
        category: 'Indian Desserts',
        image: 'https://images.pexels.com/photos/7449105/pexels-photo-7449105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        available: true,
        createdAt: getCurrentDateTime(),
        updatedAt: getCurrentDateTime(),
      },
    ];
    
    setMenuItems(defaultMenuItems);
  }
}

// Initialize sample orders if none exist
export function initializeSampleOrders(): void {
  const orders = getOrders();
  
  if (orders.length === 0) {
    const menuItems = getMenuItems();
    
    if (menuItems.length === 0) {
      return; // Can't create orders without menu items
    }
    
    const sampleOrders: Order[] = [
      {
        id: generateId(),
        userId: 'sample-customer',
        customerName: 'John Smith',
        items: [
          {
            id: generateId(),
            menuItemId: menuItems[0].id,
            name: menuItems[0].name,
            price: menuItems[0].price,
            quantity: 2,
          },
          {
            id: generateId(),
            menuItemId: menuItems[5].id,
            name: menuItems[5].name,
            price: menuItems[5].price,
            quantity: 1,
          },
        ],
        status: 'preparing',
        totalAmount: menuItems[0].price * 2 + menuItems[5].price,
        createdAt: getCurrentDateTime(),
        updatedAt: getCurrentDateTime(),
      },
      {
        id: generateId(),
        userId: 'sample-customer',
        customerName: 'Sarah Johnson',
        items: [
          {
            id: generateId(),
            menuItemId: menuItems[2].id,
            name: menuItems[2].name,
            price: menuItems[2].price,
            quantity: 1,
          },
        ],
        status: 'pending',
        totalAmount: menuItems[2].price,
        createdAt: getCurrentDateTime(),
        updatedAt: getCurrentDateTime(),
      },
    ];
    
    setOrders(sampleOrders);
  }
}

// Initialize all data
export function initializeAllData(): void {
  initializeMenuItems();
  initializeSampleOrders();
}