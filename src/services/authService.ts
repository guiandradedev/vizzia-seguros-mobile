import { User, Credentials } from '../types/auth';

import users from '../constants/mockup-users.json';

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

export async function loginApi(credentials: Credentials): Promise<User> {
  await delay(400);

  const found = mockUsers.find((u) => String(u.email).toLowerCase() === String(credentials.email).toLowerCase());

  if (!found) {
    throw new Error('Usuário não encontrado');
  }

  const expectedPassword = typeof found.password === 'string' ? found.password : 'password';

  if (credentials.password !== expectedPassword) {
    throw new Error('Credenciais inválidas');
  }

  if (found.status === false) {
    throw new Error('Usuário inativo');
  }

  // Convert birthday_date to Date if it's a string
  const birthday = found.birthday_date ? new Date(found.birthday_date) : new Date();

  const user: User = {
    id: Number(found.id),
    name: String(found.name || ''),
    email: String(found.email || ''),
    cpf: String(found.cpf || ''),
    cnh: String(found.cnh || ''),
    expedition_cnh_date: Number(found.expedition_cnh_date) || 0,
    phone_id: String(found.phone_id || ''),
    birthday_date: birthday,
    status: Boolean(found.status),
  };

  return user;
}

export async function logoutApi(): Promise<void> {
  await delay(100);
  return;
}

export async function getStoredUser(): Promise<User | null> {
  return null;
}