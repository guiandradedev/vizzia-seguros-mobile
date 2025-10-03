import { User, Credentials } from '../types/auth';

// Simulated login API
export async function loginApi(credentials: Credentials): Promise<User> {
  // Replace with real API call
  if (credentials.username === 'admin' && credentials.password === 'admin') {
    return { id: 1, username: 'admin', name: 'Admin User', email: "dasdas@dasda.com" };
  }
  throw new Error('Invalid credentials');
}

// Simulated logout API
export async function logoutApi(): Promise<void> {
  // Replace with real API call or token removal
  return;
}

// Simulated getStoredUser function
export async function getStoredUser(): Promise<User | null> {
  // Replace with real storage retrieval
  // return {id: 1, name: "adas", username: "dasd"};
  return null;
}