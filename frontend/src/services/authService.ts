import apiClient from './apiClient';
import { User } from '../types';
import safeStorage from './storage';

export const authService = {
  getCurrentUser: async (): Promise<User> => {
    const userStr = safeStorage.getItem('civio_current_user');
    if (!userStr) {
      throw new Error('No user session found');
    }
    return JSON.parse(userStr);
  },

  signUp: async (signUpData: { name: string; username: string; email: string; area: string; password?: string }): Promise<User> => {
    // 1. Call backend registration endpoint
    await apiClient.post('/auth/register', {
      name: signUpData.name,
      email: signUpData.email,
      password: signUpData.password || 'password123',
      area: signUpData.area
    });

    // 2. Call backend login endpoint to obtain JWT token
    const loginRes = await apiClient.post('/auth/login', {
      email: signUpData.email,
      password: signUpData.password || 'password123'
    });

    const { token, user: backendUser } = loginRes.data;

    // Generate a random avatar from seed
    const seed = Math.floor(Math.random() * 1000);
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;

    const loggedInUser: User = {
      id: backendUser._id,
      name: backendUser.name,
      username: signUpData.username,
      email: backendUser.email,
      area: signUpData.area,
      avatar,
      verified: false,
      issuesReported: backendUser.issuesReported || 0,
      issuesSupported: backendUser.issuesSupported || 0,
      impactScore: backendUser.impactScore || 0,
      role: backendUser.role
    };

    // Save token and user details to storage
    safeStorage.setItem('civio_token', token);
    safeStorage.setItem('civio_current_user', JSON.stringify(loggedInUser));

    return loggedInUser;
  },

  login: async (loginData: { email: string; password?: string }): Promise<User> => {
    const loginRes = await apiClient.post('/auth/login', {
      email: loginData.email,
      password: loginData.password || 'password123'
    });

    const { token, user: backendUser } = loginRes.data;

    const loggedInUser: User = {
      id: backendUser._id,
      name: backendUser.name,
      username: backendUser.email.split('@')[0],
      email: backendUser.email,
      area: backendUser.area || 'Nagpur, Maharashtra',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${backendUser.name}`,
      verified: false,
      issuesReported: backendUser.issuesReported || 0,
      issuesSupported: backendUser.issuesSupported || 0,
      impactScore: backendUser.impactScore || 0,
      role: backendUser.role
    };

    safeStorage.setItem('civio_token', token);
    safeStorage.setItem('civio_current_user', JSON.stringify(loggedInUser));

    return loggedInUser;
  },

  updateProfile: async (fields: Partial<User>): Promise<User> => {
    const currentUserStr = safeStorage.getItem('civio_current_user');
    if (!currentUserStr) {
      throw new Error('No user session found');
    }
    const currentUser = JSON.parse(currentUserStr);
    const updatedUser = { ...currentUser, ...fields };
    safeStorage.setItem('civio_current_user', JSON.stringify(updatedUser));
    return updatedUser;
  },

  logout: async (): Promise<void> => {
    safeStorage.removeItem('civio_current_user');
    safeStorage.removeItem('civio_token');
  }
};
