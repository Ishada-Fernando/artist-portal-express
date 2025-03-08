
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
        {
          id: 'artist1',
          username: 'FridaKarlo',
          email: 'fridakarlo@artgallery.com',
          role: 'artist',
          name: 'Frida Karlo',
          bio: 'Mexican artist known for her many portraits, self-portraits, and works inspired by nature and artifacts of Mexico.',
        },
        {
          id: 'artist2',
          username: 'PabloPicasso',
          email: 'pablopicasso@artgallery.com',
          role: 'artist',
          name: 'Pablo Picasso',
          bio: 'Spanish painter, sculptor, printmaker, ceramicist and theatre designer who spent most of his adult life in France.',
        },
        {
          id: 'artist3',
          username: 'JacksonPollock',
          email: 'jacksonpollock@artgallery.com',
          role: 'artist',
          name: 'Jackson Pollock',
          bio: 'American painter and a major figure in the abstract expressionist movement.',
        },
        {
          id: 'artist4',
          username: 'AndyWarhol',
          email: 'andywarhol@artgallery.com',
          role: 'artist',
          name: 'Andy Warhol',
          bio: 'American artist, film director, and producer who was a leading figure in the visual art movement known as pop art.',
        },
        {
          id: 'artist5',
          username: 'SalvadorDali',
          email: 'salvadordali@artgallery.com',
          role: 'artist',
          name: 'Salvador Dali',
          bio: 'Spanish surrealist artist renowned for his technical skill, precise draftsmanship, and the striking and bizarre images in his work.',
        },
        {
          id: 'artist6',
          username: 'VincentVanGogh',
          email: 'vincentvangogh@artgallery.com',
          role: 'artist',
          name: 'Vincent van Gogh',
          bio: 'Dutch post-impressionist painter who posthumously became one of the most famous and influential figures in Western art history.',
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
        
        // For artist accounts - the password is Password123 for all artists
        if (password === 'Password123') {
          // Check if username or email matches
          const user = get().users.find(
            user => user.username === username || user.email === username
          );
          
          if (user) {
            set({ user, isLoggedIn: true });
            return { success: true, message: 'Login successful!' };
          }
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
