import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<User>;
  signup: (firstName: string, lastName: string, email: string, pass: string) => Promise<User>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Mock user database
const MOCK_USERS: { [email: string]: Omit<User, 'id'> & { passwordHash: string } } = {
  "sudha@smartificia.com": {
    firstName: "Sudha",
    lastName: "V",
    email: "sudha@smartificia.com",
    passwordHash: "password123",
  }
};

// Type guard to ensure the object from localStorage is a valid User
function isValidUser(obj: any): obj is User {
    return obj &&
           typeof obj.id === 'string' &&
           typeof obj.firstName === 'string' &&
           typeof obj.lastName === 'string' &&
           typeof obj.email === 'string';
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for a user session on initial load
    try {
      const storedUser = localStorage.getItem('smarticard_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // Validate the parsed object before setting it as the user.
        if (isValidUser(parsedUser)) {
          setUser(parsedUser);
        } else {
          // If data is invalid, clear it to prevent errors.
          console.warn("Invalid user data in localStorage. Clearing session.");
          localStorage.removeItem('smarticard_user');
        }
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
       // If parsing fails, clear the invalid item.
      localStorage.removeItem('smarticard_user');
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, pass: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const dbUser = MOCK_USERS[email.toLowerCase()];
        if (dbUser && dbUser.passwordHash === pass) {
          const loggedInUser: User = {
             id: `user_${new Date().getTime()}`,
             ...dbUser,
          }
          localStorage.setItem('smarticard_user', JSON.stringify(loggedInUser));
          setUser(loggedInUser);
          resolve(loggedInUser);
        } else {
          reject(new Error("Invalid email or password."));
        }
      }, 1000);
    });
  };

  const signup = (firstName: string, lastName: string, email: string, pass: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const lowerEmail = email.toLowerCase();
        if (MOCK_USERS[lowerEmail]) {
            return reject(new Error("An account with this email already exists."));
        }

        const newUser: User = {
            id: `user_${new Date().getTime()}`,
            firstName,
            lastName,
            email: lowerEmail,
        };

        MOCK_USERS[lowerEmail] = { ...newUser, passwordHash: pass };
        
        localStorage.setItem('smarticard_user', JSON.stringify(newUser));
        setUser(newUser);
        resolve(newUser);
      }, 1000);
    });
  };
  
  const forgotPassword = (email: string): Promise<void> => {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
            // In a real app, this would trigger a password reset email.
            // Here, we just check if the user exists.
            if(MOCK_USERS[email.toLowerCase()]) {
                console.log(`Password reset link sent to ${email}`);
                resolve();
            } else {
                reject(new Error("No user found with this email address."));
            }
          }, 1000);
      });
  };

  const logout = () => {
    localStorage.removeItem('smarticard_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
};