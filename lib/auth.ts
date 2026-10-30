import { User } from './types';
import { getUsers, setUsers, setUser, getUser, removeUser } from './localStorage';
import { generateId, getCurrentDateTime } from './utils';

// Initialize default users if none exist in localStorage
export function initializeUsers(): void {
  const users = getUsers();
  
  if (users.length === 0) {
    const defaultUsers: User[] = [
      {
        id: 'user-admin-1',
        name: 'Admin User',
        username: 'admin',
        email: 'admin@restaurant.com',
        role: 'admin',
        createdAt: getCurrentDateTime(),
      },
      {
        id: 'user-chef-1',
        name: 'Chef User',
        username: 'chef',
        email: 'chef@restaurant.com',
        role: 'chef',
        createdAt: getCurrentDateTime(),
      },
      {
        id: 'user-customer-1',
        name: 'Customer User',
        username: 'newuser',
        email: 'customer@restaurant.com',
        role: 'customer',
        createdAt: getCurrentDateTime(),
      },
    ];
    
    setUsers(defaultUsers);
  }
}

// Log in a user (tries server API first, falls back to local storage)
export async function login(
  username: string,
  password: string,
  rememberMe: boolean = false
): Promise<{ success: boolean; message: string; user?: User }> {
  try {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok && data.success && data.user) {
      setUser(data.user, rememberMe);
      return { success: true, user: data.user, message: data.message || 'Login successful' };
    }
  } catch (error) {
    console.warn('API login request failed, trying local fallback:', error);
  }

  // Fallback to local logic
  const cleanUsername = username.trim().toLowerCase();

  // Test credentials support
  if (
    cleanUsername === 'admin' &&
    (password === '2025DEVChallenge' || password === 'admin' || password === 'admin123')
  ) {
    const users = getUsers();
    const adminUser = users.find((u) => u.username.toLowerCase() === 'admin') || {
      id: 'user-admin-1',
      name: 'Admin User',
      username: 'admin',
      email: 'admin@restaurant.com',
      role: 'admin' as const,
      createdAt: getCurrentDateTime(),
    };
    setUser(adminUser, rememberMe);
    return { success: true, user: adminUser, message: 'Login successful' };
  }

  if (
    cleanUsername === 'chef' &&
    (password === '2025DEVChallenge' || password === 'chef' || password === 'chef123')
  ) {
    const users = getUsers();
    const chefUser = users.find((u) => u.username.toLowerCase() === 'chef') || {
      id: 'user-chef-1',
      name: 'Chef User',
      username: 'chef',
      email: 'chef@restaurant.com',
      role: 'chef' as const,
      createdAt: getCurrentDateTime(),
    };
    setUser(chefUser, rememberMe);
    return { success: true, user: chefUser, message: 'Login successful' };
  }

  if (
    cleanUsername === 'newuser' &&
    (password === '2025DEVChallenge' || password === 'newuser' || password === 'user123')
  ) {
    const users = getUsers();
    const customerUser = users.find((u) => u.username.toLowerCase() === 'newuser') || {
      id: 'user-customer-1',
      name: 'Customer User',
      username: 'newuser',
      email: 'customer@restaurant.com',
      role: 'customer' as const,
      createdAt: getCurrentDateTime(),
    };
    setUser(customerUser, rememberMe);
    return { success: true, user: customerUser, message: 'Login successful' };
  }

  // Check registered users
  const users = getUsers();
  const user = users.find((u) => u.username.toLowerCase() === cleanUsername);

  if (user) {
    setUser(user, rememberMe);
    return { success: true, user, message: 'Login successful' };
  }

  return { success: false, message: 'Invalid username or password' };
}

// Register a new user
export async function register(
  userData: Omit<User, 'id' | 'createdAt' | 'role'> & { password: string }
): Promise<{ success: boolean; message: string; user?: User }> {
  try {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await res.json();
    if (res.ok && data.success && data.user) {
      setUser(data.user);
      return { success: true, user: data.user, message: 'Registration successful' };
    } else if (data.message) {
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.warn('API register request failed, using local fallback:', error);
  }

  // Fallback to local
  const { username, email } = userData;
  const users = getUsers();

  if (users.some((u) => u.username === username)) {
    return { success: false, message: 'Username already taken' };
  }

  if (users.some((u) => u.email === email)) {
    return { success: false, message: 'Email already registered' };
  }

  const newUser: User = {
    id: generateId(),
    name: userData.name,
    username: userData.username,
    email: userData.email,
    role: 'customer',
    createdAt: getCurrentDateTime(),
  };

  users.push(newUser);
  setUsers(users);
  setUser(newUser);

  return { success: true, user: newUser, message: 'Registration successful' };
}

// Logout
export function logout(): void {
  removeUser();
}

// Get current authenticated user
export function getCurrentUser(): User | null {
  return getUser();
}