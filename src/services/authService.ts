import { User, Credentials, Tokens } from '../types/auth';

import users from '../constants/mockup-users.json';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { deleteSecure, getSecure, saveSecure } from '@/utils/secure-store';

interface UserMocked extends User {
  password: string
}

const mockUsers: UserMocked[] = users.map(u => ({
  ...u,
  birthday_date: u.birthday_date ? new Date(u.birthday_date) : new Date(),
  password: (u as any).password // burlando a tipagem
}));

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loginApi(credentials: Credentials): Promise<Tokens> {
  const response: AxiosResponse<Tokens> = await axios.post('/auth/login', credentials)

  return response.data

}

export async function logoutApi(): Promise<void> {
  deleteSecure('accessToken')
  deleteSecure('refreshToken')
  return;
}

export async function getStoredUser(): Promise<User | null> {
  try {
    const response: AxiosResponse<User> = await axios.get('/users/me')
    console.log("res", response.data)
    return response.data
  } catch (err) {
    console.log("erro", err)
    logoutApi()
  }

  console.log('token', getSecure('accessToken'))
  return null;
}