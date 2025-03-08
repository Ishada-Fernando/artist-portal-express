
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '../types';

// Generate a unique string ID
const generateId = () => Math.random().toString(36).substring(2, 15);

interface AuthState {
  user: User | null;
  users: User[];
  isLoggedIn: boolean;
  login: (username: string, password: string) => { success: boolean; message: string };
  signup: (username: string, email: string, password: string, role: UserRole) => { success: boolean; message: string };
  logout: () => void;
  getUser: (id: string) => User | undefined;
  getUsersByRole: (role: UserRole) => User[];
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: [
        {
          id: 'admin1',
          username: 'Admin',
          email: 'admin@artgallery.com',
          role: 'admin',
          name: 'Admin User',
        },
      ],
      isLoggedIn: false,

      login: (username: string, password: string) => {
        // Special case for admin login
        if (username === 'Admin' && password === 'Password123') {
          const adminUser = get().users.find(user => user.username === 'Admin');
          if (adminUser) {
            set({ user: adminUser, isLoggedIn: true });
            return { success: true, message: 'Admin login successful!' };
          }
        }

        // For other users
        const user = get().users.find(user => user.username === username);
        
        // Simple password validation (in a real app, you'd check hashed passwords)
        // For this demo, we'll accept any password for non-admin users that exist
        if (user && user.role !== 'admin') {
          set({ user, isLoggedIn: true });
          return { success: true, message: 'Login successful!' };
        }

        return { success: false, message: 'Invalid username or password' };
      },

      signup: (username: string, email: string, password: string, role: UserRole) => {
        // Check if username or email already exists
        const userExists = get().users.some(
          user => user.username === username || user.email === email
        );

        if (userExists) {
          return { success: false, message: 'Username or email already exists' };
        }

        // Create new user
        const newUser: User = {
          id: generateId(),
          username,
          email,
          role,
        };

        set(state => ({
          users: [...state.users, newUser],
          user: newUser,
          isLoggedIn: true,
        }));

        return { success: true, message: 'Signup successful!' };
      },

      logout: () => {
        set({ user: null, isLoggedIn: false });
      },

      getUser: (id: string) => {
        return get().users.find(user => user.id === id);
      },

      getUsersByRole: (role: UserRole) => {
        return get().users.filter(user => user.role === role);
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
